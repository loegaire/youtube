import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, PLAINTEXT, CIPHERTEXT, STATE_AFTER_ROUND0, STATE_AFTER_SUBBYTES_1, STATE_AFTER_SHIFTROWS_1, STATE_AFTER_MIXCOLUMNS_1} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption, buildMatrix, renderMatrix, fadeMatrixIn, fadeMatrixOut, setCellOpacity, morphCellValues} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'Encryption Walkthrough · one block');

  const stateCells = buildMatrix(PLAINTEXT);
  renderMatrix(view, stateCells);
  setCellOpacity(stateCells, 0);
  yield* fadeMatrixIn(stateCells, 0.04);

  const stepLabel = addTxt(view, {
    layout: false, text: 'plaintext', fontFamily: FONT_MONO, fontSize: 32, fill: COLORS.mint, y: -260,
  });

  const cap = makeCaption(view);

  yield* showCaption(cap, 'We encrypt one 128-bit block using the standard AES test vector.', 4.620);
  yield* cap.hide();

  // Initial AddRoundKey
  yield* morphCellValues(stateCells, STATE_AFTER_ROUND0, COLORS.coral);
  stepLabel.text('after AddRoundKey');
  yield* showCaption(cap, 'First we XOR the plaintext with the cipher key.', 3.700);
  yield* cap.hide();

  // Round 1: SubBytes
  yield* morphCellValues(stateCells, STATE_AFTER_SUBBYTES_1, COLORS.amber);
  stepLabel.text('round 1 · SubBytes');
  yield* showCaption(cap, 'Round one begins with SubBytes, replacing each byte through the S-box.', 4.860);
  yield* cap.hide();

  // ShiftRows
  yield* morphCellValues(stateCells, STATE_AFTER_SHIFTROWS_1, COLORS.mint);
  stepLabel.text('round 1 · ShiftRows');
  yield* showCaption(cap, 'ShiftRows rotates each row left by its row index.', 3.780);
  yield* cap.hide();

  // MixColumns
  yield* morphCellValues(stateCells, STATE_AFTER_MIXCOLUMNS_1, COLORS.mint);
  stepLabel.text('round 1 · MixColumns');
  yield* showCaption(cap, 'MixColumns multiplies each column by the fixed polynomial, mixing bytes.', 5.100);
  yield* cap.hide();

  // AddRoundKey round 1 (representative derived key)
  const rk1: string[][] = [
    ['a0','fa','fe','17'],
    ['88','54','2c','b9'],
    ['40','a2','89','1f'],
    ['23','20','60','76'],
  ];
  yield* morphCellValues(stateCells, rk1, COLORS.coral);
  stepLabel.text('round 1 · AddRoundKey');
  yield* showCaption(cap, 'AddRoundKey XORs the state with the first round key.', 3.780);
  yield* cap.hide();

  // Condensed rounds 2-9
  stepLabel.text('rounds 2-9');
  yield* showCaption(cap, 'Rounds two through nine repeat these four transformations.', 3.740);
  yield* cap.hide();
  for (let i = 0; i < 4; i++) {
    yield* all(...stateCells.map(c => c.label.opacity(0.5, 0.15, easeInOutCubic)));
    yield* all(...stateCells.map(c => c.label.opacity(1, 0.15, easeInOutCubic)));
  }

  // Round 10: final -> ciphertext
  yield* morphCellValues(stateCells, CIPHERTEXT, COLORS.mint);
  stepLabel.text('round 10 · ciphertext');
  yield* showCaption(cap, 'The final round skips MixColumns and produces the ciphertext.', 4.300);
  yield* cap.hide();

  yield* all(
    stepLabel.opacity(0, 0.4, easeInOutCubic),
    tag.opacity(0, 0.4, easeInOutCubic),
    fadeMatrixOut(stateCells, 0.03),
  );
});
