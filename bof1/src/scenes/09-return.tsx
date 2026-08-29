import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, CodeLine, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const stackBytes: Rect[] = [];
  const address = createRef<Rect>();
  const ret = createRef<Rect>();
  const pointer = createRef<Rect>();
  const pointerValue = createRef<Txt>();
  const path = createRef<Line>();
  const win = createRef<Rect>();
  const flag = createRef<Txt>();
  const idea = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="09 • The return" title="The CPU follows the same rule it always follows" />
      <Panel x={-590} y={-45} width={650} height={590} stroke={C.red}>
        <Txt text="STACK" x={-245} y={-250} fill={C.muted} fontFamily={MONO} fontSize={20} fontWeight={800} />
        {[...Array(11)].map((_, i) => (
          <Rect
            ref={makeRef(stackBytes, i)}
            x={-230 + (i % 4) * 110}
            y={-130 + Math.floor(i / 4) * 92}
            width={92}
            height={72}
            radius={3}
            fill={i < 7 ? C.green : C.red}
            opacity={0}
          >
            <Txt text="A" fill={C.bg} fontFamily={MONO} fontSize={24} fontWeight={900} />
          </Rect>
        ))}
        <Rect ref={address} y={165} width={480} height={90} radius={4} fill={C.red} stroke={C.red} lineWidth={2} opacity={0}>
          <Txt text="f6  91  04  08" fill={C.bg} fontFamily={MONO} fontSize={30} fontWeight={900} />
          <Txt text="saved return address" y={58} fill={C.red} fontFamily={MONO} fontSize={18} />
        </Rect>
      </Panel>

      <Panel x={180} y={-70} width={480} height={360} stroke={C.blue}>
        <Txt text="CPU" x={-190} y={-140} fill={C.blue} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <Rect ref={ret} y={-45} width={350} height={80} radius={4} fill={C.glassStrong} stroke={C.blue} lineWidth={2}>
          <Txt text="ret" fill={C.blue} fontFamily={MONO} fontSize={34} fontWeight={900} />
        </Rect>
        <Rect ref={pointer} y={70} width={350} height={96} radius={4} fill={C.bg2} stroke={C.orange} lineWidth={2}>
          <Txt text="instruction pointer" y={-20} fill={C.muted} fontFamily={MONO} fontSize={18} />
          <Txt ref={pointerValue} text="0x0804932f" y={22} fill={C.orange} fontFamily={MONO} fontSize={25} fontWeight={800} />
        </Rect>
      </Panel>

      <Panel ref={win} x={660} y={210} width={470} height={300} stroke={C.orange}>
        <Txt text="0x080491f6  win()" y={-100} fill={C.orange} fontFamily={MONO} fontSize={25} fontWeight={800} />
        <CodeLine text={'fopen("flag.txt", "r")'} x={-190} y={-25} size={21} />
        <CodeLine text={'printf(flag)'} x={-190} y={35} size={23} color={C.green} />
        <Txt ref={flag} text="picoCTF{••••••••••}" y={100} fill={C.green} fontFamily={MONO} fontSize={27} fontWeight={800} opacity={0} />
      </Panel>
      <Line
        ref={path}
        points={[
          [355, 0],
          [485, -175],
          [600, -175],
          [660, 55],
        ]}
        stroke={C.red}
        lineWidth={4}
        endArrow
        arrowSize={15}
        end={0}
      />
      <BigIdea
        ref={idea}
        text="ret trusts 0x080491f6 → execution begins at win"
        color={C.orange}
      />
    </>,
  );

  win().opacity(0.35);
  yield* sequence(0.08, ...stackBytes.map(byte => byte.opacity(1, 0.35)));
  yield* address().opacity(1, 0.7);
  yield* ret().scale(1.12, 0.35);
  yield* ret().scale(1, 0.35);
  yield* pointerValue().text('0x080491f6', 0.9);
  yield* path().end(1, 1.5);
  yield* win().opacity(1, 0.7);
  yield* flag().opacity(1, 1);
  yield* idea().opacity(1, 1);
  yield* waitFor(40.8);
});
