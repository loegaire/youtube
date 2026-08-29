# Shared local voice-clone automation

The reusable Chatterbox-Turbo environment is at `.chatterbox-venv/` and its model
cache is at `.chatterbox-models/`. Both are intentionally outside individual video
projects, so a new video reuses the same installation and model weights.

Every synthesis process is bounded to two CPU threads, one Torch inter-op thread, a
minimum of 3 GiB free RAM, 6 GiB free project disk, and at most three script sections.
It skips completed clips, so interrupted batches resume safely.

```bash
# List the narration sections in a project
scripts/chatterbox-narrate format-string-wizard --list

# Produce one bounded batch
scripts/chatterbox-narrate format-string-wizard --start 0 --count 3

# Resume all missing batches and join the final WAV
scripts/chatterbox-narrate format-string-wizard --all

# Only join existing clips
scripts/chatterbox-narrate format-string-wizard --finalize

# Join and gently fit narration to a fixed HyperFrames master duration
scripts/chatterbox-narrate format-string-wizard --finalize --target-duration 705
```

Each project owns its script at `scripts/generate-owner-narration.py`, its reference
audio at `assets/audio/owner-voice-reference.wav`, its clips at
`assets/audio/narration-clips/`, and its final WAV at
`assets/audio/owner-voice-narration.wav`.

Duration fitting is refused outside the natural 0.80–1.15x tempo range.
