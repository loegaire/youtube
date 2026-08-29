#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
import random
import re
import shutil
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
os.environ.setdefault("HF_HOME", str(ROOT / ".chatterbox-models"))
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
os.environ.setdefault("OMP_NUM_THREADS", "2")
os.environ.setdefault("MKL_NUM_THREADS", "2")
os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/rop-numba-cache")

import numpy as np
import torch
import torchaudio
from chatterbox.tts_turbo import ChatterboxTurboTTS

DEFAULT_MANIFEST = ROOT / "audio" / "narration-segments.json"
DEFAULT_REFERENCE = ROOT / "audio" / "reference" / "voice-reference.wav"
DEFAULT_OUTPUT = ROOT / "audio" / "chatterbox-clips"
MIN_AVAILABLE_GIB = 3.0
MAX_TEMPO = 1.12


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
    replacements = [
        (r"\bpicoCTF\b", "pico C T F"),
        (r"\bROP\b", "R O P"),
        (r"\bCPU\b", "C P U"),
        (r"\bNX\b", "N X"),
        (r"\bPIE\b", "P I E"),
        (r"\bEIP\b", "E I P"),
        (r"\bESP\b", "E S P"),
        (r"\bEBP\b", "E B P"),
        (r"\bEAX\b", "E A X"),
        (r"\bEBX\b", "E B X"),
        (r"\bECX\b", "E C X"),
        (r"\bEDX\b", "E D X"),
        (r"\bARGV\b", "arg V"),
        (r"\bENVP\b", "env P"),
        (r"\bBSS\b", "B S S"),
        (r"\blibc\b", "lib C"),
        (r"\bexecve\b", "exec V E"),
        (r"\bsyscall\b", "system call"),
        (r"\bSyscall\b", "System call"),
        (r"slash bin slash sh", "slash bin slash S H"),
        (r"\bmov\b", "move"),
        (r"\bint zero eighty\b", "int zero eighty"),
        (r"\bret\b", "rett"),
        (r"\bRet\b", "Rett"),
    ]
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)
    return re.sub(r"\s+", " ", text).strip()


def render_clip(raw: Path, speech: Path, full: Path, speech_target: float, beat_target: float) -> tuple[float, float, float]:
    raw_duration = duration(raw)
    tempo = max(1.0, raw_duration / speech_target)
    if tempo > MAX_TEMPO:
        raise RuntimeError(
            f"{raw.stem}: {raw_duration:.2f}s needs {tempo:.3f}x tempo; "
            f"limit is {MAX_TEMPO:.2f}x"
        )

    filters = []
    if tempo > 1.001:
        filters.append(f"atempo={tempo:.6f}")
    filters.extend([
        "highpass=f=70",
        "lowpass=f=15500",
        "loudnorm=I=-18:TP=-1.5:LRA=7",
    ])
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error", "-i", str(raw),
            "-af", ",".join(filters), "-ar", "44100", "-ac", "2",
            "-c:a", "pcm_s16le", str(speech),
        ],
        check=True,
    )
    speech_duration = duration(speech)
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error", "-i", str(speech),
            "-af", f"apad,atrim=duration={beat_target:.3f}",
            "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(full),
        ],
        check=True,
    )
    return raw_duration, speech_duration, tempo


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ids", required=True, help="Comma-separated segment IDs; maximum three")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--reference", type=Path, default=DEFAULT_REFERENCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--seed-offset", type=int, default=0)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    wanted = [item.strip() for item in args.ids.split(",") if item.strip()]
    if not wanted or len(wanted) > 3:
        raise SystemExit("Choose between one and three segment IDs per process.")
    if available_gib() < MIN_AVAILABLE_GIB:
        raise SystemExit(f"Refusing to load Chatterbox with under {MIN_AVAILABLE_GIB:.1f} GiB available RAM.")
    if shutil.disk_usage(ROOT).free < 6 * 1024**3:
        raise SystemExit("Refusing to run with under 6 GiB free disk space.")

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
        speech = args.output / f"{segment_id}-speech.wav"
        full = args.output / f"{segment_id}.wav"
        if full.exists() and not args.force:
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
                repetition_penalty=1.16,
                temperature=0.84,
                top_p=0.95,
                top_k=900,
            )
        torchaudio.save(str(raw), wav, model.sr)
        raw_duration, speech_duration, tempo = render_clip(
            raw,
            speech,
            full,
            float(entry["speechDuration"]),
            float(entry["duration"]),
        )
        row = {
            "id": segment_id,
            "spokenText": text,
            "sourceText": entry["text"],
            "beatDuration": entry["duration"],
            "speechBudget": entry["speechDuration"],
            "rawDuration": round(raw_duration, 3),
            "speechDuration": round(speech_duration, 3),
            "tempo": round(tempo, 4),
            "seed": seed,
            "elapsed": round(time.monotonic() - clip_started, 1),
        }
        metadata.append(row)
        batch_path.write_text(json.dumps(metadata, indent=2) + "\n")
        print(
            f"{segment_id}: raw {raw_duration:.2f}s, speech {speech_duration:.2f}s, "
            f"beat {entry['duration']:.2f}s, tempo {tempo:.3f}x, "
            f"{row['elapsed']:.1f}s compute",
            flush=True,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
