import {makeScene2D, Rect, Txt, Line, Circle} from '@motion-canvas/2d';
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

// Scene 6 — Multiplicative group mod n (75.0 - 90.0)
// Two overlapping circles p-1, q-1 → product phi(n).
// Number line 1..n with non-coprime grayed, coprime highlighted.
// Exponents e and d loop mod phi(n).
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'MULTIPLICATIVE GROUP'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // two overlapping circles
  const c1 = createRef<Circle>();
  const c2 = createRef<Circle>();
  view.add(<Circle ref={c1} x={-90} y={-180} size={220} stroke={COLORS.mint} lineWidth={2.5} fill={COLORS.mint + '12'} opacity={0} />);
  view.add(<Circle ref={c2} x={90} y={-180} size={220} stroke={COLORS.mintDeep} lineWidth={2.5} fill={COLORS.mintDeep + '12'} opacity={0} />);

  const l1 = createRef<Txt>();
  const l2 = createRef<Txt>();
  view.add(<Txt ref={l1} text={'p−1'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.mint} x={-150} y={-280} opacity={0} />);
  view.add(<Txt ref={l2} text={'q−1'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.mintDeep} x={150} y={-280} opacity={0} />);

  yield* all(c1().opacity(1, 0.3), c2().opacity(1, 0.3), l1().opacity(1, 0.3), l2().opacity(1, 0.3));
  yield* waitFor(0.3);

  // phi(n) label in the overlap
  const phiLabel = createRef<Txt>();
  view.add(<Txt ref={phiLabel} text={'φ(n)'} fontFamily={FONTS.monoNerd} fontSize={34} fontWeight={600} fill={COLORS.amber} x={0} y={-180} opacity={0} />);
  yield* phiLabel().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // number line 1..n
  const lineY = 40;
  const numLine = createRef<Line>();
  view.add(<Line ref={numLine} points={[[-600, lineY], [600, lineY]]} stroke={COLORS.textDim} lineWidth={2} opacity={0} />);
  yield* numLine().opacity(1, 0.3);

  const dots: Rect[] = [];
  const total = 24;
  for (let i = 0; i < total; i++) {
    const x = -600 + (i / (total - 1)) * 1200;
    const coprime = i % 5 !== 0 && i % 7 !== 0; // mock coprimality
    const d = createRef<Rect>();
    view.add(<Rect ref={d} width={14} height={14} radius={7} x={x} y={lineY} fill={coprime ? COLORS.mint : COLORS.textMuted} opacity={0} />);
    dots.push(d());
  }
  yield* sequence(0.03, ...dots.map(d => d.opacity(1, 0.15)));
  yield* waitFor(0.3);

  // gray out non-coprime
  for (let i = 0; i < total; i++) {
    const coprime = i % 5 !== 0 && i % 7 !== 0;
    if (!coprime) yield* dots[i].opacity(0.2, 0.1);
  }
  yield* waitFor(0.2);

  // endpoint labels
  const oneLabel = createRef<Txt>();
  const nLabel = createRef<Txt>();
  view.add(<Txt ref={oneLabel} text={'1'} fontFamily={FONTS.mono} fontSize={24} fill={COLORS.textDim} x={-630} y={lineY + 30} opacity={0} />);
  view.add(<Txt ref={nLabel} text={'n'} fontFamily={FONTS.mono} fontSize={24} fill={COLORS.textDim} x={625} y={lineY + 30} opacity={0} />);
  yield* all(oneLabel().opacity(1, 0.3), nLabel().opacity(1, 0.3));
  yield* waitFor(0.3);

  // exponent loop slider — e and d as steps that loop mod phi(n)
  const sliderTrack = createRef<Line>();
  view.add(<Line ref={sliderTrack} points={[[-300, 200], [300, 200]]} stroke={COLORS.panelBorder} lineWidth={3} opacity={0} />);
  yield* sliderTrack().opacity(1, 0.3);

  const eMarker = createRef<Rect>();
  const dMarker = createRef<Rect>();
  view.add(<Rect ref={eMarker} width={40} height={40} radius={8} fill={COLORS.amber + '33'} stroke={COLORS.amber} lineWidth={2} x={-300} y={200} opacity={0} />);
  view.add(<Rect ref={dMarker} width={40} height={40} radius={8} fill={COLORS.mint + '33'} stroke={COLORS.mint} lineWidth={2} x={300} y={200} opacity={0} />);

  const eLbl = createRef<Txt>();
  const dLbl = createRef<Txt>();
  eMarker().add(<Txt ref={eLbl} text={'e'} fontFamily={FONTS.monoNerd} fontSize={22} fontWeight={600} fill={COLORS.amber} />);
  dMarker().add(<Txt ref={dLbl} text={'d'} fontFamily={FONTS.monoNerd} fontSize={22} fontWeight={600} fill={COLORS.mint} />);

  yield* all(eMarker().opacity(1, 0.3), dMarker().opacity(1, 0.3));
  yield* waitFor(0.2);

  // loop: e moves right, d moves to meet — exponents wrap mod phi(n)
  yield* all(
    eMarker().x(300, 1.2, easeInOutCubic),
    dMarker().x(-300, 1.2, easeInOutCubic),
  );
  yield* all(
    eMarker().x(-300, 0.3, easeOutCubic),
    dMarker().x(300, 0.3, easeOutCubic),
  );

  const wrapTxt = createRef<Txt>();
  view.add(<Txt ref={wrapTxt} text={'exponents wrap mod φ(n)'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.mint} x={0} y={270} opacity={0} />);
  yield* wrapTxt().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 75, 90);
  yield* capThread;

  yield* all(
    c1().opacity(0, 0.3),
    c2().opacity(0, 0.3),
    l1().opacity(0, 0.3),
    l2().opacity(0, 0.3),
    phiLabel().opacity(0, 0.3),
    numLine().opacity(0, 0.3),
    sliderTrack().opacity(0, 0.3),
    eMarker().opacity(0, 0.3),
    dMarker().opacity(0, 0.3),
    wrapTxt().opacity(0, 0.3),
    tag().opacity(0, 0.3),
    oneLabel().opacity(0, 0.2),
    nLabel().opacity(0, 0.2),
  );
});
