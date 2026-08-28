import {Circle, Line, Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, Reference, waitFor} from '@motion-canvas/core';
import {C, FONT} from './Studio';
import {toyHash8Hex} from './ToyHash8';

export interface ScriptShotProps extends NodeProps {
  scene: number;
  shot: string;
}

/** A semantic visual board for the later script shots.  The scene files only
 * orchestrate timing and camera movement; this component owns the objects
 * that make each narrated idea visible. */
export class ScriptShot extends Node {
  private readonly shotNumber: number;
  private readonly contentNode = createRef<Node>();
  private readonly orbitGroup = createRef<Node>();
  private readonly bitRing = createRef<Node>();
  private readonly lockGlyph = createRef<Txt>();
  private readonly loginUi = createRef<Node>();
  private readonly passwordText = createRef<Txt>();
  private readonly toyDigest = createRef<Txt>();
  private readonly digestLineOne = createRef<Txt>();
  private readonly digestLineTwo = createRef<Txt>();
  private readonly scheduleTrack = createRef<Node>();
  private readonly scheduleCursor = createRef<Rect>();
  private readonly dialMarker = createRef<Node>();
  private readonly registerShift = createRef<Node>();
  private readonly flowNodes: Reference<Node>[] = [];

  public constructor(props: ScriptShotProps) {
    const {shot, ...rest} = props;
    super(rest);
    const n = Number(shot);
    this.shotNumber = n;
    this.add(<Node ref={this.contentNode}>{this.content(n)}</Node>);
  }

  private label(text: string, x: number, y: number, color = C.cyan, size = 24) {
    return <Txt text={text} fill={color} fontFamily={FONT} fontSize={size} x={x} y={y} />;
  }

  private panel(title: string, x: number, y: number, w: number, h: number, color: string, lines: string[], lineColors: string[] = []) {
    return <Rect width={w} height={h} x={x} y={y} fill={C.bg} stroke={color} lineWidth={3}>
      <Txt text={title} fill={color} fontFamily={FONT} fontSize={18} x={-w / 2 + 18} width={w - 36} offset={[-1, 0]} y={-h / 2 + 22} textAlign="left" />
      {lines.map((line, i) => <Txt key={`${title}-${i}`} text={line} fill={lineColors[i] ?? C.cyan} fontFamily={FONT} fontSize={20} x={-w / 2 + 22} width={w - 44} offset={[-1, 0]} y={-h / 2 + 70 + i * 44} textAlign="left" />)}
    </Rect>;
  }

  private flow(items: string[], y: number, color = C.lime, start = -570, box = 175, step = 245) {
    return <Node>{items.map((item, i) => {
      const itemRef = createRef<Node>();
      this.flowNodes.push(itemRef);
      return <Node ref={itemRef} key={item}>
      <Rect width={box} height={62} x={start + i * step} y={y} fill={C.bg} stroke={color} lineWidth={3}><Txt text={item} fill={color} fontFamily={FONT} fontSize={19} /></Rect>
      {i < items.length - 1 && <Line points={[[start + box / 2 + i * step, y], [start + step - box / 2 + i * step, y]]} stroke={C.cyan} lineWidth={4} endArrow />}
      </Node>;
    })}</Node>;
  }

  private bits(value: string, x: number, y: number, color = C.cyan) {
    return value.split('').map((bit, i) => <Rect key={`${value}-${i}`} width={28} height={32} x={x + i * 32} y={y} fill={C.bg} stroke={color} lineWidth={2}><Txt text={bit} fill={color} fontFamily={FONT} fontSize={18} /></Rect>);
  }

  private registers(y: number) {
    const names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return names.map((name, i) => <Rect key={name} width={126} height={56} x={-535 + i * 153} y={y + (i % 2) * 16} fill={C.bg} stroke={i === 0 || i === 4 ? C.yellow : C.lime} lineWidth={2}>
      <Txt text={name} fill={C.yellow} fontFamily={FONT} fontSize={16} y={-12} />
      <Txt text={['6a09e667', 'bb67ae85', '3c6ef372', 'a54ff53a', '510e527f', '9b05688c', '1f83d9ab', '5be0cd19'][i]} fill={C.cyan} fontFamily={FONT} fontSize={12} y={12} />
    </Rect>);
  }

  private digest(y: number, color = C.yellow, size = 19) {
    return <Txt text="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" fill={color} fontFamily={FONT} fontSize={size} x={-640} y={y} />;
  }

  private content(n: number): any {
    if (n === 1) return <Node><Txt ref={this.lockGlyph} text="\uf023" fill={C.cyan} fontFamily={FONT} fontSize={86} x={-45} y={-145} scale={0.08} /><Node ref={this.loginUi} opacity={0} scale={0.8}>{this.panel('LAPTOP LOGIN', 0, 50, 720, 250, C.lime, ['username    hacker', 'password   '])}<Txt ref={this.passwordText} text="•••••••" fill={C.lime} fontFamily={FONT} fontSize={24} x={-210} y={39} textAlign="left" />{this.label('[ ENTER ]     12:00:00', -180, 120, C.yellow, 21)}{this.label('cursor → password field', -145, 175, C.orange, 21)}</Node></Node>;
    if (n === 2) return <Node>{this.label('hunter2  →  ASCII BYTES', -450, -175, C.yellow, 26)}{this.flow(['68', '75', '6E', '74', '65', '72', '32'], -60, C.cyan, -540, 130, 180)}{this.panel('PROCESSING TUNNEL', 0, 65, 1260, 100, C.cyan, ['01101000 01110101 01101110 01110100 01100101 01110010 00110010'], [C.cyan])}{this.label('ASCII → BINARY → HEX DIGEST', -315, 145, C.lime, 25)}{this.digest(182, C.yellow, 16)}</Node>;
    if (n === 3) return <Node>{this.label('HASH FUNCTIONS', -230, -180, C.lime, 52)}{this.label('SHA-2', -70, -120, C.yellow, 32)}<Node ref={this.orbitGroup}>{this.panel('LOGIN', -520, 40, 230, 130, C.cyan, ['password'])}{this.panel('DOWNLOAD', -255, 120, 230, 130, C.cyan, ['debian.iso'])}{this.panel('PCAP', 10, 40, 230, 130, C.cyan, ['packets'])}{this.panel('CODE', 275, 120, 230, 130, C.cyan, ['source'])}{this.panel('DATABASE', 540, 40, 230, 130, C.cyan, ['verifier'])}</Node>{this.digest(190, C.yellow, 15)}</Node>;
    if (n === 4) return <Node>{this.label('H  A  S  H', -270, -20, C.lime, 92)}{this.label('hex characters assemble into a vocabulary', -345, 120, C.cyan, 23)}</Node>;
    if (n === 5) return <Node>{this.panel('/var/log/auth.log', -390, 0, 590, 270, C.lime, ['$ tail -f auth.log', 'login attempt: alice', 'input: correct-horse-battery-staple'])}{this.panel('users table', 350, 0, 570, 270, C.cyan, ['user     salt     password_hash', 'alice    9f82ab   e3b0c442…'], [C.cyan, C.yellow])}{this.flow(['PASSWORD', 'HASH', 'VERIFIER'], 155, C.yellow, -255)}</Node>;
    if (n === 6) return <Node>{this.panel('PLAINTEXT', -360, 0, 520, 260, C.red, ['password visible', '\uf00d store this'], [C.red, C.red])}{this.panel('VERIFIER', 360, 0, 520, 260, C.yellow, ['salt + derived value', '\uf00c compare later'], [C.cyan, C.yellow])}{this.label('password + unique salt + password KDF  →  verifier', -490, 155, C.orange, 21)}</Node>;
    if (n === 7) return <Node>{this.label('SHA-256 GUESS LOOP', -330, -175, C.red, 28)}{this.flow(['GUESS', 'SHA-256', 'COMPARE'], 0, C.red, -300)}{Array.from({length: 12}, (_, i) => <Rect key={String(i)} width={18} height={18} x={-520 + i * 88} y={110} fill={C.red} stroke={C.red} lineWidth={1} />)}{this.label('TOO FAST FOR PASSWORD STORAGE', -330, 165, C.red, 27)}{this.label('ARGON2ID / SCRYPT / BCRYPT / PBKDF2', -330, 198, C.yellow, 18)}</Node>;
    if (n === 8) return <Node>{this.panel('DOWNLOAD', -390, 0, 520, 260, C.cyan, ['debian-image.iso', '$ sha256sum debian-image.iso'])}{this.panel('TRUSTED RELEASE PAGE', 370, 0, 610, 260, C.yellow, ['SHA-256', 'ba7816bf8f01cfea…', '✓ every character matches'], [C.yellow, C.cyan, C.lime])}{this.label('scan → compare → trusted value', -280, 160, C.lime, 22)}</Node>;
    if (n === 9) return <Node>{this.label('FILE BYTE', -500, -130, C.cyan, 22)}{this.bits('01010110', -420, -70)}{this.label('0  →  1', -85, -55, C.red, 30)}{this.label('DIGEST BEFORE', -480, 35, C.cyan, 20)}{this.digest(70, C.cyan, 15)}{this.label('DIGEST AFTER', -480, 125, C.yellow, 20)}{this.digest(160, C.yellow, 15)}</Node>;
    if (n === 10) return <Node>{this.panel('RELEASE PACKAGE', -490, 0, 360, 210, C.cyan, ['software.tar.gz'])}{this.flow(['SHA-256', 'PRIVATE KEY', 'SIGNATURE'], 0, C.yellow, -190)}{this.panel('VERIFY', 500, 0, 300, 210, C.lime, ['package + public key', '✓ digest matches'])}</Node>;
    if (n === 11) return <Node>{this.panel('HASH ONLY', -350, 0, 460, 220, C.red, ['INTEGRITY SIGNAL', 'publisher unknown'], [C.red, C.orange])}{this.panel('SIGNATURE + PUBLIC KEY', 380, 0, 590, 220, C.yellow, ['AUTHENTIC', 'UNMODIFIED'], [C.yellow, C.lime])}</Node>;
    if (n === 12) return <Node>{this.panel('PACKET INSPECTOR', 0, 0, 1100, 280, C.cyan, ['12:00:01  192.168.1.10 → 10.0.0.1  TCP  a4 7f 3c 91', '12:00:02  192.168.1.15 → 10.0.0.1  TLS  8f 01 cf ea', 'payload digest: 8f01cfea  // recomputed ✓'])}</Node>;
    if (n === 13) return <Node>{this.panel('unordered_map<string, int> users;', -350, 0, 620, 260, C.cyan, ['users["alice"] = 1;', 'users["bob"]   = 2;'])}{this.flow(['alice', 'hash()', 'BUCKET 03'], 0, C.yellow, -320)}{this.flow(['bob', 'hash()', 'BUCKET 03'], 82, C.orange, -320)}{this.label('collision → equality check', -160, 160, C.red, 22)}</Node>;
    if (n === 14) return <Node>{this.panel('HASH TABLE', -360, 0, 560, 260, C.cyan, ['choose bucket quickly', 'goal: SPEED'])}{this.panel('CRYPTOGRAPHIC HASH', 380, 0, 620, 260, C.yellow, ['resist collisions / preimages', 'goal: SECURITY PROPERTIES'])}{this.label('DIFFERENT GOALS', -180, 165, C.orange, 30)}</Node>;
    if (n === 15) return <Node>{this.label('FROM ONE BIT  →  SHA-256', -465, -20, C.yellow, 52)}{this.flow(['BIT', 'STATE', 'MIX', 'DIGEST'], 100, C.cyan)}</Node>;
    if (n === 16) return <Node>{this.label('BIT STRIP // COUNT ONE-BITS', -350, -165, C.yellow, 25)}{this.bits('10110010', -125, -45, C.cyan)}{this.label('1     2     3     4     5', -260, 75, C.yellow, 29)}{this.label('COUNT THE ONE-BITS', -250, 155, C.orange, 25)}</Node>;
    if (n === 17) return <Node>{this.label('5  mod  2', -275, -35, C.yellow, 62)}{this.label('=', -25, -35, C.lime, 62)}{this.label('1', 70, -35, C.yellow, 92)}{this.label('8 bits  →  1 bit', -180, 135, C.cyan, 28)}</Node>;
    if (n === 18) return <Node>{this.label('FIXED OUTPUT', -250, -65, C.yellow, 46)}{this.label('1 BIT', -90, 60, C.cyan, 55)}{this.label('tiny answer / huge input', -210, 150, C.orange, 24)}</Node>;
    if (n === 19) return <Node>{this.label('MILLIONS OF INPUTS', -370, -170, C.cyan, 28)}{Array.from({length: 28}, (_, i) => <Txt key={String(i)} text={i % 2 ? '10110010' : '01001101'} fill={i % 3 ? C.cyan : C.red} fontFamily={FONT} fontSize={17} x={-520 + (i % 7) * 170} y={-100 + Math.floor(i / 7) * 55} />)}{this.panel('0', -230, 160, 250, 70, C.red, ['collision pile'])}{this.panel('1', 230, 160, 250, 70, C.red, ['collision pile'])}</Node>;
    if (n === 20) return <Node>{this.panel('PREIMAGE', -430, 0, 350, 190, C.yellow, ['chosen digest → input'])}{this.panel('SECOND PREIMAGE', 0, 0, 350, 190, C.yellow, ['known message → twin'])}{this.panel('COLLISION', 430, 0, 350, 190, C.red, ['two messages → same'])}{this.label('compression alone is not security', -285, 145, C.orange, 24)}</Node>;
    if (n === 21) return <Node>{this.flow(['TARGET OUTPUT', 'KNOWN MESSAGE', 'TWO MESSAGES'], 0, C.red, -450)}{this.label('COMPUTATIONALLY INFEASIBLE', -300, 155, C.lime, 28)}</Node>;
    if (n === 22) return <Node>{this.panel('TOY HASH', -360, 0, 430, 220, C.red, ['1-bit output'])}<Line points={[[-140, 0], [140, 0]]} stroke={C.lime} lineWidth={5} endArrow />{this.panel('SHA-256 ENGINE', 390, 0, 560, 220, C.yellow, ['256-bit digest', 'state machine'])}</Node>;
    if (n === 23) return <Node>{this.panel('ARBITRARY-LENGTH MESSAGE', -400, 0, 500, 230, C.cyan, ['bytes in'])}{this.flow(['512 BITS', 'COMPRESSION', '256 BITS'], 0, C.yellow, -120)}{this.panel('DIGEST', 460, 0, 300, 230, C.yellow, ['fixed size'])}</Node>;
    if (n === 24) return <Node>{this.label('256-BIT STATE = 8 × 32-BIT WORDS', -490, -180, C.yellow, 27)}{this.registers(-45)}</Node>;
    if (n === 25) return <Node>{this.label('abc', -530, -100, C.yellow, 52)}{this.label('61  62  63', -530, -35, C.cyan, 28)}{this.flow(['DATA', '1', 'ZEROS', 'LENGTH'], 90, C.lime, -390)}{this.label('pad until exactly 512 bits', -255, 175, C.orange, 22)}</Node>;
    if (n === 26) return <Node>{this.panel('ORIGINAL MESSAGE', -370, 0, 430, 210, C.cyan, ['abc', '24 bits'])}{this.panel('FINAL 64 BITS', 350, 0, 500, 210, C.yellow, ['000…00011000', 'length = 24 bits'])}{this.label('data + original length', -190, 145, C.orange, 24)}</Node>;
    if (n === 27) return <Node>{this.label('512-BIT BLOCK → 16 WORDS', -415, -170, C.yellow, 27)}<Line points={[[-620, 0], [620, 0]]} stroke={C.grid} lineWidth={3} /><Node ref={this.scheduleTrack}>{Array.from({length: 16}, (_, i) => <Rect key={String(i)} width={72} height={52} x={-545 + (i % 8) * 155} y={-65 + Math.floor(i / 8) * 85} fill={C.bg} stroke={C.cyan} lineWidth={2}><Txt text={`W${i}`} fill={C.cyan} fontFamily={FONT} fontSize={18} /></Rect>)}</Node><Rect ref={this.scheduleCursor} width={6} height={170} x={-545} y={5} fill={C.orange} stroke={C.orange} lineWidth={1} />{this.label('mechanical index cursor  →', -260, 140, C.orange, 23)}</Node>;
    if (n === 28) return <Node>{this.label('MESSAGE SCHEDULE // W0 … W63', -365, -180, C.yellow, 28)}{Array.from({length: 64}, (_, i) => <Txt key={String(i)} text={`W${i}`} fill={i < 16 ? C.cyan : C.lime} fontFamily={FONT} fontSize={14} x={-620 + (i % 16) * 82} y={-110 + Math.floor(i / 16) * 58} />)}{this.label('new words expand from W15 → W16 → … → W63', -370, 155, C.orange, 21)}</Node>;
    if (n === 29) return <Node>{this.label('W[t] = σ1(W[t−2]) + W[t−7] + σ0(W[t−15]) + W[t−16]', -560, -145, C.yellow, 22)}{this.bits('101100101001', -430, -45, C.cyan)}{this.bits('010010110100', -430, 20, C.orange)}{this.flow(['ROTATE', 'SHIFT', 'ADD', 'W[t]'], 105, C.lime, -360)}</Node>;
    if (n === 30) return <Node>{this.label('INITIAL STATE // 8 PREDEFINED 32-BIT WORDS', -500, -185, C.yellow, 25)}{this.registers(-55)}{this.label('H0  →  a b c d e f g h', -260, 155, C.cyan, 22)}</Node>;
    if (n === 31) return <Node>{this.label('WORKING VARIABLES', -430, -185, C.yellow, 28)}{this.registers(-60)}{this.label('a       b       c       d       e       f       g       h', -520, 150, C.orange, 20)}</Node>;
    if (n === 32) return <Node>{this.panel('BIT MIXER', -330, 0, 520, 250, C.yellow, ['individual bits', 'Boolean operations'], [C.cyan, C.yellow])}{this.panel('FUNCTION BANK', 350, 0, 520, 250, C.lime, ['Ch(e,f,g)', 'Maj(a,b,c)'], [C.yellow, C.yellow])}{this.label('e  f  g  →  output bits', -240, 155, C.cyan, 22)}</Node>;
    if (n === 33) return <Node>{this.label('Ch(e,f,g) = (e AND f) XOR ((NOT e) AND g)', -560, -170, C.yellow, 24)}{this.bits('10110010', -420, -70, C.yellow)}{this.bits('11001100', -420, 10, C.cyan)}{this.bits('00111100', -420, 90, C.lime)}{this.label('control mask e chooses f or g', -265, 160, C.orange, 21)}</Node>;
    if (n === 34) return <Node>{this.label('MAJ(a,b,c) // MOST COMMON BIT', -470, -175, C.yellow, 26)}{['0, 0, 1  →  0', '1, 1, 0  →  1', '1, 0, 1  →  1'].map((line, i) => <Txt key={line} text={line} fill={i === 1 ? C.yellow : C.cyan} fontFamily={FONT} fontSize={27} x={-320} y={-75 + i * 70} />)}</Node>;
    if (n === 35) return <Node>{this.label('TINY OPERATIONS  ×  REPEAT × 64', -450, -175, C.yellow, 28)}{this.flow(['Ch', 'Maj', 'Σ0 / Σ1', 'ADD', 'SHIFT'], 10, C.lime)}{this.label('state changes every round', -245, 158, C.cyan, 22)}</Node>;
    if (n === 36) return <Node>{this.label('Σ0(a) = ROTR²(a) XOR ROTR¹³(a) XOR ROTR²²(a)', -530, -170, C.yellow, 24)}{this.bits('101100101001', -430, -65, C.cyan)}{this.bits('010010110100', -430, 10, C.orange)}{this.bits('001011010010', -430, 85, C.yellow)}{this.label('three rotated streams → XOR', -250, 160, C.lime, 22)}</Node>;
    if (n === 37) return <Node>{this.label('Σ1(e) = ROTR⁶(e) XOR ROTR¹¹(e) XOR ROTR²⁵(e)', -530, -170, C.yellow, 24)}{this.bits('111001001011', -430, -65, C.cyan)}{this.bits('100100101110', -430, 10, C.orange)}{this.bits('010010011101', -430, 85, C.yellow)}{this.label('different rotation constants', -250, 160, C.lime, 22)}</Node>;
    if (n === 38) return <Node>{this.label('ROUND 17', -110, -175, C.yellow, 48)}{this.registers(-40)}{this.label('current W[t]  //  current state', -235, 160, C.cyan, 22)}</Node>;
    if (n === 39) return <Node>{this.label('T1 = h + Σ1(e) + Ch(e,f,g) + K[t] + W[t]', -560, -175, C.yellow, 25)}{this.flow(['h', 'Σ1(e)', 'Ch', 'K[t]', 'W[t]'], -20, C.lime)}{this.label('mod 2^32', -70, 150, C.orange, 25)}</Node>;
    if (n === 40) return <Node>{this.label('T2 = Σ0(a) + Maj(a,b,c)', -430, -175, C.yellow, 29)}{this.flow(['Σ0(a)', 'Maj(a,b,c)', 'T2'], 0, C.lime, -310)}{this.label('parallel upper rail', -180, 150, C.cyan, 22)}</Node>;
    if (n === 41) return <Node>{this.label('REGISTER SHIFT // NEW a AND e ENTER', -500, -175, C.yellow, 27)}<Node ref={this.registerShift}>{this.registers(-65)}</Node><Line points={[[-560, 75], [560, 75]]} stroke={C.orange} lineWidth={5} endArrow />{this.label('h → g → f → e → d → c → b → a', -360, 155, C.cyan, 21)}</Node>;
    if (n === 42) return <Node>{this.label('ROUND 17', -420, -40, C.orange, 38)}<Line points={[[-170, -45], [170, -45]]} stroke={C.lime} lineWidth={5} endArrow />{this.label('ROUND 18', 220, -40, C.yellow, 38)}{this.label('W17 → W18  //  conveyor accelerates', -305, 110, C.cyan, 23)}</Node>;
    if (n === 43) return <Node><Node><Circle width={260} height={260} fill={C.bg} stroke={C.lime} lineWidth={4} x={-330} y={0} /><Circle width={190} height={190} fill={C.bg} stroke={C.grid} lineWidth={2} x={-330} y={0} />{this.label('17 / 64', -395, -30, C.yellow, 31)}{this.label('ROUND', -385, 12, C.cyan, 18)}{Array.from({length: 8}, (_, i) => this.label(String(i * 8).padStart(2, '0'), -330 + Math.cos(i * Math.PI / 4) * 160, Math.sin(i * Math.PI / 4) * 160, i === 2 ? C.yellow : C.cyan, 15))}</Node><Node ref={this.dialMarker} x={-330} y={0}><Line points={[[0, 0], [0, -120]]} stroke={C.yellow} lineWidth={6} endArrow /></Node>{this.registers(150)}</Node>;
    if (n === 44) return <Node>{this.label('AVALANCHE // BIT OPERATIONS IN MOTION', -510, -185, C.yellow, 26)}{['01101001 → 11010010 → 10011100', '10110010 → 01001101 → 01111010', '11100001 → 00111100 → 10100111', '00011011 → 10001101 → 01011001'].map((line, i) => <Txt key={line} text={line} fill={i % 2 ? C.cyan : C.lime} fontFamily={FONT} fontSize={22} x={-520} y={-120 + i * 60} />)}{this.label('ROTATE  •  XOR  •  ADD  •  RECOMBINE', -300, 178, C.red, 21)}</Node>;
    if (n === 45) return <Node>{this.label('FEED-FORWARD STATE', -540, -170, C.yellow, 25)}{this.flow(['BLOCK 1', 'H0', 'H1', 'H2'], -75, C.cyan)}{this.flow(['BLOCK 2', 'H0′', 'H1′', 'H2′'], 70, C.lime)}{this.label('previous state carried forward → next block', -350, 165, C.orange, 21)}</Node>;
    if (n === 46) return <Node>{this.label('8 × 32 BITS  →  256-BIT DIGEST', -495, -180, C.yellow, 28)}{this.registers(-90)}<Line points={[[-510, 60], [510, 60]]} stroke={C.lime} lineWidth={4} endArrow />{this.digest(125)}</Node>;
    if (n === 47) return <Node>{this.label('SHA-256("abc")', 0, -155, C.cyan, 28)}<Txt ref={this.digestLineOne} text="" fill={C.yellow} fontFamily={FONT} fontSize={24} y={-35} textAlign="center" /><Txt ref={this.digestLineTwo} text="" fill={C.yellow} fontFamily={FONT} fontSize={24} y={25} textAlign="center" /></Node>;
    if (n === 48) return <Node>{this.panel('INPUT', -380, 0, 380, 230, C.cyan, ['abc', 'short message'], [C.yellow, C.cyan])}<Line points={[[-170, 0], [150, 0]]} stroke={C.lime} lineWidth={4} endArrow />{this.panel('FIXED OUTPUT', 420, 0, 520, 230, C.yellow, ['no visible resemblance'], [C.orange])}{this.digest(80, C.yellow, 16)}</Node>;
    if (n >= 49 && n <= 53) return this.toySource(n);
    if (n >= 54 && n <= 62) return this.toyExecution(n);
    if (n >= 63 && n <= 65) return this.compare(n);
    if (n >= 66 && n <= 68) return this.speed(n);
    if (n >= 69 && n <= 73) return this.password(n);
    if (n >= 74 && n <= 84) return this.attack(n);
    if (n >= 85 && n <= 93) return this.toyAttack(n);
    if (n >= 94 && n <= 97) return this.failures(n);
    if (n >= 98 && n <= 100) return this.returnModel(n);
    return this.finalModel(n);
  }

  private toySource(n: number): any {
    if (n === 49) return <Node>{this.panel('REAL SHA-256', -360, 0, 530, 240, C.lime, ['secure production hash', 'too large to unpack here'])}{this.panel('TEACHING ENGINE', 360, 0, 530, 240, C.yellow, ['ToyHash8', 'EDUCATIONAL ONLY'], [C.yellow, C.red])}</Node>;
    if (n === 50) return <Node>{this.label('ToyHash8', -145, -170, C.yellow, 58)}{this.panel('toyhash.py // SOURCE', 0, 45, 900, 280, C.lime, ['def toyhash(data):', '    h = 0x6d', '    for x in data:', '        ...'])}</Node>;
    if (n === 51) return <Node>{this.panel('STATE REGISTER', -320, 0, 430, 230, C.yellow, ['h = 0x6d', '01101101'], [C.yellow, C.cyan])}{this.panel('INITIAL CONDITION', 360, 0, 500, 230, C.lime, ['eight-bit state', 'one starting value'])}</Node>;
    if (n === 52) return <Node>{this.panel('toyhash(data)', -350, 0, 580, 300, C.lime, ['h = (h ^ x) + 0x3d', 'h &= 0xff', 'h = ROTL(h, 3)', 'return h'])}{this.flow(['XOR', 'ADD', 'MASK', 'ROTL 3'], 0, C.yellow, -80)}</Node>;
    return <Node>{this.label('FOUR OPERATIONS × INPUT BYTES', -410, -170, C.yellow, 27)}{this.flow(['XOR', 'ADD', 'MASK', 'ROTATE'], 5, C.lime)}{this.label('entire function = a small loop', -245, 155, C.orange, 22)}</Node>;
  }

  private toyExecution(n: number): any {
    if (n === 54) return <Node>{this.panel('TERMINAL', -390, 0, 560, 240, C.lime, ['$ python toyhash.py abc', '61  62  63'], [C.cyan, C.yellow])}{this.flow(['61', '62', '63'], 0, C.cyan, -60)}</Node>;
    if (n === 55 || n === 56) return <Node>{this.label(`BYTE ${n === 55 ? '0x61' : 'XOR RESULT'}`, -480, -170, C.yellow, 27)}{this.bits('01100001', -420, -85)}{this.bits('01101101', -420, 0, C.lime)}{this.bits('00001100', -420, 85, C.yellow)}{this.label('bitwise transformation', -180, 160, C.cyan, 21)}</Node>;
    if (n === 57) return <Node>{this.label('0x0c + 0x3d = 0x49', -330, -170, C.yellow, 28)}{this.bits('001001001', -440, -45, C.orange)}{this.bits('01001001', -440, 65)}{this.label('keep lowest 8 bits // modulo 256', -300, 155, C.cyan, 21)}</Node>;
    if (n === 58) return <Node>{this.label('ROTL(0x49, 3) = 0x4a', -410, -170, C.yellow, 28)}<Circle width={250} height={250} fill={C.bg} stroke={C.cyan} lineWidth={3} x={-80} y={25} /><Node ref={this.bitRing}>{'01001001'.split('').map((bit, i) => this.label(bit, -80 + Math.cos(i * Math.PI / 4) * 98, 25 + Math.sin(i * Math.PI / 4) * 98, i < 3 ? C.yellow : C.cyan, 30))}</Node>{this.label('3 positions clockwise', 170, 155, C.orange, 24)}</Node>;
    if (n === 59) return <Node>{this.panel('STATE', -340, 0, 420, 200, C.yellow, ['h = 0x4a', 'next byte →'], [C.yellow, C.cyan])}{this.panel('QUEUE', 350, 0, 420, 200, C.cyan, ['62', '63'], [C.cyan, C.cyan])}</Node>;
    if (n === 62) { const digest = toyHash8Hex('abc'); return <Node>{this.label('FINAL STATE', -470, -125, C.cyan, 24)}<Txt ref={this.toyDigest} text={`0x${digest}`} fill={C.yellow} fontFamily={FONT} fontSize={88} x={-120} y={-28} />{this.panel('TERMINAL OUTPUT', 350, 0, 470, 180, C.lime, ['$ python toyhash.py abc', digest], [C.cyan, C.yellow])}</Node>; }
    if (n === 60) return <Node>{this.label('BYTE 0x62  //  0x4a → 0x2b', -430, -170, C.yellow, 26)}{this.flow(['4a XOR 62', '28 + 3d', '65', 'ROTL 3 = 2b'], 10, C.lime, -500, 210, 260)}{this.label('new state = 0x2b', -180, 160, C.cyan, 22)}</Node>;
    return <Node>{this.label('BYTE 0x63  //  0x2b → 0x2c', -430, -170, C.yellow, 26)}{this.flow(['2b XOR 63', '48 + 3d', '85', 'ROTL 3 = 2c'], 10, C.lime, -500, 210, 260)}{this.label('final state = 0x2c', -180, 160, C.cyan, 22)}</Node>;
  }

  private compare(n: number): any {
    if (n === 63) return <Node>{['FIXED OUTPUT', 'STATE', 'MIXING', 'ITERATION'].map((word, i) => <Rect key={word} width={280} height={72} x={-450 + (i % 2) * 600} y={-75 + Math.floor(i / 2) * 145} fill={C.bg} stroke={i === 0 ? C.yellow : C.lime} lineWidth={3}><Txt text={word} fill={i === 0 ? C.yellow : C.cyan} fontFamily={FONT} fontSize={22} /></Rect>)}</Node>;
    if (n === 64) return <Node>{this.panel('ToyHash8', -380, 0, 520, 290, C.red, ['8-bit state', '1-byte output', '4 operations'], [C.red, C.red, C.orange])}{this.panel('SHA-256', 380, 0, 620, 290, C.yellow, ['8 × 32-bit variables', '64-word schedule', '64 rounds / block'])}</Node>;
    return <Node>{this.label('SEE THE OPERATION', -445, -140, C.yellow, 32)}{this.flow(['BYTE', 'STATE', 'MIX', 'DIGEST'], 10, C.cyan)}{this.label('small teaching engine in foreground', -300, 150, C.orange, 22)}</Node>;
  }

  private speed(n: number): any {
    if (n === 66) return <Node>{this.panel('openssl speed sha256', -260, 0, 700, 290, C.lime, ['type       16 bytes   64 bytes   256 bytes', 'sha256     125000k    220000k    300000k', 'throughput ████████   █████████  ████████'], [C.cyan, C.cyan, C.yellow])}{this.label('FAST', 300, -5, C.orange, 48)}</Node>;
    if (n === 67) return <Node>{this.panel('FILE VERIFY', -390, 0, 500, 260, C.lime, ['1 file → digest', '✓ immediate check'], [C.cyan, C.yellow])}{this.panel('PASSWORD GUESSES', 370, 0, 560, 260, C.red, ['guess → hash → compare', '000001 000002 000003 …'], [C.red, C.orange])}</Node>;
    return <Node>{this.label('CONCEPTUAL COST MODEL', -410, -170, C.yellow, 27)}{Array.from({length: 6}, (_, i) => <Rect key={String(i)} width={100} height={100} x={-410 + i * 150} y={0} fill={C.bg} stroke={C.yellow} lineWidth={3}><Txt text="MEM" fill={C.yellow} fontFamily={FONT} fontSize={20} /></Rect>)}{this.label('ARGON2ID / SCRYPT / BCRYPT / PBKDF2', -390, 150, C.yellow, 22)}</Node>;
  }

  private password(n: number): any {
    if (n === 69 || n === 70) return <Node>{this.panel('users.db // PLAINTEXT', -260, 0, 700, 290, C.red, ['alice : correct-horse-battery-staple', 'bob   : letmein123'], [C.red, C.red])}{this.panel('READ ACCESS', 430, 0, 420, 290, C.red, ['\uf188  SECRET EXPOSED', 'no cracking needed'], [C.red, C.orange])}</Node>;
    if (n === 71) return <Node>{this.panel('STOLEN DATABASE', -350, 0, 540, 270, C.cyan, ['salt + verifier', 'not plaintext'], [C.cyan, C.yellow])}{this.flow(['GUESS', 'KDF', 'COMPARE'], 0, C.orange, 100)}{this.label('offline guessing is still possible', -270, 155, C.red, 21)}</Node>;
    if (n === 72) return <Node>{['CONFIG', 'LOG', 'BACKUP', 'MEMORY DUMP'].map((word, i) => <Rect key={word} width={245} height={86} x={-460 + (i % 2) * 600} y={-75 + Math.floor(i / 2) * 140} fill={C.bg} stroke={C.red} lineWidth={3}><Txt text={`${word}  ✗`} fill={C.red} fontFamily={FONT} fontSize={22} /></Rect>)}{this.label('verifier survives as a non-reversible representation', -360, 170, C.yellow, 20)}</Node>;
    return <Node>{['FILE INTEGRITY       → SHA-256', 'DIGITAL SIGNATURE    → HASH + SIGNATURE', 'HASH TABLE           → HASH FUNCTION', 'PASSWORD STORAGE     → ARGON2ID / SCRYPT'].map((line, i) => <Txt key={line} text={line} fill={i === 3 ? C.yellow : C.cyan} fontFamily={FONT} fontSize={21} x={-510} y={-125 + i * 60} />)}</Node>;
  }

  private attack(n: number): any {
    if (n === 74) return <Node>{this.label('?', -45, -55, C.red, 150)}{this.label('COLLISION', -510, 145, C.red, 23)}{this.label('PREIMAGE', -180, 145, C.yellow, 23)}{this.label('SECOND PREIMAGE', 130, 145, C.yellow, 23)}{this.label('MISUSE', 500, 145, C.red, 23)}</Node>;
    if (n === 75) return <Node>{['COLLISION', 'PREIMAGE', 'SECOND PREIMAGE', 'IMPLEMENTATION'].map((word, i) => this.panel(`${word} // CONSOLE`, -450 + (i % 2) * 900, -85 + Math.floor(i / 2) * 195, 650, 150, i === 0 ? C.red : C.yellow, ['$ analyze --mode'], [C.cyan]))}</Node>;
    if (n === 76 || n === 77) return <Node>{this.panel(n === 77 ? 'SHA-1 // COLLISION' : 'MESSAGE A', -390, 0, 520, 230, C.red, ['document_A.pdf', 'digest: 91af…'], [C.red, C.cyan])}{this.panel(n === 77 ? 'SHA-1 // COLLISION' : 'MESSAGE B', 390, 0, 520, 230, C.red, ['document_B.pdf', 'digest: 91af…'], [C.red, C.cyan])}{this.label('SAME DIGEST', -135, 150, C.red, 30)}</Node>;
    if (n === 78) return <Node>{this.label('2011', -520, -20, C.yellow, 28)}{this.label('2013', -80, -20, C.orange, 28)}{this.label('2017', 360, -20, C.red, 28)}<Line points={[[-510, 55], [510, 55]]} stroke={C.red} lineWidth={4} endArrow />{this.label('SHA-1 deprecated', -520, 110, C.yellow, 21)}{this.label('no new signatures', -100, 110, C.orange, 21)}{this.label('collision demonstrated', 300, 110, C.red, 21)}</Node>;
    if (n === 79) return <Node>{this.panel('TARGET DIGEST', 420, 0, 480, 240, C.yellow, ['fixed 256-bit target'], [C.yellow])}{Array.from({length: 5}, (_, i) => <Txt key={String(i)} text={`candidate_${String(i + 1).padStart(2, '0')}  ✗`} fill={C.red} fontFamily={FONT} fontSize={21} x={-550} y={-105 + i * 48} />)}{this.label('search →', -195, 130, C.orange, 24)}</Node>;
    if (n === 80) return <Node>{this.panel('GENERIC WORK SCALES', 0, 0, 1050, 260, C.yellow, ['COLLISION       2^128', 'PREIMAGE        2^256', 'generic estimates; construction matters'], [C.cyan, C.yellow, C.orange])}</Node>;
    if (n === 81) return <Node>{this.panel('KNOWN MESSAGE', -350, 0, 510, 230, C.yellow, ['message_A → digest', 'fingerprint pinned'])}{this.panel('ALTERNATE SEARCH', 370, 0, 550, 230, C.red, ['message_B₁  ✗', 'message_B₂  ✗', 'same digest?'], [C.red, C.red, C.orange])}</Node>;
    if (n === 82) return <Node>{this.panel('SHA-1', -350, 0, 520, 280, C.red, ['collision marker  ✗', 'legacy branch'], [C.red, C.orange])}{this.panel('SHA-2 / SHA-256', 370, 0, 620, 280, C.yellow, ['different construction', 'approved for appropriate uses'])}</Node>;
    if (n === 83) return <Node>{this.panel('SHA-256 // SPECIFICATION', 0, 0, 980, 300, C.yellow, ['OUTPUT       256 bits', 'COLLISION    128-bit strength', 'PREIMAGE     256-bit strength', 'BLOCK        512 bits'], [C.cyan, C.orange, C.cyan, C.cyan])}</Node>;
    return <Node>{['SHA-1     COLLISION RISK', 'SHA-256   CURRENTLY APPROVED', 'SHA-3     DIFFERENT DESIGN'].map((line, i) => <Txt key={line} text={line} fill={i === 0 ? C.red : i === 1 ? C.yellow : C.cyan} fontFamily={FONT} fontSize={27} x={-420} y={-85 + i * 80} />)}</Node>;
  }

  private toyAttack(n: number): any {
    if (n === 85) return <Node>{this.panel('SOURCE', -330, 0, 600, 270, C.lime, ['def toyhash(data):', 'return h'])}{this.panel('TERMINAL', 370, 0, 480, 270, C.red, ['$ ./toyhash --collision', 'ATTACK CURSOR _'], [C.red, C.orange])}</Node>;
    if (n === 86) return <Node>{this.panel('SHA-256', -360, 0, 520, 240, C.yellow, ['256 bits'], [C.yellow])}{this.panel('ToyHash8', 360, 0, 520, 240, C.red, ['8 bits'], [C.red])}<Line points={[[-95, 0], [95, 0]]} stroke={C.red} lineWidth={5} endArrow /></Node>;
    if (n === 87) return <Node>{this.label('2^8 = 256 POSSIBLE OUTPUTS', -380, -170, C.yellow, 28)}{Array.from({length: 32}, (_, i) => <Rect key={String(i)} width={26} height={26} x={-390 + (i % 16) * 52} y={-85 + Math.floor(i / 16) * 52} fill={C.bg} stroke={i === 8 ? C.red : C.cyan} lineWidth={2} />)}{this.label('00000000  …  11111111', -260, 105, C.cyan, 24)}</Node>;
    if (n === 88) return <Node>{this.panel('./toyhash --collision', 0, 0, 900, 260, C.red, ['candidate_0001 → 4c', 'candidate_0002 → 19', 'candidate_0003 → 8a'], [C.cyan, C.cyan, C.yellow])}{this.label('brute-force loop', -140, 145, C.orange, 22)}</Node>;
    if (n === 89) return <Node>{this.label('SEARCH PIPELINE', -470, -160, C.yellow, 26)}<Line points={[[-410, -80], [-50, 0], [360, 0]]} stroke={C.cyan} lineWidth={4} endArrow /><Line points={[[-410, -80], [-50, 80], [360, 80]]} stroke={C.cyan} lineWidth={4} endArrow />{this.label('input A', -520, -95, C.cyan, 20)}{this.label('input B', -520, 95, C.cyan, 20)}{this.label('same 8-bit result', 160, 145, C.red, 25)}</Node>;
    if (n === 90 || n === 91) { const collision = toyHash8Hex('y'); return <Node>{this.panel('INPUT A', -390, 0, 450, 230, C.red, ['$ ./toyhash y', collision], [C.yellow, C.red])}{this.panel('INPUT B', 390, 0, 450, 230, C.red, ['$ ./toyhash " @"', toyHash8Hex(' @')], [C.yellow, C.red])}{this.label(`0x${collision}  //  COLLISION FOUND`, -270, 150, C.red, 27)}</Node>; }
    if (n === 92) return <Node>{this.label('BIRTHDAY SEARCH // 256 SLOTS', -400, -170, C.yellow, 26)}{Array.from({length: 16}, (_, i) => <Rect key={String(i)} width={56} height={56} x={-420 + i * 56} y={10} fill={C.bg} stroke={i === 8 ? C.red : C.cyan} lineWidth={2}><Txt text={i === 8 ? '2×' : String(i)} fill={i === 8 ? C.red : C.cyan} fontFamily={FONT} fontSize={18} /></Rect>)}{this.label('one bucket hit twice', -150, 120, C.red, 24)}</Node>;
    return <Node>{['2^8', '2^16', '2^32', '2^64', '2^128'].map((value, i) => <Txt key={value} text={value} fill={i < 2 ? C.red : C.yellow} fontFamily={FONT} fontSize={28 + i * 7} x={-460 + i * 230} y={-20 + i * 18} />)}{this.label('output size controls collision difficulty', -340, 145, C.orange, 22)}</Node>;
  }

  private failures(n: number): any {
    if (n === 94) return <Node>{['WEAK PASSWORD', 'NO SALT', 'WRONG ALGORITHM', 'BAD IMPLEMENTATION'].map((word, i) => <Rect key={word} width={300} height={74} x={-480 + (i % 2) * 620} y={-85 + Math.floor(i / 2) * 145} fill={C.bg} stroke={C.red} lineWidth={3}><Txt text={`${word}  →`} fill={C.red} fontFamily={FONT} fontSize={20} /></Rect>)}{this.label('primitive intact // system still fails', -315, 170, C.yellow, 22)}</Node>;
    if (n === 95) return <Node>{this.label('password123', -450, -45, C.red, 50)}<Line points={[[-200, -30], [100, -30]]} stroke={C.red} lineWidth={4} endArrow />{this.label('SHA-256', -95, -90, C.yellow, 24)}{this.label('guessed immediately', 180, -45, C.red, 28)}{this.label('long random passphrase → larger search space', -360, 120, C.cyan, 22)}</Node>;
    if (n === 96) return <Node>{this.flow(['GUESS', 'SHA-256', 'COMPARE'], -20, C.red, -300)}{Array.from({length: 12}, (_, i) => <Rect key={String(i)} width={18} height={18} x={-520 + i * 88} y={105} fill={C.red} stroke={C.red} lineWidth={1} />)}{this.label('fast hash ≠ password work factor', -300, 160, C.yellow, 22)}</Node>;
    return <Node>{['COLLISION', 'PREIMAGE', 'PASSWORD GUESSING'].map((word, i) => <Rect key={word} width={330} height={110} x={-500 + i * 500} y={15} fill={C.bg} stroke={i === 2 ? C.red : C.yellow} lineWidth={3}><Txt text={word} fill={i === 2 ? C.red : C.yellow} fontFamily={FONT} fontSize={20} /></Rect>)}{this.label('different problems // different defenses', -310, 150, C.cyan, 22)}</Node>;
  }

  private returnModel(n: number): any {
    if (n === 98) return <Node>{['8-bit register', '8 registers', '64-word schedule', '64 rounds', '512-bit block'].map((word, i) => <Rect key={word} width={260} height={64} x={-520 + (i % 3) * 520} y={-100 + Math.floor(i / 3) * 130} fill={C.bg} stroke={i === 0 ? C.red : C.yellow} lineWidth={3}><Txt text={word} fill={i === 0 ? C.red : C.yellow} fontFamily={FONT} fontSize={18} /></Rect>)}</Node>;
    if (n === 99) return <Node>{this.flow(['PAD', 'W0…W15', 'W0…W63', '00…63', 'ACCUMULATE'], 0, C.lime)}{this.label('continuous accelerated run', -255, 150, C.orange, 23)}</Node>;
    return <Node>{this.registers(-85)}<Line points={[[-500, 55], [500, 55]]} stroke={C.lime} lineWidth={4} endArrow />{this.digest(125)}</Node>;
  }

  private finalModel(n: number): any {
    if (n === 101) return <Node>{this.panel('ARBITRARY INPUTS', -400, 0, 520, 250, C.cyan, ['abc', 'long file …', 'packet stream …'])}{this.panel('FIXED DIGEST', 390, 0, 520, 250, C.yellow, ['same output width'], [C.yellow])}{this.digest(72, C.yellow, 15)}</Node>;
    if (n === 102) return <Node>{['512-bit blocks', '32-bit words', '8 variables', '64-word schedule', '64 rounds'].map((word, i) => <Txt key={word} text={`✓  ${word}`} fill={i === 4 ? C.yellow : C.cyan} fontFamily={FONT} fontSize={23} x={-430} y={-130 + i * 55} />)}</Node>;
    if (n === 103) return <Node>{this.panel('EASY', -350, 0, 500, 230, C.lime, ['calculate digest', 'instant'], [C.lime, C.yellow])}{this.panel('HARD', 360, 0, 500, 230, C.red, ['reverse / collide', 'enormous search'], [C.red, C.orange])}</Node>;
    if (n === 104) return <Node>{['SHA-1  ✗ collision risk', 'SHA-2  ✓ current workhorse', 'SHA-3  ✓ different design'].map((line, i) => <Txt key={line} text={line} fill={i === 0 ? C.red : i === 1 ? C.yellow : C.cyan} fontFamily={FONT} fontSize={27} x={-400} y={-85 + i * 80} />)}</Node>;
    if (n === 105) return <Node>{['PLAINTEXT PASSWORD       ✗', 'FAST RAW SHA-256         ✗', 'UNIQUE SALT              ✓', 'ARGON2ID / SCRYPT / ...  ✓', 'TUNED COST               ✓'].map((line, i) => <Txt key={line} text={line} fill={i < 2 ? C.red : C.yellow} fontFamily={FONT} fontSize={22} x={-475} y={-130 + i * 55} />)}</Node>;
    if (n === 106 || n === 110) return <Node>{this.flow(['INPUT', 'PAD', 'SCHEDULE', '64 ROUNDS', 'DIGEST'], 0, C.yellow)}{this.label('state machine // full path', -220, 150, C.cyan, 23)}</Node>;
    if (n === 107) return <Node>{this.label('SHA-256("abc")', -330, -45, C.cyan, 46)}{this.label('=  ', -35, -45, C.yellow, 46)}{this.label('DIGEST READY', 85, -45, C.lime, 46)}</Node>;
    if (n === 108) return <Node>{this.panel('CALCULATE', -430, 0, 330, 210, C.lime, ['✓ easy'], [C.lime])}{this.panel('PREIMAGE', 0, 0, 330, 210, C.red, ['… hard'], [C.red])}{this.panel('COLLISION', 430, 0, 330, 210, C.red, ['… hard'], [C.red])}</Node>;
    if (n === 109) return <Node>{this.label('SHA-256', -205, -30, C.yellow, 82)}{this.label('CRYPTOGRAPHIC HASH', -265, 70, C.cyan, 25)}</Node>;
    if (n === 111) return <Node>{['INPUT.', 'STATE.', 'DIGEST.'].map((word, i) => <Txt key={word} text={word} fill={C.yellow} fontFamily={FONT} fontSize={58} x={-390 + i * 390} y={-20} />)}</Node>;
    return <Node>{this.label('SHA-256', -160, -75, C.cyan, 74)}{this.label('512-bit blocks   //   256-bit digest   //   64 rounds', -460, 45, C.yellow, 24)}{this.label('\uf023 CRYPTOGRAPHIC HASH', -520, 135, C.cyan, 20)}{this.label('\uf120 MOTION CANVAS', 180, 135, C.cyan, 20)}</Node>;
  }

  public *animateData(duration: number) {
    yield* all(this.animateFlow(duration), this.animateShotSpecifics(duration));
  }

  private *animateFlow(duration: number) {
    if (this.flowNodes.length === 0) {
      yield* waitFor(duration);
      return;
    }

    const beat = Math.min(0.28, duration / Math.max(4, this.flowNodes.length * 2));
    const usable = Math.max(0, duration - beat * this.flowNodes.length * 2);
    for (const item of this.flowNodes) {
      const origin = item().position.x();
      yield* all(
        item().position.x(origin + 18, beat),
        item().scale(1.08, beat),
      );
      yield* all(
        item().position.x(origin, beat),
        item().scale(1, beat),
      );
    }
    if (usable > 0) yield* waitFor(usable);
  }

  private *animateShotSpecifics(duration: number) {
    if (this.shotNumber === 1 && this.lockGlyph() && this.loginUi() && this.passwordText()) {
      const reveal = Math.min(0.85, duration * 0.2);
      yield* all(
        this.lockGlyph().scale(1, reveal),
        this.lockGlyph().position.y(-110, reveal, easeInOutCubic),
      );
      yield* all(
        this.lockGlyph().opacity(0, 0.2),
        this.loginUi().opacity(1, 0.6),
        this.loginUi().scale(1, 0.6, easeInOutCubic),
      );
      this.passwordText().text('hunter2');
      const typed = Math.min(0.35, duration / 12);
      yield* waitFor(typed);
      this.passwordText().text('•••••••');
      yield* waitFor(Math.max(0, duration - reveal - 0.6 - typed));
      return;
    }
    if (this.shotNumber === 3 && this.orbitGroup()) {
      yield* this.orbitGroup().rotation(360, duration, easeInOutCubic);
      return;
    }
    if (this.shotNumber === 58 && this.bitRing()) {
      yield* this.bitRing().rotation(135, duration, easeInOutCubic);
      return;
    }
    if (this.shotNumber === 27 && this.scheduleTrack() && this.scheduleCursor()) {
      yield* all(
        this.scheduleTrack().position.x(-155, duration, easeInOutCubic),
        this.scheduleCursor().position.x(540, duration, easeInOutCubic),
      );
      return;
    }
    if (this.shotNumber === 41 && this.registerShift()) {
      yield* this.registerShift().position.x(90, duration / 2, easeInOutCubic).to(0, duration / 2, easeInOutCubic);
      return;
    }
    if (this.shotNumber === 43 && this.dialMarker()) {
      yield* this.dialMarker().rotation(360, duration, easeInOutCubic);
      return;
    }
    if (this.shotNumber === 47 && this.digestLineOne() && this.digestLineTwo()) {
      const first = 'ba7816bf8f01cfea414140de5dae2223';
      const second = 'b00361a396177a9cb410ff61f20015ad';
      const typeTime = Math.min(0.12, duration / 80);
      for (let i = 1; i <= first.length; i++) {
        this.digestLineOne().text(first.slice(0, i));
        yield* waitFor(typeTime);
      }
      for (let i = 1; i <= second.length; i++) {
        this.digestLineTwo().text(second.slice(0, i));
        yield* waitFor(typeTime);
      }
      yield* waitFor(Math.max(0, duration - typeTime * (first.length + second.length)));
      return;
    }
    if (this.shotNumber === 62 && this.toyDigest()) {
      yield* this.toyDigest().scale(1.15, Math.min(0.5, duration / 4)).to(1, Math.min(0.5, duration / 4));
      yield* waitFor(Math.max(0, duration - Math.min(1, duration / 2)));
      return;
    }
    yield* waitFor(duration);
  }
}
