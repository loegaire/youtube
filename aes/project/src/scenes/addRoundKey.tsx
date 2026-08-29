import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, STATE_AFTER_MIXCOLUMNS_1, CIPHER_KEY} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption, buildMatrix, renderMatrix, fadeMatrixIn, fadeMatrixOut, setCellOpacity, morphCellValues, GRID} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'AddRoundKey · XOR with round key');

  const stateCells = buildMatrix(STATE_AFTER_MIXCOLUMNS_1);
  renderMatrix(view, stateCells);
  setCellOpacity(stateCells, 0);
  yield* fadeMatrixIn(stateCells, 0.04);

  // Round key matrix positioned above
  const keyCells = buildMatrix(CIPHER_KEY, COLORS.blue);
  for (const cell of keyCells) {
    cell.rect.x(cell.rect.x() + 0);
    cell.rect.y(cell.rect.y() - 480);
    cell.label.x(cell.label.x() + 0);
    cell.label.y(cell.label.y() - 480);
  }
  renderMatrix(view, keyCells);
  setCellOpacity(keyCells, 0);
  yield* fadeMatrixIn(keyCells, 0.04);

  const xorSym = addTxt(view, {
    layout: false, text: 'XOR', fontFamily: FONT_MONO, fontSize: 44, fontWeight: 700, fill: COLORS.coral, y: -160, opacity: 0,
  });
  yield* xorSym.opacity(1, 0.4, easeOutCubic);

  // Animate key dropping onto state
  yield* all(...keyCells.map(cell => all(
    cell.rect.y(cell.rect.y() + 480, 0.7, easeInOutCubic),
    cell.label.y(cell.label.y() + 480, 0.7, easeInOutCubic),
  )));
  yield* waitFor(0.3);

  // Compute XOR result for display
  const xorResult: string[][] = STATE_AFTER_MIXCOLUMNS_1.map((row, r) =>
    row.map((v, c) => {
      const a = parseInt(v, 16);
      const b = parseInt(CIPHER_KEY[r][c], 16);
      return (a ^ b).toString(16).padStart(2, '0');
    })
  );
  yield* morphCellValues(stateCells, xorResult, COLORS.coral);

  const cap = makeCaption(view);
  yield* showCaption(cap, 'AddRoundKey combines the state with a round key using bitwise XOR.', 4.420);
  yield* cap.hide();
  yield* showCaption(cap, 'XOR is addition modulo two. It mixes the key material into the data.', 5.020);
  yield* cap.hide();

  yield* all(
    xorSym.opacity(0, 0.4, easeInOutCubic),
    ...keyCells.map(cell => all(cell.rect.opacity(0, 0.4, easeInOutCubic), cell.label.opacity(0, 0.4, easeInOutCubic))),
    tag.opacity(0, 0.4, easeInOutCubic),
    fadeMatrixOut(stateCells, 0.03),
  );
});
