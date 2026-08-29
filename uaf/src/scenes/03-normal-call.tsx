import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const rail = createRef<Line>();
  const object = createRef<Rect>();
  const release = createRef<Rect>();
  const direction = createRef<Rect>();
  const drop = createRef<Line>();
  const verdict = createRef<Txt>();
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'OBJECT LIFETIME'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Txt text={'created'} x={-690} y={260} fill={C.mint} fontFamily={MONO} fontSize={25}/>
    <Txt text={'used'} x={-70} y={260} fill={C.output} fontFamily={MONO} fontSize={25}/>
    <Txt text={'released'} x={530} y={260} fill={C.coral} fontFamily={MONO} fontSize={25}/>
    <Line ref={rail} points={[[-700,190],[700,190]]} stroke={C.rule} lineWidth={10} lineCap={'round'} end={0}/>
    <Rect ref={object} x={-550} y={95} width={240} height={140} radius={18} fill={C.raised} stroke={C.mint} lineWidth={4} opacity={0} scale={0.75}>
      <Txt text={'user object'} y={-22} fill={C.ink} fontFamily={SANS} fontSize={30} fontWeight={820}/>
      <Txt text={'alive'} y={32} fill={C.mint} fontFamily={MONO} fontSize={25}/>
    </Rect>
    <Rect ref={direction} x={-510} y={-145} width={300} height={105} radius={14} fill={C.panel} stroke={C.output} lineWidth={3} opacity={0} scale={0.78}>
      <Txt text={'saved direction'} y={-19} fill={C.output} fontFamily={SANS} fontSize={26} fontWeight={800}/>
      <Txt text={'0x…'} y={28} fill={C.ink} fontFamily={MONO} fontSize={27}/>
    </Rect>
    <Line ref={drop} points={[[-410,-90],[-410,10]]} stroke={C.output} lineWidth={5} endArrow arrowSize={16} end={0}/>
    <Rect ref={release} x={545} y={92} width={260} height={110} radius={15} fill={C.coral} opacity={0} scale={0.72}>
      <Txt text={'free(user)'} fill={C.bg} fontFamily={MONO} fontSize={31} fontWeight={900}/>
    </Rect>
    <Txt ref={verdict} text={'a direction can outlive its destination'} y={380} fill={C.ink} fontFamily={SANS} fontSize={39} fontWeight={820} opacity={0}/>
  </Node>);
  yield* rail().end(1, 0.85);
  yield* all(object().opacity(1, 0.55), object().scale(1, 0.55));
  yield* all(direction().opacity(1, 0.55), direction().scale(1, 0.55), drop().end(1, 0.55));
  yield* all(object().position.x(-10, 1.15), direction().position.x(-10, 1.15));
  yield* all(release().opacity(1, 0.55), release().scale(1, 0.55));
  yield* all(object().opacity(0.1, 0.75), object().scale(0.6, 0.75), release().position.y(13, 0.75));
  yield* all(direction().stroke(C.coral, 0.55), verdict().opacity(1, 0.55));
  yield* all(direction().position.y(-80, 0.8), release().opacity(0.35, 0.8));
  yield* all(direction().position.x(145, 0.9), direction().stroke(C.amber, 0.9));
  yield* all(direction().position.x(-10, 0.9), direction().position.y(-135, 0.9));
  yield* all(direction().position.y(-80, 0.85), release().scale(1.08, 0.85));
  yield* all(release().scale(1, 0.85), rail().stroke(C.coral, 0.85));
  yield* all(rail().stroke(C.rule, 0.85), verdict().scale(1.05, 0.85));
  yield* all(verdict().scale(1, 0.8), direction().stroke(C.coral, 0.8));
  yield* all(direction().scale(1.08, 0.85), release().opacity(0.55, 0.85));
  yield* all(direction().scale(1, 0.85), release().opacity(0.35, 0.85));
  yield* waitFor(2.15);
  yield* stage().opacity(0, 0.5);
});
