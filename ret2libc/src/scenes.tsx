import {Circle, Line, Node, Rect, Txt, makeScene2D as makeScene2DBase} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {ThinhTerminal} from '../../motion-repertoire/motion-canvas/src/toolSurfaces';
import {evidence} from './evidence';
import {C, MONO, SANS} from './theme';

const makeScene2D = (runner: Parameters<typeof makeScene2DBase>[0]) => {
  const scene = makeScene2DBase(runner);
  scene.plugins = [];
  return scene;
};

const D = [28, 50, 64, 50, 90, 148, 152, 108, 95, 97, 123, 155];

function* sceneClock(duration: number, flow: any) {
  yield* all(waitFor(duration), flow);
}

function Backdrop({chapter}: {chapter: string}) {
  return (
    <>
      <Rect width={1920} height={1080} fill={C.bg} />
      {[-840, -520, -200, 120, 440, 760].map(x => (
        <Line key={String(x)} points={[[x, -540], [x, 540]]} stroke={'#26332B44'} lineWidth={1} />
      ))}
      {[-430, -250, -70, 110, 290, 470].map(y => (
        <Line key={String(y)} points={[[-900, y], [900, y]]} stroke={'#26332B22'} lineWidth={1} />
      ))}
      <Rect x={-850} y={-486} width={8} height={26} fill={C.mint} />
      <Txt
        text={chapter.toUpperCase()}
        x={-826}
        y={-486}
        offsetX={-1}
        fill={C.mint}
        fontFamily={MONO}
        fontWeight={800}
        fontSize={16}
        letterSpacing={2.2}
      />
      <Txt
        text={'ret2libc / traced route'}
        x={850}
        y={-486}
        offsetX={1}
        fill={C.muted}
        fontFamily={MONO}
        fontWeight={650}
        fontSize={14}
        letterSpacing={1}
      />
    </>
  );
}

function Text({
  text,
  x = 0,
  y = 0,
  width,
  height,
  size = 24,
  color = C.ink,
  mono = true,
  weight = 650,
  align = 'left',
  opacity = 1,
}: {
  text: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  size?: number;
  color?: any;
  mono?: boolean;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
}) {
  return (
    <Txt
      text={text}
      x={x}
      y={y}
      width={width}
      height={height ?? size * (text.includes('\n') ? 3.2 : 1.45)}
      clip
      offsetX={align === 'left' ? -1 : align === 'right' ? 1 : 0}
      textAlign={align}
      fill={color}
      opacity={opacity}
      fontFamily={mono ? MONO : SANS}
      fontSize={size}
      fontWeight={weight}
    />
  );
}

function Panel({
  x = 0,
  y = 0,
  width = 600,
  height = 320,
  stroke = C.rule,
  fill = C.panel,
  radius = 18,
  opacity = 1,
  ref,
  children,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  key?: string | number;
  stroke?: string;
  fill?: any;
  radius?: number;
  opacity?: number;
  ref?: any;
  children?: any;
}) {
  return (
    <Rect
      ref={ref}
      x={x}
      y={y}
      width={width}
      height={height}
      radius={radius}
      fill={fill}
      stroke={stroke}
      lineWidth={2}
      opacity={opacity}
      clip
    >
      {children}
    </Rect>
  );
}

function TinySource({text, x, y, tone = C.output}: {text: string; x: number; y: number; tone?: string}) {
  return (
    <Rect x={x} y={y} width={Math.min(760, Math.max(260, text.length * 8.8 + 28))} height={34} radius={8} fill={C.raised} stroke={tone} lineWidth={1}>
      <Text text={text} x={-Math.min(730, Math.max(230, text.length * 8.8)) / 2 + 12} y={0} width={Math.min(730, Math.max(230, text.length * 8.8))} height={22} size={14} color={tone} />
    </Rect>
  );
}

function Rows({
  rows,
  x = 0,
  y = 0,
  width = 900,
  size = 16,
  active = -1,
  lineHeight = 26,
}: {
  rows: string[];
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  active?: number | (() => number);
  lineHeight?: number;
}) {
  const current = () => (typeof active === 'function' ? active() : active);
  return (
    <Node x={x} y={y}>
      {rows.map((row, index) => (
        <Rect
          key={`${index}-${row}`}
          y={index * lineHeight}
          width={width}
          height={lineHeight - 2}
          radius={4}
          fill={() => (current() === index ? '#D8BE7333' : '#00000000')}
        >
          <Text
            text={row}
            x={-width / 2 + 12}
            y={0}
            width={width - 24}
            height={lineHeight - 4}
            size={size}
            color={() => (current() === index ? C.amber : C.ink) as any}
            weight={current() === index ? 760 : 560}
          />
        </Rect>
      ))}
    </Node>
  );
}

function Cell({
  label,
  x = 0,
  y = 0,
  width = 110,
  height = 70,
  tone = C.output,
  fill = C.raised,
  size = 20,
  ref,
}: {
  label: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  key?: string | number;
  tone?: string;
  fill?: any;
  size?: number;
  ref?: any;
}) {
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={height} radius={10} fill={fill} stroke={tone} lineWidth={2}>
      <Text text={label} x={-width / 2 + 12} y={0} width={width - 24} height={height - 8} size={size} color={tone} weight={800} />
    </Rect>
  );
}

function Arrow({
  from,
  to,
  tone = C.output,
  ref,
  end = 1,
  width = 4,
}: {
  from: [number, number];
  to: [number, number];
  tone?: string;
  ref?: any;
  end?: number;
  width?: number;
}) {
  return <Line ref={ref} points={[from, to]} stroke={tone} lineWidth={width} endArrow arrowSize={14} radius={8} end={end} />;
}

function Register({name, value, x, y, tone = C.output, ref}: {name: string; value: string; x: number; y: number; tone?: string; ref?: any}) {
  return (
    <Rect ref={ref} x={x} y={y} width={320} height={92} radius={12} fill={C.raised} stroke={tone} lineWidth={2}>
      <Text text={name} x={-136} y={-22} width={90} size={16} color={C.muted} />
      <Text text={value} x={-136} y={18} width={270} size={22} color={tone} weight={820} />
    </Rect>
  );
}

function* pulse(node: Rect | Circle, tone = C.amber) {
  yield* all(node.stroke(tone, 0.25), node.scale(1.07, 0.25));
  yield* node.scale(1, 0.25);
}

export const scene00 = makeScene2D(function* (view) {
  const letters: Txt[] = [];
  const outLetters: Txt[] = [];
  const cells: Rect[] = [];
  const machine = createRef<Rect>();
  const stack = createRef<Node>();
  const rip = createRef<Rect>();
  const stream = createRef<Line>();

  view.add(
    <>
      <Backdrop chapter="00 / hook" />
      <Panel ref={machine} x={-340} y={-30} width={700} height={340} stroke={C.mint}>
        <Text text="echo" x={-290} y={-125} width={170} size={18} color={C.mint} />
        {['h', 'e', 'l', 'l', 'o'].map((letter, index) => (
          <Txt
            key={`in-${index}`}
            ref={makeRef(letters, index)}
            text={letter}
            x={-230 + index * 72}
            y={-30}
            fill={C.ink}
            opacity={0}
            fontFamily={MONO}
            fontSize={72}
            fontWeight={850}
          />
        ))}
        {['H', 'e', 'L', 'l', 'O'].map((letter, index) => (
          <Txt
            key={`out-${index}`}
            ref={makeRef(outLetters, index)}
            text={letter}
            x={-230 + index * 72}
            y={90}
            fill={index % 2 ? C.muted : C.output}
            opacity={0}
            fontFamily={MONO}
            fontSize={72}
            fontWeight={850}
          />
        ))}
        <Line points={[[-260, 35], [290, 35]]} stroke={C.rule} lineWidth={2} />
      </Panel>
      <Node ref={stack} x={555} y={10} opacity={0}>
        <Panel width={500} height={650} stroke={C.rule}>
          <Text text="stack frame" x={-210} y={-278} width={190} size={18} color={C.muted} />
          {['saved RIP', 'saved RBP', 'counter', 'buffer + 96', 'buffer + 32', 'buffer start'].map((label, index) => (
            <Cell
              key={label}
              ref={makeRef(cells, index)}
              label={label}
              y={-190 + index * 78}
              width={360}
              height={58}
              tone={index === 0 ? C.coral : index === 2 ? C.amber : C.output}
              fill={index === 0 ? '#F0786E18' : C.raised}
              size={17}
            />
          ))}
        </Panel>
        <Circle ref={rip} x={178} y={-190} size={34} fill={C.coral} stroke={C.coral} lineWidth={2} />
      </Node>
      <Line ref={stream} points={[[-5, -30], [310, -30], [310, -105]]} stroke={C.output} lineWidth={5} endArrow arrowSize={18} end={0} />
      <TinySource text="animation hook; exact facts begin after the workspace appears" x={-455} y={400} tone={C.muted} />
    </>,
  );

  yield* sceneClock(D[0], sequence(
    0.08,
    ...letters.map(letter => all(letter.opacity(1, 0.45), letter.y(-52, 0.45, easeOutBack), letter.y(-30, 0.25))),
    waitFor(1.0),
    sequence(0.1, ...outLetters.map(letter => all(letter.opacity(1, 0.5), letter.scale(1.1, 0.3), letter.scale(1, 0.25)))),
    waitFor(1.0),
    all(machine().x(-510, 1.0, easeInOutCubic), machine().scale(0.78, 1.0), stack().opacity(1, 0.9), stream().end(1, 1.1)),
    waitFor(0.4),
    sequence(0.12, ...cells.slice().reverse().map(cell => pulse(cell, C.output))),
    pulse(rip(), C.coral),
  ));
});

export const scene01 = makeScene2D(function* (view) {
  const active = createSignal(-1);
  const artifacts: Rect[] = [];
  const makeStrip = createRef<Rect>();
  const arrowA = createRef<Line>();
  const arrowB = createRef<Line>();
  const arrowC = createRef<Line>();

  view.add(
    <>
      <Backdrop chapter="01 / artifacts" />
      <ThinhTerminal
        x={-410}
        y={-125}
        width={930}
        height={410}
        title="real workspace"
        context="00_ls.txt · 02_file.txt"
        activeLine={() => active()}
        lineHeight={29}
        lines={[...evidence.files, ...evidence.file].map((text, index) => ({text, tone: index === 0 || index === 4 ? 'active' : 'default'}))}
      />
      <Node x={540} y={-105}>
        {[
          ['vuln', 'ELF64 executable\nnot stripped', C.mint],
          ['libc.so.6', 'ELF64 shared object\nstripped', C.output],
          ['Makefile.share', 'build context\nnot source code', C.amber],
        ].map(([name, detail, tone], index) => (
          <Panel key={name as string} ref={makeRef(artifacts, index)} y={-130 + index * 135} width={455} height={104} stroke={tone as string} opacity={0}>
            <Text text={name as string} x={-195} y={-23} width={180} size={23} color={tone as string} />
            <Text text={detail as string} x={-195} y={22} width={380} height={48} size={17} color={C.ink} />
          </Panel>
        ))}
      </Node>
      <Arrow ref={arrowA} from={[65, -170]} to={[310, -235]} tone={C.mint} end={0} />
      <Arrow ref={arrowB} from={[65, -116]} to={[310, -100]} tone={C.output} end={0} />
      <Arrow ref={arrowC} from={[65, -64]} to={[310, 35]} tone={C.amber} end={0} />
      <Panel ref={makeStrip} x={0} y={310} width={1540} height={230} stroke={C.amber} opacity={0}>
        <Text text="Makefile.share" x={-710} y={-86} width={230} size={16} color={C.amber} />
        <Rows rows={evidence.makefile} x={0} y={-42} width={1400} size={15} lineHeight={30} active={2} />
      </Panel>
      <TinySource text="source truth: supplied files and exact tool rows" x={-480} y={410} />
    </>,
  );

  yield* sceneClock(D[1], sequence(0,
    ...[0, 1, 2, 3, 4, 5, 6].map(index => sequence(0.0, active(index, 0.24), waitFor(0.6))),
    all(arrowA().end(1, 0.55), delay(0.15, artifacts[0].opacity(1, 0.55))),
    all(arrowB().end(1, 0.55), delay(0.15, artifacts[1].opacity(1, 0.55))),
    all(arrowC().end(1, 0.55), delay(0.15, artifacts[2].opacity(1, 0.55))),
    waitFor(0.8),
    all(makeStrip().opacity(1, 0.7), makeStrip().y(285, 0.7, easeOutCubic)),
    sequence(0.2, ...artifacts.map(card => pulse(card, C.output))),
  ));
});

export const scene02 = makeScene2D(function* (view) {
  const active = createSignal(-1);
  const shellBytes: Rect[] = [];
  const addressTiles: Rect[] = [];
  const nx = createRef<Rect>();
  const route = createRef<Line>();
  const rip = createRef<Circle>();

  view.add(
    <>
      <Backdrop chapter="02 / protections" />
      <ThinhTerminal
        x={-530}
        y={-80}
        width={760}
        height={560}
        title="readelf context"
        context="03 · 04 · 05 · 19"
        activeLine={() => active()}
        lineHeight={27}
        lines={evidence.hardening.map((text, index) => ({text, tone: index % 2 === 0 ? 'active' : 'default'}))}
      />
      <Panel x={340} y={-160} width={850} height={225} stroke={C.coral}>
        <Text text="shellcode bytes try to become instructions" x={-375} y={-76} width={520} size={19} color={C.muted} />
        {['48', '31', 'ff', '57', 'eb', '1f'].map((byte, index) => (
          <Cell key={byte} ref={makeRef(shellBytes, index)} label={byte} x={-285 + index * 92} y={35} width={70} height={58} tone={C.coral} size={20} />
        ))}
        <Rect ref={nx} x={320} y={35} width={92} height={118} radius={20} fill={C.raised} stroke={C.amber} lineWidth={3}>
          <Text text="NX" x={-27} width={80} size={25} color={C.amber} />
        </Rect>
      </Panel>
      <Panel x={340} y={190} width={850} height={245} stroke={C.mint}>
        <Text text="address route remains executable elsewhere" x={-375} y={-88} width={560} size={19} color={C.muted} />
        {['0x400913', '0x601018', '0x400540', '0x4006d8'].map((addr, index) => (
          <Cell key={addr} ref={makeRef(addressTiles, index)} label={addr} x={-310 + index * 205} y={28} width={170} height={66} tone={index === 0 ? C.amber : C.output} size={16} />
        ))}
        <Line ref={route} points={[[-400, 106], [350, 106]]} stroke={C.output} lineWidth={5} endArrow arrowSize={16} end={0} />
        <Circle ref={rip} x={-400} y={106} size={26} fill={C.output} opacity={0} />
      </Panel>
    </>,
  );

  yield* sceneClock(D[2], sequence(0,
    ...[0, 1, 3, 4, 6, 8].map(index => sequence(0.0, active(index, 0.25), waitFor(0.65))),
    sequence(0.08, ...shellBytes.map(tile => tile.x(tile.x() + 130, 0.36, easeInOutCubic))),
    all(nx().fill('#D8BE7338', 0.35), ...shellBytes.map(tile => tile.opacity(0.35, 0.55))),
    waitFor(0.8),
    sequence(0.12, ...addressTiles.map(tile => all(tile.opacity(1, 0.3), tile.scale(1.05, 0.35), tile.scale(1, 0.25)))),
    all(route().end(1, 1.0), rip().opacity(1, 0.2), rip().x(350, 1.15, easeInOutCubic)),
    pulse(addressTiles[0], C.amber),
  ));
});

export const scene03 = makeScene2D(function* (view) {
  const active = createSignal(-1);
  const nodes: Rect[] = [];
  const lines: Line[] = [];
  const lens = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="03 / symbols" />
      <Panel x={-455} y={-40} width={880} height={470} stroke={C.rule}>
        <Rows rows={evidence.symbols} x={0} y={-165} width={790} size={16} active={() => active()} lineHeight={33} />
        <Rect ref={lens} x={0} y={-33} width={820} height={38} radius={6} stroke={C.amber} lineWidth={3} opacity={0} />
      </Panel>
      <Node x={500} y={-40}>
        {[
          ['main', '0x400771', C.output, 0, -160],
          ['do_stuff', '0x4006d8', C.amber, 0, 0],
          ['scanf → loop → puts', 'proven by disassembly', C.mint, 175, 160],
          ['convert_case', '0x400677', C.output, -210, 160],
        ].map(([name, addr, tone, x, y], index) => (
          <Panel key={name as string} ref={makeRef(nodes, index)} x={x as number} y={y as number} width={index > 1 ? 300 : 250} height={92} stroke={tone as string} opacity={0}>
            <Text text={name as string} x={index > 1 ? -130 : -105} y={-16} width={250} size={22} color={tone as string} />
            <Text text={addr as string} x={index > 1 ? -130 : -105} y={22} width={250} size={14} color={C.muted} />
          </Panel>
        ))}
        <Arrow ref={makeRef(lines, 0)} from={[0, -112]} to={[0, -52]} tone={C.output} end={0} />
        <Arrow ref={makeRef(lines, 1)} from={[0, 54]} to={[115, 116]} tone={C.mint} end={0} />
        <Arrow ref={makeRef(lines, 2)} from={[0, 54]} to={[-140, 116]} tone={C.amber} end={0} />
      </Node>
      <TinySource text="symbol rows pull into topology; diagram remains provisional" x={-390} y={392} />
    </>,
  );

  yield* sceneClock(D[3], sequence(0,
    active(1, 0.35),
    all(lens().opacity(1, 0.35), lens().y(-132, 0.35)),
    waitFor(0.8),
    active(4, 0.35),
    lens().y(-33, 0.45),
    sequence(0.16, ...nodes.map(node => all(node.opacity(1, 0.45), node.scale(1.05, 0.35), node.scale(1, 0.2)))),
    sequence(0.18, ...lines.map(line => line.end(1, 0.55))),
    pulse(nodes[1], C.amber),
    all(nodes[1].scale(1.12, 0.6), nodes[0].opacity(0.65, 0.6), nodes[2].opacity(0.65, 0.6), nodes[3].opacity(0.65, 0.6)),
    nodes[1].scale(1, 0.4),
  ));
});

export const scene04 = makeScene2D(function* (view) {
  const active = createSignal(-1);
  const stack = createRef<Node>();
  const scanfArrow = createRef<Line>();
  const bytes: Rect[] = [];
  const decoded = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="04 / scanf bytes" />
      <Panel x={-300} y={-45} width={1160} height={670} stroke={C.rule}>
        <Text text="objdump do_stuff" x={-530} y={-300} width={240} size={15} color={C.output} />
        <Rows rows={evidence.doStuff} x={0} y={-245} width={1080} size={14} active={() => active()} lineHeight={27} />
      </Panel>
      <Node ref={stack} x={570} y={-10} opacity={0}>
        <Panel width={470} height={565} stroke={C.output}>
          <Text text="stack born from rbp references" x={-200} y={-245} width={360} size={17} color={C.muted} />
          {['saved RIP', 'saved RBP', 'counter', 'buffer', 'buffer', 'buffer start'].map((label, index) => (
            <Cell
              key={`${label}-${index}`}
              label={label}
              y={-160 + index * 66}
              width={340}
              height={50}
              tone={index === 0 ? C.coral : index === 2 ? C.amber : C.output}
              size={15}
            />
          ))}
        </Panel>
      </Node>
      <Line ref={scanfArrow} points={[[-120, -82], [335, 110], [405, 110]]} stroke={C.amber} lineWidth={4} endArrow arrowSize={16} end={0} />
      <Panel x={0} y={370} width={1500} height={178} stroke={C.amber}>
        <Text text="rodata bytes" x={-690} y={-58} width={160} size={15} color={C.muted} />
        {['25', '5b', '5e', '0a', '5d', '00', '25', '63', '00'].map((byte, index) => (
          <Cell key={`${byte}-${index}`} ref={makeRef(bytes, index)} label={byte} x={-500 + index * 74} y={15} width={58} height={54} tone={index < 6 ? C.amber : C.output} size={16} />
        ))}
        <Panel ref={decoded} x={500} y={15} width={410} height={98} stroke={C.amber} opacity={0}>
          <Text text={'%[^\\n]      %c'} x={-170} y={-10} width={340} size={29} color={C.amber} />
          <Text text={'unbounded scan until newline'} x={-170} y={34} width={340} size={16} color={C.coral} />
        </Panel>
      </Panel>
    </>,
  );

  yield* sceneClock(D[4], sequence(0,
    ...[0, 3, 4, 5, 6, 7, 10, 11, 14, 15, 17, 18, 19].map(index => sequence(0.0, active(index, 0.22), waitFor(0.45))),
    all(stack().opacity(1, 0.7), scanfArrow().end(1, 0.8)),
    sequence(0.07, ...bytes.map(byte => pulse(byte, C.amber))),
    decoded().opacity(1, 0.6),
    pulse(decoded(), C.coral),
  ));
});

export const scene05 = makeScene2D(function* (view) {
  const cells: Rect[] = [];
  const bracket = createRef<Line>();
  const ripHit = createRef<Rect>();
  const math = createRef<Txt>();
  const input = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="05 / offset" />
      <Panel x={-610} y={0} width={460} height={760} stroke={C.rule}>
        <Text text="source rows" x={-190} y={-330} width={180} size={16} color={C.muted} />
        <Rows rows={[
          '4006eb lea rax,[rbp-0x80]',
          '40076f leave',
          '400770 ret',
        ]} x={0} y={-235} width={380} size={17} active={0} lineHeight={42} />
        <Text text={'buffer start → rbp\nrbp → saved RIP'} x={-190} y={50} width={380} height={130} size={25} color={C.output} />
      </Panel>
      <Panel x={145} y={0} width={970} height={780} stroke={C.output}>
        <Text text="stack grows upward toward the return address" x={-420} y={-334} width={600} size={18} color={C.muted} />
        {[
          ['saved RIP', C.coral],
          ['saved RBP', C.amber],
          ['rbp-0x08 counter', C.amber],
          ['rbp-0x10 local', C.rule],
          ['buffer byte +112', C.output],
          ['buffer byte +96', C.output],
          ['buffer byte +64', C.output],
          ['buffer byte +32', C.output],
          ['buffer byte +0', C.mint],
        ].map(([label, tone], index) => (
          <Cell
            key={label as string}
            ref={makeRef(cells, index)}
            label={label as string}
            x={60}
            y={-275 + index * 70}
            width={570}
            height={52}
            tone={tone as string}
            fill={index === 0 ? '#F0786E18' : index === 1 ? '#D8BE7314' : C.raised}
            size={16}
          />
        ))}
        <Line ref={bracket} points={[[-340, 285], [-340, -205], [-300, -205]]} stroke={C.amber} lineWidth={5} endArrow arrowSize={14} end={0} />
        <Txt ref={math} text="0" x={-250} y={-10} fill={C.amber} fontFamily={MONO} fontSize={42} fontWeight={850} />
        <Rect ref={input} x={-320} y={284} width={34} height={34} radius={17} fill={C.mint} />
        <Rect ref={ripHit} x={346} y={-275} width={56} height={56} radius={28} fill={C.coral} opacity={0} />
      </Panel>
    </>,
  );

  yield* sceneClock(D[5], sequence(0,
    waitFor(0.6),
    all(input().y(-205, 2.3, easeInOutCubic), bracket().end(1, 2.3)),
    math().text('0x80 = 128', 0.9),
    waitFor(0.7),
    all(input().y(-275, 0.9, easeInOutCubic), math().text('128 + 8', 0.9)),
    ripHit().opacity(1, 0.45),
    math().text('OFFSET = 136', 0.9),
    pulse(cells[0], C.coral),
    sequence(0.12, ...cells.slice().reverse().map(cell => pulse(cell, C.output))),
  ));
});

export const scene06 = makeScene2D(function* (view) {
  const active = createSignal(0);
  const cells: Rect[] = [];
  const gate = createRef<Rect>();
  const counter = createRef<Txt>();
  const dCell = createRef<Rect>();
  const codeActive = createSignal(-1);

  view.add(
    <>
      <Backdrop chapter="06 / mutation" />
      <Panel x={-560} y={-25} width={570} height={650} stroke={C.rule}>
        <Text text="convert_case excerpt" x={-245} y={-285} width={260} size={16} color={C.muted} />
        <Rows rows={evidence.convertCase} x={0} y={-220} width={500} size={14} active={() => codeActive()} lineHeight={30} />
      </Panel>
      <Panel x={240} y={-190} width={1030} height={250} stroke={C.mint}>
        <Text text="indices 0–99 mutate; ROP starts at 136" x={-455} y={-92} width={620} size={20} color={C.output} />
        {Array.from({length: 14}, (_, index) => (
          <Cell
            key={String(index)}
            ref={makeRef(cells, index)}
            label={index < 10 ? 'A' : index === 12 ? 'RIP' : '·'}
            x={-420 + index * 66}
            y={20}
            width={54}
            height={58}
            tone={index === 12 ? C.coral : index < 10 ? C.mint : C.rule}
            fill={() => (active() === index ? '#D8BE7333' : index < 10 ? '#8CCB9A16' : C.raised)}
            size={index === 12 ? 13 : 22}
          />
        ))}
        <Panel ref={gate} x={-40} y={20} width={130} height={110} stroke={C.amber} fill={'#D8BE7314'}>
          <Text text="+/- 0x20" x={-50} y={-8} width={110} size={18} color={C.amber} />
        </Panel>
      </Panel>
      <Panel x={250} y={190} width={720} height={270} stroke={C.amber}>
        <Text text="loop counter at rbp-0x8" x={-310} y={-92} width={310} size={18} color={C.muted} />
        <Txt ref={counter} text="0x00" x={-70} y={0} fill={C.amber} fontFamily={MONO} fontSize={66} fontWeight={850} />
        <Rect ref={dCell} x={205} y={0} width={128} height={86} radius={14} fill={'#F0786E18'} stroke={C.coral} lineWidth={2} opacity={0}>
          <Text text="d" x={-18} width={50} size={44} color={C.coral} />
        </Rect>
      </Panel>
    </>,
  );

  const loop: any[] = [];
  for (let index = 0; index < cells.length; index++) {
    loop.push(all(active(index, 0.12), (cells[index].children()[0] as Txt).text(index % 2 === 0 ? 'a' : 'A', 0.25)));
    loop.push(waitFor(0.24));
  }

  yield* sceneClock(D[6], sequence(0,
    ...[1, 2, 3, 4, 5, 6].map(index => sequence(0.0, codeActive(index, 0.18), waitFor(0.4))),
    ...loop,
    all(gate().scale(1.08, 0.4), gate().stroke(C.mint, 0.4)),
    gate().scale(1, 0.3),
    ...['0x01', '0x20', '0x40', '0x63', '0x64'].map(value => sequence(0, counter().text(value, 0.5), waitFor(0.35))),
    dCell().opacity(1, 0.55),
    pulse(dCell(), C.coral),
  ));
});

export const scene07 = makeScene2D(function* (view) {
  const active = createSignal(-1);
  const got = createRef<Rect>();
  const plt = createRef<Rect>();
  const libc = createRef<Rect>();
  const arrows: Line[] = [];
  const leakBytes: Rect[] = [];

  view.add(
    <>
      <Backdrop chapter="07 / plt got" />
      <ThinhTerminal
        x={-535}
        y={-110}
        width={700}
        height={500}
        title="relocation + plt"
        context="07 · 13"
        activeLine={() => active()}
        lineHeight={29}
        lines={evidence.pltGot.map((text, index) => ({text, tone: index === 1 || index === 4 ? 'active' : 'default'}))}
      />
      <Node x={335} y={-90}>
        <Panel ref={plt} x={-170} y={-120} width={330} height={116} stroke={C.amber}>
          <Text text={'puts@plt\n0x400540'} x={-135} y={-12} width={270} height={70} size={24} color={C.amber} />
        </Panel>
        <Panel ref={got} x={230} y={-120} width={330} height={116} stroke={C.output}>
          <Text text={'puts@got\n0x601018'} x={-135} y={-12} width={270} height={70} size={24} color={C.output} />
        </Panel>
        <Panel ref={libc} x={230} y={120} width={360} height={138} stroke={C.mint} opacity={0.35}>
          <Text text={'runtime libc\nputs pointer'} x={-150} y={-16} width={300} height={80} size={22} color={C.mint} />
        </Panel>
        <Arrow ref={makeRef(arrows, 0)} from={[-5, -120]} to={[65, -120]} tone={C.output} end={0} />
        <Arrow ref={makeRef(arrows, 1)} from={[230, -58]} to={[230, 44]} tone={C.mint} end={0} />
        <Line ref={makeRef(arrows, 2)} points={[[230, 195], [230, 220], [20, 220]]} stroke={C.coral} lineWidth={4} endArrow arrowSize={14} radius={8} end={0} />
        {['a0', '8a', 'f2', '7f', '00', '00'].map((byte, index) => (
          <Cell key={byte} ref={makeRef(leakBytes, index)} label={byte} x={20 + index * 64} y={258} width={50} height={48} tone={C.coral} size={15} fill={'#F0786E18'} />
        ))}
      </Node>
      <TinySource text="PLT calls through GOT; GOT contains the runtime libc pointer" x={-415} y={405} />
    </>,
  );

  leakBytes.forEach(byte => byte.opacity(0));
  yield* sceneClock(D[7], sequence(0,
    active(1, 0.28),
    waitFor(0.7),
    active(4, 0.28),
    waitFor(0.7),
    all(plt().scale(1.07, 0.4), got().scale(1.07, 0.4)),
    all(plt().scale(1, 0.25), got().scale(1, 0.25), arrows[0].end(1, 0.7)),
    arrows[1].end(1, 0.7),
    libc().opacity(1, 0.55),
    arrows[2].end(1, 0.7),
    sequence(0.08, ...leakBytes.map(byte => all(byte.opacity(1, 0.35), byte.y(230, 0.35, easeOutBack)))),
    pulse(got(), C.output),
  ));
});

export const scene08 = makeScene2D(function* (view) {
  const contextActive = createSignal(-1);
  const window = createRef<Rect>();
  const decode = createRef<Txt>();
  const bytes: Rect[] = [];
  const shifted: Rect[] = [];
  const shim = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="08 / gadget decode" />
      <Panel x={-520} y={-115} width={700} height={390} stroke={C.rule}>
        <Rows rows={evidence.gadgetContext} x={0} y={-125} width={620} size={15} lineHeight={34} active={() => contextActive()} />
      </Panel>
      <Panel x={380} y={-115} width={720} height={390} stroke={C.amber}>
        <Text text="decoder window over raw bytes" x={-310} y={-150} width={390} size={18} color={C.muted} />
        {['41', '5f', 'c3'].map((byte, index) => (
          <Cell key={byte} ref={makeRef(bytes, index)} label={byte} x={-150 + index * 150} y={-35} width={110} height={84} tone={index === 0 ? C.muted : C.amber} size={28} />
        ))}
        <Rect ref={window} x={-75} y={-35} width={270} height={116} radius={18} stroke={C.coral} lineWidth={4} fill={'#00000000'} />
        <Txt ref={decode} text="41 5f  → pop r15" x={0} y={105} fill={C.muted} fontFamily={MONO} fontSize={28} fontWeight={800} />
      </Panel>
      <Panel x={-250} y={265} width={760} height={190} stroke={C.output}>
        <Rows rows={evidence.gadgetShift} x={0} y={-55} width={680} size={16} lineHeight={34} active={1} />
        {['5f', 'c3'].map((byte, index) => (
          <Cell key={byte} ref={makeRef(shifted, index)} label={byte} x={220 + index * 84} y={52} width={60} height={52} tone={C.output} size={18} />
        ))}
      </Panel>
      <Panel ref={shim} x={570} y={265} width={430} height={190} stroke={C.mint} opacity={0}>
        <Rows rows={evidence.retShim.slice(1)} x={0} y={-42} width={360} size={15} lineHeight={32} active={1} />
        <Text text="ret shim parked for stage two" x={-165} y={65} width={330} size={16} color={C.mint} />
      </Panel>
    </>,
  );

  shifted.forEach(node => node.opacity(0));
  yield* sceneClock(D[8], sequence(0,
    contextActive(2, 0.25),
    waitFor(0.6),
    all(window().x(-75, 0.4), decode().text('41 5f  → pop r15', 0.4)),
    waitFor(0.7),
    all(window().x(0, 0.8, easeInOutCubic), window().width(270, 0.8), decode().text('5f c3  → pop rdi ; ret', 0.8)),
    sequence(0.12, ...shifted.map(node => all(node.opacity(1, 0.35), node.scale(1.08, 0.35), node.scale(1, 0.2)))),
    pulse(bytes[1], C.output),
    pulse(bytes[2], C.output),
    shim().opacity(1, 0.65),
    pulse(shim(), C.mint),
  ));
});

export const scene09 = makeScene2D(function* (view) {
  const blocks: Rect[] = [];
  const rip = createRef<Circle>();
  const rdi = createRef<Rect>();
  const putCall = createRef<Rect>();
  const leakLine = createRef<Line>();
  const gate = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="09 / stage one" />
      <Panel x={-360} y={-10} width={660} height={760} stroke={C.output}>
        <Text text="stage-one stack route" x={-285} y={-330} width={330} size={18} color={C.muted} />
        {[
          ['A × 136', C.output],
          ['0x400913\npop rdi ; ret', C.amber],
          ['0x601018\nputs@got', C.output],
          ['0x400540\nputs@plt', C.amber],
          ['0x4006d8\ndo_stuff', C.mint],
        ].map(([label, tone], index) => (
          <Cell key={label as string} ref={makeRef(blocks, index)} label={label as string} y={-210 + index * 96} width={430} height={72} tone={tone as string} size={index ? 16 : 22} />
        ))}
        <Circle ref={rip} x={250} y={-210} size={34} fill={C.coral} />
      </Panel>
      <Register ref={rdi} name="RDI" value="unset" x={300} y={-245} tone={C.amber} />
      <Panel ref={putCall} x={315} y={-35} width={640} height={190} stroke={C.amber} opacity={0.45}>
        <Text text="puts@plt( puts@got )" x={-260} y={-30} width={520} size={29} color={C.amber} />
        <Text text="prints raw bytes from GOT cell" x={-260} y={36} width={520} size={18} color={C.muted} />
      </Panel>
      <Line ref={leakLine} points={[[315, 70], [315, 185], [595, 185]]} stroke={C.coral} lineWidth={5} endArrow arrowSize={16} end={0} />
      <Panel ref={gate} x={315} y={285} width={650} height={150} stroke={C.coral} opacity={0}>
        <Rows rows={evidence.runtime} x={0} y={-42} width={580} size={14} lineHeight={30} active={1} />
      </Panel>
    </>,
  );

  yield* sceneClock(D[9], sequence(0,
    ...blocks.map((block, index) => sequence(0,
      all(rip().y(block.y(), 0.55, easeInOutCubic), pulse(block, index === 0 ? C.output : C.amber)),
      waitFor(0.25),
    )),
    (rdi().children()[1] as Txt).text('0x601018', 0.55),
    putCall().opacity(1, 0.45),
    pulse(putCall(), C.amber),
    leakLine().end(1, 0.8),
    gate().opacity(1, 0.7),
    pulse(gate(), C.coral),
  ));
});

export const scene10 = makeScene2D(function* (view) {
  const active = createSignal(-1);
  const ruler = createRef<Node>();
  const leakPin = createRef<Rect>();
  const base = createRef<Txt>();
  const system = createRef<Txt>();
  const binsh = createRef<Txt>();

  view.add(
    <>
      <Backdrop chapter="10 / libc ruler" />
      <ThinhTerminal
        x={-430}
        y={-160}
        width={880}
        height={360}
        title="provided libc offsets"
        context="17 · 18"
        activeLine={() => active()}
        lineHeight={30}
        lines={evidence.libc.map((text, index) => ({text, tone: index === 1 || index === 2 || index === 4 ? 'active' : 'default'}))}
      />
      <Node ref={ruler} x={210} y={165} opacity={0}>
        <Rect width={1260} height={82} radius={20} fill={C.raised} stroke={C.rule} lineWidth={2} />
        {[
          ['puts', '+0x80a30', -350, C.output],
          ['system', '+0x4f4e0', 35, C.amber],
          ['/bin/sh', '+0x1b40fa', 465, C.mint],
        ].map(([name, offset, x, tone]) => (
          <Node key={name as string} x={x as number}>
            <Rect y={-70} width={5} height={150} fill={tone as string} />
            <Text text={`${name}\n${offset}`} x={-72} y={93} width={160} height={58} size={18} color={tone as string} />
          </Node>
        ))}
        <Rect ref={leakPin} x={-540} y={-88} width={170} height={54} radius={10} fill={'#F0786E18'} stroke={C.coral} lineWidth={2}>
          <Text text="leaked puts" x={-70} width={140} size={15} color={C.coral} />
        </Rect>
      </Node>
      <Panel x={310} y={-170} width={800} height={245} stroke={C.output}>
        <Txt ref={base} text="libc_base = leaked_puts − 0x80a30" x={-360} y={-70} width={730} height={34} offsetX={-1} fill={C.output} fontFamily={MONO} fontSize={24} fontWeight={800} />
        <Txt ref={system} text="system = libc_base + 0x4f4e0" x={-360} y={0} width={730} height={34} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={24} fontWeight={800} />
        <Txt ref={binsh} text="binsh = libc_base + 0x1b40fa" x={-360} y={70} width={730} height={34} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={24} fontWeight={800} />
      </Panel>
    </>,
  );

  yield* sceneClock(D[10], sequence(0,
    active(1, 0.25),
    waitFor(0.55),
    active(2, 0.25),
    waitFor(0.55),
    active(4, 0.25),
    ruler().opacity(1, 0.65),
    all(ruler().x(360, 1.0, easeInOutCubic), leakPin().x(-350, 1.0, easeInOutCubic)),
    pulse(leakPin(), C.coral),
    all(base().scale(1.08, 0.35), base().fill(C.amber, 0.35)),
    base().scale(1, 0.25),
    system().scale(1.08, 0.35),
    system().scale(1, 0.25),
    binsh().scale(1.08, 0.35),
    binsh().scale(1, 0.25),
  ));
});

export const scene11 = makeScene2D(function* (view) {
  const routeBlocks: Rect[] = [];
  const alignGate = createRef<Rect>();
  const rdi = createRef<Rect>();
  const route = createRef<Line>();
  const pitfallCards: Rect[] = [];
  const final = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="11 / route" />
      <Panel x={-520} y={-110} width={660} height={460} stroke={C.output}>
        <Text text="stage-two stack route" x={-285} y={-190} width={320} size={18} color={C.muted} />
        {[
          ['B × 136', C.output],
          ['0x40052e\nret', C.output],
          ['0x400913\npop rdi ; ret', C.amber],
          ['libc+0x1b40fa\n/bin/sh', C.mint],
          ['libc+0x4f4e0\nsystem', C.amber],
        ].map(([label, tone], index) => (
          <Cell key={label as string} ref={makeRef(routeBlocks, index)} label={label as string} x={-260 + index * 130} y={60} width={116} height={96} tone={tone as string} size={index ? 12 : 16} />
        ))}
      </Panel>
      <Panel ref={alignGate} x={380} y={-250} width={520} height={180} stroke={C.coral}>
        <Text text="RSP % 16" x={-210} y={-58} width={180} size={18} color={C.muted} />
        <Text text="wrong" x={-210} y={8} width={200} size={42} color={C.coral} />
        <Text text="ret +8 bytes" x={40} y={8} width={210} size={20} color={C.output} />
      </Panel>
      <Register ref={rdi} name="RDI" value="libc + 0x1b40fa" x={380} y={-40} tone={C.mint} />
      <Line ref={route} points={[[380, 20], [380, 140], [650, 140]]} stroke={C.amber} lineWidth={5} endArrow arrowSize={16} end={0} />
      <Panel x={380} y={215} width={610} height={165} stroke={C.amber}>
        <Text text={'system("/bin/sh")'} x={-250} y={-22} width={500} size={36} color={C.amber} />
        <Text text="symbolic call model; shell transcript needs matching runtime" x={-250} y={46} width={500} size={16} color={C.muted} />
      </Panel>
      <Node y={210} opacity={0}>
        {[
          ['AaAaAa', '0–99 mutate', C.mint],
          ['trailing d', 'counter = 0x64', C.amber],
          ['0x400913', 'mid-byte gadget', C.output],
          ['loader', 'runtime pending', C.coral],
        ].map(([title, sub, tone], index) => (
          <Panel key={title as string} ref={makeRef(pitfallCards, index)} x={-660 + index * 330} y={0} width={280} height={120} stroke={tone as string} opacity={0}>
            <Text text={title as string} x={-112} y={-24} width={225} size={24} color={tone as string} />
            <Text text={sub as string} x={-112} y={25} width={225} size={16} color={C.ink} />
          </Panel>
        ))}
      </Node>
      <Panel ref={final} x={0} y={320} width={1540} height={185} stroke={C.mint} opacity={0}>
        <Text text={'overflow → control RIP → pop rdi ; ret → puts(puts@got) → libc base → system("/bin/sh")'} x={-700} y={-18} width={1400} size={25} color={C.ink} />
        <Text text={'payload never becomes code; it becomes a path through trusted code'} x={-700} y={52} width={1400} size={19} color={C.output} />
      </Panel>
    </>,
  );

  yield* sceneClock(D[11], sequence(0,
    sequence(0.12, ...routeBlocks.map(block => pulse(block, C.output))),
    all(alignGate().stroke(C.mint, 0.55), (alignGate().children()[1] as Txt).text('aligned', 0.55), (alignGate().children()[1] as Txt).fill(C.mint, 0.55)),
    pulse(routeBlocks[1], C.output),
    pulse(routeBlocks[2], C.amber),
    pulse(rdi(), C.mint),
    route().end(1, 0.85),
    waitFor(0.8),
    sequence(0.2, ...pitfallCards.map(card => card.opacity(1, 0.5))),
    sequence(0.12, ...pitfallCards.map(card => pulse(card, C.amber))),
    all(...pitfallCards.map((card, index) => card.y(index % 2 ? -40 : 40, 0.7, easeInOutCubic))),
    all(...pitfallCards.map(card => card.opacity(0, 0.6))),
    final().opacity(1, 0.8),
    pulse(final(), C.mint),
  ));
});
