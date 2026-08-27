import {makeScene2D, Node, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {C, FONT, TechPanel, bg, label, scanlines} from '../components';

export default makeScene2D(function* (view) {
  view.add(<Node>{bg()}</Node>);
  const attack = createRef<Node>();
  const term = createRef<TechPanel>();
  const code = createRef<TechPanel>();
  const stamp = createRef<Txt>();
  view.add(<Node ref={attack} opacity={0}>{label('COLLISION SPACE // TOYHASH8', C.yellow, 54, {y: -410})}<TechPanel ref={term} title="collision search" icon="\uf120" x={-420} y={-40} w={780} h={480} /><TechPanel ref={code} title="toyhash.py" icon="\uf120" x={420} y={-40} w={780} h={480} /><Txt ref={stamp} text="COLLISION FOUND \uf188" fill={C.red} fontFamily={FONT} fontSize={72} y={300} opacity={0} /></Node>);
  code().line('def toyhash(data):', C.yellow, 28); code().line('    h = 0x6d', C.cyan, 28); code().line('    for x in data:', C.yellow, 28); code().line('        h = (h ^ x) + 0x3d', C.lime, 28); code().line('        h &= 0xff', C.lime, 28); code().line('        h = ((h << 3) & 0xff) | (h >> 5)', C.lime, 28); code().line('    return h', C.orange, 28);
  yield* all(attack().opacity(1, 0.7), attack().scale(1.05, 0.7));
  yield* term().typeLine('$ ./toyhash --collision', C.cyan); yield* term().typeLine('...searching 256 outputs', C.lime); yield* term().typeLine('$ ./toyhash y', C.yellow); yield* term().typeLine('8a', C.red); yield* term().typeLine('$ ./toyhash " @"', C.yellow); yield* term().typeLine('8a', C.red); yield* stamp().opacity(1, 0.4); yield* stamp().scale(1.1, 0.4); yield* waitFor(1);
});
