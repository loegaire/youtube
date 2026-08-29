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
import {buildTerminal, typeLine, flashOutput} from '../components/Terminal';
import {buildCaptionRail, runCaptions} from '../components/CaptionOverlay';

// Scene 12 — Key size security (175.0 - 190.0)
// Bar scale of bit lengths: 512 red/shattered, 1024 yellow/cracked, 2048+ green/locked.
// A "crusher" fails to break the large n block.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'KEY SIZE & SECURITY'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  // terminal showing checksec-style key inspection
  const term = buildTerminal(view, {title: 'key-inspect.sh', x: -480, y: -60, width: 560, height: 360});
  yield* waitFor(0.2);
  yield* typeLine(term.lines, '$ openssl rsa -in key.pem -text -noout', 0.015);
  yield* waitFor(0.2);
  yield* typeLine(term.lines, 'Private-Key: (2048 bit, 2 primes)', 0.015);
  yield* waitFor(0.2);
  yield* typeLine(term.lines, 'modulus:', 0.01);
  yield* typeLine(term.lines, '  00:b3:7d:...:a1:f3  (2048 bits)', 0.012);
  yield* waitFor(0.3);
  yield* flashOutput(term.output, '✓ 2048-bit secure', COLORS.mint);
  yield* waitFor(0.3);

  // bit-length bar scale on the right
  const bars = [
    {label: '512-bit', w: 120, color: COLORS.coral, state: 'shattered'},
    {label: '1024-bit', w: 180, color: COLORS.amber, state: 'cracked'},
    {label: '2048-bit', w: 260, color: COLORS.mint, state: 'locked'},
    {label: '4096-bit', w: 340, color: COLORS.mint, state: 'locked'},
  ];

  const barRefs: Rect[] = [];
  const labelRefs: Txt[] = [];
  for (let i = 0; i < bars.length; i++) {
    const y = -160 + i * 90;
    const b = createRef<Rect>();
    view.add(<Rect ref={b} width={bars[i].w} height={50} radius={8} fill={bars[i].color + '22'} stroke={bars[i].color} lineWidth={2} x={120} y={y} opacity={0} alignItems={'center'} justifyContent={'center'}>
      <Txt text={bars[i].label} fontFamily={FONTS.monoNerd} fontSize={22} fontWeight={600} fill={bars[i].color} />
    </Rect>);
    barRefs.push(b());

    const st = createRef<Txt>();
    view.add(<Txt ref={st} text={bars[i].state} fontFamily={FONTS.mono} fontSize={20} fill={bars[i].color} x={360} y={y} opacity={0} />);
    labelRefs.push(st());
  }

  yield* sequence(0.15, ...barRefs.map((b, i) => all(b.opacity(1, 0.2), labelRefs[i].opacity(1, 0.2))));
  yield* waitFor(0.3);

  // crusher icon fails on the 2048 block
  const crusher = createRef<Rect>();
  view.add(<Rect ref={crusher} width={60} height={60} radius={8} fill={COLORS.coral + '22'} stroke={COLORS.coral} lineWidth={2} x={-100} y={10} opacity={0} alignItems={'center'} justifyContent={'center'}>
    <Icon icon={'ph:hammer-bold'} size={32} color={COLORS.coral} />
  </Rect>);
  yield* crusher().opacity(1, 0.3);

  // crusher lunges at 2048 bar and bounces back (fails)
  yield* crusher().x(60, 0.3, easeInOutCubic);
  yield* all(crusher().x(-100, 0.4, easeOutCubic), crusher().rotation(-15, 0.3));
  yield* crusher().rotation(0, 0.2, easeOutCubic);

  // n block stands strong
  const nStrong = createRef<Rect>();
  view.add(<Rect ref={nStrong} width={100} height={100} radius={12} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={3} x={250} y={200} opacity={0} alignItems={'center'} justifyContent={'center'} direction={'column'}>
    <Txt text={'n'} fontFamily={FONTS.monoNerd} fontSize={44} fontWeight={700} fill={COLORS.mint} />
    <Icon icon={'ph:lock-bold'} size={24} color={COLORS.mint} />
  </Rect>);
  yield* nStrong().opacity(1, 0.3, easeOutCubic);

  const capThread = runCaptions(cap, 175, 190);
  yield* capThread;

  yield* all(
    term.body.opacity(0, 0.3),
    crusher().opacity(0, 0.3),
    nStrong().opacity(0, 0.3),
    tag().opacity(0, 0.3),
    ...barRefs.map(b => b.opacity(0, 0.3)),
    ...labelRefs.map(l => l.opacity(0, 0.3)),
  );
});
