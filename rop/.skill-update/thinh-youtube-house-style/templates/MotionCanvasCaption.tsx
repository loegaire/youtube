import {Rect, Txt} from '@motion-canvas/2d';
import {ReferenceReceiver} from '@motion-canvas/core';

export function HouseCaption({
  text,
  ref,
}: {
  text: string;
  ref?: ReferenceReceiver<Rect>;
}) {
  return (
    <Rect
      ref={ref}
      y={448}
      maxWidth={1498}
      padding={[16, 26, 17]}
      radius={14}
      fill={'#0A0D0BB8'}
      stroke={'#8CCB9A6B'}
      lineWidth={2}
      layout
      gap={18}
    >
      <Txt
        text={'›'}
        fill={'#8CCB9A'}
        fontFamily={'JetBrainsMono Nerd Font, JetBrains Mono, monospace'}
        fontSize={56}
        fontWeight={700}
      />
      <Txt
        text={text}
        fill={'#F1F3EE'}
        fontFamily={'JetBrainsMono Nerd Font, JetBrains Mono, monospace'}
        fontSize={56}
        fontWeight={650}
        lineHeight={1.16}
        textAlign={'center'}
      />
    </Rect>
  );
}
