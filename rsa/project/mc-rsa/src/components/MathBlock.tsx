import {Rect, Txt, Node, Line} from '@motion-canvas/2d';
import {
  createRef,
  ThreadGenerator,
  waitFor,
  easeOutCubic,
  easeInOutCubic,
  all,
  chain,
} from '@motion-canvas/core';
import {COLORS, FONTS, SIZES} from './tokens';

// A math equation line rendered as monospace text with a subtle underline rule.
export function buildEquation(
  parent: Node,
  opts: {text: string; x?: number; y?: number; color?: string; size?: number},
): {node: Rect; txt: Txt; rule: Line} {
  const node = createRef<Rect>();
  const txt = createRef<Txt>();
  const rule = createRef<Line>();
  const color = opts.color ?? COLORS.text;
  const size = opts.size ?? SIZES.bodyLarge;

  parent.add(
    <Rect
      ref={node}
      layout
      direction={'column'}
      alignItems={'center'}
      gap={8}
      x={opts.x ?? 0}
      y={opts.y ?? 0}
    >
      <Txt
        ref={txt}
        text={opts.text}
        fontFamily={FONTS.monoNerd}
        fontSize={size}
        fontWeight={600}
        fill={color}
      />
      <Line
        ref={rule}
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={color}
        lineWidth={2}
        opacity={0.4}
      />
    </Rect>,
  );

  return {node: node(), txt: txt(), rule: rule()};
}
