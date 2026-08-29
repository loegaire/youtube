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


  // Shot 22
  caption().set("Now replace our pathetic one-bit toy with SHA-256.");
  const stage_22 = createRef<Node>();
  const visual_22 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_22} opacity={0}>
      <ScriptShot ref={visual_22} scene={4} shot="22" y={-20} />
    </Node>
  );
  yield* all(stage_22().opacity(1, 1.0332), stage_22().position.x(-55, 3.4440, easeInOutCubic), stage_22().scale(1.04, 3.4440, easeInOutCubic), visual_22().animateData(3.4440));
  yield* waitFor(1.0332);
  yield* stage_22().opacity(0, 1.2628);
  stage_22().remove();

  // Shot 23
  caption().set("SHA-256 accepts an arbitrary-length message, processes it in 512-bit blocks, and produces a 256-bit message digest.");
  const stage_23 = createRef<Node>();
  const visual_23 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_23} opacity={0}>
      <ScriptShot ref={visual_23} scene={4} shot="23" y={-20} />
    </Node>
  );
  yield* all(stage_23().opacity(1, 2.3004), stage_23().position.x(55, 7.6680, easeInOutCubic), stage_23().scale(1.04, 7.6680, easeInOutCubic), visual_23().animateData(7.6680));
  yield* waitFor(2.3004);
  yield* stage_23().opacity(0, 2.8116);
  stage_23().remove();

  // Shot 24
  caption().set("Internally, the 256-bit state is represented as eight 32-bit words.");
  const stage_24 = createRef<Node>();
  const visual_24 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_24} opacity={0}>
      <ScriptShot ref={visual_24} scene={4} shot="24" y={-20} />
    </Node>
  );
  yield* all(stage_24().opacity(1, 1.4076), stage_24().position.x(-55, 4.6920, easeInOutCubic), stage_24().scale(1.04, 4.6920, easeInOutCubic), visual_24().animateData(4.6920));
  yield* waitFor(1.4076);
  yield* stage_24().opacity(0, 1.7204);
  stage_24().remove();

  // Shot 25
  caption().set("Before the real compression begins, SHA-256 pads the message.");
  const stage_25 = createRef<Node>();
  const visual_25 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_25} opacity={0}>
      <ScriptShot ref={visual_25} scene={4} shot="25" y={-20} />
    </Node>
  );
  yield* all(stage_25().opacity(1, 1.1484), stage_25().position.x(55, 3.8280, easeInOutCubic), stage_25().scale(1.04, 3.8280, easeInOutCubic), visual_25().animateData(3.8280));
  yield* waitFor(1.1484);
  yield* stage_25().opacity(0, 1.4036);
  stage_25().remove();

  // Shot 26
  caption().set("The padding ends with the original message length, encoded as a 64-bit value, so the final block carries both the data and information about how long that data originally was.");
  const stage_26 = createRef<Node>();
  const visual_26 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_26} opacity={0}>
      <ScriptShot ref={visual_26} scene={4} shot="26" y={-20} />
    </Node>
  );
  yield* all(stage_26().opacity(1, 2.1564), stage_26().position.x(-55, 7.1880, easeInOutCubic), stage_26().scale(1.04, 7.1880, easeInOutCubic), visual_26().animateData(7.1880));
  yield* waitFor(2.1564);
  yield* stage_26().opacity(0, 2.6356);
  stage_26().remove();

  // Shot 27
  caption().set("That 512-bit block is split into sixteen 32-bit words.");
  const stage_27 = createRef<Node>();
  const visual_27 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_27} opacity={0}>
      <ScriptShot ref={visual_27} scene={4} shot="27" y={-20} />
    </Node>
  );
  yield* all(stage_27().opacity(1, 1.1772), stage_27().position.x(55, 3.9240, easeInOutCubic), stage_27().scale(1.04, 3.9240, easeInOutCubic), visual_27().animateData(3.9240));
  yield* waitFor(1.1772);
  yield* stage_27().opacity(0, 1.4388);
  stage_27().remove();

  // Shot 28
  caption().set("But SHA-256 does not stop at sixteen. It expands that data into a message schedule containing sixty-four 32-bit words.");
  const stage_28 = createRef<Node>();
  const visual_28 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_28} opacity={0}>
      <ScriptShot ref={visual_28} scene={4} shot="28" y={-20} />
    </Node>
  );
  yield* all(stage_28().opacity(1, 2.0124), stage_28().position.x(-55, 6.7080, easeInOutCubic), stage_28().scale(1.04, 6.7080, easeInOutCubic), visual_28().animateData(6.7080));
  yield* waitFor(2.0124);
  yield* stage_28().opacity(0, 2.4596);
  stage_28().remove();

  // Shot 29
  caption().set("Each later word is derived from earlier words using rotations, shifts, and modular addition.");
  const stage_29 = createRef<Node>();
  const visual_29 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_29} opacity={0}>
      <ScriptShot ref={visual_29} scene={4} shot="29" y={-20} />
    </Node>
  );
  yield* all(stage_29().opacity(1, 1.3212), stage_29().position.x(55, 4.4040, easeInOutCubic), stage_29().scale(1.04, 4.4040, easeInOutCubic), visual_29().animateData(4.4040));
  yield* waitFor(1.3212);
  yield* stage_29().opacity(0, 1.6148);
  stage_29().remove();

});
