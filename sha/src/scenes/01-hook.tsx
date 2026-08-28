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


  // Shot 1
  caption().set("Hello again, hackers. Have you ever wondered how your laptop can check your password without needing to keep the actual password sitting inside the machine?");
  const stage_1 = createRef<Node>();
  const visual_1 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_1} opacity={0}>
      <ScriptShot ref={visual_1} scene={1} shot="1" y={-20} />
    </Node>
  );
  yield* all(stage_1().opacity(1, 1.44), stage_1().position.x(55, 4.8, easeInOutCubic), stage_1().scale(1.04, 4.8, easeInOutCubic), visual_1().animateData(4.8));
  yield* waitFor(1.44);
  yield* stage_1().opacity(0, 1.76);
  stage_1().remove();

  // Shot 2
  caption().set("You type characters. The computer turns those characters into numbers. And those numbers are transformed again and again until what comes out looks nothing like what you typed.");
  const stage_2 = createRef<Node>();
  const visual_2 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_2} opacity={0}>
      <ScriptShot ref={visual_2} scene={1} shot="2" y={-20} />
    </Node>
  );
  yield* all(stage_2().opacity(1, 1.7999999999999998), stage_2().position.x(-55, 6.0, easeInOutCubic), stage_2().scale(1.04, 6.0, easeInOutCubic), visual_2().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_2().opacity(0, 2.2);
  stage_2().remove();

  // Shot 3
  caption().set("That process is hashing. And one particular family of hash functions has been hiding inside operating systems, software downloads, signatures, protocols, and security tools for years: SHA.");
  const stage_3 = createRef<Node>();
  const visual_3 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_3} opacity={0}>
      <ScriptShot ref={visual_3} scene={1} shot="3" y={-20} />
    </Node>
  );
  yield* all(stage_3().opacity(1, 2.16), stage_3().position.x(55, 7.199999999999999, easeInOutCubic), stage_3().scale(1.04, 7.199999999999999, easeInOutCubic), visual_3().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_3().opacity(0, 2.64);
  stage_3().remove();

  // Shot 4
  caption().set("But before we touch SHA-256, we need to understand what a hash is actually doing.");
  const stage_4 = createRef<Node>();
  const visual_4 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_4} opacity={0}>
      <ScriptShot ref={visual_4} scene={1} shot="4" y={-20} />
    </Node>
  );
  yield* all(stage_4().opacity(1, 1.44), stage_4().position.x(-55, 4.8, easeInOutCubic), stage_4().scale(1.04, 4.8, easeInOutCubic), visual_4().animateData(4.8));
  yield* waitFor(1.44);
  yield* stage_4().opacity(0, 1.76);
  stage_4().remove();

});
