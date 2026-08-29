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


  // Shot 46
  caption().set("After the final block, the eight 32-bit state words are concatenated into the 256-bit digest.");
  const stage_46 = createRef<Node>();
  const visual_46 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_46} opacity={0}>
      <ScriptShot ref={visual_46} scene={7} shot="46" y={-20} />
    </Node>
  );
  yield* all(stage_46().opacity(1, 1.4364), stage_46().position.x(-55, 4.7880, easeInOutCubic), stage_46().scale(1.04, 4.7880, easeInOutCubic), visual_46().animateData(4.7880));
  yield* waitFor(1.4364);
  yield* stage_46().opacity(0, 1.7556);
  stage_46().remove();

  // Shot 47
  caption().set("For the message `abc`, SHA-256 produces this.");
  const stage_47 = createRef<Node>();
  const visual_47 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_47} opacity={0}>
      <ScriptShot ref={visual_47} scene={7} shot="47" y={-20} />
    </Node>
  );
  yield* all(stage_47().opacity(1, 0.8028), stage_47().position.x(55, 2.6760, easeInOutCubic), stage_47().scale(1.04, 2.6760, easeInOutCubic), visual_47().animateData(2.6760));
  yield* waitFor(0.8028);
  yield* stage_47().opacity(0, 0.9812);
  stage_47().remove();

  // Shot 48
  caption().set("Sixty-four hexadecimal characters. Two hundred and fifty-six bits. And absolutely no visible resemblance to the three characters that went in.");
  const stage_48 = createRef<Node>();
  const visual_48 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_48} opacity={0}>
      <ScriptShot ref={visual_48} scene={7} shot="48" y={-20} />
    </Node>
  );
  yield* all(stage_48().opacity(1, 1.7820), stage_48().position.x(-55, 5.9400, easeInOutCubic), stage_48().scale(1.04, 5.9400, easeInOutCubic), visual_48().animateData(5.9400));
  yield* waitFor(1.7820);
  yield* stage_48().opacity(0, 2.1780);
  stage_48().remove();

});
