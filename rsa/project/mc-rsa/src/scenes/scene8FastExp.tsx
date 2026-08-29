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

// Scene 8 — Fast exponentiation (105.0 - 120.0)
// Naive: 8 multiplications in a row (slow). Fast: square-and-multiply a→a²→a⁴→a⁸ (3 steps).
// Each intermediate flows through a "mod n" filter. Step counters compare.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'FAST EXPONENTIATION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // LEFT: naive path — 8 multiplications
  const naiveTitle = createRef<Txt>();
  view.add(<Txt ref={naiveTitle} text={'naive: 8 multiplications'} fontFamily={FONTS.monoNerd} fontSize={26} fill={COLORS.coral} x={-460} y={-330} opacity={0} />);
  yield* naiveTitle().opacity(1, 0.3, easeOutCubic);

  const naiveDots: Rect[] = [];
  for (let i = 0; i < 8; i++) {
    const x = -700 + i * 60;
    const d = createRef<Rect>();
    view.add(<Rect ref={d} width={40} height={40} radius={8} fill={COLORS.coral + '22'} stroke={COLORS.coral} lineWidth={1.5} x={x} y={-240} opacity={0} alignItems={'center'} justifyContent={'center'}>
      <Txt text={'a'} fontFamily={FONTS.monoNerd} fontSize={20} fill={COLORS.coral} />
    </Rect>);
    naiveDots.push(d());
  }
  yield* sequence(0.08, ...naiveDots.map(d => d.opacity(1, 0.15)));
  yield* waitFor(0.3);

  // slow counter
  const naiveCount = createRef<Txt>();
  view.add(<Txt ref={naiveCount} text={'steps: 8'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.coral} x={-460} y={-170} opacity={0} />);
  yield* naiveCount().opacity(1, 0.3);

  // RIGHT: fast path — square and multiply
  const fastTitle = createRef<Txt>();
  view.add(<Txt ref={fastTitle} text={'square-and-multiply: 3 steps'} fontFamily={FONTS.monoNerd} fontSize={26} fill={COLORS.mint} x={360} y={-330} opacity={0} />);
  yield* fastTitle().opacity(1, 0.3, easeOutCubic);

  const fastSteps = ['a', 'a²', 'a⁴', 'a⁸'];
  const fastDots: Rect[] = [];
  for (let i = 0; i < fastSteps.length; i++) {
    const x = 120 + i * 160;
    const d = createRef<Rect>();
    view.add(<Rect ref={d} width={80} height={80} radius={12} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={2} x={x} y={-240} opacity={0} scale={0.6} alignItems={'center'} justifyContent={'center'}>
      <Txt text={fastSteps[i]} fontFamily={FONTS.monoNerd} fontSize={28} fontWeight={600} fill={COLORS.mint} />
    </Rect>);
    fastDots.push(d());
  }

  // arrows between fast steps
  const fastArrows: Line[] = [];
  for (let i = 0; i < 3; i++) {
    const a = createRef<Line>();
    view.add(<Line ref={a} points={[[120 + i * 160 + 45, -240], [120 + (i + 1) * 160 - 45, -240]]} stroke={COLORS.mint} lineWidth={2} opacity={0} endArrow />);
    fastArrows.push(a());
  }

  // cascade fast path with arrows
  for (let i = 0; i < fastSteps.length; i++) {
    yield* all(fastDots[i].opacity(1, 0.2), fastDots[i].scale(1, 0.25, easeOutCubic));
    if (i < 3) yield* fastArrows[i].opacity(0.6, 0.15);
  }
  yield* waitFor(0.2);

  // fast counter ticks fast
  const fastCount = createRef<Txt>();
  view.add(<Txt ref={fastCount} text={'steps: 3  (log₂ e)'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.mint} x={360} y={-170} opacity={0} />);
  yield* fastCount().opacity(1, 0.3);

  // mod n filter row below — show each intermediate reduced
  const filterLabel = createRef<Txt>();
  view.add(<Txt ref={filterLabel} text={'(a·b mod n) = (a mod n)·(b mod n) mod n'} fontFamily={FONTS.monoNerd} fontSize={26} fill={COLORS.amber} x={0} y={-40} opacity={0} />);
  yield* filterLabel().opacity(1, 0.3, easeOutCubic);

  // mod n gates
  const gates: Rect[] = [];
  for (let i = 0; i < 3; i++) {
    const x = 120 + i * 160 + 80;
    const g = createRef<Rect>();
    view.add(<Rect ref={g} width={60} height={50} radius={6} fill={`${COLORS.amber}1a`} stroke={COLORS.amber} lineWidth={1.5} lineDash={[8, 6]} x={x} y={60} opacity={0} alignItems={'center'} justifyContent={'center'}>
      <Txt text={'mod n'} fontFamily={FONTS.monoNerd} fontSize={16} fill={COLORS.amber} />
    </Rect>);
    gates.push(g());
  }
  yield* sequence(0.1, ...gates.map(g => g.opacity(0.7, 0.2)));

  // speedup callout
  const speedup = createRef<Txt>();
  view.add(<Txt ref={speedup} text={'≈ log(e) vs e multiplications'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.mint} x={0} y={180} opacity={0} />);
  yield* speedup().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 105, 120);
  yield* capThread;

  yield* all(
    naiveTitle().opacity(0, 0.3),
    fastTitle().opacity(0, 0.3),
    naiveCount().opacity(0, 0.3),
    fastCount().opacity(0, 0.3),
    filterLabel().opacity(0, 0.3),
    speedup().opacity(0, 0.3),
    tag().opacity(0, 0.3),
    ...naiveDots.map(d => d.opacity(0, 0.3)),
    ...fastDots.map(d => d.opacity(0, 0.3)),
    ...fastArrows.map(a => a.opacity(0, 0.2)),
    ...gates.map(g => g.opacity(0, 0.2)),
  );
});
