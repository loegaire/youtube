---
name: thinh-youtube-house-style
description: >
  Apply Thinh's default house style whenever he asks to make, create, animate, edit,
  revise, caption, render, or finish a YouTube video. Use together with the HyperFrames
  workflow. Enforces the flat near-black terminal/code visual system, mint/amber/coral
  semantic palette, local Chatterbox owner-voice clone, large stylized Nerd Font captions,
  bounded two-thread production, frame-by-frame visual QA, and a required thumbnail frame.
  Explicit instructions in the current request override this house style.
---

# Thinh YouTube House Style

This is the persistent creative default for Thinh's YouTube work. Load it for every
YouTube-video request, then load `/hyperframes` as the owning production workflow.
This skill supplies the user's defaults; it does not replace HyperFrames' composition,
animation, media, or CLI contracts.

## Priority

1. Follow the user's current explicit request.
2. Follow the literal project brief, script, source assets, and challenge facts.
3. Apply this house style to every decision not overridden above.
4. Do not revive an older glass, gradient, blue-black, or generic cyberpunk treatment.

## Start the project

1. Inspect the named project, source script, prior video, voice reference, and existing
   outputs before asking questions.
2. Use HyperFrames for the video unless the user explicitly requests another framework.
3. Default to a 1920x1080, 16:9 YouTube master at 24 fps. Use 30 fps only when the source
   project or requested motion calls for it.
4. Copy `templates/frame.md` into the project as `frame.md` and treat its frontmatter as
   normative design tokens. Copy `templates/caption-rail.css` when authoring DOM captions.
5. Build the video as continuous causal motion, not a sequence of static slides.

## Art direction

Read [references/style-system.md](references/style-system.md) before creating scenes.
The load-bearing rules are:

- near-black solid canvas, flat fills, and crisp rules;
- no gradients, background blur, glassmorphism, global filters, glow haze, or distorted
  background texture;
- JetBrains Mono Nerd Font for code and captions, with a clean sans only for display copy;
- large readable type, asymmetric terminal/editor layouts, and visible mechanical state;
- mint for safe/active state, amber for interpreters/instructions, coral for danger/writes,
  off-white for primary text, and muted mint-gray for secondary information.

## Motion and explanation

- Animate every causal step: characters enter, parsers scan, counters increment, pointers
  connect, memory cells mutate, branches open, and outputs leave the machine.
- Schedule a meaningful visual change roughly every 3-5 seconds.
- Preserve one dominant idea per shot and keep persistent context visible.
- Use motion continuity across scene seams. Do not allow white flashes, empty holds, or
  unrelated transitions.
- Keep technical content beginner-readable without replacing exact source facts.

## Owner voice

Read [references/voice-and-captions.md](references/voice-and-captions.md) before narration
generation.

- Use the local owner-voice clone through Chatterbox. Never substitute a hosted generic
  voice unless the user explicitly asks.
- Reuse the shared environment and model cache under `/home/thinh/proj/youtube`; do not
  reinstall Chatterbox per project. The legacy runtime under
  `/home/thinh/proj/youtube/fmstr2` may be used until it is promoted.
- Delivery should sound confident, conversational, energetic, and emotionally responsive
  to the lesson. Avoid slow, flat, over-enunciated, or robotic delivery.
- Target about 155-170 spoken words per minute. Adjust scene timing or script density before
  applying aggressive time-stretching.
- Generate three pilot sections first and validate pronunciation, pace, expression, and
  ASR intelligibility before bulk synthesis.

## Captions are mandatory

Every narrated YouTube master includes matching English captions unless the user opts out.

- Use the exact narration source for wording and ASR only for timestamps.
- Prefer a HyperFrames caption overlay. Use `scripts/srt_to_house_ass.py` as the burn-in
  fallback when a source-correct SRT already exists.
- Captions use JetBrains Mono Nerd Font SemiBold at 52-60 px on a 1080p canvas.
- Text is warm white on a translucent near-black rounded rail, with a restrained mint
  terminal chevron and optional amber technical-token emphasis.
- Keep one or two lines, normally 4-9 words per cue, synchronized to natural speech.
- Captions overlay the film; never create a dead subtitle band. Inspect bottom-center
  collisions in actual rendered frames.

## Resource bounds

- Reuse shared environments and model weights.
- Use at most two CPU threads for TTS, rendering, transcription, and FFmpeg encoding.
- Generate no more than three narration sections per Chatterbox process.
- Require at least 3 GiB available RAM and 6 GiB free project disk before synthesis.
- Run synthesis, browser rendering, transcription, and final encoding sequentially.
- Resume completed clips and renders instead of regenerating good artifacts.
- Use disk-backed intermediates, not RAM-backed temporary storage.

## Required output package

Do not call the video complete until the project contains:

- a verified caption-free master MP4;
- a verified captioned master MP4;
- an editable source-correct SRT;
- the styled caption source (DOM timing data or ASS);
- a dedicated caption-free thumbnail PNG;
- reusable narration/caption scripts and timing data;
- a short media verification receipt.

Create the thumbnail with `scripts/extract_thumbnail.sh`. Choose a designed hero moment
with one clear idea and no captions, not an arbitrary frame. Inspect it at full size and
at small YouTube-card scale.

## Release gate

Read [references/release-gates.md](references/release-gates.md), then:

1. Inspect the start, middle, and end of every scene plus busy overlap moments.
2. Inspect captioned frames from the beginning, middle, and final two minutes.
3. Verify no clipped text, unintended overlap, distorted background, missing audio,
   silent tail, white flash, or placeholder flag.
4. Run `scripts/verify_video.sh` on both masters.
5. Visually inspect the extracted thumbnail.
6. Give the user clickable paths to the captioned master, clean master, SRT, and thumbnail.

