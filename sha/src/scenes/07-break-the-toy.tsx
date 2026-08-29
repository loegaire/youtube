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
  yield* all(stage_46().opacity(1, 1.8684), stage_46().position.x(-55, 6.2280, easeInOutCubic), stage_46().scale(1.04, 6.2280, easeInOutCubic), visual_46().animateData(6.2280));
  yield* waitFor(1.8684);
  yield* stage_46().opacity(0, 2.2836);
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
  yield* all(stage_47().opacity(1, 1.0908), stage_47().position.x(55, 3.6360, easeInOutCubic), stage_47().scale(1.04, 3.6360, easeInOutCubic), visual_47().animateData(3.6360));
  yield* waitFor(1.0908);
  yield* stage_47().opacity(0, 1.3332);
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
  yield* all(stage_48().opacity(1, 2.0124), stage_48().position.x(-55, 6.7080, easeInOutCubic), stage_48().scale(1.04, 6.7080, easeInOutCubic), visual_48().animateData(6.7080));
  yield* waitFor(2.0124);
  yield* stage_48().opacity(0, 2.4596);
  stage_48().remove();

});
