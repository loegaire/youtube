import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const selector = createRef<Rect>();
  const field = createRef<Rect>();
  const relay = createRef<Line>();
  const fn = createRef<Rect>();
  const read = createRef<Rect>();
  const insight = createRef<Txt>();
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'NORMAL INDIRECT DISPATCH'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Node x={-580} y={5}>
      <Txt text={'menu'} x={-130} y={-265} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22}/>
      {['Subscribe', 'Delete', 'Message'].map((item, i) => <Rect key={item} y={-120 + i * 130} width={280} height={92} radius={14} fill={C.panel} stroke={i === 0 ? C.mint : C.rule} lineWidth={2}>
        <Txt text={item} fill={i === 0 ? C.mint : C.ink} fontFamily={SANS} fontSize={27} fontWeight={780}/>
      </Rect>)}
      <Rect ref={selector} y={-120} width={314} height={122} radius={18} fill={C.clear} stroke={C.amber} lineWidth={5}/>
    </Node>
    <Rect ref={field} x={-90} y={-20} width={380} height={160} radius={19} fill={C.raised} stroke={C.amber} lineWidth={3} opacity={0} scale={0.78}>
      <Txt text={'whatToDo'} y={-38} fill={C.amber} fontFamily={MONO} fontSize={29} fontWeight={900}/>
      <Txt text={'s()'} y={33} fill={C.ink} fontFamily={MONO} fontSize={48} fontWeight={900}/>
    </Rect>
    <Rect ref={read} x={-90} y={245} width={410} height={98} radius={14} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0}>
      <Txt text={'doProcess reads field 0'} fill={C.output} fontFamily={SANS} fontSize={25} fontWeight={760}/>
    </Rect>
    <Line ref={relay} points={[[120,-20],[470,-20]]} stroke={C.amber} lineWidth={8} endArrow arrowSize={22} end={0}/>
    <Rect ref={fn} x={650} y={-20} width={300} height={160} radius={22} fill={C.raised} stroke={C.mint} lineWidth={4} opacity={0} scale={0.74}>
      <Txt text={'s()'} y={-22} fill={C.mint} fontFamily={MONO} fontSize={52} fontWeight={900}/>
      <Txt text={'subscribe'} y={38} fill={C.ink} fontFamily={SANS} fontSize={25} fontWeight={800}/>
    </Rect>
    <Txt ref={insight} text={'a function pointer is a chosen destination'} y={380} fill={C.ink} fontFamily={SANS} fontSize={39} fontWeight={820} opacity={0}/>
  </Node>);
  yield* selector().position.y(-120, 0.25);
  yield* all(selector().stroke(C.mint, 0.55), field().opacity(1, 0.55), field().scale(1, 0.55));
  yield* all(read().opacity(1, 0.55), read().position.y(190, 0.55));
  yield* relay().end(1, 0.75);
  yield* all(fn().opacity(1, 0.6), fn().scale(1, 0.6));
  yield* all(field().stroke(C.mint, 0.55), insight().opacity(1, 0.55));
  yield* all(selector().position.y(10, 0.65), field().fill(C.panel, 0.65));
  yield* all(selector().position.y(-120, 0.65), field().fill(C.raised, 0.65));
  yield* all(field().scale(1.1, 0.85), read().stroke(C.output, 0.85));
  yield* all(field().scale(1, 0.85), relay().end(0.45, 0.85));
  yield* all(relay().end(1, 0.85), fn().scale(1.1, 0.85));
  yield* all(fn().scale(1, 0.85), selector().stroke(C.amber, 0.85));
  yield* all(selector().stroke(C.mint, 0.85), field().stroke(C.mint, 0.85));
  yield* all(field().stroke(C.amber, 0.85), fn().stroke(C.output, 0.85), insight().scale(1.05, 0.85));
  yield* all(fn().stroke(C.mint, 0.85), insight().scale(1, 0.85));
  yield* all(read().position.y(215, 0.8), relay().stroke(C.mint, 0.8));
  yield* all(read().position.y(190, 0.8), relay().stroke(C.amber, 0.8));
  yield* waitFor(2.35);
  yield* stage().opacity(0, 0.5);
});
