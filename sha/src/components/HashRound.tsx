import {Node, Rect, Txt, Layout, NodeProps, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';

export interface HashRoundProps extends NodeProps {}

export class HashRound extends Node {
  public readonly sigma0Box = createRef<Rect>();
  public readonly sigma1Box = createRef<Rect>();
  public readonly chBox = createRef<Rect>();
  public readonly majBox = createRef<Rect>();
  public readonly t1Text = createRef<Txt>();
  public readonly t2Text = createRef<Txt>();

  public constructor(props?: HashRoundProps) {
    super({
      ...props,
    });

    const TEAL = '#6cf265';
    const YELLOW = '#ffff00';
    const BG_COLOR = '#000000';
    const CYAN = '#00ffff';

    this.add(
      <Node>
        {/* T1 path */}
        <Rect ref={this.sigma1Box} x={200} y={100} width={150} height={60} stroke={YELLOW} lineWidth={4} fill={BG_COLOR} opacity={0}>
          <Txt text="Σ1(e)" fill={CYAN} fontFamily="monospace" />
        </Rect>
        <Rect ref={this.chBox} x={200} y={200} width={150} height={60} stroke={YELLOW} lineWidth={4} fill={BG_COLOR} opacity={0}>
          <Txt text="Ch" fill={CYAN} fontFamily="monospace" />
        </Rect>

        <Txt ref={this.t1Text} x={400} y={150} text="T1 = h + Σ1(e) + Ch(e,f,g) + K[t] + W[t]" fill={YELLOW} fontFamily="monospace" fontSize={30} opacity={0} />

        {/* T2 path */}
        <Rect ref={this.sigma0Box} x={200} y={-100} width={150} height={60} stroke={YELLOW} lineWidth={4} fill={BG_COLOR} opacity={0}>
          <Txt text="Σ0(a)" fill={CYAN} fontFamily="monospace" />
        </Rect>
        <Rect ref={this.majBox} x={200} y={-200} width={150} height={60} stroke={YELLOW} lineWidth={4} fill={BG_COLOR} opacity={0}>
          <Txt text="Maj" fill={CYAN} fontFamily="monospace" />
        </Rect>

        <Txt ref={this.t2Text} x={400} y={-150} text="T2 = Σ0(a) + Maj(a,b,c)" fill={YELLOW} fontFamily="monospace" fontSize={30} opacity={0} />
      </Node>
    );
  }

  public *animateT1() {
    yield* all(
      this.sigma1Box().opacity(1, 0.5),
      this.chBox().opacity(1, 0.5)
    );
    yield* this.t1Text().opacity(1, 1);
  }

  public *animateT2() {
    yield* all(
      this.sigma0Box().opacity(1, 0.5),
      this.majBox().opacity(1, 0.5)
    );
    yield* this.t2Text().opacity(1, 1);
  }
}
