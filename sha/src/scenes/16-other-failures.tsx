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


  // Shot 94
  caption().set("And here is the part people often miss: real-world hash failures are frequently caused by using a good primitive incorrectly.");
  const stage_94 = createRef<Node>();
  const visual_94 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_94} opacity={0}>
      <ScriptShot ref={visual_94} scene={16} shot="94" y={-20} />
    </Node>
  );
  yield* all(stage_94().opacity(1, 1.3500), stage_94().position.x(-55, 4.5000, easeInOutCubic), stage_94().scale(1.04, 4.5000, easeInOutCubic), visual_94().animateData(4.5000));
  yield* waitFor(1.3500);
  yield* stage_94().opacity(0, 1.6500);
  stage_94().remove();

  // Shot 95
  caption().set("A cryptographically strong hash does not turn a weak password into a strong password.");
  const stage_95 = createRef<Node>();
  const visual_95 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_95} opacity={0}>
      <ScriptShot ref={visual_95} scene={16} shot="95" y={-20} />
    </Node>
  );
  yield* all(stage_95().opacity(1, 0.9468), stage_95().position.x(55, 3.1560, easeInOutCubic), stage_95().scale(1.04, 3.1560, easeInOutCubic), visual_95().animateData(3.1560));
  yield* waitFor(0.9468);
  yield* stage_95().opacity(0, 1.1572);
  stage_95().remove();

  // Shot 96
  caption().set("A plain fast hash also does not provide the work factor required for modern password storage.");
  const stage_96 = createRef<Node>();
  const visual_96 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_96} opacity={0}>
      <ScriptShot ref={visual_96} scene={16} shot="96" y={-20} />
    </Node>
  );
  yield* all(stage_96().opacity(1, 1.2636), stage_96().position.x(-55, 4.2120, easeInOutCubic), stage_96().scale(1.04, 4.2120, easeInOutCubic), visual_96().animateData(4.2120));
  yield* waitFor(1.2636);
  yield* stage_96().opacity(0, 1.5444);
  stage_96().remove();

  // Shot 97
  caption().set("And collisions do not let an attacker magically recover an original password from SHA-256. Collision resistance, preimage resistance, and password guessing are different problems.");
  const stage_97 = createRef<Node>();
  const visual_97 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_97} opacity={0}>
      <ScriptShot ref={visual_97} scene={16} shot="97" y={-20} />
    </Node>
  );
  yield* all(stage_97().opacity(1, 2.2140), stage_97().position.x(55, 7.3800, easeInOutCubic), stage_97().scale(1.04, 7.3800, easeInOutCubic), visual_97().animateData(7.3800));
  yield* waitFor(2.2140);
  yield* stage_97().opacity(0, 2.7060);
  stage_97().remove();

});
