import {makeScene2D, Node, Rect, Txt, Layout, Circle, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, chain, easeInOutCubic, sequence} from '@motion-canvas/core';
import {TerminalWindow, DatabaseViewer} from '../components';

export default makeScene2D(function* (view) {
  const BG_COLOR = '#000000';
  const TEAL = '#008080';
  const YELLOW = '#ffff00';
  const CYAN = '#00ffff';
  const RED = '#ff4d4d';

  view.add(<Rect width={1920} height={1080} fill={BG_COLOR} />);

  // --- 66: Hashing speed ---
  const terminal = createRef<TerminalWindow>();
  view.add(<TerminalWindow ref={terminal} opacity={0} />);
  yield* terminal().opacity(1, 1);

  yield* terminal().typeLine('$ openssl speed sha256');
  for (let i = 0; i < 5; i++) {
    terminal().addStaticLine(`sha256    ${Math.random().toFixed(2)}k   ${Math.random().toFixed(2)}k`);
    yield* waitFor(0.1);
  }
  yield* waitFor(1);

  // --- 67 & 68: Fast vs Argon2 ---
  const warningTxt = createRef<Txt>();
  const argonNode = createRef<Node>();

  view.add(
    <Txt ref={warningTxt} text="FAST = BAD FOR PASSWORD STORAGE" fill={RED} fontSize={80} fontFamily="monospace" opacity={0} />
  );
  view.add(
    <Node ref={argonNode} opacity={0} y={150}>
      <Rect width={800} height={200} stroke={YELLOW} lineWidth={4} fill={BG_COLOR} />
      <Txt text="CONCEPTUAL COST MODEL" fill={YELLOW} fontFamily="monospace" fontSize={50} />
    </Node>
  );

  yield* all(
    terminal().opacity(0, 1),
    warningTxt().opacity(1, 0.5)
  );
  yield* warningTxt().scale(1.2, 0.5).to(1, 0.5);

  yield* all(
    warningTxt().position.y(-200, 1, easeInOutCubic),
    argonNode().opacity(1, 1)
  );
  yield* waitFor(1.5);
  yield* all(
    warningTxt().opacity(0, 1),
    argonNode().opacity(0, 1)
  );

  // --- 69 & 70: Hashing vs Plaintext storage ---
  const dbFile = createRef<Node>();
  const attackerNode = createRef<Node>();

  view.add(
    <Node ref={dbFile} opacity={0} x={-400}>
      <Txt text="users.db" fill={CYAN} y={-100} fontFamily="monospace" fontSize={50} />
      <Txt text="alice : correct-horse-battery-staple" fill={TEAL} fontFamily="monospace" fontSize={30} />
      <Txt text="bob   : letmein123" fill={TEAL} y={50} fontFamily="monospace" fontSize={30} />
      <Txt text="\uf188" fill={RED} fontSize={80} x={300} y={-100} fontFamily="monospace" />
    </Node>
  );

  view.add(
    <Node ref={attackerNode} opacity={0} x={400}>
      <Rect width={600} height={300} stroke={RED} lineWidth={4} fill={BG_COLOR} />
      <Txt text="[ATTACKER TERMINAL]" fill={RED} y={-100} fontFamily="monospace" fontSize={30} />
      <Txt text="alice : correct-horse-battery-staple" fill={YELLOW} fontFamily="monospace" fontSize={30} />
    </Node>
  );

  yield* dbFile().opacity(1, 1);
  yield* dbFile().scale(1.2, 1, easeInOutCubic).to(1, 0.5);

  yield* attackerNode().opacity(1, 0.5); // instant copy
  yield* waitFor(1);

  // --- 71 & 72: Hashing changes the situation ---
  const sideChannels = createRef<Node>();
  view.add(
    <Node ref={sideChannels} opacity={0} y={200}>
      <Layout direction="row" gap={40}>
        <Txt text="CONFIG" fill={RED} fontFamily="monospace" fontSize={40} />
        <Txt text="LOG" fill={RED} fontFamily="monospace" fontSize={40} />
        <Txt text="BACKUP" fill={RED} fontFamily="monospace" fontSize={40} />
        <Txt text="MEMORY DUMP" fill={RED} fontFamily="monospace" fontSize={40} />
      </Layout>
    </Node>
  );

  yield* all(
    dbFile().opacity(0, 0.5),
    attackerNode().opacity(0, 0.5),
    sideChannels().opacity(1, 1)
  );
  yield* waitFor(1.5);
  yield* sideChannels().opacity(0, 1);

  // --- 73: Decision Matrix ---
  const matrix = createRef<Node>();
  view.add(
    <Node ref={matrix} opacity={0}>
      <Layout direction="column" gap={30} alignItems="start" x={-400}>
        <Txt text="FILE INTEGRITY       -> SHA-256" fill={CYAN} fontFamily="monospace" fontSize={40} />
        <Txt text="DIGITAL SIGNATURE    -> HASH + SIGNATURE SCHEME" fill={YELLOW} fontFamily="monospace" fontSize={40} />
        <Txt text="HASH TABLE           -> HASH FUNCTION" fill={CYAN} fontFamily="monospace" fontSize={40} />
        <Txt text="PASSWORD STORAGE     -> ARGON2ID / SCRYPT / BCRYPT / PBKDF2" fill={YELLOW} fontFamily="monospace" fontSize={40} />
      </Layout>
    </Node>
  );

  yield* matrix().opacity(1, 1);
  yield* waitFor(1.5);
  yield* matrix().opacity(0, 1);

  // --- 74 & 75: Breaking SHA & Attack paths ---
  const question = createRef<Txt>();
  view.add(
    <Txt ref={question} text="?" fill={RED} fontSize={400} fontFamily="monospace" opacity={0} />
  );

  yield* question().opacity(1, 0.5);
  yield* question().scale(1.5, 0.5, easeInOutCubic).to(1, 0.5);

  const labelsGroup = createRef<Node>();
  view.add(
    <Node ref={labelsGroup} opacity={0}>
      <Txt text="COLLISION" fill={RED} x={-400} y={-200} fontFamily="monospace" fontSize={50} />
      <Txt text="PREIMAGE" fill={YELLOW} x={400} y={-200} fontFamily="monospace" fontSize={50} />
      <Txt text="SECOND PREIMAGE" fill={YELLOW} x={-400} y={200} fontFamily="monospace" fontSize={50} />
      <Txt text="IMPLEMENTATION / MISUSE" fill={CYAN} x={400} y={200} fontFamily="monospace" fontSize={50} />
    </Node>
  );

  yield* all(
    question().opacity(0, 0.5),
    labelsGroup().opacity(1, 1)
  );
  yield* waitFor(1);
  yield* labelsGroup().opacity(0, 1);

  // --- 76, 77, 78: Collision Attacks ---
  const collisionNode = createRef<Node>();
  view.add(
    <Node ref={collisionNode} opacity={0}>
      <Rect width={200} height={100} x={-300} y={-200} stroke={TEAL} lineWidth={4}><Txt text="FILE 1" fill={CYAN} fontFamily="monospace" /></Rect>
      <Rect width={200} height={100} x={300} y={-200} stroke={TEAL} lineWidth={4}><Txt text="FILE 2" fill={CYAN} fontFamily="monospace" /></Rect>
      <Line points={[[-300,-150], [0,0]]} stroke={RED} lineWidth={4} arrowSize={20} endArrow />
      <Line points={[[300,-150], [0,0]]} stroke={RED} lineWidth={4} arrowSize={20} endArrow />
      <Txt text="SHA-1 COLLISION" fill={RED} fontSize={80} fontFamily="monospace" y={100} />
    </Node>
  );

  yield* collisionNode().opacity(1, 1);
  yield* collisionNode().scale(0.5, 2, easeInOutCubic); // Violently pull backward
  yield* waitFor(1);
  yield* collisionNode().opacity(0, 1);

  // --- 79, 80: Preimage Scales ---
  const scales = createRef<Node>();
  view.add(
    <Node ref={scales} opacity={0}>
      <Txt text="2^256" fill={YELLOW} x={-300} fontSize={200} fontFamily="monospace" />
      <Txt text="2^128" fill={RED} x={300} fontSize={200} fontFamily="monospace" />
    </Node>
  );

  yield* scales().opacity(1, 1);
  yield* scales().scale(1.5, 2, easeInOutCubic);
  yield* waitFor(1);
  yield* scales().opacity(0, 1);

  // --- 82, 83, 84: Not SHA-1 ---
  const algoTrees = createRef<Node>();
  view.add(
    <Node ref={algoTrees} opacity={0}>
      <Layout direction="column" gap={20} x={-300}>
        <Txt text="SHA-1" fill={RED} fontFamily="monospace" fontSize={80} />
        <Txt text="[COLLISION]" fill={RED} fontFamily="monospace" fontSize={40} />
      </Layout>
      <Layout direction="column" gap={20} x={300}>
        <Txt text="SHA-2 / SHA-256" fill={YELLOW} fontFamily="monospace" fontSize={80} />
        <Txt text="[SECURE]" fill={TEAL} fontFamily="monospace" fontSize={40} />
      </Layout>
    </Node>
  );

  yield* algoTrees().opacity(1, 1);
  yield* waitFor(1.5);
});
