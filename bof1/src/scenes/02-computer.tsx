import {Circle, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const memory = createRef<Rect>();
  const cpu = createRef<Rect>();
  const pointer = createRef<Line>();
  const bus = createRef<Line>();
  const cells: Rect[] = [];
  const idea = createRef<Rect>();
  const addresses = ['0x1000', '0x1001', '0x1002', '0x1003', '0x1004', '0x1005'];

  view.add(
    <>
      <Backdrop chapter="02 • The mental computer" title="Give every byte an address" />
      <Panel ref={memory} x={-480} y={10} width={760} height={560}>
        <Txt text="MEMORY" x={-290} y={-230} fill={C.muted} fontFamily={MONO} fontSize={22} fontWeight={700} />
        {addresses.map((address, i) => (
          <Rect
            ref={makeRef(cells, i)}
            x={50}
            y={-165 + i * 72}
            width={530}
            height={58}
            radius={3}
            fill={i === 2 ? C.glassStrong : C.bg2}
            stroke={i === 2 ? C.blue : C.faint}
            lineWidth={2}
          >
            <Txt text={address} x={-205} fill={C.orange} fontFamily={MONO} fontSize={19} />
            <Txt
              text={i === 2 ? 'ADD  r0, 1' : ['·· ·· ··', 'MOV r0, [x]', 'ADD r0, 1', 'MOV [x], r0', 'CMP r0, 5', 'JMP 0x1001'][i]}
              x={75}
              fill={i === 2 ? C.blue : C.text}
              fontFamily={MONO}
              fontSize={22}
            />
          </Rect>
        ))}
        <Line
          ref={pointer}
          points={[[365, -21], [335, -21]]}
          stroke={C.orange}
          lineWidth={6}
          endArrow
          arrowSize={18}
        />
        <Txt text="instruction pointer" x={520} y={-21} fill={C.orange} fontFamily={MONO} fontSize={19} />
      </Panel>
      <Panel ref={cpu} x={500} y={10} width={540} height={560} stroke={C.blue}>
        <Txt text="CPU" y={-220} fill={C.blue} fontFamily={MONO} fontSize={28} fontWeight={800} />
        <Rect y={-110} width={400} height={92} radius={4} fill={C.bg2}>
          <Txt text="instruction pointer" x={-105} fill={C.muted} fontFamily={MONO} fontSize={18} />
          <Txt text="0x1002" x={120} fill={C.orange} fontFamily={MONO} fontSize={24} fontWeight={700} />
        </Rect>
        <Rect y={18} width={400} height={92} radius={4} fill={C.bg2}>
          <Txt text="register  r0" x={-120} fill={C.muted} fontFamily={MONO} fontSize={18} />
          <Txt text="4 → 5" x={125} fill={C.green} fontFamily={MONO} fontSize={28} fontWeight={700} />
        </Rect>
        <Rect y={146} width={400} height={92} radius={4} fill={C.bg2}>
          <Txt text="arithmetic / logic" fill={C.text} fontFamily={MONO} fontSize={22} />
        </Rect>
      </Panel>
      <Line
        ref={bus}
        points={[
          [-90, 10],
          [210, 10],
        ]}
        stroke={C.blue}
        lineWidth={7}
        startArrow
        endArrow
        arrowSize={18}
        end={0}
      />
      <BigIdea
        ref={idea}
        text="Fetch → execute → choose the next address"
        subtext="This small model is enough to predict the exploit."
        color={C.blue}
      />
    </>,
  );

  memory().opacity(0);
  cpu().opacity(0);
  pointer().opacity(0);
  yield* all(memory().opacity(1, 1), memory().position.x(-480, 1));
  yield* all(cpu().opacity(1, 1), bus().end(1, 1));
  yield* pointer().opacity(1, 0.6);
  for (let i = 2; i < 5; i++) {
    yield* all(pointer().position.y((i - 2) * 72, 0.9), cells[i].stroke(C.blue, 0.5));
    if (i > 2) yield* cells[i - 1].stroke(C.faint, 0.4);
  }
  yield* idea().opacity(1, 1);
  yield* waitFor(48.1);
});
