import {Node, Rect, Txt, Layout} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

export interface CodeEditorProps {
  opacity?: number;
  scale?: number;
  ref?: any;
}

export class CodeEditor extends Node {
  public readonly bg = createRef<Rect>();
  public readonly codeContainer = createRef<Node>();

  public constructor(props?: CodeEditorProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        ref={this.bg}
        width={1000}
        height={600}
        fill="#000000"
        stroke="#6cf265"
        lineWidth={4}
        opacity={props?.opacity ?? 1}
        scale={props?.scale ?? 1}
        padding={30}
      >
        <Node ref={this.codeContainer} x={-450} y={-250} />
      </Rect>,
    );
  }

  public setCode(code: string) {
    this.codeContainer().removeChildren();
    const lines = code.split('\n');
    lines.forEach((line, i) => {
      this.codeContainer().add(
        <Txt
          text={line}
          fill="#00ffff"
          fontFamily="monospace"
          fontSize={30}
          y={i * 40}
        />
      );
    });
  }
}
