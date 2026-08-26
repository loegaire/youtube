import {makeScene2D, Node, Rect, Txt, View2D, Circle, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, chain, easeInOutCubic, sequence} from '@motion-canvas/core';
import {LoginPanel} from '../components/LoginPanel';

export default makeScene2D(function* (view) {
  // Colors based on rules
  const BG_COLOR = '#000000';
  const TEAL = '#008080';
  const YELLOW = '#ffff00';
  const CYAN = '#00ffff';

  // Scene elements
  const lockIcon = createRef<Txt>();
  const loginPanel = createRef<LoginPanel>();
  const bulletContainer = createRef<Node>();

  const byteTxts: Txt[] = [];
  const byteStrings = ['68', '75', '6E', '74', '65', '72', '32'];

  view.add(
    <Node>
      <Rect width={1920} height={1080} fill={BG_COLOR} />

      {/* 01: Lock icon */}
      <Txt
        ref={lockIcon}
        text="\uf023"
        fontFamily="monospace"
        fill={CYAN}
        fontSize={10} // Tiny point
        opacity={1}
      />

      {/* 01: Login Panel (initially hidden) */}
      <LoginPanel
        ref={loginPanel}
        opacity={0}
        scale={0.1}
      />

      {/* 02: Bullet elements for the transition */}
      <Node ref={bulletContainer} opacity={0}>
        {byteStrings.map((byte, i) => {
          const t = createRef<Txt>();
          byteTxts.push(t());
          return (
            <Txt
              ref={t}
              text="•"
              fill={TEAL}
              fontFamily="monospace"
              fontSize={100}
              x={(i - 3) * 80}
              y={0}
            />
          );
        })}
      </Node>
    </Node>
  );

  // 01: Macro push-in and expand to login
  yield* all(
    lockIcon().scale(50, 2),
    lockIcon().opacity(0, 2, easeInOutCubic)
  );

  yield* all(
    loginPanel().opacity(1, 1),
    loginPanel().scale(1, 1, easeInOutCubic)
  );

  // 01: Cursor types hunter2
  yield* loginPanel().typePassword('hunter2');

  // 01: Transform into bullets
  yield* loginPanel().transformToBullets();

  // 02: Freeze login, push through bullets
  yield* loginPanel().scale(3, 2, easeInOutCubic);
  yield* loginPanel().opacity(0, 1);

  yield* bulletContainer().opacity(1, 0.5);
  yield* bulletContainer().scale(2, 2);

  // 02: Break apart into ASCII byte values
  yield* sequence(
    0.1,
    ...byteTxts.map((textRef, i) => textRef.text(byteStrings[i], 0.5))
  );

  // 02: Byte stream accelerates into cyan tunnel
  const tunnel = createRef<Node>();
  view.add(
    <Node ref={tunnel} opacity={0}>
      <Rect width={1000} height={200} stroke={CYAN} lineWidth={4} />
      <Txt text="PROCESSING..." fill={CYAN} fontFamily="monospace" y={-150} fontSize={40} />
    </Node>
  );

  yield* all(
    bulletContainer().scale(0.2, 2, easeInOutCubic),
    tunnel().opacity(1, 1)
  );

  // 02: Fold into long 64-character hexadecimal digest
  const digestTxt = createRef<Txt>();
  const digestStr = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
  view.add(
    <Txt
      ref={digestTxt}
      text={digestStr}
      fill={CYAN}
      fontFamily="monospace"
      fontSize={30}
      opacity={0}
      y={150}
    />
  );

  yield* all(
    tunnel().opacity(0, 1),
    bulletContainer().opacity(0, 1),
    digestTxt().opacity(1, 2)
  );

  // 03: Orbiting environments
  const orbitGroup = createRef<Node>();
  const title1 = createRef<Txt>();
  const title2 = createRef<Txt>();

  view.add(
    <Node ref={orbitGroup} opacity={0}>
      <Txt text="[Laptop]" fill={CYAN} fontFamily="monospace" x={-400} y={-200} />
      <Txt text="[Download]" fill={CYAN} fontFamily="monospace" x={400} y={-200} />
      <Txt text="[Packet Capture]" fill={CYAN} fontFamily="monospace" x={-400} y={200} />
      <Txt text="[Code Editor]" fill={CYAN} fontFamily="monospace" x={400} y={200} />
      <Txt text="[Database]" fill={CYAN} fontFamily="monospace" y={300} />
    </Node>
  );

  view.add(
    <Node>
      <Txt ref={title1} text="HASH FUNCTIONS" fill={TEAL} fontFamily="monospace" fontSize={80} y={-300} opacity={0} />
      <Txt ref={title2} text="SHA-2" fill={YELLOW} fontFamily="monospace" fontSize={60} y={-200} opacity={0} />
    </Node>
  );

  yield* all(
    digestTxt().rotation(90, 1),
    orbitGroup().opacity(1, 1),
    orbitGroup().rotation(360, 4, easeInOutCubic),
    title1().opacity(1, 1),
    title2().opacity(1, 1)
  );

  // 04: Whip-pan to black workspace and assemble HASH
  const hashTxt = createRef<Txt>();
  view.add(
    <Txt ref={hashTxt} text="" fill={TEAL} fontFamily="monospace" fontSize={120} opacity={0} />
  );

  yield* all(
    digestTxt().position.x(-2000, 1, easeInOutCubic),
    orbitGroup().position.x(-2000, 1, easeInOutCubic),
    title1().position.x(-2000, 1, easeInOutCubic),
    title2().position.x(-2000, 1, easeInOutCubic)
  );

  yield* hashTxt().opacity(1, 0.5);
  yield* hashTxt().text('HASH', 1);

  yield* waitFor(1);
});
