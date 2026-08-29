import {makeScene2D, Rect, Txt, Line, Icon} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  waitFor,
  easeOutCubic,
  easeInOutCubic,
  sequence,
  Vector2,
} from '@motion-canvas/core';
import {COLORS, FONTS, SIZES} from '../components/tokens';
import {buildBlock, buildAppWindow} from '../components/AppWindow';
import {buildEquation} from '../components/MathBlock';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 3 — Encryption (30.0 - 45.0)
// M block → stack of M (M^e) → mod n gate trims → C ciphertext.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'ENCRYPTION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // Message composer app window on the left
  const composer = buildAppWindow(view, {
    title: 'message',
    icon: 'ph:envelope-simple-bold',
    width: 380,
    height: 180,
    x: -560,
    y: -200,
    accent: COLORS.text,
  });
  const msgTxt = createRef<Txt>();
  composer.body.add(
    <Txt ref={msgTxt} text={'"HELLO"'} fontFamily={FONTS.monoNerd} fontSize={32} fontWeight={600} fill={COLORS.text} />,
  );

  // M block
  const mBlock = buildBlock(view, {label: 'M', sub: 'message', color: COLORS.text, x: -200, y: -200, size: 120});
  yield* waitFor(0.3);

  // arrow from composer to M
  const arrow1 = createRef<Line>();
  view.add(<Line ref={arrow1} points={[[-380, -200], [-280, -200]]} stroke={COLORS.textDim} lineWidth={2} opacity={0} endArrow />);
  yield* arrow1().opacity(0.5, 0.3);

  yield* waitFor(0.4);

  // equation C = M^e mod n
  const eq = buildEquation(view, {text: 'C = M^e mod n', x: 0, y: -200, color: COLORS.amber, size: 42});
  eq.node.opacity(0);
  yield* eq.node.opacity(1, 0.4, easeOutCubic);

  yield* waitFor(0.3);

  // stack of M blocks representing M^e (duplicating M)
  const stackParent = createRef<Rect>();
  view.add(<Rect ref={stackParent} x={200} y={80} />);
  const stack: Rect[] = [];
  for (let i = 0; i < 5; i++) {
    const r = createRef<Rect>();
    stackParent().add(
      <Rect
        ref={r}
        width={90}
        height={36}
        radius={6}
        fill={COLORS.text + '22'}
        stroke={COLORS.text}
        lineWidth={1.5}
        y={-i * 42}
        opacity={0}
      >
        <Txt text={'M'} fontFamily={FONTS.monoNerd} fontSize={22} fontWeight={600} fill={COLORS.text} />
      </Rect>,
    );
    stack.push(r());
  }

  // cascade the stack in
  yield* sequence(
    0.12,
    ...stack.map(s => all(s.opacity(1, 0.2), s.y(s.y() + 8, 0.3, easeOutCubic))),
  );

  yield* waitFor(0.3);

  // "mod n" gate — a translucent grid that slides over the stack
  const gate = createRef<Rect>();
  view.add(
    <Rect
      ref={gate}
      width={140}
      height={260}
      radius={8}
      fill={`${COLORS.coral}1a`}
      stroke={COLORS.coral}
      lineWidth={2}
      lineDash={[10, 8]}
      x={200}
      y={-20}
      opacity={0}
    >
      <Txt text={'mod n'} fontFamily={FONTS.monoNerd} fontSize={22} fill={COLORS.coral} y={-130} />
    </Rect>,
  );
  yield* gate().opacity(0.7, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // trim the stack down — remove top blocks
  yield* all(
    ...stack.slice(1).map(s => all(s.opacity(0, 0.25), s.scale(0.5, 0.25))),
  );

  // C ciphertext block emerges
  const cBlock = buildBlock(view, {label: 'C', sub: 'ciphertext', color: COLORS.coral, x: 480, y: 80, size: 130});
  cBlock.block.opacity(0);
  cBlock.block.scale(0.4);
  yield* all(cBlock.block.opacity(1, 0.4), cBlock.block.scale(1, 0.4, easeOutCubic));

  // arrow from gate to C
  const arrow2 = createRef<Line>();
  view.add(<Line ref={arrow2} points={[[280, 80], [400, 80]]} stroke={COLORS.coral} lineWidth={2} opacity={0} endArrow />);
  yield* arrow2().opacity(0.6, 0.3);

  const capThread = runCaptions(cap, 30, 45);
  yield* capThread;

  yield* all(
    composer.card.opacity(0, 0.3),
    mBlock.block.opacity(0, 0.3),
    eq.node.opacity(0, 0.3),
    stackParent().opacity(0, 0.3),
    gate().opacity(0, 0.3),
    cBlock.block.opacity(0, 0.3),
    arrow1().opacity(0, 0.2),
    arrow2().opacity(0, 0.2),
    tag().opacity(0, 0.3),
  );
});
