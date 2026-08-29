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

// Scene 10 — Garner recombination (140.0 - 160.0)
// C_p and C_q feed into formula box; steps light up in sequence:
// difference → multiply by inverse → multiply by q → add C_q → M.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'GARNER RECOMBINATION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // C_p and C_q input blocks
  const cp = createRef<Rect>();
  const cq = createRef<Rect>();
  view.add(<Rect ref={cp} width={100} height={70} radius={10} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={2} x={-400} y={-280} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'C_p'} fontFamily={FONTS.monoNerd} fontSize={26} fontWeight={600} fill={COLORS.mint} />
  </Rect>);
  view.add(<Rect ref={cq} width={100} height={70} radius={10} fill={COLORS.mintDeep + '22'} stroke={COLORS.mintDeep} lineWidth={2} x={400} y={-280} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'C_q'} fontFamily={FONTS.monoNerd} fontSize={26} fontWeight={600} fill={COLORS.mintDeep} />
  </Rect>);
  yield* all(cp().opacity(1, 0.3), cq().opacity(1, 0.3));
  yield* waitFor(0.2);

  // arrows into formula box
  const a1 = createRef<Line>();
  const a2 = createRef<Line>();
  view.add(<Line ref={a1} points={[[-350, -260], [-180, -160]]} stroke={COLORS.mint} lineWidth={2} opacity={0} endArrow />);
  view.add(<Line ref={a2} points={[[350, -260], [180, -160]]} stroke={COLORS.mintDeep} lineWidth={2} opacity={0} endArrow />);
  yield* all(a1().opacity(0.5, 0.3), a2().opacity(0.5, 0.3));

  // formula box
  const formulaBox = createRef<Rect>();
  view.add(<Rect ref={formulaBox} width={640} height={90} radius={12} fill={COLORS.panel} stroke={COLORS.panelBorder} lineWidth={2} x={0} y={-110} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'M = C_q + q·((C_p − C_q)·q⁻¹ mod p)'} fontFamily={FONTS.monoNerd} fontSize={28} fontWeight={600} fill={COLORS.text} />
  </Rect>);
  yield* formulaBox().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // step chips light up in sequence
  const steps = [
    {label: '(C_p − C_q)', color: COLORS.amber},
    {label: '× q⁻¹ mod p', color: COLORS.amber},
    {label: '× q', color: COLORS.amber},
    {label: '+ C_q', color: COLORS.mint},
  ];
  const stepChips: Rect[] = [];
  const startX = -390;
  for (let i = 0; i < steps.length; i++) {
    const x = startX + i * 210;
    const c = createRef<Rect>();
    view.add(<Rect ref={c} width={180} height={56} radius={10} fill={steps[i].color + '18'} stroke={steps[i].color} lineWidth={2} x={x} y={60} opacity={0} scale={0.7} alignItems={'center'} justifyContent={'center'}>
      <Txt text={steps[i].label} fontFamily={FONTS.monoNerd} fontSize={22} fontWeight={600} fill={steps[i].color} />
    </Rect>);
    stepChips.push(c());
  }

  // cascade step lights
  for (const chip of stepChips) {
    yield* all(chip.opacity(1, 0.2), chip.scale(1, 0.25, easeOutCubic));
    yield* waitFor(0.15);
  }
  yield* waitFor(0.2);

  // arrow to M
  const mArrow = createRef<Line>();
  view.add(<Line ref={mArrow} points={[[0, 100], [0, 200]]} stroke={COLORS.mint} lineWidth={2.5} opacity={0} endArrow />);
  yield* mArrow().opacity(0.6, 0.3);

  // M result block
  const mBlock = createRef<Rect>();
  view.add(<Rect ref={mBlock} width={140} height={90} radius={12} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={2.5} x={0} y={270} opacity={0} scale={0.5} alignItems={'center'} justifyContent={'center'} direction={'column'}>
    <Txt text={'M'} fontFamily={FONTS.monoNerd} fontSize={40} fontWeight={700} fill={COLORS.mint} />
    <Txt text={'recovered'} fontFamily={FONTS.mono} fontSize={16} fill={COLORS.textDim} />
  </Rect>);
  yield* all(mBlock().opacity(1, 0.3), mBlock().scale(1, 0.3, easeOutCubic));

  const capThread = runCaptions(cap, 140, 160);
  yield* capThread;

  yield* all(
    cp().opacity(0, 0.3),
    cq().opacity(0, 0.3),
    a1().opacity(0, 0.2),
    a2().opacity(0, 0.2),
    formulaBox().opacity(0, 0.3),
    mArrow().opacity(0, 0.2),
    mBlock().opacity(0, 0.3),
    tag().opacity(0, 0.3),
    ...stepChips.map(c => c.opacity(0, 0.3)),
  );
});
