import {Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {ReferenceReceiver, Vector2} from '@motion-canvas/core';
import {C, MONO, SANS} from './theme';

export function Backdrop({chapter, detail = 'RET2LIBC / EVIDENCE ROUTE'}: {chapter: string; detail?: string}) {
  return <>
    <Rect width={1920} height={1080} fill={C.bg}/>
    {[-830, -490, -150, 190, 530, 830].map(x => <Line key={String(x)} points={[[x, -540], [x, 540]]} stroke={'#26332B33'} lineWidth={1}/>) }
    <Line points={[[-850, -454], [850, -454]]} stroke={C.rule} lineWidth={2}/>
    <Rect x={-850} y={-486} width={8} height={28} fill={C.mint}/>
    <Txt text={chapter.toUpperCase()} x={-824} y={-486} offsetX={-1} fill={C.mint} fontFamily={MONO} fontWeight={800} fontSize={17} letterSpacing={2.1}/>
    <Txt text={detail} x={850} y={-486} offsetX={1} fill={C.muted} fontFamily={MONO} fontWeight={700} fontSize={15} letterSpacing={1.1}/>
  </>;
}

export function Panel({x = 0, y = 0, width = 640, height = 320, fill = C.panel, stroke = C.rule, radius = 18, ref, children, opacity = 1}: {
  key?: string | number; x?: number; y?: number; width?: number; height?: number; fill?: string; stroke?: string; radius?: number; ref?: ReferenceReceiver<Rect>; children?: any; opacity?: number;
}) {
  return <Rect ref={ref} x={x} y={y} width={width} height={height} radius={radius} fill={fill} stroke={stroke} lineWidth={2} opacity={opacity}>{children}</Rect>;
}

export function EvidenceTag({text, x, y, tone = C.output}: {text: string; x: number; y: number; tone?: string}) {
  return <Rect x={x} y={y} width={Math.max(180, text.length * 11 + 28)} height={38} radius={10} fill={C.raised} stroke={tone} lineWidth={1}>
    <Txt text={text} fill={tone} fontFamily={MONO} fontWeight={760} fontSize={16}/>
  </Rect>;
}

export function Label({text, x = 0, y = 0, size = 28, color = C.ink, mono = false, weight = 650, width}: {text: string; x?: number; y?: number; size?: number; color?: string; mono?: boolean; weight?: number; width?: number}) {
  return <Txt text={text} x={x} y={y} width={width} offsetX={width || x !== 0 ? -1 : 0} fill={color} fontFamily={mono ? MONO : SANS} fontSize={size} fontWeight={weight}/>;
}

export function Byte({value, x, y, tone = C.amber, ref}: {value: string; x: number; y: number; tone?: string; ref?: ReferenceReceiver<Rect>}) {
  return <Rect ref={ref} x={x} y={y} width={72} height={62} radius={9} fill={C.raised} stroke={tone} lineWidth={2}>
    <Txt text={value} fill={tone} fontFamily={MONO} fontSize={22} fontWeight={800}/>
  </Rect>;
}

export function CodeRows({rows, x, y, width = 1350, active = -1, size = 22}: {rows: string[]; x: number; y: number; width?: number; active?: number | (() => number); size?: number}) {
  const current = () => typeof active === 'function' ? active() : active;
  return <Node x={x} y={y}>{rows.map((row, i) => <Rect key={`${row}-${i}`} y={i * 30} width={width} height={28} radius={4} fill={() => current() === i ? '#D8BE7322' : C.transparent}>
    <Txt text={row} x={-width / 2 + 18} width={width - 36} offsetX={-1} fill={() => current() === i ? C.amber : C.ink} fontFamily={MONO} fontSize={size} fontWeight={current() === i ? 700 : 570}/>
  </Rect>)}</Node>;
}

export function Route({from, to, tone = C.output, end = 1, ref}: {key?: string | number; from: [number, number]; to: [number, number]; tone?: string; end?: number; ref?: ReferenceReceiver<Line>}) {
  return <Line ref={ref} points={[new Vector2(...from), new Vector2(...to)]} stroke={tone} lineWidth={4} endArrow arrowSize={15} radius={8} end={end}/>;
}

export function CaptionRail({text, ref}: {text: string; ref?: ReferenceReceiver<Rect>}) {
  return <Panel ref={ref} y={454} width={1510} height={92} fill={'#0A0D0BEF'} stroke={'#8CCB9A88'} radius={14}>
    <Txt text={'›'} x={-710} fill={C.mint} fontFamily={MONO} fontSize={54} fontWeight={800}/>
    <Txt text={text} x={-652} width={1260} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={28} fontWeight={650}/>
  </Panel>;
}
