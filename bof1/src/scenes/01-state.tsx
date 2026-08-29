import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, BigIdea, Panel} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const cells: Rect[] = [];
  const head = createRef<Rect>();
  const state = createRef<Txt>();
  const rule = createRef<Rect>();
  const idea = createRef<Rect>();
  const values = ['0', '1', '1', '0', '0', '1', '0'];

  view.add(
    <>
      <Backdrop chapter="01 • A tiny machine" title="Computation is changing state" />
      {values.map((value, i) => (
        <Rect
          ref={makeRef(cells, i)}
          x={-570 + i * 155}
          y={-20}
          width={126}
          height={126}
          radius={4}
          fill={C.panel2}
          stroke={i === 2 ? C.blue : C.faint}
          lineWidth={i === 2 ? 5 : 2}
          opacity={0}
        >
          <Txt
            text={value}
            fill={C.text}
            fontFamily={MONO}
            fontSize={56}
            fontWeight={700}
          />
          <Txt
            text={`${i}`}
            y={88}
            fill={C.muted}
            fontFamily={MONO}
            fontSize={18}
          />
        </Rect>
      ))}
      <Rect ref={head} x={-260} y={-170} width={128} height={58} radius={3} fill={C.blue}>
        <Txt text="READ" fill={C.bg} fontFamily={MONO} fontSize={18} fontWeight={800} letterSpacing={1.8} />
        <Line points={[[0, 28], [0, 70]]} lineWidth={5} stroke={C.blue} endArrow arrowSize={14} />
      </Rect>
      <Panel ref={rule} x={0} y={240} width={920} height={190}>
        <Txt
          text={'STATE A  +  READ 1'}
          y={-48}
          fill={C.orange}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={28}
        />
        <Txt
          text={'write 0   →   move right   →   enter state B'}
          y={35}
          fill={C.text}
          fontFamily={MONO}
          fontSize={27}
        />
      </Panel>
      <Rect x={650} y={-230} width={300} height={116} radius={5} fill={C.panel} stroke={C.orange} lineWidth={1}>
        <Txt text="CURRENT STATE" y={-24} fill={C.muted} fontFamily={MONO} fontSize={18} />
        <Txt ref={state} text="A" y={20} fill={C.orange} fontFamily={MONO} fontSize={42} fontWeight={700} />
      </Rect>
      <BigIdea
        ref={idea}
        text="Read a pattern → apply a rule → change state"
        subtext="The machine does not need to understand what the pattern means."
        color={C.blue}
      />
    </>,
  );

  rule().opacity(0);
  head().opacity(0);
  yield* sequence(0.12, ...cells.map(cell => cell.opacity(1, 0.6)));
  yield* all(head().opacity(1, 0.7), rule().opacity(1, 0.7));
  yield* waitFor(1.5);
  yield* all(cells[2].fill(C.blue, 0.7), cells[2].scale(1.12, 0.35));
  cells[2].children()[0].remove();
  cells[2].add(<Txt text="0" fill={C.bg} fontFamily={MONO} fontSize={56} fontWeight={700} />);
  yield* cells[2].scale(1, 0.35);
  yield* all(head().position.x(-105, 1), cells[2].stroke(C.faint, 1), cells[3].stroke(C.blue, 1));
  yield* state().text('B', 0.7);
  yield* idea().opacity(1, 1);
  yield* waitFor(44.1);
});
