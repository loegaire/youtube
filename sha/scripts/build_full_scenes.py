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
  C, FONT, TechPanel, bg, bytePacket, label, rail, register, Caption,
  LoginPanel, TerminalWindow, CodeEditor, DatabaseViewer, RegisterBank,
  MessageSchedule, BitStrip, HashRound
} from '../components';
'''

def shot_caption(num):
    speech = shots_dict[num][1].strip()
    return f'caption().set({json.dumps(speech)});'

def shot_dur(num):
    s = shots_dict[num]
    return to_sec(s[4]) - to_sec(s[3])

# Scene 03 (16-21)
def build_scene_03():
    d16, d17, d18, d19, d20, d21 = [shot_dur(str(i)) for i in range(16, 22)]
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

  // Shot 16: BitStrip 10110010 count
  {shot_caption("16")}
  const bitStrip = createRef<BitStrip>();
  const cntTxt = createRef<Txt>();
  view.add(<BitStrip ref={{bitStrip}} opacity={{0}} y={{-80}} />);
  view.add(<Txt ref={{cntTxt}} text="ONES COUNT = 5" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{44}} opacity={{0}} y={{80}} />);
  yield* all(bitStrip().opacity(1, {d16 * 0.3}), cntTxt().opacity(1, {d16 * 0.3}));
  yield* bitStrip().highlightBit(0);
  yield* bitStrip().highlightBit(2);
  yield* bitStrip().highlightBit(3);
  yield* bitStrip().highlightBit(6);
  yield* waitFor({d16 * 0.3});

  // Shot 17: Modulo operation -> 1
  {shot_caption("17")}
  const modTxt = createRef<Txt>();
  view.add(<Txt ref={{modTxt}} text="5 mod 2 = 1" fill={{C.lime}} fontFamily={{FONT}} fontSize={64} opacity={{0}} y={{180}} />);
  yield* modTxt().opacity(1, {d17 * 0.3});
  yield* waitFor({d17 * 0.7});

  // Shot 18: FIXED OUTPUT 1 BIT
  {shot_caption("18")}
  const fixTxt = createRef<Txt>();
  view.add(<Txt ref={{fixTxt}} text="FIXED OUTPUT: 1 BIT" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{48}} opacity={{0}} y={{-240}} />);
  yield* fixTxt().opacity(1, {d18 * 0.4});
  yield* waitFor({d18 * 0.6});

  // Shot 19: Collisions cascade
  {shot_caption("19")}
  yield* all(bitStrip().opacity(0, {d19 * 0.2}), cntTxt().opacity(0, {d19 * 0.2}), modTxt().opacity(0, {d19 * 0.2}), fixTxt().opacity(0, {d19 * 0.2}));
  const cascade = createRef<TechPanel>();
  view.add(<TechPanel ref={{cascade}} title="COLLISION CASCADE" icon="\\uf188" w={{1100}} h={{480}} opacity={{0}} />);
  yield* cascade().opacity(1, {d19 * 0.3});
  cascade().line("00000000 -> 0", C.cyan, 28);
  cascade().line("00000011 -> 0  [COLLISION]", C.red, 28);
  cascade().line("11111111 -> 0  [COLLISION]", C.red, 28);
  yield* waitFor({d19 * 0.5});

  // Shot 20: Preimage, Second Preimage, Collision
  {shot_caption("20")}
  const tri = createRef<Node>();
  view.add(
    <Node ref={{tri}} opacity={{0}} y={{180}}>
      {label("PREIMAGE    SECOND PREIMAGE    COLLISION", C.yellow, 36)}
    </Node>
  );
  yield* tri().opacity(1, {d20 * 0.4});
  yield* waitFor({d20 * 0.6});

  // Shot 21: Attack paths blocked
  {shot_caption("21")}
  const block = createRef<Txt>();
  view.add(<Txt ref={{block}} text="COMPUTATIONALLY INFEASIBLE" fill={{C.lime}} fontFamily={{FONT}} fontSize={{52}} opacity={{0}} y={{-220}} />);
  yield* block().opacity(1, {d21 * 0.4});
  yield* waitFor({d21 * 0.6});
}});
'''

# Scene 04 (22-29)
def build_scene_04():
    d22, d23, d24, d25, d26, d27, d28, d29 = [shot_dur(str(i)) for i in range(22, 30)]
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

  // Shot 22: Replace 1-bit toy with SHA-256
  {shot_caption("22")}
  const title = createRef<Txt>();
  view.add(<Txt ref={{title}} text="SHA-256 ENGINE" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{72}} opacity={{0}} y={{-380}} />);
  yield* title().opacity(1, {d22 * 0.4});
  yield* waitFor({d22 * 0.6});

  // Shot 23 & 24: 512-bit block & 8 registers
  {shot_caption("23")}
  const blockInput = createRef<Node>();
  view.add(
    <Node ref={{blockInput}} opacity={{0}} y={{-180}}>
      {bytePacket("512 BITS INPUT", C.cyan, {x: -480, scale: 1.4})}
      {rail(-340, 0, 340, 0, C.lime)}
      {bytePacket("256 BITS DIGEST", C.yellow, {x: 480, scale: 1.4})}
    </Node>
  );
  yield* blockInput().opacity(1, {d23 * 0.4});
  yield* waitFor({d23 * 0.6});

  {shot_caption("24")}
  const regBank = createRef<RegisterBank>();
  view.add(<RegisterBank ref={{regBank}} opacity={{0}} y={{80}} scale={{0.85}} />);
  yield* regBank().opacity(1, {d24 * 0.3});
  yield* regBank().setValues(["6a09e667","bb67ae85","3c6ef372","a54ff53a","510e527f","9b05688c","1f83d9ab","5be0cd19"]);
  yield* waitFor({d24 * 0.5});

  // Shot 25 & 26: Padding & original message length
  {shot_caption("25")}
  yield* all(blockInput().opacity(0, {d25 * 0.2}), regBank().opacity(0, {d25 * 0.2}));
  const padNode = createRef<Node>();
  view.add(
    <Node ref={{padNode}} opacity={{0}}>
      {label("PADDING SCHEME", C.yellow, 48, {y: -360})}
      {bytePacket("61", C.cyan, {x: -360})}
      {bytePacket("62", C.cyan, {x: -240})}
      {bytePacket("63", C.cyan, {x: -120})}
      {bytePacket("80", C.yellow, {x: 40})}
      <Txt text="00 00 ... 0000000000000018" fill={{C.lime}} fontFamily={{FONT}} fontSize={{32}} x={{360}} />
    </Node>
  );
  yield* padNode().opacity(1, {d25 * 0.4});
  yield* waitFor({d25 * 0.6});

  {shot_caption("26")}
  const lenTxt = createRef<Txt>();
  view.add(<Txt ref={{lenTxt}} text="64-BIT LENGTH FIELD = 24 BITS (0x18)" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{36}} opacity={{0}} y={{180}} />);
  yield* lenTxt().opacity(1, {d26 * 0.4});
  yield* waitFor({d26 * 0.6});

  // Shot 27, 28, 29: Message schedule W0..W15 -> W0..W63
  {shot_caption("27")}
  yield* all(padNode().opacity(0, {d27 * 0.2}), lenTxt().opacity(0, {d27 * 0.2}));
  const schedule = createRef<MessageSchedule>();
  view.add(<MessageSchedule ref={{schedule}} opacity={{0}} y={{-50}} />);
  yield* schedule().opacity(1, {d27 * 0.4});
  yield* waitFor({d27 * 0.6});

  {shot_caption("28")}
  yield* schedule().expandSchedule();
  yield* waitFor({d28 * 0.3});

  {shot_caption("29")}
  const eqTxt = createRef<Txt>();
  view.add(<Txt ref={{eqTxt}} text="W[t] = σ1(W[t-2]) + W[t-7] + σ0(W[t-15]) + W[t-16]" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{34}} opacity={{0}} y={{180}} />);
  yield* eqTxt().opacity(1, {d29 * 0.4});
  yield* waitFor({d29 * 0.6});
}});
'''

# Write Scene 03 and 04
(OUT_DIR / '03-toy-hash.tsx').write_text(build_scene_03())
(OUT_DIR / '04-sha-inner-workings.tsx').write_text(build_scene_04())
print("Wrote scenes 03 and 04.")
