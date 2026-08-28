import {Node, Rect, Txt, Layout} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

import {NodeProps} from '@motion-canvas/2d';

export interface TerminalWindowProps extends NodeProps {
  opacity?: number;
  scale?: number;
  w?: number;
  h?: number;
  ref?: any;
}

export class TerminalWindow extends Node {
  public readonly bg = createRef<Rect>();
  public readonly textContainer = createRef<Node>();
  private currentText = '';

  public constructor(props?: TerminalWindowProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        ref={this.bg}
        width={800}
        height={600}
        fill="#000000"
        stroke="#6cf265"
        lineWidth={4}
        opacity={props?.opacity ?? 1}
        scale={props?.scale ?? 1}
        clip
      >
        <Node y={-250} x={-350} ref={this.textContainer} />
      </Rect>,
    );
  }

  public *typeLine(text: string) {
    const t = createRef<Txt>();
    const lineIndex = this.textContainer().children().length;

    this.textContainer().add(
      <Txt
        ref={t}
        text=""
        fill="#65daf2"
        fontFamily="monospace"
        fontSize={30}
        y={lineIndex * 40}
      />
    );

    for (let i = 0; i <= text.length; i++) {
      t().text(text.substring(0, i));
      yield* waitFor(0.02);
    }
    yield* waitFor(0.2);
  }

  public addStaticLine(text: string, color: string = '#65daf2') {
    const lineIndex = this.textContainer().children().length;
    this.textContainer().add(
      <Txt
        text={text}
        fill={color}
        fontFamily="monospace"
        fontSize={30}
        y={lineIndex * 40}
      />
    );
  }
}
