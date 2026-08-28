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


  // Shot 98
  caption().set("So go back to the real machine.");
  const stage_98 = createRef<Node>();
  const visual_98 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_98} opacity={0}>
      <ScriptShot ref={visual_98} scene={17} shot="98" y={-20} />
    </Node>
  );
  yield* all(stage_98().opacity(1, 1.7999999999999998), stage_98().position.x(-55, 6.0, easeInOutCubic), stage_98().scale(1.04, 6.0, easeInOutCubic), visual_98().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_98().opacity(0, 2.2);
  stage_98().remove();

  // Shot 99
  caption().set("The data is padded. The block is expanded into a message schedule. Eight state words enter a sixty-four-round compression loop. The state is accumulated. The process repeats for every block.");
  const stage_99 = createRef<Node>();
  const visual_99 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_99} opacity={0}>
      <ScriptShot ref={visual_99} scene={17} shot="99" y={-20} />
    </Node>
  );
  yield* all(stage_99().opacity(1, 2.52), stage_99().position.x(55, 8.4, easeInOutCubic), stage_99().scale(1.04, 8.4, easeInOutCubic), visual_99().animateData(8.4));
  yield* waitFor(2.52);
  yield* stage_99().opacity(0, 3.08);
  stage_99().remove();

  // Shot 100
  caption().set("Then, after the final block, eight words become the digest you recognize.");
  const stage_100 = createRef<Node>();
  const visual_100 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_100} opacity={0}>
      <ScriptShot ref={visual_100} scene={17} shot="100" y={-20} />
    </Node>
  );
  yield* all(stage_100().opacity(1, 1.7999999999999998), stage_100().position.x(-55, 6.0, easeInOutCubic), stage_100().scale(1.04, 6.0, easeInOutCubic), visual_100().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_100().opacity(0, 2.2);
  stage_100().remove();

});
