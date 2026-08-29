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


  // Shot 30
  caption().set("Now the interesting part. SHA-256 starts with eight predefined 32-bit state values.");
  const stage_30 = createRef<Node>();
  const visual_30 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_30} opacity={0}>
      <ScriptShot ref={visual_30} scene={5} shot="30" y={-20} />
    </Node>
  );
  yield* all(stage_30().opacity(1, 1.8684), stage_30().position.x(-55, 6.2280, easeInOutCubic), stage_30().scale(1.04, 6.2280, easeInOutCubic), visual_30().animateData(6.2280));
  yield* waitFor(1.8684);
  yield* stage_30().opacity(0, 2.2836);
  stage_30().remove();

  // Shot 31
  caption().set("Call them `a`, `b`, `c`, `d`, `e`, `f`, `g`, and `h`.");
  const stage_31 = createRef<Node>();
  const visual_31 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_31} opacity={0}>
      <ScriptShot ref={visual_31} scene={5} shot="31" y={-20} />
    </Node>
  );
  yield* all(stage_31().opacity(1, 0.8604), stage_31().position.x(55, 2.8680, easeInOutCubic), stage_31().scale(1.04, 2.8680, easeInOutCubic), visual_31().animateData(2.8680));
  yield* waitFor(0.8604);
  yield* stage_31().opacity(0, 1.0516);
  stage_31().remove();

  // Shot 32
  caption().set("SHA-256 uses small Boolean functions to mix individual bits together.");
  const stage_32 = createRef<Node>();
  const visual_32 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_32} opacity={0}>
      <ScriptShot ref={visual_32} scene={5} shot="32" y={-20} />
    </Node>
  );
  yield* all(stage_32().opacity(1, 1.7820), stage_32().position.x(-55, 5.9400, easeInOutCubic), stage_32().scale(1.04, 5.9400, easeInOutCubic), visual_32().animateData(5.9400));
  yield* waitFor(1.7820);
  yield* stage_32().opacity(0, 2.1780);
  stage_32().remove();

  // Shot 33
  caption().set("The Choose function selects bits from one input or another.");
  const stage_33 = createRef<Node>();
  const visual_33 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_33} opacity={0}>
      <ScriptShot ref={visual_33} scene={5} shot="33" y={-20} />
    </Node>
  );
  yield* all(stage_33().opacity(1, 1.1196), stage_33().position.x(55, 3.7320, easeInOutCubic), stage_33().scale(1.04, 3.7320, easeInOutCubic), visual_33().animateData(3.7320));
  yield* waitFor(1.1196);
  yield* stage_33().opacity(0, 1.3684);
  stage_33().remove();

  // Shot 34
  caption().set("The Majority function looks at three inputs and chooses the bit value that appears most often.");
  const stage_34 = createRef<Node>();
  const visual_34 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_34} opacity={0}>
      <ScriptShot ref={visual_34} scene={5} shot="34" y={-20} />
    </Node>
  );
  yield* all(stage_34().opacity(1, 1.6092), stage_34().position.x(-55, 5.3640, easeInOutCubic), stage_34().scale(1.04, 5.3640, easeInOutCubic), visual_34().animateData(5.3640));
  yield* waitFor(1.6092);
  yield* stage_34().opacity(0, 1.9668);
  stage_34().remove();

  // Shot 35
  caption().set("These are tiny operations. The difficulty comes from repeating them across many rounds while constantly changing the state.");
  const stage_35 = createRef<Node>();
  const visual_35 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_35} opacity={0}>
      <ScriptShot ref={visual_35} scene={5} shot="35" y={-20} />
    </Node>
  );
  yield* all(stage_35().opacity(1, 1.9260), stage_35().position.x(55, 6.4200, easeInOutCubic), stage_35().scale(1.04, 6.4200, easeInOutCubic), visual_35().animateData(6.4200));
  yield* waitFor(1.9260);
  yield* stage_35().opacity(0, 2.3540);
  stage_35().remove();

  // Shot 36
  caption().set("SHA-256 also uses large sigma functions built from bit rotations and XOR.");
  const stage_36 = createRef<Node>();
  const visual_36 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_36} opacity={0}>
      <ScriptShot ref={visual_36} scene={5} shot="36" y={-20} />
    </Node>
  );
  yield* all(stage_36().opacity(1, 1.8108), stage_36().position.x(-55, 6.0360, easeInOutCubic), stage_36().scale(1.04, 6.0360, easeInOutCubic), visual_36().animateData(6.0360));
  yield* waitFor(1.8108);
  yield* stage_36().opacity(0, 2.2132);
  stage_36().remove();

  // Shot 37
  caption().set("For the `e` side of the state, the rotations are different.");
  const stage_37 = createRef<Node>();
  const visual_37 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_37} opacity={0}>
      <ScriptShot ref={visual_37} scene={5} shot="37" y={-20} />
    </Node>
  );
  yield* all(stage_37().opacity(1, 0.9468), stage_37().position.x(55, 3.1560, easeInOutCubic), stage_37().scale(1.04, 3.1560, easeInOutCubic), visual_37().animateData(3.1560));
  yield* waitFor(0.9468);
  yield* stage_37().opacity(0, 1.1572);
  stage_37().remove();

  // Shot 38
  caption().set("Now watch one complete round.");
  const stage_38 = createRef<Node>();
  const visual_38 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_38} opacity={0}>
      <ScriptShot ref={visual_38} scene={5} shot="38" y={-20} />
    </Node>
  );
  yield* all(stage_38().opacity(1, 0.6588), stage_38().position.x(-55, 2.1960, easeInOutCubic), stage_38().scale(1.04, 2.1960, easeInOutCubic), visual_38().animateData(2.1960));
  yield* waitFor(0.6588);
  yield* stage_38().opacity(0, 0.8052);
  stage_38().remove();

  // Shot 39
  caption().set("First, SHA-256 computes `T1` from `h`, the sigma function of `e`, the Choose function, a round constant, and the current message word.");
  const stage_39 = createRef<Node>();
  const visual_39 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_39} opacity={0}>
      <ScriptShot ref={visual_39} scene={5} shot="39" y={-20} />
    </Node>
  );
  yield* all(stage_39().opacity(1, 2.3292), stage_39().position.x(55, 7.7640, easeInOutCubic), stage_39().scale(1.04, 7.7640, easeInOutCubic), visual_39().animateData(7.7640));
  yield* waitFor(2.3292);
  yield* stage_39().opacity(0, 2.8468);
  stage_39().remove();

  // Shot 40
  caption().set("Then `T2` is computed from the sigma function of `a` and the Majority function.");
  const stage_40 = createRef<Node>();
  const visual_40 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_40} opacity={0}>
      <ScriptShot ref={visual_40} scene={5} shot="40" y={-20} />
    </Node>
  );
  yield* all(stage_40().opacity(1, 1.4076), stage_40().position.x(-55, 4.6920, easeInOutCubic), stage_40().scale(1.04, 4.6920, easeInOutCubic), visual_40().animateData(4.6920));
  yield* waitFor(1.4076);
  yield* stage_40().opacity(0, 1.7204);
  stage_40().remove();

  // Shot 41
  caption().set("The registers then shift forward, while the new values enter the front of the chain.");
  const stage_41 = createRef<Node>();
  const visual_41 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_41} opacity={0}>
      <ScriptShot ref={visual_41} scene={5} shot="41" y={-20} />
    </Node>
  );
  yield* all(stage_41().opacity(1, 1.3212), stage_41().position.x(55, 4.4040, easeInOutCubic), stage_41().scale(1.04, 4.4040, easeInOutCubic), visual_41().animateData(4.4040));
  yield* waitFor(1.3212);
  yield* stage_41().opacity(0, 1.6148);
  stage_41().remove();

  // Shot 42
  caption().set("Then the next round starts immediately.");
  const stage_42 = createRef<Node>();
  const visual_42 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_42} opacity={0}>
      <ScriptShot ref={visual_42} scene={5} shot="42" y={-20} />
    </Node>
  );
  yield* all(stage_42().opacity(1, 0.7740), stage_42().position.x(-55, 2.5800, easeInOutCubic), stage_42().scale(1.04, 2.5800, easeInOutCubic), visual_42().animateData(2.5800));
  yield* waitFor(0.7740);
  yield* stage_42().opacity(0, 0.9460);
  stage_42().remove();

});
