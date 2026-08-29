# YouTube Release Gates

## Visual

- Capture and inspect the start, middle, and end of every scene.
- Capture busy frames where multiple objects animate simultaneously.
- Check both sides of every scene seam for flashes, clipping, and discontinuity.
- Verify the canvas stays solid near-black with no gradients, blur, crawling texture, or
  compression distortion.
- Verify titles, code, captions, addresses, and labels never collide unintentionally.
- Check every captioned sample at 1920x1080, not only in a browser preview.

## Narration and captions

- Confirm the final master contains an audio stream for the full duration.
- Run a silence scan over the final two minutes.
- Listen to the opening, a dense technical section, a reveal, and the ending.
- Compare caption text to the spoken script and verify technical spellings.
- Sample captions from the opening, middle, and final two minutes.
- Reject captions that are too small, too translucent, more than two lines, late, or
  obscuring a critical object.

## Thumbnail

- Use a deliberately designed, caption-free hero frame.
- One dominant subject, one short hook of no more than six words, and strong mint/amber
  contrast against the near-black canvas.
- Avoid dense code, tiny text, progress UI, and accidental in-between animation states.
- Inspect at full resolution and approximately 320x180.
- Export a 1920x1080 PNG; optionally add a 1280x720 JPEG under 2 MB for direct upload.

## Media

- H.264 video and AAC audio unless the user requests another delivery codec.
- 1920x1080, square pixels, consistent frame rate, and duration matching the timeline.
- Full decode must complete without errors.
- Keep caption-free and captioned masters separate.
- Preserve source-correct SRT and the styled caption source.

## Completion receipt

Record:

```text
clean master path
captioned master path
SRT path
styled caption source path
thumbnail path
duration
resolution
frame rate
video codec
audio codec
audio sample rate
full decode result
tail silence result
visual sample timestamps
```

