import {makeScene2D, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {C, FONT, bg, label, register, scanlines} from '../components';

export default makeScene2D(function* (view) {
  view.add(<Node>{bg()}</Node>);
  const loop = createRef<Node>();
  view.add(<Node ref={loop} opacity={0}>{label('64 ROUNDS // CONTROLLED AVALANCHE', C.yellow, 56, {y: -405})}<Rect width={540} height={540} stroke={C.lime} lineWidth={4} rotation={45} />{Array.from({length: 16}, (_, i) => <Txt text={String(i * 4).padStart(2, '0')} fill={i === 4 ? C.yellow : C.cyan} fontFamily={FONT} fontSize={26} x={Math.cos(i / 16 * Math.PI * 2) * 410} y={Math.sin(i / 16 * Math.PI * 2) * 310} />)}<Txt text="ROUND 17" fill={C.yellow} fontFamily={FONT} fontSize={58} /><Txt text="W17  K17  Σ  Ch  Maj" fill={C.cyan} fontFamily={FONT} fontSize={30} y={80} /></Node>);
  yield* all(loop().opacity(1, 0.7), loop().rotation(360, 3), loop().scale(1.06, 1));
  const blocks = createRef<Node>();
  view.add(<Node ref={blocks} opacity={0}>{['BLOCK 01','BLOCK 02','BLOCK 03'].map((b, i) => <Rect width={400} height={180} x={-500 + i * 500} stroke={i === 1 ? C.yellow : C.lime} lineWidth={4} fill={C.bg}><Txt text={b} fill={i === 1 ? C.yellow : C.lime} fontFamily={FONT} fontSize={37} /><Txt text="state → state" fill={C.cyan} fontFamily={FONT} fontSize={23} y={52} /></Rect>)}<Txt text="previous hash state carries forward" fill={C.orange} fontFamily={FONT} fontSize={40} y={250} /></Node>);
  yield* all(loop().position.y(-650, 0.8), loop().opacity(0, 0.5), blocks().opacity(1, 0.7));
  yield* all(blocks().position.x(-120, 1.3), blocks().scale(1.04, 1.3));
  yield* waitFor(0.8);
});
