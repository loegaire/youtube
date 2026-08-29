import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const ledger = createRef<Rect>();
  const nullCell = createRef<Rect>();
  const status = createRef<Txt>();
  const gate = createRef<Rect>();
  const check = createRef<Line>();
  const summary = createRef<Txt>();
  const terms: Rect[] = [];
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'DESIGN OUT THE STALE PATH'} x={-790} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Rect ref={ledger} x={-420} y={0} width={720} height={610} radius={26} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0}>
      <Txt text={'ownership ledger'} x={-285} y={-230} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={23}/>
      <Txt text={'owner'} x={-290} y={-125} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={31} fontWeight={800}/>
      <Txt text={'state'} x={15} y={-125} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={31} fontWeight={800}/>
      <Line points={[[-305,-80],[270,-80]]} stroke={C.rule} lineWidth={3}/>
      <Txt text={'user'} x={-290} y={0} offsetX={-1} fill={C.output} fontFamily={MONO} fontSize={35}/>
      <Rect ref={nullCell} x={115} y={0} width={250} height={70} radius={10} fill={C.raised} stroke={C.rule} lineWidth={2}>
        <Txt ref={status} text={'LIVE'} fill={C.mint} fontFamily={MONO} fontSize={31} fontWeight={900}/>
      </Rect>
    </Rect>
    <Rect ref={gate} x={420} y={0} width={420} height={450} radius={220} fill={C.panel} stroke={C.rule} lineWidth={6} opacity={0} scale={0.7}>
      <Txt text={'before use'} y={-70} fill={C.muted} fontFamily={SANS} fontSize={29} fontWeight={800}/>
      <Txt text={'is it valid?'} y={0} fill={C.ink} fontFamily={SANS} fontSize={34} fontWeight={900}/>
      <Txt text={'CHECK'} y={78} fill={C.amber} fontFamily={MONO} fontSize={35} fontWeight={900}/>
    </Rect>
    <Line ref={check} points={[[-510,80],[-455,140],[-330,5]]} stroke={C.mint} lineWidth={20} lineCap={'round'} end={0}/>
    {['lifetime', 'ownership', 'validation'].map((term, index) => <Rect ref={makeRef(terms, index)} key={term} x={-340 + index * 340} y={260} width={285} height={74} radius={13} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.78}>
      <Txt text={term} fill={index === 0 ? C.mint : index === 1 ? C.output : C.amber} fontFamily={SANS} fontSize={26} fontWeight={820}/>
    </Rect>)}
    <Txt ref={summary} text={'clear references • centralize ownership • validate before use'} y={385} fill={C.output} fontFamily={SANS} fontSize={31} fontWeight={800} opacity={0}/>
  </Node>);
  yield* all(ledger().opacity(1, 0.7), ledger().position.x(-350, 0.7));
  yield* all(nullCell().fill(C.coral, 0.55), nullCell().stroke(C.coral, 0.55));
  yield* status().text('NULL', 0.4);
  yield* check().end(1, 0.55);
  yield* all(gate().opacity(1, 0.7), gate().scale(1, 0.7));
  yield* sequence(0.28, ...terms.map(term => all(term.opacity(1, 0.48), term.scale(1, 0.48))));
  yield* all(gate().stroke(C.mint, 0.55), summary().opacity(1, 0.55));
  yield* all(terms[0].fill(C.raised, 0.55), terms[1].fill(C.raised, 0.55), terms[2].fill(C.raised, 0.55));
  yield* all(gate().scale(1.07, 0.55), check().stroke(C.output, 0.55));
  yield* all(gate().scale(1, 0.4), check().stroke(C.mint, 0.4));
  yield* all(terms[0].position.y(220, 0.65), terms[1].position.y(220, 0.65), terms[2].position.y(220, 0.65));
  yield* all(terms[0].scale(1.08, 0.85), gate().stroke(C.output, 0.85));
  yield* all(terms[0].scale(1, 0.85), terms[1].scale(1.08, 0.85), check().stroke(C.output, 0.85));
  yield* all(terms[1].scale(1, 0.85), terms[2].scale(1.08, 0.85), gate().scale(1.06, 0.85));
  yield* all(terms[2].scale(1, 0.85), gate().scale(1, 0.85), check().stroke(C.mint, 0.85));
  yield* all(ledger().stroke(C.mint, 0.85), nullCell().stroke(C.mint, 0.85));
  yield* all(ledger().stroke(C.rule, 0.85), nullCell().stroke(C.rule, 0.85), summary().scale(1.05, 0.85));
  yield* all(summary().scale(1, 0.85), terms[0].position.y(190, 0.85), terms[1].position.y(190, 0.85), terms[2].position.y(190, 0.85));
  yield* all(terms[0].position.y(220, 0.85), terms[1].position.y(220, 0.85), terms[2].position.y(220, 0.85));
  yield* all(gate().stroke(C.mint, 0.85), check().scale(1.08, 0.85));
  yield* all(check().scale(1, 0.85), gate().stroke(C.rule, 0.85));
  yield* waitFor(2.1);
  yield* stage().opacity(0, 0.5);
});
