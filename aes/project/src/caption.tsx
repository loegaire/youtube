import {ThreadGenerator, easeInOutCubic, easeOutCubic, waitFor, all, createRef} from '@motion-canvas/core';
import {Node, Rect, Txt} from '@motion-canvas/2d';
import {COLORS} from './aesData';

export const CAPTION_FONT = 'JetBrains Mono, "JetBrains Mono Nerd Font", monospace';

const sup: Record<string, string> = {
  '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶',
  '7':'⁷','8':'⁸','9':'⁹','-':'⁻','+':'⁺',
};

export function renderMath(text: string): string {
  return text
    .replace(/\^\{([^}]+)\}/g, (_, s) => s.split('').map((c: string) => sup[c] ?? c).join(''))
    .replace(/\^(-?\d+)/g, (_, s) => s.split('').map((c: string) => sup[c] ?? c).join(''))
    .replace(/\{([0-9a-fA-F]+)\}/g, '$1');
}

export interface CaptionHandle {
  root: Node;
  rail: Rect;
  body: Txt;
  show: (text: string, hold: number) => ThreadGenerator;
  hide: () => ThreadGenerator;
}

const RAIL_Y = 470;
const RAIL_WIDTH = 1780;
const RAIL_HEIGHT = 120;
const FONT_SIZE = 32;
const LINE_HEIGHT = 1.4;
const PAD = 48;
const CHEV_GAP = 24;

export function createCaptionRail(): CaptionHandle {
  const railRef = createRef<Rect>();
  const bodyRef = createRef<Txt>();
  const chevRef = createRef<Txt>();

  const root: Node = (
    <Node>
      <Rect
        ref={railRef}
        layout={true}
        direction={'row'}
        width={RAIL_WIDTH}
        height={RAIL_HEIGHT}
        x={0}
        y={RAIL_Y}
        radius={0}
        fill={'#000000'}
        opacity={0}
        paddingLeft={PAD}
        paddingRight={PAD}
        paddingTop={0}
        paddingBottom={0}
        alignItems={'center'}
      >
        <Txt
          ref={chevRef}
          text={'>'}
          fontFamily={CAPTION_FONT}
          fontWeight={700}
          fontSize={FONT_SIZE}
          fill={COLORS.mint}
          marginRight={CHEV_GAP}
        />
        <Txt
          ref={bodyRef}
          text={''}
          fontFamily={CAPTION_FONT}
          fontWeight={500}
          fontSize={FONT_SIZE}
          lineHeight={LINE_HEIGHT}
          fill={COLORS.ink}
          textAlign={'left'}
          textWrap={true}
          maxWidth={RAIL_WIDTH - PAD * 2 - FONT_SIZE - CHEV_GAP}
        />
      </Rect>
    </Node>
  );

  const rail = railRef();
  const body = bodyRef();

  const show = function* (text: string, hold: number): ThreadGenerator {
    body.text(renderMath(text));
    yield* rail.opacity(0.82, 0.25, easeOutCubic);
    yield* waitFor(hold);
  };

  const hide = function* (): ThreadGenerator {
    yield* rail.opacity(0, 0.3, easeInOutCubic);
  };

  return {root, rail, body, show, hide};
}
