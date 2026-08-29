#!/usr/bin/env python3
"""Generate a natural-rate owner-voice batch with the full Chatterbox model."""

from __future__ import annotations

import argparse
import ctypes
import gc
import json
import os
import random
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHARED_MODELS = ROOT / '.chatterbox-standard-models'
STANDARD_SNAPSHOT = (
    SHARED_MODELS
    / 'hub/models--ResembleAI--chatterbox/snapshots/5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18'
)
os.environ.setdefault('HF_HOME', str(SHARED_MODELS))
os.environ.setdefault('HF_HUB_DISABLE_TELEMETRY', '1')
os.environ.setdefault('TOKENIZERS_PARALLELISM', 'false')
os.environ.setdefault('OMP_NUM_THREADS', '2')
os.environ.setdefault('MKL_NUM_THREADS', '2')
os.environ.setdefault('NUMBA_CACHE_DIR', str(ROOT / '.cache' / 'numba'))
os.environ.setdefault('XDG_CACHE_HOME', str(ROOT / '.cache'))

import numpy as np
import torch
import torchaudio
from chatterbox.tts import ChatterboxTTS

MANIFEST = ROOT / 'audio' / 'narration-segments.json'
# The parent recording is the sole owner-voice source.  Do not substitute a
# project-local copy, a pilot cut, or a generic fallback voice.
REFERENCE = Path('/home/thinh/proj/youtube/protections/video/assets/audio/voice-reference.wav')
OUTPUT = ROOT / 'audio' / 'owner-clips'


def available_gib() -> float:
    values = {}
    for line in Path('/proc/meminfo').read_text().splitlines():
        key, value = line.split(':', 1)
        values[key] = int(value.strip().split()[0])
    return values['MemAvailable'] / 1024 / 1024


def duration(path: Path) -> float:
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(result.stdout.strip())


def spoken_form(text: str) -> str:
    replacements = {
        'x86-64': 'x eighty-six sixty-four',
        'GNU_STACK': 'G N U stack',
        'ASLR': 'A S L R',
        'NX': 'N X',
        'PIE': 'P I E',
        # The turbo voice otherwise tends to collapse this into “railroad”.
        'RELRO': 'rel row',
        'GOT': 'G O T',
        'PLT': 'P L T',
        'ROP': 'rop',
        'ret2libc': 'ret to libc',
        'PaX': 'Packs',
        'fs:0x28': 'F S colon zero x twenty-eight',
        'rbp minus eight': 'R B P minus eight',
        'objdump': 'the disassembler',
        'readelf': 'read elf',
        'proc maps': 'proc maps',
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    # Preserve the source claim while speaking the address arithmetic in a way
    # the cloned conversational voice can render clearly.  Captions retain the
    # original assembly syntax and hexadecimal values.
    text = text.replace(
        'The function starts at address `0x401156`, reserves `0x30` bytes, '
        'calculates the buffer as `rbp minus 0x30`, loads `0x80`—one hundred '
        'and twenty-eight—into the third argument register, calls `read`, then '
        'reaches `leave` and `ret` without an integrity check.',
        'The disassembler shows greet beginning at its recorded address. It reserves '
        'forty-eight bytes, places the buffer at R B P minus forty-eight, asks read '
        'for one hundred twenty-eight bytes, then reaches leave and ret without an '
        'integrity check.',
    )
    text = text.replace(
        'The epilogue reloads the frame copy at `0x4011b8`, subtracts the current '
        'thread-local guard at `0x4011bc`, and jumps over the failure call only if '
        'the result is zero. If the values differ, `0x4011c7` calls '
        '`__stack_chk_fail`. Only after the equality path reaches `0x4011cc` do '
        '`leave` and `ret` execute. The corrupted return address can exist in '
        'memory and still never reach RIP.',
        'The epilogue reloads the protected value, compares it with the current '
        'thread-local guard, and takes the failure path unless they are equal. If '
        'they differ, the stack-check failure routine runs. Only after the equality '
        'check do leave and ret execute. The corrupted return address can exist in '
        'memory and still never reach R I P.',
    )
    text = text.replace(
        'With ninety-six `A` bytes, the plain build prints that it read ninety-six '
        'bytes, then dies by signal eleven with status one hundred and thirty-nine. '
        'The canary build reads the same ninety-six bytes, prints `stack smashing '
        'detected`, then terminates by signal six with status one hundred and '
        'thirty-four. One crashes after corrupted control state is consumed. The '
        'other detects corruption before returning.',
        'With 96 filler characters, the unprotected program reports a 96-byte read, '
        'then exits with signal 11 and status 139. The second program reads the same '
        'amount, reports stack smashing detected, then exits with signal 6 and status '
        '134. One crash happens after corrupted control flow is consumed. The other '
        'detects corruption before return.',
    )
    text = text.replace(
        'For PID fifteen twenty-one, the captured libc mapping begins at '
        '`0x7f704aa1e000`, while `dlsym` reports `puts` at `0x7f704aa9e5a0`. '
        '`nm` independently reports the `puts` symbol offset as `0x805a0` in this '
        'exact libc file. Adding the captured base and that file offset reproduces '
        'the runtime address exactly. These numbers belong to this build and this '
        'run; the relationship is the reusable part.',
        'Captured runtime metadata tells us where this program loaded its C library. '
        'The resolver’s puts address, minus its file offset, reproduces the current '
        'run’s library base. Those numeric values are specific to this build and one '
        'run. The relationship, runtime address equals base plus known offset, is reusable.',
    )
    text = text.replace(
        'Across four runs of the non-PIE binary, `main` remains `0x401186`, and its '
        'PLT reference for `puts` remains `0x401030`. The local stack pointer changes every '
        'time. The actual libc `puts` address changes every time. This is the first important '
        'separation: ASLR is active, but an ordinary non-PIE main executable can still provide '
        'fixed addresses.',
        'Across four runs of the non-position-independent build, the program main function '
        'and its linked puts reference remain fixed. The local stack pointer changes every '
        'time. The actual C library puts address changes every time. This is the first '
        'important separation: address randomization is active, but an ordinary non-position-'
        'independent main executable can still provide fixed addresses.',
    )
    text = text.replace(
        'This is the actual map for that held process. The executable begins at `0x00400000`. '
        'Its executable page is the next mapping. Libc’s file mapping begins at '
        '`0x7f704aa1e000`, and the user stack occupies the high-address range beginning at '
        '`0x7ffe4a34d000`. We show the whole map first because a selected row without its '
        'process and file context is easy to misread.',
        'This is the actual map for that held process. The executable begins at its recorded '
        'fixed base and its executable page is the next mapping. The C library file mapping '
        'appears at a randomized high address, and the user stack occupies another randomized '
        'high-address range. We show the whole map first because a selected row without its '
        'process and file context is easy to misread.',
    )
    text = re.sub(
        r'Across four runs of the non-P I E binary,.*?fixed addresses\.',
        'Across four runs of the non-position-independent build, the program main function '
        'and its linked puts reference remain fixed. The local stack pointer changes every '
        'time. The actual C library puts address changes every time. This is the first '
        'important separation: address randomization is active, but an ordinary non-position-'
        'independent main executable can still provide fixed addresses.',
        text,
        flags=re.DOTALL,
    )
    text = text.replace(
        'P I E is visible before runtime. `read elf` identifies `address-nopie` as type '
        '`EXEC` with entry point `0x4010a0`; `nm` places `main` at `0x401186`. The '
        'P I E build is type `DYN`, specifically a position-independent executable, '
        'with entry point `0x10a0`; `nm` records `main` as offset `0x1189`. We first '
        'inspect the complete headers and symbol tables, then extract those rows.',
        'The file inspection makes the distinction before the program runs. The '
        'non-position-independent build is a fixed executable: its main function has '
        'one linked address. The position-independent build is dynamically loaded. '
        'Its main value is an offset, not a permanent location. The full headers and '
        'symbol tables provide the supporting rows.',
    )
    text = text.replace(
        'In the four P I E executions, `main` changes from `0x55949c2c2189` to three '
        'other bases. The stack changes, and libc changes as before. Here the printed '
        '`puts` reference also resolves to the randomized libc implementation. The '
        'important result is that the executable’s own code address is no longer a '
        'stable island across runs.',
        'Across four position-independent runs, the same main code, stack, and C '
        'library all move to different runtime bases. The printed puts reference moves '
        'with the C library. The executable’s own code address is no longer a stable '
        'island across runs.',
    )
    text = text.replace(
        'For PID fifteen twenty-two, `/proc` shows the P I E file mapping beginning at '
        '`0x55bce0674000`. The binary’s symbol table gives `main` an offset of '
        '`0x1189`. Add them, and we obtain the printed runtime address exactly: '
        '`0x55bce0675189`. P I E therefore changes absolute addresses while '
        'preserving offsets within that build, just as A S L R-preserved offsets '
        'existed inside libc.',
        'For one captured run, the position-independent executable begins at a '
        'recorded load base. The main function has a known file offset. Base plus '
        'offset reproduces its current runtime address. Position independence changes '
        'absolute addresses but preserves offsets inside this build, just as '
        'randomization preserves offsets inside the C library.',
    )
    text = text.replace(
        'rel row cannot be understood from one green label. For each binary, we '
        'record program headers, the dynamic section, relocation records, and section '
        'headers. No rel row has no `GNU_rel row` segment. Partial rel row has one '
        'beginning at `0x403df8`, but no `BIND_NOW`. Full rel row has a larger '
        'protected range beginning at `0x403dc0`, and its dynamic section contains both '
        '`BIND_NOW` and the `NOW` flag.',
        'Relocation protection cannot be inferred from one green label. We compare '
        'program headers, dynamic tags, relocation records, and section headers. The '
        'unprotected file has no protected relocation segment. Partial protection has '
        'a protected range but no immediate-binding flag. Full protection has a larger '
        'protected range and requests immediate binding.',
    )
    text = text.replace(
        'Next we connect the file’s relocation address to the live process page that '
        'contains it. In the no-rel row binary, `puts` has relocation address '
        '`0x4033a0`, inside a writable mapping. With partial rel row, `puts` is at '
        '`0x404000`, again inside a writable mapping. With full rel row, `puts` is at '
        '`0x403fd8`, and the containing page is mapped read-only.',
        'Then we connect each file relocation record to a live memory page. In the '
        'unprotected and partially protected examples, the puts relocation falls inside '
        'a writable mapping. In the fully protected example, it lies on a read-only '
        'page. That permission difference is the observable result.',
    )
    text = text.replace(
        'rop can route around N X. A pointer disclosure can reveal an A S L R base. '
        'A leaked canary can preserve the stack check. A leaked code pointer can reveal a P I E base. '
        'Full relro can force an attacker away from G O T overwrites',
        'Return-oriented programming can route around N X. A pointer disclosure can reveal an A S L R base. '
        'If the stack canary leaks, the stack check can remain intact. A leaked code pointer can reveal a P I E base. '
        'Full relocation read-only protection can force an attacker away from G O T overwrites',
    )
    text = text.replace('`', '').replace('—', ', ').replace('–', ', ')
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def phrase_groups(text: str, limit: int = 180) -> list[str]:
    """Keep the autoregressive CPU decode bounded at spoken phrase seams.

    Each group ends at punctuation where the speaker would naturally take a
    breath.  This is not a tempo edit: every group is synthesized at the
    model's native rate and joined with only a 45 ms natural crossfade.
    """
    sentences = [row.strip() for row in re.split(r'(?<=[.!?;:])\s+', text) if row.strip()]
    groups: list[str] = []
    current = ''
    for sentence in sentences:
        choices = [sentence]
        if len(sentence) > limit:
            choices = [row.strip() for row in re.split(r'(?<=,)\s+', sentence) if row.strip()]
        for choice in choices:
            if current and len(current) + 1 + len(choice) > limit:
                groups.append(current)
                current = choice
            else:
                current = f'{current} {choice}'.strip()
    if current:
        groups.append(current)
    return groups or [text]


def stitch_phrases(waves: list[torch.Tensor], sample_rate: int) -> torch.Tensor:
    """Crossfade a short phrase seam without erasing breath or mouth detail."""
    combined = waves[0]
    fade = round(sample_rate * 0.045)
    for next_wave in waves[1:]:
        samples = min(fade, combined.shape[-1] // 8, next_wave.shape[-1] // 8)
        if samples < 1:
            combined = torch.cat([combined, next_wave], dim=-1)
            continue
        ramp = torch.linspace(0, 1, samples, dtype=combined.dtype, device=combined.device).unsqueeze(0)
        overlap = combined[:, -samples:] * (1 - ramp) + next_wave[:, :samples] * ramp
        combined = torch.cat([combined[:, :-samples], overlap, next_wave[:, samples:]], dim=-1)
    return combined


def phrase_token_cap(phrase: str) -> int:
    """Conservative text-bound cap; ASR is the final authority on completeness."""
    return max(240, min(420, len(phrase.split()) * 9 + 40))


def master_clip(raw: Path, speech: Path) -> float:
    subprocess.run([
        'ffmpeg', '-y', '-v', 'error', '-i', str(raw),
        '-af', 'loudnorm=I=-18:TP=-1.5:LRA=7', '-ar', '44100', '-ac', '2',
        '-c:a', 'pcm_s16le', str(speech),
    ], check=True)
    return duration(speech)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--ids', required=True, help='One to three comma-separated segment IDs')
    parser.add_argument('--force', action='store_true')
    args = parser.parse_args()
    ids = [item.strip() for item in args.ids.split(',') if item.strip()]
    if not 1 <= len(ids) <= 3:
        raise SystemExit('Use one to three sections per Chatterbox process.')
    if available_gib() < 3.0:
        raise SystemExit(f'Refusing synthesis with only {available_gib():.2f} GiB available RAM.')
    if shutil.disk_usage(ROOT).free < 6 * 1024**3:
        raise SystemExit('Refusing synthesis with under 6 GiB free project disk.')
    if not REFERENCE.exists():
        raise SystemExit(f'Owner reference missing: {REFERENCE}')

    entries = json.loads(MANIFEST.read_text())
    by_id = {entry['id']: entry for entry in entries}
    missing = [entry_id for entry_id in ids if entry_id not in by_id]
    if missing:
        raise SystemExit(f'Unknown section IDs: {", ".join(missing)}')

    OUTPUT.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(2)
    torch.set_num_interop_threads(1)
    if not STANDARD_SNAPSHOT.exists():
        raise SystemExit(f'Full local Chatterbox snapshot is unavailable: {STANDARD_SNAPSHOT}')
    print(f'Loading local full Chatterbox owner clone; available RAM {available_gib():.2f} GiB', flush=True)
    started = time.monotonic()
    model = ChatterboxTTS.from_local(STANDARD_SNAPSHOT, device='cpu')
    # The reference carries the close-mic breathiness and restrained mouth texture.
    model.prepare_conditionals(str(REFERENCE), exaggeration=0.50)
    print(f'Owner reference conditioned in {time.monotonic() - started:.1f}s', flush=True)

    batch = []
    for entry_id in ids:
        entry = by_id[entry_id]
        raw = OUTPUT / f'{entry_id}-raw.wav'
        speech = OUTPUT / f'{entry_id}-speech.wav'
        if speech.exists() and not args.force:
            print(f'{entry_id}: already present', flush=True)
            continue
        seed = 760_000 + sum(ord(char) for char in entry_id)
        narration = spoken_form(entry['text'])
        # This one evidence-dense ASLR explanation benefits from shorter
        # thought-sized deliveries; it leaves the owner's pauses and breaths
        # intact while avoiding a long CPU autoregressive turn.
        phrases = phrase_groups(narration, limit=90 if entry_id == 'scene-50' else 120 if entry_id in {'scene-31', 'scene-46'} else 180)
        clip_started = time.monotonic()
        waves = []
        with torch.inference_mode():
            for phrase_index, phrase in enumerate(phrases):
                phrase_seed = seed + phrase_index
                random.seed(phrase_seed)
                np.random.seed(phrase_seed)
                torch.manual_seed(phrase_seed)
                # Bound autoregressive decoding by the phrase word count,
                # never by a desired audio duration or playback rate.
                max_gen_len = phrase_token_cap(phrase)
                print(f'{entry_id}: phrase {phrase_index + 1}/{len(phrases)} ({len(phrase)} chars; cap {max_gen_len})', flush=True)
                original_inference = model.t3.inference
                def bounded_inference(*args, **kwargs):
                    kwargs['max_new_tokens'] = max_gen_len
                    return original_inference(*args, **kwargs)
                model.t3.inference = bounded_inference
                try:
                    generated = model.generate(
                        phrase,
                        repetition_penalty=1.16,
                        temperature=0.84,
                        top_p=0.95,
                        # Full Chatterbox derives the owner timbre, pauses,
                        # breathiness, and close-mic mouth texture directly
                        # from the original recording.
                        exaggeration=0.50,
                        cfg_weight=0.50,
                    )
                    waves.append(generated.detach().cpu())
                    del generated
                finally:
                    model.t3.inference = original_inference
                # Chatterbox's autoregressive pass creates large temporary CPU
                # allocations. Release them at each natural phrase seam so a
                # long section cannot accumulate several phrases' working sets.
                gc.collect()
                try:
                    ctypes.CDLL('libc.so.6').malloc_trim(0)
                except OSError:
                    pass
        wav = stitch_phrases(waves, model.sr)
        torchaudio.save(str(raw), wav, model.sr)
        natural_duration = master_clip(raw, speech)
        row = {
            'id': entry_id,
            'sourceText': entry['text'],
            'narrationText': narration,
            'rawDuration': round(duration(raw), 3),
            'duration': round(natural_duration, 3),
            'seed': seed,
            'temperature': 0.84,
            'topP': 0.95,
            'repetitionPenalty': 1.16,
            'phraseCount': len(phrases),
            'phrases': phrases,
            'phraseTokenCaps': [phrase_token_cap(phrase) for phrase in phrases],
            'reference': str(REFERENCE),
            'elapsed': round(time.monotonic() - clip_started, 1),
        }
        batch.append(row)
        print(f"{entry_id}: natural {row['duration']:.2f}s; {row['elapsed']:.1f}s compute", flush=True)

    batch_path = OUTPUT / f"batch-{'-'.join(ids)}.json"
    batch_path.write_text(json.dumps(batch, indent=2) + '\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
