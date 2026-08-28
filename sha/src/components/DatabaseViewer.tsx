import {Node, Rect, Txt, Layout} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

import {NodeProps} from '@motion-canvas/2d';

export interface DatabaseViewerProps extends NodeProps {
  opacity?: number;
  scale?: number;
  w?: number;
  h?: number;
  ref?: any;
}

export class DatabaseViewer extends Node {
  public readonly bg = createRef<Rect>();
  public readonly rowsContainer = createRef<Node>();
  public readonly highlightRow = createRef<Rect>();

  public constructor(props?: DatabaseViewerProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        ref={this.bg}
        width={900}
        height={600}
        fill="#000000"
        stroke="#6cf265"
        lineWidth={4}
        opacity={props?.opacity ?? 1}
        scale={props?.scale ?? 1}
        clip
      >
        <Layout direction="column" alignItems="stretch" width="100%" padding={20}>
          {/* Header */}
          <Layout direction="row" gap={20} marginBottom={20}>
            <Txt text="user" fill="#6cf265" fontFamily="monospace" fontSize={30} width={200} />
            <Txt text="salt" fill="#6cf265" fontFamily="monospace" fontSize={30} width={200} />
            <Txt text="password_hash" fill="#6cf265" fontFamily="monospace" fontSize={30} width={400} />
          </Layout>

          <Node ref={this.rowsContainer} />
        </Layout>
      </Rect>,
    );
  }

  public addRow(user: string, salt: string, hash: string) {
    const yOffset = this.rowsContainer().children().length * 60;

    this.rowsContainer().add(
      <Layout direction="row" gap={20} y={yOffset}>
        <Txt text={user} fill="#65daf2" fontFamily="monospace" fontSize={24} width={200} />
        <Txt text={salt} fill="#e6f265" fontFamily="monospace" fontSize={24} width={200} />
        <Txt text={hash} fill="#65daf2" fontFamily="monospace" fontSize={24} width={400} />
      </Layout>
    );
  }
}
