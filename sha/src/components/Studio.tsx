import {Layout, Line, Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';

export const C = {
  bg: '#000000',
  lime: '#6cf265',
  orange: '#ffb86c',
  yellow: '#ffff00',
  cyan: '#00ffff',
  red: '#ff4d4d',
  grid: '#1f4f21',
};

export const FONT = 'Google Code Nerd Font, Symbols Nerd Font, monospace';

export interface PanelProps extends NodeProps {
  title?: string;
  icon?: string;
  w?: number;
  h?: number;
  accent?: string;
}

export class TechPanel extends Node {
  public readonly box = createRef<Rect>();
  public readonly body = createRef<Layout>();

  public constructor(props?: PanelProps) {
    const {title, icon, w = 620, h = 360, accent = C.lime, ...rest} = props ?? {};
    super(rest);
    this.add(
      <Rect ref={this.box} width={w} height={h} fill={C.bg} stroke={accent} lineWidth={3} clip>
        <Rect width={w} height={44} y={-h / 2 + 22} fill={C.bg} stroke={accent} lineWidth={2}>
          <Txt text={`${icon ? `${icon}  ` : ''}${title ?? ''}`} fill={accent} fontFamily={FONT} fontSize={24} x={-w / 2 + 24} textAlign="left" />
        </Rect>
        <Layout ref={this.body} layout direction="column" gap={12} x={-w / 2 + 28} y={-h / 2 + 78} alignItems="start" />
      </Rect>,
    );
  }

  public line(text: string, color = C.cyan, size = 26) {
    this.body().add(<Txt text={text} fill={color} fontFamily={FONT} fontSize={size} />);
  }

  public *typeLine(text: string, color = C.cyan, size = 26) {
    const line = createRef<Txt>();
    this.body().add(<Txt ref={line} text="" fill={color} fontFamily={FONT} fontSize={size} />);
    for (let i = 0; i <= text.length; i++) {
      line().text(text.slice(0, i));
      yield* waitFor(0.015);
    }
  }
}

export function bg() {
  return <Rect width={1920} height={1080} fill={C.bg} />;
}

export function label(text: string, color = C.lime, size = 64, props: any = {}) {
  return <Txt text={text} fill={color} fontFamily={FONT} fontSize={size} {...props} />;
}

export function rail(x1: number, y1: number, x2: number, y2: number, color = C.lime) {
  return <Line points={[[x1, y1], [x2, y2]]} stroke={color} lineWidth={4} endArrow />;
}

export function bytePacket(text: string, color = C.cyan, props: NodeProps = {}) {
  return <Rect width={94} height={54} fill={C.bg} stroke={color} lineWidth={3} {...props}><Txt text={text} fill={color} fontFamily={FONT} fontSize={27} /></Rect>;
}

export function register(name: string, value: string, color = C.lime, props: NodeProps = {}) {
  return <Rect width={180} height={78} fill={C.bg} stroke={color} lineWidth={3} {...props}><Txt text={name} fill={C.yellow} fontFamily={FONT} fontSize={22} y={-18} /><Txt text={value} fill={color} fontFamily={FONT} fontSize={23} y={16} /></Rect>;
}

export function* reveal(nodes: Node[], duration = 0.7) {
  yield* sequence(0.08, ...nodes.map(node => all(node.opacity(1, duration), node.scale(1, duration, easeInOutCubic))));
}

export function* exitLeft(nodes: Node[], duration = 0.8) {
  yield* all(...nodes.map(node => node.position.x(node.position.x() - 2200, duration, easeInOutCubic)));
}
