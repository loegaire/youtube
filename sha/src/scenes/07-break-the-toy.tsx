import {makeScene2D, Node, Rect, Txt, Layout, Circle, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';
import {TerminalWindow} from '../components';

export default makeScene2D(function* (view) {
  const BG_COLOR = '#000000';
  const TEAL = '#008080';
  const YELLOW = '#ffff00';
  const CYAN = '#00ffff';
  const RED = '#ff4d4d';

  view.add(<Rect width={1920} height={1080} fill={BG_COLOR} />);

  // --- 85: Attacking ToyHash ---
  const terminal = createRef<TerminalWindow>();
  view.add(<TerminalWindow ref={terminal} opacity={0} />);
  yield* terminal().opacity(1, 1);

  yield* terminal().typeLine('$ ./toyhash --collision');
  yield* waitFor(1);

  // --- 86 & 87: Output space ---
  const outputsNode = createRef<Node>();
  view.add(
    <Node ref={outputsNode} opacity={0}>
      <Txt text="00000000" fill={CYAN} y={-100} fontFamily="monospace" fontSize={60} />
      <Txt text="..." fill={CYAN} y={0} fontFamily="monospace" fontSize={60} />
      <Txt text="11111111" fill={CYAN} y={100} fontFamily="monospace" fontSize={60} />
      <Txt text="2^8 = 256" fill={YELLOW} y={250} fontFamily="monospace" fontSize={80} />
    </Node>
  );

  yield* all(
    terminal().opacity(0, 1),
    outputsNode().opacity(1, 1)
  );
  yield* outputsNode().scale(0.5, 2, easeInOutCubic);
  yield* waitFor(1);
  yield* outputsNode().opacity(0, 1);

  // --- 89, 90, 91: The Collision ---
  const terminalCollision = createRef<TerminalWindow>();
  view.add(<TerminalWindow ref={terminalCollision} opacity={0} y={-200} scale={0.8} />);
  yield* terminalCollision().opacity(1, 1);

  yield* terminalCollision().typeLine('$ ./toyhash y');
  terminalCollision().addStaticLine('8a', YELLOW);
  yield* waitFor(0.5);
  yield* terminalCollision().typeLine('$ ./toyhash " @"');
  terminalCollision().addStaticLine('8a', YELLOW);

  const digestNode = createRef<Node>();
  view.add(
    <Node ref={digestNode} opacity={0} y={200}>
      <Txt text="0x8a" fill={RED} fontSize={200} fontFamily="monospace" />
      <Txt text="\uf188 COLLISION FOUND" fill={RED} fontSize={80} y={150} fontFamily="monospace" />
    </Node>
  );

  yield* digestNode().opacity(1, 1);
  yield* digestNode().scale(1.2, 0.5).to(1, 0.5);

  yield* waitFor(1.5);
  yield* all(
    terminalCollision().opacity(0, 1),
    digestNode().opacity(0, 1)
  );

  // --- 93: Scales shrinking ---
  const scalesNode = createRef<Node>();
  view.add(
    <Node ref={scalesNode} opacity={0}>
      <Layout direction="column" gap={20}>
        <Txt text="2^128" fill={RED} fontFamily="monospace" fontSize={80} />
        <Txt text="2^64" fill={YELLOW} fontFamily="monospace" fontSize={80} />
        <Txt text="2^32" fill={CYAN} fontFamily="monospace" fontSize={80} />
        <Txt text="2^16" fill={CYAN} fontFamily="monospace" fontSize={80} />
        <Txt text="2^8" fill={TEAL} fontFamily="monospace" fontSize={80} />
      </Layout>
    </Node>
  );

  yield* scalesNode().opacity(1, 1);
  yield* scalesNode().scale(0.2, 2, easeInOutCubic); // zoom backward
  yield* waitFor(1);
  yield* scalesNode().opacity(0, 1);

  // --- 94, 95, 96, 97: Other ways real systems fail ---
  const intactEngine = createRef<Rect>();
  const vectors = createRef<Node>();

  view.add(
    <Rect ref={intactEngine} width={400} height={400} stroke={TEAL} lineWidth={4} fill={BG_COLOR} opacity={0}>
      <Txt text="SHA-256" fill={YELLOW} fontFamily="monospace" fontSize={60} />
    </Rect>
  );

  view.add(
    <Node ref={vectors} opacity={0}>
      <Txt text="WEAK PASSWORD" fill={RED} x={-400} y={-300} fontFamily="monospace" fontSize={40} />
      <Txt text="NO SALT" fill={RED} x={400} y={-300} fontFamily="monospace" fontSize={40} />
      <Txt text="WRONG ALGORITHM" fill={RED} x={-400} y={300} fontFamily="monospace" fontSize={40} />
      <Txt text="BAD IMPLEMENTATION" fill={RED} x={400} y={300} fontFamily="monospace" fontSize={40} />
    </Node>
  );

  yield* all(
    intactEngine().opacity(1, 1),
    vectors().opacity(1, 1)
  );
  yield* waitFor(1.5);
  yield* all(
    intactEngine().opacity(0, 1),
    vectors().opacity(0, 1)
  );

  // --- 98, 99, 100: Return to Real Engine (Accelerated Pipeline) ---
  const layerNode = createRef<Node>();
  view.add(
    <Node ref={layerNode} opacity={0}>
      <Txt text="PADDING -> 16 WORDS -> 64 WORDS -> ROUNDS 00-63 -> STATE -> DIGEST" fill={CYAN} fontFamily="monospace" fontSize={40} />
    </Node>
  );

  yield* layerNode().opacity(1, 1);
  yield* layerNode().scale(2, 2, easeInOutCubic); // cinematic fly-through
  yield* waitFor(1);
  yield* layerNode().opacity(0, 1);

  // --- 105: Security Checklist ---
  const checklist = createRef<Node>();
  view.add(
    <Node ref={checklist} opacity={0} x={-200}>
      <Layout direction="column" gap={30} alignItems="start">
        <Txt text="PLAINTEXT PASSWORD       ✗" fill={RED} fontFamily="monospace" fontSize={50} />
        <Txt text="FAST RAW SHA-256         ✗" fill={RED} fontFamily="monospace" fontSize={50} />
        <Txt text="UNIQUE SALT              ✓" fill={TEAL} fontFamily="monospace" fontSize={50} />
        <Txt text="ARGON2ID / SCRYPT / ...  ✓" fill={YELLOW} fontFamily="monospace" fontSize={50} />
        <Txt text="TUNED COST               ✓" fill={TEAL} fontFamily="monospace" fontSize={50} />
      </Layout>
    </Node>
  );

  yield* checklist().opacity(1, 1);
  yield* waitFor(1.5);
  yield* checklist().opacity(0, 1);

  // --- 111: Final words ---
  const wordsNode = createRef<Node>();
  const inputTxt = createRef<Txt>();
  const stateTxt = createRef<Txt>();
  const digestTxt = createRef<Txt>();

  view.add(
    <Node ref={wordsNode}>
      <Layout direction="column" gap={50} alignItems="center">
        <Txt ref={inputTxt} text="INPUT." fill={YELLOW} fontFamily="monospace" fontSize={150} opacity={0} />
        <Txt ref={stateTxt} text="STATE." fill={YELLOW} fontFamily="monospace" fontSize={150} opacity={0} />
        <Txt ref={digestTxt} text="DIGEST." fill={YELLOW} fontFamily="monospace" fontSize={150} opacity={0} />
      </Layout>
    </Node>
  );

  yield* inputTxt().opacity(1, 0.5);
  yield* stateTxt().opacity(1, 0.5);
  yield* digestTxt().opacity(1, 0.5);
  yield* waitFor(1);
  yield* wordsNode().opacity(0, 0); // Hard cut to black

  // --- 112: END CARD ---
  const endCard = createRef<Node>();
  view.add(
    <Node ref={endCard} opacity={0}>
      <Txt text="SHA-256" fill={TEAL} y={-100} fontFamily="monospace" fontSize={150} />
      <Txt text="512-bit blocks\n256-bit digest\n64 rounds" fill={CYAN} y={150} fontFamily="monospace" fontSize={50} />
      <Txt text="\uf023 CRYPTOGRAPHIC HASH" fill={TEAL} x={-600} y={400} fontFamily="monospace" fontSize={40} />
      <Txt text="\uf120 MOTION CANVAS" fill={TEAL} x={600} y={400} fontFamily="monospace" fontSize={40} />
    </Node>
  );

  yield* endCard().opacity(1, 1);
  yield* endCard().scale(0.95, 2, easeInOutCubic); // almost imperceptible pull-back
  yield* waitFor(1);
});
