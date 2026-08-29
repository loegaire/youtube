import {Node, Rect, Txt} from '@motion-canvas/2d';

export const THINH_TOOL_THEME = {
  background: '#050B08',
  surface: '#0D1510',
  raised: '#142019',
  selected: '#1A2A20',
  rule: '#26332B',
  text: '#F1F3EE',
  muted: '#91A097',
  mint: '#8CCB9A',
  mintSoft: '#B3D8C2',
  amber: '#E4CF82',
  coral: '#C96561',
  purple: '#9B87B4',
  orange: '#C89563',
  mono: 'JetBrainsMono Nerd Font, JetBrains Mono, IBM Plex Mono, monospace',
  sans: 'Inter, Noto Sans, Helvetica Neue, Arial, sans-serif',
} as const;

export type ToolTone =
  | 'default'
  | 'muted'
  | 'active'
  | 'warning'
  | 'danger'
  | 'address'
  | 'accent';

export type ReactiveIndex = number | (() => number);

export interface ToolLine {
  text: string;
  tone?: ToolTone;
  prompt?: string;
}

export interface CodeLine {
  number?: number | string;
  text: string;
  tone?: ToolTone;
}

export interface ToolSurfaceProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  title?: string;
  context?: string;
  accent?: string;
  rootRef?: (node: Rect) => void;
  children?: any;
}

const T = THINH_TOOL_THEME;

function resolveIndex(value: ReactiveIndex | undefined) {
  return typeof value === 'function' ? value() : value ?? -1;
}

function toneColor(tone: ToolTone = 'default') {
  return {
    default: T.text,
    muted: T.muted,
    active: T.mint,
    warning: T.amber,
    danger: T.coral,
    address: T.purple,
    accent: T.orange,
  }[tone];
}

function rowFill(active: ReactiveIndex | undefined, index: number) {
  return () => resolveIndex(active) === index ? T.selected : '#00000000';
}

function RowText({
  text,
  x,
  y,
  width,
  size = 18,
  color = T.text,
  align = 'left',
  weight = 550,
}: {
  key?: string;
  text: string;
  x: number;
  y: number;
  width: number;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: number;
}) {
  return (
    <Txt
      text={text}
      x={x}
      y={y}
      width={width}
      height={size * 1.55}
      clip
      fill={color}
      fontFamily={T.mono}
      fontSize={size}
      fontWeight={weight}
      textAlign={align}
      offsetX={align === 'left' ? -1 : align === 'right' ? 1 : 0}
    />
  );
}

function PaneRule({
  x,
  y,
  width,
  label,
  accent = T.muted,
}: {
  x: number;
  y: number;
  width: number;
  label?: string;
  accent?: string;
}) {
  return (
    <Node>
      <Rect x={x} y={y} width={width} height={1} fill={T.rule} />
      {label ? (
        <Txt
          text={label}
          x={x - width / 2 + 12}
          y={y - 16}
          width={width - 24}
          offsetX={-1}
          fill={accent}
          fontFamily={T.mono}
          fontSize={13}
          fontWeight={750}
          letterSpacing={0.7}
        />
      ) : null}
    </Node>
  );
}

export function ThinhToolSurface({
  x = 0,
  y = 0,
  width = 1500,
  height = 820,
  title,
  context,
  accent = T.mint,
  rootRef,
  children,
}: ToolSurfaceProps) {
  const headerHeight = 54;
  return (
    <Rect
      ref={rootRef}
      x={x}
      y={y}
      width={width}
      height={height}
      radius={16}
      fill={T.surface}
      stroke={T.rule}
      lineWidth={2}
      clip
    >
      <Rect
        y={-height / 2 + headerHeight / 2}
        width={width}
        height={headerHeight}
        fill={T.raised}
      />
      <Rect
        x={-width / 2 + 10}
        y={-height / 2 + headerHeight / 2}
        width={4}
        height={headerHeight - 18}
        radius={2}
        fill={accent}
      />
      {title ? (
        <Txt
          text={title}
          x={-width / 2 + 28}
          y={-height / 2 + headerHeight / 2}
          width={width * 0.62}
          height={30}
          clip
          offsetX={-1}
          fill={T.text}
          fontFamily={T.mono}
          fontSize={18}
          fontWeight={760}
        />
      ) : null}
      {context ? (
        <Txt
          text={context}
          x={width / 2 - 24}
          y={-height / 2 + headerHeight / 2}
          width={width * 0.32}
          height={28}
          clip
          offsetX={1}
          textAlign={'right'}
          fill={T.muted}
          fontFamily={T.mono}
          fontSize={14}
          fontWeight={620}
        />
      ) : null}
      <Node y={headerHeight / 2}>{children}</Node>
    </Rect>
  );
}

export interface ThinhTerminalProps extends Omit<ToolSurfaceProps, 'children'> {
  lines: ToolLine[];
  activeLine?: ReactiveIndex;
  prompt?: string;
  lineHeight?: number;
}

export function ThinhTerminal({
  lines,
  activeLine,
  prompt = '$',
  lineHeight = 34,
  title = 'terminal',
  context,
  accent = T.mint,
  width = 1500,
  height = 820,
  ...surface
}: ThinhTerminalProps) {
  const bodyHeight = height - 54;
  const top = -bodyHeight / 2 + 30;
  return (
    <ThinhToolSurface
      {...surface}
      width={width}
      height={height}
      title={title}
      context={context}
      accent={accent}
    >
      {lines.map((line, index) => (
        <Rect
          key={`terminal-${index}`}
          y={top + index * lineHeight}
          width={width - 36}
          height={lineHeight - 2}
          radius={4}
          fill={rowFill(activeLine, index)}
        >
          {line.prompt !== '' ? (
            <RowText
              text={line.prompt ?? (index === 0 ? prompt : '')}
              x={-width / 2 + 36}
              y={0}
              width={28}
              size={17}
              color={line.tone === 'danger' ? T.coral : T.mint}
              weight={800}
            />
          ) : null}
          <RowText
            text={line.text}
            x={-width / 2 + 72}
            y={0}
            width={width - 112}
            size={17}
            color={toneColor(line.tone)}
          />
        </Rect>
      ))}
    </ThinhToolSurface>
  );
}

export interface RegisterValue {
  name: string;
  value: string;
  changed?: boolean;
}

export interface InstructionRow {
  address: string;
  mnemonic: string;
  operands?: string;
  current?: boolean;
  breakpoint?: boolean;
}

export interface StackValue {
  address: string;
  value: string;
}

export interface ThinhGdbProps extends Omit<ToolSurfaceProps, 'children'> {
  registers: RegisterValue[];
  instructions: InstructionRow[];
  stack?: StackValue[];
  command?: string;
  output?: string;
  activeInstruction?: ReactiveIndex;
}

export function ThinhGdb({
  registers,
  instructions,
  stack = [],
  command = 'ni',
  output = '',
  activeInstruction,
  title = 'debugger',
  context = 'gdb-like',
  width = 1500,
  height = 820,
  ...surface
}: ThinhGdbProps) {
  const bodyHeight = height - 54;
  const registerHeight = 112;
  const consoleHeight = 74;
  const centerHeight = bodyHeight - registerHeight - consoleHeight;
  const listingWidth = width * 0.7;
  const stackWidth = width - listingWidth;
  const centerTop = -bodyHeight / 2 + registerHeight;
  const rowHeight = Math.min(42, (centerHeight - 36) / Math.max(1, instructions.length));
  return (
    <ThinhToolSurface
      {...surface}
      width={width}
      height={height}
      title={title}
      context={context}
      accent={T.mint}
    >
      <Rect
        y={-bodyHeight / 2 + registerHeight / 2}
        width={width}
        height={registerHeight}
        fill={T.background}
      />
      {registers.map((register, index) => {
        const columns = Math.max(1, Math.min(6, registers.length));
        const cellWidth = (width - 48) / columns;
        const row = Math.floor(index / columns);
        const column = index % columns;
        return (
          <Node
            key={`register-${register.name}`}
            x={-width / 2 + 24 + cellWidth * column}
            y={-bodyHeight / 2 + 28 + row * 40}
          >
            <RowText
              text={register.name}
              x={0}
              y={0}
              width={cellWidth * 0.28}
              size={15}
              color={T.muted}
              weight={780}
            />
            <RowText
              text={register.value}
              x={cellWidth * 0.29}
              y={0}
              width={cellWidth * 0.68}
              size={16}
              color={register.changed ? T.amber : T.mintSoft}
            />
          </Node>
        );
      })}
      <PaneRule
        x={-width / 2 + listingWidth / 2}
        y={centerTop + 20}
        width={listingWidth}
        label={'DISASSEMBLY'}
        accent={T.mint}
      />
      <PaneRule
        x={width / 2 - stackWidth / 2}
        y={centerTop + 20}
        width={stackWidth}
        label={'STACK'}
        accent={T.purple}
      />
      <Rect
        x={-width / 2 + listingWidth}
        y={centerTop + centerHeight / 2}
        width={1}
        height={centerHeight}
        fill={T.rule}
      />
      {instructions.map((instruction, index) => (
        <Rect
          key={`instruction-${index}`}
          x={-width / 2 + listingWidth / 2}
          y={centerTop + 48 + index * rowHeight}
          width={listingWidth - 24}
          height={rowHeight - 3}
          radius={4}
          fill={() =>
            instruction.current || resolveIndex(activeInstruction) === index
              ? T.selected
              : '#00000000'
          }
          stroke={instruction.breakpoint ? T.coral : '#00000000'}
          lineWidth={instruction.breakpoint ? 2 : 0}
        >
          <RowText
            text={instruction.current ? '›' : instruction.breakpoint ? '●' : ''}
            x={-listingWidth / 2 + 28}
            y={0}
            width={24}
            size={18}
            color={instruction.breakpoint ? T.coral : T.mint}
            weight={850}
          />
          <RowText
            text={instruction.address}
            x={-listingWidth / 2 + 58}
            y={0}
            width={150}
            size={16}
            color={T.purple}
          />
          <RowText
            text={instruction.mnemonic}
            x={-listingWidth / 2 + 218}
            y={0}
            width={116}
            size={16}
            color={T.orange}
            weight={760}
          />
          <RowText
            text={instruction.operands ?? ''}
            x={-listingWidth / 2 + 342}
            y={0}
            width={listingWidth - 372}
            size={16}
            color={T.text}
          />
        </Rect>
      ))}
      {stack.map((entry, index) => (
        <Rect
          key={`stack-${index}`}
          x={width / 2 - stackWidth / 2}
          y={centerTop + 48 + index * rowHeight}
          width={stackWidth - 24}
          height={rowHeight - 3}
          fill={index === 0 ? T.selected : '#00000000'}
        >
          <RowText
            text={entry.address}
            x={-stackWidth / 2 + 22}
            y={0}
            width={140}
            size={14}
            color={T.purple}
          />
          <RowText
            text={entry.value}
            x={-stackWidth / 2 + 170}
            y={0}
            width={stackWidth - 190}
            size={14}
            color={index === 0 ? T.amber : T.mintSoft}
          />
        </Rect>
      ))}
      <Rect
        y={bodyHeight / 2 - consoleHeight / 2}
        width={width}
        height={consoleHeight}
        fill={T.background}
      />
      <RowText
        text={'›'}
        x={-width / 2 + 26}
        y={bodyHeight / 2 - consoleHeight / 2}
        width={28}
        size={20}
        color={T.mint}
        weight={850}
      />
      <RowText
        text={command}
        x={-width / 2 + 62}
        y={bodyHeight / 2 - consoleHeight / 2 - 12}
        width={width * 0.48}
        size={17}
        color={T.text}
      />
      <RowText
        text={output}
        x={-width / 2 + 62}
        y={bodyHeight / 2 - consoleHeight / 2 + 16}
        width={width - 88}
        size={14}
        color={T.muted}
      />
    </ThinhToolSurface>
  );
}

export interface FunctionEntry {
  name: string;
  address?: string;
}

export interface ListingRow {
  address: string;
  text: string;
  tone?: ToolTone;
}

export interface ThinhDisassemblerProps extends Omit<ToolSurfaceProps, 'children'> {
  functions: FunctionEntry[];
  pseudocode: CodeLine[];
  listing: ListingRow[];
  activeFunction?: ReactiveIndex;
  activeCodeLine?: ReactiveIndex;
  activeListing?: ReactiveIndex;
}

export function ThinhDisassembler({
  functions,
  pseudocode,
  listing,
  activeFunction,
  activeCodeLine,
  activeListing,
  title = 'disassembler',
  context = 'IDA-like',
  width = 1500,
  height = 820,
  ...surface
}: ThinhDisassemblerProps) {
  const bodyHeight = height - 54;
  const treeWidth = width * 0.21;
  const codeWidth = width * 0.48;
  const listingWidth = width - treeWidth - codeWidth;
  const startX = -width / 2;
  const rowHeight = 34;
  return (
    <ThinhToolSurface
      {...surface}
      width={width}
      height={height}
      title={title}
      context={context}
      accent={T.orange}
    >
      <Rect
        x={startX + treeWidth}
        width={1}
        height={bodyHeight}
        fill={T.rule}
      />
      <Rect
        x={startX + treeWidth + codeWidth}
        width={1}
        height={bodyHeight}
        fill={T.rule}
      />
      <PaneRule
        x={startX + treeWidth / 2}
        y={-bodyHeight / 2 + 20}
        width={treeWidth}
        label={'FUNCTIONS'}
      />
      <PaneRule
        x={startX + treeWidth + codeWidth / 2}
        y={-bodyHeight / 2 + 20}
        width={codeWidth}
        label={'DECOMPILE'}
        accent={T.mint}
      />
      <PaneRule
        x={width / 2 - listingWidth / 2}
        y={-bodyHeight / 2 + 20}
        width={listingWidth}
        label={'LISTING'}
        accent={T.orange}
      />
      {functions.map((entry, index) => (
        <Rect
          key={`function-${entry.name}`}
          x={startX + treeWidth / 2}
          y={-bodyHeight / 2 + 50 + index * rowHeight}
          width={treeWidth - 20}
          height={rowHeight - 3}
          radius={4}
          fill={rowFill(activeFunction, index)}
        >
          <RowText
            text={entry.name}
            x={-treeWidth / 2 + 20}
            y={0}
            width={treeWidth - 122}
            size={15}
            color={resolveIndex(activeFunction) === index ? T.mint : T.text}
          />
          <RowText
            text={entry.address ?? ''}
            x={treeWidth / 2 - 96}
            y={0}
            width={78}
            size={12}
            color={T.muted}
            align={'right'}
          />
        </Rect>
      ))}
      {pseudocode.map((line, index) => (
        <Rect
          key={`pseudo-${index}`}
          x={startX + treeWidth + codeWidth / 2}
          y={-bodyHeight / 2 + 50 + index * rowHeight}
          width={codeWidth - 22}
          height={rowHeight - 3}
          radius={4}
          fill={rowFill(activeCodeLine, index)}
        >
          <RowText
            text={String(line.number ?? index + 1).padStart(2, '0')}
            x={-codeWidth / 2 + 18}
            y={0}
            width={32}
            size={12}
            color={T.muted}
            align={'right'}
          />
          <RowText
            text={line.text}
            x={-codeWidth / 2 + 62}
            y={0}
            width={codeWidth - 82}
            size={15}
            color={toneColor(line.tone)}
          />
        </Rect>
      ))}
      {listing.map((line, index) => (
        <Rect
          key={`listing-${index}`}
          x={width / 2 - listingWidth / 2}
          y={-bodyHeight / 2 + 50 + index * rowHeight}
          width={listingWidth - 20}
          height={rowHeight - 3}
          radius={4}
          fill={rowFill(activeListing, index)}
        >
          <RowText
            text={line.address}
            x={-listingWidth / 2 + 18}
            y={0}
            width={108}
            size={13}
            color={T.purple}
          />
          <RowText
            text={line.text}
            x={-listingWidth / 2 + 136}
            y={0}
            width={listingWidth - 154}
            size={14}
            color={toneColor(line.tone)}
          />
        </Rect>
      ))}
    </ThinhToolSurface>
  );
}

export const ThinhIDA = ThinhDisassembler;

export interface HttpHistoryRow {
  method: string;
  host: string;
  path: string;
  status?: string | number;
  length?: string | number;
}

export interface ThinhProxyProps extends Omit<ToolSurfaceProps, 'children'> {
  history: HttpHistoryRow[];
  request: ToolLine[];
  response: ToolLine[];
  activeRequest?: ReactiveIndex;
}

export function ThinhProxy({
  history,
  request,
  response,
  activeRequest,
  title = 'web proxy',
  context = 'Burp-like',
  width = 1500,
  height = 820,
  ...surface
}: ThinhProxyProps) {
  const bodyHeight = height - 54;
  const historyHeight = bodyHeight * 0.43;
  const messageHeight = bodyHeight - historyHeight;
  const rowHeight = 36;
  return (
    <ThinhToolSurface
      {...surface}
      width={width}
      height={height}
      title={title}
      context={context}
      accent={T.coral}
    >
      <PaneRule
        x={0}
        y={-bodyHeight / 2 + 20}
        width={width}
        label={'HTTP HISTORY'}
        accent={T.coral}
      />
      {history.map((entry, index) => (
        <Rect
          key={`history-${index}`}
          y={-bodyHeight / 2 + 52 + index * rowHeight}
          width={width - 24}
          height={rowHeight - 3}
          radius={4}
          fill={rowFill(activeRequest, index)}
        >
          <RowText
            text={String(index + 1).padStart(2, '0')}
            x={-width / 2 + 18}
            y={0}
            width={42}
            size={13}
            color={T.muted}
            align={'right'}
          />
          <RowText
            text={entry.method}
            x={-width / 2 + 76}
            y={0}
            width={76}
            size={14}
            color={entry.method === 'POST' ? T.amber : T.mint}
            weight={760}
          />
          <RowText
            text={entry.host}
            x={-width / 2 + 162}
            y={0}
            width={280}
            size={14}
            color={T.text}
          />
          <RowText
            text={entry.path}
            x={-width / 2 + 456}
            y={0}
            width={width - 690}
            size={14}
            color={T.mintSoft}
          />
          <RowText
            text={String(entry.status ?? '')}
            x={width / 2 - 176}
            y={0}
            width={66}
            size={14}
            color={String(entry.status).startsWith('2') ? T.mint : T.coral}
            align={'right'}
          />
          <RowText
            text={String(entry.length ?? '')}
            x={width / 2 - 96}
            y={0}
            width={76}
            size={13}
            color={T.muted}
            align={'right'}
          />
        </Rect>
      ))}
      <Rect
        y={-bodyHeight / 2 + historyHeight}
        width={width}
        height={1}
        fill={T.rule}
      />
      <Rect
        x={0}
        y={-bodyHeight / 2 + historyHeight + messageHeight / 2}
        width={1}
        height={messageHeight}
        fill={T.rule}
      />
      <PaneRule
        x={-width / 4}
        y={-bodyHeight / 2 + historyHeight + 20}
        width={width / 2}
        label={'REQUEST'}
        accent={T.amber}
      />
      <PaneRule
        x={width / 4}
        y={-bodyHeight / 2 + historyHeight + 20}
        width={width / 2}
        label={'RESPONSE'}
        accent={T.mint}
      />
      {request.map((line, index) => (
        <RowText
          key={`request-${index}`}
          text={line.text}
          x={-width / 2 + 18}
          y={-bodyHeight / 2 + historyHeight + 52 + index * 30}
          width={width / 2 - 36}
          size={14}
          color={toneColor(line.tone)}
        />
      ))}
      {response.map((line, index) => (
        <RowText
          key={`response-${index}`}
          text={line.text}
          x={18}
          y={-bodyHeight / 2 + historyHeight + 52 + index * 30}
          width={width / 2 - 36}
          size={14}
          color={toneColor(line.tone)}
        />
      ))}
    </ThinhToolSurface>
  );
}

export const ThinhBurp = ThinhProxy;

export interface EditorFile {
  name: string;
  depth?: number;
  open?: boolean;
}

export interface ThinhEditorProps extends Omit<ToolSurfaceProps, 'children'> {
  files: EditorFile[];
  code: CodeLine[];
  activeFile?: ReactiveIndex;
  activeLine?: ReactiveIndex;
  language?: string;
}

export function ThinhEditor({
  files,
  code,
  activeFile,
  activeLine,
  language,
  title = 'editor',
  context,
  width = 1500,
  height = 820,
  ...surface
}: ThinhEditorProps) {
  const bodyHeight = height - 54;
  const treeWidth = width * 0.22;
  const editorWidth = width - treeWidth;
  const rowHeight = 34;
  return (
    <ThinhToolSurface
      {...surface}
      width={width}
      height={height}
      title={title}
      context={context ?? language}
      accent={T.mint}
    >
      <Rect
        x={-width / 2 + treeWidth}
        width={1}
        height={bodyHeight}
        fill={T.rule}
      />
      {files.map((file, index) => (
        <Rect
          key={`file-${index}`}
          x={-width / 2 + treeWidth / 2}
          y={-bodyHeight / 2 + 28 + index * rowHeight}
          width={treeWidth - 18}
          height={rowHeight - 3}
          radius={4}
          fill={rowFill(activeFile, index)}
        >
          <RowText
            text={`${file.open ? '▾' : file.name.includes('.') ? '·' : '›'} ${file.name}`}
            x={-treeWidth / 2 + 14 + (file.depth ?? 0) * 18}
            y={0}
            width={treeWidth - 30 - (file.depth ?? 0) * 18}
            size={14}
            color={resolveIndex(activeFile) === index ? T.mint : T.muted}
          />
        </Rect>
      ))}
      <Rect
        x={-width / 2 + treeWidth + 50}
        width={1}
        height={bodyHeight}
        fill={T.rule}
      />
      {code.map((line, index) => (
        <Rect
          key={`editor-line-${index}`}
          x={-width / 2 + treeWidth + editorWidth / 2}
          y={-bodyHeight / 2 + 28 + index * rowHeight}
          width={editorWidth - 18}
          height={rowHeight - 3}
          radius={4}
          fill={rowFill(activeLine, index)}
        >
          <RowText
            text={String(line.number ?? index + 1).padStart(2, '0')}
            x={-editorWidth / 2 + 14}
            y={0}
            width={34}
            size={12}
            color={T.muted}
            align={'right'}
          />
          <RowText
            text={line.text}
            x={-editorWidth / 2 + 66}
            y={0}
            width={editorWidth - 86}
            size={15}
            color={toneColor(line.tone)}
          />
        </Rect>
      ))}
    </ThinhToolSurface>
  );
}

export interface PacketRow {
  time: string;
  source: string;
  destination: string;
  protocol: string;
  info: string;
}

export interface ThinhPacketViewerProps extends Omit<ToolSurfaceProps, 'children'> {
  packets: PacketRow[];
  details: ToolLine[];
  bytes: string[];
  activePacket?: ReactiveIndex;
}

export function ThinhPacketViewer({
  packets,
  details,
  bytes,
  activePacket,
  title = 'packet viewer',
  context = 'Wireshark-like',
  width = 1500,
  height = 820,
  ...surface
}: ThinhPacketViewerProps) {
  const bodyHeight = height - 54;
  const packetHeight = bodyHeight * 0.55;
  const detailsHeight = bodyHeight - packetHeight;
  const rowHeight = 36;
  return (
    <ThinhToolSurface
      {...surface}
      width={width}
      height={height}
      title={title}
      context={context}
      accent={T.purple}
    >
      {packets.map((packet, index) => (
        <Rect
          key={`packet-${index}`}
          y={-bodyHeight / 2 + 28 + index * rowHeight}
          width={width - 24}
          height={rowHeight - 3}
          radius={4}
          fill={rowFill(activePacket, index)}
        >
          <RowText
            text={String(index + 1)}
            x={-width / 2 + 18}
            y={0}
            width={42}
            size={13}
            color={T.muted}
            align={'right'}
          />
          <RowText
            text={packet.time}
            x={-width / 2 + 78}
            y={0}
            width={100}
            size={13}
            color={T.muted}
          />
          <RowText
            text={packet.source}
            x={-width / 2 + 190}
            y={0}
            width={214}
            size={13}
            color={T.mintSoft}
          />
          <RowText
            text={packet.destination}
            x={-width / 2 + 416}
            y={0}
            width={214}
            size={13}
            color={T.mintSoft}
          />
          <RowText
            text={packet.protocol}
            x={-width / 2 + 642}
            y={0}
            width={112}
            size={13}
            color={packet.protocol === 'TCP' ? T.purple : T.orange}
            weight={760}
          />
          <RowText
            text={packet.info}
            x={-width / 2 + 766}
            y={0}
            width={width - 790}
            size={13}
            color={T.text}
          />
        </Rect>
      ))}
      <Rect
        y={-bodyHeight / 2 + packetHeight}
        width={width}
        height={1}
        fill={T.rule}
      />
      <Rect
        x={width * 0.12}
        y={-bodyHeight / 2 + packetHeight + detailsHeight / 2}
        width={1}
        height={detailsHeight}
        fill={T.rule}
      />
      <PaneRule
        x={-width * 0.19}
        y={-bodyHeight / 2 + packetHeight + 20}
        width={width * 0.62}
        label={'DETAILS'}
        accent={T.mint}
      />
      <PaneRule
        x={width * 0.31}
        y={-bodyHeight / 2 + packetHeight + 20}
        width={width * 0.38}
        label={'BYTES'}
        accent={T.purple}
      />
      {details.map((line, index) => (
        <RowText
          key={`detail-${index}`}
          text={line.text}
          x={-width / 2 + 18 + (line.prompt ? 20 : 0)}
          y={-bodyHeight / 2 + packetHeight + 52 + index * 30}
          width={width * 0.62 - 36}
          size={14}
          color={toneColor(line.tone)}
        />
      ))}
      {bytes.map((line, index) => (
        <RowText
          key={`bytes-${index}`}
          text={line}
          x={width * 0.12 + 18}
          y={-bodyHeight / 2 + packetHeight + 52 + index * 28}
          width={width * 0.38 - 36}
          size={13}
          color={index === 0 ? T.amber : T.mintSoft}
        />
      ))}
    </ThinhToolSurface>
  );
}

export const ThinhWireshark = ThinhPacketViewer;
