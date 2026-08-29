import {Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  sequence,
} from '@motion-canvas/core';
import {CameraMove} from './shotScript';
import {C, MONO, SANS} from './theme';

export type AnyNode = Node | Rect | Txt | Line;

export function FlatWorld() {
  return (
    <>
      <Rect width={1920} height={1080} fill={C.bg} />
      {Array.from({length: 17}, (_, index) => (
        <Line
          key={`world-v-${index}`}
          x={index % 2 ? 10 : -10}
          points={[[-896 + index * 112, -540], [-896 + index * 112, 540]]}
          stroke={C.grid}
          lineWidth={1}
        />
      ))}
      {Array.from({length: 11}, (_, index) => (
        <Line
          key={`world-h-${index}`}
          y={index % 2 ? -8 : 8}
          points={[[-960, -480 + index * 96], [960, -480 + index * 96]]}
          stroke={C.grid}
          lineWidth={1}
        />
      ))}
    </>
  );
}

export function ChapterStamp({
  chapter,
  x = -850,
  y = -492,
}: {
  chapter: string;
  x?: number;
  y?: number;
}) {
  return (
    <Rect
      x={x}
      y={y}
      offsetX={-1}
      padding={[11, 17]}
      radius={7}
      fill={C.raised}
      stroke={C.mint}
      lineWidth={2}
    >
      <Txt
        text={chapter}
        fill={C.mint}
        fontFamily={MONO}
        fontSize={19}
        fontWeight={800}
        letterSpacing={1.3}
      />
    </Rect>
  );
}

export function TechnicalTitle({
  text,
  x,
  y,
  width = 1380,
  size = 68,
  align = 'left',
}: {
  text: string;
  x: number;
  y: number;
  width?: number;
  size?: number;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <Txt
      text={text}
      x={x}
      y={y}
      width={width}
      textWrap
      offsetX={align === 'left' ? -1 : align === 'right' ? 1 : 0}
      textAlign={align}
      fill={C.text}
      fontFamily={SANS}
      fontSize={size}
      lineHeight={1}
      fontWeight={850}
      letterSpacing={-1.5}
    />
  );
}

export function Chip({
  text,
  x = 0,
  y = 0,
  width = 300,
  height = 82,
  color = C.mint,
  fill = C.raised,
  size = 23,
}: {
  text: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
  size?: number;
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      radius={9}
      fill={fill}
      stroke={color}
      lineWidth={2}
    >
      <Txt
        text={text}
        width={width - 36}
        textWrap
        textAlign={'center'}
        fill={color}
        fontFamily={MONO}
        fontSize={size}
        fontWeight={720}
      />
    </Rect>
  );
}

export function AddressCell({
  text,
  x,
  y,
  color = C.mint2,
  width = 210,
  height = 74,
}: {
  text: string;
  x: number;
  y: number;
  color?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      radius={7}
      fill={C.panel}
      stroke={color}
      lineWidth={2}
    >
      <Txt
        text={text}
        width={width - 24}
        textWrap
        fill={color}
        fontFamily={MONO}
        fontSize={Math.min(22, height * 0.3)}
        fontWeight={700}
        textAlign={'center'}
      />
    </Rect>
  );
}

export function CameraFrame({
  x,
  y,
  width,
  height,
  color = C.rule,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  children?: any;
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      radius={14}
      fill={C.panel}
      stroke={color}
      lineWidth={2}
      clip
    >
      {children}
    </Rect>
  );
}

export function cameraTravel(stage: Node, move: CameraMove, duration = 1.05) {
  const pose = {
    push: {x: 0, y: 2, scale: 1.085, rotation: 0},
    pull: {x: 0, y: -2, scale: 0.91, rotation: 0},
    'track-left': {x: 115, y: 0, scale: 1.02, rotation: -0.35},
    'track-right': {x: -115, y: 0, scale: 1.02, rotation: 0.35},
    'tilt-left': {x: 48, y: 18, scale: 1.035, rotation: -1.1},
    'tilt-right': {x: -48, y: 18, scale: 1.035, rotation: 1.1},
    drop: {x: 0, y: -82, scale: 1.04, rotation: 0},
    rise: {x: 0, y: 82, scale: 0.97, rotation: 0},
  }[move];
  return all(
    stage.position.x(pose.x, duration, easeInOutCubic),
    stage.position.y(pose.y, duration, easeInOutCubic),
    stage.scale(pose.scale, duration, easeInOutCubic),
    stage.rotation(pose.rotation, duration, easeInOutCubic),
  );
}

export function prepareEntrance(stage: Node, move: CameraMove) {
  const pose = {
    push: {x: 0, y: 36, scale: 0.78, rotation: 0},
    pull: {x: 0, y: -20, scale: 1.22, rotation: 0},
    'track-left': {x: 340, y: 0, scale: 0.96, rotation: -1.1},
    'track-right': {x: -340, y: 0, scale: 0.96, rotation: 1.1},
    'tilt-left': {x: 180, y: 40, scale: 0.9, rotation: -3.5},
    'tilt-right': {x: -180, y: 40, scale: 0.9, rotation: 3.5},
    drop: {x: 0, y: -240, scale: 0.95, rotation: 0},
    rise: {x: 0, y: 240, scale: 0.95, rotation: 0},
  }[move];
  stage.position([pose.x, pose.y]);
  stage.scale(pose.scale);
  stage.rotation(pose.rotation);
  stage.opacity(0);
}

export function enterStage(stage: Node, duration = 0.72) {
  return all(
    stage.opacity(1, duration, easeOutCubic),
    stage.position([0, 0], duration, easeOutCubic),
    stage.scale(1, duration, easeOutBack),
    stage.rotation(0, duration, easeOutCubic),
  );
}

export function exitStage(stage: Node, move: CameraMove, duration = 0.52) {
  const pose = {
    push: {x: 0, y: -20, scale: 1.26, rotation: 0},
    pull: {x: 0, y: 12, scale: 0.74, rotation: 0},
    'track-left': {x: -390, y: 0, scale: 0.96, rotation: -1.6},
    'track-right': {x: 390, y: 0, scale: 0.96, rotation: 1.6},
    'tilt-left': {x: -260, y: -70, scale: 0.84, rotation: -5},
    'tilt-right': {x: 260, y: -70, scale: 0.84, rotation: 5},
    drop: {x: 0, y: 310, scale: 0.92, rotation: 0},
    rise: {x: 0, y: -310, scale: 0.92, rotation: 0},
  }[move];
  return all(
    stage.opacity(0, duration, easeInCubic),
    stage.position([pose.x, pose.y], duration, easeInCubic),
    stage.scale(pose.scale, duration, easeInCubic),
    stage.rotation(pose.rotation, duration, easeInCubic),
  );
}

export function cascadeIn(nodes: AnyNode[], stagger = 0.1, duration = 0.48) {
  nodes.forEach((node, index) => {
    node.opacity(0);
    node.position.y(node.position.y() + 34 + (index % 2) * 12);
    node.scale(0.9);
  });
  return sequence(
    stagger,
    ...nodes.map(node => all(
      node.opacity(1, duration, easeOutCubic),
      node.position.y(node.position.y() - 34, duration, easeOutCubic),
      node.scale(1, duration, easeOutBack),
    )),
  );
}

export function fanIn(nodes: AnyNode[], duration = 0.75) {
  const targets = nodes.map(node => ({
    x: node.position.x(),
    y: node.position.y(),
    rotation: node.rotation(),
  }));
  nodes.forEach((node, index) => {
    node.position([0, 80]);
    node.rotation((index - nodes.length / 2) * 8);
    node.opacity(0);
  });
  return all(...nodes.map((node, index) => all(
    node.opacity(1, duration + index * 0.04, easeOutCubic),
    node.position([targets[index].x, targets[index].y], duration + index * 0.04, easeOutBack),
    node.rotation(targets[index].rotation, duration + index * 0.04, easeOutCubic),
  )));
}

export function drawPaths(lines: Line[], stagger = 0.12, duration = 0.58) {
  lines.forEach(line => line.end(0));
  return sequence(stagger, ...lines.map(line => line.end(1, duration, easeInOutCubic)));
}

export function focusPulse(nodes: AnyNode[], color = C.yellow, duration = 0.58) {
  return sequence(
    0.08,
    ...nodes.map(node => all(
      node.scale(1.06, duration / 2, easeOutCubic).to(1, duration / 2, easeInOutCubic),
      node instanceof Rect
        ? node.stroke(color, duration / 2).to(node.stroke(), duration / 2)
        : node.opacity(1, duration),
    )),
  );
}

export function sweep(nodes: AnyNode[], distance = 120, duration = 0.9) {
  return all(...nodes.map((node, index) =>
    node.position.x(node.position.x() + (index % 2 ? -distance : distance), duration, easeInOutCubic),
  ));
}
