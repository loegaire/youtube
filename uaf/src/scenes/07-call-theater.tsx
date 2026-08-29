import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const dial = createRef<Circle>();
  const slot = createRef<Rect>();
  const oldTicket = createRef<Rect>();
  const newTicket = createRef<Rect>();
  const serial = createRef<Txt>();
  const reading = createRef<Txt>();
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'ALLOCATOR REUSE'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Circle ref={dial} x={-500} y={0} width={535} height={535} fill={C.panel} stroke={C.rule} lineWidth={18} startAngle={-90} endAngle={270} end={0}>
      <Txt text={'compatible'} y={-35} fill={C.ink} fontFamily={SANS} fontSize={42} fontWeight={820}/>
      <Txt text={'8-byte request'} y={42} fill={C.amber} fontFamily={MONO} fontSize={28} fontWeight={800}/>
    </Circle>
    <Rect ref={slot} x={390} y={0} width={560} height={450} radius={25} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.86}>
      <Txt text={'one allocator slot'} x={-215} y={-160} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22}/>
      <Rect ref={oldTicket} y={-55} width={350} height={108} radius={14} fill={C.coral} opacity={0} scale={0.78}>
        <Txt text={'released user'} fill={C.ink} fontFamily={SANS} fontSize={30} fontWeight={900}/>
      </Rect>
      <Rect ref={newTicket} y={100} width={350} height={108} radius={14} fill={C.amber} opacity={0} scale={0.78}>
        <Txt text={'new message'} fill={C.bg} fontFamily={SANS} fontSize={30} fontWeight={900}/>
      </Rect>
      <Txt ref={serial} text={'slot serial: 8B'} y={190} fill={C.output} fontFamily={MONO} fontSize={26} opacity={0}/>
    </Rect>
    <Txt ref={reading} text={'same storage; two interpretations'} y={390} fill={C.ink} fontFamily={SANS} fontSize={40} fontWeight={820} opacity={0}/>
  </Node>);
  yield* dial().end(0.76, 1.1);
  yield* all(dial().stroke(C.amber, 0.55), slot().opacity(1, 0.65), slot().scale(1, 0.65));
  yield* all(oldTicket().opacity(1, 0.55), oldTicket().scale(1, 0.55));
  yield* all(oldTicket().position.y(-135, 0.75), oldTicket().opacity(0.42, 0.75));
  yield* all(newTicket().opacity(1, 0.55), newTicket().scale(1, 0.55), newTicket().position.y(-55, 0.75));
  yield* all(serial().opacity(1, 0.55), newTicket().fill(C.output, 0.55));
  yield* all(newTicket().fill(C.amber, 0.55), reading().opacity(1, 0.55));
  yield* all(dial().stroke(C.output, 0.9), oldTicket().position.x(-70, 0.9));
  yield* all(oldTicket().position.x(0, 0.9), newTicket().scale(1.1, 0.9));
  yield* all(newTicket().scale(1, 0.85), slot().stroke(C.amber, 0.85));
  yield* all(slot().stroke(C.rule, 0.85), dial().end(1, 0.85));
  yield* all(dial().end(0.76, 0.85), serial().scale(1.1, 0.85));
  yield* all(serial().scale(1, 0.85), reading().scale(1.05, 0.85));
  yield* all(reading().scale(1, 0.85), newTicket().fill(C.output, 0.85));
  yield* all(newTicket().fill(C.amber, 0.85), oldTicket().opacity(0.48, 0.85));
  yield* all(oldTicket().opacity(0.42, 0.8), dial().stroke(C.amber, 0.8));
  yield* waitFor(2.25);
  yield* stage().opacity(0, 0.5);
});
