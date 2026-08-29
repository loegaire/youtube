#!/usr/bin/env python3
"""Assemble narration audio + retime Motion Canvas scenes to real audio durations.

Inputs:
  sha/kaggle-tts/batch-out/audio/seg_*.wav   (from Kaggle batch run)
  sha/kaggle-tts/manifest/segments.json
  sha/src/scenes/*.tsx

Actions:
  1. Parse scene files -> per-scene ordered shot ids (from `// Shot <id>` comments).
  2. For each shot: new duration = audio_duration + GAP (missing audio -> keep script timing).
  3. Rewrite each shot block's duration numbers (fade-in, waitFor, anim, fade-out)
     from the generated 0.18/0.18/0.6/0.22 split to the new duration.
  4. Assemble the global narration.wav: each segment placed at its shot start offset
     on the final timeline; write sha/narration.wav.
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path('/home/thinh/proj/youtube/sha')
KTTS = ROOT / 'kaggle-tts'
GAP = 0.3            # silence after each shot's speech
SAMPLE_RATE = 48000
MIN_DURATION = 1.5

# 0.6 anim / 0.18 fade-in / 0.18 wait / 0.22 fade-out (matches generated scene code)
R_ANIM, R_FADEIN, R_WAIT, R_FADEOUT = 0.6, 0.18, 0.18, 0.22


def seg_path(sid):
    return KTTS / 'batch-out' / 'audio' / f'seg_{sid.zfill(3)}.wav'


def parse_scenes():
    scenes = []
    for f in sorted((ROOT / 'src' / 'scenes').glob('*.tsx')):
        ids = re.findall(r'^\s*// Shot (\d+)\s*$', f.read_text(), re.M)
        num = int(f.name.split('-')[0])
        scenes.append((f, num, ids))
    return scenes


def retime_shot_block(src, shot_id, new_d):
    """Rewrite the duration numbers inside a `// Shot <id>` block. Returns (src, changed)."""
    pat = re.compile(
        r'(// Shot ' + re.escape(shot_id) + r'\n)(.*?)(?=\n\s*// Shot \d+|\n\}\);?\s*$)',
        re.S,
    )
    m = pat.search(src)
    if not m:
        return src, False
    block = m.group(2)
    subs = [
        (r'(opacity\(1, )([\d.]+)(\))', R_FADEIN),
        (r'(waitFor\()([\d.]+)(\))', R_WAIT),
        (r'(position\.x\(-?\d+, )([\d.]+)(, easeInOutCubic\))', R_ANIM),
        (r'(scale\(1\.04, )([\d.]+)(, easeInOutCubic\))', R_ANIM),
        (r'(animateData\()([\d.]+)(\))', R_ANIM),
        (r'(opacity\(0, )([\d.]+)(\))', R_FADEOUT),
    ]
    for rx, ratio in subs:
        new_block, n = re.subn(rx, rf'\g<1>{ratio * new_d:.4f}\g<3>', block, count=1)
        if n < 1:
            return src, False
        block = new_block
    return src[:m.start(2)] + block + src[m.end(2):], True


def main():
    apply = '--apply' in sys.argv
    segments = {s['id']: s for s in json.loads((KTTS / 'manifest' / 'segments.json').read_text())}

    def script_secs(t):
        m, s = t.split(':')
        return int(m) * 60 + int(s)

    # fallback durations from script timing for no-narration shots
    fallback = {}
    for sid, s in segments.items():
        if not s['text'] and s.get('t0') and s.get('t1'):
            fallback[sid] = max(script_secs(s['t1']) - script_secs(s['t0']), MIN_DURATION)

    scenes = parse_scenes()
    # normalize ids: match scene comment ids (1,2,..) with manifest ids (01,02,..)
    by_num = {str(int(k)): v for k, v in segments.items()}
    fallback = {str(int(k)): v for k, v in fallback.items()}
    global_t = 0.0
    placement = []  # (start_sample, samples)
    report = []

    for f, num, ids in scenes:
        for sid in ids:
            seg = by_num.get(sid)
            if seg is None:
                report.append((sid, 'NOT IN MANIFEST', None, None))
                continue
            p = seg_path(sid)
            if seg['text'] and p.exists():
                info = sf.info(str(p))
                d_speech = info.frames / info.samplerate
                d_total = max(d_speech + GAP, MIN_DURATION)
            elif not seg['text']:
                d_speech = 0.0
                d_total = fallback.get(sid, 3.0)
                report.append((sid, 'no-narration', 0.0, d_total))
            else:
                report.append((sid, 'MISSING AUDIO', None, None))
                continue

            if seg['text']:
                placement.append((int(round(global_t * SAMPLE_RATE)), sf.read(str(p), dtype='float64')[0]))

            if d_speech > 0 or not seg['text']:
                src = f.read_text()
                src2, changed = retime_shot_block(src, sid, d_total)
                if apply and changed:
                    f.write_text(src2)
                report.append((sid, 'ok' if changed else 'PATTERN MISS', round(d_speech, 2), round(d_total, 2)))

            global_t += d_total

    total_samples = int(round(global_t * SAMPLE_RATE)) + SAMPLE_RATE
    buf = np.zeros(total_samples, dtype='float64')
    for start, samples in placement:
        end = min(start + len(samples), total_samples)
        buf[start:end] += samples[: end - start]

    ok_count = sum(1 for r in report if r[1] == 'ok')
    issues = [r for r in report if r[1] in ('MISSING AUDIO', 'PATTERN MISS', 'NOT IN MANIFEST')]
    print(f'shots ok: {ok_count}/{len(report)} | timeline: {global_t:.2f}s ({global_t / 60:.2f} min)')
    if issues:
        print(f'{len(issues)} issues:')
        for r in issues[:25]:
            print(' ', r)
    if apply:
        sf.write(str(ROOT / 'narration.wav'), buf, SAMPLE_RATE)
        print(f'wrote {ROOT / "narration.wav"} ({len(buf) / SAMPLE_RATE:.2f}s)')
    else:
        print('DRY RUN (use --apply to write scenes + narration.wav)')


if __name__ == '__main__':
    main()
