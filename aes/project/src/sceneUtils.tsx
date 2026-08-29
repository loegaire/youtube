import {ThreadGenerator, easeInOutCubic, easeOutCubic, waitFor, all, chain, delay, sequence, createRef, Reference} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS, Hex} from './aesData';
import {createCaptionRail, CAPTION_FONT, CaptionHandle} from './caption';

export const FONT_MONO = CAPTION_FONT;
export const FONT_DISPLAY = 'Inter, "Helvetica Neue", Arial, sans-serif';

export const CELL = 88;
export const GAP = 10;
export const GRID = CELL + GAP;

export interface ByteCell {
  rect: Rect;
  label: Txt;
  node: Node;
}

export interface TxtRef {
  node: Txt;
}

export function makeByteCell(value: Hex, r: number, c: number, color: string = COLORS.ink): ByteCell {
  const x = (c - 1.5) * GRID;
  const y = (r - 1.5) * GRID;
  const rectRef = createRef<Rect>();
  const labelRef = createRef<Txt>();
  const node: Node = (
    <Node>
      <Rect
        ref={rectRef}
        layout={false}
        width={CELL}
        height={CELL}
        x={x}
        y={y}
        radius={10}
        fill={COLORS.canvas}
        stroke={COLORS.rule}
        lineWidth={2}
      />
      <Txt
        ref={labelRef}
        layout={false}
        text={value}
        fontFamily={FONT_MONO}
        fontWeight={600}
        fontSize={38}
        fill={color}
        x={x}
        y={y}
      />
    </Node>
  );
  return {rect: rectRef(), label: labelRef(), node};
}

export function renderMatrix(parent: Node, cells: ByteCell[]) {
  for (const cell of cells) {
    parent.add(cell.node);
  }
}

export function buildMatrix(values: Hex[][], color: string = COLORS.ink): ByteCell[] {
  const cells: ByteCell[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push(makeByteCell(values[r][c], r, c, color));
    }
  }
  return cells;
}

export function* fadeMatrixIn(cells: ByteCell[], stagger = 0.05): ThreadGenerator {
  yield* sequence(stagger, ...cells.map(cell =>
    all(cell.rect.opacity(1, 0.3, easeOutCubic), cell.label.opacity(1, 0.3, easeOutCubic))
  ));
}

export function* fadeMatrixOut(cells: ByteCell[], stagger = 0.04): ThreadGenerator {
  yield* sequence(stagger, ...cells.map(cell =>
    all(cell.rect.opacity(0, 0.25, easeOutCubic), cell.label.opacity(0, 0.25, easeOutCubic))
  ));
}

export function setCellOpacity(cells: ByteCell[], value: number) {
  for (const cell of cells) {
    cell.rect.opacity(value);
    cell.label.opacity(value);
  }
}

export function* morphCellValues(cells: ByteCell[], newValues: Hex[][], color: string = COLORS.amber): ThreadGenerator {
  yield* all(...cells.map((cell, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    return chain(
      cell.label.fill(color, 0.2, easeInOutCubic),
      cell.label.text(newValues[r][c], 0.25, easeInOutCubic),
      delay(0.1, cell.label.fill(COLORS.ink, 0.25, easeOutCubic)),
    );
  }));
}

export function addSectionTag(parent: Node, text: string, x = -760, y = -480): Txt {
  const ref = createRef<Txt>();
  parent.add(
    <Txt
      ref={ref}
      layout={false}
      text={text}
      fontFamily={FONT_MONO}
      fontWeight={500}
      fontSize={24}
      fill={COLORS.mint}
      x={x}
      y={y}
      opacity={1}
    />
  );
  return ref();
}

export function addBackdrop(parent: Node): Rect {
  const ref = createRef<Rect>();
  parent.add(
    <Rect
      ref={ref}
      layout={false}
      width={1920}
      height={1080}
      x={0}
      y={0}
      fill={COLORS.canvas}
    />
  );
  return ref();
}

export function addTxt(parent: Node, props: object): Txt {
  const ref = createRef<Txt>();
  parent.add(<Txt ref={ref} {...props} />);
  return ref();
}

export function addRect(parent: Node, props: object): Rect {
  const ref = createRef<Rect>();
  parent.add(<Rect ref={ref} {...props} />);
  return ref();
}

export function makeCaption(parent: Node, _width?: number): CaptionHandle {
  const cap = createCaptionRail();
  parent.add(cap.root);
  return cap;
}

export function* showCaption(cap: CaptionHandle, text: string, hold = 2.5): ThreadGenerator {
  yield* cap.show(text, hold);
}
