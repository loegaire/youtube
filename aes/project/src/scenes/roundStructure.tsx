import {makeScene2D} from '@motion-canvas/2d';
import {easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt, Line} from '@motion-canvas/2d';
import {COLORS} from '../aesData';
import {FONT_MONO, addBackdrop, addSectionTag, addTxt, makeCaption, showCaption} from '../sceneUtils';

export default makeScene2D(function* (view) {
  view.fill(COLORS.canvas);
  addBackdrop(view);
  const tag = addSectionTag(view, 'Round Structure · 10 rounds');

  const stages = ['SubBytes', 'ShiftRows', 'MixColumns', 'AddRoundKey'];
  const boxes: Rect[] = [];
  const labels: Txt[] = [];
  const stageWidth = 240;
  const startX = -420;
  for (let i = 0; i < 4; i++) {
    const bx = startX + i * (stageWidth + 40);
    const boxRef = createRef<Rect>();
    view.add(
      <Rect ref={boxRef} layout={false} width={stageWidth} height={90} x={bx} y={-40} radius={10} fill={COLORS.canvas} stroke={i === 3 ? COLORS.coral : COLORS.mintDeep} lineWidth={2} opacity={0} />
    );
    boxes.push(boxRef());
    const labRef = createRef<Txt>();
    view.add(
      <Txt ref={labRef} layout={false} text={stages[i]} fontFamily={FONT_MONO} fontSize={30} fontWeight={600} fill={COLORS.ink} x={bx} y={-40} opacity={0} />
    );
    labels.push(labRef());
  }

  const arrows: Line[] = [];
  for (let i = 0; i < 3; i++) {
    const ax = startX + i * (stageWidth + 40) + stageWidth / 2 + 8;
    const ref = createRef<Line>();
    view.add(
      <Line ref={ref} layout={false} points={[[ax, -40], [ax + 24, -40]]} stroke={COLORS.mint} lineWidth={3} endArrow opacity={0} />
    );
    arrows.push(ref());
  }

  yield* sequence(0.1, ...boxes.map(b => b.opacity(1, 0.3, easeOutCubic)));
  yield* sequence(0.1, ...labels.map(l => l.opacity(1, 0.3, easeOutCubic)));
  yield* sequence(0.1, ...arrows.map(a => a.opacity(1, 0.3, easeOutCubic)));

  const loopRef = createRef<Line>();
  view.add(
    <Line ref={loopRef} layout={false} points={[[startX + 3 * (stageWidth + 40) + stageWidth / 2, 10], [startX + 3 * (stageWidth + 40) + stageWidth / 2, 80], [startX, 80], [startX, 10]]} stroke={COLORS.mintDeep} lineWidth={2} lineDash={[8, 8]} endArrow opacity={0} />
  );
  const loopArrow = loopRef();
  yield* loopArrow.opacity(0.7, 0.4, easeOutCubic);

  const roundCounter = addTxt(view, {
    layout: false, text: 'rounds 1-9  ·  final round omits MixColumns', fontFamily: FONT_MONO, fontSize: 32, fill: COLORS.amber, y: 160, opacity: 0,
  });
  yield* roundCounter.opacity(1, 0.4, easeOutCubic);

  // Pulse traveling through pipeline
  const pulseRef = createRef<Rect>();
  view.add(
    <Rect ref={pulseRef} layout={false} width={stageWidth} height={90} x={startX} y={-40} radius={10} stroke={COLORS.mint} lineWidth={4} />
  );
  const pulse = pulseRef();
  for (let i = 0; i < 4; i++) {
    yield* pulse.x(startX + i * (stageWidth + 40), 0.4, easeInOutCubic);
  }

  const cap = makeCaption(view);
  yield* showCaption(cap, 'A full AES-128 encryption runs ten rounds.', 4.060);
  yield* cap.hide();
  yield* showCaption(cap, 'Rounds one through nine apply all four transformations in sequence.', 4.060);
  yield* cap.hide();
  yield* showCaption(cap, 'The final round skips MixColumns.', 2.980);
  yield* cap.hide();

  yield* all(
    ...boxes.map(b => b.opacity(0, 0.4, easeInOutCubic)),
    ...labels.map(l => l.opacity(0, 0.4, easeInOutCubic)),
    ...arrows.map(a => a.opacity(0, 0.4, easeInOutCubic)),
    loopArrow.opacity(0, 0.4, easeInOutCubic),
    roundCounter.opacity(0, 0.4, easeInOutCubic),
    pulse.opacity(0, 0.4, easeInOutCubic),
    tag.opacity(0, 0.4, easeInOutCubic),
  );
});
