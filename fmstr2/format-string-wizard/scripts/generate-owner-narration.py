#!/usr/bin/env python3
"""Generate a bounded Chatterbox-Turbo narration batch for one HyperFrames project."""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHARED_HOME = Path(os.environ.get("CHATTERBOX_HOME", ROOT.parent / ".chatterbox-models"))
os.environ.setdefault("HF_HOME", str(SHARED_HOME))
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")


def available_gib() -> float:
    values = {}
    for line in Path("/proc/meminfo").read_text().splitlines():
        key, value = line.split(":", 1)
        values[key] = int(value.strip().split()[0])
    return values["MemAvailable"] / 1024 / 1024


def spoken(text: str) -> str:
    swaps = {
        "`printf`": "print f", "`printf(buf)`": "print f, buff",
        "`printf(\"%s\", buf)`": "print f, percent s, buff", "`buf`": "buff",
        "`sus`": "suss", "`%hn`": "percent h n", "`%hhn`": "percent h h n",
        "`%n`": "percent n", "`%p`": "percent p", "`%x`": "percent x",
        "`%s`": "percent s", "`%d`": "percent d", "`%c`": "percent c",
        "`scanf`": "scan f", "`0x21737573`": "zero x two one seven three seven five seven three",
        "`0x67616c66`": "zero x six seven six one six c six six",
        "`0x404060`": "zero x four zero four zero six zero", "`0x404062`": "zero x four zero four zero six two",
        "`0x6761`": "zero x six seven six one", "`0x6c66`": "zero x six c six six",
        "`0x0505`": "zero x zero five zero five", "`0x4847464544434241`": "zero x four eight four seven four six four five four four four three four two four one",
        "`ABCDEFGH`": "A B C D E F G H",
    }
    for raw, say in swaps.items():
        text = text.replace(raw, say)
    return re.sub(r"\s+", " ", re.sub(r"`([^`]*)`", r"\1", text).replace("%", "percent ")).strip()


def sections(path: Path) -> list[tuple[str, str]]:
    title, rows, result = None, [], []
    for line in path.read_text().splitlines():
        if line.startswith("## "):
            if title and rows:
                result.append((title, spoken(" ".join(rows))))
            title = re.sub(r"[^a-z0-9]+", "-", line[3:].lower()).strip("-")
            rows = []
        elif title and line.strip():
            rows.append(line.strip())
    if title and rows:
        result.append((title, spoken(" ".join(rows))))
    return result


def finalize(out: Path, clips: list[Path], target_duration: float | None = None) -> None:
    if not clips:
        raise SystemExit("No narration clips exist yet.")
    concat = out / "narration-concat.txt"
    concat.write_text("".join(f"file '{clip.as_posix()}'\n" for clip in clips))
    master = out / "owner-voice-narration.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(concat), "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(master)], check=True)
    if target_duration is not None:
        raw_duration = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", str(master)], text=True))
        tempo = raw_duration / target_duration
        if not 0.80 <= tempo <= 1.15:
            raise SystemExit(f"Refusing duration fit: atempo {tempo:.3f} would make the narration unnatural.")
        timed = out / "owner-voice-narration-timed.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(master), "-filter:a", f"atempo={tempo:.6f}", "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(timed)], check=True)
        timed.replace(master)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", type=int, default=0, help="zero-based first script section")
    parser.add_argument("--count", type=int, default=3, help="sections per process; hard capped at 3")
    parser.add_argument("--threads", type=int, default=2, choices=(1, 2), help="CPU threads for Torch and BLAS")
    parser.add_argument("--min-available-gib", type=float, default=3.0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--finalize", action="store_true", help="join existing clips without generating")
    parser.add_argument("--target-duration", type=float, help="optionally fit the joined narration to this duration in seconds")
    parser.add_argument("--list", action="store_true")
    args = parser.parse_args()
    if not 1 <= args.count <= 3:
        raise SystemExit("--count must be between 1 and 3 to protect host resources.")
    if available_gib() < args.min_available_gib:
        raise SystemExit(f"Refusing synthesis: only {available_gib():.2f} GiB RAM available.")
    if shutil.disk_usage(ROOT).free < 6 * 1024**3:
        raise SystemExit("Refusing synthesis: need at least 6 GiB free disk in the project volume.")

    all_sections = sections(ROOT / "SCRIPT.md")
    out = ROOT / "assets" / "audio" / "narration-clips"
    out.mkdir(parents=True, exist_ok=True)
    all_clips = [out / f"{number:02d}-{title}.wav" for number, (title, _) in enumerate(all_sections)]
    if args.list:
        for number, (title, _) in enumerate(all_sections):
            print(f"{number:02d} {title}")
        return
    if args.finalize:
        finalize(out.parent, [clip for clip in all_clips if clip.exists()], args.target_duration)
        return

    chosen = list(enumerate(all_sections))[args.start:args.start + args.count]
    if not chosen:
        raise SystemExit("No script sections selected.")
    os.environ["OMP_NUM_THREADS"] = str(args.threads)
    os.environ["MKL_NUM_THREADS"] = str(args.threads)
    import torch
    import torchaudio
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    torch.set_num_threads(args.threads)
    torch.set_num_interop_threads(1)
    print(f"Loading shared Chatterbox model from {SHARED_HOME} with {args.threads} CPU threads.", flush=True)
    model = ChatterboxTurboTTS.from_pretrained(device="cpu")
    model.prepare_conditionals(str(ROOT / "assets" / "audio" / "owner-voice-reference.wav"))
    for number, (title, text) in chosen:
        target = out / f"{number:02d}-{title}.wav"
        if target.exists() and not args.force:
            print(f"Skipping {target.name}; already exists.", flush=True)
            continue
        print(f"Generating {target.name}", flush=True)
        with torch.inference_mode():
            audio = model.generate(text, repetition_penalty=1.18, temperature=0.82, top_p=0.95, top_k=900, exaggeration=0.38, cfg_weight=0.22)
        torchaudio.save(str(target), audio, model.sr)


if __name__ == "__main__":
    main()
