import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const bytes: Rect[] = [];
  const counter = createRef<Txt>();
  const barrier = createRef<Rect>();
  const returnTile = createRef<Rect>();
  const cursor = createRef<Rect>();
  const distinction = createRef<Rect>();
  const idea = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="06 • The overflow" title="Valid addresses continue past the boundary" />
      <Panel y={-40} width={1690} height={560} stroke={C.green}>
        <Txt text="vuln stack frame" x={-720} y={-260} fill={C.muted} fontFamily={MONO} fontSize={20} />
        <Txt text="32-byte buffer" x={-585} y={-205} fill={C.green} fontFamily={MONO} fontSize={23} fontWeight={700} />
        <Txt text="compiler bookkeeping" x={260} y={-205} fill={C.muted} fontFamily={MONO} fontSize={23} />
        {[...Array(44)].map((_, i) => {
          const x = -750 + (i % 22) * 68;
          const y = -105 + Math.floor(i / 22) * 78;
          const inBuffer = i < 32;
          return (
            <Rect
              ref={makeRef(bytes, i)}
              x={x}
              y={y}
              width={58}
              height={58}
              radius={3}
              fill={C.bg2}
              stroke={inBuffer ? C.green : C.faint}
              lineWidth={2}
            >
              <Txt
                text={i < 5 ? 'HELLO'[i] : ''}
                fill={C.green}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={21}
              />
            </Rect>
          );
        })}
        <Rect
          ref={barrier}
          x={-52}
          y={-65}
          width={10}
          height={250}
          radius={2}
          fill={C.green}
          opacity={0}
        />
        <Rect
          ref={returnTile}
          x={610}
          y={145}
          width={250}
          height={72}
          radius={4}
          fill={'#49351F'}
          stroke={C.orange}
          lineWidth={3}
        >
          <Txt text="RETURN ADDRESS" fill={C.orange} fontFamily={MONO} fontSize={19} fontWeight={800} />
        </Rect>
        <Rect ref={cursor} x={-750} y={-105} width={68} height={68} radius={3} stroke={C.blue} lineWidth={3} />
        <Txt ref={counter} text="5 / 32" y={255} fill={C.green} fontFamily={MONO} fontSize={26} />
      </Panel>
      <Rect ref={distinction} y={315} width={1400} height={92} radius={4} fill={C.panel} stroke={C.red} lineWidth={1} opacity={0}>
        <Txt text="ret instruction: unchanged" x={-350} fill={C.blue} fontFamily={MONO} fontSize={25} />
        <Txt text="address consumed by ret: corrupted" x={330} fill={C.red} fontFamily={MONO} fontSize={25} fontWeight={700} />
      </Rect>
      <BigIdea
        ref={idea}
        text="The instruction remains trustworthy. Its input does not."
        color={C.red}
      />
    </>,
  );

  yield* waitFor(1);
  for (let i = 0; i < 5; i++) {
    yield* cursor().position([bytes[i].x(), bytes[i].y()], 0.28);
  }
  barrier().opacity(1);
  yield* counter().text('32 / 32  —  safe copy stops', 0.8);
  yield* waitFor(1.2);
  yield* all(barrier().opacity(0, 0.6), counter().text('gets(buf) has no capacity argument', 0.8));
  for (let i = 0; i < 44; i++) {
    const color = i < 32 ? C.green : C.red;
    bytes[i].fill(color);
    bytes[i].children().forEach(child => child.opacity(0));
    bytes[i].add(<Txt text="A" fill={C.bg} fontFamily={MONO} fontWeight={800} fontSize={21} />);
    yield* cursor().position([bytes[i].x(), bytes[i].y()], 0.055);
  }
  yield* all(returnTile().fill(C.red, 0.8), returnTile().stroke(C.red, 0.8), returnTile().scale(1.08, 0.4));
  yield* returnTile().scale(1, 0.4);
  yield* distinction().opacity(1, 1);
  yield* idea().opacity(1, 1);
  yield* waitFor(63.2);
});
