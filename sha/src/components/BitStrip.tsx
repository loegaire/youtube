import {Node, Rect, Txt, Layout, NodeProps} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

export interface BitStripProps extends NodeProps {
  bits?: string;
}

import {Reference} from '@motion-canvas/core';

export class BitStrip extends Node {
  public readonly bg = createRef<Rect>();
  public readonly bitContainer = createRef<Node>();
  public bitTexts: Reference<Txt>[] = [];

  public constructor(props?: BitStripProps) {
    super({
      ...props,
    });

    const bits = props?.bits ?? '00000000';

    this.add(
      <Rect
        ref={this.bg}
        width={800}
        height={150}
        fill="#000000"
        stroke="#6cf265"
        lineWidth={4}
        justifyContent="center"
        alignItems="center"
      >
        <Node ref={this.bitContainer}>
          {bits.split('').map((bit, i) => {
            const t = createRef<Txt>();
            this.bitTexts.push(t);
            return (
              <Txt
                ref={t}
                text={bit}
                fill="#65daf2"
                fontFamily="monospace"
                fontSize={80}
                x={(i - 3.5) * 80}
              />
            );
          })}
        </Node>
      </Rect>,
    );
  }

  public *highlightBit(index: number) {
    const bitNode = this.bitTexts[index]();
    yield* all(
      bitNode.fill('#e6f265', 0.2),
      bitNode.scale(1.25, 0.2).to(1, 0.2),
    );
  }

  public *highlightOnes(counterRef: any) {
    let count = 0;
    for (let i = 0; i < this.bitTexts.length; i++) {
      const bitNode = this.bitTexts[i]();
      if (bitNode.text() === '1') {
        yield* all(
          bitNode.fill('#e6f265', 0.2),
          bitNode.scale(1.2, 0.2).to(1, 0.2)
        );
        count++;
        counterRef.text(`${count}`);
        yield* waitFor(0.2);
      }
    }
  }
}
