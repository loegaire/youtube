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
  yield* all(stage_54().opacity(1, 1.0908), stage_54().position.x(-55, 3.6360, easeInOutCubic), stage_54().scale(1.04, 3.6360, easeInOutCubic), visual_54().animateData(3.6360));
  yield* waitFor(1.0908);
  yield* stage_54().opacity(0, 1.3332);
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
  yield* all(stage_55().opacity(1, 0.3996), stage_55().position.x(55, 1.3320, easeInOutCubic), stage_55().scale(1.04, 1.3320, easeInOutCubic), visual_55().animateData(1.3320));
  yield* waitFor(0.3996);
  yield* stage_55().opacity(0, 0.4884);
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
  yield* all(stage_56().opacity(1, 0.7740), stage_56().position.x(-55, 2.5800, easeInOutCubic), stage_56().scale(1.04, 2.5800, easeInOutCubic), visual_56().animateData(2.5800));
  yield* waitFor(0.7740);
  yield* stage_56().opacity(0, 0.9460);
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
  yield* all(stage_57().opacity(1, 0.8604), stage_57().position.x(55, 2.8680, easeInOutCubic), stage_57().scale(1.04, 2.8680, easeInOutCubic), visual_57().animateData(2.8680));
  yield* waitFor(0.8604);
  yield* stage_57().opacity(0, 1.0516);
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
  yield* all(stage_58().opacity(1, 0.7740), stage_58().position.x(-55, 2.5800, easeInOutCubic), stage_58().scale(1.04, 2.5800, easeInOutCubic), visual_58().animateData(2.5800));
  yield* waitFor(0.7740);
  yield* stage_58().opacity(0, 0.9460);
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
  yield* all(stage_59().opacity(1, 0.9180), stage_59().position.x(55, 3.0600, easeInOutCubic), stage_59().scale(1.04, 3.0600, easeInOutCubic), visual_59().animateData(3.0600));
  yield* waitFor(0.9180);
  yield* stage_59().opacity(0, 1.1220);
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
  yield* all(stage_60().opacity(1, 0.8604), stage_60().position.x(-55, 2.8680, easeInOutCubic), stage_60().scale(1.04, 2.8680, easeInOutCubic), visual_60().animateData(2.8680));
  yield* waitFor(0.8604);
  yield* stage_60().opacity(0, 1.0516);
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
  yield* all(stage_61().opacity(1, 0.2700), stage_61().position.x(55, 0.9000, easeInOutCubic), stage_61().scale(1.04, 0.9000, easeInOutCubic), visual_61().animateData(0.9000));
  yield* waitFor(0.2700);
  yield* stage_61().opacity(0, 0.3300);
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
  yield* all(stage_62().opacity(1, 1.0044), stage_62().position.x(-55, 3.3480, easeInOutCubic), stage_62().scale(1.04, 3.3480, easeInOutCubic), visual_62().animateData(3.3480));
  yield* waitFor(1.0044);
  yield* stage_62().opacity(0, 1.2276);
  stage_62().remove();

});
