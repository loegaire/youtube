import {Rect, Txt, Node} from '@motion-canvas/2d';
import {
  createRef,
  createSignal,
  SignalValue,
  ThreadGenerator,
  waitFor,
  easeOutCubic,
  easeInOutCubic,
  chain,
} from '@motion-canvas/core';
import {COLORS, FONTS, SIZES} from './tokens';

export type TerminalLine = {
  text: string;
  prompt?: boolean;
  color?: string;
};

export type TerminalRefs = {
  body: Rect;
  lines: Txt;
  cursor: Rect;
  output: Txt;
};

// A stylized terminal window with title bar (traffic dots + title),
// gutter line numbers, and a typing-capable body region.
export function buildTerminal(
  parent: Node,
  opts: {
    title?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  } = {},
): TerminalRefs {
  const body = createRef<Rect>();
  const lines = createRef<Txt>();
  const cursor = createRef<Rect>();
  const output = createRef<Txt>();

  const w = opts.width ?? 760;
  const h = opts.height ?? 420;

  parent.add(
    <Rect
      layout
      direction={'column'}
      width={w}
      height={h}
      radius={12}
      fill={COLORS.panel}
      stroke={COLORS.panelBorder}
      lineWidth={1.5}
      x={opts.x ?? 0}
      y={opts.y ?? 0}
      clip
    >
      {/* title bar */}
      <Rect
        layout
        direction={'row'}
        alignItems={'center'}
        gap={10}
        padding={{left: 16, right: 16, top: 10, bottom: 10}}
        fill={COLORS.panelLight}
        width={'100%'}
      >
        <Rect width={12} height={12} radius={6} fill={COLORS.coral} />
        <Rect width={12} height={12} radius={6} fill={COLORS.amber} />
        <Rect width={12} height={12} radius={6} fill={COLORS.mint} />
        <Txt
          text={opts.title ?? 'terminal'}
          fontFamily={FONTS.mono}
          fontSize={SIZES.terminalHeader}
          fill={COLORS.textDim}
          marginLeft={14}
        />
      </Rect>
      {/* body */}
      <Rect
        ref={body}
        layout
        direction={'column'}
        padding={20}
        gap={10}
        width={'100%'}
        height={'100%'}
        fill={COLORS.panel}
      >
        <Txt
          ref={lines}
          text={''}
          fontFamily={FONTS.mono}
          fontSize={SIZES.terminalText}
          fill={COLORS.text}
          lineHeight={1.5}
        />
        <Rect ref={cursor} width={14} height={26} fill={COLORS.mint} opacity={0} />
        <Txt
          ref={output}
          text={''}
          fontFamily={FONTS.mono}
          fontSize={SIZES.terminalText}
          fill={COLORS.mint}
          lineHeight={1.5}
        />
      </Rect>
    </Rect>,
  );

  return {body: body(), lines: lines(), cursor: cursor(), output: output()};
}

// Type text into the terminal body character-by-character.
export function* typeTerminal(
  lines: Txt,
  fullText: string,
  speed = 0.025,
): ThreadGenerator {
  for (let i = 1; i <= fullText.length; i++) {
    lines.text(fullText.slice(0, i));
    yield* waitFor(speed);
  }
}

// Append a new line to the terminal body.
export function* typeLine(
  lines: Txt,
  line: string,
  speed = 0.025,
): ThreadGenerator {
  const current = lines.text();
  const next = current.length > 0 ? current + '\n' + line : line;
  yield* typeTerminal(lines, next, speed);
}

// Flash the output line (e.g. a result like "PRIME FOUND").
export function* flashOutput(
  output: Txt,
  text: string,
  color: string = COLORS.mint,
): ThreadGenerator {
  output.fill(color);
  output.text(text);
  yield* output.opacity(1, 0.2, easeOutCubic);
  yield* waitFor(0.6);
}
