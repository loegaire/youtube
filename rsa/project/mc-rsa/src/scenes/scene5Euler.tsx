import {makeScene2D, Rect, Txt, Line, Circle} from '@motion-canvas/2d';
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
import {buildEquation} from '../components/MathBlock';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 5 — Euler's Theorem (60.0 - 75.0)
// Circular cycle of powers mod 7: marker walks 5→4→6→2→3→1 (5^6 ≡ 1 mod 7).
// Then connect to RSA: M^e then M^d wraps back.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'EULER\'S THEOREM'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // Circle of numbers 1..6 (mod 7 group)
  const cx = -300;
  const cy = -20;
  const radius = 180;
  const nums = [1, 2, 3, 4, 5, 6];
  const positions = nums.map((_, i) => {
    const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius] as [number, number];
  });

  const ring = createRef<Circle>();
  view.add(<Circle ref={ring} x={cx} y={cy} size={radius * 2} stroke={COLORS.panelBorder} lineWidth={1.5} opacity={0} />);
  yield* ring().opacity(1, 0.4, easeOutCubic);

  // number nodes
  const numNodes: Txt[] = [];
  for (let i = 0; i < nums.length; i++) {
    const t = createRef<Txt>();
    view.add(
      <Rect width={52} height={52} radius={26} fill={COLORS.panelLight} stroke={COLORS.textDim} lineWidth={1.5} x={positions[i][0]} y={positions[i][1]} alignItems={'center'} justifyContent={'center'}>
        <Txt ref={t} text={String(nums[i])} fontFamily={FONTS.monoNerd} fontSize={26} fontWeight={600} fill={COLORS.text} />
      </Rect>,
    );
    numNodes.push(t());
  }

  // marker dot that walks the cycle
  const marker = createRef<Circle>();
  view.add(<Circle ref={marker} size={20} fill={COLORS.amber} x={positions[4][0]} y={positions[4][1]} opacity={0} stroke={COLORS.amberDeep} lineWidth={3} />);
  yield* marker().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  // powers of 5 mod 7: 5^1=5, 5^2=4, 5^3=6, 5^4=2, 5^5=3, 5^6=1
  const cycle = [5, 4, 6, 2, 3, 1];
  const powerLabel = createRef<Txt>();
  view.add(<Txt ref={powerLabel} text={'5^1 ≡ 5'} fontFamily={FONTS.monoNerd} fontSize={30} fill={COLORS.amber} x={cx} y={cy - 260} opacity={0} />);

  for (let i = 0; i < cycle.length; i++) {
    const idx = nums.indexOf(cycle[i]);
    powerLabel().text(`5^${i + 1} ≡ ${cycle[i]}`);
    yield* powerLabel().opacity(1, 0.15, easeOutCubic);
    yield* all(
      marker().x(positions[idx][0], 0.4, easeInOutCubic),
      marker().y(positions[idx][1], 0.4, easeInOutCubic),
    );
    // highlight the node briefly
    yield* numNodes[idx].fill(COLORS.amber, 0.15);
    yield* waitFor(0.1);
    if (i < cycle.length - 1) yield* powerLabel().opacity(0.4, 0.1);
  }

  // "5^6 ≡ 1 (mod 7)" conclusion
  const conclusion = buildEquation(view, {text: '5^6 ≡ 1 (mod 7)', x: cx, y: cy + 250, color: COLORS.mint, size: 34});
  conclusion.node.opacity(0);
  yield* conclusion.node.opacity(1, 0.4, easeOutCubic);
  yield* waitFor(0.3);

  // RSA connection on the right
  const rsaEq1 = buildEquation(view, {text: 'M^{e·d} = M^{1+k·φ(n)}', x: 420, y: -100, color: COLORS.mint, size: 34});
  const rsaEq2 = buildEquation(view, {text: '≡ M (mod n)', x: 420, y: -30, color: COLORS.mint, size: 34});
  rsaEq1.node.opacity(0);
  rsaEq2.node.opacity(0);

  // connector from ring to RSA side
  const conn = createRef<Line>();
  view.add(<Line ref={conn} points={[[-80, -20], [180, -60]]} stroke={COLORS.mint} lineWidth={2} opacity={0} endArrow />);
  yield* all(conn().opacity(0.4, 0.3), rsaEq1.node.opacity(1, 0.4), rsaEq2.node.opacity(1, 0.4));
  yield* waitFor(0.3);

  const capThread = runCaptions(cap, 60, 75);
  yield* capThread;

  yield* all(
    ring().opacity(0, 0.3),
    marker().opacity(0, 0.3),
    powerLabel().opacity(0, 0.3),
    conclusion.node.opacity(0, 0.3),
    rsaEq1.node.opacity(0, 0.3),
    rsaEq2.node.opacity(0, 0.3),
    conn().opacity(0, 0.2),
    tag().opacity(0, 0.3),
  );
});
