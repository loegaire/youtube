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


  // Shot 54
  caption().set("Let\u2019s hash the text `abc` and watch every byte move.");
  const stage_54 = createRef<Node>();
  const visual_54 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_54} opacity={0}>
      <ScriptShot ref={visual_54} scene={9} shot="54" y={-20} />
    </Node>
  );
  yield* all(stage_54().opacity(1, 1.6199999999999999), stage_54().position.x(-55, 5.3999999999999995, easeInOutCubic), stage_54().scale(1.04, 5.3999999999999995, easeInOutCubic), visual_54().animateData(5.3999999999999995));
  yield* waitFor(1.6199999999999999);
  yield* stage_54().opacity(0, 1.98);
  stage_54().remove();

  // Shot 55
  caption().set("First byte: `0x61`.");
  const stage_55 = createRef<Node>();
  const visual_55 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_55} opacity={0}>
      <ScriptShot ref={visual_55} scene={9} shot="55" y={-20} />
    </Node>
  );
  yield* all(stage_55().opacity(1, 1.6199999999999999), stage_55().position.x(55, 5.3999999999999995, easeInOutCubic), stage_55().scale(1.04, 5.3999999999999995, easeInOutCubic), visual_55().animateData(5.3999999999999995));
  yield* waitFor(1.6199999999999999);
  yield* stage_55().opacity(0, 1.98);
  stage_55().remove();

  // Shot 56
  caption().set("XOR the byte with the current state.");
  const stage_56 = createRef<Node>();
  const visual_56 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_56} opacity={0}>
      <ScriptShot ref={visual_56} scene={9} shot="56" y={-20} />
    </Node>
  );
  yield* all(stage_56().opacity(1, 1.08), stage_56().position.x(-55, 3.5999999999999996, easeInOutCubic), stage_56().scale(1.04, 3.5999999999999996, easeInOutCubic), visual_56().animateData(3.5999999999999996));
  yield* waitFor(1.08);
  yield* stage_56().opacity(0, 1.32);
  stage_56().remove();

  // Shot 57
  caption().set("Add `0x3d`, then keep only the lowest eight bits.");
  const stage_57 = createRef<Node>();
  const visual_57 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_57} opacity={0}>
      <ScriptShot ref={visual_57} scene={9} shot="57" y={-20} />
    </Node>
  );
  yield* all(stage_57().opacity(1, 1.7999999999999998), stage_57().position.x(55, 6.0, easeInOutCubic), stage_57().scale(1.04, 6.0, easeInOutCubic), visual_57().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_57().opacity(0, 2.2);
  stage_57().remove();

  // Shot 58
  caption().set("Then rotate left by three.");
  const stage_58 = createRef<Node>();
  const visual_58 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_58} opacity={0}>
      <ScriptShot ref={visual_58} scene={9} shot="58" y={-20} />
    </Node>
  );
  yield* all(stage_58().opacity(1, 1.7999999999999998), stage_58().position.x(-55, 6.0, easeInOutCubic), stage_58().scale(1.04, 6.0, easeInOutCubic), visual_58().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_58().opacity(0, 2.2);
  stage_58().remove();

  // Shot 59
  caption().set("That output becomes the state for the next byte.");
  const stage_59 = createRef<Node>();
  const visual_59 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_59} opacity={0}>
      <ScriptShot ref={visual_59} scene={9} shot="59" y={-20} />
    </Node>
  );
  yield* all(stage_59().opacity(1, 1.08), stage_59().position.x(55, 3.5999999999999996, easeInOutCubic), stage_59().scale(1.04, 3.5999999999999996, easeInOutCubic), visual_59().animateData(3.5999999999999996));
  yield* waitFor(1.08);
  yield* stage_59().opacity(0, 1.32);
  stage_59().remove();

  // Shot 60
  caption().set("Second byte: `0x62`. Same machinery. New state.");
  const stage_60 = createRef<Node>();
  const visual_60 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_60} opacity={0}>
      <ScriptShot ref={visual_60} scene={9} shot="60" y={-20} />
    </Node>
  );
  yield* all(stage_60().opacity(1, 1.7999999999999998), stage_60().position.x(-55, 6.0, easeInOutCubic), stage_60().scale(1.04, 6.0, easeInOutCubic), visual_60().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_60().opacity(0, 2.2);
  stage_60().remove();

  // Shot 61
  caption().set("Third byte: `0x63`.");
  const stage_61 = createRef<Node>();
  const visual_61 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_61} opacity={0}>
      <ScriptShot ref={visual_61} scene={9} shot="61" y={-20} />
    </Node>
  );
  yield* all(stage_61().opacity(1, 1.7999999999999998), stage_61().position.x(55, 6.0, easeInOutCubic), stage_61().scale(1.04, 6.0, easeInOutCubic), visual_61().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_61().opacity(0, 2.2);
  stage_61().remove();

  // Shot 62
  caption().set("And the final eight-bit state becomes our digest.");
  const stage_62 = createRef<Node>();
  const visual_62 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_62} opacity={0}>
      <ScriptShot ref={visual_62} scene={9} shot="62" y={-20} />
    </Node>
  );
  yield* all(stage_62().opacity(1, 1.44), stage_62().position.x(-55, 4.8, easeInOutCubic), stage_62().scale(1.04, 4.8, easeInOutCubic), visual_62().animateData(4.8));
  yield* waitFor(1.44);
  yield* stage_62().opacity(0, 1.76);
  stage_62().remove();

});
