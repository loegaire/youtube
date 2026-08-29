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


  // Shot 43
  caption().set("And this happens sixty-four times for each 512-bit block.");
  const stage_43 = createRef<Node>();
  const visual_43 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_43} opacity={0}>
      <ScriptShot ref={visual_43} scene={6} shot="43" y={-20} />
    </Node>
  );
  yield* all(stage_43().opacity(1, 0.8028), stage_43().position.x(55, 2.6760, easeInOutCubic), stage_43().scale(1.04, 2.6760, easeInOutCubic), visual_43().animateData(2.6760));
  yield* waitFor(0.8028);
  yield* stage_43().opacity(0, 0.9812);
  stage_43().remove();

  // Shot 44
  caption().set("Do not imagine a password simply passing through one magic box. Think of it as a tightly controlled avalanche of bit operations.");
  const stage_44 = createRef<Node>();
  const visual_44 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_44} opacity={0}>
      <ScriptShot ref={visual_44} scene={6} shot="44" y={-20} />
    </Node>
  );
  yield* all(stage_44().opacity(1, 1.8684), stage_44().position.x(-55, 6.2280, easeInOutCubic), stage_44().scale(1.04, 6.2280, easeInOutCubic), visual_44().animateData(6.2280));
  yield* waitFor(1.8684);
  yield* stage_44().opacity(0, 2.2836);
  stage_44().remove();

  // Shot 45
  caption().set("The same engine processes the next block, carrying the previous hash state forward.");
  const stage_45 = createRef<Node>();
  const visual_45 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_45} opacity={0}>
      <ScriptShot ref={visual_45} scene={6} shot="45" y={-20} />
    </Node>
  );
  yield* all(stage_45().opacity(1, 1.0044), stage_45().position.x(55, 3.3480, easeInOutCubic), stage_45().scale(1.04, 3.3480, easeInOutCubic), visual_45().animateData(3.3480));
  yield* waitFor(1.0044);
  yield* stage_45().opacity(0, 1.2276);
  stage_45().remove();

});
