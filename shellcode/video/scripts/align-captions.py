#!/usr/bin/env python3
"""Align the exact script to Whisper word timings and emit SRT, ASS, and browser cues."""

from __future__ import annotations

import difflib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "assets" / "audio"
CAPTIONS = ROOT / "assets" / "captions"


def norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def stamp(seconds: float, comma: bool = True) -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    secs, milliseconds = divmod(milliseconds, 1000)
    separator = "," if comma else "."
    return f"{hours:02}:{minutes:02}:{secs:02}{separator}{milliseconds:03}"


def ass_stamp(seconds: float) -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    secs, milliseconds = divmod(milliseconds, 1000)
    return f"{hours}:{minutes:02}:{secs:02}.{milliseconds // 10:02}"


def source_words(manifest: list[dict]) -> list[dict]:
    words: list[dict] = []
    for segment in manifest:
        for text in segment["text"].strip().split():
            words.append({
                "text": text,
                "norm": norm(text),
                "segment": segment["id"],
                "segment_start": float(segment["start"]),
                "segment_end": float(segment["end"]),
            })
    return words


def align(source: list[dict], asr: list[dict]) -> tuple[list[float], list[float], float, dict[str, float]]:
    starts: list[float | None] = [None] * len(source)
    ends: list[float | None] = [None] * len(source)
    matches = 0
    segment_matches: dict[str, int] = {}
    segment_words: dict[str, int] = {}

    # Align scene-by-scene so repeated phrases cannot pull timings across scene boundaries.
    cursor = 0
    while cursor < len(source):
        segment = source[cursor]["segment"]
        stop = cursor
        while stop < len(source) and source[stop]["segment"] == segment:
            stop += 1
        segment_start = source[cursor]["segment_start"]
        segment_end = source[cursor]["segment_end"]
        segment_words[segment] = stop - cursor
        scene_asr = [
            word for word in asr
            if segment_start <= (float(word["start"]) + float(word["end"])) / 2 < segment_end
        ]
        matcher = difflib.SequenceMatcher(
            a=[word["norm"] for word in source[cursor:stop]],
            b=[norm(word["text"]) for word in scene_asr],
            autojunk=False,
        )
        for block in matcher.get_matching_blocks():
            for offset in range(block.size):
                source_index = cursor + block.a + offset
                asr_index = block.b + offset
                starts[source_index] = float(scene_asr[asr_index]["start"])
                ends[source_index] = float(scene_asr[asr_index]["end"])
                matches += 1
                segment_matches[segment] = segment_matches.get(segment, 0) + 1

        # Fill ASR misses locally between reliable exact-token anchors.
        anchors = [i for i in range(cursor, stop) if starts[i] is not None]
        boundaries = [cursor - 1, *anchors, stop]
        for left, right in zip(boundaries, boundaries[1:]):
            first = left + 1
            last = right - 1
            if first > last:
                continue
            left_time = segment_start if left < cursor else float(ends[left])
            right_time = segment_end if right >= stop else float(starts[right])
            span = max(0.08, right_time - left_time)
            count = last - first + 1
            for offset, index in enumerate(range(first, last + 1)):
                starts[index] = left_time + span * offset / count
                ends[index] = left_time + span * (offset + 0.82) / count
        cursor = stop

    ratios = {
        segment: round(segment_matches.get(segment, 0) / count, 4)
        for segment, count in segment_words.items()
    }
    return (
        [float(value) for value in starts],
        [float(value) for value in ends],
        matches / max(1, len(source)),
        ratios,
    )


def build_cues(source: list[dict], starts: list[float], ends: list[float]) -> list[dict]:
    cues = []
    cursor = 0
    while cursor < len(source):
        stop = min(cursor + 7, len(source))
        for index in range(cursor + 4, min(cursor + 9, len(source))):
            if source[index]["segment"] != source[cursor]["segment"]:
                stop = index
                break
            if re.search(r"[,!?;:.]$", source[index]["text"]):
                stop = index + 1
                break
        while stop > cursor + 1 and source[stop - 1]["segment"] != source[cursor]["segment"]:
            stop -= 1
        cue_start = max(source[cursor]["segment_start"], starts[cursor] - 0.04)
        cue_end = min(source[stop - 1]["segment_end"], ends[stop - 1] + 0.16)
        if cue_end - cue_start < 0.55:
            cue_end = min(source[stop - 1]["segment_end"], cue_start + 0.55)
        cues.append({
            "start": round(cue_start, 3),
            "end": round(cue_end, 3),
            "text": " ".join(word["text"] for word in source[cursor:stop]),
        })
        cursor = stop
    return cues


def main() -> None:
    transcript_path = Path(sys.argv[1]) if len(sys.argv) > 1 else AUDIO / "owner-voice-narration.transcript.json"
    manifest = json.loads((AUDIO / "narration-segments.json").read_text())
    asr = json.loads(transcript_path.read_text())
    source = source_words(manifest)
    starts, ends, match_ratio, segment_ratios = align(source, asr)
    cues = build_cues(source, starts, ends)
    CAPTIONS.mkdir(parents=True, exist_ok=True)

    srt_lines = []
    for index, cue in enumerate(cues, 1):
        srt_lines.extend([
            str(index),
            f"{stamp(cue['start'])} --> {stamp(cue['end'])}",
            cue["text"],
            "",
        ])
    (CAPTIONS / "shellcode-explainer.srt").write_text("\n".join(srt_lines))

    ass_header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: House,JetBrainsMono Nerd Font,56,&H00EEF3F1,&H009ACB8C,&H00110D0A,&HD0110D0A,-1,0,0,0,100,100,-1,0,3,3,0,2,120,120,38,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ass_lines = [
        f"Dialogue: 0,{ass_stamp(cue['start'])},{ass_stamp(cue['end'])},House,,0,0,0,,"
        + r"{\c&H009ACB8C&}> {\c&H00EEF3F1&}"
        + cue["text"].replace("{", r"\{").replace("}", r"\}")
        for cue in cues
    ]
    (CAPTIONS / "shellcode-explainer.ass").write_text(ass_header + "\n".join(ass_lines) + "\n")
    (CAPTIONS / "cues.js").write_text(
        "window.SHELLCODE_CAPTION_CUES = " + json.dumps(cues, ensure_ascii=False) + ";\n"
    )
    (CAPTIONS / "alignment-report.json").write_text(json.dumps({
        "source_words": len(source),
        "asr_words": len(asr),
        "exact_match_ratio": round(match_ratio, 4),
        "segment_exact_match_ratio": segment_ratios,
        "segments_below_0_65": [
            segment for segment, ratio in segment_ratios.items() if ratio < 0.65
        ],
        "cues": len(cues),
        "transcript": transcript_path.name,
    }, indent=2) + "\n")
    print(json.dumps({"cues": len(cues), "exact_match_ratio": round(match_ratio, 4)}, indent=2))


if __name__ == "__main__":
    main()
