#!/usr/bin/env python3
import json
import re
from pathlib import Path

shots_path = Path('/home/thinh/proj/youtube/sha/scripts/shots.json')
with open(shots_path) as f:
    raw_shots = json.load(f)

shots_dict = {s[0]: s for s in raw_shots}

def to_sec(t_str):
    m, s = map(int, t_str.split(':'))
    return m * 60 + s

OUT_DIR = Path('/home/thinh/proj/youtube/sha/src/scenes')

HEADER = '''import {makeScene2D, Node, Txt, Rect, Circle, Line} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {
  C, FONT, TechPanel, bg, bytePacket, label, rail, register, Caption, ShotVisual,
  LoginPanel, TerminalWindow, CodeEditor, DatabaseViewer, RegisterBank,
  MessageSchedule, BitStrip, HashRound
} from '../components';
'''

def shot_caption(num):
    if num == '112':
        return 'caption().set("");'
    speech = shots_dict[num][1].strip()
    if speech.startswith('“') and speech.endswith('”'):
        speech = speech[1:-1]
    return f'caption().set({json.dumps(speech)});'

def shot_dur(num):
    s = shots_dict[num]
    return to_sec(s[4]) - to_sec(s[3])

# Generate Scene 05
def build_scene_05():
    shots_code = []
    for i in range(30, 43):
        num = str(i)
        d = shot_dur(num)
        shots_code.append(f'''
  // Shot {num}
  {shot_caption(num)}
  const node_{num} = createRef<Node>();
  view.add(
    <Node ref={{node_{num}}} opacity={{0}}>
      <TechPanel title="COMPRESSION ENGINE" icon="\\uf013" w={{1200}} h={{480}} y={{-20}} />
      <RegisterBank opacity={{0.8}} y={{-140}} scale={{0.65}} />
      <Txt text="T1 = h + Σ1(e) + Ch(e,f,g) + K[t] + W[t] | T2 = Σ0(a) + Maj(a,b,c)" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{24}} y={{180}} />
    </Node>
  );
  yield* all(node_{num}().opacity(1, {d * 0.3}), node_{num}().scale(1.04, {d * 0.7}));
  yield* waitFor({d * 0.5});
  yield* node_{num}().opacity(0, {d * 0.2});
  node_{num}().remove();
''')
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

{"".join(shots_code)}
}});
'''

# Generate generic builder for remaining scenes (06 to 18)
def build_generic_scene(scene_idx, start_shot, end_shot, title_prefix, icon):
    shots_code = []
    for i in range(start_shot, end_shot + 1):
        num = str(i)
        d = shot_dur(num)
        shots_code.append(f'''
  // Shot {num}
  {shot_caption(num)}
  const node_{num} = createRef<Node>();
  view.add(
    <Node ref={{node_{num}}} opacity={{0}}>
      <TechPanel title="{title_prefix} // SHOT {num}" icon="{icon}" w={{1200}} h={{500}} y={{-20}} />
      <RegisterBank opacity={{0.75}} y={{-150}} scale={{0.65}} />
      <Txt text="STATE MACHINE ACTIVE // PROCESSING DATA PIPELINE..." fill={{C.cyan}} fontFamily={{FONT}} fontSize={{26}} y={{180}} />
    </Node>
  );
  yield* all(node_{num}().opacity(1, {d * 0.3}), node_{num}().position.y(-10, {d * 0.7}, easeInOutCubic));
  yield* waitFor({d * 0.5});
  yield* node_{num}().opacity(0, {d * 0.2});
  node_{num}().remove();
''')
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

{"".join(shots_code)}
}});
'''

(OUT_DIR / '05-mini-sha.tsx').write_text(build_scene_05())

scene_ranges = [
    (6, 43, 45, "64 ROUNDS IN MOTION", "\\uf013"),
    (7, 46, 48, "FINAL DIGEST", "\\uf023"),
    (8, 49, 53, "TOYHASH8 SOURCE", "\\uf120"),
    (9, 54, 62, "EXECUTIVE TOYHASH8", "\\uf013"),
    (10, 63, 65, "TOY vs SHA-256", "\\uf188"),
    (11, 66, 68, "HASHING SPEED", "\\uf120"),
    (12, 69, 73, "PLAINTEXT vs VERIFIER", "\\uf1c0"),
    (13, 74, 81, "BREAKING SHA TAXONOMY", "\\uf188"),
    (14, 82, 84, "SHA-256 vs SHA-1", "\\uf3ed"),
    (15, 85, 93, "ATTACKING TOYHASH8", "\\uf188"),
    (16, 94, 97, "SYSTEM FAILURE MODES", "\\uf188"),
    (17, 98, 100, "RETURN TO SHA-256", "\\uf013"),
    (18, 101, 112, "FINAL SUMMARY", "\\uf3ed"),
]

SCENE_MAP = {
    6:  '06-security', 7:  '07-break-the-toy', 8:  '08-toy-hash-source',
    9:  '09-executing-toy-hash', 10: '10-why-not-sha', 11: '11-hashing-speed',
    12: '12-hashing-vs-plaintext', 13: '13-breaking-sha', 14: '14-sha256-vs-sha1',
    15: '15-attacking-toy', 16: '16-other-failures', 17: '17-return-sha256', 18: '18-final-summary'
}

for idx, start_s, end_s, title, icon in scene_ranges:
    base = SCENE_MAP[idx]
    code = build_generic_scene(idx, start_s, end_s, title, icon)
    (OUT_DIR / f'{base}.tsx').write_text(code)
    print(f"Wrote scene {idx:02d} ({base}.tsx)")
