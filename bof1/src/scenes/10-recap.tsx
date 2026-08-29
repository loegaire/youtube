import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, Label} from '../visuals';
import {C, FONT, MONO} from '../theme';

export default makeScene2D(function* (view) {
  const cards: Rect[] = [];
  const arrows: Line[] = [];
  const final = createRef<Txt>();
  const branches = createRef<Rect>();
  const items = [
    {number: '01', title: 'Finite buffer', detail: '32 bytes', color: C.green},
    {number: '02', title: 'Unbounded write', detail: 'gets(buf)', color: C.red},
    {number: '03', title: 'Corrupted address', detail: '0x080491f6', color: C.orange},
    {number: '04', title: 'Redirected pointer', detail: 'CPU enters win', color: C.blue},
  ];

  view.add(
    <>
      <Backdrop chapter="10 • The idea" title="Data became control" />
      {items.map((item, i) => (
        <Rect
          ref={makeRef(cards, i)}
          x={-690 + i * 460}
          y={-60}
          width={360}
          height={300}
          radius={6}
          fill={C.panel}
          stroke={C.faint}
          lineWidth={1}
          opacity={0}
        >
          <Rect x={-136} y={-108} width={54} height={54} radius={2} fill={item.color}>
            <Txt text={item.number} fill={C.bg} fontFamily={MONO} fontSize={20} fontWeight={900} />
          </Rect>
          <Txt text={item.title} x={-136} y={-20} offsetX={-1} fill={C.text} fontFamily={FONT} fontSize={29} fontWeight={700} />
          <Txt text={item.detail} x={-136} y={62} offsetX={-1} fill={item.color} fontFamily={MONO} fontSize={23} fontWeight={700} />
        </Rect>
      ))}
      {[0, 1, 2].map(i => (
        <Line
          ref={makeRef(arrows, i)}
          points={[
            [-500 + i * 460, -60],
            [-420 + i * 460, -60],
          ]}
          stroke={items[i + 1].color}
          lineWidth={4}
          endArrow
          arrowSize={17}
          end={0}
        />
      ))}
      <Txt
        ref={final}
        text="Our text never became machine code."
        y={205}
        fill={C.text}
        fontFamily={FONT}
        fontSize={44}
        fontWeight={800}
        opacity={0}
      />
      <Rect ref={branches} y={340} width={1100} height={100} radius={4} fill={C.bg2} stroke={C.faint} lineWidth={1} opacity={0}>
        <Txt text="The same mental computer continues into" x={-300} fill={C.muted} fontFamily={FONT} fontSize={22} />
        <Txt text="format strings" x={80} fill={C.violet} fontFamily={MONO} fontSize={22} fontWeight={700} />
        <Txt text="ROP" x={285} fill={C.orange} fontFamily={MONO} fontSize={22} fontWeight={700} />
        <Txt text="heap corruption" x={430} fill={C.green} fontFamily={MONO} fontSize={22} fontWeight={700} />
      </Rect>
    </>,
  );

  for (let i = 0; i < cards.length; i++) {
    yield* cards[i].opacity(1, 0.55);
    if (i < arrows.length) yield* arrows[i].end(1, 0.45);
  }
  yield* final().opacity(1, 0.8);
  yield* final().text('Our text never became code. It changed where code continued.', 1.2);
  yield* branches().opacity(1, 0.8);
  // Keep the assembled project aligned to the script's 09:48 endpoint.
  yield* waitFor(31.983);
});
