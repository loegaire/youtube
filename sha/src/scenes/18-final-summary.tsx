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


  // Shot 101
  caption().set("A hash takes arbitrary-length input and produces a fixed-length digest.");
  const stage_101 = createRef<Node>();
  const visual_101 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_101} opacity={0}>
      <ScriptShot ref={visual_101} scene={18} shot="101" y={-20} />
    </Node>
  );
  yield* all(stage_101().opacity(1, 1.6199999999999999), stage_101().position.x(55, 5.3999999999999995, easeInOutCubic), stage_101().scale(1.04, 5.3999999999999995, easeInOutCubic), visual_101().animateData(5.3999999999999995));
  yield* waitFor(1.6199999999999999);
  yield* stage_101().opacity(0, 1.98);
  stage_101().remove();

  // Shot 102
  caption().set("SHA-256 does it with 512-bit blocks, 32-bit words, eight working variables, a sixty-four-word message schedule, and sixty-four compression rounds.");
  const stage_102 = createRef<Node>();
  const visual_102 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_102} opacity={0}>
      <ScriptShot ref={visual_102} scene={18} shot="102" y={-20} />
    </Node>
  );
  yield* all(stage_102().opacity(1, 2.16), stage_102().position.x(-55, 7.199999999999999, easeInOutCubic), stage_102().scale(1.04, 7.199999999999999, easeInOutCubic), visual_102().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_102().opacity(0, 2.64);
  stage_102().remove();

  // Shot 103
  caption().set("Its security is about making certain attacks computationally infeasible\u2014not about making the output impossible to compute.");
  const stage_103 = createRef<Node>();
  const visual_103 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_103} opacity={0}>
      <ScriptShot ref={visual_103} scene={18} shot="103" y={-20} />
    </Node>
  );
  yield* all(stage_103().opacity(1, 2.16), stage_103().position.x(55, 7.199999999999999, easeInOutCubic), stage_103().scale(1.04, 7.199999999999999, easeInOutCubic), visual_103().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_103().opacity(0, 2.64);
  stage_103().remove();

  // Shot 104
  caption().set("SHA-1 is a useful warning: when practical collision attacks arrive, an old hash can become the wrong primitive even if the basic idea of hashing remains sound.");
  const stage_104 = createRef<Node>();
  const visual_104 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_104} opacity={0}>
      <ScriptShot ref={visual_104} scene={18} shot="104" y={-20} />
    </Node>
  );
  yield* all(stage_104().opacity(1, 1.7999999999999998), stage_104().position.x(-55, 6.0, easeInOutCubic), stage_104().scale(1.04, 6.0, easeInOutCubic), visual_104().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_104().opacity(0, 2.2);
  stage_104().remove();

  // Shot 105
  caption().set("And for passwords, remember the distinction: never store plaintext passwords, but also do not replace plaintext with a raw fast SHA-256 hash. Use a dedicated password-hashing scheme such as Argon2id with a unique salt and appropriately tuned cost.");
  const stage_105 = createRef<Node>();
  const visual_105 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_105} opacity={0}>
      <ScriptShot ref={visual_105} scene={18} shot="105" y={-20} />
    </Node>
  );
  yield* all(stage_105().opacity(1, 2.52), stage_105().position.x(55, 8.4, easeInOutCubic), stage_105().scale(1.04, 8.4, easeInOutCubic), visual_105().animateData(8.4));
  yield* waitFor(2.52);
  yield* stage_105().opacity(0, 3.08);
  stage_105().remove();

  // Shot 106
  caption().set("The final mental model is simple: the input goes in, the state gets mixed over and over, and a fixed-size digest comes out.");
  const stage_106 = createRef<Node>();
  const visual_106 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_106} opacity={0}>
      <ScriptShot ref={visual_106} scene={18} shot="106" y={-20} />
    </Node>
  );
  yield* all(stage_106().opacity(1, 1.7999999999999998), stage_106().position.x(-55, 6.0, easeInOutCubic), stage_106().scale(1.04, 6.0, easeInOutCubic), visual_106().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_106().opacity(0, 2.2);
  stage_106().remove();

  // Shot 107
  caption().set("The magic is not that the computer cannot calculate the hash.");
  const stage_107 = createRef<Node>();
  const visual_107 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_107} opacity={0}>
      <ScriptShot ref={visual_107} scene={18} shot="107" y={-20} />
    </Node>
  );
  yield* all(stage_107().opacity(1, 0.8999999999999999), stage_107().position.x(55, 3.0, easeInOutCubic), stage_107().scale(1.04, 3.0, easeInOutCubic), visual_107().animateData(3.0));
  yield* waitFor(0.8999999999999999);
  yield* stage_107().opacity(0, 1.1);
  stage_107().remove();

  // Shot 108
  caption().set("The magic is that, when the construction is sound, calculating the digest is easy\u2014and producing the right kind of input from the digest, or producing a useful collision, is supposed to be hard.");
  const stage_108 = createRef<Node>();
  const visual_108 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_108} opacity={0}>
      <ScriptShot ref={visual_108} scene={18} shot="108" y={-20} />
    </Node>
  );
  yield* all(stage_108().opacity(1, 2.16), stage_108().position.x(-55, 7.199999999999999, easeInOutCubic), stage_108().scale(1.04, 7.199999999999999, easeInOutCubic), visual_108().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_108().opacity(0, 2.64);
  stage_108().remove();

  // Shot 109
  caption().set("That is the core idea behind cryptographic hashing.");
  const stage_109 = createRef<Node>();
  const visual_109 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_109} opacity={0}>
      <ScriptShot ref={visual_109} scene={18} shot="109" y={-20} />
    </Node>
  );
  yield* all(stage_109().opacity(1, 1.08), stage_109().position.x(55, 3.5999999999999996, easeInOutCubic), stage_109().scale(1.04, 3.5999999999999996, easeInOutCubic), visual_109().animateData(3.5999999999999996));
  yield* waitFor(1.08);
  yield* stage_109().opacity(0, 1.32);
  stage_109().remove();

  // Shot 110
  caption().set("And once you understand the bits moving through the machine, SHA-256 stops looking like a magic incantation and starts looking like what it really is: a carefully engineered state machine.");
  const stage_110 = createRef<Node>();
  const visual_110 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_110} opacity={0}>
      <ScriptShot ref={visual_110} scene={18} shot="110" y={-20} />
    </Node>
  );
  yield* all(stage_110().opacity(1, 2.6999999999999997), stage_110().position.x(-55, 9.0, easeInOutCubic), stage_110().scale(1.04, 9.0, easeInOutCubic), visual_110().animateData(9.0));
  yield* waitFor(2.6999999999999997);
  yield* stage_110().opacity(0, 3.3);
  stage_110().remove();

  // Shot 111
  caption().set("One input. One fixed-size digest. A lot of very deliberate mathematics in between.");
  const stage_111 = createRef<Node>();
  const visual_111 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_111} opacity={0}>
      <ScriptShot ref={visual_111} scene={18} shot="111" y={-20} />
    </Node>
  );
  yield* all(stage_111().opacity(1, 1.7999999999999998), stage_111().position.x(55, 6.0, easeInOutCubic), stage_111().scale(1.04, 6.0, easeInOutCubic), visual_111().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_111().opacity(0, 2.2);
  stage_111().remove();

  // Shot 112
  caption().set("");
  const stage_112 = createRef<Node>();
  const visual_112 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_112} opacity={0}>
      <ScriptShot ref={visual_112} scene={18} shot="112" y={-20} />
    </Node>
  );
  yield* all(stage_112().opacity(1, 1.7999999999999998), stage_112().position.x(-55, 6.0, easeInOutCubic), stage_112().scale(1.04, 6.0, easeInOutCubic), visual_112().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_112().opacity(0, 2.2);
  stage_112().remove();

});
