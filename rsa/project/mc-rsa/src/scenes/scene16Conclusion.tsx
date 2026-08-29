import {makeScene2D, Rect, Txt, Line, Icon, Circle} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  waitFor,
  easeOutCubic,
  easeInOutCubic,
  sequence,
  range,
} from '@motion-canvas/core';
import {COLORS, FONTS, SIZES} from '../components/tokens';
import {buildCaptionRail, runCaptions, fadeCaption} from '../components/CaptionOverlay';

// Scene 16 — Conclusion (240.0 - 250.0)
// Number blocks form a secure vault / lock; RSA name with checkmark.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'CONCLUSION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // swirling number-blocks converge into a vault lock
  const blockParent = createRef<Rect>();
  view.add(<Rect ref={blockParent} x={0} y={-80} />);

  const blocks: Rect[] = [];
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const dist = 400;
    const x = Math.cos(ang) * dist;
    const y = Math.sin(ang) * dist;
    const b = createRef<Rect>();
    const letters = ['p', 'q', 'n', 'e', 'd', 'φ', 'C', 'M'];
    blockParent().add(
      <Rect
        ref={b}
        width={64}
        height={64}
        radius={10}
        fill={COLORS.mint + '22'}
        stroke={COLORS.mint}
        lineWidth={2}
        x={x}
        y={y}
        opacity={0}
        scale={0.5}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Txt text={letters[i]} fontFamily={FONTS.monoNerd} fontSize={28} fontWeight={600} fill={COLORS.mint} />
      </Rect>,
    );
    blocks.push(b());
  }

  // cascade in from the outside
  yield* sequence(0.06, ...blocks.map(b => all(b.opacity(1, 0.2), b.scale(1, 0.3, easeOutCubic))));
  yield* waitFor(0.2);

  // converge to center (form the vault)
  yield* all(...blocks.map(b => all(b.x(b.x() * 0.15, 0.8, easeInOutCubic), b.y(b.y() * 0.15, 0.8, easeInOutCubic), b.scale(0.7, 0.8))));
  yield* waitFor(0.3);

  // lock icon appears at center
  const lock = createRef<Rect>();
  view.add(<Rect ref={lock} width={120} height={120} radius={20} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={3} x={0} y={-80} opacity={0} scale={0.5} alignItems={'center'} justifyContent={'center'}>
    <Icon icon={'ph:lock-key-bold'} size={64} color={COLORS.mint} />
  </Rect>);
  yield* all(lock().opacity(1, 0.4), lock().scale(1, 0.4, easeOutCubic));

  // fade the converging blocks behind the lock
  yield* all(...blocks.map(b => b.opacity(0.2, 0.4)));
  yield* waitFor(0.3);

  // RSA title with checkmark
  const rsaTitle = createRef<Txt>();
  view.add(<Txt ref={rsaTitle} text={'RSA'} fontFamily={FONTS.monoNerd} fontSize={120} fontWeight={700} fill={COLORS.mint} x={0} y={160} opacity={0} scale={0.6} />);
  yield* all(rsaTitle().opacity(1, 0.4), rsaTitle().scale(1, 0.4, easeOutCubic));

  const check = createRef<Icon>();
  view.add(<Icon ref={check} icon={'ph:check-circle-bold'} size={48} color={COLORS.mint} x={130} y={160} opacity={0} />);
  yield* check().opacity(1, 0.3, easeOutCubic);

  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'secure encryption'} fontFamily={FONTS.mono} fontSize={28} fill={COLORS.textDim} x={0} y={250} opacity={0} letterSpacing={3} />);
  yield* subtitle().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 240, 250);
  yield* capThread;

  // final clean hold then fade
  yield* waitFor(0.3);
  yield* all(
    rsaTitle().opacity(0, 0.5),
    check().opacity(0, 0.5),
    subtitle().opacity(0, 0.5),
    lock().opacity(0, 0.5),
    tag().opacity(0, 0.3),
    ...blocks.map(b => b.opacity(0, 0.5)),
  );
});
