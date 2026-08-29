#!/usr/bin/env python3
"""Generate one owner-voice Chatterbox-Turbo clip inside an external cgroup."""
from __future__ import annotations

import argparse
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
os.environ.setdefault('HF_HOME', '/home/thinh/.cache/huggingface')
os.environ.setdefault('HF_HUB_DISABLE_TELEMETRY', '1')
os.environ.setdefault('TOKENIZERS_PARALLELISM', 'false')
os.environ.setdefault('OMP_NUM_THREADS', '2')
os.environ.setdefault('MKL_NUM_THREADS', '2')
os.environ.setdefault('NUMBA_CACHE_DIR', '/tmp/numba-cache')


def available_gib() -> float:
    data = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
    return int(data['MemAvailable'].strip().split()[0]) / 1024 / 1024


def duration(path: Path) -> float:
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', str(path)], text=True).strip())


def spoken(text: str) -> str:
    replacements = {
        'size_t': 'size tee', 'UBSan': 'U B san', 'C23': 'C twenty-three', 'CWE': 'C W E',
        'INT_MAX': 'int max', 'UINT_MAX': 'you int max', 'LP64': 'L P sixty-four', 'LLP64': 'L L P sixty-four',
        'memcpy': 'mem copy', 'objdump': 'object dump', 'imul': 'integer multiply', 'EAX': 'E A X',
        '0xffffffff': 'zero x f f f f f f f f', '0xA0EEBB00': 'zero x A zero E E B B zero zero',
        '0x80000000': 'zero x eight zero zero zero zero zero zero zero', '0x7fffffff': 'zero x seven f f f f f f f f',
        '0x384': 'zero x three eight four', '0x40062d': 'zero x four zero zero six two d',
    }
    for raw, replacement in replacements.items():
        text = text.replace(raw, replacement)
    return re.sub(r'\s+', ' ', text).strip()


def fit(raw: Path, output: Path, target: float) -> tuple[float, float]:
    raw_duration = duration(raw)
    # Use the spoken performance as the timing source.  The scene render is
    # retimed from this duration, so no artificial silence or speed-up belongs
    # in the owner-voice clip.
    tempo = 1.0
    filters = ['loudnorm=I=-18:TP=-1.5:LRA=7']
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(raw), '-af', ','.join(filters), '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', str(output)], check=True)
    return raw_duration, tempo


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--ids', required=True, help='exactly one segment ID')
    parser.add_argument('--force', action='store_true')
    args = parser.parse_args()
    ids = [entry.strip() for entry in args.ids.split(',') if entry.strip()]
    if len(ids) != 1:
        raise SystemExit('Choose exactly one segment per process.')
    # The cgroup wrapper owns the hard limit. This inner floor handles accidental direct runs.
    if available_gib() < 4.0:
        raise SystemExit(f'Refusing synthesis: {available_gib():.2f} GiB available RAM.')
    if shutil.disk_usage(ROOT).free < 8 * 1024 ** 3:
        raise SystemExit('Refusing synthesis: less than 8 GiB free disk.')

    manifest = json.loads((ROOT / 'audio/narration-segments.json').read_text())
    entries = {entry['id']: entry for entry in manifest}
    missing = [entry for entry in ids if entry not in entries]
    if missing:
        raise SystemExit(f'Unknown IDs: {", ".join(missing)}')

    raw_dir = ROOT / 'audio/chatterbox-clips/raw'
    final_dir = ROOT / 'audio/chatterbox-clips'
    raw_dir.mkdir(parents=True, exist_ok=True)
    final_dir.mkdir(parents=True, exist_ok=True)
    print(f'Loading staged Chatterbox-Turbo on CPU; available RAM {available_gib():.2f} GiB', flush=True)
    started = time.monotonic()
    reference = ROOT / 'audio/reference/voice-reference.wav'
    report = []
    for item_id in ids:
        entry = entries[item_id]
        raw = raw_dir / f'{item_id}.wav'
        output = final_dir / f'{item_id}.wav'
        if output.exists() and not args.force:
            print(f'{item_id}: already present', flush=True)
            continue
        seed = 260_000 + sum(ord(char) for char in item_id)
        random.seed(seed)
        text = spoken(entry['text'])
        generated = time.monotonic()
        text_file = raw_dir / f'{item_id}.txt'
        text_file.write_text(text + '\n')
        stage_dir = raw_dir / f'{item_id}.stages'
        common = [
            '--text-file', str(text_file), '--reference', str(reference), '--state-dir', str(stage_dir),
            '--output', str(raw), '--seed', str(seed),
        ]
        # This parent never imports Torch, so each isolated model stage starts
        # from a clean interpreter rather than inheriting an OpenMP runtime.
        for stage in ('prepare', 'tokens', 'decode'):
            subprocess.run([
                sys.executable, str(ROOT / 'scripts/staged_chatterbox.py'), '--stage', stage, *common,
            ], check=True)
        if item_id == ids[0]:
            print(f'Model and voice reference staged in {time.monotonic() - started:.1f}s', flush=True)
        raw_duration, tempo = fit(raw, output, float(entry['duration']))
        row = {'id': item_id, 'targetDuration': entry['duration'], 'rawDuration': round(raw_duration, 3), 'tempo': round(tempo, 4), 'elapsed': round(time.monotonic() - generated, 1)}
        report.append(row)
        print(f"{item_id}: {raw_duration:.2f}s -> {entry['duration']:.2f}s ({tempo:.3f}x, {row['elapsed']:.1f}s)", flush=True)
    (final_dir / f"batch-{'-'.join(ids)}.json").write_text(json.dumps(report, indent=2) + '\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
