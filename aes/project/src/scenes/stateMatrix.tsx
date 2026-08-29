import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, PLAINTEXT} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption, buildMatrix, renderMatrix, fadeMatrixIn, fadeMatrixOut, setCellOpacity} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'State · 4x4 byte matrix');

  const formula = addTxt(view, {
    layout: false, text: 's[r,c] = in[r + 4c]', fontFamily: FONT_MONO, fontSize: 40, fill: COLORS.amber, y: -300,
  });

  const cells = buildMatrix(PLAINTEXT);
  renderMatrix(view, cells);
  setCellOpacity(cells, 0);

  // Load bytes column by column (column-major indices)
  yield* sequence(0.12,
    ...[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15].map(i =>
      all(cells[i].rect.opacity(1, 0.3, easeOutCubic), cells[i].label.opacity(1, 0.3, easeOutCubic))
    )
  );

  // Column word labels
  const wordLabels: Txt[] = [];
  for (let c = 0; c < 4; c++) {
    const w = addTxt(view, {
      layout: false, text: `w${c}`, fontFamily: FONT_MONO, fontSize: 32, fill: COLORS.mint, x: (c - 1.5) * 98, y: 220, opacity: 0,
    });
    wordLabels.push(w);
  }
  yield* sequence(0.1, ...wordLabels.map(w => w.opacity(1, 0.3, easeOutCubic)));

  const cap = makeCaption(view);
  yield* showCaption(cap, 'AES arranges the 128-bit block into a 4x4 byte matrix called the State.', 6.580);
  yield* cap.hide();
  yield* showCaption(cap, 'Bytes are loaded column by column: the first four bytes form column zero.', 4.540);
  yield* cap.hide();
  yield* showCaption(cap, 'Each column can be read as a 32-bit word.', 3.700);
  yield* cap.hide();

  yield* all(
    formula.opacity(0, 0.4, easeInOutCubic),
    ...wordLabels.map(w => w.opacity(0, 0.4, easeInOutCubic)),
    tag.opacity(0, 0.4, easeInOutCubic),
    fadeMatrixOut(cells, 0.03),
  );
});
