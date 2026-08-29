import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, CIPHER_KEY, sboxLookup} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption} from '../sceneUtils';

function expandKey(key: string[][]): string[][] {
  const Nk = 4;
  const Nr = 10;
  const total = 4 * (Nr + 1);
  const words: string[][] = [];
  for (let c = 0; c < Nk; c++) {
    words.push([key[0][c], key[1][c], key[2][c], key[3][c]]);
  }
  const rcon = ['01','02','04','08','10','20','40','80','1b','36'];
  for (let i = Nk; i < total; i++) {
    let temp = words[i - 1].slice();
    if (i % Nk === 0) {
      temp = [temp[1], temp[2], temp[3], temp[0]];
      temp = temp.map(b => sboxLookup(b));
      temp[0] = (parseInt(temp[0], 16) ^ parseInt(rcon[i / Nk - 1], 16)).toString(16).padStart(2, '0');
    }
    words[i] = words[i - Nk].map((b, j) => {
      const a = parseInt(b, 16);
      const t = parseInt(temp[j], 16);
      return (a ^ t).toString(16).padStart(2, '0');
    });
  }
  return words;
}

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'Key Expansion · 44 round-key words');

  const words = expandKey(CIPHER_KEY);

  const wordNodes: Txt[] = [];
  const cols = 11;
  for (let i = 0; i < Math.min(words.length, 16); i++) {
    const cx = (i % cols) * 130 - 760;
    const cy = -120 + Math.floor(i / cols) * 90;
    const ref = createRef<Txt>();
    view.add(
      <Txt ref={ref} layout={false} text={`w${i}\n${words[i].join(' ')}`} fontFamily={FONT_MONO} fontSize={28} fill={i % 4 === 0 ? COLORS.amber : COLORS.ink} x={cx} y={cy} opacity={0} />
    );
    wordNodes.push(ref());
  }

  yield* sequence(0.05, ...wordNodes.map(n => n.opacity(1, 0.3, easeOutCubic)));

  const formula = addTxt(view, {
    layout: false, text: 'w[i] = w[i-4]  XOR  SubWord(RotWord(w[i-1]))  XOR  Rcon', fontFamily: FONT_MONO, fontSize: 32, fill: COLORS.mint, y: 260, opacity: 0,
  });
  yield* formula.opacity(1, 0.5, easeOutCubic);

  const cap = makeCaption(view);
  yield* showCaption(cap, 'AES expands the 128-bit cipher key into 44 round-key words.', 6.180);
  yield* cap.hide();
  yield* showCaption(cap, 'Every fourth word rotates its bytes, substitutes them, and XORs a round constant.', 6.660);
  yield* cap.hide();
  yield* showCaption(cap, 'The remaining words are simple XORs of earlier words.', 3.820);
  yield* cap.hide();

  yield* all(
    formula.opacity(0, 0.4, easeInOutCubic),
    ...wordNodes.map(n => n.opacity(0, 0.4, easeInOutCubic)),
    tag.opacity(0, 0.4, easeInOutCubic),
  );
});
