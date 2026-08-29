import {makeScene2D, Node, Txt, Rect, Circle, Line} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {
  C, FONT, TechPanel, bg, bytePacket, label, rail, register, Caption,
  LoginPanel, TerminalWindow, CodeEditor, DatabaseViewer, RegisterBank,
  MessageSchedule, BitStrip, HashRound, ScriptShot
} from '../components';


export default makeScene2D(function* (view) {
  view.add(<Node>{bg()}</Node>);
  const caption = createRef<Caption>();
  view.add(<Caption ref={caption} />);


  // Shot 16
  caption().set("Forget SHA-256 for a moment. Imagine the entire hash function is just this: count the number of one-bits.");
  const stage_16 = createRef<Node>();
  const visual_16 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_16} opacity={0}>
      <ScriptShot ref={visual_16} scene={3} shot="16" y={-20} />
    </Node>
  );
  yield* all(stage_16().opacity(1, 1.9260), stage_16().position.x(-55, 6.4200, easeInOutCubic), stage_16().scale(1.04, 6.4200, easeInOutCubic), visual_16().animateData(6.4200));
  yield* waitFor(1.9260);
  yield* stage_16().opacity(0, 2.3540);
  stage_16().remove();

  // Shot 17
  caption().set("If the count is odd, output one. If it is even, output zero.");
  const stage_17 = createRef<Node>();
  const visual_17 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_17} opacity={0}>
      <ScriptShot ref={visual_17} scene={3} shot="17" y={-20} />
    </Node>
  );
  yield* all(stage_17().opacity(1, 1.0908), stage_17().position.x(55, 3.6360, easeInOutCubic), stage_17().scale(1.04, 3.6360, easeInOutCubic), visual_17().animateData(3.6360));
  yield* waitFor(1.0908);
  yield* stage_17().opacity(0, 1.3332);
  stage_17().remove();

  // Shot 18
  caption().set("That is technically a hash.");
  const stage_18 = createRef<Node>();
  const visual_18 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_18} opacity={0}>
      <ScriptShot ref={visual_18} scene={3} shot="18" y={-20} />
    </Node>
  );
  yield* all(stage_18().opacity(1, 0.5724), stage_18().position.x(-55, 1.9080, easeInOutCubic), stage_18().scale(1.04, 1.9080, easeInOutCubic), visual_18().animateData(1.9080));
  yield* waitFor(0.5724);
  yield* stage_18().opacity(0, 0.6996);
  stage_18().remove();

  // Shot 19
  caption().set("But it is a terrible cryptographic hash, because millions of different inputs can produce exactly the same answer.");
  const stage_19 = createRef<Node>();
  const visual_19 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_19} opacity={0}>
      <ScriptShot ref={visual_19} scene={3} shot="19" y={-20} />
    </Node>
  );
  yield* all(stage_19().opacity(1, 1.8972), stage_19().position.x(55, 6.3240, easeInOutCubic), stage_19().scale(1.04, 6.3240, easeInOutCubic), visual_19().animateData(6.3240));
  yield* waitFor(1.8972);
  yield* stage_19().opacity(0, 2.3188);
  stage_19().remove();

  // Shot 20
  caption().set("This gives us the first security lesson: compression is not enough. Security comes from how difficult it is to manipulate that compressed result in useful ways.");
  const stage_20 = createRef<Node>();
  const visual_20 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_20} opacity={0}>
      <ScriptShot ref={visual_20} scene={3} shot="20" y={-20} />
    </Node>
  );
  yield* all(stage_20().opacity(1, 2.3580), stage_20().position.x(-55, 7.8600, easeInOutCubic), stage_20().scale(1.04, 7.8600, easeInOutCubic), visual_20().animateData(7.8600));
  yield* waitFor(2.3580);
  yield* stage_20().opacity(0, 2.8820);
  stage_20().remove();

  // Shot 21
  caption().set("A cryptographic hash is expected to make finding a chosen input, a second matching input, or a useful collision computationally infeasible.");
  const stage_21 = createRef<Node>();
  const visual_21 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_21} opacity={0}>
      <ScriptShot ref={visual_21} scene={3} shot="21" y={-20} />
    </Node>
  );
  yield* all(stage_21().opacity(1, 2.3292), stage_21().position.x(55, 7.7640, easeInOutCubic), stage_21().scale(1.04, 7.7640, easeInOutCubic), visual_21().animateData(7.7640));
  yield* waitFor(2.3292);
  yield* stage_21().opacity(0, 2.8468);
  stage_21().remove();

});
