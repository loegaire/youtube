import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {
  cameraTravel,
  cascadeIn,
  drawPaths,
  enterStage,
  exitStage,
  prepareEntrance,
  trackedPoints,
} from '/home/thinh/proj/youtube/motion-repertoire/motion-canvas/src/choreography';
import {beats, chapterStarts, type Mode, type StoryBeat} from '../story-data';
import {C, DISPLAY, MONO} from '../theme';

type VisualParts = {
  nodes: Node[];
  paths: Line[];
  anchor?: Node;
  accent: string;
  collectors: Array<() => {nodes?: Node[]; paths?: Line[]; anchor?: Node}>;
};

const sourceRows = [
  'char name[32];',
  'read(STDIN_FILENO, name, 128);',
  'return from greet();',
];

const evidence: Record<Mode, string[]> = {
  recap: [
    '$ objdump -d --disassemble=greet bin/vuln-plain',
    '401156: sub rsp,0x30',
    '401170: call read@plt',
    '4011a5: leave',
    '4011a6: ret',
  ],
  source: [
    '$ ./scripts/build.sh',
    'warning: read may write 128 bytes',
    'into a region of size 32',
    'bin/vuln-plain    ELF 64-bit LSB executable',
  ],
  stack: [
    '$ objdump -d -M intel -S --disassemble=greet',
    'sub    rsp,0x30',
    'lea    rax,[rbp-0x30]',
    'mov    edx,0x80',
    'call   read@plt',
  ],
  nx: [
    '$ readelf -W -l bin/exec-probe-nx | grep GNU_STACK',
    'GNU_STACK                         RW   0x10',
    '$ ./bin/exec-probe-nx',
    'call on stack buffer → SIGSEGV',
  ],
  canary: [
    '$ objdump -d -M intel -S --disassemble=greet bin/vuln-canary',
    'mov    rax,QWORD PTR fs:0x28',
    'mov    QWORD PTR [rbp-0x8],rax',
    'sub    rax,QWORD PTR fs:0x28',
    'call   __stack_chk_fail@plt',
  ],
  aslr: [
    '$ cat /proc/<pid>/maps',
    '55b8…-55b8… r-xp  /bin/address-pie',
    '7f3d…-7f3d… r-xp  libc.so.6',
    '[stack]                              rw-p',
  ],
  pie: [
    '$ readelf -hW bin/address-pie | grep Type:',
    'Type: DYN (Position-Independent Executable file)',
    '$ nm -n bin/address-pie | grep main',
    '0000000000001189 T main',
  ],
  relro: [
    '$ readelf -W -d bin/relro-full | grep BIND_NOW',
    '0x000000000000001e (FLAGS) BIND_NOW',
    '$ env LD_DEBUG=bindings ./bin/relro-full',
    'binding ... puts ... before main',
  ],
  summary: [
    'one source-level write remains',
    'each mitigation changes a later assumption',
    'the defect is still the defect',
  ],
};

function Label({text, x = 0, y = 0, color = C.muted, size = 18}: {
  text: string; x?: number; y?: number; color?: string; size?: number;
}) {
  return <Txt text={text} x={x} y={y} fill={color} fontFamily={MONO} fontSize={size} fontWeight={650} />;
}

function EvidenceWindow({lines, x = 0, y = 0, width = 1420, height = 640, focusRow = 1, keyPrefix, parts}: {
  lines: string[]; x?: number; y?: number; width?: number; height?: number; focusRow?: number; keyPrefix: string; parts: VisualParts;
}) {
  const rows: Rect[] = [];
  const trace = createRef<Line>();
  parts.collectors.push(() => ({nodes: rows, paths: [trace()]}));
  return <Rect x={x} y={y} width={width} height={height} radius={10} fill={C.panel} stroke={C.rule} lineWidth={2}>
    <Rect y={-height / 2 + 42} width={width} height={84} radius={[10, 10, 0, 0]} fill={C.raised} />
    <Circle x={-width / 2 + 44} y={-height / 2 + 42} size={15} fill={C.coral} />
    <Circle x={-width / 2 + 70} y={-height / 2 + 42} size={15} fill={C.amber} />
    <Circle x={-width / 2 + 96} y={-height / 2 + 42} size={15} fill={C.mint} />
    {lines.map((line, index) => <Rect
      ref={makeRef(rows, index)}
      key={`${keyPrefix}-${line}-${index}`}
      y={-height / 2 + 132 + index * 76}
      width={width - 84}
      height={54}
      radius={5}
      fill={index === focusRow ? '#1C2A20' : '#00000000'}
      opacity={index === focusRow ? 1 : .88}
    >
      <Txt
        text={line}
        x={-width / 2 + 62}
        width={width - 124}
        offsetX={-1}
        fill={index === focusRow ? C.mintSoft : index === 0 ? C.amber : C.ink}
        fontFamily={MONO}
        fontSize={index === 0 ? 21 : 24}
        fontWeight={index === focusRow ? 700 : 520}
      />
    </Rect>)}
    <Line
      ref={trace}
      points={[[width / 2 - 34, -height / 2 + 132 + focusRow * 76 - 26], [width / 2 - 34, -height / 2 + 132 + focusRow * 76 + 26]]}
      lineWidth={5}
      stroke={C.mint}
      end={0}
    />
  </Rect>;
}

function ChapterCard({beat}: {beat: StoryBeat}) {
  return <Node>
    <Rect width={1480} height={330} radius={18} fill={C.canvas} stroke={C.rule} lineWidth={2} />
    <Txt text={`0${Math.ceil(beat.number / 8)} / 07`} y={-86} fill={C.mint} fontFamily={MONO} fontSize={19} fontWeight={800} letterSpacing={3} />
    <Txt text={beat.title} y={-8} fill={C.ink} fontFamily={DISPLAY} fontSize={57} fontWeight={760} />
    <Rect y={68} width={156} height={4} fill={C.mint} radius={2} />
  </Node>;
}

function sourceVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const chips: Rect[] = [];
  const lines: Line[] = [];
  const focus = createRef<Rect>();
  const visual = <Node ref={shell}>
    <EvidenceWindow lines={evidence.source} focusRow={beat.number === 6 ? 1 : 2} keyPrefix={beat.id} parts={parts} />
    {beat.number === 6 ? <Rect x={0} y={210} width={1040} height={174} radius={8} fill={C.canvas} stroke={C.rule} lineWidth={2}>
      {sourceRows.map((row, i) => <Txt key={`${beat.id}-${row}`} text={row} x={-460} y={-50 + i * 50} offsetX={-1} fill={i === 1 ? C.coral : C.ink} fontFamily={MONO} fontSize={27} />)}
    </Rect> : <Node>
      {['source', 'build', 'ELF', 'capture'].map((word, i) => <Rect ref={makeRef(chips, i)} key={`${beat.id}-${word}`} x={-420 + i * 280} y={235} width={220} height={76} radius={38} fill={i === 2 ? '#203327' : C.raised} stroke={i === 2 ? C.mint : C.rule} lineWidth={2}>
        <Txt text={word} fill={i === 2 ? C.mintSoft : C.ink} fontFamily={MONO} fontSize={23} fontWeight={700} />
      </Rect>)}
    </Node>}
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...chips], anchor: focus()}));
  return visual;
}

function stackVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const cells: Rect[] = [];
  const overflow = createRef<Rect>();
  const guide = createRef<Line>();
  const labels = [
    ['higher addresses', C.muted], ['saved return address', C.amber], ['saved frame pointer', C.ink], ['local frame • 0x30 bytes', C.mintSoft], ['name[32]', C.coral], ['lower addresses', C.muted],
  ] as const;
  const visual = <Node ref={shell}>
    <Txt text="derived from sub rsp,0x30 and rbp-0x30" y={-370} fill={C.muted} fontFamily={MONO} fontSize={18} />
    {labels.map(([label, color], i) => <Rect ref={makeRef(cells, i)} key={`${beat.id}-${label}`} y={-250 + i * 102} width={760 - Math.min(i, 5) * 55} height={84} radius={7} fill={i === 4 ? '#3A201F' : C.raised} stroke={color} lineWidth={i === 1 || i === 4 ? 3 : 1}>
      <Txt text={label} x={-280} offsetX={-1} fill={color} fontFamily={MONO} fontSize={i === 0 || i === 5 ? 17 : 25} fontWeight={650} />
    </Rect>)}
    <Rect ref={overflow} x={-630} y={160} width={42} height={44} radius={5} fill={C.coral}><Txt text="A" fill={C.canvas} fontFamily={MONO} fontSize={24} fontWeight={800} /></Rect>
    <Line ref={guide} points={[[-585, 160], [-320, 160], [-320, -148]]} endArrow arrowSize={17} lineWidth={4} stroke={C.coral} end={0} />
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...cells, overflow()], paths: [guide()], anchor: cells[1]}));
  return visual;
}

function nxVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const cards: Rect[] = [];
  const arrow = createRef<Line>();
  const perms = [['stack', 'R  W', C.coral], ['code', 'R  X', C.mint], ['heap', 'R  W', C.amber]] as const;
  const visual = <Node ref={shell}>
    <Txt text="page permissions decide what the processor may fetch" y={-332} fill={C.muted} fontFamily={DISPLAY} fontSize={28} />
    {perms.map(([name, perm, color], i) => <Rect ref={makeRef(cards, i)} key={`${beat.id}-${name}`} x={-500 + i * 500} width={390} height={360} radius={10} fill={C.raised} stroke={color} lineWidth={3}>
      <Txt text={name} y={-100} fill={C.ink} fontFamily={DISPLAY} fontSize={37} fontWeight={730} />
      <Txt text={perm} y={-22} fill={color} fontFamily={MONO} fontSize={41} fontWeight={750} />
      <Txt text={i === 0 ? 'data accepted' : i === 1 ? 'instructions permitted' : 'data accepted'} y={100} fill={C.muted} fontFamily={MONO} fontSize={18} />
    </Rect>)}
    <Line ref={arrow} points={[[-680, 120], [-680, 230], [-500, 230], [-500, 160]]} stroke={C.coral} lineWidth={5} endArrow arrowSize={18} end={0} />
    <Txt text="instruction fetch blocked" x={-500} y={278} fill={C.coral} fontFamily={MONO} fontSize={20} opacity={0} />
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...cards], paths: [arrow()], anchor: cards[0]}));
  return visual;
}

function canaryVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const blocks: Rect[] = [];
  const guard = createRef<Rect>();
  const write = createRef<Line>();
  const visual = <Node ref={shell}>
    <Txt text="a secret guard sits between local data and the return path" y={-340} fill={C.muted} fontFamily={DISPLAY} fontSize={28} />
    {['input bytes', 'local buffer', 'guard', 'saved return address'].map((label, i) => <Rect ref={i === 2 ? guard : makeRef(blocks, i)} key={`${beat.id}-${label}`} x={-570 + i * 380} width={300} height={250} radius={10} fill={i === 2 ? '#302C1D' : C.raised} stroke={i === 2 ? C.amber : i === 3 ? C.coral : C.rule} lineWidth={i >= 2 ? 4 : 2}>
      <Txt text={label} y={-46} fill={i === 2 ? C.amber : C.ink} fontFamily={DISPLAY} fontSize={i === 3 ? 25 : 29} fontWeight={720} />
      <Txt text={i === 2 ? 'random value' : i === 3 ? 'control flow' : i === 0 ? 'untrusted' : 'name[32]'} y={35} fill={C.muted} fontFamily={MONO} fontSize={20} />
    </Rect>)}
    <Line ref={write} points={[[-680, 150], [-190, 150], [-190, 20]]} stroke={C.coral} lineWidth={6} endArrow arrowSize={19} end={0} />
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...blocks, guard()], paths: [write()], anchor: guard()}));
  return visual;
}

function aslrVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const maps: Rect[] = [];
  const tether = createRef<Line>();
  const visual = <Node ref={shell}>
    <Txt text="same regions • different runtime bases" y={-340} fill={C.muted} fontFamily={DISPLAY} fontSize={28} />
    {['main binary', 'libc', 'heap', 'stack'].map((name, i) => <Rect ref={makeRef(maps, i)} key={`${beat.id}-${name}`} x={-510 + i * 340} y={i % 2 ? 50 : -45} width={280} height={340} radius={10} fill={C.raised} stroke={[C.mint, C.amber, C.mintSoft, C.coral][i]} lineWidth={3}>
      <Txt text={name} y={-86} fill={C.ink} fontFamily={DISPLAY} fontSize={27} fontWeight={720} />
      <Txt text={['0x55b8…', '0x7f3d…', '0x55b9…', '0x7ffe…'][i]} y={-25} fill={[C.mint, C.amber, C.mintSoft, C.coral][i]} fontFamily={MONO} fontSize={24} />
      <Rect y={60} width={168} height={10} radius={5} fill={C.rule} />
      <Circle y={60} size={17} fill={[C.mint, C.amber, C.mintSoft, C.coral][i]} />
    </Rect>)}
    <Line ref={tether} points={trackedPoints(() => maps[0], () => maps[1])} stroke={C.muted} lineWidth={2} lineDash={[10, 10]} end={0} />
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...maps], paths: [tether()], anchor: maps[0]}));
  return visual;
}

function pieVisual(_beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const binary = createRef<Rect>();
  const offset = createRef<Rect>();
  const ruler = createRef<Line>();
  const visual = <Node ref={shell}>
    <Txt text="the executable becomes a movable mapping" y={-340} fill={C.muted} fontFamily={DISPLAY} fontSize={28} />
    <Rect ref={binary} x={-130} y={0} width={870} height={370} radius={12} fill={C.raised} stroke={C.mint} lineWidth={4}>
      <Txt text="address-pie" x={-340} y={-115} offsetX={-1} fill={C.ink} fontFamily={DISPLAY} fontSize={39} fontWeight={760} />
      <Txt text="base" x={-340} y={-33} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} />
      <Txt text="0x55b8…0000" x={-202} y={-33} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={28} />
      <Rect ref={offset} x={180} y={58} width={260} height={78} radius={6} fill="#203327" stroke={C.mintSoft} lineWidth={2}><Txt text="main + 0x1189" fill={C.mintSoft} fontFamily={MONO} fontSize={21} fontWeight={700} /></Rect>
    </Rect>
    <Line ref={ruler} points={[[-560, 300], [560, 300]]} stroke={C.rule} lineWidth={4} end={0} />
    <Txt text="base + offset" y={377} fill={C.amber} fontFamily={MONO} fontSize={24} fontWeight={700} />
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), binary(), offset()], paths: [ruler()], anchor: offset()}));
  return visual;
}

function relroVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const slots: Rect[] = [];
  const write = createRef<Line>();
  const lock = createRef<Rect>();
  const visual = <Node ref={shell}>
    <Txt text="the loader's table can become read-only after relocation" y={-340} fill={C.muted} fontFamily={DISPLAY} fontSize={27} />
    <Rect width={1120} height={460} radius={11} fill={C.raised} stroke={C.rule} lineWidth={2}>
      <Txt text="global offset table" x={-480} y={-170} offsetX={-1} fill={C.ink} fontFamily={DISPLAY} fontSize={34} fontWeight={760} />
      {['puts', 'write', 'sleep'].map((symbol, i) => <Rect ref={makeRef(slots, i)} key={`${beat.id}-${symbol}`} x={-315 + i * 315} y={35} width={252} height={150} radius={8} fill={i === 0 ? '#203327' : C.panel} stroke={i === 0 ? C.mint : C.rule} lineWidth={3}>
        <Txt text={symbol} y={-36} fill={C.ink} fontFamily={MONO} fontSize={28} fontWeight={700} />
        <Txt text={i === 0 ? 'resolved' : 'slot'} y={29} fill={i === 0 ? C.mintSoft : C.muted} fontFamily={MONO} fontSize={20} />
      </Rect>)}
    </Rect>
    <Rect ref={lock} x={600} y={-230} width={150} height={70} radius={35} fill={C.amber}><Txt text="LOCK" fill={C.canvas} fontFamily={MONO} fontSize={21} fontWeight={800} /></Rect>
    <Line ref={write} points={[[760, 230], [700, 230], [700, 35], [315, 35]]} stroke={C.coral} lineWidth={6} endArrow arrowSize={19} end={0} />
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...slots, lock()], paths: [write()], anchor: slots[0]}));
  return visual;
}

function recapVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const nodes: Rect[] = [];
  const routes: Line[] = [];
  const visual = <Node ref={shell}>
    {['input', 'buffer', 'saved return', 'existing code'].map((label, i) => <Rect ref={makeRef(nodes, i)} key={`${beat.id}-${label}`} x={-570 + i * 380} y={i === 1 ? 55 : 0} width={292} height={170} radius={10} fill={i === 2 ? '#35221F' : C.raised} stroke={i === 2 ? C.coral : i === 3 ? C.mint : C.rule} lineWidth={3}>
      <Txt text={label} y={-20} fill={C.ink} fontFamily={DISPLAY} fontSize={31} fontWeight={730} />
      <Txt text={i === 0 ? 'bytes' : i === 1 ? 'name[32]' : i === 2 ? 'control flow' : 'ROP gadgets'} y={42} fill={i === 2 ? C.coral : C.muted} fontFamily={MONO} fontSize={18} />
    </Rect>)}
    {[0, 1, 2].map(i => <Line ref={makeRef(routes, i)} key={`${beat.id}-${i}`} points={[[-424 + i * 380, i === 1 ? 55 : 0], [-336 + i * 380, i === 2 ? 0 : 55]]} stroke={i === 2 ? C.coral : C.mint} lineWidth={5} endArrow arrowSize={18} end={0} />)}
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...nodes], paths: routes, anchor: nodes[2]}));
  return visual;
}

function summaryVisual(beat: StoryBeat, parts: VisualParts) {
  const shell = createRef<Node>();
  const walls: Rect[] = [];
  const path = createRef<Line>();
  const names = [['write', C.coral], ['NX', C.mint], ['canary', C.amber], ['ASLR + PIE', C.mintSoft], ['RELRO', C.mint]] as const;
  const visual = <Node ref={shell}>
    <Txt text="the same write meets a different later constraint" y={-355} fill={C.muted} fontFamily={DISPLAY} fontSize={28} />
    {names.map(([name, color], i) => <Rect ref={makeRef(walls, i)} key={`${beat.id}-${name}`} x={-510 + i * 255} y={i % 2 ? 64 : -4} width={205} height={290} radius={10} fill={i === 0 ? '#3A201F' : C.raised} stroke={color} lineWidth={i === 0 ? 4 : 3}>
      <Txt text={name} fill={color} fontFamily={DISPLAY} fontSize={i === 3 ? 25 : 29} fontWeight={760} />
      <Rect y={72} width={90} height={3} fill={color} />
    </Rect>)}
    <Line ref={path} points={[[-725, 190], [-510, 190], [-255, 70], [0, 140], [255, 15], [510, 105], [725, -80]]} stroke={C.coral} lineWidth={7} endArrow arrowSize={22} end={0} />
  </Node>;
  parts.collectors.push(() => ({nodes: [shell(), ...walls], paths: [path()], anchor: walls[0]}));
  return visual;
}

function makeVisual(beat: StoryBeat, parts: VisualParts) {
  switch (beat.mode) {
    case 'source': return sourceVisual(beat, parts);
    case 'stack': return stackVisual(beat, parts);
    case 'nx': return nxVisual(beat, parts);
    case 'canary': return canaryVisual(beat, parts);
    case 'aslr': return aslrVisual(beat, parts);
    case 'pie': return pieVisual(beat, parts);
    case 'relro': return relroVisual(beat, parts);
    case 'summary': return summaryVisual(beat, parts);
    default: return recapVisual(beat, parts);
  }
}

const moves = ['push', 'track-left', 'tilt-right', 'rise', 'track-right', 'drop'] as const;

export default makeScene2D(function* (view) {
  view.fill(C.canvas);
  const stage = createRef<Node>();
  view.add(<Node ref={stage} />);

  for (const beat of beats) {
    const frame = createRef<Node>();
    const parts: VisualParts = {nodes: [], paths: [], accent: C.mint, collectors: []};
    const isChapter = chapterStarts.has(beat.number);
    const title = createRef<Node>();
    stage().add(<Node ref={frame}>
      {makeVisual(beat, parts)}
      <Node ref={title} opacity={0}>{isChapter ? <ChapterCard beat={beat} /> : null}</Node>
    </Node>);

    for (const collect of parts.collectors) {
      const result = collect();
      // Some diagrams deliberately reserve a ref index for a highlighted node.
      // Strip those sparse-array holes before applying choreography helpers.
      if (result.nodes) parts.nodes.push(...result.nodes.filter((node): node is Node => Boolean(node)));
      if (result.paths) parts.paths.push(...result.paths.filter((path): path is Line => Boolean(path)));
      if (result.anchor) parts.anchor = result.anchor;
    }

    prepareEntrance(frame(), moves[(beat.number - 1) % moves.length]);
    yield* enterStage(frame(), .62);
    if (isChapter) {
      yield* all(title().opacity(1, .42), frame().scale(.94, .42, easeOutCubic));
      yield* waitFor(1.55);
      yield* all(title().opacity(0, .38), frame().scale(1, .38, easeOutCubic));
    }
    if (parts.nodes.length) yield* cascadeIn(parts.nodes.slice(0, 5), .06, .38);
    if (parts.paths.length) yield* drawPaths(parts.paths, .1, .46);

    const used = .62 + (isChapter ? 2.35 : 0) + (parts.nodes.length ? .62 : 0) + (parts.paths.length ? .46 : 0);
    const phaseBudget = Math.max(0, beat.duration - used - .62);
    const phases = Math.max(1, Math.ceil(phaseBudget / 3.8));
    for (let phase = 0; phase < phases; phase++) {
      const node = parts.nodes[phase % Math.max(1, parts.nodes.length)];
      if (node) {
        yield* all(
          node.scale(1.035, .34, easeInOutCubic),
          cameraTravel(frame(), moves[(beat.number + phase) % moves.length], .48),
        );
        // The surrounding motion consumes .48s + .32s.  Subtract that exact
        // .80s so the sum of every phase matches the measured narration beat.
        yield* waitFor(Math.max(.5, phaseBudget / phases - .8));
        yield* all(node.scale(1, .28, easeInOutCubic), frame().position([0, 0], .32, easeOutCubic), frame().scale(1, .32, easeOutCubic), frame().rotation(0, .32, easeOutCubic));
      } else {
        yield* waitFor(Math.max(.5, phaseBudget / phases));
      }
    }
    yield* exitStage(frame(), moves[(beat.number + 2) % moves.length], .62);
    frame().remove();
  }
  // Keep the visual tail present until the measured owner-voice master ends.
  yield* waitFor(.35);
});
