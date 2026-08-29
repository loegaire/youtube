import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {beats, Beat} from './data/beats';
import {imulLines, normalLines, overflowLines, storeLines} from './data/evidence';
import {BitCell, CaptionRail, Domino, IntegerWheel, Label, MemoryBlock, Panel, RuleArrow, SourceSurface, Stamp, TerminalLine, TerminalSurface, Backdrop, cameraTravel, cascadeIn, drawPaths, enterStage, exitStage, fanIn, prepareEntrance, sweep} from './components';
import {C, MONO, SANS} from './theme';

function* captionTrack(text: ReturnType<typeof createSignal<string>>, captions: string[], duration: number) {
  const slice = duration / captions.length;
  for (let index = 0; index < captions.length; index += 1) {
    if (index > 0) yield* text(captions[index], 0.22);
    yield* waitFor(Math.max(0.1, slice - (index > 0 ? 0.22 : 0)));
  }
}

function sourceLine(source: number) {
  return () => source;
}

function terminalFrom(lines: string[]): TerminalLine[] {
  return lines.slice(0, 16).map(text => ({
    text,
    tone: /Balance: 1100|current balance/.test(text) ? 'mint' : /Not enough|flag output/.test(text) ? 'coral' : /final cost|100000/.test(text) ? 'amber' : 'muted',
  }));
}

function* animateBeat(stage: Node, beat: Beat) {
  if (beat.kind === 'hook') {
    const terminal = createRef<Rect>();
    const active = createSignal(-1);
    const stamp = createRef<Rect>();
    stage.add(<>
      <TerminalSurface ref={terminal} title={'~/ctf/pico/flag_shop $ ./store'} context={'local reconstruction'} lines={terminalFrom(normalLines)} active={active} width={1370} height={560} />
      <Stamp ref={stamp} text={'NOT ENOUGH FUNDS'} y={60} />
    </>);
    stamp().opacity(0);
    terminal().opacity(0);
    terminal().scale(0.92);
    yield* all(terminal().opacity(1, 0.7), terminal().scale(1, 0.7));
    yield* active(6, 0.4);
    yield* waitFor(1.5);
    yield* active(13, 0.4);
    yield* all(stamp().opacity(1, 0.4), stamp().scale(1.08, 0.4));
    yield* stamp().scale(1, 0.3);
    yield* all(terminal().position.x(-240, 1.0), terminal().scale(0.78, 1.0), stamp().position.x(-240, 1.0));
  }

  if (beat.kind === 'evidence') {
    const source = createRef<Rect>();
    const terminal = createRef<Rect>();
    const disasm = createRef<Rect>();
    const scroll = createSignal(0);
    stage.add(<>
      <SourceSurface ref={source} source={storeLines} scrollLine={scroll} x={-330} y={-10} width={800} height={610} />
      <TerminalSurface ref={terminal} title={'captured local run'} lines={terminalFrom(overflowLines)} x={480} y={-115} width={620} height={395} />
      <Panel ref={disasm} x={480} y={270} width={620} height={180} stroke={C.amber}>
        <Txt text={'objdump -d -M intel ./store'} x={-275} y={-55} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={17} fontWeight={750} />
        <Txt text={'0x40062d  imul eax, eax, 0x384'} x={-275} y={6} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={20} />
        <Txt text={'observed behavior  →  scratchpad'} x={-275} y={58} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={16} />
      </Panel>
    </>);
    [source(), terminal(), disasm()].forEach(node => node.opacity(0));
    yield* sequence(0.18, ...[source(), terminal(), disasm()].map(node => node.opacity(1, 0.55)));
    yield* scroll(34, 2.2);
    yield* scroll(0, 2.2);
    yield* cameraTravel(stage, 'push', 1.0);
  }

  if (beat.kind === 'source') {
    const scroll = createSignal(0);
    const active = createSignal(1);
    const source = createRef<Rect>();
    const quantity = createRef<Rect>();
    const multiplier = createRef<Rect>();
    const gate = createRef<Rect>();
    const links: Line[] = [];
    stage.add(<>
      <SourceSurface ref={source} source={storeLines} activeLine={active} scrollLine={scroll} width={1380} height={600} y={-40} />
      <Rect ref={quantity} x={-420} y={285} width={210} height={88} radius={5} fill={C.raised} stroke={C.mint} lineWidth={3}><Label text={'quantity'} color={C.mint} mono size={24} /></Rect>
      <Rect ref={multiplier} x={0} y={285} width={210} height={88} radius={5} fill={C.raised} stroke={C.amber} lineWidth={3}><Label text={'× 900'} color={C.amber} mono size={28} /></Rect>
      <Rect ref={gate} x={420} y={285} width={260} height={88} radius={5} fill={C.raised} stroke={C.mint} lineWidth={3}><Label text={'<= balance'} color={C.mint} mono size={24} /></Rect>
      <RuleArrow ref={makeRef(links, 0)} from={[-314, 285]} to={[-110, 285]} color={C.mint} />
      <RuleArrow ref={makeRef(links, 1)} from={[110, 285]} to={[284, 285]} color={C.amber} />
    </>);
    [quantity(), multiplier(), gate()].forEach(node => node.opacity(0));
    links.forEach(link => link.end(0));
    yield* scroll(31, 1.1);
    yield* active(34, 0.25); yield* waitFor(1.0);
    yield* active(36, 0.25); yield* waitFor(1.0);
    yield* active(37, 0.25); yield* waitFor(1.0);
    yield* active(39, 0.25); yield* all(quantity().opacity(1, 0.5), multiplier().opacity(1, 0.5));
    yield* links[0].end(1, 0.45); yield* active(41, 0.25); yield* all(gate().opacity(1, 0.5), links[1].end(1, 0.45));
    yield* active(42, 0.25);
  }

  if (beat.kind === 'odometer') {
    const receipt = createRef<Rect>();
    const wall = createRef<Line>();
    const values = ['0', '900', '1800', '2700', '…'];
    const tiles: Rect[] = [];
    stage.add(<>
      <Line points={[[-720, 80], [720, 80]]} stroke={C.rule} lineWidth={3} />
      {values.map((value, i) => <Rect ref={makeRef(tiles, i)} x={-620 + i * 310} y={80} width={130} height={72} radius={4} fill={C.raised} stroke={C.mint} lineWidth={2}><Label text={value} color={C.mint} mono size={23} /></Rect>)}
      <Line ref={wall} points={[[620, -200], [620, 240]]} stroke={C.coral} lineWidth={6} />
      <Txt text={'32-bit int limit'} x={620} y={-245} fill={C.coral} fontFamily={MONO} fontSize={20} fontWeight={800} />
      <Rect ref={receipt} y={-120} width={420} height={92} radius={4} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text={'receipt: total grows'} fill={C.amber} fontFamily={MONO} fontSize={25} fontWeight={800} /></Rect>
    </>);
    tiles.forEach(tile => tile.opacity(0)); wall().end(0); receipt().opacity(0);
    yield* sequence(0.18, ...tiles.map(tile => tile.opacity(1, 0.42)));
    yield* receipt().opacity(1, 0.5); yield* wall().end(1, 0.7);
    yield* all(receipt().position.x(560, 1.0), receipt().rotation(85, 1.0), receipt().scale(0.6, 1.0));
    yield* all(receipt().position.x(-250, 1.0), receipt().rotation(180, 1.0), receipt().scale(1, 1.0));
  }

  if (beat.kind === 'wheel') {
    const bits: Rect[] = [];
    const signed = createSignal('0');
    const unsigned = createSignal('0');
    const value = createSignal('0x00000000');
    const wheel = createRef<Rect>();
    stage.add(<>
      <IntegerWheel ref={wheel} value={value} signed={signed} unsigned={unsigned} y={50} />
      {Array.from({length: 32}, (_, i) => <BitCell ref={makeRef(bits, i)} bit={i === 0 ? '0' : '1'} x={-744 + i * 48} y={-230} accent={i === 0} />)}
      <Txt text={'sign bit'} x={-744} y={-285} fill={C.coral} fontFamily={MONO} fontSize={17} fontWeight={800} />
    </>);
    bits.forEach(bit => {bit.opacity(0); bit.scale(0.6);}); wheel().opacity(0);
    yield* sequence(0.025, ...bits.map(bit => all(bit.opacity(1, 0.18), bit.scale(1, 0.18))));
    yield* wheel().opacity(1, 0.5);
    yield* all(value('0x7ffffffe', 0.7), signed('2147483646', 0.7), unsigned('2147483646', 0.7));
    yield* all(value('0x7fffffff', 0.7), signed('2147483647', 0.7), unsigned('2147483647', 0.7));
    bits[0].removeChildren(); bits[0].add(<Txt text={'1'} fill={C.coral} fontFamily={MONO} fontSize={24} fontWeight={800} />);
    yield* all(value('0x80000000', 0.8), signed('-2147483648', 0.8), unsigned('2147483648', 0.8), bits[0].fill('#F0786E35', 0.8));
  }

  if (beat.kind === 'trigger') {
    const active = createSignal(39);
    const result = createSignal('900 × 3,000,000 = 2,700,000,000');
    const wheelValue = createSignal('math: 2,700,000,000');
    const signed = createSignal('waiting');
    const unsigned = createSignal('waiting');
    const formula = createRef<Rect>();
    stage.add(<>
      <SourceSurface source={storeLines} activeLine={active} scrollLine={() => 31} x={-380} y={-40} width={790} height={580} />
      <Rect ref={formula} x={440} y={-135} width={750} height={120} radius={6} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text={result} fill={C.amber} fontFamily={MONO} fontSize={27} fontWeight={800} /></Rect>
      <IntegerWheel value={wheelValue} signed={signed} unsigned={unsigned} x={440} y={190} />
    </>);
    formula().opacity(0); yield* formula().opacity(1, 0.55); yield* waitFor(1.0);
    yield* all(wheelValue('0xA0EEBB00', 0.8), signed('-1594967296', 0.8), unsigned('2700000000', 0.8));
    yield* result('total_cost = -1594967296', 0.6);
    yield* active(42, 0.3);
    yield* all(formula().position.y(45, 0.9), formula().stroke(C.coral, 0.9));
  }

  if (beat.kind === 'dominoes') {
    const labels = ['positive\ninput', 'multiply\nwraps', 'negative\ncost', 'wrong\ncheck', 'balance\nrises', 'gate\nopens'];
    const dominoes: Rect[] = [];
    stage.add(<>
      {labels.map((label, i) => <Domino ref={makeRef(dominoes, i)} label={label} x={-700 + i * 280} y={70} color={i > 1 ? C.coral : C.mint} />)}
      <Rect x={690} y={-180} width={220} height={100} radius={4} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text={'balance >\n100000'} fill={C.amber} fontFamily={MONO} fontSize={22} fontWeight={800} textAlign={'center'} /></Rect>
    </>);
    dominoes.forEach(domino => {domino.opacity(0); domino.position.y(110);});
    yield* cascadeIn(dominoes, 0.08, 0.42);
    for (let i = 0; i < dominoes.length; i += 1) {
      yield* dominoes[i].rotation(72, 0.38);
      if (i + 1 < dominoes.length) yield* dominoes[i + 1].rotation(-8, 0.18);
    }
  }

  if (beat.kind === 'mismatch') {
    const top = createRef<Rect>(); const bottom = createRef<Rect>(); const bridge = createRef<Line>();
    stage.add(<>
      <Panel ref={top} x={-310} y={-70} width={1050} height={210} stroke={C.mint}><Txt text={'MATHEMATICAL WORLD'} x={-460} y={-65} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={19} fontWeight={800} /><Txt text={'2,700,000,000  →  reject'} y={35} fill={C.ink} fontFamily={MONO} fontSize={38} fontWeight={800} /></Panel>
      <Panel ref={bottom} x={310} y={175} width={1050} height={210} stroke={C.coral}><Txt text={'MACHINE WORLD'} x={-460} y={-65} offsetX={-1} fill={C.coral} fontFamily={MONO} fontSize={19} fontWeight={800} /><Txt text={'-1,594,967,296  →  approve'} y={35} fill={C.ink} fontFamily={MONO} fontSize={34} fontWeight={800} /></Panel>
      <Line ref={bridge} points={[[-310, 40], [310, 65]]} stroke={C.amber} lineWidth={8} endArrow arrowSize={20} />
    </>);
    top().opacity(0); bottom().opacity(0); bridge().end(0);
    yield* all(top().opacity(1, 0.6), bottom().opacity(1, 0.6)); yield* bridge().end(1, 0.7);
    yield* all(bridge().stroke(C.coral, 0.6), bridge().lineWidth(2, 0.6));
    yield* sweep([top(), bottom()], 150, 0.9);
  }

  if (beat.kind === 'signedness') {
    const bits: Rect[] = [];
    const signed = createRef<Rect>(); const unsigned = createRef<Rect>();
    stage.add(<>
      {Array.from({length: 32}, (_, i) => <BitCell ref={makeRef(bits, i)} bit={'1'} x={-744 + i * 48} y={-150} accent={i === 0} />)}
      <Panel ref={signed} x={-390} y={190} width={540} height={190} stroke={C.coral}><Txt text={'signed int'} y={-55} fill={C.muted} fontFamily={MONO} fontSize={19} /><Txt text={'-1'} y={25} fill={C.coral} fontFamily={MONO} fontSize={62} fontWeight={900} /></Panel>
      <Panel ref={unsigned} x={390} y={190} width={620} height={190} stroke={C.mint}><Txt text={'unsigned int / size_t'} y={-55} fill={C.muted} fontFamily={MONO} fontSize={19} /><Txt text={'4294967295'} y={25} fill={C.mint} fontFamily={MONO} fontSize={43} fontWeight={900} /></Panel>
    </>);
    bits.forEach(bit => {bit.opacity(0); bit.scale(0.5);}); signed().opacity(0); unsigned().opacity(0);
    yield* fanIn(bits, 0.85); yield* all(signed().opacity(1, 0.55), unsigned().opacity(1, 0.55));
    yield* all(signed().position.y(145, 0.8), unsigned().position.y(235, 0.8));
  }

  if (beat.kind === 'addition' || beat.kind === 'underflow') {
    const first = createSignal(beat.kind === 'addition' ? '2147483647' : '0');
    const op = beat.kind === 'addition' ? '+' : '-';
    const result = createSignal('…');
    const output = createRef<Rect>();
    stage.add(<>
      <Rect x={-350} y={0} width={420} height={160} radius={6} fill={C.raised} stroke={C.mint} lineWidth={3}><Txt text={first} fill={C.mint} fontFamily={MONO} fontSize={47} fontWeight={900} /></Rect>
      <Txt text={op} x={0} y={0} fill={C.amber} fontFamily={MONO} fontSize={76} fontWeight={900} />
      <Rect x={350} y={0} width={220} height={160} radius={6} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text={'1'} fill={C.amber} fontFamily={MONO} fontSize={56} fontWeight={900} /></Rect>
      <RuleArrow from={[-130, 160]} to={[130, 160]} color={C.coral} />
      <Rect ref={output} y={260} width={850} height={150} radius={6} fill={C.raised} stroke={C.coral} lineWidth={3}><Txt text={result} fill={C.coral} fontFamily={MONO} fontSize={beat.kind === 'addition' ? 46 : 42} fontWeight={900} /></Rect>
    </>);
    output().opacity(0);
    yield* waitFor(1.0);
    yield* all(output().opacity(1, 0.55), result(beat.kind === 'addition' ? '-2147483648' : '4294967295  /  UINT_MAX', 0.55));
    yield* output().scale(1.07, 0.45); yield* output().scale(1, 0.35);
  }

  if (beat.kind === 'truncation') {
    const cars: Rect[] = []; const tunnel = createRef<Rect>(); const result = createRef<Rect>();
    stage.add(<>
      <Txt text={'32-bit input'} x={-720} y={-170} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={25} fontWeight={800} />
      {Array.from({length: 8}, (_, i) => <Rect ref={makeRef(cars, i)} x={-610 + i * 110} y={0} width={94} height={90} radius={4} fill={C.raised} stroke={C.mint} lineWidth={2}><Txt text={i < 4 ? '1' : 'F'} fill={C.mintSoft} fontFamily={MONO} fontSize={28} fontWeight={800} /></Rect>)}
      <Rect ref={tunnel} x={350} y={0} width={290} height={210} radius={6} fill={C.panel} stroke={C.amber} lineWidth={4}><Txt text={'short\n16 bits'} fill={C.amber} fontFamily={MONO} fontSize={26} fontWeight={900} textAlign={'center'} /></Rect>
      <Rect ref={result} x={610} y={0} width={240} height={160} radius={5} fill={C.raised} stroke={C.coral} lineWidth={3}><Txt text={'0xffff\n-1'} fill={C.coral} fontFamily={MONO} fontSize={30} fontWeight={900} textAlign={'center'} /></Rect>
    </>);
    result().opacity(0); yield* sequence(0.08, ...cars.map(car => car.position.x(car.position.x() + 550, 0.55)));
    yield* all(cars[0].opacity(0, 0.3), cars[1].opacity(0, 0.3), cars[2].opacity(0, 0.3), cars[3].opacity(0, 0.3));
    yield* all(result().opacity(1, 0.55), tunnel().stroke(C.coral, 0.55));
  }

  if (beat.kind === 'bounds') {
    const negative = createRef<Rect>(); const right = createRef<Rect>(); const min = createRef<Rect>();
    stage.add(<>
      <Rect x={0} y={20} width={1300} height={160} radius={5} fill={C.raised} stroke={C.rule} lineWidth={3} />
      <Rect ref={right} x={600} y={20} width={12} height={160} fill={C.coral} /><Txt text={'max'} x={600} y={-105} fill={C.coral} fontFamily={MONO} fontSize={22} />
      <Rect ref={negative} x={-460} y={20} width={82} height={82} radius={41} fill={C.coral}><Txt text={'-1'} fill={C.canvas} fontFamily={MONO} fontSize={27} fontWeight={900} /></Rect>
      <Rect ref={min} x={-600} y={20} width={12} height={160} fill={C.mint} opacity={0} /><Txt text={'min'} x={-600} y={-105} fill={C.mint} fontFamily={MONO} fontSize={22} opacity={0} />
      <Txt text={'0 <= x && x <= max'} y={235} fill={C.ink} fontFamily={MONO} fontSize={40} fontWeight={900} />
    </>);
    yield* negative().position.x(-740, 1.1); yield* all(min().opacity(1, 0.5), right().stroke(C.coral, 0.5));
    yield* negative().position.x(-535, 0.8);
  }

  if (beat.kind === 'conversion') {
    const check = createRef<Rect>(); const cast = createRef<Rect>(); const copy = createRef<Rect>(); const size = createSignal('len = -1');
    stage.add(<>
      <Panel x={-460} y={-20} width={650} height={430} stroke={C.amber}><Txt text={'RECONSTRUCTED LAB'} x={-270} y={-150} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={18} fontWeight={800} /><Txt text={'int len = -1;\nif (len <= 512) approve;\nmemcpy(dst, src, len);'} x={-270} y={-45} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={27} lineHeight={1.55} /></Panel>
      <Rect ref={check} x={210} y={-110} width={260} height={118} radius={5} fill={C.raised} stroke={C.mint} lineWidth={3}><Txt text={'len <= 512\nPASS'} fill={C.mint} fontFamily={MONO} fontSize={23} fontWeight={900} textAlign={'center'} /></Rect>
      <Rect ref={cast} x={210} y={90} width={260} height={118} radius={5} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text={'cast to\nsize_t'} fill={C.amber} fontFamily={MONO} fontSize={24} fontWeight={900} textAlign={'center'} /></Rect>
      <Rect ref={copy} x={580} y={0} width={280} height={210} radius={5} fill={C.raised} stroke={C.coral} lineWidth={3}><Txt text={size} fill={C.coral} fontFamily={MONO} fontSize={24} fontWeight={900} textAlign={'center'} /></Rect>
    </>);
    check().opacity(0); cast().opacity(0); copy().opacity(0);
    yield* check().opacity(1, 0.5); yield* cast().opacity(1, 0.5); yield* all(copy().opacity(1, 0.6), size('size_t: 4294967295', 0.6));
    yield* all(copy().scale(1.12, 0.6), copy().stroke(C.coral, 0.6));
  }

  if (beat.kind === 'allocation' || beat.kind === 'heap') {
    const formula = createSignal(beat.kind === 'allocation' ? 'sizeof(T) × count' : 'input → multiply → wrap');
    const allocated = createRef<Rect>(); const writes: Rect[] = []; const spill = createRef<Rect>();
    stage.add(<>
      <Rect y={-210} width={940} height={110} radius={6} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text={formula} fill={C.amber} fontFamily={MONO} fontSize={38} fontWeight={900} /></Rect>
      <MemoryBlock ref={allocated} label={'wrapped allocation: small chunk'} x={-400} y={45} width={480} color={C.mint} />
      <MemoryBlock label={'neighboring object'} x={380} y={45} width={480} color={C.rule} />
      {Array.from({length: 7}, (_, i) => <Rect ref={makeRef(writes, i)} x={-580 + i * 170} y={210} width={130} height={58} radius={4} fill={C.coral} opacity={0}><Txt text={`write ${i}`} fill={C.canvas} fontFamily={MONO} fontSize={16} fontWeight={800} /></Rect>)}
      <Rect ref={spill} x={390} y={-25} width={460} height={250} radius={5} fill={'#F0786E18'} stroke={C.coral} lineWidth={4} opacity={0}><Txt text={beat.kind === 'heap' ? 'heap overflow' : 'writes spill into next chunk'} fill={C.coral} fontFamily={MONO} fontSize={24} fontWeight={900} textAlign={'center'} /></Rect>
    </>);
    allocated().scale.x(0.35); spill().opacity(0);
    yield* allocated().scale.x(1, 0.7); yield* sequence(0.13, ...writes.map(write => write.opacity(1, 0.36)));
    yield* all(spill().opacity(1, 0.6), spill().scale(1.05, 0.6)); yield* spill().scale(1, 0.3);
  }

  if (beat.kind === 'index') {
    const cells: Rect[] = []; const guard = createRef<Rect>(); const overshoot = createRef<Line>();
    stage.add(<>
      {Array.from({length: 12}, (_, i) => <Rect ref={makeRef(cells, i)} x={-660 + i * 120} y={50} width={96} height={96} radius={4} fill={C.raised} stroke={i > 8 ? C.coral : C.rule} lineWidth={2}><Txt text={String(i)} fill={i > 8 ? C.coral : C.mintSoft} fontFamily={MONO} fontSize={22} fontWeight={700} /></Rect>)}
      <Line ref={overshoot} points={[[450, -75], [920, -75], [-600, -75]]} stroke={C.coral} lineWidth={5} endArrow arrowSize={18} radius={30} />
      <Rect ref={guard} y={245} width={840} height={110} radius={5} fill={C.raised} stroke={C.mint} lineWidth={3}><Txt text={'index + length <= buffer_size'} fill={C.mint} fontFamily={MONO} fontSize={32} fontWeight={850} /></Rect>
    </>);
    overshoot().end(0); yield* overshoot().end(1, 1.6); yield* guard().stroke(C.coral, 0.55); yield* cells[10].fill('#F0786E35', 0.5);
  }

  if (beat.kind === 'pointer') {
    const pin = createRef<Circle>(); const route = createRef<Line>(); const checklist = createRef<Rect>();
    stage.add(<>
      <Rect width={1340} height={500} radius={6} fill={C.raised} stroke={C.rule} lineWidth={3} />
      {[-520, -260, 0, 260, 520].map(x => <Line points={[[x, -250], [x, 250]]} stroke={C.rule} lineWidth={1} />)}
      {[-150, 0, 150].map(y => <Line points={[[-670, y], [670, y]]} stroke={C.rule} lineWidth={1} />)}
      <Circle ref={pin} x={-520} y={120} size={38} fill={C.mint} /><Txt text={'base'} x={-520} y={175} fill={C.mint} fontFamily={MONO} fontSize={18} />
      <Line ref={route} points={[[-520, 120], [610, 120], [780, -120], [-450, -120]]} stroke={C.coral} lineWidth={5} endArrow arrowSize={18} radius={40} />
      <Rect ref={checklist} y={330} width={1130} height={96} radius={5} fill={C.panel} stroke={C.amber} lineWidth={2}><Txt text={'check offset before addition   •   length <= object_size - offset'} fill={C.ink} fontFamily={MONO} fontSize={23} fontWeight={700} /></Rect>
    </>);
    route().end(0); checklist().opacity(0); yield* route().end(1, 1.7); yield* pin().position([-450, -120], 0.8); yield* checklist().opacity(1, 0.55);
  }

  if (beat.kind === 'architecture') {
    const rows = [
      ['LP64', '32', '64', '64', '64'],
      ['LLP64', '32', '32', '64', '64'],
    ];
    const cup = createRef<Rect>();
    stage.add(<>
      <Panel x={-120} y={-20} width={1320} height={410} stroke={C.mint}>
        {['model', 'int', 'long', 'pointer', 'size_t'].map((value, i) => <Txt text={value} x={-540 + i * 260} y={-145} fill={C.muted} fontFamily={MONO} fontSize={21} fontWeight={800} />)}
        {rows.map((row, r) => row.map((value, i) => <Rect x={-540 + i * 260} y={-45 + r * 115} width={210} height={75} radius={4} fill={C.raised} stroke={i === 0 ? C.amber : C.rule} lineWidth={2}><Txt text={value} fill={i === 0 ? C.amber : C.ink} fontFamily={MONO} fontSize={24} fontWeight={750} /></Rect>))}
      </Panel>
      <Rect ref={cup} x={650} y={260} width={210} height={120} radius={5} fill={C.raised} stroke={C.coral} lineWidth={3}><Txt text={'int\n32 bits'} fill={C.coral} fontFamily={MONO} fontSize={23} fontWeight={800} textAlign={'center'} /></Rect>
      <Txt text={'64-bit size_t'} x={350} y={260} fill={C.mint} fontFamily={MONO} fontSize={28} fontWeight={850} />
      <RuleArrow from={[470, 260]} to={[530, 260]} color={C.coral} />
    </>);
    cup().scale.y(0.18); yield* cup().scale.y(1, 0.7); yield* cup().fill('#F0786E25', 0.5);
  }

  if (beat.kind === 'disasm') {
    const active = createSignal(39); const disasm = createRef<Rect>(); const eax = createSignal('eax = number_flags');
    stage.add(<>
      <SourceSurface source={storeLines} activeLine={active} scrollLine={() => 31} x={-390} y={-20} width={790} height={590} />
      <Panel ref={disasm} x={425} y={-20} width={750} height={590} stroke={C.amber}>
        <Txt text={'objdump -d -M intel evidence/bin/store'} x={-335} y={-240} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={17} fontWeight={800} />
        {imulLines.map((line, index) => <Rect y={-150 + index * 64} width={700} height={48} radius={3} fill={index === 4 ? '#D8BE7320' : '#00000000'}><Txt text={line} x={-330} width={660} offsetX={-1} fill={index === 4 ? C.ink : C.muted} fontFamily={MONO} fontSize={18} fontWeight={index === 4 ? 750 : 500} /></Rect>)}
        <Rect y={215} width={650} height={76} radius={4} fill={C.raised} stroke={C.coral} lineWidth={2}><Txt text={eax} fill={C.coral} fontFamily={MONO} fontSize={22} fontWeight={850} /></Rect>
      </Panel>
      <Txt text={'local UBSan build unavailable: host libubsan runtime missing'} y={330} fill={C.muted} fontFamily={MONO} fontSize={17} />
    </>);
    disasm().opacity(0); yield* disasm().opacity(1, 0.7); yield* active(39, 0.4); yield* eax('eax = low 32 bits = 0xA0EEBB00', 0.75); yield* active(42, 0.35);
  }

  if (beat.kind === 'fix') {
    const unsafe = createRef<Rect>(); const range = createRef<Rect>(); const checked = createRef<Rect>(); const affordability = createRef<Rect>();
    stage.add(<>
      <Rect ref={unsafe} y={-210} width={900} height={86} radius={5} fill={C.raised} stroke={C.coral} lineWidth={3}><Txt text={'total_cost = 900 * number_flags'} fill={C.coral} fontFamily={MONO} fontSize={29} fontWeight={850} /></Rect>
      <Rect ref={range} x={-420} y={-45} width={520} height={110} radius={5} fill={C.raised} stroke={C.mint} lineWidth={3}><Txt text={'number_flags > 0\nnumber_flags <= INT_MAX / 900'} fill={C.mint} fontFamily={MONO} fontSize={21} fontWeight={800} textAlign={'center'} /></Rect>
      <Rect ref={checked} x={250} y={-45} width={520} height={110} radius={5} fill={C.raised} stroke={C.amber} lineWidth={3}><Txt text={'ckd_mul(&total_cost, 900, number_flags)'} fill={C.amber} fontFamily={MONO} fontSize={19} fontWeight={800} textAlign={'center'} /></Rect>
      <Rect ref={affordability} y={185} width={780} height={100} radius={5} fill={C.raised} stroke={C.mint} lineWidth={3}><Txt text={'total_cost <= account_balance'} fill={C.mint} fontFamily={MONO} fontSize={28} fontWeight={850} /></Rect>
    </>);
    [range(), checked(), affordability()].forEach(node => node.opacity(0));
    yield* unsafe().position.y(-280, 0.7); yield* range().opacity(1, 0.55); yield* checked().opacity(1, 0.55); yield* affordability().opacity(1, 0.55);
    yield* all(range().stroke(C.mint, 0.35), checked().stroke(C.amber, 0.35));
  }

  if (beat.kind === 'checklist') {
    const labels = ['len', 'count', 'idx', 'offset', 'size', 'nbytes', 'capacity'];
    const dots: Rect[] = []; const links: Line[] = [];
    stage.add(<>
      {labels.map((label, i) => <Rect ref={makeRef(dots, i)} x={-660 + (i % 4) * 440} y={-120 + Math.floor(i / 4) * 260} width={210} height={98} radius={5} fill={C.raised} stroke={C.muted} lineWidth={2}><Txt text={label} fill={C.ink} fontFamily={MONO} fontSize={30} fontWeight={850} /></Rect>)}
      <Rect x={580} y={250} width={300} height={84} radius={4} fill={C.raised} stroke={C.coral} lineWidth={3}><Txt text={'malloc  memcpy\nindex  pointer +'} fill={C.coral} fontFamily={MONO} fontSize={19} fontWeight={800} textAlign={'center'} /></Rect>
      {labels.map((_, i) => <Line ref={makeRef(links, i)} points={[[-660 + (i % 4) * 440 + 105, -120 + Math.floor(i / 4) * 260 + 50], [430, 250]]} stroke={C.mint} lineWidth={3} endArrow arrowSize={12} />)}
    </>);
    dots.forEach(dot => dot.opacity(0)); links.forEach(link => link.end(0));
    yield* cascadeIn(dots, 0.12, 0.45); yield* drawPaths(links, 0.07, 0.4);
  }

  if (beat.kind === 'outro') {
    const labels = ['price', 'length', 'allocation size', 'index', 'pointer offset'];
    const cards: Rect[] = [];
    stage.add(<>
      {labels.map((label, i) => <Rect ref={makeRef(cards, i)} x={-600 + (i % 3) * 600} y={-120 + Math.floor(i / 3) * 260} width={470} height={160} radius={6} fill={C.raised} stroke={i === 0 ? C.amber : i > 2 ? C.coral : C.mint} lineWidth={3}><Txt text={label} fill={C.ink} fontFamily={MONO} fontSize={i === 2 ? 28 : 34} fontWeight={850} /></Rect>)}
      <Txt text={'INTEGER BUGS: numbers are boundaries'} y={330} fill={C.ink} fontFamily={SANS} fontSize={52} fontWeight={850} />
      <Txt text={'next: heap metadata and allocator internals'} y={395} fill={C.muted} fontFamily={MONO} fontSize={20} />
    </>);
    cards.forEach(card => {card.opacity(0); card.scale(0.7);}); yield* fanIn(cards, 0.9); yield* cameraTravel(stage, 'push', 1.2);
  }
}

export function createIntegerScene(id: string) {
  const index = beats.findIndex(beat => beat.id === id);
  const beat = beats[index];
  if (!beat) throw new Error(`Unknown beat ${id}`);
  return makeScene2D(function* (view) {
    const stage = createRef<Node>();
    const caption = createSignal(beat.captions[0]);
    view.add(<><Backdrop chapter={beat.chapter} title={beat.title} index={index} /><Node ref={stage} /><CaptionRail text={caption} /></>);
    prepareEntrance(stage(), index % 2 === 0 ? 'track-right' : 'track-left');
    yield* enterStage(stage(), 0.7);
    const bodyDuration = Math.max(2, beat.duration - 1.4);
    yield* all(animateBeat(stage(), beat), captionTrack(caption, beat.captions, bodyDuration));
    yield* exitStage(stage(), index % 2 === 0 ? 'track-left' : 'track-right', 0.7);
  });
}
