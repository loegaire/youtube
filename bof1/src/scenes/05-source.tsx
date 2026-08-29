import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, CodeLine, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const main = createRef<Rect>();
  const vuln = createRef<Rect>();
  const win = createRef<Rect>();
  const bufGlow = createRef<Rect>();
  const getsGlow = createRef<Rect>();
  const addressGlow = createRef<Rect>();
  const goal = createRef<Line>();
  const idea = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="05 • Read the program" title="Three functions, one missing arrow" />
      <Panel ref={main} x={-590} y={-110} width={620} height={360}>
        <Txt text="main()" x={-245} y={-145} fill={C.blue} fontFamily={MONO} fontSize={24} fontWeight={800} />
        <CodeLine text={'puts("Please enter your string:");'} x={-260} y={-45} size={24} />
        <CodeLine text={'vuln();'} x={-260} y={25} size={27} color={C.blue} />
        <CodeLine text={'return 0;'} x={-260} y={95} size={24} color={C.muted} />
      </Panel>
      <Panel ref={vuln} x={80} y={-110} width={620} height={360} stroke={C.red}>
        <Txt text="vuln()" x={-245} y={-145} fill={C.red} fontFamily={MONO} fontSize={24} fontWeight={800} />
        <Rect ref={bufGlow} x={0} y={-48} width={540} height={52} radius={3} fill={'#8CCB9A1F'} opacity={0} />
        <Rect ref={getsGlow} x={0} y={18} width={540} height={52} radius={3} fill={'#F0786E22'} opacity={0} />
        <Rect ref={addressGlow} x={0} y={84} width={540} height={52} radius={3} fill={'#D8BE7322'} opacity={0} />
        <CodeLine text={'char buf[32];'} x={-245} y={-48} size={26} color={C.green} />
        <CodeLine text={'gets(buf);'} x={-245} y={18} size={27} color={C.red} />
        <CodeLine text={'get_return_address();'} x={-245} y={84} size={25} color={C.orange} />
      </Panel>
      <Panel ref={win} x={670} y={170} width={470} height={380} stroke={C.orange}>
        <Txt text="win()" x={-170} y={-155} fill={C.orange} fontFamily={MONO} fontSize={24} fontWeight={800} />
        <CodeLine text={'fopen("flag.txt", "r");'} x={-195} y={-60} size={22} />
        <CodeLine text={'fgets(buf, 64, f);'} x={-195} y={10} size={22} />
        <CodeLine text={'printf(buf);'} x={-195} y={80} size={22} color={C.green} />
        <Txt text="unreachable island" y={145} fill={C.muted} fontFamily={FONT} fontSize={21} />
      </Panel>
      <Line
        ref={goal}
        points={[
          [365, 65],
          [500, 120],
          [545, 170],
        ]}
        stroke={C.orange}
        lineWidth={6}
        endArrow
        arrowSize={18}
        end={0}
        lineDash={[14, 12]}
      />
      <BigIdea
        ref={idea}
        text="Goal: replace vuln’s saved return address with the address of win"
        color={C.orange}
      />
    </>,
  );

  main().opacity(0);
  vuln().opacity(0);
  win().opacity(0);
  yield* main().opacity(1, 0.8);
  yield* vuln().opacity(1, 0.8);
  yield* sequence(0.5, bufGlow().opacity(1, 0.7), getsGlow().opacity(1, 0.7), addressGlow().opacity(1, 0.7));
  yield* win().opacity(1, 0.8);
  yield* goal().end(1, 1.2);
  yield* idea().opacity(1, 1);
  yield* waitFor(54.2);
});
