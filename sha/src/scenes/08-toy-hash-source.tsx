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


  // Shot 49
  caption().set("Now let\u2019s build something ourselves. Not SHA-256\u2014because reproducing a secure production hash from scratch is a cryptography project\u2014but a deliberately tiny teaching hash that lets us watch every operation.");
  const stage_49 = createRef<Node>();
  const visual_49 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_49} opacity={0}>
      <ScriptShot ref={visual_49} scene={8} shot="49" y={-20} />
    </Node>
  );
  yield* all(stage_49().opacity(1, 3.3372), stage_49().position.x(55, 11.1240, easeInOutCubic), stage_49().scale(1.04, 11.1240, easeInOutCubic), visual_49().animateData(11.1240));
  yield* waitFor(3.3372);
  yield* stage_49().opacity(0, 4.0788);
  stage_49().remove();

  // Shot 50
  caption().set("Call it `ToyHash8`.");
  const stage_50 = createRef<Node>();
  const visual_50 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_50} opacity={0}>
      <ScriptShot ref={visual_50} scene={8} shot="50" y={-20} />
    </Node>
  );
  yield* all(stage_50().opacity(1, 0.4284), stage_50().position.x(-55, 1.4280, easeInOutCubic), stage_50().scale(1.04, 1.4280, easeInOutCubic), visual_50().animateData(1.4280));
  yield* waitFor(0.4284);
  yield* stage_50().opacity(0, 0.5236);
  stage_50().remove();

  // Shot 51
  caption().set("We start with an eight-bit state.");
  const stage_51 = createRef<Node>();
  const visual_51 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_51} opacity={0}>
      <ScriptShot ref={visual_51} scene={8} shot="51" y={-20} />
    </Node>
  );
  yield* all(stage_51().opacity(1, 0.6876), stage_51().position.x(55, 2.2920, easeInOutCubic), stage_51().scale(1.04, 2.2920, easeInOutCubic), visual_51().animateData(2.2920));
  yield* waitFor(0.6876);
  yield* stage_51().opacity(0, 0.8404);
  stage_51().remove();

  // Shot 52
  caption().set("For every input byte, XOR it with the state, add a constant, then rotate the result left by three bits.");
  const stage_52 = createRef<Node>();
  const visual_52 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_52} opacity={0}>
      <ScriptShot ref={visual_52} scene={8} shot="52" y={-20} />
    </Node>
  );
  yield* all(stage_52().opacity(1, 1.8108), stage_52().position.x(-55, 6.0360, easeInOutCubic), stage_52().scale(1.04, 6.0360, easeInOutCubic), visual_52().animateData(6.0360));
  yield* waitFor(1.8108);
  yield* stage_52().opacity(0, 2.2132);
  stage_52().remove();

  // Shot 53
  caption().set("That is the entire function.");
  const stage_53 = createRef<Node>();
  const visual_53 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_53} opacity={0}>
      <ScriptShot ref={visual_53} scene={8} shot="53" y={-20} />
    </Node>
  );
  yield* all(stage_53().opacity(1, 0.6012), stage_53().position.x(55, 2.0040, easeInOutCubic), stage_53().scale(1.04, 2.0040, easeInOutCubic), visual_53().animateData(2.0040));
  yield* waitFor(0.6012);
  yield* stage_53().opacity(0, 0.7348);
  stage_53().remove();

});
