"""Low-memory Chatterbox-Turbo inference by loading its model stages sequentially."""
from __future__ import annotations

import argparse
import gc
import os
import re
import ctypes
import math
import random
import subprocess
import sys
from pathlib import Path

import librosa
import torch
import perth
from huggingface_hub import snapshot_download
from safetensors.torch import load_file
from transformers import AutoTokenizer

from chatterbox.models.s3gen import S3GEN_SR, S3Gen
from chatterbox.models.s3gen.const import S3GEN_SIL
from chatterbox.models.s3tokenizer import S3_SR
from chatterbox.models.t3 import T3
from chatterbox.models.t3.modules.cond_enc import T3Cond
from chatterbox.models.t3.modules.t3_config import T3Config
from chatterbox.models.voice_encoder import VoiceEncoder
from chatterbox.tts_turbo import punc_norm


REPO_ID = 'ResembleAI/chatterbox-turbo'
DEVICE = 'cpu'
# The autoregressive text model dominates resident memory.  AVX-512 CPUs can
# run this inference path in bfloat16 while the acoustic decoder remains in
# its original float32 precision.
T3_DTYPE = torch.bfloat16
ENC_COND_LEN = 15 * S3_SR
DEC_COND_LEN = 10 * S3GEN_SR


def checkpoint_dir() -> Path:
    return Path(snapshot_download(
        repo_id=REPO_ID,
        token=os.getenv('HF_TOKEN') or None,
        allow_patterns=['*.safetensors', '*.json', '*.txt', '*.pt', '*.model'],
    ))


def load_s3gen(checkpoints: Path) -> S3Gen:
    s3gen = S3Gen(meanflow=True)
    weights = load_file(checkpoints / 's3gen_meanflow.safetensors')
    s3gen.load_state_dict(weights, strict=True)
    del weights
    return s3gen.to(DEVICE).eval()


def prepare_conditionals(checkpoints: Path, reference: Path) -> tuple[T3Cond, dict]:
    # Stage one owns only the decoder and voice encoder while it extracts reusable prompts.
    s3gen = load_s3gen(checkpoints)
    voice_encoder = VoiceEncoder()
    voice_encoder.load_state_dict(load_file(checkpoints / 've.safetensors'))
    voice_encoder = voice_encoder.to(DEVICE).eval()

    source_wav, _ = librosa.load(reference, sr=S3GEN_SR)
    source_wav = source_wav[:DEC_COND_LEN]
    reference_dict = s3gen.embed_ref(source_wav, S3GEN_SR, device=DEVICE)

    reference_16k = librosa.resample(source_wav, orig_sr=S3GEN_SR, target_sr=S3_SR)
    prompt_tokens, _ = s3gen.tokenizer.forward([reference_16k[:ENC_COND_LEN]], max_len=375)
    prompt_tokens = torch.atleast_2d(prompt_tokens).to(DEVICE)
    speaker_embedding = torch.from_numpy(
        voice_encoder.embeds_from_wavs([reference_16k], sample_rate=S3_SR)
    ).mean(axis=0, keepdim=True).to(DEVICE)
    t3_conditionals = T3Cond(
        speaker_emb=speaker_embedding,
        cond_prompt_speech_tokens=prompt_tokens,
        emotion_adv=0.5 * torch.ones(1, 1, 1),
    ).to(device=DEVICE)

    del voice_encoder, s3gen
    gc.collect()
    return t3_conditionals, reference_dict


def generate_speech_token_chunks(checkpoints: Path, text: str, conditionals: T3Cond) -> list[torch.Tensor]:
    # Stage two keeps only the text-to-speech-token model in memory.
    hp = T3Config(text_tokens_dict_size=50276)
    hp.llama_config_name = 'GPT2_medium'
    hp.speech_tokens_dict_size = 6563
    hp.input_pos_emb = None
    hp.speech_cond_prompt_len = 375
    hp.use_perceiver_resampler = False
    hp.emotion_adv = False

    t3 = T3(hp)
    state = load_file(checkpoints / 't3_turbo_v1.safetensors')
    if 'model' in state:
        state = state['model'][0]
    t3.load_state_dict(state)
    del state, t3.tfmr.wte
    t3 = t3.to(device=DEVICE, dtype=T3_DTYPE).eval()
    conditionals = conditionals.to(device=DEVICE, dtype=T3_DTYPE)

    tokenizer = AutoTokenizer.from_pretrained(checkpoints)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    chunks = split_for_token_cache(text)
    generated_chunks: list[torch.Tensor] = []
    for index, chunk in enumerate(chunks, start=1):
        print(f'T3 token chunk {index}/{len(chunks)}', flush=True)
        text_tokens = tokenizer(punc_norm(chunk), return_tensors='pt', padding=True, truncation=True).input_ids.to(DEVICE)
        # Turbo frequently does not emit its stop token.  Bound the decoder by
        # the phrase length so it cannot turn an 18-word sentence into 1,000
        # tokens of trailing speech while its key/value cache grows.
        max_gen_len = max(120, min(420, math.ceil(len(chunk.split()) * 16)))
        with torch.inference_mode():
            generated = t3.inference_turbo(
                t3_cond=conditionals,
                text_tokens=text_tokens,
                temperature=0.72,
                top_k=700,
                top_p=0.92,
                repetition_penalty=1.2,
                max_gen_len=max_gen_len,
            )
        generated_chunks.append(generated.detach().cpu())
        del text_tokens, generated
        release_memory()

    del tokenizer, t3
    release_memory()
    return generated_chunks


def generate_speech_tokens(checkpoints: Path, text: str, conditionals: T3Cond) -> torch.Tensor:
    chunks = generate_speech_token_chunks(checkpoints, text, conditionals)
    joined: list[torch.Tensor] = []
    for index, chunk in enumerate(chunks):
        joined.append(chunk)
        if index < len(chunks) - 1:
            joined.append(torch.tensor([[S3GEN_SIL, S3GEN_SIL, S3GEN_SIL]], dtype=torch.long))
    return torch.cat(joined, dim=1)


def split_for_token_cache(text: str, max_words: int = 18) -> list[str]:
    """Limit autoregressive token-cache growth without changing scene-level timing."""
    sentences = [part.strip() for part in re.split(r'(?<=[.!?])\s+', text) if part.strip()]
    chunks: list[str] = []
    current: list[str] = []
    current_words = 0
    for sentence in sentences:
        words = sentence.split()
        while words:
            take = min(max_words - current_words, len(words))
            current.extend(words[:take])
            current_words += take
            words = words[take:]
            if current_words == max_words:
                chunks.append(' '.join(current))
                current, current_words = [], 0
    if current:
        chunks.append(' '.join(current))
    return chunks or [text]


def release_memory() -> None:
    gc.collect()
    try:
        ctypes.CDLL('libc.so.6').malloc_trim(0)
    except OSError:
        pass


def decode_waveform(checkpoints: Path, speech_tokens: torch.Tensor, reference_dict: dict) -> torch.Tensor:
    # Stage three reloads the decoder only after the text model has been reclaimed.
    s3gen = load_s3gen(checkpoints)
    speech_tokens = speech_tokens[speech_tokens < 6561].to(DEVICE)
    silence = torch.tensor([S3GEN_SIL, S3GEN_SIL, S3GEN_SIL], dtype=torch.long, device=DEVICE)
    speech_tokens = torch.cat([speech_tokens, silence])
    with torch.inference_mode():
        waveform, _ = s3gen.inference(
            speech_tokens=speech_tokens,
            ref_dict=reference_dict,
            n_cfm_timesteps=2,
        )
    waveform = waveform.squeeze(0).detach().cpu().numpy()
    watermarked = perth.PerthImplicitWatermarker().apply_watermark(waveform, sample_rate=S3GEN_SR)
    del s3gen
    gc.collect()
    return torch.from_numpy(watermarked).unsqueeze(0)


def decode_token_chunks(checkpoints: Path, token_chunks: list[torch.Tensor], reference_dict: dict) -> torch.Tensor:
    """Decode short phrase token blocks independently to bound S3 working memory."""
    s3gen = load_s3gen(checkpoints)
    silence_tokens = torch.tensor([S3GEN_SIL, S3GEN_SIL, S3GEN_SIL], dtype=torch.long, device=DEVICE)
    gap = torch.zeros((1, int(S3GEN_SR * 0.10)))
    rendered: list[torch.Tensor] = []
    for index, tokens in enumerate(token_chunks):
        speech_tokens = tokens[tokens < 6561].to(DEVICE)
        speech_tokens = torch.cat([speech_tokens, silence_tokens])
        with torch.inference_mode():
            waveform, _ = s3gen.inference(
                speech_tokens=speech_tokens,
                ref_dict=reference_dict,
                n_cfm_timesteps=2,
            )
        waveform = waveform.squeeze(0).detach().cpu().numpy()
        watermarked = perth.PerthImplicitWatermarker().apply_watermark(waveform, sample_rate=S3GEN_SR)
        rendered.append(torch.from_numpy(watermarked).unsqueeze(0))
        if index < len(token_chunks) - 1:
            rendered.append(gap)
        del speech_tokens, waveform
        release_memory()
    del s3gen
    release_memory()
    return torch.cat(rendered, dim=1)


def synthesize(text: str, reference: Path) -> tuple[torch.Tensor, int]:
    checkpoints = checkpoint_dir()
    t3_conditionals, reference_dict = prepare_conditionals(checkpoints, reference)
    speech_tokens = generate_speech_tokens(checkpoints, text, t3_conditionals)
    waveform = decode_waveform(checkpoints, speech_tokens, reference_dict)
    return waveform, S3GEN_SR


def load_state(state_dir: Path) -> tuple[T3Cond, dict]:
    payload = torch.load(state_dir / 'conditionals.pt', map_location='cpu', weights_only=False)
    return T3Cond(**payload['conditionals']).to(device=DEVICE), payload['reference_dict']


def stage_prepare(reference: Path, state_dir: Path) -> None:
    # S3/voice encoder uses a small number of long CPU kernels.  On this host
    # its multi-thread path can remain parked in OpenMP futex waits.
    torch.set_num_threads(1)
    torch.set_num_interop_threads(1)
    checkpoints = checkpoint_dir()
    conditionals, reference_dict = prepare_conditionals(checkpoints, reference)
    state_dir.mkdir(parents=True, exist_ok=True)
    torch.save({'conditionals': conditionals.__dict__, 'reference_dict': reference_dict}, state_dir / 'conditionals.pt')


def stage_tokens(text: str, state_dir: Path) -> None:
    torch.set_num_threads(4)
    torch.set_num_interop_threads(1)
    conditionals, _ = load_state(state_dir)
    token_chunks = generate_speech_token_chunks(checkpoint_dir(), text, conditionals)
    torch.save(token_chunks, state_dir / 'speech_tokens.pt')


def stage_decode(state_dir: Path, output: Path) -> None:
    torch.set_num_threads(1)
    torch.set_num_interop_threads(1)
    _, reference_dict = load_state(state_dir)
    token_chunks = torch.load(state_dir / 'speech_tokens.pt', map_location='cpu', weights_only=True)
    waveform = decode_token_chunks(checkpoint_dir(), token_chunks, reference_dict)
    import torchaudio
    output.parent.mkdir(parents=True, exist_ok=True)
    torchaudio.save(str(output), waveform, S3GEN_SR)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--stage', choices=('all', 'prepare', 'tokens', 'decode'), default='all')
    parser.add_argument('--text-file', type=Path, required=True)
    parser.add_argument('--reference', type=Path, required=True)
    parser.add_argument('--state-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--seed', type=int, default=260_000)
    args = parser.parse_args()
    random.seed(args.seed)
    torch.manual_seed(args.seed)
    text = args.text_file.read_text().strip()
    if args.stage == 'all':
        common = [
            '--text-file', str(args.text_file), '--reference', str(args.reference),
            '--state-dir', str(args.state_dir), '--output', str(args.output), '--seed', str(args.seed),
        ]
        # Process exits reclaim the CPU allocator before the next model stage.
        for stage in ('prepare', 'tokens', 'decode'):
            subprocess.run([sys.executable, __file__, '--stage', stage, *common], check=True)
        return 0
    if args.stage == 'prepare':
        stage_prepare(args.reference, args.state_dir)
    elif args.stage == 'tokens':
        stage_tokens(text, args.state_dir)
    else:
        stage_decode(args.state_dir, args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
