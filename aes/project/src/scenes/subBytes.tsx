import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, STATE_AFTER_ROUND0, STATE_AFTER_SUBBYTES_1, sboxLookup} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption, buildMatrix, renderMatrix, fadeMatrixIn, fadeMatrixOut, morphCellValues, setCellOpacity} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'SubBytes · nonlinear substitution');

  const cells = buildMatrix(STATE_AFTER_ROUND0);
  renderMatrix(view, cells);
  setCellOpacity(cells, 0);
  yield* fadeMatrixIn(cells, 0.04);

  // Mini S-box panel
  const panelRef = createRef<Rect>();
  view.add(
    <Rect ref={panelRef} layout={false} width={360} height={360} x={520} y={-30} radius={12} fill={COLORS.canvas} stroke={COLORS.rule} lineWidth={2} opacity={0} />
  );
  const sboxPanel = panelRef();
  const sboxTitle = addTxt(view, {
    layout: false, text: 'S-box', fontFamily: FONT_MONO, fontSize: 30, fill: COLORS.mint, x: 520, y: -200, opacity: 0,
  });

  const entries: Txt[] = [];
  const sampleVals = ['19','3d','e3','be','a0','f4','e2','2b','9a','c6','8d','2a','e9','f8','48','08'];
  for (let i = 0; i < 16; i++) {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const ex = 520 + (c - 1.5) * 80;
    const ey = -30 + (r - 1.5) * 80;
    const inRef = createRef<Txt>();
    view.add(
      <Txt ref={inRef} layout={false} text={sampleVals[i]} fontFamily={FONT_MONO} fontSize={24} fill={COLORS.inkMuted} x={ex} y={ey - 16} opacity={0} />
    );
    entries.push(inRef());
    const outRef = createRef<Txt>();
    view.add(
      <Txt ref={outRef} layout={false} text={sboxLookup(sampleVals[i])} fontFamily={FONT_MONO} fontSize={28} fontWeight={700} fill={COLORS.amber} x={ex} y={ey + 14} opacity={0} />
    );
    entries.push(outRef());
  }

  yield* all(sboxPanel.opacity(1, 0.4, easeOutCubic), sboxTitle.opacity(1, 0.4, easeOutCubic));
  yield* sequence(0.03, ...entries.map(e => e.opacity(1, 0.3, easeOutCubic)));

  // Substitute each byte
  yield* morphCellValues(cells, STATE_AFTER_SUBBYTES_1, COLORS.amber);

  const cap = makeCaption(view);
  yield* showCaption(cap, 'SubBytes replaces every byte using a fixed substitution table, the S-box.', 5.700);
  yield* cap.hide();
  yield* showCaption(cap, 'The S-box is built from a multiplicative inverse in GF(2⁸) followed by an affine transform.', 7.060);
  yield* cap.hide();
  yield* showCaption(cap, 'This nonlinearity creates confusion in the cipher.', 3.700);
  yield* cap.hide();

  yield* all(
    sboxPanel.opacity(0, 0.4, easeInOutCubic),
    sboxTitle.opacity(0, 0.4, easeInOutCubic),
    ...entries.map(e => e.opacity(0, 0.4, easeInOutCubic)),
    tag.opacity(0, 0.4, easeInOutCubic),
    fadeMatrixOut(cells, 0.03),
  );
});
