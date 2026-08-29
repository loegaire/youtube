import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS} from '../aesData';
import {FONT_MONO, FONT_DISPLAY, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'Conclusion');

  const title = addTxt(view, {
    layout: false, text: 'AES in summary', fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 80, fill: COLORS.ink, y: -200, opacity: 0,
  });
  yield* title.opacity(1, 0.6, easeOutCubic);

  const points = [
    '128-bit blocks, 10 rounds for AES-128',
    'SubBytes, ShiftRows, MixColumns, AddRoundKey',
    'Finite field GF(2⁸) and key expansion',
    'Used in TLS, Wi-Fi, file encryption, and more',
  ];
  const pointNodes: Txt[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = addTxt(view, {
      layout: false, text: '> ' + points[i], fontFamily: FONT_MONO, fontSize: 38, fill: COLORS.mint, x: -560, y: -60 + i * 70, opacity: 0,
    });
    pointNodes.push(p);
  }
  yield* sequence(0.15, ...pointNodes.map(p => p.opacity(1, 0.4, easeOutCubic)));

  const cap = makeCaption(view);
  yield* showCaption(cap, 'AES is a fast, secure block cipher standardized by NIST.', 4.660);
  yield* cap.hide();
  yield* showCaption(cap, 'Four simple steps repeat to create strong diffusion and confusion.', 4.420);
  yield* cap.hide();
  yield* showCaption(cap, 'Thank you for watching.', 1.580);
  yield* cap.hide();

  yield* all(
    title.opacity(0, 0.5, easeInOutCubic),
    ...pointNodes.map(p => p.opacity(0, 0.5, easeInOutCubic)),
    tag.opacity(0, 0.5, easeInOutCubic),
  );
});
