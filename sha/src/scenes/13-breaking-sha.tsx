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
  yield* all(stage_74().opacity(1, 1.08), stage_74().position.x(-55, 3.5999999999999996, easeInOutCubic), stage_74().scale(1.04, 3.5999999999999996, easeInOutCubic), visual_74().animateData(3.5999999999999996));
  yield* waitFor(1.08);
  yield* stage_74().opacity(0, 1.32);
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
  yield* all(stage_75().opacity(1, 1.08), stage_75().position.x(55, 3.5999999999999996, easeInOutCubic), stage_75().scale(1.04, 3.5999999999999996, easeInOutCubic), visual_75().animateData(3.5999999999999996));
  yield* waitFor(1.08);
  yield* stage_75().opacity(0, 1.32);
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
  yield* all(stage_76().opacity(1, 2.16), stage_76().position.x(-55, 7.199999999999999, easeInOutCubic), stage_76().scale(1.04, 7.199999999999999, easeInOutCubic), visual_76().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_76().opacity(0, 2.64);
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
  yield* all(stage_77().opacity(1, 2.16), stage_77().position.x(55, 7.199999999999999, easeInOutCubic), stage_77().scale(1.04, 7.199999999999999, easeInOutCubic), visual_77().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_77().opacity(0, 2.64);
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
  yield* all(stage_78().opacity(1, 2.34), stage_78().position.x(-55, 7.8, easeInOutCubic), stage_78().scale(1.04, 7.8, easeInOutCubic), visual_78().animateData(7.8));
  yield* waitFor(2.34);
  yield* stage_78().opacity(0, 2.86);
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
  yield* all(stage_79().opacity(1, 2.16), stage_79().position.x(55, 7.199999999999999, easeInOutCubic), stage_79().scale(1.04, 7.199999999999999, easeInOutCubic), visual_79().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_79().opacity(0, 2.64);
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
  yield* all(stage_80().opacity(1, 2.88), stage_80().position.x(-55, 9.6, easeInOutCubic), stage_80().scale(1.04, 9.6, easeInOutCubic), visual_80().animateData(9.6));
  yield* waitFor(2.88);
  yield* stage_80().opacity(0, 3.52);
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
  yield* all(stage_81().opacity(1, 1.7999999999999998), stage_81().position.x(55, 6.0, easeInOutCubic), stage_81().scale(1.04, 6.0, easeInOutCubic), visual_81().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_81().opacity(0, 2.2);
  stage_81().remove();

});
