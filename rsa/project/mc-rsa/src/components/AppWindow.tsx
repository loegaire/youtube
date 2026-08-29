import {Rect, Txt, Node, Icon} from '@motion-canvas/2d';
import {
  createRef,
  createSignal,
  ThreadGenerator,
  waitFor,
  easeOutCubic,
  easeInOutCubic,
  all,
  chain,
  Vector2,
} from '@motion-canvas/core';
import {COLORS, FONTS, SIZES} from './tokens';

// A stylized app/window card with a header row (icon + title) and body.
// Used to represent the RSA application UI, key manager, message composer, etc.
export type AppWindowRefs = {
  card: Rect;
  header: Rect;
  title: Txt;
  body: Rect;
};

export function buildAppWindow(
  parent: Node,
  opts: {
    title: string;
    icon?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    accent?: string;
  },
): AppWindowRefs {
  const card = createRef<Rect>();
  const header = createRef<Rect>();
  const title = createRef<Txt>();
  const body = createRef<Rect>();
  const accent = opts.accent ?? COLORS.mint;
  const w = opts.width ?? 600;
  const h = opts.height ?? 360;

  parent.add(
    <Rect
      ref={card}
      layout
      direction={'column'}
      width={w}
      height={h}
      radius={14}
      fill={COLORS.panel}
      stroke={COLORS.panelBorder}
      lineWidth={2}
      x={opts.x ?? 0}
      y={opts.y ?? 0}
      clip
    >
      <Rect
        ref={header}
        layout
        direction={'row'}
        alignItems={'center'}
        gap={14}
        padding={{left: 22, right: 22, top: 16, bottom: 16}}
        fill={COLORS.panelLight}
        width={'100%'}
      >
        {opts.icon ? (
          <Icon icon={opts.icon} size={28} color={accent} />
        ) : (
          <Rect width={0} height={0} />
        )}
        <Txt
          ref={title}
          text={opts.title}
          fontFamily={FONTS.mono}
          fontSize={SIZES.label}
          fontWeight={600}
          fill={COLORS.text}
        />
      </Rect>
      <Rect
        ref={body}
        layout
        direction={'column'}
        padding={26}
        gap={16}
        width={'100%'}
        height={'100%'}
        fill={COLORS.panel}
      />
    </Rect>,
  );

  return {card: card(), header: header(), title: title(), body: body()};
}

// A labeled value chip — small rounded pill with a key/value pair.
export function buildChip(
  parent: Node,
  opts: {label: string; value: string; accent?: string; x?: number; y?: number},
): {chip: Rect; value: Txt} {
  const chip = createRef<Rect>();
  const value = createRef<Txt>();
  const accent = opts.accent ?? COLORS.mint;

  parent.add(
    <Rect
      ref={chip}
      layout
      direction={'row'}
      alignItems={'center'}
      gap={12}
      padding={{top: 10, bottom: 10, left: 18, right: 18}}
      radius={10}
      fill={COLORS.panelLight}
      stroke={accent}
      lineWidth={1.5}
      x={opts.x ?? 0}
      y={opts.y ?? 0}
    >
      <Txt
        text={opts.label}
        fontFamily={FONTS.mono}
        fontSize={24}
        fill={COLORS.textDim}
      />
      <Txt
        ref={value}
        text={opts.value}
        fontFamily={FONTS.monoNerd}
        fontSize={26}
        fontWeight={600}
        fill={accent}
      />
    </Rect>,
  );

  return {chip: chip(), value: value()};
}

// A labeled block — a square/rect tile with a big letter and small subscript label.
export function buildBlock(
  parent: Node,
  opts: {
    label: string;
    sub?: string;
    size?: number;
    color?: string;
    x?: number;
    y?: number;
  },
): {block: Rect; label: Txt} {
  const block = createRef<Rect>();
  const label = createRef<Txt>();
  const sz = opts.size ?? 120;
  const color = opts.color ?? COLORS.mint;

  parent.add(
    <Rect
      ref={block}
      width={sz}
      height={sz}
      radius={14}
      fill={color + '22'}
      stroke={color}
      lineWidth={2.5}
      alignItems={'center'}
      justifyContent={'center'}
      direction={'column'}
      x={opts.x ?? 0}
      y={opts.y ?? 0}
    >
      <Txt
        ref={label}
        text={opts.label}
        fontFamily={FONTS.monoNerd}
        fontSize={sz * 0.42}
        fontWeight={700}
        fill={color}
      />
      {opts.sub ? (
        <Txt
          text={opts.sub}
          fontFamily={FONTS.mono}
          fontSize={20}
          fill={COLORS.textDim}
          marginTop={4}
        />
      ) : (
        <></>
      )}
    </Rect>,
  );

  return {block: block(), label: label()};
}
