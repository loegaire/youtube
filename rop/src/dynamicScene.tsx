import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  makeRef,
  waitFor,
} from '@motion-canvas/core';
import beatsData from '../data/beats.json';
import {
  AddressCell,
  CameraFrame,
  ChapterStamp,
  Chip,
  FlatWorld,
  TechnicalTitle,
  cameraTravel,
  cascadeIn,
  drawPaths,
  enterStage,
  exitStage,
  fanIn,
  focusPulse,
  prepareEntrance,
  sweep,
} from './motionRepertoire';
import {CameraMove, SHOT_DIRECTIONS, ShotDirection, ShotSpace} from './shotScript';
import {C, MONO} from './theme';

export interface Beat {
  id: string;
  chapter: string;
  start: number;
  end: number;
  title: string;
  kind: string;
  narration: string;
  items: string[];
  state: string[];
  footer: string;
  frames?: number;
}

export const BEATS = beatsData as Beat[];

interface Runtime {
  beat: Beat;
  direction: ShotDirection;
  stage: ReturnType<typeof createRef<Node>>;
  visual: ReturnType<typeof createRef<Node>>;
  title: ReturnType<typeof createRef<Txt>>;
  itemNodes: Rect[];
  stateNodes: Rect[];
  paths: Line[];
  featureNodes: Rect[];
}

const firstBeatOfChapter = (beat: Beat) =>
  BEATS.find(row => row.chapter === beat.chapter)?.id === beat.id;

const oppositeMove = (move: CameraMove): CameraMove => ({
  push: 'pull',
  pull: 'push',
  'track-left': 'track-right',
  'track-right': 'track-left',
  'tilt-left': 'tilt-right',
  'tilt-right': 'tilt-left',
  drop: 'rise',
  rise: 'drop',
})[move] as CameraMove;

const titlePose = (beat: Beat) => {
  if (beat.id === 'challenge-02' || beat.id === 'gadgets-01') {
    return {x: 0, y: -445, width: 1500, size: 56, align: 'center' as const};
  }
  const index = BEATS.findIndex(row => row.id === beat.id);
  return [
    {x: -820, y: -392, width: 1360, size: 68, align: 'left' as const},
    {x: 820, y: -390, width: 1330, size: 66, align: 'right' as const},
    {x: -760, y: -350, width: 1240, size: 58, align: 'left' as const},
    {x: 0, y: -414, width: 1500, size: 72, align: 'center' as const},
  ][index % 4];
};

const accentFor = (beat: Beat, index: number) => {
  if (beat.id.includes('nx-03') || beat.id.includes('register-06')) {
    return index === beat.items.length - 1 ? C.red : C.yellow;
  }
  if (beat.id.startsWith('write-')) return index % 3 === 2 ? C.orange : C.mint2;
  if (beat.kind === 'gadget') return C.orange;
  if (beat.kind === 'compare') return index < Math.ceil(beat.items.length / 2) ? C.red : C.mint;
  if (beat.kind === 'register') return index === 0 ? C.yellow : C.mint;
  return index === beat.items.length - 1 ? C.yellow : C.mint;
};

const FA = MONO;
const GLYPH = {
  address: '\uf041',
  bug: '\uf188',
  code: '\uf121',
  data: '\uf1c0',
  file: '\uf15c',
  folder: '\uf07b',
  gadget: '\uf013',
  input: '\uf11c',
  kernel: '\uf2db',
  lock: '\uf023',
  memory: '\uf1c0',
  play: '\uf04b',
  register: '\uf2db',
  return: '\uf2ea',
  route: '\uf074',
  search: '\uf002',
  stack: '\uf0c9',
  terminal: '\uf120',
  warning: '\uf071',
};

function glyphFor(text: string, beat?: Beat) {
  const value = text.toLowerCase();
  if (value.includes('no ') || value.includes('blocked') || value.includes('nx')) return GLYPH.lock;
  if (value.includes('find') || value.includes('search')) return GLYPH.search;
  if (value.includes('gets') || value.includes('overflow') || value.includes('bug')) return GLYPH.bug;
  if (value.includes('eax') || value.includes('ebx') || value.includes('ecx') || value.includes('edx') || value.includes('cpu')) return GLYPH.register;
  if (value.includes('stack') || value.includes('esp') || value.includes('padding')) return GLYPH.stack;
  if (value.includes('memory') || value.includes('buffer') || value.includes('/bin') || value.includes('rw')) return GLYPH.memory;
  if (value.includes('ret') || value.includes('return')) return GLYPH.return;
  if (value.includes('address') || value.startsWith('0x')) return GLYPH.address;
  if (value.includes('int 0x80') || value.includes('syscall') || value.includes('execute')) return GLYPH.play;
  if (value.includes('input') || /^a a|user input/.test(value)) return GLYPH.input;
  if (value.includes('code') || value.includes('instruction') || value.includes('main') || value.includes('vuln')) return GLYPH.code;
  if (value.includes('data') || value.includes('value') || value.includes('byte')) return GLYPH.data;
  if (beat?.kind === 'gadget' || value.includes('gadget') || value.includes('pop ') || value.includes('mov ')) return GLYPH.gadget;
  return GLYPH.file;
}

function IconDisc({
  glyph,
  x = 0,
  y = 0,
  size = 76,
  color = C.mint,
}: {
  glyph: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={size}
      height={size}
      radius={size / 2}
      fill={color === C.bg ? C.text : C.bg}
      stroke={color}
      lineWidth={2}
    >
      <Txt
        text={glyph}
        fill={color}
        fontFamily={FA}
        fontWeight={900}
        fontSize={size * 0.42}
      />
    </Rect>
  );
}

function trackedPoints(from: () => Rect, to: () => Rect) {
  return () => {
    const start = from().position();
    const end = to().position();
    return [
      [start.x, start.y] as [number, number],
      [end.x, end.y] as [number, number],
    ];
  };
}

function TrackedArrow({
  from,
  to,
  color = C.mint2,
  ref,
}: {
  key?: string;
  from: () => Rect;
  to: () => Rect;
  color?: string;
  ref: any;
}) {
  return (
    <Line
      ref={ref}
      zIndex={-10}
      points={trackedPoints(from, to)}
      stroke={color}
      lineWidth={4}
      endArrow
      arrowSize={16}
    />
  );
}

function ItemChip({
  beat,
  text,
  index,
  x,
  y,
  width = 310,
  height = 86,
  ref,
}: {
  key?: string;
  beat: Beat;
  text: string;
  index: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  ref: any;
}) {
  return (
    <Rect
      ref={ref}
      x={x}
      y={y}
      width={width}
      height={height}
      radius={8}
      fill={index % 2 ? C.panel : C.raised}
      stroke={accentFor(beat, index)}
      lineWidth={2}
    >
      <IconDisc
        glyph={glyphFor(text, beat)}
        x={-width / 2 + Math.min(48, height * 0.47)}
        size={Math.min(58, height * 0.68)}
        color={accentFor(beat, index)}
      />
      <Txt
        text={text}
        x={Math.min(42, width * 0.12)}
        width={width - Math.min(118, width * 0.34)}
        textWrap
        fill={accentFor(beat, index)}
        fontFamily={MONO}
        fontSize={Math.min(24, height * 0.28)}
        fontWeight={720}
        textAlign={'center'}
      />
    </Rect>
  );
}

function StateChip({
  text,
  index,
  x,
  y,
  width = 280,
  ref,
}: {
  key?: string;
  text: string;
  index: number;
  x: number;
  y: number;
  width?: number;
  ref: any;
}) {
  return (
    <Rect
      ref={ref}
      x={x}
      y={y}
      width={width}
      height={64}
      radius={32}
      fill={C.bg}
      stroke={index === 0 ? C.yellow : C.rule}
      lineWidth={2}
    >
      <Txt
        text={glyphFor(text)}
        x={-width / 2 + 34}
        fill={index === 0 ? C.yellow : C.mint2}
        fontFamily={FA}
        fontWeight={900}
        fontSize={20}
      />
      <Txt
        text={text}
        x={18}
        width={width - 76}
        textWrap
        fill={index === 0 ? C.yellow : C.mint2}
        fontFamily={MONO}
        fontSize={18}
        fontWeight={700}
        textAlign={'center'}
      />
    </Rect>
  );
}

function MicroscopeSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths} = runtime;
  return (
    <>
      <Line
        ref={makeRef(paths, 0)}
        points={[[-720, 80], [720, 80]]}
        stroke={C.rule}
        lineWidth={3}
      />
      {beat.items.map((item, index) => (
        <Rect
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-micro-${index}`}
          x={-470 + index * (940 / Math.max(beat.items.length - 1, 1))}
          y={index % 2 ? 75 : -35}
          width={beat.items.length > 4 ? 255 : 340}
          height={index === 0 ? 138 : 106}
          radius={10}
          fill={C.raised}
          stroke={accentFor(beat, index)}
          lineWidth={2}
        >
          <Txt
            text={item}
            width={beat.items.length > 4 ? 225 : 310}
            textWrap
            fill={accentFor(beat, index)}
            fontFamily={MONO}
            fontSize={index === 0 ? 34 : 24}
            fontWeight={800}
            textAlign={'center'}
          />
        </Rect>
      ))}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-micro-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={260}
          width={260}
        />
      ))}
    </>
  );
}

function ConveyorSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths} = runtime;
  const vertical = beat.id === 'intro-02' || beat.id.includes('register-05') || beat.id.includes('register-06');
  return (
    <>
      {beat.items.slice(0, -1).map((_, index) => (
        <TrackedArrow
          key={`${beat.id}-conveyor-track-${index}`}
          ref={makeRef(paths, index)}
          from={() => itemNodes[index]}
          to={() => itemNodes[index + 1]}
          color={index === beat.items.length - 2 ? C.yellow : C.mint2}
        />
      ))}
      {beat.items.map((item, index) => {
        const x = vertical ? -210 : -590 + index * (1180 / Math.max(beat.items.length - 1, 1));
        const y = vertical ? -205 + index * (440 / Math.max(beat.items.length - 1, 1)) : 42 + (index % 2) * 108;
        return (
          <ItemChip
            ref={makeRef(itemNodes, index)}
            key={`${beat.id}-conveyor-${index}`}
            beat={beat}
            text={item}
            index={index}
            x={x}
            y={y}
            width={vertical ? 560 : Math.min(330, 1260 / Math.max(beat.items.length, 1))}
            height={vertical ? 82 : 92}
          />
        );
      })}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-conveyor-state-${index}`}
          text={text}
          index={index}
          x={vertical ? 440 : -430 + index * (860 / Math.max(beat.state.length - 1, 1))}
          y={vertical ? -150 + index * 145 : -210}
          width={vertical ? 360 : 300}
        />
      ))}
    </>
  );
}

function RouteSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths} = runtime;
  const count = beat.items.length;
  const points = beat.items.map((_, index) => {
    const t = count <= 1 ? 0 : index / (count - 1);
    return [-650 + t * 1300, -130 + (index % 2) * 300] as [number, number];
  });
  return (
    <>
      {points.slice(0, -1).map((_, index) => (
        <TrackedArrow
          ref={makeRef(paths, index)}
          key={`${beat.id}-route-line-${index}`}
          from={() => itemNodes[index]}
          to={() => itemNodes[index + 1]}
          color={index === points.length - 2 ? C.yellow : C.mint2}
        />
      ))}
      {beat.items.map((item, index) => (
        <ItemChip
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-route-${index}`}
          beat={beat}
          text={item}
          index={index}
          x={points[index][0]}
          y={points[index][1]}
          width={Math.min(330, 1300 / Math.max(count - 0.5, 1))}
          height={100}
        />
      ))}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-route-state-${index}`}
          text={text}
          index={index}
          x={-410 + index * (820 / Math.max(beat.state.length - 1, 1))}
          y={315}
          width={310}
        />
      ))}
    </>
  );
}

function CodeMapSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths} = runtime;
  const activeIndex = beat.id === 'return-02' ? 1 : beat.items.length - 1;
  const rowGap = Math.min(82, 320 / Math.max(beat.items.length - 1, 1));
  return (
    <>
      <CameraFrame x={-270} y={20} width={1180} height={570} color={C.rule}>
        <Rect y={-245} width={1156} height={64} fill={C.raised}>
          <Txt
            text={GLYPH.code}
            x={-526}
            fill={C.mint}
            fontFamily={FA}
            fontWeight={900}
            fontSize={22}
          />
          <Txt
            text={beat.id.startsWith('challenge') ? 'vuln.c' : '.text / source map'}
            x={-492}
            offsetX={-1}
            fill={C.muted}
            fontFamily={MONO}
            fontSize={20}
          />
        </Rect>
        {beat.items.map((item, index) => (
          <Rect
            ref={makeRef(itemNodes, index)}
            key={`${beat.id}-code-${index}`}
            x={0}
            y={-145 + index * rowGap}
            width={1080}
            height={60}
            radius={3}
            fill={index === activeIndex ? C.raised : C.panel}
            stroke={index === activeIndex ? C.mint : `${C.rule}88`}
            lineWidth={index === activeIndex ? 2 : 1}
          >
            <Txt
              text={String(index + 1).padStart(2, '0')}
              x={-500}
              width={48}
              offsetX={-1}
              fill={C.muted}
              fontFamily={MONO}
              fontSize={19}
            />
            <Txt
              text={item}
              x={-430}
              width={850}
              offsetX={-1}
              fill={index === activeIndex ? C.mint : C.text}
              fontFamily={MONO}
              fontSize={25}
              fontWeight={index === activeIndex ? 760 : 620}
            />
          </Rect>
        ))}
      </CameraFrame>
      <TrackedArrow
        ref={makeRef(paths, 0)}
        from={() => itemNodes[activeIndex]}
        to={() => stateNodes[0]}
        color={C.yellow}
      />
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-code-state-${index}`}
          text={text}
          index={index}
          x={570}
          y={-85 + index * 120}
          width={390}
        />
      ))}
    </>
  );
}

function TerminalSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths, featureNodes} = runtime;
  return (
    <>
      <CameraFrame x={-130} y={20} width={1450} height={570} color={C.mint}>
        <Rect y={-252} width={1446} height={64} fill={C.raised}>
          <Txt
            text={'$ ./can-you-gets-me'}
            x={-650}
            offsetX={-1}
            fill={C.muted}
            fontFamily={MONO}
            fontSize={20}
          />
        </Rect>
        {beat.items.map((item, index) => (
          <Rect
            ref={makeRef(itemNodes, index)}
            key={`${beat.id}-terminal-${index}`}
            x={-360 + (index % 2) * 660}
            y={-130 + Math.floor(index / 2) * 135}
            width={600}
            height={88}
            radius={6}
            fill={C.bg}
            stroke={item.includes('no ') ? C.red : C.rule}
            lineWidth={2}
          >
            <Txt
              text={item}
              x={-260}
              width={520}
              textWrap
              offsetX={-1}
              fill={item.includes('no ') ? C.red : C.text}
              fontFamily={MONO}
              fontSize={25}
              fontWeight={700}
            />
          </Rect>
        ))}
        <Rect
          ref={makeRef(featureNodes, 0)}
          x={-600}
          y={218}
          width={12}
          height={44}
          fill={C.mint}
        />
      </CameraFrame>
      <Line
        ref={makeRef(paths, 0)}
        points={[[-790, -205], [510, -205]]}
        stroke={C.yellow}
        lineWidth={3}
      />
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-terminal-state-${index}`}
          text={text}
          index={index}
          x={610}
          y={-100 + index * 110}
          width={390}
        />
      ))}
    </>
  );
}

function ShardsSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths} = runtime;
  const positions = [
    [-480, -110, -6],
    [-150, 120, 4],
    [220, -130, -3],
    [500, 120, 6],
  ];
  return (
    <>
      {beat.items.map((item, index) => (
        <Rect
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-shard-${index}`}
          x={positions[index % positions.length][0]}
          y={positions[index % positions.length][1]}
          rotation={positions[index % positions.length][2]}
          width={360}
          height={150}
          radius={8}
          fill={C.raised}
          stroke={C.orange}
          lineWidth={2}
        >
          <Txt
            text={item}
            width={310}
            textWrap
            fill={C.orange}
            fontFamily={MONO}
            fontSize={28}
            fontWeight={760}
            textAlign={'center'}
          />
        </Rect>
      ))}
      {beat.items.slice(0, -1).map((_, index) => (
        <TrackedArrow
          ref={makeRef(paths, index)}
          key={`${beat.id}-shard-line-${index}`}
          from={() => itemNodes[index]}
          to={() => itemNodes[index + 1]}
          color={C.mint2}
        />
      ))}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-shard-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={310}
          width={280}
        />
      ))}
    </>
  );
}

function TypographySpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes} = runtime;
  const twoColumn = beat.items.length >= 4;
  return (
    <>
      {beat.items.map((item, index) => (
        <Rect
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-type-${index}`}
          x={twoColumn ? (index % 2 ? 410 : -410) : (index % 2 ? 280 : -310)}
          y={twoColumn ? -120 + Math.floor(index / 2) * 240 : -165 + index * (330 / Math.max(beat.items.length - 1, 1))}
          width={twoColumn ? 650 : 820}
          height={twoColumn ? 132 : 112}
          radius={4}
          fill={index === 0 ? C.mint : C.bg}
          stroke={index === 0 ? C.mint : C.rule}
          lineWidth={2}
        >
          <IconDisc
            glyph={glyphFor(item, beat)}
            x={twoColumn ? -268 : -350}
            size={56}
            color={index === 0 ? C.bg : accentFor(beat, index)}
          />
          <Txt
            text={item}
            x={36}
            width={twoColumn ? 500 : 650}
            textWrap
            fill={index === 0 ? C.bg : accentFor(beat, index)}
            fontFamily={MONO}
            fontSize={index === 0 ? (twoColumn ? 34 : 42) : (twoColumn ? 28 : 31)}
            fontWeight={820}
            textAlign={'center'}
          />
        </Rect>
      ))}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-type-state-${index}`}
          text={text}
          index={index}
          x={-540 + index * (1080 / Math.max(beat.state.length - 1, 1))}
          y={340}
          width={270}
        />
      ))}
    </>
  );
}

function StackSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths, featureNodes} = runtime;
  return (
    <>
      <Rect
        ref={makeRef(featureNodes, 0)}
        x={-300}
        y={25}
        width={660}
        height={610}
        radius={12}
        fill={C.panel}
        stroke={C.orange}
        lineWidth={2}
      />
      <Txt
        text={'ESP ↓'}
        x={-690}
        y={-235}
        fill={C.yellow}
        fontFamily={MONO}
        fontSize={26}
        fontWeight={800}
      />
      {beat.items.map((item, index) => (
        <ItemChip
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-stack-${index}`}
          beat={beat}
          text={item}
          index={index}
          x={-300}
          y={-190 + index * (410 / Math.max(beat.items.length - 1, 1))}
          width={570}
          height={82}
        />
      ))}
      <TrackedArrow
        ref={makeRef(paths, 0)}
        from={() => itemNodes[0]}
        to={() => stateNodes[0]}
        color={C.yellow}
      />
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-stack-state-${index}`}
          text={text}
          index={index}
          x={500}
          y={-170 + index * 145}
          width={420}
        />
      ))}
    </>
  );
}

function SplitSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths} = runtime;
  const midpoint = Math.ceil(beat.items.length / 2);
  return (
    <>
      <Line
        ref={makeRef(paths, 0)}
        points={[[0, -300], [0, 300]]}
        stroke={C.rule}
        lineWidth={4}
      />
      <Txt text={'A'} x={-690} y={-270} fill={C.muted} fontFamily={MONO} fontSize={21} />
      <Txt text={'B'} x={690} y={-270} fill={C.muted} fontFamily={MONO} fontSize={21} />
      {beat.items.map((item, index) => {
        const right = index >= midpoint;
        const local = right ? index - midpoint : index;
        return (
          <ItemChip
            ref={makeRef(itemNodes, index)}
            key={`${beat.id}-split-${index}`}
            beat={beat}
            text={item}
            index={index}
            x={right ? 390 : -390}
            y={-135 + local * 150}
            width={650}
            height={112}
          />
        );
      })}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-split-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={330}
          width={290}
        />
      ))}
    </>
  );
}

function BoundarySpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths, featureNodes} = runtime;
  return (
    <>
      <Rect
        ref={makeRef(featureNodes, 0)}
        y={0}
        width={1840}
        height={10}
        fill={beat.id === 'nx-03' ? C.red : C.mint}
      />
      <Txt
        text={beat.id === 'syscall-02' ? 'USER MODE' : 'EXECUTABLE'}
        x={-760}
        y={-280}
        fill={C.muted}
        fontFamily={MONO}
        fontSize={23}
        fontWeight={760}
      />
      <Txt
        text={beat.id === 'syscall-02' ? 'KERNEL MODE' : 'NON-EXECUTABLE'}
        x={-730}
        y={280}
        fill={C.muted}
        fontFamily={MONO}
        fontSize={23}
        fontWeight={760}
      />
      {beat.items.map((item, index) => (
        <ItemChip
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-boundary-${index}`}
          beat={beat}
          text={item}
          index={index}
          x={-500 + index * (1000 / Math.max(beat.items.length - 1, 1))}
          y={index % 2 ? 150 : -150}
          width={Math.min(390, 1160 / Math.max(beat.items.length, 1))}
          height={100}
        />
      ))}
      <Line
        ref={makeRef(paths, 0)}
        points={[[560, -190], [560, 190]]}
        stroke={beat.id === 'nx-03' ? C.red : C.yellow}
        lineWidth={5}
        endArrow
        arrowSize={18}
      />
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-boundary-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={330}
          width={310}
        />
      ))}
    </>
  );
}

function MemorySpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths, featureNodes} = runtime;
  const cells = Math.max(8, Math.min(12, beat.items.length * 3));
  return (
    <>
      <Rect
        ref={makeRef(featureNodes, 0)}
        y={125}
        width={1600}
        height={150}
        radius={10}
        fill={C.panel}
        stroke={C.mint}
        lineWidth={2}
      >
        {Array.from({length: cells}, (_, index) => (
          <Rect
            key={`${beat.id}-cell-${index}`}
            x={-700 + index * (1400 / Math.max(cells - 1, 1))}
            width={100}
            height={98}
            radius={5}
            fill={index < beat.items.length ? C.raised : C.bg}
            stroke={index < beat.items.length ? C.mint2 : C.rule}
            lineWidth={2}
          >
            <Txt
              text={index < beat.items.length ? beat.items[index].slice(0, 8) : '__'}
              width={84}
              textWrap
              fill={index < beat.items.length ? accentFor(beat, index) : C.muted}
              fontFamily={MONO}
              fontSize={17}
              fontWeight={700}
              textAlign={'center'}
            />
          </Rect>
        ))}
      </Rect>
      {beat.items.map((item, index) => (
        <ItemChip
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-memory-${index}`}
          beat={beat}
          text={item}
          index={index}
          x={-520 + index * (1040 / Math.max(beat.items.length - 1, 1))}
          y={-110 - (index % 2) * 92}
          width={Math.min(390, 1220 / Math.max(beat.items.length, 1))}
          height={84}
        />
      ))}
      <TrackedArrow
        ref={makeRef(paths, 0)}
        from={() => itemNodes[0]}
        to={() => featureNodes[0]}
        color={C.yellow}
      />
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-memory-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={315}
          width={300}
        />
      ))}
    </>
  );
}

function RegisterSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths, featureNodes} = runtime;
  const positions = [
    [-410, -135],
    [410, -135],
    [-410, 135],
    [410, 135],
    [0, 0],
  ];
  return (
    <>
      <Rect
        ref={makeRef(featureNodes, 0)}
        width={280}
        height={126}
        radius={63}
        fill={C.yellow}
        stroke={C.yellow}
        lineWidth={2}
      >
        <Txt
          text={beat.id === 'target-01' ? 'execve' : 'CPU STATE'}
          fill={C.bg}
          fontFamily={MONO}
          fontSize={28}
          fontWeight={850}
        />
      </Rect>
      {beat.items.map((item, index) => (
        <ItemChip
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-register-${index}`}
          beat={beat}
          text={item}
          index={index}
          x={positions[index % positions.length][0]}
          y={positions[index % positions.length][1]}
          width={390}
          height={104}
        />
      ))}
      {beat.items.slice(0, 4).map((_, index) => (
        <TrackedArrow
          ref={makeRef(paths, index)}
          key={`${beat.id}-register-line-${index}`}
          from={() => itemNodes[index]}
          to={() => featureNodes[0]}
          color={C.mint2}
        />
      ))}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-register-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={330}
          width={300}
        />
      ))}
    </>
  );
}

function OrbitSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths, featureNodes} = runtime;
  const radiusX = 560;
  const radiusY = 230;
  return (
    <>
      <Rect
        ref={makeRef(featureNodes, 0)}
        width={250}
        height={250}
        radius={125}
        fill={C.raised}
        stroke={C.yellow}
        lineWidth={3}
      >
        <Txt
          text={beat.id.includes('ret') || beat.id.includes('challenge') || beat.id.includes('syscall') ? 'ret' : 'STATE'}
          fill={C.yellow}
          fontFamily={MONO}
          fontSize={52}
          fontWeight={850}
        />
      </Rect>
      {beat.items.map((item, index) => {
        const angle = -Math.PI / 2 + index * ((Math.PI * 2) / beat.items.length);
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        return (
          <ItemChip
            ref={makeRef(itemNodes, index)}
            key={`${beat.id}-orbit-${index}`}
            beat={beat}
            text={item}
            index={index}
            x={x}
            y={y}
            width={360}
            height={88}
          />
        );
      })}
      {beat.items.map((_, index) => {
        return (
          <TrackedArrow
            ref={makeRef(paths, index)}
            key={`${beat.id}-orbit-line-${index}`}
            from={() => itemNodes[index]}
            to={() => featureNodes[0]}
            color={C.mint2}
          />
        );
      })}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-orbit-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={335}
          width={300}
        />
      ))}
    </>
  );
}

function StairSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, stateNodes, paths} = runtime;
  const points = beat.items.map((_, index) => [
    -610 + index * (1220 / Math.max(beat.items.length - 1, 1)),
    220 - index * (400 / Math.max(beat.items.length - 1, 1)),
  ] as [number, number]);
  return (
    <>
      {points.slice(0, -1).map((point, index) => (
        <TrackedArrow
          ref={makeRef(paths, index)}
          key={`${beat.id}-stair-line-${index}`}
          from={() => itemNodes[index]}
          to={() => itemNodes[index + 1]}
          color={C.mint2}
        />
      ))}
      {beat.items.map((item, index) => (
        <ItemChip
          ref={makeRef(itemNodes, index)}
          key={`${beat.id}-stair-${index}`}
          beat={beat}
          text={item}
          index={index}
          x={points[index][0]}
          y={points[index][1]}
          width={Math.min(360, 1300 / Math.max(beat.items.length, 1))}
          height={100}
        />
      ))}
      {beat.state.map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`${beat.id}-stair-state-${index}`}
          text={text}
          index={index}
          x={-360 + index * (720 / Math.max(beat.state.length - 1, 1))}
          y={330}
          width={300}
        />
      ))}
    </>
  );
}

const ANALYSIS_STEPS = [
  {label: 'challenge files', detail: 'gets · gets.c', glyph: GLYPH.folder},
  {label: 'identify binary', detail: 'file · checksec', glyph: GLYPH.terminal},
  {label: 'trigger crash', detail: 'run · cyclic', glyph: GLYPH.bug},
  {label: 'read program', detail: 'source · decompile', glyph: GLYPH.code},
  {label: 'find primitives', detail: 'ROPgadget', glyph: GLYPH.search},
  {label: 'build plan', detail: 'state → chain', glyph: GLYPH.route},
];

function WorkflowSpace({runtime}: {runtime: Runtime}) {
  const {itemNodes, stateNodes, paths} = runtime;
  const positions = ANALYSIS_STEPS.map((_, index) => [
    -720 + index * 288,
    index % 2 ? 62 : -18,
  ] as [number, number]);
  return (
    <>
      {ANALYSIS_STEPS.slice(0, -1).map((_, index) => (
        <TrackedArrow
          key={`workflow-line-${index}`}
          ref={makeRef(paths, index)}
          from={() => itemNodes[index]}
          to={() => itemNodes[index + 1]}
          color={index === ANALYSIS_STEPS.length - 2 ? C.yellow : C.mint2}
        />
      ))}
      {ANALYSIS_STEPS.map((step, index) => (
        <Rect
          ref={makeRef(itemNodes, index)}
          key={`workflow-${step.label}`}
          x={positions[index][0]}
          y={positions[index][1]}
          width={116}
          height={116}
          radius={58}
          fill={index === 0 ? C.mint : C.panel}
          stroke={index === 4 ? C.yellow : C.mint}
          lineWidth={3}
        >
          <Txt
            text={step.glyph}
            fill={index === 0 ? C.bg : index === 4 ? C.yellow : C.mint}
            fontFamily={FA}
            fontWeight={900}
            fontSize={43}
          />
          <Txt
            text={step.label}
            y={92}
            width={235}
            textAlign={'center'}
            fill={C.text}
            fontFamily={MONO}
            fontSize={22}
            fontWeight={780}
          />
          <Txt
            text={step.detail}
            y={125}
            width={250}
            textAlign={'center'}
            fill={C.muted}
            fontFamily={MONO}
            fontSize={18}
            fontWeight={620}
          />
        </Rect>
      ))}
      {['i386 · static', 'NX ON', 'NO PIE', '28-byte offset'].map((text, index) => (
        <StateChip
          ref={makeRef(stateNodes, index)}
          key={`workflow-state-${index}`}
          text={text}
          index={index}
          x={-540 + index * 360}
          y={320}
          width={290}
        />
      ))}
    </>
  );
}

const FULL_SOURCE = [
  '#include <stdio.h>',
  '#include <stdlib.h>',
  '#include <string.h>',
  '#include <unistd.h>',
  '#include <sys/types.h>',
  '',
  '#define BUFSIZE 16',
  '',
  'void vuln() {',
  '  char buf[16];',
  '  printf("GIVE ME YOUR NAME!\\n");',
  '  return gets(buf);',
  '}',
  '',
  'int main(int argc, char **argv) {',
  '  setvbuf(stdout, NULL, _IONBF, 0);',
  '  gid_t gid = getegid();',
  '  setresgid(gid, gid, gid);',
  '  vuln();',
  '}',
];

function SourceSpace({runtime}: {runtime: Runtime}) {
  const {itemNodes, featureNodes} = runtime;
  const top = -248;
  const gap = 27;
  return (
    <>
      <Rect
        ref={makeRef(featureNodes, 0)}
        y={12}
        width={1710}
        height={700}
        radius={10}
        fill={C.panel}
        stroke={C.rule}
        lineWidth={2}
        clip
      >
        <Rect y={-322} width={1706} height={56} fill={C.raised}>
          <Txt
            text={GLYPH.code}
            x={-795}
            fill={C.mint}
            fontFamily={FA}
            fontWeight={900}
            fontSize={21}
          />
          <Txt
            text={'gets.c  —  complete challenge source'}
            x={-758}
            offsetX={-1}
            fill={C.text}
            fontFamily={MONO}
            fontSize={21}
            fontWeight={700}
          />
          <Txt
            text={'SOURCE'}
            x={790}
            offsetX={1}
            fill={C.muted}
            fontFamily={MONO}
            fontSize={18}
            fontWeight={760}
          />
        </Rect>
        <Rect x={-755} y={12} width={194} height={642} fill={C.bg}>
          <Txt
            text={`${GLYPH.folder}  challenge`}
            x={-70}
            y={-265}
            offsetX={-1}
            fill={C.muted}
            fontFamily={MONO}
            fontSize={18}
          />
          <Txt
            text={`${GLYPH.file}  gets`}
            x={-52}
            y={-220}
            offsetX={-1}
            fill={C.muted}
            fontFamily={MONO}
            fontSize={18}
          />
          <Txt
            text={`${GLYPH.code}  gets.c`}
            x={-52}
            y={-176}
            offsetX={-1}
            fill={C.mint}
            fontFamily={MONO}
            fontSize={18}
            fontWeight={760}
          />
        </Rect>
        <Rect
          ref={makeRef(itemNodes, 0)}
          x={-164}
          y={top + 10 * gap}
          width={1020}
          height={5 * gap + 8}
          radius={4}
          fill={`${C.red}12`}
          stroke={C.red}
          lineWidth={2}
        />
        {FULL_SOURCE.map((line, index) => (
          <Node key={`source-line-${index}`}>
            <Txt
              text={String(index + 1).padStart(2, '0')}
              x={-638}
              y={top + index * gap}
              width={48}
              offsetX={1}
              fill={C.muted}
              fontFamily={MONO}
              fontSize={18}
            />
            <Txt
              text={line || ' '}
              x={-572}
              y={top + index * gap}
              width={930}
              offsetX={-1}
              fill={index >= 8 && index <= 12 ? C.text : C.muted}
              fontFamily={MONO}
              fontSize={21}
              fontWeight={index === 11 ? 780 : 580}
            />
          </Node>
        ))}
        {[
          {glyph: GLYPH.memory, label: '16-byte local buffer', color: C.mint, y: -126},
          {glyph: GLYPH.bug, label: 'unbounded gets()', color: C.red, y: 18},
          {glyph: GLYPH.return, label: 'return state exposed', color: C.yellow, y: 162},
        ].map((entry, index) => (
          <Rect
            ref={makeRef(itemNodes, index + 1)}
            key={entry.label}
            x={610}
            y={entry.y}
            width={330}
            height={104}
            radius={52}
            fill={C.bg}
            stroke={entry.color}
            lineWidth={2}
          >
            <Txt
              text={entry.glyph}
              x={-118}
              fill={entry.color}
              fontFamily={FA}
              fontWeight={900}
              fontSize={34}
            />
            <Txt
              text={entry.label}
              x={26}
              width={230}
              textWrap
              fill={entry.color}
              fontFamily={MONO}
              fontSize={20}
              fontWeight={720}
              textAlign={'center'}
            />
          </Rect>
        ))}
      </Rect>
    </>
  );
}

const ROP_GADGET_LINES = [
  '0x080481b2 : ret',
  '0x08049303 : xor eax, eax ; ret',
  '0x080549db : mov dword ptr [edx], eax ; ret',
  '0x0805d097 : inc edx ; ret',
  '0x0806cc25 : int 0x80',
  '0x0806f02a : pop edx ; ret',
  '0x0806f051 : pop ecx ; pop ebx ; ret',
  '0x0808f097 : add eax, 2 ; ret',
  '0x0808f0b0 : add eax, 3 ; ret',
  '0x080b81c6 : pop eax ; ret',
];

function DecompilerSpace({runtime}: {runtime: Runtime}) {
  const {beat, itemNodes, featureNodes} = runtime;
  const gadgetMode = beat.id === 'intro-06';
  const selectedRows = gadgetMode ? [2, 4, 5, 6, 9] : [3, 7, 8, 9, 10];
  const lines = gadgetMode ? ROP_GADGET_LINES : [
    'void vuln(void) {',
    '    char local_1c [16];',
    '    printf("GIVE ME YOUR NAME!\\n");',
    '    gets(local_1c);',
    '    return;',
    '}',
    '',
    '080b81c6    pop eax',
    '080b81c7    ret',
    '080549db    mov dword ptr [edx],eax',
    '080549dd    ret',
  ];
  return (
    <>
      <Rect
        ref={makeRef(featureNodes, 0)}
        y={18}
        width={1710}
        height={680}
        radius={10}
        fill={C.panel}
        stroke={C.rule}
        lineWidth={2}
        clip
      >
        <Rect y={-312} width={1706} height={56} fill={C.raised}>
          <Txt
            text={gadgetMode ? GLYPH.terminal : GLYPH.search}
            x={-794}
            fill={gadgetMode ? C.yellow : C.mint}
            fontFamily={FA}
            fontWeight={900}
            fontSize={22}
          />
          <Txt
            text={gadgetMode
              ? '$ ROPgadget --binary gets --only "pop|mov|int|ret"'
              : 'Decompiler  /  gets  /  vuln'}
            x={-756}
            offsetX={-1}
            fill={C.text}
            fontFamily={MONO}
            fontSize={20}
            fontWeight={700}
          />
        </Rect>
        {!gadgetMode ? (
          <>
            <Rect x={-708} y={18} width={280} height={620} fill={C.bg}>
              {['Functions', '  main', '  vuln', 'Imports', '  gets', '  printf'].map((text, index) => (
                <Txt
                  key={`symbol-${index}`}
                  text={`${index === 2 ? GLYPH.bug : index > 3 ? GLYPH.route : GLYPH.code}  ${text}`}
                  x={-118}
                  y={-245 + index * 70}
                  width={240}
                  offsetX={-1}
                  fill={index === 2 ? C.red : C.muted}
                  fontFamily={MONO}
                  fontSize={19}
                  fontWeight={index === 2 ? 780 : 560}
                />
              ))}
            </Rect>
            <Line points={[[-555, -285], [-555, 325]]} stroke={C.rule} lineWidth={2} />
            <Line points={[[210, -285], [210, 325]]} stroke={C.rule} lineWidth={2} />
            <Txt
              text={'DECOMPILE'}
              x={-500}
              y={-265}
              offsetX={-1}
              fill={C.muted}
              fontFamily={MONO}
              fontSize={16}
              fontWeight={760}
            />
            <Txt
              text={'LISTING'}
              x={258}
              y={-265}
              offsetX={-1}
              fill={C.muted}
              fontFamily={MONO}
              fontSize={16}
              fontWeight={760}
            />
          </>
        ) : null}
        {lines.map((line, index) => {
          const selected = selectedRows.includes(index);
          const x = gadgetMode ? -730 : index < 7 ? -500 : 255;
          const y = gadgetMode ? -240 + index * 52 : index < 7 ? -205 + index * 62 : -205 + (index - 7) * 62;
          const width = gadgetMode ? 1460 : index < 7 ? 650 : 590;
          return (
            <Rect
              ref={selected ? makeRef(itemNodes, selectedRows.indexOf(index)) : undefined}
              key={`tool-line-${index}`}
              x={x + width / 2}
              y={y}
              width={width}
              height={44}
              radius={3}
              fill={selected ? `${gadgetMode ? C.orange : C.mint}16` : `${C.bg}00`}
              stroke={selected ? (gadgetMode ? C.orange : C.mint) : `${C.rule}00`}
              lineWidth={selected ? 2 : 0}
            >
              <Txt
                text={line}
                x={-width / 2 + 18}
                width={width - 36}
                offsetX={-1}
                fill={selected ? (gadgetMode ? C.orange : C.text) : C.muted}
                fontFamily={MONO}
                fontSize={gadgetMode ? 21 : 20}
                fontWeight={selected ? 740 : 540}
              />
            </Rect>
          );
        })}
        <Rect
          x={gadgetMode ? 630 : 670}
          y={282}
          width={gadgetMode ? 260 : 190}
          height={60}
          radius={30}
          fill={gadgetMode ? C.orange : C.mint}
        >
          <Txt
            text={gadgetMode ? `${GLYPH.gadget}  usable gadgets` : `${GLYPH.search}  gets → overflow`}
            fill={C.bg}
            fontFamily={MONO}
            fontSize={17}
            fontWeight={820}
          />
        </Rect>
      </Rect>
    </>
  );
}

function Space({runtime}: {runtime: Runtime}) {
  const components: Record<ShotSpace, any> = {
    microscope: MicroscopeSpace,
    conveyor: ConveyorSpace,
    route: RouteSpace,
    'code-map': CodeMapSpace,
    terminal: TerminalSpace,
    shards: ShardsSpace,
    typography: TypographySpace,
    stack: StackSpace,
    split: SplitSpace,
    boundary: BoundarySpace,
    memory: MemorySpace,
    register: RegisterSpace,
    orbit: OrbitSpace,
    stair: StairSpace,
    workflow: WorkflowSpace,
    source: SourceSpace,
    decompiler: DecompilerSpace,
  };
  const Component = components[runtime.direction.space];
  return <Component runtime={runtime} />;
}

function makeRuntime(beat: Beat): Runtime {
  return {
    beat,
    direction: SHOT_DIRECTIONS[beat.id],
    stage: createRef<Node>(),
    visual: createRef<Node>(),
    title: createRef<Txt>(),
    itemNodes: [],
    stateNodes: [],
    paths: [],
    featureNodes: [],
  };
}

function Shot({runtime}: {runtime: Runtime}) {
  const {beat, stage, visual, title} = runtime;
  const pose = titlePose(beat);
  return (
    <Node ref={stage}>
      {firstBeatOfChapter(beat) ? <ChapterStamp chapter={beat.chapter} /> : null}
      <Node ref={visual} y={20}>
        <Space runtime={runtime} />
      </Node>
      <Txt
        ref={title}
        text={beat.title}
        x={pose.x}
        y={pose.y}
        width={pose.width}
        offsetX={pose.align === 'left' ? -1 : pose.align === 'right' ? 1 : 0}
        textAlign={pose.align}
        fill={C.text}
        fontFamily={'Inter, Noto Sans, Helvetica Neue, Arial, sans-serif'}
        fontSize={beat.title.length > 34 ? Math.min(pose.size, 50) : pose.size}
        lineHeight={1.08}
        fontWeight={850}
        letterSpacing={-1.5}
      />
    </Node>
  );
}

function semanticMotion(runtime: Runtime, duration: number) {
  const {beat, direction, itemNodes, stateNodes, featureNodes} = runtime;
  const nodes = [...itemNodes, ...stateNodes];
  if (nodes.length === 0) return runtime.visual().rotation(0.001, duration);

  if (direction.space === 'conveyor') {
    const vertical = beat.id === 'intro-02' || beat.id.includes('register-05') || beat.id.includes('register-06');
    return all(
      ...itemNodes.map((node, index) => vertical
        ? node.position.y(node.position.y() + 42 + index * 7, duration, easeInOutCubic)
        : node.position.x(node.position.x() + 65 + index * 10, duration, easeInOutCubic)),
      ...stateNodes.map(node => node.scale(1.05, duration / 2, easeOutBack).to(1, duration / 2)),
    );
  }

  if (direction.space === 'memory') {
    return all(
      ...itemNodes.map((node, index) =>
        node.position.y(55 + (index % 2) * 18, duration, easeInOutCubic)),
      ...(featureNodes.length
        ? [featureNodes[0].stroke(C.yellow, duration / 2).to(C.mint, duration / 2)]
        : []),
    );
  }

  if (direction.space === 'split') {
    const midpoint = Math.ceil(itemNodes.length / 2);
    return all(
      ...itemNodes.map((node, index) =>
        node.position.x(node.position.x() + (index < midpoint ? -55 : 55), duration, easeInOutCubic)),
      ...stateNodes.map(node => node.position.y(node.position.y() - 24, duration, easeInOutCubic)),
    );
  }

  if (direction.space === 'boundary') {
    return all(
      ...itemNodes.map((node, index) =>
        node.position.y((index % 2 ? -1 : 1) * Math.abs(node.position.y()), duration, easeInOutCubic)),
      ...(featureNodes.length
        ? [featureNodes[0].scale.x(0.72, duration / 2).to(1, duration / 2)]
        : []),
    );
  }

  if (direction.space === 'orbit') {
    return all(
      runtime.visual().rotation(beat.id === 'syscall-05' ? 16 : 4, duration, easeInOutCubic),
      ...itemNodes.map(node => node.rotation(-runtime.visual().rotation(), duration)),
      ...(featureNodes.length
        ? [featureNodes[0].scale(1.14, duration / 2, easeOutBack).to(1, duration / 2)]
        : []),
    );
  }

  if (direction.space === 'register') {
    return all(
      ...itemNodes.map(node => node.position([node.position.x() * 0.86, node.position.y() * 0.86], duration, easeInOutCubic)),
      ...(featureNodes.length
        ? [featureNodes[0].fill(C.mint, duration / 2).to(C.yellow, duration / 2)]
        : []),
    );
  }

  if (direction.space === 'stack') {
    return all(
      itemNodes[0].position.x(itemNodes[0].position.x() + 210, duration, easeInOutCubic),
      ...itemNodes.slice(1).map(node => node.position.y(node.position.y() - 46, duration, easeInOutCubic)),
      ...stateNodes.map((node, index) => node.scale(index === 0 ? 1.08 : 1.02, duration / 2).to(1, duration / 2)),
    );
  }

  if (direction.space === 'terminal') {
    return all(
      ...itemNodes.map((node, index) => node.position.x(node.position.x() + (index % 2 ? -36 : 36), duration)),
      ...(featureNodes.length ? [featureNodes[0].position.x(520, duration, easeInOutCubic)] : []),
    );
  }

  if (direction.space === 'shards') return sweep(itemNodes, 72, duration);
  if (direction.space === 'stair') {
    return all(...itemNodes.map((node, index) =>
      node.position.y(node.position.y() - index * 18, duration, easeInOutCubic)));
  }
  return focusPulse(nodes.slice(0, Math.min(nodes.length, 4)), C.yellow, duration);
}

function specialMotion(runtime: Runtime, duration: number) {
  const {beat, itemNodes, stateNodes, featureNodes} = runtime;
  if (beat.id === 'intro-02') {
    return all(
      runtime.visual().rotation(3.5, duration / 2).to(0, duration / 2),
      ...itemNodes.map((node, index) =>
        node.position([-210, -190 + index * 130], duration, easeInOutCubic)),
    );
  }
  if (beat.id === 'challenge-03') {
    return all(...itemNodes.map((node, index) =>
      node.position.y(node.position.y() + index * 42, duration, easeInOutCubic)));
  }
  if (beat.id === 'nx-03') {
    return all(
      ...itemNodes.map((node, index) =>
        node.position.y(index % 2 ? -150 : 150, duration, easeInOutCubic)),
      ...(featureNodes.length ? [featureNodes[0].fill(C.red, duration)] : []),
    );
  }
  if (beat.id === 'register-06') {
    return all(
      ...itemNodes.map(node =>
        node.position.x(node.position.x() - 120, duration / 2).to(node.position.x(), duration / 2)),
      ...stateNodes.map(node =>
        node.stroke(C.red, duration / 2).to(C.mint, duration / 2)),
    );
  }
  if (beat.id === 'deep-01') {
    return all(...itemNodes.map((node, index) =>
      node.opacity(index < Math.ceil(itemNodes.length / 2) ? 0.24 : 1, duration)));
  }
  if (beat.id === 'outro-05') {
    return all(
      runtime.visual().scale.y(0.12, duration, easeInOutCubic),
      runtime.visual().scale.x(0.82, duration, easeInOutCubic),
    );
  }
  return semanticMotion(runtime, duration);
}

function animateBeat(runtime: Runtime, duration: number) {
  const {stage, visual, title, itemNodes, stateNodes, paths, direction} = runtime;
  const allNodes = [...itemNodes, ...stateNodes];
  const transition = Math.min(0.55, duration * 0.1);
  const active = duration - transition;
  const entrance = Math.min(0.72, active * 0.13);
  const revealDelay = Math.min(0.4, active * 0.06);
  const pathDelay = active * 0.25;
  const semanticDelay = active * 0.43;
  const specialDelay = active * 0.67;
  const revealStagger = Math.min(0.085, active * 0.015);
  const revealDuration = Math.min(0.52, active * 0.11);
  const pathDuration = Math.min(0.8, active * 0.14);
  const semanticDuration = Math.max(0.7, active * 0.18);
  const specialDuration = Math.max(0.65, active * 0.17);

  prepareEntrance(stage(), direction.camera);
  title().opacity(0);
  title().position.y(title().position.y() + 28);

  const revealMotion = direction.space === 'shards' || direction.space === 'orbit'
    ? fanIn(itemNodes, Math.min(0.85, active * 0.16))
    : cascadeIn(allNodes, revealStagger, revealDuration);
  const pathMotion = drawPaths(paths, Math.min(0.1, active * 0.012), pathDuration);

  return all(
    stage().rotation(stage().rotation() + 0.001, duration),
    enterStage(stage(), entrance),
    delay(
      revealDelay,
      all(
        title().opacity(1, 0.48, easeOutCubic),
        title().position.y(title().position.y() - 28, 0.55, easeOutCubic),
        revealMotion,
      ),
    ),
    delay(pathDelay, pathMotion),
    delay(semanticDelay, semanticMotion(runtime, semanticDuration)),
    delay(specialDelay, specialMotion(runtime, specialDuration)),
    delay(
      entrance * 0.9,
      cameraTravel(visual(), direction.camera, Math.max(0.8, active - entrance * 1.1)),
    ),
    delay(
      Math.max(0, active - 1.4),
      all(
        title().opacity(0.55, 0.45),
        title().scale(0.985, 0.45),
      ),
    ),
    delay(active, exitStage(stage(), oppositeMove(direction.camera), transition)),
  );
}

export function createDynamicChapterScene(chapter: string) {
  const beats = BEATS.filter(beat => beat.chapter === chapter);
  return makeScene2D(function* (view) {
    view.add(<FlatWorld />);

    for (const beat of beats) {
      const runtime = makeRuntime(beat);
      if (!runtime.direction) throw new Error(`Missing shot direction for ${beat.id}`);
      view.add(<Shot runtime={runtime} />);
      const duration = beat.frames ? beat.frames / 24 : beat.end - beat.start;
      yield* animateBeat(runtime, duration);
      runtime.stage().remove();
    }
  });
}
