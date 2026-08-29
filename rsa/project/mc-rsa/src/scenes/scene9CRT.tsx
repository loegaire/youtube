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
import {buildBlock} from '../components/AppWindow';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 9 — CRT intro (120.0 - 140.0)
// C flows into two parallel branches: mod p → C_p, mod q → C_q.
// Each branch smaller → ~4x speedup. Pipeline emphasizes smaller numbers.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'CRT DECRYPTION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // C block at top center
  const cBlock = buildBlock(view, {label: 'C', sub: 'ciphertext', color: COLORS.coral, x: 0, y: -300, size: 110});
  yield* waitFor(0.3);

  // split arrows to two branches
  const arrowP = createRef<Line>();
  const arrowQ = createRef<Line>();
  view.add(<Line ref={arrowP} points={[[-30, -230], [-280, -130], [-360, -60]]} stroke={COLORS.mint} lineWidth={2.5} opacity={0} endArrow />);
  view.add(<Line ref={arrowQ} points={[[30, -230], [280, -130], [360, -60]]} stroke={COLORS.mintDeep} lineWidth={2.5} opacity={0} endArrow />);
  yield* all(arrowP().opacity(0.6, 0.3), arrowQ().opacity(0.6, 0.3));
  yield* waitFor(0.2);

  // mod p module
  const modP = createRef<Rect>();
  view.add(<Rect ref={modP} width={200} height={80} radius={10} fill={COLORS.mint + '18'} stroke={COLORS.mint} lineWidth={2} x={-360} y={-10} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'}>
    <Txt text={'mod p'} fontFamily={FONTS.monoNerd} fontSize={28} fontWeight={600} fill={COLORS.mint} />
    <Txt text={'C^d mod p'} fontFamily={FONTS.mono} fontSize={18} fill={COLORS.textDim} />
  </Rect>);
  yield* modP().opacity(1, 0.3, easeOutCubic);

  const modQ = createRef<Rect>();
  view.add(<Rect ref={modQ} width={200} height={80} radius={10} fill={COLORS.mintDeep + '18'} stroke={COLORS.mintDeep} lineWidth={2} x={360} y={-10} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'}>
    <Txt text={'mod q'} fontFamily={FONTS.monoNerd} fontSize={28} fontWeight={600} fill={COLORS.mintDeep} />
    <Txt text={'C^d mod q'} fontFamily={FONTS.mono} fontSize={18} fill={COLORS.textDim} />
  </Rect>);
  yield* modQ().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // arrows down to results
  const arrowP2 = createRef<Line>();
  const arrowQ2 = createRef<Line>();
  view.add(<Line ref={arrowP2} points={[[-360, 40], [-360, 120]]} stroke={COLORS.mint} lineWidth={2} opacity={0} endArrow />);
  view.add(<Line ref={arrowQ2} points={[[360, 40], [360, 120]]} stroke={COLORS.mintDeep} lineWidth={2} opacity={0} endArrow />);
  yield* all(arrowP2().opacity(0.6, 0.3), arrowQ2().opacity(0.6, 0.3));

  // result blocks Cp, Cq
  const cp = buildBlock(view, {label: 'C_p', sub: 'mod p', color: COLORS.mint, x: -360, y: 200, size: 100});
  const cq = buildBlock(view, {label: 'C_q', sub: 'mod q', color: COLORS.mintDeep, x: 360, y: 200, size: 100});
  cp.block.opacity(0);
  cq.block.opacity(0);
  cp.block.scale(0.5);
  cq.block.scale(0.5);
  yield* all(cp.block.opacity(1, 0.3), cq.block.opacity(1, 0.3), cp.block.scale(1, 0.3, easeOutCubic), cq.block.scale(1, 0.3, easeOutCubic));
  yield* waitFor(0.3);

  // speedup callout
  const speedup = createRef<Txt>();
  view.add(<Txt ref={speedup} text={'≈ 4× faster  (half-size exponents)'} fontFamily={FONTS.monoNerd} fontSize={30} fill={COLORS.mint} x={0} y={340} opacity={0} />);
  yield* speedup().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 120, 140);
  yield* capThread;

  yield* all(
    cBlock.block.opacity(0, 0.3),
    arrowP().opacity(0, 0.2),
    arrowQ().opacity(0, 0.2),
    modP().opacity(0, 0.3),
    modQ().opacity(0, 0.3),
    arrowP2().opacity(0, 0.2),
    arrowQ2().opacity(0, 0.2),
    cp.block.opacity(0, 0.3),
    cq.block.opacity(0, 0.3),
    speedup().opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
