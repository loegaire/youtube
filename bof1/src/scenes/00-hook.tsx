import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, Label, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const terminal = createRef<Rect>();
  const input = createRef<Txt>();
  const route = createRef<Line>();
  const winRoute = createRef<Line>();
  const win = createRef<Rect>();
  const idea = createRef<Rect>();

  view.add(
    <>
      <Backdrop chapter="00 • The question" title="How can text choose code?" />
      <Panel ref={terminal} x={-470} y={10} width={770} height={430}>
        <Rect
          width={770}
          height={58}
          y={-186}
          radius={[8, 8, 0, 0]}
          fill={C.glassStrong}
        >
          <Txt text="●  ●  ●" x={-305} fill={C.muted} fontSize={24} />
          <Txt
            text="./chal"
            fill={C.muted}
            fontFamily={MONO}
            fontSize={20}
          />
        </Rect>
        <Txt
          text={'Please enter your string:'}
          x={-330}
          y={-90}
          offsetX={-1}
          fill={C.text}
          fontFamily={MONO}
          fontSize={29}
        />
        <Txt
          ref={input}
          text={''}
          x={-330}
          y={-20}
          offsetX={-1}
          fill={C.green}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={25}
        />
        <Rect x={-325} y={40} width={16} height={36} fill={C.green} />
      </Panel>

      <Rect x={470} y={-80} width={240} height={100} radius={5} fill={C.panel2} stroke={C.faint} lineWidth={1}>
        <Label text="main" mono color={C.text} />
      </Rect>
      <Rect x={470} y={100} width={240} height={100} radius={5} fill={C.panel2} stroke={C.faint} lineWidth={1}>
        <Label text="vuln" mono color={C.text} />
      </Rect>
      <Rect
        ref={win}
        x={720}
        y={100}
        width={240}
        height={100}
        radius={5}
        fill={C.panel2}
        stroke={C.orange}
        lineWidth={1}
        opacity={0.4}
      >
        <Label text="win" mono color={C.orange} />
      </Rect>
      <Line
        ref={route}
        points={[
          [470, -28],
          [470, 48],
        ]}
        stroke={C.blue}
        lineWidth={4}
        endArrow
        arrowSize={18}
        end={0}
      />
      <Line
        ref={winRoute}
        points={[
          [590, 100],
          [700, 100],
        ]}
        stroke={C.red}
        lineWidth={4}
        endArrow
        arrowSize={18}
        end={0}
      />
      <BigIdea
        ref={idea}
        text="The input stays data. One trusted address changes."
        subtext="We redirect the program to code that already exists."
        color={C.orange}
      />
    </>,
  );

  terminal().scale(0.92);
  terminal().opacity(0);
  yield* all(terminal().opacity(1, 0.8), terminal().scale(1, 0.8));
  yield* input().text('hello', 1.2);
  yield* route().end(1, 1);
  yield* waitFor(2);
  yield* all(input().text('', 0.5), route().end(0, 0.5));
  yield* input().text('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 2.2);
  input().fill(C.red);
  yield* sequence(
    0.2,
    terminal().stroke(C.red, 0.6),
    winRoute().end(1, 1.2),
    win().opacity(1, 0.8),
  );
  yield* idea().opacity(1, 1);
  yield* waitFor(23.1);
});
