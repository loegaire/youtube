import {makeScene2D, Node, Rect, Txt, Layout, Circle, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, chain, easeInOutCubic, sequence} from '@motion-canvas/core';
import {TerminalWindow, DatabaseViewer, CodeEditor} from '../components';

export default makeScene2D(function* (view) {
  // Palette
  const BG_COLOR = '#000000';
  const TEAL = '#008080';
  const YELLOW = '#ffff00';
  const CYAN = '#00ffff';
  const RED = '#ff4d4d';

  view.add(<Rect width={1920} height={1080} fill={BG_COLOR} />);

  // --- 05: Passwords (Terminal and DB Viewer) ---
  const terminal = createRef<TerminalWindow>();
  const dbViewer = createRef<DatabaseViewer>();

  view.add(
    <Node>
      <TerminalWindow ref={terminal} x={-450} scale={0.8} opacity={0} />
      <DatabaseViewer ref={dbViewer} x={450} scale={0.8} opacity={0} />
    </Node>
  );

  yield* all(
    terminal().opacity(1, 0.5),
    dbViewer().opacity(1, 0.5)
  );

  yield* terminal().typeLine('$ tail -f auth.log');
  yield* terminal().typeLine('login: correct-horse-battery-staple');

  // Password flowing into digest
  const pwTxt = createRef<Txt>();
  view.add(
    <Txt ref={pwTxt} text="correct-horse-battery-staple" fill={CYAN} fontFamily="monospace" fontSize={30} x={-450} y={150} />
  );

  yield* pwTxt().position.x(200, 1, easeInOutCubic);
  yield* pwTxt().opacity(0, 0.5);

  dbViewer().addRow('alice', 'a1b2', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f');

  yield* waitFor(1);

  // --- 06: Split-screen comparison ---
  yield* all(
    terminal().opacity(0, 0.5),
    dbViewer().position.x(0, 1, easeInOutCubic)
  );

  const splitScreen = createRef<Node>();
  view.add(
    <Node ref={splitScreen} opacity={0} y={150}>
      <Rect width={800} height={300} x={-400} stroke={RED} lineWidth={4} fill={BG_COLOR}>
        <Txt text="PLAINTEXT" fill={RED} y={-100} fontFamily="monospace" />
        <Txt text="\uf00d" fill={RED} fontSize={80} fontFamily="monospace" />
      </Rect>
      <Rect width={800} height={300} x={400} stroke={YELLOW} lineWidth={4} fill={BG_COLOR}>
        <Txt text="VERIFIER" fill={YELLOW} y={-100} fontFamily="monospace" />
        <Txt text="\uf00c" fill={YELLOW} fontSize={80} fontFamily="monospace" />
      </Rect>
    </Node>
  );

  yield* splitScreen().opacity(1, 1);
  yield* waitFor(1);

  // --- 07: Too fast for password storage ---
  const fastWarning = createRef<Txt>();
  view.add(
    <Txt ref={fastWarning} text="TOO FAST FOR PASSWORD STORAGE" fill={RED} fontSize={80} fontFamily="monospace" opacity={0} />
  );

  yield* fastWarning().opacity(1, 0.2);
  yield* fastWarning().scale(1.2, 0.1).to(1, 0.1);
  yield* waitFor(0.5);

  yield* all(
    fastWarning().text('ARGON2ID / SCRYPT / BCRYPT / PBKDF2', 0.1),
    fastWarning().fill(YELLOW, 0.1)
  );

  yield* waitFor(1);
  yield* all(
    splitScreen().opacity(0, 0.5),
    fastWarning().opacity(0, 0.5),
    dbViewer().opacity(0, 0.5)
  );

  // --- 08: File integrity ---
  terminal().textContainer().removeChildren();
  yield* all(
    terminal().position.x(0, 0),
    terminal().opacity(1, 1)
  );

  yield* terminal().typeLine('$ sha256sum debian-image.iso');
  yield* terminal().typeLine('1a2b3c4d5e6f7g8h9i0j...  debian-image.iso');

  // Trusted value slide in
  const trustedValue = createRef<Txt>();
  view.add(
    <Txt ref={trustedValue} text="1a2b3c4d5e6f7g8h9i0j..." fill={TEAL} fontFamily="monospace" fontSize={40} y={150} opacity={0} />
  );
  yield* trustedValue().opacity(1, 0.5);

  const scanLine = createRef<Line>();
  view.add(
    <Line ref={scanLine} points={[[-400, 0], [-400, 200]]} stroke={TEAL} lineWidth={4} x={-300} opacity={0} />
  );

  yield* scanLine().opacity(1, 0.2);
  yield* scanLine().position.x(300, 1.5, easeInOutCubic);
  yield* scanLine().opacity(0, 0.2);

  // --- 09: Changing one bit ---
  yield* trustedValue().text('CHANGE 1 BIT -> AVALANCHE EFFECT', 0.5);
  yield* waitFor(1);

  yield* all(
    terminal().opacity(0, 0.5),
    trustedValue().opacity(0, 0.5)
  );

  // --- 10 & 11: Digital Signatures ---
  const sigNode = createRef<Node>();
  view.add(
    <Node ref={sigNode} opacity={0}>
      <Rect width={400} height={300} x={-300} stroke={TEAL} lineWidth={4} fill={BG_COLOR}>
        <Txt text="PACKAGE" fill={CYAN} fontFamily="monospace" />
      </Rect>
      <Rect width={400} height={300} x={300} stroke={TEAL} lineWidth={4} fill={BG_COLOR}>
        <Txt text="SIGNATURE" fill={YELLOW} fontFamily="monospace" />
      </Rect>
      <Txt text="AUTHENTIC + UNMODIFIED" fill={YELLOW} y={250} fontFamily="monospace" fontSize={50} />
    </Node>
  );

  yield* sigNode().opacity(1, 1);
  yield* waitFor(1);
  yield* sigNode().opacity(0, 0.5);

  // --- 12: Network/systems checks ---
  const packetInspector = createRef<Rect>();
  view.add(
    <Rect ref={packetInspector} width={1200} height={400} stroke={TEAL} lineWidth={4} fill={BG_COLOR} opacity={0}>
      <Txt text="[PACKET INSPECTOR]\nSRC: 192.168.1.1  DST: 10.0.0.1  PAYLOAD: 0xDEADBEEF\nDIGEST: 5f4dcc3b5aa765d61d8327deb882cf99" fill={CYAN} fontFamily="monospace" />
    </Rect>
  );

  yield* packetInspector().opacity(1, 1);
  yield* waitFor(1);
  yield* packetInspector().opacity(0, 0.5);

  // --- 13 & 14: Hash Tables ---
  const codeEditor = createRef<CodeEditor>();
  view.add(<CodeEditor ref={codeEditor} opacity={0} />);
  codeEditor().setCode('unordered_map<string, int> users;\n\nusers["alice"] = 1;\nusers["bob"] = 2;');

  yield* codeEditor().opacity(1, 1);
  yield* waitFor(1);

  const hashGoals = createRef<Node>();
  view.add(
    <Node ref={hashGoals} opacity={0} y={200}>
      <Txt text="HASH TABLE -> SPEED" fill={CYAN} x={-400} fontFamily="monospace" />
      <Txt text="CRYPTOGRAPHIC HASH -> SECURITY" fill={YELLOW} x={400} fontFamily="monospace" />
    </Node>
  );

  yield* hashGoals().opacity(1, 1);
  yield* waitFor(1);

  yield* all(
    codeEditor().opacity(0, 0.5),
    hashGoals().opacity(0, 0.5)
  );

  // --- 15: From one bit -> SHA-256 ---
  const finalTitle = createRef<Txt>();
  view.add(
    <Txt ref={finalTitle} text="FROM ONE BIT -> SHA-256" fill={YELLOW} fontFamily="monospace" fontSize={80} opacity={0} />
  );

  yield* finalTitle().opacity(1, 1);
  yield* waitFor(1.5);
});
