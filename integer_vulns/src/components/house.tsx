import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {ReferenceReceiver} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export function Backdrop({chapter, title, index}: {chapter: string; title: string; index: number}) {
  return (
    <>
      <Rect width={1920} height={1080} fill={C.canvas} />
      {[-830, -520, -210, 100, 410, 720].map(x => <Line points={[[x, -540], [x, 540]]} stroke={'#26332B42'} lineWidth={1} />)}
      <Line points={[[-850, -484], [850, -484]]} stroke={C.rule} lineWidth={2} />
      <Rect x={-850} y={-443} width={8} height={26} fill={C.mint} />
      <Txt text={chapter.toUpperCase()} x={-826} y={-443} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={18} fontWeight={750} letterSpacing={1.8} />
      <Txt text={title} x={-850} y={-378} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={46} fontWeight={780} />
      <Txt text={`INTEGER VULNS  /  ${String(index + 1).padStart(2, '0')}`} x={850} y={-443} offsetX={1} fill={C.muted} fontFamily={MONO} fontSize={16} fontWeight={650} />
      <Line points={[[-850, -326], [850, -326]]} stroke={C.rule} lineWidth={1} />
    </>
  );
}

export function Panel({
  x = 0, y = 0, width = 600, height = 340, stroke = C.rule, fill = C.panel, radius = 8, ref, children,
}: {
  x?: number; y?: number; width?: number; height?: number; stroke?: string; fill?: string; radius?: number;
  ref?: ReferenceReceiver<Rect>; children?: any;
}) {
  return (
    <Rect ref={ref} x={x} y={y} width={width} height={height} radius={radius} fill={fill} stroke={stroke} lineWidth={2} clip>
      <Rect y={-height / 2 + 1} width={width - 2} height={2} fill={'#FFFFFF12'} />
      {children}
    </Rect>
  );
}

export function Label({text, x = 0, y = 0, color = C.ink, size = 28, mono = false, weight = 650}: {
  text: string; x?: number; y?: number; color?: string; size?: number; mono?: boolean; weight?: number;
}) {
  return <Txt text={text} x={x} y={y} fill={color} fontFamily={mono ? MONO : SANS} fontSize={size} fontWeight={weight} />;
}

export function CaptionRail({text, ref}: {text: () => string; ref?: ReferenceReceiver<Rect>}) {
  return (
    <Rect ref={ref} y={448} width={1660} height={106} radius={8} fill={C.panel} stroke={C.rule} lineWidth={2}>
      <Rect x={-820} width={8} height={106} fill={C.mint} />
      <Txt text={'›'} x={-770} fill={C.mint} fontFamily={MONO} fontSize={50} fontWeight={800} />
      <Txt text={text} x={-724} width={1360} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={42} fontWeight={650} />
    </Rect>
  );
}

export type TerminalLine = {text: string; tone?: 'mint' | 'amber' | 'coral' | 'muted'; prompt?: boolean};

const terminalTone = (tone: TerminalLine['tone']) => ({
  mint: C.mint,
  amber: C.amber,
  coral: C.coral,
  muted: C.muted,
}[tone ?? 'muted']);

export function TerminalSurface({
  title = 'terminal', context, lines, active = () => -1, x = 0, y = 0, width = 1180, height = 560, ref,
}: {
  title?: string; context?: string; lines: TerminalLine[]; active?: () => number; x?: number; y?: number;
  width?: number; height?: number; ref?: ReferenceReceiver<Rect>;
}) {
  const rowH = Math.min(34, (height - 116) / Math.max(1, lines.length));
  return (
    <Panel ref={ref} x={x} y={y} width={width} height={height} stroke={C.mint}>
      <Rect y={-height / 2 + 28} width={width} height={56} fill={C.raised} />
      <Rect x={-width / 2 + 12} y={-height / 2 + 28} width={5} height={38} fill={C.mint} />
      <Txt text={title} x={-width / 2 + 34} y={-height / 2 + 28} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={19} fontWeight={800} />
      {context ? <Txt text={context} x={width / 2 - 28} y={-height / 2 + 28} offsetX={1} fill={C.muted} fontFamily={MONO} fontSize={15} /> : null}
      {lines.map((line, i) => (
        <Rect key={`${line.text}-${i}`} y={-height / 2 + 80 + i * rowH} width={width - 40} height={rowH - 2} radius={4} fill={() => active() === i ? '#8CCB9A18' : '#00000000'}>
          {line.prompt ? <Txt text={'$'} x={-width / 2 + 36} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={18} fontWeight={800} /> : null}
          <Txt text={line.text} x={-width / 2 + (line.prompt ? 66 : 36)} width={width - 100} offsetX={-1} fill={terminalTone(line.tone)} fontFamily={MONO} fontSize={18} fontWeight={line.tone === 'coral' ? 700 : 500} />
        </Rect>
      ))}
    </Panel>
  );
}

export function SourceSurface({
  source, activeLine = () => -1, scrollLine = () => 0, x = 0, y = 0, width = 1360, height = 650, title = 'store.c', ref,
}: {
  source: string[]; activeLine?: () => number; scrollLine?: () => number; x?: number; y?: number;
  width?: number; height?: number; title?: string; ref?: ReferenceReceiver<Rect>;
}) {
  const lineH = 30;
  return (
    <Panel ref={ref} x={x} y={y} width={width} height={height} stroke={C.mint}>
      <Rect y={-height / 2 + 28} width={width} height={56} fill={C.raised} />
      <Txt text={title} x={-width / 2 + 34} y={-height / 2 + 28} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={20} fontWeight={800} />
      <Txt text={'local source reconstruction'} x={width / 2 - 34} y={-height / 2 + 28} offsetX={1} fill={C.muted} fontFamily={MONO} fontSize={15} />
      {source.map((line, index) => (
        <Rect key={`source-${index}`} y={() => -height / 2 + 92 + index * lineH - scrollLine() * lineH} width={width - 40} height={lineH - 1} radius={3} fill={() => activeLine() === index + 1 ? '#D8BE731D' : '#00000000'}>
          <Txt text={String(index + 1).padStart(3, ' ')} x={-width / 2 + 36} width={56} offsetX={-1} fill={activeLine() === index + 1 ? C.amber : C.dim} fontFamily={MONO} fontSize={17} textAlign={'right'} />
          <Txt text={line || ' '} x={-width / 2 + 120} width={width - 160} offsetX={-1} fill={() => activeLine() === index + 1 ? C.ink : C.muted} fontFamily={MONO} fontSize={17} fontWeight={activeLine() === index + 1 ? 650 : 450} />
        </Rect>
      ))}
    </Panel>
  );
}

export function BitCell({bit, x, y, accent = false, ref}: {bit: string; x: number; y: number; accent?: boolean; ref?: ReferenceReceiver<Rect>}) {
  return (
    <Rect ref={ref} x={x} y={y} width={38} height={56} radius={4} fill={accent ? '#F0786E20' : C.raised} stroke={accent ? C.coral : C.rule} lineWidth={2}>
      <Txt text={bit} fill={accent ? C.coral : C.mintSoft} fontFamily={MONO} fontSize={24} fontWeight={800} />
    </Rect>
  );
}

export function Dot({x, y, color = C.mint, size = 16}: {x: number; y: number; color?: string; size?: number}) {
  return <Circle x={x} y={y} size={size} fill={color} />;
}

export function RuleArrow({from, to, color = C.mint, ref}: {from: [number, number]; to: [number, number]; color?: string; ref?: ReferenceReceiver<Line>}) {
  return <Line ref={ref} points={[from, to]} stroke={color} lineWidth={4} endArrow arrowSize={14} radius={3} />;
}

export function Stamp({text, x = 0, y = 0, color = C.coral, ref}: {text: string; x?: number; y?: number; color?: string; ref?: ReferenceReceiver<Rect>}) {
  return (
    <Rect ref={ref} x={x} y={y} padding={[12, 18]} radius={4} fill={C.canvas} stroke={color} lineWidth={4} rotation={-6}>
      <Txt text={text} fill={color} fontFamily={MONO} fontSize={32} fontWeight={900} letterSpacing={1.3} />
    </Rect>
  );
}
