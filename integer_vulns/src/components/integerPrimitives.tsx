import {Line, Rect, Txt} from '@motion-canvas/2d';
import {ReferenceReceiver} from '@motion-canvas/core';
import {C, MONO} from '../theme';
import {Panel} from './house';

export function IntegerWheel({
  value, signed, unsigned, x = 0, y = 0, ref,
}: {value: () => string; signed: () => string; unsigned: () => string; x?: number; y?: number; ref?: ReferenceReceiver<Rect>}) {
  return (
    <Panel ref={ref} x={x} y={y} width={900} height={420} stroke={C.amber}>
      <Txt text={'INTEGER WHEEL  /  int: 32 bits'} x={-400} y={-165} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={20} fontWeight={800} />
      <Rect x={0} y={-45} width={680} height={106} radius={53} fill={C.raised} stroke={C.rule} lineWidth={2}>
        <Txt text={value} fill={C.ink} fontFamily={MONO} fontSize={36} fontWeight={800} />
      </Rect>
      <Line points={[[-320, 85], [320, 85]]} stroke={C.rule} lineWidth={2} />
      <Txt text={'SIGNED'} x={-320} y={130} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={16} fontWeight={800} />
      <Txt text={signed} x={-70} y={130} offsetX={-1} fill={C.coral} fontFamily={MONO} fontSize={25} fontWeight={800} />
      <Txt text={'UNSIGNED'} x={-320} y={184} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={16} fontWeight={800} />
      <Txt text={unsigned} x={-70} y={184} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={25} fontWeight={800} />
    </Panel>
  );
}

export function Domino({label, x, y, color = C.mint, ref}: {label: string; x: number; y: number; color?: string; ref?: ReferenceReceiver<Rect>}) {
  return (
    <Rect ref={ref} x={x} y={y} width={185} height={270} radius={5} fill={C.raised} stroke={color} lineWidth={3}>
      <Rect x={-72} y={-95} width={16} height={16} fill={color} />
      <Txt text={label} y={28} width={145} fill={C.ink} fontFamily={MONO} fontSize={23} fontWeight={750} textAlign={'center'} />
    </Rect>
  );
}

export function MemoryBlock({label, x, y, width, color = C.mint, ref}: {label: string; x: number; y: number; width: number; color?: string; ref?: ReferenceReceiver<Rect>}) {
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={110} radius={5} fill={C.raised} stroke={color} lineWidth={3}>
      <Txt text={label} fill={color} fontFamily={MONO} fontSize={22} fontWeight={800} />
    </Rect>
  );
}
