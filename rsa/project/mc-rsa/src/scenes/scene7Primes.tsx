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

// Scene 7 — Prime generation (90.0 - 105.0)
// Terminal scrolls candidate large numbers; primality test strikes out composites
// with an X; two finally glow "PRIME". Progress bar emphasizes many trials.
export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  const cap = buildCaptionRail(view);

  const tag = createRef<Txt>();
  view.add(<Txt ref={tag} text={'PRIME GENERATION'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textMuted} letterSpacing={4} y={-430} />);

  const term = buildTerminal(view, {title: 'prime-search.py', x: -280, y: -40, width: 720, height: 420});
  yield* waitFor(0.3);

  // candidates — large-ish numbers (mock, labeled honestly as illustration)
  const candidates = [
    '6074001000...8391',
    '6074001000...8393',
    '6074001000...8397',
    '6074001000...8399',
    '6074001000...8403',
    '6074001000...8407',
    '6074001000...8411',
    '6074001000...8419',
  ];
  const primes = [4, 7]; // indices that pass

  for (let i = 0; i < candidates.length; i++) {
    const isPrime = primes.includes(i);
    yield* typeLine(term.lines, `$ openssl prime ${candidates[i]}`, 0.012);
    yield* waitFor(0.12);
    if (isPrime) {
      yield* flashOutput(term.output, `✓ PRIME  ${candidates[i]}`, COLORS.mint);
      yield* waitFor(0.15);
      term.output.opacity(0);
    } else {
      yield* flashOutput(term.output, `✗ composite`, COLORS.coral);
      yield* waitFor(0.1);
      term.output.opacity(0);
    }
  }

  yield* waitFor(0.2);

  // progress bar on the right showing "many trials"
  const barTrack = createRef<Rect>();
  const barFill = createRef<Rect>();
  view.add(<Rect ref={barTrack} width={200} height={16} radius={8} fill={COLORS.panelLight} stroke={COLORS.panelBorder} lineWidth={1.5} x={360} y={-150} opacity={0} />);
  view.add(<Rect ref={barFill} width={0} height={16} radius={8} fill={COLORS.mint} x={260} y={-150} opacity={0} />);
  yield* all(barTrack().opacity(1, 0.3), barFill().opacity(1, 0.3));

  const barLabel = createRef<Txt>();
  view.add(<Txt ref={barLabel} text={'trials'} fontFamily={FONTS.mono} fontSize={22} fill={COLORS.textDim} x={360} y={-185} opacity={0} />);
  yield* barLabel().opacity(1, 0.3);

  // fill the progress bar
  yield* barFill().width(190, 1.0, easeInOutCubic);

  const countTxt = createRef<Txt>();
  view.add(<Txt ref={countTxt} text={'≈ ln(p) candidates tested'} fontFamily={FONTS.monoNerd} fontSize={24} fill={COLORS.mint} x={360} y={-110} opacity={0} />);
  yield* countTxt().opacity(1, 0.3, easeOutCubic);

  // two glowing prime blocks emerge
  const pBlock = createRef<Rect>();
  const qBlock = createRef<Rect>();
  view.add(
    <Rect ref={pBlock} width={130} height={70} radius={12} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={2.5} x={300} y={40} opacity={0} alignItems={'center'} justifyContent={'center'}>
      <Txt text={'p = PRIME'} fontFamily={FONTS.monoNerd} fontSize={22} fontWeight={600} fill={COLORS.mint} />
    </Rect>,
  );
  view.add(
    <Rect ref={qBlock} width={130} height={70} radius={12} fill={COLORS.mint + '22'} stroke={COLORS.mint} lineWidth={2.5} x={460} y={40} opacity={0} alignItems={'center'} justifyContent={'center'}>
      <Txt text={'q = PRIME'} fontFamily={FONTS.monoNerd} fontSize={22} fontWeight={600} fill={COLORS.mint} />
    </Rect>,
  );
  yield* all(pBlock().opacity(1, 0.3), qBlock().opacity(1, 0.3));
  yield* waitFor(0.2);

  // subtle pulse on the prime blocks
  yield* all(pBlock().scale(1.08, 0.2, easeInOutCubic), qBlock().scale(1.08, 0.2, easeInOutCubic));
  yield* all(pBlock().scale(1, 0.2, easeOutCubic), qBlock().scale(1, 0.2, easeOutCubic));

  const capThread = runCaptions(cap, 90, 105);
  yield* capThread;

  yield* all(
    term.body.opacity(0, 0.3),
    barTrack().opacity(0, 0.3),
    barFill().opacity(0, 0.3),
    barLabel().opacity(0, 0.3),
    countTxt().opacity(0, 0.3),
    pBlock().opacity(0, 0.3),
    qBlock().opacity(0, 0.3),
    tag().opacity(0, 0.3),
  );
});
