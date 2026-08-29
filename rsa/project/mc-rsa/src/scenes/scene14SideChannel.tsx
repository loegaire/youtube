import {makeScene2D, Rect, Txt, Line, Icon, Circle} from '@motion-canvas/2d';
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

// Scene 14 — Side-channel timing attacks (210.0 - 225.0)
// Clock + decryption chip; time-vs-input graph with spikes leaking d;
// guard adds jitter → flat timing line.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'SIDE-CHANNEL ATTACKS'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // clock face
  const clock = createRef<Circle>();
  view.add(<Circle ref={clock} x={-500} y={-120} size={140} stroke={COLORS.textDim} lineWidth={2} opacity={0} />);
  const hand = createRef<Line>();
  view.add(<Line ref={hand} points={[[-500, -120], [-500, -180]]} stroke={COLORS.amber} lineWidth={3} opacity={0} />);
  yield* all(clock().opacity(1, 0.3), hand().opacity(1, 0.3));
  yield* hand().rotation(360, 1.2, easeInOutCubic);
  yield* waitFor(0.2);

  // decryption chip icon
  const chip = createRef<Rect>();
  view.add(<Rect ref={chip} width={90} height={90} radius={10} fill={COLORS.panelLight} stroke={COLORS.mint} lineWidth={2} x={-320} y={-120} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Icon icon={'ph:cpu-bold'} size={44} color={COLORS.mint} />
  </Rect>);
  yield* chip().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // time vs input graph — spikes reveal data
  const graphBg = createRef<Rect>();
  view.add(<Rect ref={graphBg} width={560} height={240} radius={10} fill={COLORS.panel} stroke={COLORS.panelBorder} lineWidth={1.5} x={180} y={-100} opacity={0} />);
  yield* graphBg().opacity(1, 0.3);

  const graphLabel = createRef<Txt>();
  view.add(<Txt ref={graphLabel} text={'decryption time'} fontFamily={FONTS.mono} fontSize={20} fill={COLORS.textDim} x={180} y={-240} opacity={0} />);
  yield* graphLabel().opacity(1, 0.3);

  // jagged line (spikes)
  const spikePts: [number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    const x = -80 + i * 40;
    const y = -160 + (i % 3 === 0 ? -50 : 0) + (i % 4 === 0 ? 30 : 10);
    spikePts.push([x, y]);
  }
  const spikeLine = createRef<Line>();
  view.add(<Line ref={spikeLine} points={spikePts} stroke={COLORS.coral} lineWidth={2.5} opacity={0} closed={false} />);
  yield* spikeLine().opacity(1, 0.4, easeOutCubic);
  yield* waitFor(0.3);

  const leakTxt = createRef<Txt>();
  view.add(<Txt ref={leakTxt} text={'spikes leak bits of d'} fontFamily={FONTS.monoNerd} fontSize={24} fill={COLORS.coral} x={180} y={50} opacity={0} />);
  yield* leakTxt().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // guard adds jitter → timing flattens
  const guard = createRef<Rect>();
  view.add(<Rect ref={guard} width={70} height={70} radius={35} fill={COLORS.mint + '18'} stroke={COLORS.mint} lineWidth={2} x={-180} y={120} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Icon icon={'ph:shield-bold'} size={36} color={COLORS.mint} />
  </Rect>);
  yield* guard().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.2);

  // replace jagged line with flat line
  const flatPts: [number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    flatPts.push([-80 + i * 40, -130]);
  }
  yield* all(
    spikeLine().points(flatPts, 0.6, easeInOutCubic),
    spikeLine().stroke(COLORS.mint, 0.4),
    leakTxt().opacity(0, 0.3),
  );

  const flatTxt = createRef<Txt>();
  view.add(<Txt ref={flatTxt} text={'constant-time + blinding → flat'} fontFamily={FONTS.monoNerd} fontSize={24} fill={COLORS.mint} x={180} y={50} opacity={0} />);
  yield* flatTxt().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 210, 225);
  yield* capThread;

  yield* all(
    clock().opacity(0, 0.3),
    hand().opacity(0, 0.3),
    chip().opacity(0, 0.3),
    graphBg().opacity(0, 0.3),
    graphLabel().opacity(0, 0.3),
    spikeLine().opacity(0, 0.3),
    guard().opacity(0, 0.3),
    flatTxt().opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
