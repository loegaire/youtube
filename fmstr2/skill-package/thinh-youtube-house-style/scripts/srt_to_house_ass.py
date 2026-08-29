#!/usr/bin/env python3
"""Convert a source-correct SRT into Thinh's large Nerd Font ASS caption rail."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


TIME_RE = re.compile(
    r"(?P<sh>\d{2}):(?P<sm>\d{2}):(?P<ss>\d{2}),(?P<sms>\d{3})\s+-->\s+"
    r"(?P<eh>\d{2}):(?P<em>\d{2}):(?P<es>\d{2}),(?P<ems>\d{3})"
)


def ass_time(hours: str, minutes: str, seconds: str, milliseconds: str) -> str:
    total_centiseconds = (
        int(hours) * 360_000
        + int(minutes) * 6_000
        + int(seconds) * 100
        + round(int(milliseconds) / 10)
    )
    out_hours, total_centiseconds = divmod(total_centiseconds, 360_000)
    out_minutes, total_centiseconds = divmod(total_centiseconds, 6_000)
    out_seconds, out_centiseconds = divmod(total_centiseconds, 100)
    return f"{out_hours}:{out_minutes:02d}:{out_seconds:02d}.{out_centiseconds:02d}"


def parse_srt(path: Path) -> list[tuple[str, str, str]]:
    cues: list[tuple[str, str, str]] = []
    blocks = re.split(r"\n\s*\n", path.read_text(encoding="utf-8").strip())
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if len(lines) < 3:
            continue
        match = TIME_RE.fullmatch(lines[1])
        if not match:
            continue
        values = match.groupdict()
        start = ass_time(values["sh"], values["sm"], values["ss"], values["sms"])
        end = ass_time(values["eh"], values["em"], values["es"], values["ems"])
        escaped_lines = [
            line.replace("\\", r"\\").replace("{", r"\{").replace("}", r"\}")
            for line in lines[2:]
        ]
        text = r"\N".join(escaped_lines)
        cues.append((start, end, text))
    return cues


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--font-size", type=int, default=56)
    parser.add_argument("--margin-v", type=int, default=42)
    parser.add_argument("--no-prompt", action="store_true")
    args = parser.parse_args()

    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,JetBrainsMono Nerd Font,{args.font_size},&H00EEF3F1,&H00000000,&H5C0B0D0A,&H5C0B0D0A,-1,0,0,0,100,100,-1,0,3,12,0,2,140,140,{args.margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    prompt = "" if args.no_prompt else r"{\c&H9ACB8C&}›{\c&HEEF3F1&}\h"
    rows = [header]
    for start, end, text in parse_srt(args.input):
        rows.append(f"Dialogue: 0,{start},{end},Caption,,0,0,0,,{prompt}{text}\n")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("".join(rows), encoding="utf-8")
    print(f"Wrote {len(rows) - 1} styled captions to {args.output}")


if __name__ == "__main__":
    main()
