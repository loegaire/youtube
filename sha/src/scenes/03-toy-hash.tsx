import {makeScene2D, Node, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {C, FONT, TechPanel, bg, scanlines} from '../components';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const bits = createRef<Node>();
  view.add(
    <Node>
      {bg()}
      
      <Txt ref={title} text="TOY HASH // 01 BIT IN, 01 BIT OUT" fill={C.yellow} fontFamily={FONT} fontSize={55} y={-380} opacity={0} />
      <Node ref={bits} opacity={0}>
        {'10110010'.split('').map((bit, index) => (
          <Txt text={bit} fill={bit === '1' ? C.yellow : C.lime} fontFamily={FONT} fontSize={110} x={(index - 3.5) * 135} />
        ))}
        <Txt text="ONES = 5  →  5 mod 2 = 1" fill={C.cyan} fontFamily={FONT} fontSize={42} y={180} />
      </Node>
    </Node>,
  );
  yield* all(title().opacity(1, 0.7), bits().opacity(1, 0.7), bits().scale(1.1, 1));
  yield* sequence(0.1, ...bits().children().slice(0, 8).map(node => (node as Txt).fill(C.orange, 0.2)));
  yield* bits().rotation(360, 2);
  const collisions = createRef<TechPanel>();
  view.add(<TechPanel ref={collisions} title="COLLISION SPACE" icon="\uf188" w={1200} h={360} opacity={0} scale={0.7} />);
  collisions().line('00000000 → 0', C.cyan);
  collisions().line('00000011 → 0', C.red);
  collisions().line('11111111 → 0', C.red);
  collisions().line('PREIMAGE  /  SECOND PREIMAGE  /  COLLISION', C.yellow, 30);
  yield* all(collisions().opacity(1, 0.7), collisions().scale(1, 0.7), bits().position.y(-500, 0.8));
  yield* waitFor(1);
});
