---
name: thinh-youtube-house-style
description: >
  Apply Thinh's default house style whenever he asks to make, create, animate, edit,
  revise, caption, render, or finish a YouTube video. Use Motion Canvas as the owning
  production framework and pair this skill with the most relevant Motion Canvas workflow.
  Enforces the flat near-black terminal/code visual system, mint/amber/coral semantic
  palette, local Chatterbox owner-voice clone, large stylized Nerd Font captions, bounded
  two-thread production, scene-specific dynamic choreography, perspective diversity,
  reusable motion-primitives consideration, frame-by-frame visual QA, and a required
  thumbnail frame.
  Explicit instructions in the current request override this house style.
---

# Thinh YouTube House Style

This is the persistent creative default for Thinh's YouTube work. Load it for every
YouTube-video request, then load the relevant Motion Canvas production skill. For CTF,
security, and computer explainers, load `/motion-canvas-ctf-explainer`.
This skill supplies the user's defaults; it does not replace Motion Canvas' scene,
timeline, rendering, or project contracts.

## Priority

1. Follow the user's current explicit request.
2. Follow the literal project brief, script, source assets, and challenge facts.
3. Apply this house style to every decision not overridden above.
4. Do not revive an older glass, gradient, blue-black, or generic cyberpunk treatment.

## Start the project

1. Inspect the named project, source script, prior video, voice reference, and existing
   outputs before asking questions.
2. Use Motion Canvas for the video unless the user explicitly requests another framework.
3. Default to a 1920x1080, 16:9 YouTube master at 24 fps. Use 30 fps only when the source
   project or requested motion calls for it.
4. Copy `templates/frame.md` into the project as `frame.md` and treat its frontmatter as
   normative design tokens. Use `templates/MotionCanvasCaption.tsx` when captions are
   rendered as Motion Canvas nodes.
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

### Connected-geometry gate

Any arrow, tether, pointer, bracket, underline, or path that refers to a moving object must
remain geometrically attached for the entire tween.

- Derive connector endpoints reactively from the current target positions, or place the
  connector and targets inside one moving parent.
- Render connectors behind their targets so lines stop at the object silhouette instead
  of crossing through labels and glyphs.
- Do not animate cards across a static arrow merely because both occupy the same scene.
- Capture the beginning, midpoint, peak displacement, and settled state of every shot
  with connected moving objects.
- Build code and decompiler views from measured rows, gutters, and columns. Never imitate
  source code by scattering independently positioned text cards.

### Technical-completeness gate

Every CTF or computer-analysis explainer must establish the top-down investigation before
zooming into instruction fragments:

1. show the supplied files and challenge goal;
2. identify the binary and mitigations with the relevant tools;
3. show the complete meaningful source when available, or a detailed decompiler view;
4. show how the crash, offset, or vulnerable operation is found;
5. show the disassembly or gadget-search workspace from which fragments are extracted;
6. only then isolate short instructions for beginner-focused explanation.

Use authentic tool surfaces such as `file`, `checksec`, a debugger, a decompiler,
`objdump`, or `ROPgadget` when they match the challenge. A fragment-only explanation is
incomplete even when each fragment is individually accurate.

Use Font Awesome or Nerd Font glyphs for familiar concepts—file, terminal, bug, lock,
memory, CPU, search, execute, and return—when an icon can replace repeated prose. Inspect
the rendered glyphs: missing-font boxes, ambiguous symbols, and decorative icons fail the
gate. Keep exact code, addresses, and uncommon concepts textual.

### Anti-slideshow gate

Before implementation, translate the literal script into a project-local `MOTION_MAP.md`
or equivalent typed data. Every narration beat must name:

- the concrete operation being visualized;
- its distinct spatial composition;
- the object-level motion that explains cause and effect;
- the camera or perspective change motivated by the new focus;
- the incoming and outgoing seam direction.

Do not solve an entire video with one scene factory that repeatedly places a title, main
card, right-side state card, and footer. A shared component may style an object, but it
must not force every beat into the same composition.

- Do not repeat the same dominant layout for more than two consecutive beats.
- No single composition should own more than roughly 15 percent of a long explainer.
- Use at least six motivated perspective modes in a long video: macro close-up, wide map,
  lateral tracking, vertical travel, split comparison, orbit/radial focus, depth push/pull,
  or another script-appropriate equivalent.
- If a visual motif returns, it must evolve the story: a stack may rotate, unroll, scroll,
  become a schedule, or collapse into a payload. Merely repopulating the same stack panel
  with new text does not count.
- Titles and chapter labels are transitional orientation, not a permanent dashboard.
- Keep slow camera drift subordinate to meaningful object motion. Camera motion alone does
  not satisfy the 3-5 second explanatory-change rule.

### Reusable motion repertoire

Inspect `/home/thinh/proj/youtube/motion-repertoire/` before building a new video. Borrow
general motion techniques—camera travel, cascades, path drawing, byte conveyors, stack
consumption, code spotlighting, address reordering, focus pulses, and scene seams—not a
previous video's layout, colors, narration, or content.

During or after a successful project:

1. Identify generally useful motion primitives created for the video.
2. Extract only context-free primitives into the shared repertoire with a short README,
   API example, provenance, and the visual problem each primitive solves.
3. Keep project-specific choreography in the project. Do not turn every bespoke shot into
   a global component.
4. Revisit the repertoire when planning the next video, but require a new script-specific
   motion map before reuse.

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
- The voice must be clearly audible and clean while retaining intimate human texture:
  audible breaths at natural phrase boundaries, restrained lip and mouth detail, and
  emotionally varied emphasis. Preserve breathiness and close-mic presence without
  accepting hiss, clipping, saliva clicks, harsh sibilance, low-frequency rumble, or
  exaggerated mouth noise.
- Target about 155-170 spoken words per minute. Adjust scene timing or script density before
  applying aggressive time-stretching.
- Generate three pilot sections first and validate pronunciation, pace, expression,
  breath placement, natural mouth detail, loudness, noise floor, and ASR intelligibility
  before bulk synthesis.

## Captions are mandatory

Every narrated YouTube master includes matching English captions unless the user opts out.

- Use the exact narration source for wording and ASR only for timestamps.
- Prefer a Motion Canvas caption overlay when captions need to remain editable in the
  composition. Use `scripts/srt_to_house_ass.py` when producing clean and captioned
  masters from one caption-free Motion Canvas render.
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
- the styled caption source (Motion Canvas timing data or ASS);
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
   silent tail, white flash, placeholder flag, inaudible narration, robotic cadence,
   or distracting breath and mouth noise.
4. Run `scripts/verify_video.sh` on both masters.
5. Visually inspect the extracted thumbnail.
6. Give the user clickable paths to the captioned master, clean master, SRT, and thumbnail.
