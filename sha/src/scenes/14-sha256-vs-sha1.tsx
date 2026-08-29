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


  // Shot 82
  caption().set("This distinction matters because SHA-1 and SHA-256 are not interchangeable just because both start with the letters S-H-A.");
  const stage_82 = createRef<Node>();
  const visual_82 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_82} opacity={0}>
      <ScriptShot ref={visual_82} scene={14} shot="82" y={-20} />
    </Node>
  );
  yield* all(stage_82().opacity(1, 1.2924), stage_82().position.x(-55, 4.3080, easeInOutCubic), stage_82().scale(1.04, 4.3080, easeInOutCubic), visual_82().animateData(4.3080));
  yield* waitFor(1.2924);
  yield* stage_82().opacity(0, 1.5796);
  stage_82().remove();

  // Shot 83
  caption().set("NIST currently lists SHA-256 among the acceptable SHA-2 hash functions, and its published security-strength guidance gives SHA-256 128-bit collision strength and 256-bit preimage strength.");
  const stage_83 = createRef<Node>();
  const visual_83 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_83} opacity={0}>
      <ScriptShot ref={visual_83} scene={14} shot="83" y={-20} />
    </Node>
  );
  yield* all(stage_83().opacity(1, 2.8476), stage_83().position.x(55, 9.4920, easeInOutCubic), stage_83().scale(1.04, 9.4920, easeInOutCubic), visual_83().animateData(9.4920));
  yield* waitFor(2.8476);
  yield* stage_83().opacity(0, 3.4804);
  stage_83().remove();

  // Shot 84
  caption().set("So the story is not \u2018SHA is broken.\u2019 The story is that different versions, attack goals, and applications have different security margins.");
  const stage_84 = createRef<Node>();
  const visual_84 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_84} opacity={0}>
      <ScriptShot ref={visual_84} scene={14} shot="84" y={-20} />
    </Node>
  );
  yield* all(stage_84().opacity(1, 1.7244), stage_84().position.x(-55, 5.7480, easeInOutCubic), stage_84().scale(1.04, 5.7480, easeInOutCubic), visual_84().animateData(5.7480));
  yield* waitFor(1.7244);
  yield* stage_84().opacity(0, 2.1076);
  stage_84().remove();

});
