#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WHISPER = Path("/home/thinh/.cache/hyperframes/whisper/whisper.cpp/build/bin/whisper-cli")
MODEL = Path("/home/thinh/.cache/hyperframes/whisper/models/ggml-small.en.bin")


def normalize(text: str) -> list[str]:
    text = text.lower()
    replacements = {
        "r o p": "rop",
        "c p u": "cpu",
        "n x": "nx",
        "e i p": "eip",
        "e s p": "esp",
        "e a x": "eax",
        "e b x": "ebx",
        "e c x": "ecx",
        "e d x": "edx",
        "rett": "ret",
        "system call": "syscall",
        "exec v e": "execve",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    return re.findall(r"[a-z0-9]+", text)


def distance(a: list[str], b: list[str]) -> int:
    row = list(range(len(b) + 1))
    for i, left in enumerate(a, 1):
        nxt = [i]
        for j, right in enumerate(b, 1):
            nxt.append(min(
                nxt[-1] + 1,
                row[j] + 1,
                row[j - 1] + (left != right),
            ))
        row = nxt
    return row[-1]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("batch_manifest", type=Path)
    parser.add_argument("--clips", type=Path, default=ROOT / "audio" / "chatterbox-clips")
    parser.add_argument("--max-wer", type=float, default=0.30)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    batch = json.loads(args.batch_manifest.read_text())
    with tempfile.TemporaryDirectory(prefix="rop-asr-", dir="/tmp") as temp:
        temp = Path(temp)
        concat = temp / "concat.txt"
        combined = temp / "batch.wav"
        output = temp / "transcript"
        clip_paths = [
            args.clips / f"{row['id']}-speech.wav"
            for row in batch
        ]
        concat.write_text("\n".join(
            f"file '{clip_path.as_posix()}'"
            for clip_path in clip_paths
        ) + "\n")
        subprocess.run(
            [
                "ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
                "-i", str(concat), "-ar", "16000", "-ac", "1", str(combined),
            ],
            check=True,
        )
        subprocess.run(
            [
                str(WHISPER), "-m", str(MODEL), "-f", str(combined),
                "-otxt", "-of", str(output), "-nt", "-np", "-t", "2",
            ],
            check=True,
        )
        transcript = output.with_suffix(".txt").read_text().strip()

    expected = " ".join(row["sourceText"] for row in batch)
    expected_words = normalize(expected)
    actual_words = normalize(transcript)
    wer = distance(expected_words, actual_words) / max(1, len(expected_words))
    report = {
        "ids": [row["id"] for row in batch],
        "expected": expected,
        "transcript": transcript,
        "expectedWords": len(expected_words),
        "transcriptWords": len(actual_words),
        "wer": round(wer, 4),
        "maxWer": args.max_wer,
        "pass": wer <= args.max_wer,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    return 0 if report["pass"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
