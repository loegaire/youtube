import {makeScene2D, Rect, Txt, Line, Icon} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  waitFor,
  easeOutCubic,
  easeInOutCubic,
  sequence,
} from '@motion-canvas/core';
import {COLORS, FONTS, SIZES} from '../components/tokens';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 13 — Prime selection attacks (190.0 - 210.0)
// n pulled apart by saw (factorization); warnings for Fermat (p−q small) and
// Pollard p−1 (small factors); strong primes chosen instead.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'PRIME SELECTION ATTACKS'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // n block at center
  const nBlock = createRef<Rect>();
  view.add(<Rect ref={nBlock} width={160} height={100} radius={12} fill={COLORS.amber + '22'} stroke={COLORS.amber} lineWidth={2.5} x={0} y={-220} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'n'} fontFamily={FONTS.monoNerd} fontSize={48} fontWeight={700} fill={COLORS.amber} />
  </Rect>);
  yield* nBlock().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // saw splits n into p and q
  const saw = createRef<Icon>();
  // saw icon lunges down
  view.add(
    <Rect x={0} y={-320} rotation={0} opacity={0}>
      <Icon ref={saw} icon={'ph:saw-bold'} size={60} color={COLORS.coral} />
    </Rect>,
  );
  // animate saw down then split
  const sawParent = saw().parent() as Rect;
  yield* sawParent.opacity(1, 0.2);
  yield* sawParent.y(-240, 0.4, easeInOutCubic);
  yield* sawParent.rotation(90, 0.3, easeInOutCubic);
  yield* waitFor(0.1);

  // split into p and q
  const pSplit = createRef<Rect>();
  const qSplit = createRef<Rect>();
  view.add(<Rect ref={pSplit} width={100} height={70} radius={10} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={2} x={-200} y={-220} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'p'} fontFamily={FONTS.monoNerd} fontSize={32} fontWeight={600} fill={COLORS.mint} />
  </Rect>);
  view.add(<Rect ref={qSplit} width={100} height={70} radius={10} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={2} x={200} y={-220} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'q'} fontFamily={FONTS.monoNerd} fontSize={32} fontWeight={600} fill={COLORS.mint} />
  </Rect>);
  yield* all(nBlock().opacity(0, 0.2), sawParent.opacity(0, 0.2), pSplit().opacity(1, 0.3), qSplit().opacity(1, 0.3), pSplit().x(-200, 0.4, easeOutCubic), qSplit().x(200, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // warning 1: p−q small → Fermat attack (failed saw)
  const warn1 = createRef<Rect>();
  view.add(<Rect ref={warn1} width={420} height={70} radius={10} fill={COLORS.coral + '18'} stroke={COLORS.coral} lineWidth={2} x={0} y={-80} opacity={0} alignItems={'center'} justifyContent={'center'} gap={14}>
    <Icon icon={'ph:warning-bold'} size={28} color={COLORS.coral} />
    <Txt text={'p−q small → Fermat factorization'} fontFamily={FONTS.monoNerd} fontSize={22} fill={COLORS.coral} />
  </Rect>);
  yield* warn1().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // warning 2: p−1 small factors → Pollard
  const warn2 = createRef<Rect>();
  view.add(<Rect ref={warn2} width={480} height={70} radius={10} fill={COLORS.coral + '18'} stroke={COLORS.coral} lineWidth={2} x={0} y={30} opacity={0} alignItems={'center'} justifyContent={'center'} gap={14}>
    <Icon icon={'ph:warning-bold'} size={28} color={COLORS.coral} />
    <Txt text={'p−1 small factors → Pollard p−1'} fontFamily={FONTS.monoNerd} fontSize={22} fill={COLORS.coral} />
  </Rect>);
  yield* warn2().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // strong primes chosen — robust irregular blocks
  const strongP = createRef<Rect>();
  const strongQ = createRef<Rect>();
  view.add(<Rect ref={strongP} width={120} height={80} radius={14} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={3} x={-200} y={200} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'}>
    <Txt text={'p'} fontFamily={FONTS.monoNerd} fontSize={30} fontWeight={600} fill={COLORS.mint} />
    <Txt text={'strong'} fontFamily={FONTS.mono} fontSize={16} fill={COLORS.textDim} />
  </Rect>);
  view.add(<Rect ref={strongQ} width={120} height={80} radius={14} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={3} x={200} y={200} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'}>
    <Txt text={'q'} fontFamily={FONTS.monoNerd} fontSize={30} fontWeight={600} fill={COLORS.mint} />
    <Txt text={'strong'} fontFamily={FONTS.mono} fontSize={16} fill={COLORS.textDim} />
  </Rect>);
  yield* all(strongP().opacity(1, 0.3), strongQ().opacity(1, 0.3));
  yield* waitFor(0.2);

  // fade warnings, show shield
  yield* all(warn1().opacity(0.2, 0.3), warn2().opacity(0.2, 0.3));
  const shield = createRef<Icon>();
  view.add(<Icon ref={shield} icon={'ph:shield-check-bold'} size={48} color={COLORS.mint} x={0} y={200} opacity={0} />);
  yield* shield().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 190, 210);
  yield* capThread;

  yield* all(
    pSplit().opacity(0, 0.3),
    qSplit().opacity(0, 0.3),
    warn1().opacity(0, 0.3),
    warn2().opacity(0, 0.3),
    strongP().opacity(0, 0.3),
    strongQ().opacity(0, 0.3),
    shield().opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
