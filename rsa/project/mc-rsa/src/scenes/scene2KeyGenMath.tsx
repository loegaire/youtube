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
import {buildBlock, buildChip} from '../components/AppWindow';
import {buildEquation} from '../components/MathBlock';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 2 — Key Generation math (15.0 - 30.0)
// p, q merge into n; p-1, q-1 form phi(n); e chosen; d = modular inverse.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);

  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(
    <Txt ref={tag} text={'KEY GENERATION / MATH'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />,
  );

  // p and q appear
  const p = buildBlock(view, {label: 'p', color: COLORS.mint, x: -320, y: -280});
  const q = buildBlock(view, {label: 'q', color: COLORS.mint, x: 320, y: -280});
  p.block.opacity(0);
  q.block.opacity(0);
  yield* all(p.block.opacity(1, 0.4), q.block.opacity(1, 0.4));

  yield* waitFor(0.3);

  // n = p × q equation
  const eqN = buildEquation(view, {text: 'n = p × q', x: 0, y: -130, color: COLORS.amber, size: 44});
  eqN.node.opacity(0);
  yield* eqN.node.opacity(1, 0.4, easeOutCubic);
  yield* waitFor(0.5);

  // p-1 and q-1 shrink copies
  const pm1 = buildBlock(view, {label: 'p−1', size: 90, color: COLORS.mintDeep, x: -320, y: -10});
  const qm1 = buildBlock(view, {label: 'q−1', size: 90, color: COLORS.mintDeep, x: 320, y: -10});
  pm1.block.opacity(0);
  qm1.block.opacity(0);
  pm1.block.scale(0.5);
  qm1.block.scale(0.5);
  yield* all(
    chain(pm1.block.opacity(1, 0.3), pm1.block.scale(1, 0.4, easeOutCubic)),
    chain(qm1.block.opacity(1, 0.3), qm1.block.scale(1, 0.4, easeOutCubic)),
  );

  // phi(n) = (p-1)(q-1)
  const eqPhi = buildEquation(view, {text: 'φ(n) = (p−1)(q−1)', x: 0, y: -10, color: COLORS.mint, size: 40});
  eqPhi.node.opacity(0);
  yield* all(eqPhi.node.opacity(1, 0.4, easeOutCubic), pm1.block.opacity(0.3, 0.3), qm1.block.opacity(0.3, 0.3));
  yield* waitFor(0.6);

  // e drops in and "bounces" (gcd check)
  const eBlock = buildBlock(view, {label: 'e', size: 90, color: COLORS.amber, x: -200, y: 150});
  eBlock.block.opacity(0);
  eBlock.block.y(320);
  yield* all(eBlock.block.opacity(1, 0.3), eBlock.block.y(150, 0.5, easeOutCubic));

  // bounce to represent gcd(e, phi)=1 search
  yield* eBlock.block.x(-160, 0.2, easeInOutCubic);
  yield* eBlock.block.x(-240, 0.2, easeInOutCubic);
  yield* eBlock.block.x(-200, 0.15, easeOutCubic);

  const gcdTxt = createRef<Txt>();
  view.add(<Txt ref={gcdTxt} text={'gcd(e, φ(n)) = 1'} fontFamily={FONTS.monoNerd} fontSize={30} fill={COLORS.mint} x={120} y={150} opacity={0} />);
  yield* gcdTxt().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // d = modular inverse — arc from e and phi to d
  const arc = createRef<Line>();
  view.add(
    <Line ref={arc} points={[[-160, 150], [0, 230], [200, 150]]} stroke={COLORS.coral} lineWidth={2} opacity={0} endArrow />,
  );
  yield* arc().opacity(0.6, 0.3);

  const dBlock = buildBlock(view, {label: 'd', size: 100, color: COLORS.coral, x: 280, y: 150});
  dBlock.block.opacity(0);
  dBlock.block.scale(0.4);
  yield* all(dBlock.block.opacity(1, 0.3), dBlock.block.scale(1, 0.4, easeOutCubic));

  const eqD = buildEquation(view, {text: 'e·d ≡ 1 (mod φ(n))', x: 40, y: 270, color: COLORS.coral, size: 34});
  eqD.node.opacity(0);
  yield* eqD.node.opacity(1, 0.4, easeOutCubic);

  const capThread = runCaptions(cap, 15, 30);
  yield* capThread;

  yield* all(
    eqN.node.opacity(0, 0.3),
    eqPhi.node.opacity(0, 0.3),
    eqD.node.opacity(0, 0.3),
    p.block.opacity(0, 0.3),
    q.block.opacity(0, 0.3),
    pm1.block.opacity(0, 0.3),
    qm1.block.opacity(0, 0.3),
    eBlock.block.opacity(0, 0.3),
    dBlock.block.opacity(0, 0.3),
    gcdTxt().opacity(0, 0.3),
    arc().opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
