import {Circle, Gradient, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {Reference, ReferenceReceiver, Vector2} from '@motion-canvas/core';
import {C, FONT, MONO} from './theme';

export function Backdrop({chapter, title}: {chapter: string; title: string}) {
  return (
    <>
      <Rect
        width={1920}
        height={1080}
        fill={new Gradient({
          type: 'linear',
          from: [-960, -540],
          to: [960, 540],
          stops: [
            {offset: 0, color: '#080A09'},
            {offset: 0.58, color: C.bg},
            {offset: 1, color: '#0D1510'},
          ],
        })}
      />
      {[-880, -560, -240, 80, 400, 720, 880].map(x => (
        <Line points={[[x, -540], [x, 540]]} stroke={C.grid} lineWidth={1} />
      ))}
      <Line points={[[-880, -500], [880, -500]]} stroke={C.faint} lineWidth={1} />
      <Rect x={-868} y={-458} width={8} height={28} fill={C.green} />
      <Txt
        text={chapter.toUpperCase()}
        x={-840}
        y={-458}
        offsetX={-1}
        fill={C.green}
        fontFamily={MONO}
        fontWeight={600}
        fontSize={17}
        letterSpacing={2.6}
      />
      <Txt
        text={title}
        x={-840}
        y={-397}
        offsetX={-1}
        fill={C.text}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={47}
        letterSpacing={-1.35}
      />
      <Txt
        text={'picoCTF  /  BUFFER OVERFLOW 1'}
        x={880}
        y={-458}
        offsetX={1}
        fill={C.muted}
        fontFamily={MONO}
        fontSize={15}
        letterSpacing={0.8}
      />
      <Line points={[[-840, -350], [880, -350]]} stroke={C.rule} lineWidth={1} />
    </>
  );
}

export function Panel({
  x = 0,
  y = 0,
  width = 600,
  height = 320,
  children,
  ref,
  stroke = C.faint,
  fill = C.panel,
  radius = 8,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  children?: any;
  ref?: ReferenceReceiver<Rect>;
  stroke?: string;
  fill?: string;
  radius?: number;
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
      lineWidth={1}
      shadowBlur={16}
      shadowColor={'#00000055'}
    >
      <Rect
        y={-height / 2 + 1}
        width={Math.max(0, width - 2)}
        height={1}
        fill={C.fog}
        opacity={0.16}
      />
      {children}
    </Rect>
  );
}

export function Label({
  text,
  x = 0,
  y = 0,
  color = C.text,
  size = 28,
  mono = false,
  weight = 600,
}: {
  text: string;
  x?: number;
  y?: number;
  color?: string;
  size?: number;
  mono?: boolean;
  weight?: number;
}) {
  return (
    <Txt
      text={text}
      x={x}
      y={y}
      fill={color}
      fontFamily={mono ? MONO : FONT}
      fontSize={size}
      fontWeight={weight}
    />
  );
}

export function Arrow({
  from,
  to,
  color = C.blue,
  width = 4,
  endArrow = true,
  opacity = 1,
  ref,
}: {
  from: [number, number];
  to: [number, number];
  color?: string;
  width?: number;
  endArrow?: boolean;
  opacity?: number;
  ref?: Reference<Line>;
}) {
  return (
    <Line
      ref={ref}
      points={[new Vector2(...from), new Vector2(...to)]}
      stroke={color}
      lineWidth={width}
      endArrow={endArrow}
      arrowSize={13}
      radius={2}
      opacity={opacity}
    />
  );
}

export function Byte({
  value,
  x = 0,
  y = 0,
  fill = C.panel2,
  stroke = C.faint,
  color = C.text,
  size = 66,
  ref,
}: {
  value: string;
  x?: number;
  y?: number;
  fill?: string;
  stroke?: string;
  color?: string;
  size?: number;
  ref?: ReferenceReceiver<Rect>;
}) {
  return (
    <Rect
      ref={ref}
      x={x}
      y={y}
      width={size}
      height={size}
      radius={5}
      fill={fill}
      stroke={stroke}
      lineWidth={1}
    >
      <Txt
        text={value}
        fill={color}
        fontFamily={MONO}
        fontWeight={700}
        fontSize={size * 0.34}
      />
    </Rect>
  );
}

export function CodeLine({
  text,
  x = 0,
  y = 0,
  color = C.text,
  size = 27,
  opacity = 1,
}: {
  text: string;
  x?: number;
  y?: number;
  color?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <Txt
      text={text}
      x={x}
      y={y}
      offsetX={-1}
      fill={color}
      opacity={opacity}
      fontFamily={MONO}
      fontSize={size}
    />
  );
}

export function GlowDot({x, y, color = C.blue}: {x: number; y: number; color?: string}) {
  return (
    <Node x={x} y={y}>
      <Circle size={18} fill={C.bg} stroke={color} lineWidth={3} />
      <Circle size={6} fill={color} />
    </Node>
  );
}

export function BigIdea({
  text,
  subtext,
  color = C.text,
  ref,
}: {
  text: string;
  subtext?: string;
  color?: string;
  ref?: Reference<Rect>;
}) {
  return (
    <Rect
      ref={ref}
      y={455}
      width={1760}
      height={116}
      radius={4}
      fill={new Gradient({
        type: 'linear',
        from: [-880, 0],
        to: [880, 0],
        stops: [
          {offset: 0, color: '#FFFFFF12'},
          {offset: 0.72, color: '#FFFFFF08'},
          {offset: 1, color: '#FFFFFF04'},
        ],
      })}
      stroke={C.faint}
      lineWidth={1}
      opacity={0}
    >
      <Rect x={-876} width={8} height={116} fill={color} />
      <Txt
        text={text}
        x={-820}
        y={subtext ? -17 : 0}
        offsetX={-1}
        fill={color}
        fontFamily={FONT}
        fontSize={30}
        fontWeight={700}
        letterSpacing={-0.45}
      />
      {subtext ? (
        <Txt
          text={subtext}
          x={-820}
          y={25}
          offsetX={-1}
          fill={C.muted}
          fontFamily={FONT}
          fontSize={18}
        />
      ) : null}
    </Rect>
  );
}
