import {makeScene2D, Node, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {C, FONT, TechPanel, bg, bytePacket, label, rail, register, scanlines} from '../components';

export default makeScene2D(function* (view) {
  view.add(<Node>{bg()}</Node>);
  const intro = createRef<Node>();
  view.add(<Node ref={intro}>{label('1', C.yellow, 220)}{label('→ SHA-256', C.lime, 88, {x: 310})}</Node>);
  yield* all(intro().scale(1.2, 0.8), intro().rotation(6, 0.8));
  yield* all(intro().position.x(-2100, 0.8), intro().opacity(0, 0.5));

  const engine = createRef<Node>();
  view.add(<Node ref={engine} opacity={0}>{label('SHA-256', C.yellow, 86, {y: -390})}{bytePacket('512 BITS', C.cyan, {x: -560, y: -80, scale: 1.5})}{rail(-400, -80, 290, -80, C.lime)}{bytePacket('256 BITS', C.yellow, {x: 520, y: -80, scale: 1.5})}{['a','b','c','d','e','f','g','h'].map((r, i) => register(r, ['6a09e667','bb67ae85','3c6ef372','a54ff53a','510e527f','9b05688c','1f83d9ab','5be0cd19'][i], C.lime, {x: -630 + i * 180, y: 170, scale: 0.72}))}</Node>);
  yield* all(engine().opacity(1, 0.7), engine().scale(1.06, 1));
  yield* sequence(0.05, ...engine().children().slice(4).map(n => n.position.y(120, 0.35)));
  yield* waitFor(0.6);
  yield* all(engine().position.x(-2100, 0.8), engine().opacity(0, 0.6));

  const padding = createRef<Node>();
  view.add(<Node ref={padding} opacity={0}>{label('PADDING', C.yellow, 72, {y: -350})}{bytePacket('61', C.cyan, {x: -360})}{bytePacket('62', C.cyan, {x: -240})}{bytePacket('63', C.cyan, {x: -120})}{bytePacket('80', C.yellow, {x: 40})}<Txt text="00 00 00 ... 0000000000000018" fill={C.lime} fontFamily={FONT} fontSize={36} x={330} /><Txt text="abc → 24 bits" fill={C.orange} fontFamily={FONT} fontSize={34} y={170} /></Node>);
  yield* all(padding().opacity(1, 0.7), padding().position.x(-40, 1));
  yield* waitFor(0.8);
  yield* all(padding().position.y(-650, 0.8), padding().opacity(0, 0.6));

  const schedule = createRef<Node>();
  view.add(<Node ref={schedule} opacity={0}>{label('W0 … W63 MESSAGE SCHEDULE', C.yellow, 56, {y: -400})}{Array.from({length: 16}, (_, i) => bytePacket(`W${i}`, i < 4 ? C.cyan : C.lime, {x: -720 + (i % 8) * 205, y: -130 + Math.floor(i / 8) * 115}))}<Txt text="W[t] = σ1(W[t-2]) + W[t-7] + σ0(W[t-15]) + W[t-16]" fill={C.cyan} fontFamily={FONT} fontSize={33} y={170} /><Txt text="rotations + shifts + modular addition" fill={C.orange} fontFamily={FONT} fontSize={31} y={245} /></Node>);
  yield* all(schedule().opacity(1, 0.7), schedule().scale(1.04, 1));
  yield* sequence(0.03, ...schedule().children().slice(1, 17).map(n => n.rotation(360, 0.55)));
  yield* waitFor(0.8);
});
