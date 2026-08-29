import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, STATE_AFTER_SUBBYTES_1} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption, buildMatrix, renderMatrix, fadeMatrixIn, fadeMatrixOut, setCellOpacity, CELL, GRID} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'ShiftRows · cyclic row permutation');

  const cells = buildMatrix(STATE_AFTER_SUBBYTES_1);
  renderMatrix(view, cells);
  setCellOpacity(cells, 0);
  yield* fadeMatrixIn(cells, 0.04);

  // Ghost outlines for target positions
  const ghosts: Rect[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = (c - 1.5) * GRID;
      const y = (r - 1.5) * GRID;
      const ref = createRef<Rect>();
      view.add(
        <Rect ref={ref} layout={false} width={CELL} height={CELL} x={x} y={y} radius={10} stroke={COLORS.mintDeep} lineWidth={1.5} lineDash={[6, 6]} opacity={0} />
      );
      ghosts.push(ref());
    }
  }

  const cap0 = makeCaption(view);
  yield* showCaption(cap0, 'ShiftRows rotates each row left by its row index.', 4.060);
  yield* cap0.hide();

  // animate row by row with labels moving left by row index
  yield* all(
    ...cells.slice(4, 8).map((cell, i) => cell.label.x((i - 1.5) * GRID, 0.5, easeInOutCubic)),
  );
  yield* all(
    ...cells.slice(8, 12).map((cell, i) => cell.label.x((i - 1.5) * GRID, 0.5, easeInOutCubic)),
  );
  yield* all(
    ...cells.slice(12, 16).map((cell, i) => cell.label.x((i - 1.5) * GRID, 0.5, easeInOutCubic)),
  );

  const note = addTxt(view, {
    layout: false, text: 'positions change · values unchanged', fontFamily: FONT_MONO, fontSize: 32, fill: COLORS.mint, y: 250, opacity: 0,
  });
  yield* note.opacity(1, 0.4, easeOutCubic);

  const cap = makeCaption(view);
  yield* showCaption(cap, 'Row zero stays in place. Row one shifts one left, row two two, row three three.', 7.220);
  yield* cap.hide();
  yield* showCaption(cap, 'Only positions change. The byte values themselves are not altered.', 4.460);
  yield* cap.hide();

  yield* all(
    note.opacity(0, 0.4, easeInOutCubic),
    ...ghosts.map(g => g.opacity(0, 0.4, easeInOutCubic)),
    tag.opacity(0, 0.4, easeInOutCubic),
    fadeMatrixOut(cells, 0.03),
  );
});
