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
  MessageSchedule, BitStrip, HashRound, ScriptShot
} from '../components';
'''

def cap(num):
    if num == '112':
        return 'caption().set("");'
    speech = shots_dict[num][1].strip()
    if speech.startswith('“') and speech.endswith('”'):
        speech = speech[1:-1]
    return f'caption().set({json.dumps(speech)});'

def dur(num):
    s = shots_dict[num]
    return to_sec(s[4]) - to_sec(s[3])

# Scene 01
def build_01():
    d1, d2, d3, d4 = dur("01"), dur("02"), dur("03"), dur("04")
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

  // Shot 01: Lock macro push-in & Login panel
  {cap("01")}
  const lock = createRef<Txt>();
  const login = createRef<LoginPanel>();
  view.add(<Txt ref={{lock}} text={{'\\uf023'}} fill={{C.cyan}} fontFamily={{FONT}} fontSize={{10}} />);
  view.add(<LoginPanel ref={{login}} opacity={{0}} scale={{0.15}} />);
  yield* all(lock().fontSize(380, {d1 * 0.4}), lock().opacity(0, {d1 * 0.4}));
  yield* all(login().opacity(1, {d1 * 0.2}), login().scale(1, {d1 * 0.2}, easeInOutCubic));
  yield* login().typePassword("hunter2");
  yield* login().transformToBullets();
  yield* waitFor({d1 * 0.2});

  // Shot 02: Bullets break into ASCII bytes and enter tunnel
  {cap("02")}
  const byteGroup = createRef<Node>();
  const tunnel = createRef<Node>();
  const digestTxt = createRef<Txt>();
  const bytes = ["68", "75", "6E", "74", "65", "72", "32"];
  view.add(
    <Node ref={{byteGroup}} opacity={{0}}>
      {{bytes.map((b, i) => (
        <Rect key={{String(i)}} width={{90}} height={{70}} stroke={{C.lime}} lineWidth={{3}} fill={{C.bg}} x={{-330 + i * 110}}>
          <Txt text={{b}} fill={{C.cyan}} fontFamily={{FONT}} fontSize={{32}} />
        </Rect>
      ))}}
    </Node>
  );
  view.add(
    <Node ref={{tunnel}} opacity={{0}} y={{-60}}>
      <Rect width={{1100}} height={{160}} stroke={{C.cyan}} lineWidth={{3}} fill={{C.bg}}>
        <Txt text={{'\\uf013 PROCESSING TUNNEL // ASCII -> BITS -> 64-CHAR DIGEST'}} fill={{C.cyan}} fontFamily={{FONT}} fontSize={{26}} />
      </Rect>
    </Node>
  );
  view.add(<Txt ref={{digestTxt}} text="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{24}} opacity={{0}} y={{120}} />);
  yield* all(login().scale(2.2, {d2 * 0.3}), login().opacity(0, {d2 * 0.2}), byteGroup().opacity(1, {d2 * 0.3}));
  yield* all(byteGroup().position.y(-60, {d2 * 0.3}), tunnel().opacity(1, {d2 * 0.3}));
  yield* all(byteGroup().scale(0.2, {d2 * 0.3}), digestTxt().opacity(1, {d2 * 0.3}));
  yield* waitFor({d2 * 0.1});

  // Shot 03: Carousel of 5 orbiting environments
  {cap("03")}
  const carousel = createRef<Node>();
  view.add(
    <Node ref={{carousel}} opacity={{0}}>
      {{['\\uf023 LOGIN', '\\uf15b DOWNLOAD', '\\uf1eb PCAP', '\\uf120 CODE', '\\uf1c0 DATABASE'].map((env, i) => (
        <TechPanel key={{String(i)}} title={{env}} w={{260}} h={{140}} x={{Math.cos(i * 1.256) * 520}} y={{Math.sin(i * 1.256) * 270}} scale={{0.75}} />
      ))}}
      <Txt text="HASH FUNCTIONS" fill={{C.lime}} fontFamily={{FONT}} fontSize={{64}} y={{-380}} />
      <Txt text="SHA-2" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{48}} y={{-310}} />
    </Node>
  );
  yield* all(tunnel().opacity(0, {d3 * 0.2}), digestTxt().rotation(90, {d3 * 0.3}), carousel().opacity(1, {d3 * 0.3}));
  yield* all(carousel().rotation(360, {d3 * 0.7}, easeInOutCubic));

  // Shot 04: Whip-pan into black workspace, assemble HASH
  {cap("04")}
  const hashLabel = createRef<Txt>();
  view.add(<Txt ref={{hashLabel}} text="" fill={{C.lime}} fontFamily={{FONT}} fontSize={{130}} opacity={{0}} y={{-40}} />);
  yield* all(carousel().position.x(-2000, {d4 * 0.3}), digestTxt().opacity(0, {d4 * 0.2}));
  yield* hashLabel().opacity(1, {d4 * 0.2});
  for (const ch of ['H', 'A', 'S', 'H']) {{
    hashLabel().text(hashLabel().text() + ch);
    yield* waitFor({d4 * 0.12});
  }}
  yield* waitFor({d4 * 0.3});
}});
'''

# Scene 02
def build_02():
    d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15 = [dur(f"{i:02d}") for i in range(5, 16)]
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

  // Shot 05: Linux auth server + DB viewer
  {cap("05")}
  const term = createRef<TerminalWindow>();
  const db = createRef<DatabaseViewer>();
  view.add(<TerminalWindow ref={{term}} opacity={{0}} x={{-460}} y={{-30}} scale={{0.85}} />);
  view.add(<DatabaseViewer ref={{db}} opacity={{0}} x={{460}} y={{-30}} scale={{0.85}} />);
  yield* all(term().opacity(1, {d5 * 0.3}), db().opacity(1, {d5 * 0.3}));
  yield* term().typeLine("$ tail -f /var/log/auth.log");
  yield* term().typeLine("input: correct-horse-battery-staple");
  db().addRow("alice", "9f82ab", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  yield* waitFor({d5 * 0.4});

  // Shot 06: Plaintext vs Verifier
  {cap("06")}
  const cmp = createRef<Node>();
  view.add(
    <Node ref={{cmp}} opacity={{0}} y={{200}}>
      <Rect width={{400}} height={{70}} stroke={{C.red}} lineWidth={{3}} fill={{C.bg}} x={{-300}}>
        <Txt text={{'PLAINTEXT  \\uf00d'}} fill={{C.red}} fontFamily={{FONT}} fontSize={{32}} />
      </Rect>
      <Rect width={{400}} height={{70}} stroke={{C.yellow}} lineWidth={{3}} fill={{C.bg}} x={{300}}>
        <Txt text={{'VERIFIER  \\uf00c'}} fill={{C.yellow}} fontFamily={{FONT}} fontSize={{32}} />
      </Rect>
    </Node>
  );
  yield* cmp().opacity(1, {d6 * 0.3});
  yield* waitFor({d6 * 0.7});

  // Shot 07: Fast guessing speed stamp
  {cap("07")}
  const stamp = createRef<Rect>();
  const kdfTxt = createRef<Txt>();
  view.add(
    <Rect ref={{stamp}} width={{950}} height={{90}} stroke={{C.red}} lineWidth={{4}} fill={{C.bg}} opacity={{0}} y={{-80}}>
      <Txt text="TOO FAST FOR PASSWORD STORAGE" fill={{C.red}} fontFamily={{FONT}} fontSize={{42}} />
    </Rect>
  );
  view.add(<Txt ref={{kdfTxt}} text="USE: ARGON2ID / SCRYPT / BCRYPT / PBKDF2" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{36}} opacity={{0}} y={{40}} />);
  yield* all(stamp().opacity(1, {d7 * 0.3}), stamp().scale(1.08, {d7 * 0.3}));
  yield* kdfTxt().opacity(1, {d7 * 0.3});
  yield* waitFor({d7 * 0.4});

  // Shot 08: File integrity sha256sum
  {cap("08")}
  yield* all(term().opacity(0, {d8 * 0.2}), db().opacity(0, {d8 * 0.2}), cmp().opacity(0, {d8 * 0.2}), stamp().opacity(0, {d8 * 0.2}), kdfTxt().opacity(0, {d8 * 0.2}));
  const termFile = createRef<TerminalWindow>();
  const releasePanel = createRef<TechPanel>();
  const scanLine = createRef<Line>();
  view.add(<TerminalWindow ref={{termFile}} opacity={{0}} x={{-440}} y={{-30}} scale={{0.85}} />);
  view.add(<TechPanel ref={{releasePanel}} title="RELEASE PAGE" icon={{'\\uf15b'}} x={{440}} y={{-30}} w={{720}} h={{440}} opacity={{0}} scale={{0.85}} />);
  view.add(<Line ref={{scanLine}} points={{[[-750, 60], [750, 60]]}} stroke={{C.lime}} lineWidth={{4}} opacity={{0}} />);
  yield* all(termFile().opacity(1, {d8 * 0.3}), releasePanel().opacity(1, {d8 * 0.3}));
  yield* termFile().typeLine("$ sha256sum debian-image.iso");
  yield* termFile().typeLine("ba7816bf8f01cfea414140de5dae2223...");
  releasePanel().line("EXPECTED SHA-256:", C.yellow, 26);
  releasePanel().line("ba7816bf8f01cfea414140de5dae2223...", C.lime, 24);
  yield* all(scanLine().opacity(1, {d8 * 0.2}), scanLine().position.y(-100, {d8 * 0.3}));
  yield* waitFor({d8 * 0.2});

  // Shot 09: Avalanche effect on 1 bit flip
  {cap("09")}
  const ripple = createRef<Txt>();
  view.add(<Txt ref={{ripple}} text="BIT 0 -> 1 : ENTIRE DIGEST FLICKERS AND CHANGES" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{36}} opacity={{0}} y={{240}} />);
  yield* all(ripple().opacity(1, {d9 * 0.3}), termFile().scale(1.05, {d9 * 0.5}));
  yield* waitFor({d9 * 0.5});

  // Shot 10 & 11: Digital signatures
  {cap("10")}
  yield* all(termFile().opacity(0, {d10 * 0.2}), releasePanel().opacity(0, {d10 * 0.2}), scanLine().opacity(0, {d10 * 0.2}), ripple().opacity(0, {d10 * 0.2}));
  const sigPanel = createRef<Node>();
  view.add(
    <Node ref={{sigPanel}} opacity={{0}}>
      <TechPanel title="SOFTWARE PACKAGE" icon={{'\\uf15b'}} x={{-480}} w={{400}} h={{260}} />
      <TechPanel title="PRIVATE KEY SIGNATURE" icon={{'\\uf084'}} x={{0}} w={{400}} h={{260}} />
      <TechPanel title="PUBLIC VERIFICATION" icon={{'\\uf3ed'}} x={{480}} w={{400}} h={{260}} />
    </Node>
  );
  yield* all(sigPanel().opacity(1, {d10 * 0.4}), sigPanel().scale(1.04, {d10 * 0.6}));

  {cap("11")}
  const authTxt = createRef<Txt>();
  view.add(<Txt ref={{authTxt}} text="AUTHENTIC + UNMODIFIED" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{48}} opacity={{0}} y={{220}} />);
  yield* authTxt().opacity(1, {d11 * 0.4});
  yield* waitFor({d11 * 0.6});

  // Shot 12: Network packets
  {cap("12")}
  yield* all(sigPanel().opacity(0, {d12 * 0.2}), authTxt().opacity(0, {d12 * 0.2}));
  const pcap = createRef<TechPanel>();
  view.add(<TechPanel ref={{pcap}} title="PACKET INSPECTOR" icon={{'\\uf1eb'}} w={{1100}} h={{480}} opacity={{0}} />);
  yield* pcap().opacity(1, {d12 * 0.3});
  pcap().line("PACKET 192.168.1.10 -> 10.0.0.1 [TCP] PAYLOAD CHECKSUM: VALID", C.lime, 26);
  pcap().line("PACKET 192.168.1.15 -> 10.0.0.1 [TLS] PAYLOAD DIGEST: 8f01cfea", C.cyan, 26);
  yield* waitFor({d12 * 0.5});

  // Shot 13: Hash tables
  {cap("13")}
  yield* pcap().opacity(0, {d13 * 0.2});
  const mapEditor = createRef<CodeEditor>();
  view.add(<CodeEditor ref={{mapEditor}} opacity={{0}} scale={{0.9}} />);
  yield* mapEditor().opacity(1, {d13 * 0.3});
  mapEditor().setCode("unordered_map<string, int> users;\\nusers[\\\"alice\\\"] = 1;\\nusers[\\\"bob\\\"]   = 2;");
  yield* waitFor({d13 * 0.5});

  // Shot 14: Hash Table vs Cryptographic Hash
  {cap("14")}
  yield* mapEditor().opacity(0, {d14 * 0.2});
  const mapCmp = createRef<Node>();
  view.add(
    <Node ref={{mapCmp}} opacity={{0}}>
      <TechPanel title="HASH TABLE" icon={{'\\uf013'}} x={{-420}} w={{650}} h={{380}} />
      <TechPanel title="CRYPTOGRAPHIC HASH" icon={{'\\uf3ed'}} x={{420}} w={{650}} h={{380}} />
      <Txt text="DIFFERENT GOALS" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{56}} y={{250}} />
    </Node>
  );
  yield* all(mapCmp().opacity(1, {d14 * 0.4}), mapCmp().scale(1.04, {d14 * 0.6}));

  // Shot 15: Stream pull back -> FROM ONE BIT -> SHA-256
  {cap("15")}
  yield* mapCmp().opacity(0, {d15 * 0.2});
  const fromOneBit = createRef<Txt>();
  view.add(<Txt ref={{fromOneBit}} text="FROM ONE BIT -> SHA-256" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{64}} opacity={{0}} />);
  yield* all(fromOneBit().opacity(1, {d15 * 0.4}), fromOneBit().scale(1.1, {d15 * 0.6}));
  yield* waitFor({d15 * 0.4});
}});
'''

# Scene 03
def build_03():
    d16, d17, d18, d19, d20, d21 = [dur(str(i)) for i in range(16, 22)]
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

  // Shot 16: BitStrip 10110010 count
  {cap("16")}
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
  {cap("17")}
  const modTxt = createRef<Txt>();
  view.add(<Txt ref={{modTxt}} text="5 mod 2 = 1" fill={{C.lime}} fontFamily={{FONT}} fontSize={{64}} opacity={{0}} y={{180}} />);
  yield* modTxt().opacity(1, {d17 * 0.3});
  yield* waitFor({d17 * 0.7});

  // Shot 18: FIXED OUTPUT 1 BIT
  {cap("18")}
  const fixTxt = createRef<Txt>();
  view.add(<Txt ref={{fixTxt}} text="FIXED OUTPUT: 1 BIT" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{48}} opacity={{0}} y={{-240}} />);
  yield* fixTxt().opacity(1, {d18 * 0.4});
  yield* waitFor({d18 * 0.6});

  // Shot 19: Collisions cascade
  {cap("19")}
  yield* all(bitStrip().opacity(0, {d19 * 0.2}), cntTxt().opacity(0, {d19 * 0.2}), modTxt().opacity(0, {d19 * 0.2}), fixTxt().opacity(0, {d19 * 0.2}));
  const cascade = createRef<TechPanel>();
  view.add(<TechPanel ref={{cascade}} title="COLLISION CASCADE" icon={{'\\uf188'}} w={{1100}} h={{480}} opacity={{0}} />);
  yield* cascade().opacity(1, {d19 * 0.3});
  cascade().line("00000000 -> 0", C.cyan, 28);
  cascade().line("00000011 -> 0  [COLLISION]", C.red, 28);
  cascade().line("11111111 -> 0  [COLLISION]", C.red, 28);
  yield* waitFor({d19 * 0.5});

  // Shot 20: Preimage, Second Preimage, Collision
  {cap("20")}
  const tri = createRef<Node>();
  view.add(
    <Node ref={{tri}} opacity={{0}} y={{180}}>
      <Txt text="PREIMAGE    SECOND PREIMAGE    COLLISION" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{36}} />
    </Node>
  );
  yield* tri().opacity(1, {d20 * 0.4});
  yield* waitFor({d20 * 0.6});

  // Shot 21: Attack paths blocked
  {cap("21")}
  const block = createRef<Txt>();
  view.add(<Txt ref={{block}} text="COMPUTATIONALLY INFEASIBLE" fill={{C.lime}} fontFamily={{FONT}} fontSize={{52}} opacity={{0}} y={{-220}} />);
  yield* block().opacity(1, {d21 * 0.4});
  yield* waitFor({d21 * 0.6});
}});
'''

# Scene 04
def build_04():
    d22, d23, d24, d25, d26, d27, d28, d29 = [dur(str(i)) for i in range(22, 30)]
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

  // Shot 22: Replace 1-bit toy with SHA-256
  {cap("22")}
  const title = createRef<Txt>();
  view.add(<Txt ref={{title}} text="SHA-256 ENGINE" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{72}} opacity={{0}} y={{-380}} />);
  yield* title().opacity(1, {d22 * 0.4});
  yield* waitFor({d22 * 0.6});

  // Shot 23 & 24: 512-bit block & 8 registers
  {cap("23")}
  const blockInput = createRef<Node>();
  view.add(
    <Node ref={{blockInput}} opacity={{0}} y={{-180}}>
      <Rect width={{190}} height={{84}} x={{-480}} scale={{1.4}} stroke={{C.cyan}} lineWidth={{3}} fill={{C.bg}} justifyContent="center" alignItems="center"><Txt text="512 BITS INPUT" fill={{C.cyan}} fontFamily={{FONT}} fontSize={{22}} /></Rect>
      <Line points={{[[-340, 0], [340, 0]]}} stroke={{C.lime}} lineWidth={{4}} endArrow />
      <Rect width={{190}} height={{84}} x={{480}} scale={{1.4}} stroke={{C.yellow}} lineWidth={{3}} fill={{C.bg}} justifyContent="center" alignItems="center"><Txt text="256 BITS DIGEST" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{22}} /></Rect>
    </Node>
  );
  yield* blockInput().opacity(1, {d23 * 0.4});
  yield* waitFor({d23 * 0.6});

  {cap("24")}
  const regBank = createRef<RegisterBank>();
  view.add(<RegisterBank ref={{regBank}} opacity={{0}} y={{80}} scale={{0.85}} />);
  yield* regBank().opacity(1, {d24 * 0.3});
  yield* regBank().setValues(["6a09e667","bb67ae85","3c6ef372","a54ff53a","510e527f","9b05688c","1f83d9ab","5be0cd19"]);
  yield* waitFor({d24 * 0.5});

  // Shot 25 & 26: Padding & original message length
  {cap("25")}
  yield* all(blockInput().opacity(0, {d25 * 0.2}), regBank().opacity(0, {d25 * 0.2}));
  const padNode = createRef<Node>();
  view.add(
    <Node ref={{padNode}} opacity={{0}}>
      <Txt text="PADDING SCHEME" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{48}} y={{-360}} />
      <Rect width={{94}} height={{54}} x={{-360}} fill={{C.bg}} stroke={{C.cyan}} lineWidth={{3}} justifyContent="center" alignItems="center"><Txt text="61" fill={{C.cyan}} fontFamily={{FONT}} fontSize={{27}} /></Rect>
      <Rect width={{94}} height={{54}} x={{-240}} fill={{C.bg}} stroke={{C.cyan}} lineWidth={{3}} justifyContent="center" alignItems="center"><Txt text="62" fill={{C.cyan}} fontFamily={{FONT}} fontSize={{27}} /></Rect>
      <Rect width={{94}} height={{54}} x={{-120}} fill={{C.bg}} stroke={{C.cyan}} lineWidth={{3}} justifyContent="center" alignItems="center"><Txt text="63" fill={{C.cyan}} fontFamily={{FONT}} fontSize={{27}} /></Rect>
      <Rect width={{94}} height={{54}} x={{40}} fill={{C.bg}} stroke={{C.yellow}} lineWidth={{3}} justifyContent="center" alignItems="center"><Txt text="80" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{27}} /></Rect>
      <Txt text="00 00 ... 0000000000000018" fill={{C.lime}} fontFamily={{FONT}} fontSize={{32}} x={{360}} />
    </Node>
  );
  yield* padNode().opacity(1, {d25 * 0.4});
  yield* waitFor({d25 * 0.6});

  {cap("26")}
  const lenTxt = createRef<Txt>();
  view.add(<Txt ref={{lenTxt}} text="64-BIT LENGTH FIELD = 24 BITS (0x18)" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{36}} opacity={{0}} y={{180}} />);
  yield* lenTxt().opacity(1, {d26 * 0.4});
  yield* waitFor({d26 * 0.6});

  // Shot 27, 28, 29: Message schedule W0..W15 -> W0..W63
  {cap("27")}
  yield* all(padNode().opacity(0, {d27 * 0.2}), lenTxt().opacity(0, {d27 * 0.2}));
  const schedule = createRef<MessageSchedule>();
  view.add(<MessageSchedule ref={{schedule}} opacity={{0}} y={{-50}} />);
  yield* schedule().opacity(1, {d27 * 0.4});
  yield* waitFor({d27 * 0.6});

  {cap("28")}
  yield* schedule().expandSchedule();
  yield* waitFor({d28 * 0.3});

  {cap("29")}
  const eqTxt = createRef<Txt>();
  view.add(<Txt ref={{eqTxt}} text="W[t] = σ1(W[t-2]) + W[t-7] + σ0(W[t-15]) + W[t-16]" fill={{C.yellow}} fontFamily={{FONT}} fontSize={{34}} opacity={{0}} y={{180}} />);
  yield* eqTxt().opacity(1, {d29 * 0.4});
  yield* waitFor({d29 * 0.6});
}});
'''

# Scene 05 (30-42)
def build_05():
    shots_code = []
    for i in range(30, 43):
        num = str(i)
        d = dur(num)
        shots_code.append(f'''
  // Shot {num}
  {cap(num)}
  const round_{num} = createRef<Node>();
  const visual_{num} = createRef<ScriptShot>();
  view.add(
    <Node ref={{round_{num}}} opacity={{0}}>
      <ScriptShot ref={{visual_{num}}} scene={{5}} shot="{num}" y={{-20}} />
    </Node>
  );
  yield* all(round_{num}().opacity(1, {d * 0.18}), round_{num}().position.x({55 if i % 2 else -55}, {d * 0.6}, easeInOutCubic), round_{num}().scale(1.04, {d * 0.6}, easeInOutCubic), visual_{num}().animateData({d * 0.6}));
  yield* waitFor({d * 0.18});
  yield* round_{num}().opacity(0, {d * 0.22});
  round_{num}().remove();
''')
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

{"".join(shots_code)}
}});
'''

# Generic builder for scenes 06 to 18
def build_scene(idx, start_s, end_s, title, icon):
    shots_code = []
    for i in range(start_s, end_s + 1):
        num = str(i)
        key = f"{i:02d}" if i < 10 else num
        d = dur(key)
        shots_code.append(f'''
  // Shot {num}
  {cap(key)}
  const stage_{num} = createRef<Node>();
  const visual_{num} = createRef<ScriptShot>();
  view.add(
    <Node ref={{stage_{num}}} opacity={{0}}>
      <ScriptShot ref={{visual_{num}}} scene={{{idx}}} shot="{num}" y={{-20}} />
    </Node>
  );
  yield* all(stage_{num}().opacity(1, {d * 0.18}), stage_{num}().position.x({55 if i % 2 else -55}, {d * 0.6}, easeInOutCubic), stage_{num}().scale(1.04, {d * 0.6}, easeInOutCubic), visual_{num}().animateData({d * 0.6}));
  yield* waitFor({d * 0.18});
  yield* stage_{num}().opacity(0, {d * 0.22});
  stage_{num}().remove();
''')
    return f'''{HEADER}

export default makeScene2D(function* (view) {{
  view.add(<Node>{{bg()}}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={{caption}} />);

{"".join(shots_code)}
}});
'''

# Write files
(OUT_DIR / '01-hook.tsx').write_text(build_01())
(OUT_DIR / '02-examples.tsx').write_text(build_02())
(OUT_DIR / '03-toy-hash.tsx').write_03() if hasattr(OUT_DIR / '03-toy-hash.tsx', 'write_03') else (OUT_DIR / '03-toy-hash.tsx').write_text(build_03())
(OUT_DIR / '04-sha-inner-workings.tsx').write_text(build_04())
(OUT_DIR / '05-mini-sha.tsx').write_text(build_05())

scene_ranges = [
    (1, 1, 4, "THE LOCKED SECRET", "\\uf023"),
    (2, 5, 15, "WHERE HASHES SHOW UP", "\\uf1c0"),
    (3, 16, 21, "THE TOY HASH", "\\uf013"),
    (4, 22, 29, "ENTER SHA-256", "\\uf013"),
    (5, 30, 42, "THE COMPRESSION ENGINE", "\\uf013"),
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
    1: '01-hook', 2: '02-examples', 3: '03-toy-hash', 4: '04-sha-inner-workings', 5: '05-mini-sha',
    6:  '06-security', 7:  '07-break-the-toy', 8:  '08-toy-hash-source',
    9:  '09-executing-toy-hash', 10: '10-why-not-sha', 11: '11-hashing-speed',
    12: '12-hashing-vs-plaintext', 13: '13-breaking-sha', 14: '14-sha256-vs-sha1',
    15: '15-attacking-toy', 16: '16-other-failures', 17: '17-return-sha256', 18: '18-final-summary'
}

for idx, start_s, end_s, title, icon in scene_ranges:
    base = SCENE_MAP[idx]
    code = build_scene(idx, start_s, end_s, title, icon)
    (OUT_DIR / f'{base}.tsx').write_text(code)
    print(f"Wrote scene {idx:02d} ({base}.tsx)")

print("Handcrafted scene generator complete.")
