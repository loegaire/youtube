import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS} from '../aesData';
import {FONT_DISPLAY, FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);

  const tag = addSectionTag(view, 'AES · FIPS-197 · 2001');
  tag.opacity(0);
  yield* tag.opacity(1, 0.6, easeOutCubic);

  const title = addTxt(view, {
    layout: false,
    text: 'Advanced Encryption Standard',
    fontFamily: FONT_DISPLAY,
    fontWeight: 800,
    fontSize: 96,
    fill: COLORS.ink,
    y: -40,
    opacity: 0,
    letterSpacing: -2,
  });
  yield* title.opacity(1, 0.8, easeOutCubic);

  const sub = addTxt(view, {
    layout: false,
    text: 'A symmetric 128-bit block cipher',
    fontFamily: FONT_MONO,
    fontWeight: 500,
    fontSize: 40,
    fill: COLORS.mint,
    y: 60,
    opacity: 0,
  });
  yield* delay(0.3, sub.opacity(1, 0.6, easeOutCubic));

  // Animated 4x4 grid hint of the state
  const grid: Rect[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const ref = createRef<Rect>();
      view.add(
        <Rect
          ref={ref}
          layout={false}
          width={46}
          height={46}
          x={(c - 1.5) * 56}
          y={(r - 1.5) * 56 + 200}
          radius={6}
          fill={COLORS.canvas}
          stroke={COLORS.mintDeep}
          lineWidth={2}
          opacity={0}
        />
      );
      grid.push(ref());
    }
  }
  yield* sequence(0.03, ...grid.map(g => g.opacity(0.5, 0.4, easeOutCubic)));

  const cap = makeCaption(view);
  yield* showCaption(cap, 'Welcome to an animated explanation of the AES encryption algorithm.', 4.500);
  yield* cap.hide();
  yield* showCaption(cap, 'AES is a symmetric block cipher standardized by NIST as FIPS-197 in 2001.', 7.420);
  yield* cap.hide();
  yield* showCaption(cap, 'It encrypts 128-bit blocks using keys of 128, 192, or 256 bits.', 7.020);
  yield* cap.hide();

  yield* all(
    title.opacity(0, 0.5, easeInOutCubic),
    sub.opacity(0, 0.5, easeInOutCubic),
    ...grid.map(g => g.opacity(0, 0.5, easeInOutCubic)),
    tag.opacity(0, 0.5, easeInOutCubic),
  );
});
