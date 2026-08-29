import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, Label, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const heap = createRef<Rect>();
  const mainFrame = createRef<Rect>();
  const returnAddress = createRef<Rect>();
  const vulnFrame = createRef<Rect>();
  const call = createRef<Line>();
  const idea = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="04 • Function calls" title="The stack remembers where to return" />
      <Panel x={-500} y={20} width={650} height={650}>
        <Txt text="HIGHER ADDRESSES" x={-235} y={-288} fill={C.muted} fontFamily={MONO} fontSize={17} />
        <Rect y={-205} width={520} height={120} radius={4} fill={C.panel2} stroke={C.orange} lineWidth={1}>
          <Txt text="STACK" fill={C.orange} fontFamily={MONO} fontWeight={800} fontSize={28} />
        </Rect>
        <Rect y={-65} width={520} height={112} radius={4} fill={C.panel} stroke={C.faint} lineWidth={1}>
          <Txt text="mapped / unused space" fill={C.muted} fontFamily={MONO} fontSize={20} />
        </Rect>
        <Rect ref={heap} y={65} width={520} height={112} radius={4} fill={C.panel2} stroke={C.green} lineWidth={1}>
          <Txt text="HEAP" fill={C.green} fontFamily={MONO} fontWeight={800} fontSize={28} />
          <Txt text="malloc(64)" x={155} fill={C.text} fontFamily={MONO} fontSize={18} />
        </Rect>
        <Rect y={195} width={520} height={112} radius={4} fill={C.panel} stroke={C.violet} lineWidth={1}>
          <Txt text="GLOBAL DATA" fill={C.violet} fontFamily={MONO} fontWeight={800} fontSize={25} />
        </Rect>
        <Rect y={285} width={520} height={52} radius={3} fill={C.panel2} stroke={C.blue} lineWidth={1}>
          <Txt text="PROGRAM INSTRUCTIONS" fill={C.blue} fontFamily={MONO} fontWeight={800} fontSize={20} />
        </Rect>
      </Panel>

      <Panel x={420} y={20} width={760} height={650} stroke={C.orange}>
        <Txt text="ZOOM: STACK" x={-285} y={-285} fill={C.orange} fontFamily={MONO} fontSize={20} fontWeight={800} />
        <Rect ref={mainFrame} y={160} width={570} height={120} radius={4} fill={C.panel2} stroke={C.faint} lineWidth={1}>
          <Txt text="main frame" x={-190} fill={C.text} fontFamily={MONO} fontSize={24} />
        </Rect>
        <Rect ref={returnAddress} y={30} width={570} height={98} radius={4} fill={'#D8BE731C'} stroke={C.orange} lineWidth={2}>
          <Txt text="saved return address" x={-120} fill={C.orange} fontFamily={MONO} fontSize={23} fontWeight={700} />
          <Txt text="0x0804932f" x={175} fill={C.orange} fontFamily={MONO} fontSize={23} />
        </Rect>
        <Rect ref={vulnFrame} y={-125} width={570} height={180} radius={4} fill={C.glassStrong} stroke={C.blue} lineWidth={2}>
          <Txt text="vuln frame" x={-190} y={-55} fill={C.blue} fontFamily={MONO} fontSize={24} fontWeight={700} />
          <Txt text="local buffer + saved bookkeeping" y={35} fill={C.muted} fontFamily={MONO} fontSize={20} />
        </Rect>
        <Line ref={call} points={[[250, 250], [250, -235]]} stroke={C.blue} lineWidth={4} endArrow arrowSize={15} end={0} />
        <Txt text="call vuln" x={110} y={-235} fill={C.blue} fontFamily={MONO} fontSize={22} />
      </Panel>
      <BigIdea
        ref={idea}
        text="ret takes the saved address and puts it into the instruction pointer"
        subtext="That small orange number is our entire target."
        color={C.orange}
      />
    </>,
  );

  mainFrame().opacity(0);
  returnAddress().opacity(0);
  vulnFrame().opacity(0);
  heap().opacity(0.35);
  yield* heap().opacity(1, 0.8);
  yield* heap().opacity(0.2, 0.8);
  yield* mainFrame().opacity(1, 0.8);
  yield* call().end(0.42, 0.8);
  yield* returnAddress().opacity(1, 0.8);
  yield* all(call().end(1, 0.8), vulnFrame().opacity(1, 0.8));
  yield* returnAddress().scale(1.07, 0.35);
  yield* returnAddress().scale(1, 0.35);
  yield* idea().opacity(1, 1);
  yield* waitFor(52.3);
});
