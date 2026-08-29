#!/usr/bin/env python3
"""Build source-correct, word-timed subtitles and burn a restrained caption rail.

The narrator was generated section-by-section from SCRIPT.md. Whisper supplies
the timing, while this script replaces its occasional misheard wording with the
exact spoken script. It is safe to rerun after a new narration render.
"""

from __future__ import annotations

import argparse
import difflib
import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def spoken(text: str) -> str:
    swaps = {
        "`printf`": "print f", "`printf(buf)`": "print f, buff",
        '`printf("%s", buf)`': "print f, percent s, buff", "`buf`": "buff",
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
            title, rows = line[3:], []
        elif title and line.strip():
            rows.append(line.strip())
    if title and rows:
        result.append((title, spoken(" ".join(rows))))
    return result


def seconds(path: Path) -> float:
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=nk=1:nw=1", str(path),
    ], text=True))


def normalized(value: str) -> str:
    return "".join(re.findall(r"[a-z0-9]+", value.lower()))


def timestamp(value: float) -> str:
    milliseconds = max(0, round(value * 1000))
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds_value, milliseconds = divmod(milliseconds, 1_000)
    return f"{hours:02d}:{minutes:02d}:{seconds_value:02d},{milliseconds:03d}"


def ass_timestamp(value: float) -> str:
    centiseconds = max(0, round(value * 100))
    hours, centiseconds = divmod(centiseconds, 360_000)
    minutes, centiseconds = divmod(centiseconds, 6_000)
    seconds_value, centiseconds = divmod(centiseconds, 100)
    return f"{hours}:{minutes:02d}:{seconds_value:02d}.{centiseconds:02d}"


def source_timing(source: list[str], heard: list[dict], start: float, end: float) -> list[tuple[float, float]]:
    """Map exact source words to ASR timings, interpolating only unmatched words."""
    source_norm = [normalized(word) for word in source]
    heard_norm = [normalized(word["text"]) for word in heard]
    mapping: dict[int, int] = {}
    matcher = difflib.SequenceMatcher(a=source_norm, b=heard_norm, autojunk=False)
    for a, b, size in matcher.get_matching_blocks():
        for offset in range(size):
            mapping[a + offset] = b + offset

    anchors = sorted(mapping)
    timings: list[tuple[float, float]] = []
    for index in range(len(source)):
        if index in mapping:
            item = heard[mapping[index]]
            timings.append((float(item["start"]), float(item["end"])))
            continue
        before = max((anchor for anchor in anchors if anchor < index), default=None)
        after = min((anchor for anchor in anchors if anchor > index), default=None)
        if before is not None and after is not None:
            left = float(heard[mapping[before]]["end"])
            right = float(heard[mapping[after]]["start"])
            step = (right - left) / (after - before)
            word_start = left + step * (index - before - 0.15)
            word_end = left + step * (index - before + 0.75)
        elif before is not None:
            word_start = float(heard[mapping[before]]["end"])
            word_end = word_start + 0.18
        elif after is not None:
            word_end = float(heard[mapping[after]]["start"])
            word_start = word_end - 0.18
        else:
            width = (end - start) / max(1, len(source))
            word_start = start + index * width
            word_end = word_start + width * 0.82
        timings.append((max(start, word_start), min(end, max(word_start + 0.08, word_end))))
    return timings


def cues_for_section(words: list[str], timings: list[tuple[float, float]], section_end: float) -> list[tuple[float, float, str]]:
    cues, cursor = [], 0
    punctuation = re.compile(r"[.!?;:]$")
    while cursor < len(words):
        stop = min(cursor + 5, len(words))
        for candidate in range(cursor + 2, min(cursor + 6, len(words))):
            if punctuation.search(words[candidate]):
                stop = candidate + 1
                break
        start = timings[cursor][0]
        next_start = timings[stop][0] if stop < len(words) else section_end
        end = max(start + 0.70, next_start - 0.06)
        end = min(section_end - 0.02, end)
        cues.append((start, end, " ".join(words[cursor:stop])))
        cursor = stop
    return cues


def write_srt(cues: list[tuple[float, float, str]], path: Path) -> None:
    lines = []
    for number, (start, end, text) in enumerate(cues, start=1):
        lines.extend([str(number), f"{timestamp(start)} --> {timestamp(end)}", text, ""])
    path.write_text("\n".join(lines))


def write_ass(cues: list[tuple[float, float, str]], path: Path) -> None:
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,Inter,32,&H00FFFFFF,&H00000000,&H78000000,&H78000000,0,0,0,0,100,100,0,0,3,8,0,2,80,80,18,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    rows = [header]
    for start, end, text in cues:
        escaped = text.replace("\\", r"\\").replace("{", r"\{").replace("}", r"\}")
        rows.append(f"Dialogue: 0,{ass_timestamp(start)},{ass_timestamp(end)},Caption,,0,0,0,,{escaped}\n")
    path.write_text("".join(rows))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--transcript", type=Path, default=ROOT / "renders" / "transcript.json")
    parser.add_argument("--output", type=Path, default=ROOT / "assets" / "captions" / "format-string-wizard-corrected.srt")
    parser.add_argument("--ass-output", type=Path, default=ROOT / "assets" / "captions" / "format-string-wizard-corrected.ass")
    args = parser.parse_args()

    heard = json.loads(args.transcript.read_text())
    script_sections = sections(ROOT / "SCRIPT.md")
    clips = []
    for number, (title, _) in enumerate(script_sections):
        slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
        clip = ROOT / "assets" / "audio" / "narration-clips" / f"{number:02d}-{slug}.wav"
        if not clip.exists():
            raise SystemExit(f"Missing narration clip: {clip.name}")
        clips.append(clip)
    raw_durations = [seconds(clip) for clip in clips]
    final_duration = seconds(ROOT / "assets" / "audio" / "owner-voice-narration.wav")
    scale = final_duration / sum(raw_durations)

    cues, section_start = [], 0.0
    for (_, text), raw_duration in zip(script_sections, raw_durations):
        section_end = section_start + raw_duration * scale
        local_heard = [word for word in heard if section_start - 0.2 <= float(word["start"]) < section_end + 0.2]
        words = text.split()
        timings = source_timing(words, local_heard, section_start, section_end)
        cues.extend(cues_for_section(words, timings, section_end))
        section_start = section_end

    args.output.parent.mkdir(parents=True, exist_ok=True)
    write_srt(cues, args.output)
    write_ass(cues, args.ass_output)
    print(f"Wrote {len(cues)} source-correct captions to {args.output} and {args.ass_output}")


if __name__ == "__main__":
    main()
