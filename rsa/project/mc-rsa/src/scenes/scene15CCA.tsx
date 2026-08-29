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
import {buildEquation} from '../components/MathBlock';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 15 — Chosen-ciphertext / OAEP (225.0 - 240.0)
// Attacker takes C, multiplies by 2^e → X; decrypter returns 2·M; divide by 2 → M.
// OAEP shield blocks raw ciphertext decryption.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'CHOSEN-CIPHERTEXT ATTACK'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // attacker node
  const attacker = createRef<Rect>();
  view.add(<Rect ref={attacker} width={120} height={80} radius={10} fill={COLORS.coral + '18'} stroke={COLORS.coral} lineWidth={2} x={-620} y={-220} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'} gap={6}>
    <Icon icon={'ph:user-focus-bold'} size={28} color={COLORS.coral} />
    <Txt text={'attacker'} fontFamily={FONTS.mono} fontSize={18} fill={COLORS.coral} />
  </Rect>);
  yield* attacker().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.2);

  // C block
  const cBlock = buildBlock(view, {label: 'C', sub: 'ciphertext', color: COLORS.coral, x: -400, y: -220, size: 90});
  yield* waitFor(0.2);

  // multiply by 2^e → X
  const times2 = createRef<Txt>();
  view.add(<Txt ref={times2} text={'× 2^e'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.amber} x={-250} y={-220} opacity={0} />);
  yield* times2().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.2);

  const xBlock = buildBlock(view, {label: 'X', sub: 'modified', color: COLORS.amber, x: -100, y: -220, size: 90});
  xBlock.block.opacity(0);
  yield* xBlock.block.opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.2);

  // arrow to decrypter
  const arrow1 = createRef<Line>();
  view.add(<Line ref={arrow1} points={[[-50, -220], [120, -220]]} stroke={COLORS.coral} lineWidth={2} opacity={0} endArrow />);
  yield* arrow1().opacity(0.6, 0.3);

  // decrypter
  const decrypter = createRef<Rect>();
  view.add(<Rect ref={decrypter} width={130} height={90} radius={10} fill={COLORS.panelLight} stroke={COLORS.mint} lineWidth={2} x={220} y={-220} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'} gap={6}>
    <Icon icon={'ph:key-bold'} size={28} color={COLORS.mint} />
    <Txt text={'decrypt'} fontFamily={FONTS.mono} fontSize={18} fill={COLORS.mint} />
  </Rect>);
  yield* decrypter().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // returns 2·M
  const arrow2 = createRef<Line>();
  view.add(<Line ref={arrow2} points={[[290, -220], [440, -220]]} stroke={COLORS.mint} lineWidth={2} opacity={0} endArrow />);
  yield* arrow2().opacity(0.6, 0.3);

  const twoM = createRef<Rect>();
  view.add(<Rect ref={twoM} width={120} height={70} radius={10} fill={COLORS.mint + '18'} stroke={COLORS.mint} lineWidth={2} x={520} y={-220} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Txt text={'2·M'} fontFamily={FONTS.monoNerd} fontSize={28} fontWeight={600} fill={COLORS.mint} />
  </Rect>);
  yield* twoM().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // divide by 2 → M
  const divTxt = createRef<Txt>();
  view.add(<Txt ref={divTxt} text={'÷ 2'} fontFamily={FONTS.monoNerd} fontSize={28} fill={COLORS.coral} x={520} y={-120} opacity={0} />);
  yield* divTxt().opacity(1, 0.3);

  const mStolen = buildBlock(view, {label: 'M', sub: 'stolen', color: COLORS.coral, x: 520, y: -40, size: 90});
  mStolen.block.opacity(0);
  yield* mStolen.block.opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // OAEP shield blocks the attack
  const oaepShield = createRef<Rect>();
  view.add(<Rect ref={oaepShield} width={500} height={140} radius={14} fill={COLORS.mint + '15'} stroke={COLORS.mint} lineWidth={3} x={0} y={180} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'} gap={12}>
    <Icon icon={'ph:shield-check-bold'} size={48} color={COLORS.mint} />
    <Txt text={'OAEP padding blocks raw decryption'} fontFamily={FONTS.monoNerd} fontSize={26} fontWeight={600} fill={COLORS.mint} />
  </Rect>);
  yield* oaepShield().opacity(1, 0.4, easeOutCubic);

  // cross out the attack chain
  const crossLine = createRef<Line>();
  view.add(<Line ref={crossLine} points={[[-600, -300], [580, -80]]} stroke={COLORS.coral} lineWidth={4} opacity={0} lineDash={[16, 12]} />);
  yield* crossLine().opacity(0.7, 0.4, easeOutCubic);

  const capThread = runCaptions(cap, 225, 240);
  yield* capThread;

  yield* all(
    attacker().opacity(0, 0.3),
    cBlock.block.opacity(0, 0.3),
    times2().opacity(0, 0.3),
    xBlock.block.opacity(0, 0.3),
    arrow1().opacity(0, 0.2),
    decrypter().opacity(0, 0.3),
    arrow2().opacity(0, 0.2),
    twoM().opacity(0, 0.3),
    divTxt().opacity(0, 0.3),
    mStolen.block.opacity(0, 0.3),
    oaepShield().opacity(0, 0.3),
    crossLine().opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
