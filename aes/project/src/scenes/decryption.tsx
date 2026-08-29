import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, CIPHERTEXT, PLAINTEXT} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption, buildMatrix, renderMatrix, fadeMatrixIn, fadeMatrixOut, setCellOpacity, morphCellValues} from '../sceneUtils';

function cloneValues(values: string[][]): string[][] {
  return values.map(row => row.slice());
}

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'Decryption · inverse cipher');

  const stateCells = buildMatrix(CIPHERTEXT, COLORS.coral);
  renderMatrix(view, stateCells);
  setCellOpacity(stateCells, 0);
  yield* fadeMatrixIn(stateCells, 0.04);

  const stepLabel = addTxt(view, {
    layout: false, text: 'ciphertext', fontFamily: FONT_MONO, fontSize: 32, fill: COLORS.coral, y: -260,
  });

  const invPoly = addTxt(view, {
    layout: false, text: 'a⁻¹(x) = 0b·x³ + 0d·x² + 09·x + 0e', fontFamily: FONT_MONO, fontSize: 34, fill: COLORS.amber, x: -560, y: -140, opacity: 0,
  });
  yield* invPoly.opacity(1, 0.4, easeOutCubic);

  const cap = makeCaption(view);

  yield* showCaption(cap, 'Decryption reverses each transformation in the opposite order.', 4.260);
  yield* cap.hide();

  // InvShiftRows (visual: brief shuffle)
  stepLabel.text('InvShiftRows');
  yield* all(...stateCells.map(c => c.rect.stroke(COLORS.mint, 0.3, easeOutCubic)));
  yield* waitFor(0.5);
  yield* all(...stateCells.map(c => c.rect.stroke(COLORS.rule, 0.3, easeOutCubic)));
  yield* showCaption(cap, 'InvShiftRows shifts each row right, undoing the left rotation.', 4.740);
  yield* cap.hide();

  // InvSubBytes
  stepLabel.text('InvSubBytes');
  yield* morphCellValues(stateCells, cloneValues(CIPHERTEXT), COLORS.amber);
  yield* showCaption(cap, 'InvSubBytes applies the inverse S-box to each byte.', 3.940);
  yield* cap.hide();

  // InvMixColumns
  stepLabel.text('InvMixColumns');
  yield* morphCellValues(stateCells, cloneValues(CIPHERTEXT), COLORS.mint);
  yield* showCaption(cap, 'InvMixColumns multiplies each column by the inverse polynomial.', 4.140);
  yield* cap.hide();

  // Final: recover plaintext
  yield* morphCellValues(stateCells, PLAINTEXT, COLORS.mint);
  stepLabel.text('recovered plaintext');
  stepLabel.fill(COLORS.mint);
  yield* showCaption(cap, 'The final XOR with the original key recovers the plaintext.', 4.300);
  yield* cap.hide();
  yield* showCaption(cap, 'The result matches the block we started with.', 2.980);
  yield* cap.hide();

  yield* all(
    stepLabel.opacity(0, 0.4, easeInOutCubic),
    invPoly.opacity(0, 0.4, easeInOutCubic),
    tag.opacity(0, 0.4, easeInOutCubic),
    fadeMatrixOut(stateCells, 0.03),
  );
});
