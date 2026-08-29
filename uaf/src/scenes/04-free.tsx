import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, sequence, waitFor} from '@motion-canvas/core';
import {C, MONO, SANS} from '../theme';

export default makeScene2D(function* (view) {
  const stage = createRef<Node>();
  const terminal = createRef<Rect>();
  const closeup = createRef<Rect>();
  const current = createSignal(-1);
  const rows = [
    '$ file challenge/vuln',
    'ELF 32-bit LSB executable, Intel i386',
    '$ pwn checksec challenge/vuln',
    'Partial RELRO | Canary | NX | No PIE',
    'typedef struct {',
    '  uintptr_t (*whatToDo)();',
    '  char *username;',
    '} cmd;',
    'void doProcess(cmd *user) {',
    '  (*user->whatToDo)();',
    '}',
  ];
  view.add(<Node ref={stage}>
    <Rect width={1920} height={1080} fill={C.bg}/>
    <Txt text={'FROM REAL SOURCE TO MENTAL MODEL'} x={-785} y={-440} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={2}/>
    <Rect ref={terminal} x={-30} y={-6} width={1510} height={760} radius={22} fill={C.panel} stroke={C.rule} lineWidth={2} opacity={0} scale={0.92}>
      <Rect y={-335} width={1510} height={64} fill={C.raised}/>
      <Txt text={'local teaching artifact — challenge/vuln.c'} x={-690} y={-335} offsetX={-1} fill={C.muted} fontFamily={MONO} fontSize={20}/>
      {rows.map((row, i) => <Rect key={row} y={-250 + i * 52} width={1400} height={46} radius={5} fill={() => current() === i ? '#D8BE7326' : C.clear}>
        <Txt text={row} x={-665} width={1320} offsetX={-1} fill={i === 0 || i === 2 ? C.mint : i === 5 || i === 9 ? C.amber : C.ink} fontFamily={MONO} fontSize={27} fontWeight={i === 5 || i === 9 ? 800 : 550}/>
      </Rect>)}
    </Rect>
    <Rect ref={closeup} x={0} y={0} width={1040} height={450} radius={24} fill={C.raised} stroke={C.amber} lineWidth={3} opacity={0} scale={0.82}>
      <Txt text={'cmd'} x={-430} y={-150} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={24} fontWeight={900}/>
      <Txt text={'field 0'} x={-355} y={-50} offsetX={-1} fill={C.amber} fontFamily={MONO} fontSize={25}/>
      <Txt text={'whatToDo  →  function address'} x={-355} y={5} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={38} fontWeight={820}/>
      <Txt text={'field 1'} x={-355} y={95} offsetX={-1} fill={C.output} fontFamily={MONO} fontSize={25}/>
      <Txt text={'username  →  text address'} x={-355} y={150} offsetX={-1} fill={C.ink} fontFamily={SANS} fontSize={38} fontWeight={820}/>
    </Rect>
  </Node>);
  yield* all(terminal().opacity(1, 0.65), terminal().scale(1, 0.65));
  yield* sequence(0.42, ...[0, 1, 2, 3].map(index => current(index, 0.22)));
  yield* sequence(0.5, ...[4, 5, 6, 7].map(index => current(index, 0.3)));
  yield* current(9, 0.45);
  yield* all(terminal().opacity(0.15, 0.75), terminal().scale(0.82, 0.75), closeup().opacity(1, 0.75), closeup().scale(1, 0.75));
  yield* closeup().stroke(C.output, 0.6);
  yield* closeup().stroke(C.amber, 0.6);
  yield* all(closeup().scale(1.04, 0.85), current(5, 0.85));
  yield* all(closeup().scale(1, 0.85), current(6, 0.85));
  yield* all(closeup().position.y(-55, 0.85), current(9, 0.85));
  yield* all(closeup().position.y(0, 0.85), current(10, 0.85));
  yield* all(closeup().stroke(C.mint, 0.85), terminal().opacity(0.27, 0.85));
  yield* all(closeup().stroke(C.amber, 0.85), terminal().opacity(0.15, 0.85));
  yield* waitFor(2.55);
  yield* stage().opacity(0, 0.5);
});
