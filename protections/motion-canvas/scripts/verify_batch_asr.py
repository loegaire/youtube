#!/usr/bin/env python3
"""Local Whisper ASR gate for one owner-voice batch."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

WHISPER = Path('/home/thinh/.cache/hyperframes/whisper/whisper.cpp/build/bin/whisper-cli')
MODEL = Path('/home/thinh/.cache/hyperframes/whisper/models/ggml-small.en.bin')


def normalize(text: str) -> list[str]:
    text = text.lower()
    for source, target in {
        'n x': 'nx', 'a s l r': 'aslr', 'p i e': 'pie', 'g o t': 'got',
        'r e l r o': 'relro', 'r o p': 'rop', 'read elf': 'readelf',
        'object dump': 'objdump', 'ret to libc': 'ret2libc',
    }.items():
        text = text.replace(source, target)
    return re.findall(r'[a-z0-9]+', text)


def distance(left: list[str], right: list[str]) -> int:
    row = list(range(len(right) + 1))
    for index, value in enumerate(left, 1):
        next_row = [index]
        for column, candidate in enumerate(right, 1):
            next_row.append(min(next_row[-1] + 1, row[column] + 1, row[column - 1] + (value != candidate)))
        row = next_row
    return row[-1]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('batch', type=Path)
    parser.add_argument('--clips', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    parser.add_argument('--max-wer', type=float, default=0.30)
    args = parser.parse_args()
    args.clips = args.clips.resolve()
    args.batch = args.batch.resolve()
    args.report = args.report.resolve()
    rows = json.loads(args.batch.read_text())
    if not WHISPER.exists() or not MODEL.exists():
        raise SystemExit('Local Whisper runtime or model is unavailable.')
    # Clips are deliberately joined at a natural phrase boundary with no padded
    # silence.  Whisper's batch segmentation can then swallow the start of a
    # later clip, so score every delivery clip independently.
    checks = []
    with tempfile.TemporaryDirectory(prefix='binary-defenses-asr-', dir='/tmp') as temp_dir:
        temp = Path(temp_dir)
        for row in rows:
            transcript_root = temp / row['id']
            source = args.clips / f"{row['id']}-speech.wav"
            subprocess.run([str(WHISPER), '-m', str(MODEL), '-f', str(source), '-otxt', '-of', str(transcript_root), '-nt', '-np', '-t', '2'], check=True)
            expected = row.get('narrationText', row['sourceText'])
            transcript = transcript_root.with_suffix('.txt').read_text().strip()
            expected_words = normalize(expected)
            actual_words = normalize(transcript)
            wer = distance(expected_words, actual_words) / max(1, len(expected_words))
            checks.append({
                'id': row['id'], 'expected': expected, 'transcript': transcript,
                'expectedWords': len(expected_words), 'transcriptWords': len(actual_words),
                'wer': round(wer, 4), 'pass': bool(actual_words) and wer <= args.max_wer,
            })
    expected_words = sum(row['expectedWords'] for row in checks)
    actual_words = sum(row['transcriptWords'] for row in checks)
    wer = sum(row['wer'] * row['expectedWords'] for row in checks) / max(1, expected_words)
    report = {
        'ids': [row['id'] for row in rows], 'checks': checks,
        'expectedWords': expected_words, 'transcriptWords': actual_words,
        'wer': round(wer, 4), 'maxWer': args.max_wer, 'pass': all(row['pass'] for row in checks),
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    return 0 if report['pass'] else 2


if __name__ == '__main__':
    raise SystemExit(main())
