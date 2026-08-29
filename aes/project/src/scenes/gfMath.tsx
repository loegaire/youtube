import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS} from '../aesData';
import {FONT_MONO, FONT_DISPLAY, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'GF(2⁸) · finite field arithmetic');

  const polyA = addTxt(view, {
    layout: false, text: '0x57  =  x⁶ + x⁴ + x² + 1', fontFamily: FONT_MONO, fontSize: 48, fill: COLORS.ink, y: -260,
  });
  const polyB = addTxt(view, {
    layout: false, text: '0x13  =  x⁴ + x + 1', fontFamily: FONT_MONO, fontSize: 48, fill: COLORS.ink, y: -190,
  });

  // 8-bit register row of bits
  const bitsA: Rect[] = [];
  const bitsLabel: Txt[] = [];
  const bitVals = [0,1,0,1,0,1,1,1];
  for (let i = 0; i < 8; i++) {
    const bx = (i - 3.5) * 70;
    const cellRef = createRef<Rect>();
    view.add(
      <Rect ref={cellRef} layout={false} width={56} height={56} x={bx} y={-60} radius={6} fill={COLORS.canvas} stroke={COLORS.rule} lineWidth={2} />
    );
    bitsA.push(cellRef());
    const labRef = createRef<Txt>();
    view.add(
      <Txt ref={labRef} layout={false} text={String(bitVals[i])} fontFamily={FONT_MONO} fontSize={32} fontWeight={700} fill={bitVals[i] ? COLORS.mint : COLORS.inkMuted} x={bx} y={-60} />
    );
    bitsLabel.push(labRef());
  }

  const irreducible = addTxt(view, {
    layout: false, text: 'm(x) = x⁸ + x⁴ + x³ + x + 1', fontFamily: FONT_MONO, fontSize: 40, fill: COLORS.amber, y: 40, opacity: 0,
  });
  yield* irreducible.opacity(1, 0.5, easeOutCubic);

  const xtimeLabel = addTxt(view, {
    layout: false, text: 'xtime(0x57) = 0xAE   (shift left; MSB=0 -> no XOR)', fontFamily: FONT_MONO, fontSize: 36, fill: COLORS.ink, y: 140, opacity: 0,
  });
  yield* xtimeLabel.opacity(1, 0.5, easeOutCubic);

  yield* bitsLabel[0].fill(COLORS.coral, 0.4, easeInOutCubic);
  yield* waitFor(0.6);

  const result = addTxt(view, {
    layout: false, text: '0x57 x 0x02  =  0xAE', fontFamily: FONT_MONO, fontSize: 44, fontWeight: 700, fill: COLORS.mint, y: 220, opacity: 0,
  });
  yield* result.opacity(1, 0.5, easeOutCubic);

  const cap = makeCaption(view);
  yield* showCaption(cap, 'AES operates inside the finite field GF(2⁸). A byte is an 8-bit polynomial.', 8.020);
  yield* cap.hide();
  yield* showCaption(cap, 'Addition is bitwise XOR, and multiplication is modulo an irreducible polynomial.', 5.860);
  yield* cap.hide();
  yield* showCaption(cap, 'Multiplying by x is a left shift plus a conditional XOR with 0x1b.', 5.580);
  yield* cap.hide();

  yield* all(
    polyA.opacity(0, 0.4, easeInOutCubic),
    polyB.opacity(0, 0.4, easeInOutCubic),
    irreducible.opacity(0, 0.4, easeInOutCubic),
    xtimeLabel.opacity(0, 0.4, easeInOutCubic),
    result.opacity(0, 0.4, easeInOutCubic),
    ...bitsA.map(b => b.opacity(0, 0.4, easeInOutCubic)),
    ...bitsLabel.map(b => b.opacity(0, 0.4, easeInOutCubic)),
    tag.opacity(0, 0.4, easeInOutCubic),
  );
});
