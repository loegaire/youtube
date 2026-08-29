// Shared Motion Canvas primitives for explaining bounded integer arithmetic.
import {Line, Rect, Txt} from '@motion-canvas/2d';
import {ReferenceReceiver} from '@motion-canvas/core';
import {THINH_TOOL_THEME} from './toolSurfaces';

const T = THINH_TOOL_THEME;

type TextValue = string | (() => string);

function valueOf(value: TextValue) {
  return typeof value === 'function' ? value : () => value;
}

export function IntegerReadout({
  bits,
  signed,
  unsigned,
  x = 0,
  y = 0,
  width = 900,
  ref,
}: {
  bits: TextValue;
  signed: TextValue;
  unsigned: TextValue;
  x?: number;
  y?: number;
  width?: number;
  ref?: ReferenceReceiver<Rect>;
}) {
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={380} radius={12} fill={T.surface} stroke={T.amber} lineWidth={2}>
      <Txt
        text={'INTEGER WHEEL  /  int: 32 bits'}
        x={-width / 2 + 32}
        y={-150}
        offsetX={-1}
        fill={T.amber}
        fontFamily={T.mono}
        fontSize={20}
        fontWeight={800}
      />
      <Rect y={-45} width={width - 110} height={100} radius={50} fill={T.raised} stroke={T.rule} lineWidth={2}>
        <Txt text={valueOf(bits)} fill={T.text} fontFamily={T.mono} fontSize={34} fontWeight={800} />
      </Rect>
      <Line points={[[-width / 2 + 70, 76], [width / 2 - 70, 76]]} stroke={T.rule} lineWidth={2} />
      <Txt text={'SIGNED'} x={-width / 2 + 70} y={124} offsetX={-1} fill={T.muted} fontFamily={T.mono} fontSize={16} fontWeight={800} />
      <Txt text={valueOf(signed)} x={-width / 2 + 270} y={124} offsetX={-1} fill={T.coral} fontFamily={T.mono} fontSize={24} fontWeight={800} />
      <Txt text={'UNSIGNED'} x={-width / 2 + 70} y={178} offsetX={-1} fill={T.muted} fontFamily={T.mono} fontSize={16} fontWeight={800} />
      <Txt text={valueOf(unsigned)} x={-width / 2 + 270} y={178} offsetX={-1} fill={T.mint} fontFamily={T.mono} fontSize={24} fontWeight={800} />
    </Rect>
  );
}

export function IntegerBitCell({
  bit,
  x,
  y,
  sign = false,
  active = false,
  size = 42,
}: {
  bit: TextValue;
  x: number;
  y: number;
  sign?: boolean;
  active?: boolean;
  size?: number;
}) {
  const accent = sign ? T.coral : active ? T.mint : T.muted;
  return (
    <Rect x={x} y={y} width={size} height={size} radius={4} fill={active ? T.selected : T.raised} stroke={accent} lineWidth={2}>
      <Txt text={valueOf(bit)} fill={accent} fontFamily={T.mono} fontSize={size * 0.46} fontWeight={800} />
    </Rect>
  );
}

export function BoundedMemoryBlock({
  label,
  x,
  y,
  width,
  accent = T.mint,
}: {
  label: TextValue;
  x: number;
  y: number;
  width: number;
  accent?: string;
}) {
  return (
    <Rect x={x} y={y} width={width} height={104} radius={6} fill={T.raised} stroke={accent} lineWidth={3}>
      <Txt text={valueOf(label)} width={width - 28} fill={accent} fontFamily={T.mono} fontSize={21} fontWeight={800} textAlign={'center'} />
    </Rect>
  );
}
