import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, STATE_AFTER_SHIFTROWS_1, STATE_AFTER_MIXCOLUMNS_1} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption, buildMatrix, renderMatrix, fadeMatrixIn, fadeMatrixOut, setCellOpacity, morphCellValues} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'MixColumns · diffusion within columns');

  const cells = buildMatrix(STATE_AFTER_SHIFTROWS_1);
  renderMatrix(view, cells);
  setCellOpacity(cells, 0);
  yield* fadeMatrixIn(cells, 0.04);

  const polyTxt = addTxt(view, {
    layout: false, text: 'a(x) = 03·x³ + 01·x² + 01·x + 02', fontFamily: FONT_MONO, fontSize: 36, fill: COLORS.amber, x: -560, y: -260, opacity: 0,
  });
  yield* polyTxt.opacity(1, 0.4, easeOutCubic);

  const matrixTxt = addTxt(view, {
    layout: false, text: ['02 03 01 01', '01 02 03 01', '01 01 02 03', '03 01 01 02'].join('\n'), fontFamily: FONT_MONO, fontSize: 32, fill: COLORS.ink, x: -560, y: -40, opacity: 0,
  });
  yield* matrixTxt.opacity(1, 0.4, easeOutCubic);

  // Highlight each column sequentially
  for (let c = 0; c < 4; c++) {
    const colCells = [0,1,2,3].map(r => cells[r * 4 + c]);
    yield* all(...colCells.map(cell => cell.rect.stroke(COLORS.mint, 0.3, easeOutCubic)));
    yield* waitFor(0.4);
    yield* all(...colCells.map(cell => cell.rect.stroke(COLORS.rule, 0.3, easeOutCubic)));
  }

  yield* morphCellValues(cells, STATE_AFTER_MIXCOLUMNS_1, COLORS.mint);

  const cap = makeCaption(view);
  yield* showCaption(cap, 'MixColumns treats each column as a polynomial over GF(2⁸).', 5.300);
  yield* cap.hide();
  yield* showCaption(cap, 'It multiplies the column by a fixed polynomial, mixing the four bytes together.', 4.980);
  yield* cap.hide();
  yield* showCaption(cap, 'This step spreads influence across the column, providing diffusion.', 3.820);
  yield* cap.hide();

  yield* all(
    polyTxt.opacity(0, 0.4, easeInOutCubic),
    matrixTxt.opacity(0, 0.4, easeInOutCubic),
    tag.opacity(0, 0.4, easeInOutCubic),
    fadeMatrixOut(cells, 0.03),
  );
});
