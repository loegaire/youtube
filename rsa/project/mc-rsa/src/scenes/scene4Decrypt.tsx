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
import {buildBlock, buildAppWindow} from '../components/AppWindow';
import {buildEquation} from '../components/MathBlock';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 4 — Decryption (45.0 - 60.0)
// C raised to d → mod n gate → M restored → transforms back to readable text.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'DECRYPTION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // C block enters from left
  const cBlock = buildBlock(view, {label: 'C', sub: 'ciphertext', color: COLORS.coral, x: -480, y: -160, size: 120});
  cBlock.block.x(-800);
  cBlock.block.opacity(0);
  yield* all(cBlock.block.x(-480, 0.6, easeOutCubic), cBlock.block.opacity(1, 0.4));
  yield* waitFor(0.3);

  // equation M = C^d mod n
  const eq = buildEquation(view, {text: 'M = C^d mod n', x: 0, y: -160, color: COLORS.mint, size: 42});
  eq.node.opacity(0);
  yield* eq.node.opacity(1, 0.4, easeOutCubic);
  yield* waitFor(0.3);

  // stack of C blocks (C^d)
  const stackParent = createRef<Rect>();
  view.add(<Rect ref={stackParent} x={-200} y={100} />);
  const stack: Rect[] = [];
  for (let i = 0; i < 6; i++) {
    const r = createRef<Rect>();
    stackParent().add(
      <Rect ref={r} width={90} height={34} radius={6} fill={COLORS.coral + '22'} stroke={COLORS.coral} lineWidth={1.5} y={-i * 40} opacity={0}>
        <Txt text={'C'} fontFamily={FONTS.monoNerd} fontSize={20} fontWeight={600} fill={COLORS.coral} />
      </Rect>,
    );
    stack.push(r());
  }
  yield* sequence(0.1, ...stack.map(s => all(s.opacity(1, 0.2), s.y(s.y() + 6, 0.25, easeOutCubic))));
  yield* waitFor(0.3);

  // mod n gate
  const gate = createRef<Rect>();
  view.add(
    <Rect ref={gate} width={130} height={280} radius={8} fill={`${COLORS.mint}1a`} stroke={COLORS.mint} lineWidth={2} lineDash={[10, 8]} x={50} y={0} opacity={0}>
      <Txt text={'mod n'} fontFamily={FONTS.monoNerd} fontSize={22} fill={COLORS.mint} y={-140} />
    </Rect>,
  );
  yield* gate().opacity(0.7, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // trim stack
  yield* all(...stack.slice(1).map(s => all(s.opacity(0, 0.25), s.scale(0.5, 0.25))));

  // M restored
  const mBlock = buildBlock(view, {label: 'M', sub: 'recovered', color: COLORS.mint, x: 300, y: 0, size: 130});
  mBlock.block.opacity(0);
  mBlock.block.scale(0.4);
  yield* all(mBlock.block.opacity(1, 0.4), mBlock.block.scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // arrow to message window
  const arrow = createRef<Line>();
  view.add(<Line ref={arrow} points={[[380, 0], [500, 0]]} stroke={COLORS.mint} lineWidth={2} opacity={0} endArrow />);
  yield* arrow().opacity(0.6, 0.3);

  // M transforms into readable text — message window
  const msgWin = buildAppWindow(view, {title: 'decrypted', icon: 'ph:envelope-open-bold', width: 360, height: 140, x: 680, y: 0, accent: COLORS.mint});
  msgWin.card.opacity(0);
  msgWin.card.x(900);
  const outTxt = createRef<Txt>();
  msgWin.body.add(<Txt ref={outTxt} text={'"HELLO"'} fontFamily={FONTS.monoNerd} fontSize={32} fontWeight={600} fill={COLORS.mint} opacity={0} />);
  yield* all(msgWin.card.opacity(1, 0.4), msgWin.card.x(680, 0.5, easeOutCubic));
  yield* outTxt().opacity(1, 0.4, easeOutCubic);

  const capThread = runCaptions(cap, 45, 60);
  yield* capThread;

  yield* all(
    cBlock.block.opacity(0, 0.3),
    eq.node.opacity(0, 0.3),
    stackParent().opacity(0, 0.3),
    gate().opacity(0, 0.3),
    mBlock.block.opacity(0, 0.3),
    arrow().opacity(0, 0.2),
    msgWin.card.opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
