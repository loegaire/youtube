import {Node, Rect, Txt, Layout, View2D} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

export interface LoginPanelProps {
  opacity?: number;
  scale?: number;
  ref?: any;
}

export class LoginPanel extends Node {
  public readonly bg = createRef<Rect>();
  public readonly usernameField = createRef<Rect>();
  public readonly passwordField = createRef<Rect>();
  public readonly cursor = createRef<Rect>();
  public readonly typedTxt = createRef<Txt>();
  public readonly enterBtn = createRef<Rect>();

  public constructor(props?: LoginPanelProps) {
    super({
      ...props,
    });

    this.add(
      <Rect
        ref={this.bg}
        width={1920}
        height={1080}
        fill="#000000"
        opacity={props?.opacity ?? 1}
        scale={props?.scale ?? 1}
      >
        <Layout direction="column" alignItems="center" gap={40}>
          <Rect
            ref={this.usernameField}
            width={600}
            height={80}
            stroke="#6cf265"
            lineWidth={4}
            fill="#000000"
            radius={0}
            justifyContent="center"
            padding={20}
          >
            <Txt
              text="user"
              fill="#6cf265"
              fontFamily="monospace"
              fontSize={40}
              marginRight={0}
            />
          </Rect>

          <Rect
            ref={this.passwordField}
            width={600}
            height={80}
            stroke="#6cf265"
            lineWidth={4}
            fill="#000000"
            radius={0}
            justifyContent="center"
            padding={20}
          >
            <Layout layout direction="row" alignItems="center">
              <Txt
                ref={this.typedTxt}
                text=""
                fill="#6cf265"
                fontFamily="monospace"
                fontSize={40}
              />
              <Rect
                ref={this.cursor}
                width={20}
                height={50}
                fill="#6cf265"
                marginLeft={10}
                opacity={0}
              />
            </Layout>
          </Rect>

          <Rect
            ref={this.enterBtn}
            width={200}
            height={60}
            stroke="#6cf265"
            lineWidth={4}
            fill="#000000"
            radius={0}
            justifyContent="center"
            alignItems="center"
          >
            <Txt
              text="ENTER"
              fill="#65daf2"
              fontFamily="monospace"
              fontSize={30}
            />
          </Rect>

          <Txt
            text="12:00:00"
            fill="#65daf2"
            fontFamily="monospace"
            fontSize={30}
            marginTop={100}
          />
        </Layout>
      </Rect>,
    );
  }

  public *typePassword(text: string) {
    yield* this.cursor().opacity(1, 0.2);
    for (let i = 0; i <= text.length; i++) {
      this.typedTxt().text(text.substring(0, i));
      yield* waitFor(0.1);
    }
    yield* this.cursor().opacity(0, 0.2);
  }

  public *transformToBullets() {
    this.typedTxt().text('•••••••');
    yield* waitFor(0.5);
  }
}
