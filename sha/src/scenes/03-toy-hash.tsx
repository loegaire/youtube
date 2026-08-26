import {makeScene2D, Node, Rect, Txt, Layout, Circle, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, chain, easeInOutCubic, sequence} from '@motion-canvas/core';
import {BitStrip} from '../components';

export default makeScene2D(function* (view) {
  // Palette
  const BG_COLOR = '#000000';
  const TEAL = '#008080';
  const YELLOW = '#ffff00';
  const CYAN = '#00ffff';
  const RED = '#ff4d4d';

  view.add(<Rect width={1920} height={1080} fill={BG_COLOR} />);

  // --- 16: Count number of 1 bits ---
  const bitStrip = createRef<BitStrip>();
  const counterTxt = createRef<Txt>();
  const bitStripGroup = createRef<Node>();

  view.add(
    <Node ref={bitStripGroup}>
      <BitStrip ref={bitStrip} bits="10110010" />
      <Txt ref={counterTxt} text="0" fill={YELLOW} fontFamily="monospace" fontSize={100} y={150} opacity={0} />
    </Node>
  );

  yield* counterTxt().opacity(1, 0.5);
  yield* bitStrip().highlightOnes(counterTxt());
  yield* waitFor(1);

  // --- 17 & 18: Modulo operation and extreme compression ---
  const moduloNode = createRef<Node>();
  const resultBit = createRef<Txt>();
  const fixedLabel = createRef<Txt>();

  view.add(
    <Node ref={moduloNode} opacity={0}>
      <Txt text="mod 2 =" fill={CYAN} fontFamily="monospace" fontSize={100} x={-150} y={300} />
      <Txt ref={resultBit} text="1" fill={YELLOW} fontFamily="monospace" fontSize={100} x={150} y={300} />
    </Node>
  );

  yield* moduloNode().opacity(1, 1);
  yield* waitFor(1);

  yield* all(
    bitStripGroup().scale(0.1, 2, easeInOutCubic),
    moduloNode().position.y(-300, 2, easeInOutCubic),
    moduloNode().scale(2, 2, easeInOutCubic),
    counterTxt().opacity(0, 1)
  );

  view.add(
    <Node opacity={0} ref={fixedLabel}>
      <Txt text="FIXED OUTPUT" fill={TEAL} y={100} fontFamily="monospace" fontSize={40} />
      <Txt text="1 BIT" fill={YELLOW} y={150} fontFamily="monospace" fontSize={40} />
    </Node>
  );
  yield* fixedLabel().opacity(1, 1);
  yield* waitFor(1.5);

  yield* all(
    bitStripGroup().opacity(0, 1),
    moduloNode().opacity(0, 1),
    fixedLabel().opacity(0, 1)
  );

  // --- 19: Cascading collisions ---
  const cascadeGroup = createRef<Node>();
  view.add(
    <Node ref={cascadeGroup} opacity={0}>
      <Rect width={400} height={800} x={-400} y={-200} fill={RED} stroke={TEAL} lineWidth={4} opacity={0.3} />
      <Txt text="0" fill={CYAN} x={-400} y={300} fontSize={200} fontFamily="monospace" />
      <Rect width={400} height={800} x={400} y={-200} fill={RED} stroke={TEAL} lineWidth={4} opacity={0.3} />
      <Txt text="1" fill={CYAN} x={400} y={300} fontSize={200} fontFamily="monospace" />
    </Node>
  );

  yield* cascadeGroup().opacity(1, 1);
  yield* waitFor(1.5);

  // --- 20: Triangular security diagram ---
  const triangleGroup = createRef<Node>();
  view.add(
    <Node ref={triangleGroup} opacity={0}>
      <Txt text="PREIMAGE" fill={YELLOW} x={0} y={-200} fontSize={60} fontFamily="monospace" />
      <Txt text="SECOND PREIMAGE" fill={YELLOW} x={-300} y={200} fontSize={60} fontFamily="monospace" />
      <Txt text="COLLISION" fill={RED} x={300} y={200} fontSize={60} fontFamily="monospace" />

      <Line points={[[0, -150], [-250, 150]]} stroke={TEAL} lineWidth={4} />
      <Line points={[[-250, 150], [250, 150]]} stroke={TEAL} lineWidth={4} />
      <Line points={[[250, 150], [0, -150]]} stroke={TEAL} lineWidth={4} />
    </Node>
  );

  yield* all(
    cascadeGroup().opacity(0, 1),
    triangleGroup().opacity(1, 1)
  );
  yield* waitFor(1.5);

  // --- 21: Attack paths blocked ---
  const digestNode = createRef<Rect>();
  const matrixNode = createRef<Node>();

  view.add(
    <Node>
      <Rect ref={digestNode} width={200} height={100} fill={TEAL} opacity={0}>
        <Txt text="DIGEST" fill={BG_COLOR} fontFamily="monospace" />
      </Rect>
      <Node ref={matrixNode} opacity={0}>
        <Rect width={400} height={400} stroke={YELLOW} lineWidth={8} radius={40} />
      </Node>
    </Node>
  );

  yield* all(
    triangleGroup().opacity(0, 1),
    digestNode().opacity(1, 1)
  );

  // Simulating attack paths hitting the matrix
  const attack1 = createRef<Line>();
  const attack2 = createRef<Line>();
  const attack3 = createRef<Line>();

  view.add(
    <Node opacity={1}>
      <Line ref={attack1} points={[[-600, 0], [-250, 0]]} stroke={RED} lineWidth={10} arrowSize={20} endArrow opacity={0} />
      <Line ref={attack2} points={[[0, -400], [0, -250]]} stroke={RED} lineWidth={10} arrowSize={20} endArrow opacity={0} />
      <Line ref={attack3} points={[[600, 0], [250, 0]]} stroke={RED} lineWidth={10} arrowSize={20} endArrow opacity={0} />
    </Node>
  );

  yield* all(
    matrixNode().opacity(1, 0.5),
    attack1().opacity(1, 0.5),
    attack2().opacity(1, 0.5),
    attack3().opacity(1, 0.5)
  );

  yield* matrixNode().rotation(360, 2, easeInOutCubic);

  yield* waitFor(1.5);
});
