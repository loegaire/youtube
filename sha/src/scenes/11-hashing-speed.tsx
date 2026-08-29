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


  // Shot 66
  caption().set("Now here is where hashing gets counterintuitive: SHA-256 is fast.");
  const stage_66 = createRef<Node>();
  const visual_66 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_66} opacity={0}>
      <ScriptShot ref={visual_66} scene={11} shot="66" y={-20} />
    </Node>
  );
  yield* all(stage_66().opacity(1, 1.4076), stage_66().position.x(-55, 4.6920, easeInOutCubic), stage_66().scale(1.04, 4.6920, easeInOutCubic), visual_66().animateData(4.6920));
  yield* waitFor(1.4076);
  yield* stage_66().opacity(0, 1.7204);
  stage_66().remove();

  // Shot 67
  caption().set("That speed is excellent for verifying files and processing data, but it is exactly why raw SHA-256 is a poor password-storage primitive.");
  const stage_67 = createRef<Node>();
  const visual_67 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_67} opacity={0}>
      <ScriptShot ref={visual_67} scene={11} shot="67" y={-20} />
    </Node>
  );
  yield* all(stage_67().opacity(1, 2.4732), stage_67().position.x(55, 8.2440, easeInOutCubic), stage_67().scale(1.04, 8.2440, easeInOutCubic), visual_67().animateData(8.2440));
  yield* waitFor(2.4732);
  yield* stage_67().opacity(0, 3.0228);
  stage_67().remove();

  // Shot 68
  caption().set("A password database should therefore use a password-hashing scheme designed to make each guess deliberately expensive, such as Argon2id, with salt and appropriate cost parameters.");
  const stage_68 = createRef<Node>();
  const visual_68 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_68} opacity={0}>
      <ScriptShot ref={visual_68} scene={11} shot="68" y={-20} />
    </Node>
  );
  yield* all(stage_68().opacity(1, 2.9340), stage_68().position.x(-55, 9.7800, easeInOutCubic), stage_68().scale(1.04, 9.7800, easeInOutCubic), visual_68().animateData(9.7800));
  yield* waitFor(2.9340);
  yield* stage_68().opacity(0, 3.5860);
  stage_68().remove();

});
