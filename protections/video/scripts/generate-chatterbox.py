#!/usr/bin/env python3

"""Generate a small, resource-bounded Chatterbox-Turbo narration batch."""

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
os.environ.setdefault("HF_HOME", str(ROOT / ".chatterbox-models"))
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
os.environ.setdefault("OMP_NUM_THREADS", "2")
os.environ.setdefault("MKL_NUM_THREADS", "2")

import numpy as np
import torch
import torchaudio
from chatterbox.tts_turbo import ChatterboxTurboTTS

DEFAULT_MANIFEST = ROOT / "audio" / "narration-segments.json"
DEFAULT_REFERENCE = ROOT / "audio" / "reference" / "voice-reference.wav"
DEFAULT_OUTPUT = ROOT / "audio" / "chatterbox-clips"
MIN_AVAILABLE_GIB = 3.0
MAX_TEMPO = 1.15


def available_gib() -> float:
    values: dict[str, int] = {}
    for line in Path("/proc/meminfo").read_text().splitlines():
        key, value = line.split(":", 1)
        values[key] = int(value.strip().split()[0])
    return values["MemAvailable"] / 1024 / 1024


def duration(path: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def spoken_form(text: str) -> str:
    replacements = {
        "0x080491f6": "zero x zero eight zero four nine one f six",
        "flag.txt": "flag dot text",
        "`p32`": "p thirty-two",
        "`44`": "forty-four",
        "`32`": "thirty-two",
        "`buf`": "buff",
        "`main`": "main",
        "`vuln`": "the vulnerable function",
        "`gets`": "the gets function",
        "`win`": "win",
        "`ret`": "the return instruction",
        "`flat`": "the flat helper",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    text = text.replace("`", "")
    text = text.replace("“", '"').replace("”", '"')
    text = text.replace("Pwntools", "P W N tools")
    text = text.replace(
        "Here is the program. main performs some challenge-environment setup",
        "Here is the program. Main performs setup",
    )
    text = text.replace(
        "calls the vulnerable function. Inside the vulnerable function",
        "calls the vulnerable function. Inside",
    )
    text = text.replace("a the return instruction instruction", "the return instruction")
    text = text.replace("machine instruction the return instruction", "machine return instruction")
    return re.sub(r"\s+", " ", text).strip()


def fit_clip(raw: Path, fitted: Path, target: float) -> tuple[float, float]:
    raw_duration = duration(raw)
    tempo = max(1.0, raw_duration / target)
    if tempo > MAX_TEMPO:
        raise RuntimeError(
            f"{raw.stem}: {raw_duration:.2f}s needs {tempo:.3f}x tempo; "
            f"limit is {MAX_TEMPO:.2f}x"
        )
    filters = []
    if tempo > 1.001:
        filters.append(f"atempo={tempo:.6f}")
    filters.extend([
        "loudnorm=I=-18:TP=-1.5:LRA=7",
        "apad",
        f"atrim=duration={target:.3f}",
    ])
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error", "-i", str(raw),
            "-af", ",".join(filters), "-ar", "44100", "-ac", "2",
            "-c:a", "pcm_s16le", str(fitted),
        ],
        check=True,
    )
    return raw_duration, tempo


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ids", required=True, help="Comma-separated segment IDs; maximum four")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--reference", type=Path, default=DEFAULT_REFERENCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--seed-offset", type=int, default=0)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    wanted = [item.strip() for item in args.ids.split(",") if item.strip()]
    if not wanted or len(wanted) > 4:
        raise SystemExit("Choose between one and four segment IDs per process.")
    if available_gib() < MIN_AVAILABLE_GIB:
        raise SystemExit(f"Refusing to load Chatterbox with under {MIN_AVAILABLE_GIB:.1f} GiB available RAM.")
    if shutil.disk_usage(ROOT).free < 8 * 1024**3:
        raise SystemExit("Refusing to run with under 8 GiB free disk space.")

    manifest = json.loads(args.manifest.read_text())
    by_id = {entry["id"]: entry for entry in manifest}
    missing = [segment_id for segment_id in wanted if segment_id not in by_id]
    if missing:
        raise SystemExit(f"Unknown IDs: {', '.join(missing)}")

    args.output.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(2)
    torch.set_num_interop_threads(1)
    print(f"Loading Chatterbox-Turbo on CPU; available RAM {available_gib():.2f} GiB", flush=True)
    started = time.monotonic()
    model = ChatterboxTurboTTS.from_pretrained(device="cpu")
    model.prepare_conditionals(str(args.reference))
    print(f"Model and voice reference ready in {time.monotonic() - started:.1f}s", flush=True)

    metadata = []
    batch_path = args.output / f"batch-{'-'.join(wanted)}.json"
    for segment_id in wanted:
        entry = by_id[segment_id]
        raw = args.output / f"{segment_id}-raw.wav"
        fitted = args.output / f"{segment_id}.wav"
        if fitted.exists() and not args.force:
            print(f"{segment_id}: already present", flush=True)
            continue

        seed = 910_000 + sum(ord(char) for char in segment_id) + args.seed_offset
        random.seed(seed)
        np.random.seed(seed)
        torch.manual_seed(seed)
        text = spoken_form(entry["text"])
        clip_started = time.monotonic()
        with torch.inference_mode():
            wav = model.generate(
                text,
                repetition_penalty=1.25,
                temperature=0.72,
                top_p=0.92,
                top_k=700,
            )
        torchaudio.save(str(raw), wav, model.sr)
        raw_duration, tempo = fit_clip(raw, fitted, float(entry["duration"]))
        row = {
            "id": segment_id,
            "text": text,
            "sourceText": entry["text"],
            "targetDuration": entry["duration"],
            "rawDuration": round(raw_duration, 3),
            "tempo": round(tempo, 4),
            "seed": seed,
            "elapsed": round(time.monotonic() - clip_started, 1),
        }
        metadata.append(row)
        batch_path.write_text(json.dumps(metadata, indent=2) + "\n")
        print(
            f"{segment_id}: {raw_duration:.2f}s -> {entry['duration']:.2f}s "
            f"({tempo:.3f}x, {row['elapsed']:.1f}s compute)",
            flush=True,
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
