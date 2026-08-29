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


  // Shot 74
  caption().set("So can SHA be broken?");
  const stage_74 = createRef<Node>();
  const visual_74 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_74} opacity={0}>
      <ScriptShot ref={visual_74} scene={13} shot="74" y={-20} />
    </Node>
  );
  yield* all(stage_74().opacity(1, 0.6300), stage_74().position.x(-55, 2.1000, easeInOutCubic), stage_74().scale(1.04, 2.1000, easeInOutCubic), visual_74().animateData(2.1000));
  yield* waitFor(0.6300);
  yield* stage_74().opacity(0, 0.7700);
  stage_74().remove();

  // Shot 75
  caption().set("The answer depends on what attack you mean.");
  const stage_75 = createRef<Node>();
  const visual_75 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_75} opacity={0}>
      <ScriptShot ref={visual_75} scene={13} shot="75" y={-20} />
    </Node>
  );
  yield* all(stage_75().opacity(1, 0.7740), stage_75().position.x(55, 2.5800, easeInOutCubic), stage_75().scale(1.04, 2.5800, easeInOutCubic), visual_75().animateData(2.5800));
  yield* waitFor(0.7740);
  yield* stage_75().opacity(0, 0.9460);
  stage_75().remove();

  // Shot 76
  caption().set("A collision means finding two different messages that produce the same digest.");
  const stage_76 = createRef<Node>();
  const visual_76 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_76} opacity={0}>
      <ScriptShot ref={visual_76} scene={13} shot="76" y={-20} />
    </Node>
  );
  yield* all(stage_76().opacity(1, 1.2636), stage_76().position.x(-55, 4.2120, easeInOutCubic), stage_76().scale(1.04, 4.2120, easeInOutCubic), visual_76().animateData(4.2120));
  yield* waitFor(1.2636);
  yield* stage_76().opacity(0, 1.5444);
  stage_76().remove();

  // Shot 77
  caption().set("This is the classic failure that eventually destroyed confidence in SHA-1.");
  const stage_77 = createRef<Node>();
  const visual_77 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_77} opacity={0}>
      <ScriptShot ref={visual_77} scene={13} shot="77" y={-20} />
    </Node>
  );
  yield* all(stage_77().opacity(1, 1.4076), stage_77().position.x(55, 4.6920, easeInOutCubic), stage_77().scale(1.04, 4.6920, easeInOutCubic), visual_77().animateData(4.6920));
  yield* waitFor(1.4076);
  yield* stage_77().opacity(0, 1.7204);
  stage_77().remove();

  // Shot 78
  caption().set("Google and CWI demonstrated a practical SHA-1 collision in 2017, and NIST had already deprecated SHA-1 for collision-sensitive applications.");
  const stage_78 = createRef<Node>();
  const visual_78 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_78} opacity={0}>
      <ScriptShot ref={visual_78} scene={13} shot="78" y={-20} />
    </Node>
  );
  yield* all(stage_78().opacity(1, 2.5020), stage_78().position.x(-55, 8.3400, easeInOutCubic), stage_78().scale(1.04, 8.3400, easeInOutCubic), visual_78().animateData(8.3400));
  yield* waitFor(2.5020);
  yield* stage_78().opacity(0, 3.0580);
  stage_78().remove();

  // Shot 79
  caption().set("A preimage attack is different: here the attacker is given a target digest and tries to find an input that produces it.");
  const stage_79 = createRef<Node>();
  const visual_79 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_79} opacity={0}>
      <ScriptShot ref={visual_79} scene={13} shot="79" y={-20} />
    </Node>
  );
  yield* all(stage_79().opacity(1, 2.0988), stage_79().position.x(55, 6.9960, easeInOutCubic), stage_79().scale(1.04, 6.9960, easeInOutCubic), visual_79().animateData(6.9960));
  yield* waitFor(2.0988);
  yield* stage_79().opacity(0, 2.5652);
  stage_79().remove();

  // Shot 80
  caption().set("For SHA-256, the idealized generic preimage work is on the order of 2 to the 256 possibilities, which is fundamentally different from a practical collision attack\u2019s roughly 2 to the 128 birthday scale.");
  const stage_80 = createRef<Node>();
  const visual_80 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_80} opacity={0}>
      <ScriptShot ref={visual_80} scene={13} shot="80" y={-20} />
    </Node>
  );
  yield* all(stage_80().opacity(1, 3.6828), stage_80().position.x(-55, 12.2760, easeInOutCubic), stage_80().scale(1.04, 12.2760, easeInOutCubic), visual_80().animateData(12.2760));
  yield* waitFor(3.6828);
  yield* stage_80().opacity(0, 4.5012);
  stage_80().remove();

  // Shot 81
  caption().set("A second-preimage attack starts with one known message and tries to find a different message with the same digest.");
  const stage_81 = createRef<Node>();
  const visual_81 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_81} opacity={0}>
      <ScriptShot ref={visual_81} scene={13} shot="81" y={-20} />
    </Node>
  );
  yield* all(stage_81().opacity(1, 1.6092), stage_81().position.x(55, 5.3640, easeInOutCubic), stage_81().scale(1.04, 5.3640, easeInOutCubic), visual_81().animateData(5.3640));
  yield* waitFor(1.6092);
  yield* stage_81().opacity(0, 1.9668);
  stage_81().remove();

});
