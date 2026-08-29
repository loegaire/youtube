import {Rect, Txt, Node} from '@motion-canvas/2d';
import {
  createRef,
  createSignal,
  waitFor,
  easeInOutCubic,
  ThreadGenerator,
} from '@motion-canvas/core';
import {CAPTIONS} from '../narration/captions';
import {COLORS, FONTS, SIZES} from './tokens';

export type CaptionRefs = {
  rail: Rect;
  text: Txt;
  visible: ReturnType<typeof createSignal<number>>;
};

// Build a caption rail attached to a parent node and return refs.
// House style: fading 80% black rounded rail, green ">" chevron per cue,
// JetBrains Mono SemiBold, warm-white text, bottom-center placement.
export function buildCaptionRail(parent: Node): CaptionRefs {
  const rail = createRef<Rect>();
  const text = createRef<Txt>();
  const visible = createSignal(0);

  parent.add(
    <Rect
      ref={rail}
      layout
      direction={'row'}
      alignItems={'center'}
      justifyContent={'center'}
      gap={20}
      padding={{top: 18, bottom: 18, left: 38, right: 44}}
      radius={18}
      fill={`${COLORS.canvas}cc`}
      stroke={COLORS.panelBorder}
      lineWidth={1.5}
      opacity={visible}
      y={470}
      maxWidth={1560}
    >
      <Txt
        text={'>'}
        fontFamily={FONTS.monoNerd}
        fontSize={SIZES.captionChevron}
        fontWeight={600}
        fill={COLORS.mint}
        y={-3}
      />
      <Txt
        ref={text}
        text={''}
        fontFamily={FONTS.monoNerd}
        fontSize={SIZES.captionText}
        fontWeight={600}
        fill={COLORS.text}
      />
    </Rect>,
  );

  return {rail: rail(), text: text(), visible};
}

export function* fadeCaption(
  refs: CaptionRefs,
  target: number,
  duration = 0.4,
): ThreadGenerator {
  yield* refs.visible(target, duration, easeInOutCubic);
}

export function* showCue(
  refs: CaptionRefs,
  cueText: string,
  duration: number,
): ThreadGenerator {
  refs.text.text(cueText);
  yield* fadeCaption(refs, 1, 0.35);
  const hold = Math.max(duration - 0.7, 0.15);
  yield* waitFor(hold);
  yield* fadeCaption(refs, 0, 0.35);
}

// Drive the caption timeline for cues within [fromTime, toTime].
export function* runCaptions(
  refs: CaptionRefs,
  fromTime = 0,
  toTime = Infinity,
): ThreadGenerator {
  let lastEnd = fromTime;
  for (const cue of CAPTIONS) {
    if (cue.end <= fromTime) continue;
    if (cue.start >= toTime) break;
    const localStart = Math.max(cue.start, fromTime);
    const gap = localStart - lastEnd;
    if (gap > 0) yield* waitFor(gap);
    const dur = Math.min(cue.end, toTime) - localStart;
    yield* showCue(refs, cue.text, dur);
    lastEnd = Math.min(cue.end, toTime);
  }
}
