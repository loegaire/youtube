import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const ledger = createRef<Rect>();
  const live = createRef<Rect>();
  const release = createRef<Rect>();
  const ribbon = createRef<Rect>();
  const gate = createRef<Rect>();
  const slash = createRef<Line>();
  const problem = createRef<Txt>();
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'THE DANGLING REFERENCE'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Rect ref={ledger} x={-420} y={-6} width={720} height={660} radius={26} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.86}>
      <Txt text={'ownership'} x={-300} y={-250} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={23}/>
      <Txt text={'user'} x={-300} y={-145} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={33} fontWeight={820}/>
      <Rect ref={live} x={100} y={-145} width={280} height={74} radius={11} fill={C.raised} stroke={C.mint} lineWidth={3}>
        <Txt text={'LIVE'} fill={C.mint} fontFamily={MONO} fontSize={31} fontWeight={900}/>
      </Rect>
      <Line points={[[-310,-92],[290,-92]]} stroke={C.rule} lineWidth={3}/>
      <Txt text={'action'} x={-300} y={5} offsetX={-1} fill={C.muted} fontFamily={SANS} fontSize={27}/>
      <Rect ref={release} x={90} y={5} width={300} height={80} radius={11} fill={C.coral} opacity={0} scale={0.76}>
        <Txt text={'free(user)'} fill={C.bg} fontFamily={MONO} fontSize={30} fontWeight={900}/>
      </Rect>
      <Rect ref={ribbon} x={-35} y={150} width={570} height={108} radius={14} fill={C.raised} stroke={C.output} lineWidth={3} opacity={0}>
        <Txt text={'main still keeps  user = 0x…'} fill={C.output} fontFamily={MONO} fontSize={27}/>
      </Rect>
    </Rect>
    <Rect ref={gate} x={450} y={-6} width={410} height={410} radius={205} fill={C.panel} stroke={C.rule} lineWidth={5} opacity={0} scale={0.74}>
      <Txt text={'before use'} y={-70} fill={C.muted} fontFamily={SANS} fontSize={27} fontWeight={800}/>
      <Txt text={'valid?'} y={-5} fill={C.ink} fontFamily={SANS} fontSize={49} fontWeight={900}/>
      <Txt text={'NO CHECK'} y={73} fill={C.coral} fontFamily={MONO} fontSize={29} fontWeight={900}/>
    </Rect>
    <Line ref={slash} points={[[330,-90],[570,140]]} stroke={C.coral} lineWidth={18} lineCap={'round'} end={0}/>
    <Txt ref={problem} text={'storage released; old direction survives'} y={390} fill={C.ink} fontFamily={SANS} fontSize={38} fontWeight={820} opacity={0}/>
  </Node>);
  yield* all(ledger().opacity(1, 0.7), ledger().scale(1, 0.7));
  yield* all(release().opacity(1, 0.55), release().scale(1, 0.55));
  yield* all(live().fill(C.coral, 0.6), live().stroke(C.coral, 0.6));
  yield* live().children()[0].opacity(0, 0.2);
  yield* all(ribbon().opacity(1, 0.6), ribbon().position.y(100, 0.6));
  yield* all(gate().opacity(1, 0.7), gate().scale(1, 0.7));
  yield* slash().end(1, 0.6);
  yield* all(gate().stroke(C.coral, 0.55), problem().opacity(1, 0.55));
  yield* all(ribbon().stroke(C.coral, 0.65), release().opacity(0.4, 0.65));
  yield* all(ribbon().position.x(50, 0.9), gate().scale(1.06, 0.9));
  yield* all(ribbon().position.x(-35, 0.9), gate().scale(1, 0.9));
  yield* all(ledger().stroke(C.coral, 0.85), release().scale(1.08, 0.85));
  yield* all(ledger().stroke(C.rule, 0.85), release().scale(1, 0.85), slash().stroke(C.amber, 0.85));
  yield* all(slash().stroke(C.coral, 0.85), ribbon().scale(1.06, 0.85));
  yield* all(ribbon().scale(1, 0.85), problem().scale(1.05, 0.85));
  yield* all(problem().scale(1, 0.85), gate().stroke(C.amber, 0.85));
  yield* all(gate().stroke(C.coral, 0.85), release().opacity(0.62, 0.85));
  yield* all(release().opacity(0.4, 0.8), ribbon().stroke(C.output, 0.8));
  yield* all(ribbon().stroke(C.coral, 0.8), gate().position.y(-28, 0.8));
  yield* all(gate().position.y(-6, 0.8), ledger().scale(1.03, 0.8));
  yield* all(ledger().scale(1, 0.8), slash().end(0.65, 0.8));
  yield* all(slash().end(1, 0.8), problem().opacity(0.9, 0.8));
  yield* waitFor(2.3);
  yield* stage().opacity(0, 0.5);
});
