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


  // Shot 85
  caption().set("Now we can actually break something on screen.");
  const stage_85 = createRef<Node>();
  const visual_85 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_85} opacity={0}>
      <ScriptShot ref={visual_85} scene={15} shot="85" y={-20} />
    </Node>
  );
  yield* all(stage_85().opacity(1, 0.5724), stage_85().position.x(55, 1.9080, easeInOutCubic), stage_85().scale(1.04, 1.9080, easeInOutCubic), visual_85().animateData(1.9080));
  yield* waitFor(0.5724);
  yield* stage_85().opacity(0, 0.6996);
  stage_85().remove();

  // Shot 86
  caption().set("Our toy hash outputs only eight bits.");
  const stage_86 = createRef<Node>();
  const visual_86 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_86} opacity={0}>
      <ScriptShot ref={visual_86} scene={15} shot="86" y={-20} />
    </Node>
  );
  yield* all(stage_86().opacity(1, 0.6876), stage_86().position.x(-55, 2.2920, easeInOutCubic), stage_86().scale(1.04, 2.2920, easeInOutCubic), visual_86().animateData(2.2920));
  yield* waitFor(0.6876);
  yield* stage_86().opacity(0, 0.8404);
  stage_86().remove();

  // Shot 87
  caption().set("That gives us only 256 possible outputs.");
  const stage_87 = createRef<Node>();
  const visual_87 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_87} opacity={0}>
      <ScriptShot ref={visual_87} scene={15} shot="87" y={-20} />
    </Node>
  );
  yield* all(stage_87().opacity(1, 0.8892), stage_87().position.x(55, 2.9640, easeInOutCubic), stage_87().scale(1.04, 2.9640, easeInOutCubic), visual_87().animateData(2.9640));
  yield* waitFor(0.8892);
  yield* stage_87().opacity(0, 1.0868);
  stage_87().remove();

  // Shot 88
  caption().set("So instead of attempting some sophisticated cryptanalysis, we can simply generate candidates and search for a collision.");
  const stage_88 = createRef<Node>();
  const visual_88 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_88} opacity={0}>
      <ScriptShot ref={visual_88} scene={15} shot="88" y={-20} />
    </Node>
  );
  yield* all(stage_88().opacity(1, 1.1196), stage_88().position.x(-55, 3.7320, easeInOutCubic), stage_88().scale(1.04, 3.7320, easeInOutCubic), visual_88().animateData(3.7320));
  yield* waitFor(1.1196);
  yield* stage_88().opacity(0, 1.3684);
  stage_88().remove();

  // Shot 89
  caption().set("The first collision we care about is any two different inputs with the same eight-bit result.");
  const stage_89 = createRef<Node>();
  const visual_89 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_89} opacity={0}>
      <ScriptShot ref={visual_89} scene={15} shot="89" y={-20} />
    </Node>
  );
  yield* all(stage_89().opacity(1, 0.8028), stage_89().position.x(55, 2.6760, easeInOutCubic), stage_89().scale(1.04, 2.6760, easeInOutCubic), visual_89().animateData(2.6760));
  yield* waitFor(0.8028);
  yield* stage_89().opacity(0, 0.9812);
  stage_89().remove();

  // Shot 90
  caption().set("For this deliberately tiny function, `y` and the string containing a space followed by `@` both produce the same eight-bit result: `0x8a`.");
  const stage_90 = createRef<Node>();
  const visual_90 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_90} opacity={0}>
      <ScriptShot ref={visual_90} scene={15} shot="90" y={-20} />
    </Node>
  );
  yield* all(stage_90().opacity(1, 2.2428), stage_90().position.x(-55, 7.4760, easeInOutCubic), stage_90().scale(1.04, 7.4760, easeInOutCubic), visual_90().animateData(7.4760));
  yield* waitFor(2.2428);
  yield* stage_90().opacity(0, 2.7412);
  stage_90().remove();

  // Shot 91
  caption().set("Same digest. Different input. That is a collision.");
  const stage_91 = createRef<Node>();
  const visual_91 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_91} opacity={0}>
      <ScriptShot ref={visual_91} scene={15} shot="91" y={-20} />
    </Node>
  );
  yield* all(stage_91().opacity(1, 0.8604), stage_91().position.x(55, 2.8680, easeInOutCubic), stage_91().scale(1.04, 2.8680, easeInOutCubic), visual_91().animateData(2.8680));
  yield* waitFor(0.8604);
  yield* stage_91().opacity(0, 1.0516);
  stage_91().remove();

  // Shot 92
  caption().set("And because the output is only eight bits, this was never a serious challenge.");
  const stage_92 = createRef<Node>();
  const visual_92 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_92} opacity={0}>
      <ScriptShot ref={visual_92} scene={15} shot="92" y={-20} />
    </Node>
  );
  yield* all(stage_92().opacity(1, 0.9468), stage_92().position.x(-55, 3.1560, easeInOutCubic), stage_92().scale(1.04, 3.1560, easeInOutCubic), visual_92().animateData(3.1560));
  yield* waitFor(0.9468);
  yield* stage_92().opacity(0, 1.1572);
  stage_92().remove();

  // Shot 93
  caption().set("This is why output size matters: shrinking a hash from 256 bits to 8 bits does not merely make the digest shorter. It makes generic collision searching astronomically easier.");
  const stage_93 = createRef<Node>();
  const visual_93 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_93} opacity={0}>
      <ScriptShot ref={visual_93} scene={15} shot="93" y={-20} />
    </Node>
  );
  yield* all(stage_93().opacity(1, 2.2428), stage_93().position.x(55, 7.4760, easeInOutCubic), stage_93().scale(1.04, 7.4760, easeInOutCubic), visual_93().animateData(7.4760));
  yield* waitFor(2.2428);
  yield* stage_93().opacity(0, 2.7412);
  stage_93().remove();

});
