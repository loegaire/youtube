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
  yield* all(stage_82().opacity(1, 2.1564), stage_82().position.x(-55, 7.1880, easeInOutCubic), stage_82().scale(1.04, 7.1880, easeInOutCubic), visual_82().animateData(7.1880));
  yield* waitFor(2.1564);
  yield* stage_82().opacity(0, 2.6356);
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
  yield* all(stage_83().opacity(1, 3.3660), stage_83().position.x(55, 11.2200, easeInOutCubic), stage_83().scale(1.04, 11.2200, easeInOutCubic), visual_83().animateData(11.2200));
  yield* waitFor(3.3660);
  yield* stage_83().opacity(0, 4.1140);
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
  yield* all(stage_84().opacity(1, 2.1852), stage_84().position.x(-55, 7.2840, easeInOutCubic), stage_84().scale(1.04, 7.2840, easeInOutCubic), visual_84().animateData(7.2840));
  yield* waitFor(2.1852);
  yield* stage_84().opacity(0, 2.6708);
  stage_84().remove();

});
