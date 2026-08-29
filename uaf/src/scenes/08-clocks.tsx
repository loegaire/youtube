import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const bytes: Rect[] = [];
  const byteText: Txt[] = [];
  const lens = createRef<Rect>();
  const route = createRef<Line>();
  const target = createRef<Rect>();
  const conclusion = createRef<Txt>();
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'THE SAME EIGHT BYTES, READ TWICE'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Txt text={'message write'} x={-650} y={-300} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={26} fontWeight={900}/>
    <Txt text={'stale cmd view'} x={-650} y={205} offsetX={-1} fill={C.coral} fontFamily={MONO} fontSize={26} fontWeight={900}/>
    {Array.from({length: 8}, (_, i) => <Rect ref={makeRef(bytes, i)} key={`byte-${i}`} x={-560 + i * 145} y={-25} width={112} height={150} radius={13} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.72}>
      <Txt ref={makeRef(byteText, i)} text={'··'} fill={C.muted} fontFamily={MONO} fontSize={34} fontWeight={800}/>
    </Rect>)}
    <Rect ref={lens} x={-345} y={-25} width={555} height={210} radius={18} stroke={C.coral} lineWidth={4} fill={C.clear} opacity={0}>
      <Txt text={'first four bytes → function destination'} y={142} fill={C.coral} fontFamily={SANS} fontSize={25} fontWeight={820}/>
    </Rect>
    <Line ref={route} points={[[55,45],[415,45]]} stroke={C.coral} lineWidth={8} endArrow arrowSize={20} end={0}/>
    <Rect ref={target} x={595} y={45} width={360} height={175} radius={20} fill={C.raised} stroke={C.coral} lineWidth={4} opacity={0} scale={0.76}>
      <Txt text={'challenge'} y={-34} fill={C.coral} fontFamily={SANS} fontSize={29} fontWeight={820}/>
      <Txt text={'function'} y={28} fill={C.ink} fontFamily={MONO} fontSize={37} fontWeight={900}/>
    </Rect>
    <Txt ref={conclusion} text={'stale interpretation redirects control flow'} y={390} fill={C.ink} fontFamily={SANS} fontSize={38} fontWeight={820} opacity={0}/>
  </Node>);
  yield* sequence(0.16, ...bytes.map(byte => all(byte.opacity(1, 0.38), byte.scale(1, 0.38))));
  yield* sequence(0.12, ...byteText.map((text, i) => text.text(i < 4 ? 'AA' : 'BB', 0.25)));
  yield* all(lens().opacity(1, 0.6), lens().position.y(35, 0.6));
  yield* all(bytes[0].fill(C.coral, 0.55), bytes[1].fill(C.coral, 0.55), bytes[2].fill(C.coral, 0.55), bytes[3].fill(C.coral, 0.55));
  yield* route().end(1, 0.8);
  yield* all(target().opacity(1, 0.6), target().scale(1, 0.6));
  yield* all(target().fill(C.coral, 0.55), conclusion().opacity(1, 0.55));
  yield* all(bytes[4].fill(C.output, 0.55), bytes[5].fill(C.output, 0.55), bytes[6].fill(C.output, 0.55), bytes[7].fill(C.output, 0.55));
  yield* all(lens().position.x(-270, 0.85), bytes[0].scale(1.09, 0.85), bytes[1].scale(1.09, 0.85));
  yield* all(lens().position.x(-345, 0.85), bytes[0].scale(1, 0.85), bytes[1].scale(1, 0.85), bytes[2].scale(1.09, 0.85), bytes[3].scale(1.09, 0.85));
  yield* all(bytes[2].scale(1, 0.85), bytes[3].scale(1, 0.85), route().end(0.45, 0.85));
  yield* all(route().end(1, 0.85), target().scale(1.08, 0.85));
  yield* all(target().scale(1, 0.85), conclusion().scale(1.05, 0.85));
  yield* all(conclusion().scale(1, 0.85), bytes[4].position.y(24, 0.85), bytes[5].position.y(24, 0.85), bytes[6].position.y(24, 0.85), bytes[7].position.y(24, 0.85));
  yield* all(bytes[4].position.y(0, 0.85), bytes[5].position.y(0, 0.85), bytes[6].position.y(0, 0.85), bytes[7].position.y(0, 0.85));
  yield* waitFor(1.55);
  yield* stage().opacity(0, 0.5);
});
