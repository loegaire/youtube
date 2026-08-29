import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, CodeLine, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const terminal = createRef<Rect>();
  const disassembly = createRef<Rect>();
  const pattern = createRef<Txt>();
  const crash = createRef<Rect>();
  const offset = createRef<Rect>();
  const mapping = createRef<Line>();
  const idea = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="07 • Ask the binary" title="Measure the exact distance—do not guess" />
      <Panel ref={terminal} x={-520} y={-45} width={760} height={590}>
        <Txt text="ANALYSIS" x={-300} y={-250} fill={C.green} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <CodeLine text="$ file ./chal" x={-320} y={-170} size={23} color={C.green} />
        <CodeLine text="ELF 32-bit LSB executable, Intel 80386" x={-320} y={-120} size={19} color={C.muted} />
        <CodeLine text="$ checksec --file=./chal" x={-320} y={-50} size={23} color={C.green} />
        <CodeLine text="Canary: No    PIE: No    NX: Enabled" x={-320} y={0} size={19} color={C.orange} />
        <CodeLine text="$ gdb ./chal" x={-320} y={70} size={23} color={C.green} />
        <CodeLine text="(gdb) disassemble vuln" x={-320} y={130} size={21} color={C.text} />
        <Txt ref={pattern} text="aaaabaaacaaadaaaeaaaf..." x={-320} y={215} offsetX={-1} fill={C.violet} fontFamily={MONO} fontSize={24} opacity={0} />
      </Panel>
      <Panel ref={disassembly} x={430} y={-105} width={820} height={470} stroke={C.blue}>
        <Txt text="vuln disassembly" x={-330} y={-195} fill={C.blue} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <CodeLine text="push  ebp" x={-345} y={-125} size={23} />
        <CodeLine text="mov   ebp, esp" x={-345} y={-70} size={23} />
        <CodeLine text="sub   esp, 0x24" x={-345} y={-15} size={23} color={C.orange} />
        <CodeLine text="lea   eax, [ebp-0x28]    ; buf" x={-345} y={40} size={23} color={C.green} />
        <CodeLine text="call  gets" x={-345} y={95} size={23} color={C.red} />
        <CodeLine text="leave" x={-345} y={150} size={23} color={C.blue} />
        <CodeLine text="ret" x={-120} y={150} size={23} color={C.blue} />
      </Panel>
      <Rect ref={crash} x={250} y={205} width={520} height={120} radius={4} fill={'#F0786E16'} stroke={C.red} lineWidth={2} opacity={0}>
        <Txt text="EIP = 0x6161616c" x={-55} fill={C.red} fontFamily={MONO} fontSize={26} fontWeight={800} />
        <Txt text="pattern search" x={155} fill={C.muted} fontFamily={MONO} fontSize={16} />
      </Rect>
      <Rect ref={offset} x={690} y={205} width={260} height={120} radius={4} fill={C.orange} opacity={0}>
        <Txt text="OFFSET" y={-22} fill={C.bg} fontFamily={MONO} fontSize={18} fontWeight={800} />
        <Txt text="44 bytes" y={22} fill={C.bg} fontFamily={MONO} fontSize={32} fontWeight={900} />
      </Rect>
      <Line ref={mapping} points={[[520, 205], [552, 205]]} stroke={C.violet} lineWidth={6} endArrow arrowSize={15} end={0} />
      <BigIdea
        ref={idea}
        text="The source gives the idea. The binary gives the measurement."
        color={C.violet}
      />
    </>,
  );

  terminal().opacity(0);
  disassembly().opacity(0);
  yield* all(terminal().opacity(1, 0.8), disassembly().opacity(1, 0.8));
  yield* pattern().opacity(1, 0.8);
  yield* crash().opacity(1, 0.8);
  yield* mapping().end(1, 0.8);
  yield* all(offset().opacity(1, 0.8), offset().scale(1.08, 0.4));
  yield* offset().scale(1, 0.4);
  yield* idea().opacity(1, 1);
  yield* waitFor(54.6);
});
