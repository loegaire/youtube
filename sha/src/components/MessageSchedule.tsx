import {Node, Rect, Txt, Layout, NodeProps} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';

export interface MessageScheduleProps extends NodeProps {}

import {Reference} from '@motion-canvas/core';

export class MessageSchedule extends Node {
  public readonly conveyor = createRef<Node>();
  public words: Reference<Txt>[] = [];

  public constructor(props?: MessageScheduleProps) {
    super({
      ...props,
    });

    this.add(
      <Node>
        <Rect width={1400} height={100} stroke="#008080" lineWidth={4} fill="#000000" clip>
          <Node ref={this.conveyor} x={600}>
            {/* Generate initial 16 words visually offscreen and moving through */}
            {Array.from({length: 16}).map((_, i) => {
              const t = createRef<Txt>();
              this.words.push(t);
              return (
                <Rect x={-i * 150} width={120} height={60} stroke="#00ffff" lineWidth={2} fill="#000000" justifyContent="center" alignItems="center">
                  <Txt ref={t} text={`W${i}`} fill="#ffff00" fontFamily="monospace" fontSize={30} />
                </Rect>
              );
            })}
          </Node>
        </Rect>
      </Node>
    );
  }

  public *expandSchedule() {
    // Generate words up to W63 visually shifting the conveyor
    for (let i = 16; i < 64; i++) {
      const t = createRef<Txt>();

      this.conveyor().add(
        <Rect x={-i * 150} width={120} height={60} stroke="#00ffff" lineWidth={2} fill="#000000" justifyContent="center" alignItems="center" opacity={0} scale={0.5}>
          <Txt ref={t} text={`W${i}`} fill="#ffff00" fontFamily="monospace" fontSize={30} />
        </Rect>
      );

      this.words.push(t);

      const newRect = this.conveyor().children()[i] as Rect;

      yield* all(
        newRect.opacity(1, 0.1),
        newRect.scale(1, 0.1, easeInOutCubic),
        this.conveyor().position.x(600 + i * 150, 0.1) // Keep the newest word centered/visible
      );
    }
    yield* waitFor(1);
  }
}
