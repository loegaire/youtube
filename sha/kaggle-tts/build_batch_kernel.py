#!/usr/bin/env python3
"""Build a batch TTS kernel: generate one wav per script segment in a single Kaggle run.

Usage: python3 build_batch_kernel.py segments.json
Writes kernel-batch/ (kernel.py + kernel-metadata.json) ready for `kaggle kernels push`.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

TEMPLATE = '''import base64
import json
import subprocess
import sys
import zipfile
from pathlib import Path

SEGMENTS_JSON = __SEGMENTS_JSON__
REF_OPUS_B64 = "__REF_B64__"


def sh(cmd):
    print("+", " ".join(cmd), flush=True)
    return subprocess.run(cmd, check=True)


sh([sys.executable, "-m", "pip", "install", "-q", "-U", "voxcpm", "soundfile", "faster-whisper"])

import torch  # noqa: E402
import soundfile as sf  # noqa: E402
from voxcpm import VoxCPM  # noqa: E402

print("GPU count:", torch.cuda.device_count(), flush=True)

work = Path("/kaggle/working")
out_dir = work / "audio"
out_dir.mkdir(exist_ok=True)

ref_opus = work / "ref.opus"
ref_wav = work / "reference.wav"
ref_opus.write_bytes(base64.b64decode(REF_OPUS_B64))
sh([
    "ffmpeg", "-y", "-v", "error",
    "-i", str(ref_opus),
    "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le",
    str(ref_wav),
])

# VoxCPM2 voice cloning requires prompt_wav_path AND prompt_text (exact
# transcript of the prompt wav) together, plus reference_wav_path for max
# similarity. Transcribe the reference window so conditioning is correct.
from faster_whisper import WhisperModel  # noqa: E402

wm = WhisperModel("small", device="cuda", compute_type="float16")
wsegs, _ = wm.transcribe(str(ref_wav), language="en", beam_size=5)
prompt_text = " ".join(s.text.strip() for s in wsegs).strip()
print("PROMPT_TEXT:", repr(prompt_text), flush=True)
if not prompt_text:
    raise RuntimeError("empty whisper transcript of reference audio")

try:
    model = VoxCPM.from_pretrained(
        "openbmb/VoxCPM2", load_denoiser=True, device="cuda", optimize=True,
    )
except Exception as e:
    print("optimize=True load failed, retrying without optimize:", repr(e), flush=True)
    model = VoxCPM.from_pretrained(
        "openbmb/VoxCPM2", load_denoiser=True, device="cuda", optimize=False,
    )

segments = json.loads(SEGMENTS_JSON)
sr = model.tts_model.sample_rate
durations = {}
failed = []

for i, seg in enumerate(segments):
    sid = str(seg["id"]).zfill(3)
    text = seg["text"]
    if not text.strip():
        durations[sid] = None
        print(f"[{i + 1}/{len(segments)}] seg_{sid}: (no narration, skipped)", flush=True)
        continue
    ok = False
    for attempt in range(3):
        try:
            wav = model.generate(
                text=text,
                prompt_wav_path=str(ref_wav),
                prompt_text=prompt_text,
                reference_wav_path=str(ref_wav),
                cfg_value=2.0,
                inference_timesteps=20,
                normalize=True,
                denoise=True,
                retry_badcase=True,
                retry_badcase_max_times=3,
                retry_badcase_ratio_threshold=6.0,
            )
            sf.write(str(out_dir / f"seg_{sid}.wav"), wav, sr)
            durations[sid] = round(len(wav) / sr, 3)
            print(f"[{i + 1}/{len(segments)}] seg_{sid}: {durations[sid]:.2f}s", flush=True)
            ok = True
            break
        except Exception as e:
            print(f"seg_{sid} attempt {attempt + 1} failed: {repr(e)}", flush=True)
            torch.cuda.empty_cache()
    if not ok:
        durations[sid] = None
        failed.append(sid)
    if (i + 1) % 10 == 0:
        torch.cuda.empty_cache()

(out_dir / "durations.json").write_text(json.dumps(durations, indent=1))
print("failed:", failed, flush=True)

zip_path = work / "audio.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_STORED) as z:
    for f in sorted(out_dir.iterdir()):
        z.write(f, f"audio/{f.name}")

total = sum(v for v in durations.values() if v)
print(f"DONE segments={len(durations)} failed={len(failed)} total_audio={total:.1f}s", flush=True)
'''


def main():
    segments_file = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "manifest" / "segments.json"
    segments = json.loads(segments_file.read_text())
    ref_b64 = (ROOT / "reference" / "ref.opus.b64").read_text(encoding="ascii").strip()

    seg_json = json.dumps(segments, ensure_ascii=True, separators=(",", ":"))
    src = TEMPLATE.replace("__SEGMENTS_JSON__", repr(seg_json)).replace("__REF_B64__", ref_b64)

    out_dir = ROOT / "kernel-batch"
    out_dir.mkdir(exist_ok=True)
    (out_dir / "kernel.py").write_text(src, encoding="utf-8")

    metadata = {
        "id": "hajjilla/sha-tts",
        "title": "sha-tts",
        "code_file": "kernel.py",
        "language": "python",
        "kernel_type": "script",
        "is_private": True,
        "enable_gpu": True,
        "enable_internet": True,
        "machine_shape": "NvidiaTeslaT4",
        "dataset_sources": [],
        "competition_sources": [],
        "kernel_sources": [],
        "model_sources": [],
    }
    (out_dir / "kernel-metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(f"built {out_dir}/kernel.py ({len(src)} bytes, {len(segments)} segments)")


if __name__ == "__main__":
    main()
