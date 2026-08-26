import {makeScene2D, Node, Rect, Txt, Layout, Circle, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, chain, easeInOutCubic, sequence} from '@motion-canvas/core';
import {RegisterBank, HashRound} from '../components';

export default makeScene2D(function* (view) {
  // Palette
  const BG_COLOR = '#000000';
  const TEAL = '#008080';
  const YELLOW = '#ffff00';
  const CYAN = '#00ffff';

  view.add(<Rect width={1920} height={1080} fill={BG_COLOR} />);

  // --- 30 & 31: Initialize state ---
  const regBank = createRef<RegisterBank>();
  view.add(
    <Node x={-200} scale={0.8}>
      <RegisterBank ref={regBank} opacity={0} />
    </Node>
  );

  // Sweep animation
  yield* regBank().opacity(1, 1);
  yield* regBank().position.x(0, 1, easeInOutCubic);
  yield* waitFor(1);

  // --- 32 & 33: Logical Functions (Ch) ---
  const logicalNode = createRef<Node>();
  view.add(
    <Node ref={logicalNode} opacity={0} x={400} y={0}>
      <Txt text="Ch(e,f,g) = (e AND f) XOR ((NOT e) AND g)" fill={YELLOW} fontFamily="monospace" fontSize={30} y={-100} />
      {/* Simulation of mask passing */}
      <Rect width={300} height={100} stroke={TEAL} lineWidth={4} />
      <Txt text="MASKING BITS" fill={CYAN} fontFamily="monospace" fontSize={30} />
    </Node>
  );

  yield* all(
    regBank().position.x(-400, 1, easeInOutCubic),
    logicalNode().opacity(1, 1)
  );
  yield* waitFor(1);

  // --- 34: Majority function ---
  const majNode = createRef<Node>();
  view.add(
    <Node ref={majNode} opacity={0} x={400} y={200}>
      <Txt text="Maj(a,b,c)" fill={YELLOW} fontFamily="monospace" fontSize={30} y={-50} />
      <Layout direction="row" gap={20}>
        <Txt text="0,0,1 -> 0" fill={CYAN} fontFamily="monospace" />
        <Txt text="1,1,0 -> 1" fill={CYAN} fontFamily="monospace" />
        <Txt text="1,0,1 -> 1" fill={CYAN} fontFamily="monospace" />
      </Layout>
    </Node>
  );

  yield* majNode().opacity(1, 1);
  yield* waitFor(1);

  // --- 35: Repeat 64 ---
  const repeatTxt = createRef<Txt>();
  view.add(
    <Txt ref={repeatTxt} text="REPEAT × 64" fill={YELLOW} fontFamily="monospace" fontSize={100} opacity={0} />
  );

  yield* all(
    logicalNode().opacity(0, 1),
    majNode().opacity(0, 1),
    regBank().scale(0.5, 1, easeInOutCubic),
    repeatTxt().opacity(1, 1)
  );

  yield* waitFor(1);
  yield* repeatTxt().opacity(0, 1);

  // --- 36 & 37: Sigma functions ---
  const sigmaNode = createRef<Node>();
  view.add(
    <Node ref={sigmaNode} opacity={0} x={400}>
      <Txt text="Σ0(a) = ROTR²(a) XOR ROTR¹³(a) XOR ROTR²²(a)" fill={YELLOW} fontFamily="monospace" fontSize={30} y={-100} />
      <Txt text="Σ1(e) = ROTR⁶(e) XOR ROTR¹¹(e) XOR ROTR²⁵(e)" fill={YELLOW} fontFamily="monospace" fontSize={30} y={100} />
    </Node>
  );

  yield* sigmaNode().opacity(1, 1);
  yield* waitFor(1.5);
  yield* sigmaNode().opacity(0, 1);

  // --- 38, 39, 40: One complete round ---
  const roundIndicator = createRef<Txt>();
  view.add(
    <Txt ref={roundIndicator} text="ROUND 17" fill={CYAN} fontFamily="monospace" fontSize={60} y={-400} opacity={0} />
  );

  const hashRound = createRef<HashRound>();
  view.add(
    <HashRound ref={hashRound} x={-100} />
  );

  yield* all(
    roundIndicator().opacity(1, 1),
    regBank().scale(1, 1, easeInOutCubic)
  );

  yield* hashRound().animateT1();
  yield* waitFor(0.5);
  yield* hashRound().animateT2();
  yield* waitFor(1);

  // --- 41: Shift registers ---
  // A cinematic shift left
  yield* all(
    regBank().position.x(-600, 1.5, easeInOutCubic),
    hashRound().position.x(-300, 1.5, easeInOutCubic)
  );

  // --- 42: Next round ---
  yield* roundIndicator().text('ROUND 18', 0.2);
  yield* all(
    regBank().position.x(-800, 1, easeInOutCubic), // accelerates
    hashRound().position.x(-500, 1, easeInOutCubic)
  );

  yield* waitFor(1);
});
