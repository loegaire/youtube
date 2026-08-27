import {Node, Rect, Txt, Layout, NodeProps} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

export interface RegisterBankProps extends NodeProps {
  initialValues?: string[];
}

import {Reference} from '@motion-canvas/core';

export class RegisterBank extends Node {
  public readonly registers: Reference<Txt>[] = [];

  public constructor(props?: RegisterBankProps) {
    super({
      ...props,
    });

    const labels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const values = props?.initialValues ?? Array(8).fill('00000000');

    this.add(
      <Layout direction="column" gap={20}>
        {labels.map((label, i) => {
          const t = createRef<Txt>();
          this.registers.push(t);
          return (
            <Layout direction="row" gap={30} alignItems="center">
              <Txt text={label} fill="#ffff00" fontFamily="monospace" fontSize={40} width={40} />
              <Rect width={300} height={50} stroke="#6cf265" lineWidth={2} fill="#000000" padding={10} alignItems="center" justifyContent="center">
                <Txt ref={t} text={values[i]} fill="#00ffff" fontFamily="monospace" fontSize={30} />
              </Rect>
            </Layout>
          );
        })}
      </Layout>
    );
  }
}
