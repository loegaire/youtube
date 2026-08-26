import {makeScene2D, Node, Rect, Txt, Layout, Circle, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, chain, easeInOutCubic, sequence} from '@motion-canvas/core';
import {RegisterBank, MessageSchedule} from '../components';

export default makeScene2D(function* (view) {
  // Palette
  const BG_COLOR = '#000000';
  const TEAL = '#008080';
  const YELLOW = '#ffff00';
  const CYAN = '#00ffff';

  view.add(<Rect width={1920} height={1080} fill={BG_COLOR} />);

  // --- 22: Toy hash cracks apart -> SHA-256 ---
  const toyOne = createRef<Txt>();
  view.add(
    <Txt ref={toyOne} text="1" fill={YELLOW} fontSize={200} fontFamily="monospace" />
  );

  yield* toyOne().scale(0, 0.5, easeInOutCubic);

  const shaTitle = createRef<Txt>();
  view.add(
    <Txt ref={shaTitle} text="SHA-256" fill={YELLOW} fontSize={150} fontFamily="monospace" opacity={0} y={-300} />
  );

  yield* shaTitle().opacity(1, 1);
  yield* waitFor(0.5);

  // --- 23 & 24: Input block and Register Bank ---
  const inputBlock = createRef<Node>();
  const regBankNode = createRef<Node>();

  view.add(
    <Node ref={inputBlock} opacity={0} x={-400}>
      <Rect width={200} height={600} stroke={TEAL} lineWidth={4} fill={BG_COLOR} justifyContent="center" alignItems="center">
        <Txt text="512 BITS" fill={CYAN} rotation={-90} fontFamily="monospace" fontSize={60} />
      </Rect>
    </Node>
  );

  view.add(
    <Node ref={regBankNode} opacity={0} x={400}>
      <RegisterBank initialValues={['6a09e667','bb67ae85','3c6ef372','a54ff53a','510e527f','9b05688c','1f83d9ab','5be0cd19']} />
      <Txt text="256 BITS" fill={YELLOW} y={-350} fontFamily="monospace" fontSize={40} />
    </Node>
  );

  yield* all(
    inputBlock().opacity(1, 1),
    regBankNode().opacity(1, 1),
    shaTitle().position.y(-450, 1, easeInOutCubic)
  );

  yield* waitFor(1.5);

  yield* all(
    inputBlock().opacity(0, 0.5),
    regBankNode().opacity(0, 0.5),
    shaTitle().opacity(0, 0.5)
  );

  // --- 25 & 26: Padding ---
  const paddingGroup = createRef<Node>();
  const lengthField = createRef<Txt>();

  view.add(
    <Node ref={paddingGroup} opacity={0}>
      <Txt text="abc" fill={TEAL} y={-200} fontSize={150} fontFamily="monospace" />
      <Txt text="61 62 63" fill={CYAN} y={0} fontSize={80} fontFamily="monospace" />

      <Layout direction="row" y={200} gap={10} alignItems="center">
        <Txt text="1" fill={YELLOW} fontFamily="monospace" fontSize={50} />
        <Txt text="000...000" fill={CYAN} fontFamily="monospace" fontSize={50} />
        <Txt ref={lengthField} text="11000" fill={YELLOW} fontFamily="monospace" fontSize={50} />
      </Layout>
    </Node>
  );

  yield* paddingGroup().opacity(1, 1);
  yield* waitFor(1);

  // rack focus on length field
  yield* all(
    paddingGroup().scale(1.5, 1, easeInOutCubic),
    paddingGroup().position.y(-100, 1, easeInOutCubic),
    lengthField().scale(1.5, 1, easeInOutCubic)
  );

  yield* waitFor(1.5);
  yield* paddingGroup().opacity(0, 1);

  // --- 27 & 28: Message Schedule (16 to 64 words) ---
  const scheduleNode = createRef<MessageSchedule>();
  view.add(
    <MessageSchedule ref={scheduleNode} opacity={0} />
  );

  yield* scheduleNode().opacity(1, 1);
  yield* waitFor(0.5);

  yield* scheduleNode().expandSchedule();

  yield* waitFor(1);
  yield* scheduleNode().opacity(0, 1);

  // --- 29: Schedule generation lane ---
  const laneNode = createRef<Node>();
  view.add(
    <Node ref={laneNode} opacity={0}>
      <Txt text="W[t-16] ─┐" fill={CYAN} fontFamily="monospace" fontSize={40} x={-300} y={-50} />
      <Txt text="W[t-15] ─┼─ σ0 / σ1 ── + ── W[t-7] ── W[t-2] ──> W[t]" fill={TEAL} fontFamily="monospace" fontSize={40} x={0} y={50} />
    </Node>
  );

  yield* laneNode().opacity(1, 1);

  // Highlight sigma
  const sigmaBox = createRef<Rect>();
  view.add(
    <Rect ref={sigmaBox} width={200} height={60} x={-150} y={50} stroke={YELLOW} lineWidth={4} opacity={0} />
  );
  yield* sigmaBox().opacity(1, 0.5);
  yield* sigmaBox().scale(1.2, 0.5).to(1, 0.5);

  yield* waitFor(1.5);
});
