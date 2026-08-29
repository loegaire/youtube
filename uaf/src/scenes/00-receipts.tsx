import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const cells: Rect[] = [];
  const values: Txt[] = [];
  const coordinate = createRef<Rect>();
  const value = createRef<Rect>();
  const address = createRef<Rect>();
  const divider = createRef<Line>();
  const conclusion = createRef<Txt>();
  const numbers = ['0x120', '0x124', '0x128', '0x12C', '0x130', '0x134', '0x138', '0x13C'];
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'MEMORY IS NUMBERED SPACE'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Txt text={'Hello again, hackers.'} x={-780} y={-348} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={68} fontWeight={820}/>
    <Txt text={'Start with a wall of numbered places.'} x={-780} y={-272} offsetX={-1} fill={C.muted} fontFamily={SANS} fontSize={30}/>
    <Node x={-240} y={60}>
      {numbers.map((number, i) => <Rect ref={makeRef(cells, i)} key={number} x={(i % 4) * 220 - 330} y={Math.floor(i / 4) * 220 - 110} width={180} height={160} radius={15} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.76}>
        <Txt text={number} x={-65} y={-51} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={21}/>
        <Txt ref={makeRef(values, i)} text={i === 5 ? '42' : '·'} y={27} fill={i === 5 ? C.ink : C.rule} fontFamily={MONO} fontSize={i === 5 ? 58 : 42} fontWeight={800} opacity={i === 5 ? 0 : 1}/>
      </Rect>)}
    </Node>
    <Rect ref={coordinate} x={565} y={-10} width={420} height={116} radius={16} fill={C.panel} stroke={C.amber} lineWidth={3} opacity={0} scale={0.8}>
      <Txt text={'door number'} x={-165} y={-28} offsetX={-1} fill={C.amber} fontFamily={SANS} fontSize={24} fontWeight={800}/>
      <Txt text={'0x134'} x={-165} y={28} offsetX={-1} fill={C.ink} fontFamily={MONO} fontSize={36} fontWeight={900}/>
    </Rect>
    <Rect ref={value} x={440} y={230} width={230} height={110} radius={14} fill={C.raised} stroke={C.output} lineWidth={3} opacity={0} scale={0.8}>
      <Txt text={'value: 42'} fill={C.output} fontFamily={MONO} fontSize={30} fontWeight={800}/>
    </Rect>
    <Rect ref={address} x={690} y={230} width={285} height={110} radius={14} fill={C.raised} stroke={C.amber} lineWidth={3} opacity={0} scale={0.8}>
      <Txt text={'address: 0x134'} fill={C.amber} fontFamily={MONO} fontSize={26} fontWeight={800}/>
    </Rect>
    <Line ref={divider} points={[[555,150],[555,332]]} stroke={C.rule} lineWidth={3} end={0}/>
    <Txt ref={conclusion} text={'location ≠ what lives there'} x={535} y={395} fill={C.ink} fontFamily={SANS} fontSize={39} fontWeight={820} opacity={0}/>
  </Node>);
  yield* sequence(0.16, ...cells.map(cell => all(cell.opacity(1, 0.38), cell.scale(1, 0.38))));
  yield* all(cells[5].stroke(C.mint, 0.55), cells[5].fill(C.raised, 0.55), values[5].opacity(1, 0.55));
  yield* all(coordinate().opacity(1, 0.6), coordinate().scale(1, 0.6));
  yield* all(coordinate().position.y(-75, 0.75), cells[5].stroke(C.amber, 0.75));
  yield* all(value().opacity(1, 0.55), value().scale(1, 0.55), value().position.y(185, 0.55));
  yield* all(address().opacity(1, 0.55), address().scale(1, 0.55), address().position.y(185, 0.55), divider().end(1, 0.55));
  yield* all(cells[5].opacity(0.25, 0.55), conclusion().opacity(1, 0.55));
  // Work through the distinction once more: the door can be copied while its occupant stays put.
  yield* all(cells[5].opacity(1, 0.7), values[5].scale(1.15, 0.7), coordinate().stroke(C.mint, 0.7));
  yield* all(value().position.x(365, 0.9), address().position.x(765, 0.9), divider().stroke(C.amber, 0.9));
  yield* all(value().position.x(440, 0.8), address().position.x(690, 0.8), values[5].scale(1, 0.8));
  yield* all(coordinate().position.y(-125, 0.85), cells[5].fill(C.panel, 0.85));
  yield* all(coordinate().position.y(-75, 0.85), cells[5].fill(C.raised, 0.85), cells[5].stroke(C.amber, 0.85));
  yield* all(value().stroke(C.output, 0.75), address().stroke(C.amber, 0.75), conclusion().scale(1.06, 0.75));
  yield* all(value().stroke(C.output, 0.75), address().stroke(C.mint, 0.75), conclusion().scale(1, 0.75));
  yield* all(cells[5].position.y(-22, 0.85), coordinate().scale(1.06, 0.85));
  yield* all(cells[5].position.y(0, 0.85), coordinate().scale(1, 0.85));
  yield* waitFor(2.4);
  yield* stage().opacity(0, 0.5);
});
