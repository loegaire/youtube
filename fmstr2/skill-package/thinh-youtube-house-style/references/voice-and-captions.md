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
- natural contractions and connected phrases;
- short clause pauses and slightly longer section resets;
- no dramatic trailer voice, sing-song cadence, flat monotone, or robotic over-enunciation.

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

Preferred HyperFrames DOM style:

```css
.yt-caption-rail {
  position: absolute;
  left: 50%;
  bottom: 42px;
  transform: translateX(-50%);
  max-width: 78%;
  padding: 16px 26px 17px;
  border: 2px solid rgba(140, 203, 154, 0.42);
  border-radius: 14px;
  background: rgba(10, 13, 11, 0.72);
  color: #F1F3EE;
  font: 650 56px/1.16 "JetBrainsMono Nerd Font", "JetBrains Mono", monospace;
  letter-spacing: -0.025em;
  text-align: center;
}
.yt-caption-prompt { color: #8CCB9A; margin-right: 0.35em; }
.yt-caption-code { color: #D8BE73; }
```

The mint prompt chevron is the style signature. Use it once per cue, not as animation
noise. Amber emphasis is reserved for real code or a single technical keyword.

Captions are an overlay. Do not reserve a bottom band or move the whole composition up.
Avoid parking critical small text directly beneath the rail, and validate collisions on
real rendered frames.

