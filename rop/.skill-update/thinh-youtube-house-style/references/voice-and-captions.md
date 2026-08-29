# Owner Voice and Caption Specification

## Voice source

Use the owner's supplied reference at `/home/thinh/proj/youtube/voice.m4a` or a clean,
project-local WAV derived from it. Keep the reference private and local.

The reusable runtime belongs at:

```text
/home/thinh/proj/youtube/.chatterbox-venv
/home/thinh/proj/youtube/.chatterbox-models
```

Until those paths exist, reuse the already-installed legacy runtime at:

```text
/home/thinh/proj/youtube/fmstr2/.chatterbox-venv
/home/thinh/proj/youtube/fmstr2/.chatterbox-models
```

Never reinstall merely because a new video directory was created.

## Performance direction

The voice is an informed hacker teaching a friend:

- confident and conversational;
- faster than a slow tutorial, roughly 155-170 WPM;
- emotionally responsive: curiosity on setup, precision during mechanics, satisfaction at
  the reveal, calm authority during the fix;
- intimate and human: preserve audible phrase-boundary breaths, restrained lip detail,
  and light close-mic breathiness so the performance never sounds synthetic;
- natural contractions and connected phrases;
- short clause pauses and slightly longer section resets;
- no dramatic trailer voice, sing-song cadence, flat monotone, or robotic over-enunciation;
- no hiss, clipping, rumble, harsh sibilance, saliva clicks, or exaggerated mouth noise.

For Chatterbox-Turbo, use these as pilot defaults, then judge by ear:

```text
temperature: 0.84
top_p: 0.95
top_k: 900
repetition_penalty: 1.16
exaggeration: 0.50
cfg_weight: 0.24
```

Do not bulk-generate until three pilots pass:

1. a calm explanatory sentence;
2. a code/pronunciation-heavy sentence;
3. an emotional reveal or payoff.

Judge the pilots by ear at normalized monitoring level. The voice must remain clearly
audible over the intended mix, with real emotional contour and natural breaths. Mouth
detail should be present but never distract from words. Reject pilots with a noisy floor,
clipping, harsh consonants, saliva clicks, mechanical cadence, or breaths so aggressive
that they mask adjacent syllables.

Use at most two CPU threads, one Torch inter-op thread, and three sections per process.
Preserve completed clips so generation resumes safely.

## Timing

- Let the accepted narration own the timeline whenever practical.
- Prefer editing copy or scene duration over time-stretching the voice.
- Keep final `atempo` within 0.94-1.08 by default and never outside 0.90-1.12.
- Do not create long silent holds to force the voice into a predetermined duration.
- Check the final two minutes for missing audio and unintended silence.

## Caption text

- Caption wording comes from the exact spoken script.
- ASR supplies word timing only. Correct its misheard code terms before delivery.
- Pronunciation substitutions such as `printf` to “print f” may exist in narration, but
  on-screen captions should use the technically correct written form when that reads better.
- Drop filler and accidental repetitions. Preserve meaningful phrasing.
- Use 4-9 words per cue, normally under 42 characters per line, one or two lines maximum.
- Break on clauses, not in the middle of a code token or noun phrase.

## Caption rail design

Preferred Motion Canvas structure:

```tsx
<Rect
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
    fontFamily={'JetBrainsMono Nerd Font'}
    fontSize={56}
    fontWeight={700}
  />
  <Txt
    text={captionText}
    fill={'#F1F3EE'}
    fontFamily={'JetBrainsMono Nerd Font'}
    fontSize={56}
    fontWeight={650}
    lineHeight={1.16}
    textAlign={'center'}
  />
</Rect>
```

The mint prompt chevron is the style signature. Use it once per cue, not as animation
noise. Amber emphasis is reserved for real code or a single technical keyword.

Captions are an overlay. Do not reserve a bottom band or move the whole composition up.
Avoid parking critical small text directly beneath the rail, and validate collisions on
real rendered frames. When the project needs both clean and captioned masters, a
source-correct SRT converted to ASS is an equally valid styled source and avoids rendering
the Motion Canvas composition twice.
