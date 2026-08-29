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


  // Shot 69
  caption().set("Compare that with simply saving the password.");
  const stage_69 = createRef<Node>();
  const visual_69 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_69} opacity={0}>
      <ScriptShot ref={visual_69} scene={12} shot="69" y={-20} />
    </Node>
  );
  yield* all(stage_69().opacity(1, 0.7452), stage_69().position.x(55, 2.4840, easeInOutCubic), stage_69().scale(1.04, 2.4840, easeInOutCubic), visual_69().animateData(2.4840));
  yield* waitFor(0.7452);
  yield* stage_69().opacity(0, 0.9108);
  stage_69().remove();

  // Shot 70
  caption().set("If an attacker gains read access to that database, the secret is already there. No cracking is necessary.");
  const stage_70 = createRef<Node>();
  const visual_70 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_70} opacity={0}>
      <ScriptShot ref={visual_70} scene={12} shot="70" y={-20} />
    </Node>
  );
  yield* all(stage_70().opacity(1, 1.6668), stage_70().position.x(-55, 5.5560, easeInOutCubic), stage_70().scale(1.04, 5.5560, easeInOutCubic), visual_70().animateData(5.5560));
  yield* waitFor(1.6668);
  yield* stage_70().opacity(0, 2.0372);
  stage_70().remove();

  // Shot 71
  caption().set("Hashing changes the situation: stealing the verifier does not immediately reveal the password, although weak passwords can still be guessed offline.");
  const stage_71 = createRef<Node>();
  const visual_71 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_71} opacity={0}>
      <ScriptShot ref={visual_71} scene={12} shot="71" y={-20} />
    </Node>
  );
  yield* all(stage_71().opacity(1, 2.1276), stage_71().position.x(55, 7.0920, easeInOutCubic), stage_71().scale(1.04, 7.0920, easeInOutCubic), visual_71().animateData(7.0920));
  yield* waitFor(2.1276);
  yield* stage_71().opacity(0, 2.6004);
  stage_71().remove();

  // Shot 72
  caption().set("And this distinction matters for side-channel and accidental-leak scenarios too: plaintext copies are dangerous wherever the secret can leak, including configuration, logs, backups, memory, or diagnostic data.");
  const stage_72 = createRef<Node>();
  const visual_72 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_72} opacity={0}>
      <ScriptShot ref={visual_72} scene={12} shot="72" y={-20} />
    </Node>
  );
  yield* all(stage_72().opacity(1, 3.2220), stage_72().position.x(-55, 10.7400, easeInOutCubic), stage_72().scale(1.04, 10.7400, easeInOutCubic), visual_72().animateData(10.7400));
  yield* waitFor(3.2220);
  yield* stage_72().opacity(0, 3.9380);
  stage_72().remove();

  // Shot 73
  caption().set("The correct lesson is not \u2018SHA is safer than plaintext because SHA is hard.\u2019 The lesson is \u2018use the primitive that matches the threat model.\u2019");
  const stage_73 = createRef<Node>();
  const visual_73 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_73} opacity={0}>
      <ScriptShot ref={visual_73} scene={12} shot="73" y={-20} />
    </Node>
  );
  yield* all(stage_73().opacity(1, 2.4444), stage_73().position.x(55, 8.1480, easeInOutCubic), stage_73().scale(1.04, 8.1480, easeInOutCubic), visual_73().animateData(8.1480));
  yield* waitFor(2.4444);
  yield* stage_73().opacity(0, 2.9876);
  stage_73().remove();

});
