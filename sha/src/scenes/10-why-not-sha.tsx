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


  // Shot 63
  caption().set("Notice what we just built: fixed-size output, repeated mixing, bitwise operations, and state that changes as the input is processed.");
  const stage_63 = createRef<Node>();
  const visual_63 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_63} opacity={0}>
      <ScriptShot ref={visual_63} scene={10} shot="63" y={-20} />
    </Node>
  );
  yield* all(stage_63().opacity(1, 1.7999999999999998), stage_63().position.x(55, 6.0, easeInOutCubic), stage_63().scale(1.04, 6.0, easeInOutCubic), visual_63().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_63().opacity(0, 2.2);
  stage_63().remove();

  // Shot 64
  caption().set("But it is nowhere near the security design of SHA-256.");
  const stage_64 = createRef<Node>();
  const visual_64 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_64} opacity={0}>
      <ScriptShot ref={visual_64} scene={10} shot="64" y={-20} />
    </Node>
  );
  yield* all(stage_64().opacity(1, 1.7999999999999998), stage_64().position.x(-55, 6.0, easeInOutCubic), stage_64().scale(1.04, 6.0, easeInOutCubic), visual_64().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_64().opacity(0, 2.2);
  stage_64().remove();

  // Shot 65
  caption().set("The point of the toy is not security. The point is being able to see the algorithm.");
  const stage_65 = createRef<Node>();
  const visual_65 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_65} opacity={0}>
      <ScriptShot ref={visual_65} scene={10} shot="65" y={-20} />
    </Node>
  );
  yield* all(stage_65().opacity(1, 1.08), stage_65().position.x(55, 3.5999999999999996, easeInOutCubic), stage_65().scale(1.04, 3.5999999999999996, easeInOutCubic), visual_65().animateData(3.5999999999999996));
  yield* waitFor(1.08);
  yield* stage_65().opacity(0, 1.32);
  stage_65().remove();

});
