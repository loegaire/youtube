import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, CodeLine, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const source = createRef<Rect>();
  const assembly = createRef<Rect>();
  const bytes = createRef<Rect>();
  const arrow1 = createRef<Line>();
  const arrow2 = createRef<Line>();
  const ip = createRef<Rect>();
  const idea = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="03 • A running program" title="Code plus changing machine state" />
      <Panel ref={source} x={-630} y={-25} width={430} height={410} stroke={C.green}>
        <Txt text="SOURCE" y={-165} fill={C.green} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <Txt text={'x = x + 1;'} fill={C.text} fontFamily={MONO} fontSize={40} fontWeight={700} />
        <Txt text="written for humans" y={135} fill={C.muted} fontFamily={FONT} fontSize={22} />
      </Panel>
      <Line ref={arrow1} points={[[-405, -25], [-275, -25]]} stroke={C.blue} lineWidth={6} endArrow arrowSize={18} end={0} />
      <Panel ref={assembly} x={0} y={-25} width={520} height={410} stroke={C.blue}>
        <Txt text="INSTRUCTIONS" y={-165} fill={C.blue} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <CodeLine text="mov eax, [x]" x={-170} y={-75} color={C.text} size={29} />
        <CodeLine text="add eax, 1" x={-170} y={5} color={C.blue} size={29} />
        <CodeLine text="mov [x], eax" x={-170} y={85} color={C.text} size={29} />
      </Panel>
      <Line ref={arrow2} points={[[275, -25], [405, -25]]} stroke={C.blue} lineWidth={6} endArrow arrowSize={18} end={0} />
      <Panel ref={bytes} x={630} y={-25} width={430} height={410} stroke={C.orange}>
        <Txt text="MACHINE BYTES" y={-165} fill={C.orange} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <Txt text={'A1 00 10 40 00'} y={-65} fill={C.orange} fontFamily={MONO} fontSize={27} />
        <Txt text={'83 C0 01'} y={5} fill={C.orange} fontFamily={MONO} fontSize={27} />
        <Txt text={'A3 00 10 40 00'} y={75} fill={C.orange} fontFamily={MONO} fontSize={27} />
      </Panel>
      <Rect ref={ip} x={-120} y={95} width={470} height={68} radius={4} fill={C.glassStrong} stroke={C.blue} lineWidth={2} opacity={0} />
      <BigIdea
        ref={idea}
        text="Exploitation finds a machine state the programmer did not intend"
        subtext="The CPU still processes that state obediently."
        color={C.violet}
      />
    </>,
  );

  source().opacity(0);
  assembly().opacity(0);
  bytes().opacity(0);
  yield* source().opacity(1, 0.9);
  yield* all(arrow1().end(1, 0.8), assembly().opacity(1, 0.8));
  yield* all(arrow2().end(1, 0.8), bytes().opacity(1, 0.8));
  ip().opacity(1);
  for (const y of [-100, -20, 60]) {
    yield* ip().position.y(y, 0.8);
  }
  yield* idea().opacity(1, 1);
  yield* waitFor(44.3);
});
