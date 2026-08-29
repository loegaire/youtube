import {makeScene2D, Rect, Txt, Icon, Line, Node} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  waitFor,
  easeOutCubic,
  easeInOutCubic,
  Vector2,
} from '@motion-canvas/core';
import {COLORS, FONTS, SIZES} from '../components/tokens';
import {buildBlock, buildChip, buildAppWindow} from '../components/AppWindow';
import {buildCaptionRail, runCaptions, fadeCaption} from '../components/CaptionOverlay';

// Scene 1 — Key Generation intro (0.0 - 15.0)
// p and q blocks slide in, multiply into n; public key (n,e) and private key d
// form with lock/key icons. Causal motion: blocks merge, key chips attach.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);

  const cap = buildCaptionRail(view);

  // Title tag (small orientation, not a dashboard)
  const tag = createRef<Txt>();
  view.add(
    <Txt
      ref={tag}
      text={'KEY GENERATION'}
      fontFamily={FONTS.mono}
      fontSize={22}
      fill={COLORS.textMuted}
      letterSpacing={4}
      x={0}
      y={-430}
      opacity={0}
    />,
  );

  // Prime blocks p and q enter from left and right
  const p = buildBlock(view, {label: 'p', sub: 'prime', color: COLORS.mint, x: -360, y: -60});
  const q = buildBlock(view, {label: 'q', sub: 'prime', color: COLORS.mint, x: 360, y: -60});

  p.block.x(-900);
  q.block.x(900);
  p.block.opacity(0);
  q.block.opacity(0);

  yield* waitFor(0.4);
  yield* tag().opacity(1, 0.5, easeOutCubic);

  // p and q slide in
  yield* all(
    chain(p.block.x(-360, 0.8, easeOutCubic), p.block.opacity(1, 0.5)),
    chain(q.block.x(360, 0.8, easeOutCubic), q.block.opacity(1, 0.5)),
  );

  yield* waitFor(0.3);

  // multiply sign appears between them
  const times = createRef<Txt>();
  view.add(
    <Txt ref={times} text={'×'} fontFamily={FONTS.monoNerd} fontSize={64} fill={COLORS.textDim} opacity={0} y={-60} />,
  );
  yield* times().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // p and q slide together and merge into n
  const n = buildBlock(view, {label: 'n', sub: 'modulus', color: COLORS.amber, size: 150, x: 0, y: -60});
  n.block.opacity(0);
  n.block.scale(0.3);

  yield* all(
    p.block.x(-120, 0.6, easeInOutCubic),
    q.block.x(120, 0.6, easeInOutCubic),
    times().opacity(0, 0.3),
  );
  yield* all(
    p.block.opacity(0, 0.3),
    q.block.opacity(0, 0.3),
    n.block.opacity(1, 0.4),
    n.block.scale(1, 0.5, easeOutCubic),
  );

  yield* waitFor(0.4);

  // public key (n, e) forms — e chip attaches to n, mint accent
  const pubChip = buildChip(view, {label: 'public', value: '(n, e)', accent: COLORS.mint, x: 0, y: 140});
  pubChip.chip.opacity(0);
  pubChip.chip.y(260);
  yield* all(pubChip.chip.opacity(1, 0.4), pubChip.chip.y(140, 0.5, easeOutCubic));

  // private key d with lock icon — appears on the right
  const privCard = buildAppWindow(view, {
    title: 'private key',
    icon: 'ph:lock-key-bold',
    width: 360,
    height: 130,
    x: 560,
    y: 140,
    accent: COLORS.coral,
  });
  privCard.card.opacity(0);
  privCard.card.x(820);
  const dLabel = createRef<Txt>();
  privCard.body.add(
    <Txt ref={dLabel} text={'d'} fontFamily={FONTS.monoNerd} fontSize={56} fontWeight={700} fill={COLORS.coral} />,
  );
  yield* all(privCard.card.opacity(1, 0.4), privCard.card.x(560, 0.5, easeOutCubic));

  // connecting line from n to public chip
  const pubLine = createRef<Line>();
  view.add(
    <Line
      ref={pubLine}
      points={[[-80, 10], [0, 60], [0, 100]]}
      stroke={COLORS.mint}
      lineWidth={2}
      opacity={0}
      endArrow
    />,
  );
  yield* pubLine().opacity(0.5, 0.3);

  // caption timeline for this scene
  const capThread = runCaptions(cap, 0, 15);
  yield* capThread;

  // clean fade out
  yield* all(
    n.block.opacity(0, 0.4),
    pubChip.chip.opacity(0, 0.4),
    privCard.card.opacity(0, 0.4),
    tag().opacity(0, 0.4),
    pubLine().opacity(0, 0.3),
  );
});
