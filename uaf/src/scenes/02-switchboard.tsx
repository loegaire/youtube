import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const floor = createRef<Rect>();
  const request = createRef<Rect>();
  const user = createRef<Rect>();
  const functionField = createRef<Rect>();
  const nameField = createRef<Rect>();
  const functionRoute = createRef<Line>();
  const nameRoute = createRef<Line>();
  const explanation = createRef<Txt>();
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'HEAP OBJECT'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Txt text={'ask for space → build an object'} x={-785} y={-350} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={59} fontWeight={820}/>
    <Rect ref={floor} x={-260} y={55} width={1040} height={520} radius={28} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.86}>
      <Txt text={'allocator floor'} x={-450} y={-195} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={21}/>
      {[0,1,2,3].map(i => <Rect key={`tile-${i}`} x={-310 + i * 210} y={105} width={172} height={120} radius={14} fill={C.bg} stroke={C.rule} lineWidth={2}/>) }
    </Rect>
    <Rect ref={request} x={-610} y={62} width={230} height={100} radius={14} fill={C.amber} opacity={0} scale={0.72}>
      <Txt text={'malloc'} fill={C.bg} fontFamily={MONO} fontSize={31} fontWeight={900}/>
    </Rect>
    <Rect ref={user} x={-50} y={25} width={500} height={245} radius={18} fill={C.raised} stroke={C.mint} lineWidth={4} opacity={0} scale={0.78}>
      <Txt text={'user'} x={-205} y={-86} offsetX={-1} fill={C.mint} fontFamily={MONO} fontSize={27} fontWeight={900}/>
      <Rect ref={functionField} x={-118} y={25} width={210} height={110} radius={12} fill={C.panel} stroke={C.amber} lineWidth={2} opacity={0}>
        <Txt text={'whatToDo'} y={-18} fill={C.amber} fontFamily={MONO} fontSize={22}/>
        <Txt text={'function'} y={27} fill={C.ink} fontFamily={SANS} fontSize={22} fontWeight={800}/>
      </Rect>
      <Rect ref={nameField} x={120} y={25} width={210} height={110} radius={12} fill={C.panel} stroke={C.output} lineWidth={2} opacity={0}>
        <Txt text={'username'} y={-18} fill={C.output} fontFamily={MONO} fontSize={22}/>
        <Txt text={'name'} y={27} fill={C.ink} fontFamily={SANS} fontSize={22} fontWeight={800}/>
      </Rect>
    </Rect>
    <Line ref={functionRoute} points={[[0,185],[470,235]]} stroke={C.amber} lineWidth={6} endArrow arrowSize={18} end={0}/>
    <Line ref={nameRoute} points={[[235,185],[645,235]]} stroke={C.output} lineWidth={6} endArrow arrowSize={18} end={0}/>
    <Txt text={'callable code'} x={520} y={260} fill={C.amber} fontFamily={SANS} fontSize={27} fontWeight={800}/>
    <Txt text={'text'} x={700} y={260} fill={C.output} fontFamily={SANS} fontSize={27} fontWeight={800}/>
    <Txt ref={explanation} text={'one object, two directions'} y={402} fill={C.ink} fontFamily={SANS} fontSize={42} fontWeight={820} opacity={0}/>
  </Node>);
  yield* all(floor().opacity(1, 0.7), floor().scale(1, 0.7));
  yield* all(request().opacity(1, 0.45), request().scale(1, 0.45), request().position.x(-170, 0.9));
  yield* all(request().opacity(0, 0.35), user().opacity(1, 0.65), user().scale(1, 0.65));
  yield* functionField().opacity(1, 0.5);
  yield* all(nameField().opacity(1, 0.5), functionRoute().end(1, 0.7));
  yield* nameRoute().end(1, 0.7);
  yield* all(user().stroke(C.output, 0.55), explanation().opacity(1, 0.55));
  yield* all(user().stroke(C.mint, 0.55), functionField().fill(C.raised, 0.55), nameField().fill(C.raised, 0.55));
  yield* all(functionField().scale(1.1, 0.75), functionRoute().stroke(C.amber, 0.75));
  yield* all(functionField().scale(1, 0.75), nameField().scale(1.1, 0.75), nameRoute().stroke(C.output, 0.75));
  yield* all(nameField().scale(1, 0.75), user().scale(1.05, 0.75));
  yield* all(user().scale(1, 0.75), functionRoute().end(0.35, 0.75), nameRoute().end(0.35, 0.75));
  yield* all(functionRoute().end(1, 0.75), nameRoute().end(1, 0.75), functionField().stroke(C.mint, 0.75));
  yield* all(functionField().stroke(C.amber, 0.75), nameField().stroke(C.mint, 0.75), user().position.y(-20, 0.8));
  yield* all(nameField().stroke(C.output, 0.75), user().position.y(25, 0.8), explanation().scale(1.05, 0.75));
  yield* all(explanation().scale(1, 0.75), floor().stroke(C.mint, 0.75));
  yield* all(floor().stroke(C.rule, 0.75), user().stroke(C.output, 0.75));
  yield* all(user().stroke(C.mint, 0.75), functionRoute().stroke(C.amber, 0.75));
  yield* waitFor(2.2);
  yield* stage().opacity(0, 0.5);
});
