#!/usr/bin/env python3
"""Measure source/ASR agreement for the three bounded owner-voice pilots."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets" / "audio"


def words(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def distance(left: list[str], right: list[str]) -> int:
    row = list(range(len(right) + 1))
    for i, a in enumerate(left, 1):
        nxt = [i]
        for j, b in enumerate(right, 1):
            nxt.append(min(nxt[-1] + 1, row[j] + 1, row[j - 1] + (a != b)))
        row = nxt
    return row[-1]


manifest = {item["id"]: item for item in json.loads((AUDIO / "narration-segments.json").read_text())}
rows = []
for pilot_id in ("02", "14", "41"):
    item = manifest[pilot_id]
    transcript_path = AUDIO / "narration-clips" / f"{pilot_id}-{item['slug']}.transcript.json"
    heard_items = json.loads(transcript_path.read_text())
    heard = " ".join(entry["text"] for entry in heard_items)
    expected_words = words(item["text"])
    heard_words = words(heard)
    wer = distance(expected_words, heard_words) / max(1, len(expected_words))
    rows.append({
        "id": pilot_id,
        "expected": item["text"],
        "transcript": heard,
        "wer": round(wer, 3),
        "status": "PASS" if heard_words and wer <= 0.30 else "FAIL",
    })

result = {
    "gate": "PASS" if all(row["status"] == "PASS" for row in rows) else "FAIL",
    "threshold": 0.30,
    "notes": [
        "Source-correct text remains canonical; Whisper supplies intelligibility evidence only.",
        "Raw pilots contain natural 0.12-0.40 second phrase-boundary pauses.",
        "Final mastering targets -16 LUFS and -1.5 dBTP without a noise gate, preserving breath and mouth detail.",
    ],
    "pilots": rows,
}
(AUDIO / "pilot-qa.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
raise SystemExit(0 if result["gate"] == "PASS" else 1)
