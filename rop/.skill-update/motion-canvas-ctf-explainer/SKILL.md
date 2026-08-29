---
name: motion-canvas-ctf-explainer
description: Build and repair script-driven Motion Canvas explainer videos for CTF, security, and computer topics with dense 3-5 second animation beats, beginner-friendly visual metaphors, Swiss minimal glassmorphism art direction, camera staging, overlap audits, local TTS and ASR validation, and resource-safe rendering. Use when creating or revising a Motion Canvas video from a narration script, especially when avoiding slideshow-like scenes, visual clashes, language-incompatible voices, unintelligible time-compressed voice-over, or unsafe heavy synthesis runs.
---

# Motion Canvas CTF Explainer

Turn a technical script into a cinematic, understandable animation in which every visual change explains an idea. Treat visual clarity and intelligible narration as release gates, not polish.

## Establish the source of truth

1. Read the narration script, existing scene files, timing data, audio manifests, and project commands before editing.
2. Preserve the script's technical meaning. Simplify wording only when narration timing requires it, and record the change.
3. Build one timecoded beat sheet that owns narration, scene duration, on-screen action, camera movement, and sound cues.
4. Keep user assets and prior work intact. Use isolated scratch paths for generated intermediates.

## Design the beat sheet

1. Schedule a meaningful visual change every 3-5 seconds. Count a change only when it advances the explanation.
2. Split long explanations into multiple shots or micro-scenes. Do not stretch one card across a paragraph.
3. Animate every operation mentioned in the narration:
   - type characters and commands progressively;
   - mutate bytes and values in place;
   - move pointers, addresses, and data along visible paths;
   - fill memory one byte at a time;
   - stage calls, returns, crashes, checks, and flag recovery as causal events;
   - reveal labels only when their object becomes relevant.
4. Give each shot one dominant idea. Carry persistent context forward with small anchors instead of repeating full diagrams.
5. Use camera pushes, pans, tilts, parallax, reframing, and close-ups when spatial focus changes. Keep motion motivated and preserve readable scale.
6. Make the logic appreciable to viewers with little computer knowledge. Introduce a concrete visual metaphor, show cause and effect, then attach the technical term.

## Establish the investigation before the exploit

Do not begin and end with isolated instruction fragments. Give the viewer the complete
analysis ladder:

1. challenge prompt and supplied files;
2. source overview or detailed decompiler view;
3. `file`/`checksec`-style binary and mitigation inspection;
4. normal execution and controlled crash or offset discovery;
5. disassembly, debugger, or gadget-search workspace;
6. exploit strategy and only then the close-up instruction mechanics.

Show the full meaningful source when it is available. If it is long, show the complete
file as an overview and then move a measured highlight or camera crop to the relevant
function. Use editor gutters, aligned rows, syntax hierarchy, and real tool structure;
never build “code” from independently floating rectangles.

## Keep moving geometry connected

- Connectors that describe a relationship must use live endpoints derived from the
  current object positions, or share the same animated parent as their targets.
- Put relationship lines behind the objects they connect.
- When nodes reorder, rewind, orbit, or travel, audit the connector at maximum
  displacement as well as at rest.
- Reject any shot where a box slides through a stationary arrow or a line crosses a
  label because its endpoint was hand-entered.
- Prefer recognizable Font Awesome or Nerd Font glyphs for familiar objects and actions
  when they reduce reading load. Verify the actual rendered icon font and reject tofu
  boxes or ambiguous symbols.

## Apply the visual language

Use minimalism, Swiss editorial structure, and glassmorphism with nature-inspired green undertones.

- Build on a strict grid, generous negative space, crisp typography, and strong asymmetric hierarchy.
- Use translucent glass panels, restrained backdrop blur, soft botanical gradients, and controlled depth.
- Prefer moss, fern, sage, emerald, mist, charcoal, and warm off-white over neon cyberpunk colors.
- Keep one focal layer bright and high-contrast; push supporting layers into softer depth.
- Make interface objects feel like polished modern web components, not generic presentation cards.
- Avoid decorative blobs, excessive glow, low-contrast text, arbitrary gradients, repeated card grids, and motion without explanatory purpose.

Read [quality-gates.md](references/quality-gates.md) before approving art direction or narration.

## Budget narration before synthesis

1. Export narration segments as a JSON array with `id`, `duration`, and `text`.
2. Run `node scripts/check_narration_budget.mjs path/to/segments.json`.
3. Target 125-155 words per minute. Treat 156-170 as a revision warning and reject anything above 170 by default.
4. Allocate words by available duration, not by sentence count. Never preserve a dense sentence in a short shot merely because it was one sentence in the source.
5. If a segment fails, shorten its copy, redistribute it, or extend the timeline before synthesizing.

## Validate TTS before bulk generation

1. Inspect the voice model metadata before synthesis. Confirm its supported language, synthesis type, required runtime, and license or credit terms.
2. Treat a language-specific synthesizer as incompatible with other script languages. Do not mistake a synthesis checkpoint for a multilingual voice-conversion model.
3. Prefer a fully local, language-compatible model. Never send a user's script to a third-party TTS service without explicit approval for that disclosure.
4. Synthesize only three pilots first: one low-density, one median-density, and one high-density or pronunciation-heavy segment.
5. Keep synthesis speed near native. Reject any clip requiring more than 1.15x post-processing tempo fitting.
6. Transcribe both untouched raw pilots and time-fitted pilots with a local speech recognizer.
7. Stop if the transcript is empty, badly mismatched, or above 30 percent word error rate. Do not bulk-generate, attach, or delete pilot sources until both variants pass.
8. Resolve failure by correcting the voice language, rewriting pronunciation-heavy copy, redistributing chapter duration, extending the video, translating the script, or selecting a compatible local voice. Never hide failure with extreme speed-up.
9. Generate in small sequential batches. Transcribe every raw and fitted clip before concatenating the final track.
10. Attach the final narration only after exact-duration and full-track gates pass.

Read [narration-repair-case.md](references/narration-repair-case.md) when replacing a failed TTS pipeline.

## Render without exhausting the machine

1. Put runtimes, models, and intermediates on disk-backed storage, not RAM-backed temporary storage.
2. Load only the needed voice model. Avoid keeping default and target models resident together.
3. Use about two CPU threads for synthesis and render small sequential batches of three or four segments.
4. Check free disk, available RAM, and swap between batches. Pause below roughly 2.5-3 GB available RAM or when swap approaches exhaustion.
5. Do not run browser rendering, synthesis, recognition, and encoding concurrently on a constrained machine.
6. Preserve raw pilots, full-track clips, manifests, timing ratios, and ASR reports until the final audio passes. Clean only generated, reproducible intermediates after verification.

## Audit visuals with exact frames

1. Render stills at the start, middle, and end of every scene plus both sides of every transition.
2. Inspect those images at the delivery resolution with image-view capabilities.
3. Check safe margins, text wrapping, clipping, overlap, caption collisions, camera crops, contrast, glass legibility, and focal hierarchy.
4. Inspect busy animated moments, not only scene posters. Seek frames where several tweens peak together.
5. Correct the layout or sequencing, render the same evidence frames again, and repeat until clean.
6. Review a low-resolution full motion pass for pacing and accidental dead time before the expensive final render.

## Repair a failed production

1. Detach or mute known-broken narration so it cannot ship accidentally.
2. Inspect the segment manifest, WPM report, raw durations, tempo filters, and ASR output before regenerating anything.
3. Replace the segmentation and timing plan first. Regenerate only the three pilots.
4. Inspect representative video frames before a full rerender.
5. Resume bulk work only after both audio and visual gates pass.

## Definition of done

Complete the video only when all conditions hold:

- the technical sequence matches the script;
- meaningful animation occurs at least every 3-5 seconds;
- details such as characters, bytes, pointers, and state changes animate explicitly;
- camera movement supports spatial focus without harming readability;
- all sampled frames pass the visual audit;
- pilot and final narration are intelligible without excessive tempo compression;
- audio duration, scene timing, captions, credits, and asset references agree;
- typecheck, project build, low-resolution motion pass, and final render succeed;
- unneeded generated artifacts are removed only after the verified deliverable exists.
