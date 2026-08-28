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


  // Shot 5
  caption().set("The first example is the obvious one: passwords.");
  const stage_5 = createRef<Node>();
  const visual_5 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_5} opacity={0}>
      <ScriptShot ref={visual_5} scene={2} shot="5" y={-20} />
    </Node>
  );
  yield* all(stage_5().opacity(1, 1.7999999999999998), stage_5().position.x(55, 6.0, easeInOutCubic), stage_5().scale(1.04, 6.0, easeInOutCubic), visual_5().animateData(6.0));
  yield* waitFor(1.7999999999999998);
  yield* stage_5().opacity(0, 2.2);
  stage_5().remove();

  // Shot 6
  caption().set("A properly designed password system should not need to store your password as readable text. It stores a verifier instead, allowing a future login attempt to be checked against the stored result.");
  const stage_6 = createRef<Node>();
  const visual_6 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_6} opacity={0}>
      <ScriptShot ref={visual_6} scene={2} shot="6" y={-20} />
    </Node>
  );
  yield* all(stage_6().opacity(1, 2.88), stage_6().position.x(-55, 9.6, easeInOutCubic), stage_6().scale(1.04, 9.6, easeInOutCubic), visual_6().animateData(9.6));
  yield* waitFor(2.88);
  yield* stage_6().opacity(0, 3.52);
  stage_6().remove();

  // Shot 7
  caption().set("There is an important catch, though: SHA-256 itself is not the right tool for storing passwords. It is deliberately fast.");
  const stage_7 = createRef<Node>();
  const visual_7 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_7} opacity={0}>
      <ScriptShot ref={visual_7} scene={2} shot="7" y={-20} />
    </Node>
  );
  yield* all(stage_7().opacity(1, 2.52), stage_7().position.x(55, 8.4, easeInOutCubic), stage_7().scale(1.04, 8.4, easeInOutCubic), visual_7().animateData(8.4));
  yield* waitFor(2.52);
  yield* stage_7().opacity(0, 3.08);
  stage_7().remove();

  // Shot 8
  caption().set("The second use is file integrity. You download a file, calculate its hash, and compare that result with a trusted value.");
  const stage_8 = createRef<Node>();
  const visual_8 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_8} opacity={0}>
      <ScriptShot ref={visual_8} scene={2} shot="8" y={-20} />
    </Node>
  );
  yield* all(stage_8().opacity(1, 2.88), stage_8().position.x(-55, 9.6, easeInOutCubic), stage_8().scale(1.04, 9.6, easeInOutCubic), visual_8().animateData(9.6));
  yield* waitFor(2.88);
  yield* stage_8().opacity(0, 3.52);
  stage_8().remove();

  // Shot 9
  caption().set("Change even one bit of the message, and the resulting digest should change dramatically.");
  const stage_9 = createRef<Node>();
  const visual_9 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_9} opacity={0}>
      <ScriptShot ref={visual_9} scene={2} shot="9" y={-20} />
    </Node>
  );
  yield* all(stage_9().opacity(1, 2.52), stage_9().position.x(55, 8.4, easeInOutCubic), stage_9().scale(1.04, 8.4, easeInOutCubic), visual_9().animateData(8.4));
  yield* waitFor(2.52);
  yield* stage_9().opacity(0, 3.08);
  stage_9().remove();

  // Shot 10
  caption().set("Hashes also sit underneath digital signatures. The hash compresses the message into a fixed-size digest, and the signature mechanism protects that digest.");
  const stage_10 = createRef<Node>();
  const visual_10 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_10} opacity={0}>
      <ScriptShot ref={visual_10} scene={2} shot="10" y={-20} />
    </Node>
  );
  yield* all(stage_10().opacity(1, 3.2399999999999998), stage_10().position.x(-55, 10.799999999999999, easeInOutCubic), stage_10().scale(1.04, 10.799999999999999, easeInOutCubic), visual_10().animateData(10.799999999999999));
  yield* waitFor(3.2399999999999998);
  yield* stage_10().opacity(0, 3.96);
  stage_10().remove();

  // Shot 11
  caption().set("So the hash by itself is not the identity of the publisher. The signature and its public-key verification are what provide authenticity.");
  const stage_11 = createRef<Node>();
  const visual_11 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_11} opacity={0}>
      <ScriptShot ref={visual_11} scene={2} shot="11" y={-20} />
    </Node>
  );
  yield* all(stage_11().opacity(1, 2.16), stage_11().position.x(55, 7.199999999999999, easeInOutCubic), stage_11().scale(1.04, 7.199999999999999, easeInOutCubic), visual_11().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_11().opacity(0, 2.64);
  stage_11().remove();

  // Shot 12
  caption().set("They also appear in integrity checks around systems and networks, where the hash acts like a compact fingerprint of some larger piece of data.");
  const stage_12 = createRef<Node>();
  const visual_12 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_12} opacity={0}>
      <ScriptShot ref={visual_12} scene={2} shot="12" y={-20} />
    </Node>
  );
  yield* all(stage_12().opacity(1, 2.16), stage_12().position.x(-55, 7.199999999999999, easeInOutCubic), stage_12().scale(1.04, 7.199999999999999, easeInOutCubic), visual_12().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_12().opacity(0, 2.64);
  stage_12().remove();

  // Shot 13
  caption().set("And then there is the much broader world of hash tables.");
  const stage_13 = createRef<Node>();
  const visual_13 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_13} opacity={0}>
      <ScriptShot ref={visual_13} scene={2} shot="13" y={-20} />
    </Node>
  );
  yield* all(stage_13().opacity(1, 2.16), stage_13().position.x(55, 7.199999999999999, easeInOutCubic), stage_13().scale(1.04, 7.199999999999999, easeInOutCubic), visual_13().animateData(7.199999999999999));
  yield* waitFor(2.16);
  yield* stage_13().opacity(0, 2.64);
  stage_13().remove();

  // Shot 14
  caption().set("Hash tables use hashing to quickly choose a bucket. That is the same broad idea, but a normal hash-table hash does not automatically have the security properties of a cryptographic hash.");
  const stage_14 = createRef<Node>();
  const visual_14 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_14} opacity={0}>
      <ScriptShot ref={visual_14} scene={2} shot="14" y={-20} />
    </Node>
  );
  yield* all(stage_14().opacity(1, 2.34), stage_14().position.x(-55, 7.8, easeInOutCubic), stage_14().scale(1.04, 7.8, easeInOutCubic), visual_14().animateData(7.8));
  yield* waitFor(2.34);
  yield* stage_14().opacity(0, 2.86);
  stage_14().remove();

  // Shot 15
  caption().set("So now we have the vocabulary. Let\u2019s build a hash from the ground up.");
  const stage_15 = createRef<Node>();
  const visual_15 = createRef<ScriptShot>();
  view.add(
    <Node ref={stage_15} opacity={0}>
      <ScriptShot ref={visual_15} scene={2} shot="15" y={-20} />
    </Node>
  );
  yield* all(stage_15().opacity(1, 1.26), stage_15().position.x(55, 4.2, easeInOutCubic), stage_15().scale(1.04, 4.2, easeInOutCubic), visual_15().animateData(4.2));
  yield* waitFor(1.26);
  yield* stage_15().opacity(0, 1.54);
  stage_15().remove();

});
