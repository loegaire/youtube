import {Rect, Txt} from '@motion-canvas/2d';
import {C, MONO} from './theme';

export function HouseCaption({text}: {text: any}) {
  return (
    <Rect
      y={454}
      width={1504}
      height={106}
      radius={14}
      fill={'#0A0D0BE8'}
      stroke={'#8CCB9A6B'}
      lineWidth={2}
      layout
      gap={18}
      padding={[16, 30]}
    >
      <Txt text={'›'} fill={C.mint} fontFamily={MONO} fontSize={58} fontWeight={800} />
      <Txt
        text={text}
        fill={C.ink}
        fontFamily={MONO}
        // Keep the caption rail inside the 16:9 safe frame. Short cues retain
        // the house-scale 49px treatment; longer, spoken sentences step down
        // instead of silently clipping past the right edge.
        fontSize={String(text).length > 74 ? 32 : String(text).length > 57 ? 38 : 49}
        fontWeight={650}
        lineHeight={1.1}
        textAlign={'center'}
        width={1320}
      />
    </Rect>
  );
}
