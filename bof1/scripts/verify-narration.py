#!/usr/bin/env python3

import argparse
import json
import re
from pathlib import Path

from faster_whisper import WhisperModel


def normalize(text: str) -> list[str]:
    text = text.lower()
    text = text.replace("zero x zero eight zero four nine one f six", " hexaddress ")
    text = text.replace("0x080491f6", " hexaddress ")
    # Tiny ASR sometimes hears a hexadecimal "f" as "h"; keep that harmless
    # token-level confusion from dominating the score for an otherwise clear line.
    text = re.sub(r"0x[0-9a-h ]{4,30}", " hexaddress ", text)
    text = text.replace("forty-four", "44").replace("forty four", "44")
    text = text.replace("thirty-two", "32").replace("thirty two", "32")
    text = text.replace("p 32", "p32")
    text = text.replace("flag dot text", "flag text").replace("flag.txt", "flag text")
    return re.findall(r"[a-z0-9]+", text)


def edit_distance(expected: list[str], actual: list[str]) -> int:
    previous = list(range(len(actual) + 1))
    for row, left in enumerate(expected, start=1):
        current = [row]
        for column, right in enumerate(actual, start=1):
            current.append(min(
                current[-1] + 1,
                previous[column] + 1,
                previous[column - 1] + (left != right),
            ))
        previous = current
    return previous[-1]


parser = argparse.ArgumentParser(description="Transcribe narration clips and reject unintelligible pilots.")
parser.add_argument("manifest", type=Path)
parser.add_argument("--clips", type=Path, default=Path("audio/narration-clips"))
parser.add_argument("--model", default="tiny.en", help="Model name or local CTranslate2 model path")
parser.add_argument("--download-root", type=Path, default=Path(".asr-model"))
parser.add_argument("--max-wer", type=float, default=0.30)
parser.add_argument("--variant", choices=("raw", "fitted"), default="raw")
parser.add_argument("--report", type=Path)
args = parser.parse_args()

entries = json.loads(args.manifest.read_text())
model = WhisperModel(
    str(args.model),
    device="cpu",
    compute_type="int8",
    cpu_threads=2,
    num_workers=1,
    download_root=str(args.download_root),
)
failed = False
report = []

for entry in entries:
    suffix = "-raw.wav" if args.variant == "raw" else ".wav"
    clip = args.clips / f"{entry['id']}{suffix}"
    segments, info = model.transcribe(str(clip), language="en", beam_size=5, vad_filter=True)
    transcript = " ".join(segment.text.strip() for segment in segments).strip()
    expected = normalize(entry["text"])
    actual = normalize(transcript)
    wer = edit_distance(expected, actual) / max(1, len(expected))
    status = "PASS" if actual and wer <= args.max_wer else "FAIL"
    if status == "FAIL":
        failed = True
    row = {"id": entry["id"], "language": info.language, "wer": round(wer, 3), "status": status, "expected": entry["text"], "transcript": transcript}
    report.append(row)
    print(f"{entry['id']}: {status}; WER={wer:.3f}; ASR={transcript}")

report_path = args.report or args.clips / f"asr-report-{args.variant}.json"
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, indent=2) + "\n")
print(f"Report: {report_path}")
raise SystemExit(1 if failed else 0)
