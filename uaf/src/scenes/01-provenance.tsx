import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const map = createRef<Rect>();
  const noteA = createRef<Rect>();
  const noteB = createRef<Rect>();
  const routeA = createRef<Line>();
  const routeB = createRef<Line>();
  const mailbox = createRef<Rect>();
  const caption = createRef<Txt>();
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'POINTER = STORED DIRECTION'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Rect ref={map} x={80} y={20} width={1520} height={640} radius={26} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.86}>
      {[0,1,2,3,4].map(i => <Line key={`v-${i}`} points={[[-610 + i * 305,-230],[-610 + i * 305,230]]} stroke={C.rule} lineWidth={2}/>) }
      {[0,1,2,3].map(i => <Line key={`h-${i}`} points={[[-610,-180 + i * 140],[610,-180 + i * 140]]} stroke={C.rule} lineWidth={2}/>) }
      <Txt text={'0x134'} x={-425} y={-110} fill={C.amber} fontFamily={MONO} fontSize={26} fontWeight={900}/>
      <Txt text={'a location on the map'} x={-425} y={-64} fill={C.muted} fontFamily={SANS} fontSize={23}/>
    </Rect>
    <Rect ref={mailbox} x={-360} y={-28} width={210} height={125} radius={16} fill={C.raised} stroke={C.amber} lineWidth={3} opacity={0} scale={0.7}>
      <Txt text={'0x134'} y={-20} fill={C.amber} fontFamily={MONO} fontSize={31} fontWeight={900}/>
      <Txt text={'42'} y={34} fill={C.ink} fontFamily={MONO} fontSize={35} fontWeight={800}/>
    </Rect>
    <Rect ref={noteA} x={-525} y={310} width={280} height={112} radius={13} fill={C.raised} stroke={C.mint} lineWidth={3} opacity={0} scale={0.76}>
      <Txt text={'pointer A'} y={-23} fill={C.mint} fontFamily={SANS} fontSize={26} fontWeight={800}/>
      <Txt text={'0x134'} y={30} fill={C.output} fontFamily={MONO} fontSize={29}/>
    </Rect>
    <Rect ref={noteB} x={465} y={310} width={280} height={112} radius={13} fill={C.raised} stroke={C.output} lineWidth={3} opacity={0} scale={0.76}>
      <Txt text={'pointer B'} y={-23} fill={C.output} fontFamily={SANS} fontSize={26} fontWeight={800}/>
      <Txt text={'0x134'} y={30} fill={C.output} fontFamily={MONO} fontSize={29}/>
    </Rect>
    <Line ref={routeA} points={[[-420,250],[-360,44]]} stroke={C.mint} lineWidth={6} endArrow arrowSize={18} end={0}/>
    <Line ref={routeB} points={[[360,250],[-260,44]]} stroke={C.output} lineWidth={6} endArrow arrowSize={18} end={0}/>
    <Txt ref={caption} text={'copy the direction — not the object'} y={425} fill={C.ink} fontFamily={SANS} fontSize={39} fontWeight={820} opacity={0}/>
  </Node>);
  yield* all(map().opacity(1, 0.75), map().scale(1, 0.75));
  yield* all(mailbox().opacity(1, 0.55), mailbox().scale(1, 0.55));
  yield* all(noteA().opacity(1, 0.55), noteA().scale(1, 0.55), noteA().position.y(250, 0.55));
  yield* routeA().end(1, 0.8);
  yield* all(noteB().opacity(1, 0.55), noteB().scale(1, 0.55), noteB().position.y(250, 0.55));
  yield* routeB().end(1, 0.9);
  yield* all(mailbox().stroke(C.coral, 0.6), caption().opacity(1, 0.6));
  yield* all(mailbox().stroke(C.amber, 0.55), routeA().stroke(C.mint, 0.55), routeB().stroke(C.output, 0.55));
  yield* all(noteA().position.x(-455, 0.9), routeA().stroke(C.amber, 0.9));
  yield* all(noteA().position.x(-525, 0.9), noteB().position.x(395, 0.9), routeB().stroke(C.amber, 0.9));
  yield* all(noteB().position.x(465, 0.9), mailbox().scale(1.12, 0.9));
  yield* all(mailbox().scale(1, 0.85), routeA().end(0.56, 0.85), routeB().end(0.56, 0.85));
  yield* all(routeA().end(1, 0.8), routeB().end(1, 0.8), routeA().stroke(C.mint, 0.8), routeB().stroke(C.output, 0.8));
  yield* all(noteA().stroke(C.amber, 0.75), noteB().stroke(C.amber, 0.75), caption().scale(1.05, 0.75));
  yield* all(noteA().stroke(C.mint, 0.75), noteB().stroke(C.output, 0.75), caption().scale(1, 0.75));
  yield* waitFor(2.25);
  yield* stage().opacity(0, 0.5);
});
