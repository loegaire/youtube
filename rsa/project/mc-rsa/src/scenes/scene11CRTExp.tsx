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
import {buildEquation} from '../components/MathBlock';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 11 — CRT exponent reduction (160.0 - 175.0)
// Exponent bar shrinks from d to d_p (mod p-1) / d_q (mod q-1).
// Faster squaring loop within each mod p / mod q environment.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'CRT EXPONENT REDUCTION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // two branches side by side
  const pBranch = createRef<Rect>();
  const qBranch = createRef<Rect>();
  view.add(<Rect ref={pBranch} width={400} height={400} radius={14} fill={COLORS.panel} stroke={COLORS.mint} lineWidth={2} x={-300} y={0} opacity={0} layout direction={'column'} alignItems={'center'} gap={20} padding={30}>
    <Txt text={'mod p branch'} fontFamily={FONTS.monoNerd} fontSize={26} fontWeight={600} fill={COLORS.mint} />
  </Rect>);
  view.add(<Rect ref={qBranch} width={400} height={400} radius={14} fill={COLORS.panel} stroke={COLORS.mintDeep} lineWidth={2} x={300} y={0} opacity={0} layout direction={'column'} alignItems={'center'} gap={20} padding={30}>
    <Txt text={'mod q branch'} fontFamily={FONTS.monoNerd} fontSize={26} fontWeight={600} fill={COLORS.mintDeep} />
  </Rect>);
  yield* all(pBranch().opacity(1, 0.3), qBranch().opacity(1, 0.3));
  yield* waitFor(0.3);

  // exponent bars — full d (long), then shrinks to d_p / d_q (short)
  const dBarFull = createRef<Rect>();
  const dBarShort = createRef<Rect>();
  view.add(<Rect ref={dBarFull} width={300} height={30} radius={6} fill={COLORS.coral + '33'} stroke={COLORS.coral} lineWidth={1.5} x={-300} y={-60} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'d'} fontFamily={FONTS.monoNerd} fontSize={20} fill={COLORS.coral} />
  </Rect>);
  view.add(<Rect ref={dBarShort} width={300} height={30} radius={6} fill={COLORS.coral + '33'} stroke={COLORS.coral} lineWidth={1.5} x={300} y={-60} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'d'} fontFamily={FONTS.monoNerd} fontSize={20} fill={COLORS.coral} />
  </Rect>);
  yield* all(dBarFull().opacity(1, 0.3), dBarShort().opacity(1, 0.3));
  yield* waitFor(0.3);

  // shrink bars + relabel
  const dpLabel = createRef<Txt>();
  const dqLabel = createRef<Txt>();
  view.add(<Txt ref={dpLabel} text={'d_p = d mod (p−1)'} fontFamily={FONTS.monoNerd} fontSize={22} fill={COLORS.mint} x={-300} y={-20} opacity={0} />);
  view.add(<Txt ref={dqLabel} text={'d_q = d mod (q−1)'} fontFamily={FONTS.monoNerd} fontSize={22} fill={COLORS.mintDeep} x={300} y={-20} opacity={0} />);

  yield* all(
    dBarFull().width(120, 0.6, easeInOutCubic),
    dBarShort().width(120, 0.6, easeInOutCubic),
    dpLabel().opacity(1, 0.3),
    dqLabel().opacity(1, 0.3),
  );
  yield* waitFor(0.3);

  // relabel the bars
  (dBarFull().children()[0] as Txt).text('d_p');
  (dBarShort().children()[0] as Txt).text('d_q');
  yield* waitFor(0.2);

  // faster squaring loop — animated cycle indicator
  const loopP = createRef<Rect>();
  const loopQ = createRef<Rect>();
  view.add(<Rect ref={loopP} width={80} height={80} radius={40} fill={COLORS.mint + '18'} stroke={COLORS.mint} lineWidth={2} x={-300} y={120} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'↻'} fontFamily={FONTS.monoNerd} fontSize={36} fill={COLORS.mint} />
  </Rect>);
  view.add(<Rect ref={loopQ} width={80} height={80} radius={40} fill={COLORS.mintDeep + '18'} stroke={COLORS.mintDeep} lineWidth={2} x={300} y={120} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'↻'} fontFamily={FONTS.monoNerd} fontSize={36} fill={COLORS.mintDeep} />
  </Rect>);
  yield* all(loopP().opacity(1, 0.3), loopQ().opacity(1, 0.3));

  // spin the loops (rotation) to show faster cycling
  yield* all(loopP().rotation(360, 0.8, easeInOutCubic), loopQ().rotation(360, 0.8, easeInOutCubic));

  const fasterTxt = createRef<Txt>();
  view.add(<Txt ref={fasterTxt} text={'much quicker — smaller exponents'} fontFamily={FONTS.monoNerd} fontSize={26} fill={COLORS.mint} x={0} y={260} opacity={0} />);
  yield* fasterTxt().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 160, 175);
  yield* capThread;

  yield* all(
    pBranch().opacity(0, 0.3),
    qBranch().opacity(0, 0.3),
    dBarFull().opacity(0, 0.3),
    dBarShort().opacity(0, 0.3),
    dpLabel().opacity(0, 0.3),
    dqLabel().opacity(0, 0.3),
    loopP().opacity(0, 0.3),
    loopQ().opacity(0, 0.3),
    fasterTxt().opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
