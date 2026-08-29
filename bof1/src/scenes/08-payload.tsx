import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, Byte, CodeLine, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const payload = createRef<Rect>();
  const padding = createRef<Rect>();
  const address = createRef<Rect>();
  const byteTiles: Rect[] = [];
  const endianArrow = createRef<Line>();
  const code = createRef<Rect>();
  const idea = createRef<Rect>();
  const bytes = ['f6', '91', '04', '08'];

  view.add(
    <>
      <Backdrop chapter="08 • Build the payload" title="Padding finds the slot; an address changes the route" />
      <Panel y={-120} width={1650} height={430} stroke={C.orange}>
        <Txt text="PAYLOAD" x={-720} y={-170} fill={C.muted} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <Rect ref={payload} y={-50} width={1440} height={132} radius={5} fill={C.bg2} stroke={C.faint} lineWidth={1}>
          <Rect ref={padding} x={-315} width={810} height={110} radius={[3, 0, 0, 3]} fill={'#8CCB9A1A'}>
            <Txt text="A × 44" y={-12} fill={C.green} fontFamily={MONO} fontSize={34} fontWeight={800} />
            <Txt text="padding" y={32} fill={C.muted} fontFamily={FONT} fontSize={21} />
          </Rect>
          <Rect ref={address} x={525} width={360} height={110} radius={[0, 3, 3, 0]} fill={'#D8BE731A'}>
            <Txt text="0x080491f6" y={-12} fill={C.orange} fontFamily={MONO} fontSize={29} fontWeight={800} />
            <Txt text="address of win" y={32} fill={C.muted} fontFamily={FONT} fontSize={21} />
          </Rect>
        </Rect>
        <Txt text="offset 0" x={-695} y={62} fill={C.muted} fontFamily={MONO} fontSize={18} />
        <Txt text="offset 44" x={385} y={62} fill={C.orange} fontFamily={MONO} fontSize={18} />
        <Txt text="one 32-bit integer" x={505} y={125} fill={C.orange} fontFamily={MONO} fontSize={21} />
      </Panel>

      <Panel x={-360} y={250} width={930} height={270}>
        <Txt text="LITTLE-ENDIAN STORAGE" x={-380} y={-102} fill={C.blue} fontFamily={MONO} fontSize={18} fontWeight={800} />
        <Txt text="0x080491f6" x={-310} y={0} fill={C.orange} fontFamily={MONO} fontSize={28} fontWeight={800} />
        <Line ref={endianArrow} points={[[-145, 0], [-55, 0]]} stroke={C.blue} lineWidth={5} endArrow arrowSize={16} end={0} />
        {bytes.map((byte, i) => (
          <Byte
            ref={makeRef(byteTiles, i)}
            value={byte}
            x={45 + i * 105}
            y={0}
            size={82}
            fill={'#17394A'}
            stroke={C.blue}
            color={C.blue}
          />
        ))}
        <Txt text="lowest address →" x={205} y={72} fill={C.muted} fontFamily={MONO} fontSize={17} />
      </Panel>

      <Panel ref={code} x={590} y={250} width={650} height={270} stroke={C.green}>
        <Txt text="solve.py" x={-250} y={-102} fill={C.green} fontFamily={MONO} fontSize={18} fontWeight={800} />
        <CodeLine text={'elf = ELF("./chal")'} x={-275} y={-35} size={23} />
        <CodeLine text={'offset = 44'} x={-275} y={18} size={23} color={C.orange} />
        <CodeLine text={'payload = b"A"*offset + p32(elf.sym.win)'} x={-275} y={75} size={20} color={C.green} />
      </Panel>
      <BigIdea
        ref={idea}
        text="No payload byte needs to be executable"
        subtext="We redirect execution to code already present in the program."
        color={C.green}
      />
    </>,
  );

  payload().scale(0.9);
  payload().opacity(0);
  code().opacity(0);
  byteTiles.forEach(tile => tile.opacity(0));
  yield* all(payload().scale(1, 0.8), payload().opacity(1, 0.8));
  yield* address().scale(1.08, 0.5);
  yield* address().scale(1, 0.5);
  yield* endianArrow().end(1, 0.7);
  yield* sequence(0.18, ...byteTiles.map(tile => tile.opacity(1, 0.6)));
  yield* code().opacity(1, 0.9);
  yield* idea().opacity(1, 1);
  yield* waitFor(52.5);
});
