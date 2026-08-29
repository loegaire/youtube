#!/usr/bin/env python3
"""Map raw-clip Whisper timings through final atempo values onto the master timeline."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets" / "audio"
CLIPS = AUDIO / "narration-clips"


def main() -> None:
    manifest = json.loads((AUDIO / "narration-segments.json").read_text())
    fit = json.loads((AUDIO / "narration-fit-report.json").read_text())
    fit_by_id = {item["id"]: item for item in fit["segments"]}
    combined = []
    for segment in manifest:
        transcript_path = CLIPS / f"{segment['id']}-{segment['slug']}.transcript.json"
        words = json.loads(transcript_path.read_text())
        tempo = float(fit_by_id[segment["id"]]["atempo"])
        for word in words:
            combined.append({
                "text": word["text"],
                "start": round(float(segment["start"]) + float(word["start"]) / tempo, 4),
                "end": round(float(segment["start"]) + float(word["end"]) / tempo, 4),
            })
    output = AUDIO / "clip-transcript.json"
    output.write_text(json.dumps(combined, indent=2) + "\n")
    print(json.dumps({"words": len(combined), "output": str(output)}, indent=2))


if __name__ == "__main__":
    main()
