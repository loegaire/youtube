#!/usr/bin/env python3
"""Generate up to three resource-bounded owner-voice narration clips."""

from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHARED_MODELS = Path("/home/thinh/proj/youtube/fmstr2/.chatterbox-models")
os.environ.setdefault("HF_HOME", str(SHARED_MODELS))
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/shellcode-numba-cache")


def available_gib() -> float:
    values: dict[str, int] = {}
    for line in Path("/proc/meminfo").read_text().splitlines():
        key, value = line.split(":", 1)
        values[key] = int(value.strip().split()[0])
    return values["MemAvailable"] / 1024 / 1024


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ids", required=True, help="comma-separated manifest ids; maximum three")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--threads", type=int, default=2, choices=(1, 2))
    parser.add_argument("--temperature", type=float, default=0.86)
    parser.add_argument("--min-available-gib", type=float, default=3.0)
    args = parser.parse_args()

    ids = [value.strip() for value in args.ids.split(",") if value.strip()]
    if not 1 <= len(ids) <= 3:
        raise SystemExit("--ids must contain one to three ids.")
    if available_gib() < args.min_available_gib:
        raise SystemExit(f"Refusing synthesis: only {available_gib():.2f} GiB RAM available.")
    if shutil.disk_usage(ROOT).free < 6 * 1024**3:
        raise SystemExit("Refusing synthesis: need at least 6 GiB free disk.")

    manifest = json.loads((ROOT / "assets" / "audio" / "narration-segments.json").read_text())
    chosen = [item for item in manifest if item["id"] in ids]
    missing = sorted(set(ids) - {item["id"] for item in chosen})
    if missing:
        raise SystemExit(f"Unknown narration ids: {', '.join(missing)}")

    os.environ["OMP_NUM_THREADS"] = str(args.threads)
    os.environ["MKL_NUM_THREADS"] = str(args.threads)
    import torch
    import torchaudio
    from chatterbox.tts_turbo import ChatterboxTurboTTS

    torch.set_num_threads(args.threads)
    torch.set_num_interop_threads(1)
    out = ROOT / "assets" / "audio" / "narration-clips"
    out.mkdir(parents=True, exist_ok=True)
    reference = ROOT / "assets" / "audio" / "owner-voice-reference.wav"
    if not reference.exists():
        raise SystemExit(f"Missing owner voice reference: {reference}")

    print(f"Loading shared Chatterbox model with {args.threads} CPU threads.", flush=True)
    model = ChatterboxTurboTTS.from_pretrained(device="cpu")
    model.prepare_conditionals(str(reference))
    for item in chosen:
        target = out / f"{item['id']}-{item['slug']}.wav"
        if target.exists() and not args.force:
            print(f"Skipping {target.name}; already exists.", flush=True)
            continue
        print(f"Generating {target.name}", flush=True)
        with torch.inference_mode():
            audio = model.generate(
                item["text"],
                repetition_penalty=1.16,
                temperature=args.temperature,
                top_p=0.95,
                top_k=900,
                exaggeration=0.56,
                cfg_weight=0.23,
            )
        torchaudio.save(str(target), audio, model.sr)


if __name__ == "__main__":
    main()
