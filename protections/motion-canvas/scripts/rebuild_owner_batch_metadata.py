#!/usr/bin/env python3
"""Recreate batch metadata for completed owner clips after an interrupted model run."""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATOR_PATH = ROOT / "scripts" / "generate_owner_voice.py"

spec = importlib.util.spec_from_file_location("owner_generator", GENERATOR_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load {GENERATOR_PATH}")
generator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(generator)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ids", required=True)
    args = parser.parse_args()
    ids = [item.strip() for item in args.ids.split(",") if item.strip()]

    entries = json.loads(generator.MANIFEST.read_text())
    by_id = {entry["id"]: entry for entry in entries}
    batch = []
    for entry_id in ids:
        entry = by_id[entry_id]
        raw = generator.OUTPUT / f"{entry_id}-raw.wav"
        speech = generator.OUTPUT / f"{entry_id}-speech.wav"
        if not raw.exists() or not speech.exists():
            raise SystemExit(f"Completed owner clip is missing for {entry_id}")
        narration = generator.spoken_form(entry["text"])
        batch.append(
            {
                "id": entry_id,
                "sourceText": entry["text"],
                "narrationText": narration,
                "rawDuration": round(generator.duration(raw), 3),
                "duration": round(generator.duration(speech), 3),
                "reference": str(generator.REFERENCE),
                "recoveredMetadata": True,
            }
        )

    output = generator.OUTPUT / f"batch-{'-'.join(ids)}.json"
    output.write_text(json.dumps(batch, indent=2) + "\n")
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
