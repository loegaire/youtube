import {makeScene2D, Node, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {C, FONT, bg, bytePacket, label, rail, register, scanlines} from '../components';

export default makeScene2D(function* (view) {
  view.add(<Node>{bg()}</Node>);
  const regs = createRef<Node>();
  const values = ['6a09e667','bb67ae85','3c6ef372','a54ff53a','510e527f','9b05688c','1f83d9ab','5be0cd19'];
  view.add(<Node ref={regs} opacity={0}>{label('COMPRESSION ENGINE // ROUND 17', C.yellow, 54, {y: -410})}{values.map((v, i) => register('abcdefgh'[i], v, i === 0 || i === 4 ? C.yellow : C.lime, {x: -700 + i * 200, y: -220}))}<Txt text="Ch(e,f,g) = (e AND f) XOR ((NOT e) AND g)" fill={C.cyan} fontFamily={FONT} fontSize={32} y={-55} /><Txt text="Maj(a,b,c) = (a AND b) XOR (a AND c) XOR (b AND c)" fill={C.orange} fontFamily={FONT} fontSize={29} y={5} /><Txt text="Σ0(a) = ROTR²(a) XOR ROTR¹³(a) XOR ROTR²²(a)" fill={C.lime} fontFamily={FONT} fontSize={29} y={70} /><Txt text="Σ1(e) = ROTR⁶(e) XOR ROTR¹¹(e) XOR ROTR²⁵(e)" fill={C.lime} fontFamily={FONT} fontSize={29} y={125} /></Node>);
  yield* all(regs().opacity(1, 0.7), regs().scale(1.04, 0.7));
  yield* sequence(0.06, ...regs().children().slice(1, 9).map(n => n.rotation(360, 0.45)));
  const t1 = createRef<Node>();
  view.add(<Node ref={t1} opacity={0}>{rail(-720, 230, 620, 230, C.lime)}{bytePacket('h', C.lime, {x: -690, y: 230})}{bytePacket('Σ1(e)', C.lime, {x: -370, y: 230})}{bytePacket('Ch', C.lime, {x: -100, y: 230})}{bytePacket('K[t]', C.yellow, {x: 160, y: 230})}{bytePacket('W[t]', C.cyan, {x: 420, y: 230})}<Txt text="T1 = h + Σ1(e) + Ch + K[t] + W[t]   mod 2³²" fill={C.yellow} fontFamily={FONT} fontSize={32} y={345} /></Node>);
  yield* all(t1().opacity(1, 0.6), t1().position.x(20, 1));
  yield* all(regs().children()[1].position.x(700, 0.9), regs().children()[2].position.x(500, 0.9), regs().children()[3].position.x(300, 0.9));
  yield* waitFor(0.8);
});
