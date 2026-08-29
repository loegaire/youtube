#!/usr/bin/env python3
"""Fit generated clips to scene windows, preserve breaths, and build the clean master."""

from __future__ import annotations

import json
import math
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets" / "audio"
CLIPS = AUDIO / "narration-clips"
FITTED = AUDIO / "narration-fitted"


def duration(path: Path) -> float:
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=nk=1:nw=1", str(path),
    ], text=True))


def loudnorm_measure(path: Path) -> dict:
    process = subprocess.run([
        "ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
        "-af", "loudnorm=I=-16:LRA=9:TP=-1.5:print_format=json",
        "-f", "null", "-",
    ], check=True, text=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    match = re.search(r"\{\s*\"input_i\".*?\}", process.stderr, re.S)
    if not match:
        raise SystemExit("Could not parse the loudness measurement.")
    return json.loads(match.group(0))


def main() -> None:
    manifest = json.loads((AUDIO / "narration-segments.json").read_text())
    FITTED.mkdir(parents=True, exist_ok=True)
    report = []
    concat_lines = []
    for item in manifest:
        source = CLIPS / f"{item['id']}-{item['slug']}.wav"
        if not source.exists():
            raise SystemExit(f"Missing narration clip: {source.name}")
        target = FITTED / source.name
        raw = duration(source)
        window = float(item["duration"])
        speech_target = max(0.5, window - 0.42)
        tempo = raw / speech_target
        if tempo > 1.12:
            raise SystemExit(f"Refusing {source.name}: required atempo {tempo:.3f} exceeds 1.12.")
        filters = ["highpass=f=65", "lowpass=f=15500"]
        applied_tempo = 1.0
        if tempo > 1.01:
            applied_tempo = tempo
            filters.append(f"atempo={tempo:.8f}")
        fitted_speech = raw / applied_tempo
        pad = max(0.0, window - fitted_speech)
        filters.extend([
            f"apad=pad_dur={pad:.8f}",
            f"atrim=duration={window:.8f}",
            "alimiter=limit=0.94:attack=5:release=80",
        ])
        subprocess.run([
            "ffmpeg", "-y", "-v", "error", "-i", str(source),
            "-af", ",".join(filters),
            "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(target),
        ], check=True)
        concat_lines.append(f"file '{target.as_posix()}'\n")
        report.append({
            "id": item["id"],
            "raw_duration": round(raw, 4),
            "scene_duration": round(window, 4),
            "atempo": round(applied_tempo, 5),
            "tail_pad": round(pad, 4),
        })

    concat = AUDIO / "narration-concat.txt"
    concat.write_text("".join(concat_lines))
    unmastered = AUDIO / "owner-voice-narration-unmastered.wav"
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(concat),
        "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(unmastered),
    ], check=True)
    measured = loudnorm_measure(unmastered)
    loudnorm_filter = (
        "loudnorm=I=-16:LRA=9:TP=-1.5:"
        f"measured_I={measured['input_i']}:"
        f"measured_LRA={measured['input_lra']}:"
        f"measured_TP={measured['input_tp']}:"
        f"measured_thresh={measured['input_thresh']}:"
        f"offset={measured['target_offset']}:linear=true:print_format=summary,"
        "alimiter=limit=0.94:attack=5:release=80"
    )
    first_pass = AUDIO / "owner-voice-narration-firstpass.wav"
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", str(unmastered),
        "-af", loudnorm_filter,
        "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", str(first_pass),
    ], check=True)
    # A final measured dynamic pass corrects limiter/oversampling drift while leaving
    # the close-mic breaths and mouth texture untouched (there is deliberately no gate).
    final = AUDIO / "owner-voice-narration.wav"
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", str(first_pass),
        "-af", "loudnorm=I=-16:LRA=9:TP=-1.5",
        "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", str(final),
    ], check=True)
    compressed = AUDIO / "owner-voice-narration.m4a"
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", str(final),
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(compressed),
    ], check=True)
    (AUDIO / "narration-fit-report.json").write_text(json.dumps({
        "duration": round(duration(final), 6),
        "loudnorm_measurement": measured,
        "segments": report,
        "max_atempo": max(row["atempo"] for row in report),
        "max_tail_pad": max(row["tail_pad"] for row in report),
    }, indent=2) + "\n")
    print(f"Wrote {final} ({duration(final):.3f}s)")


if __name__ == "__main__":
    main()
