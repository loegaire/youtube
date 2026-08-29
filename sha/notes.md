
## Session 2 addendum (2026-08-29)

### Root causes found
1. **Inconsistent voice per line**: VoxCPM2 `generate()` with only `reference_wav_path` produces unstable/random voices per segment. Consistent cloning requires `prompt_wav_path` + `prompt_text` (exact transcript of the prompt wav, transcribed via faster-whisper) PLUS `reference_wav_path` (same file). Verified via F0 (autocorrelation) per segment vs reference — all within ±1.2 st after fix; user approved listening test.
2. **5 segments failing with bare AssertionError()**: the earlier text fix never applied — fix script matched 3-digit ids ("037") but manifest uses 2-digit ("37"). Always int-normalize ids when patching the manifest. v11 retry with real fixed texts succeeded.
3. **8.43s A/V desync**: Motion Canvas caches per-scene durations across HMR edits; the editor kept a stale 31,616-frame duration (authored: 31,869 + ceil ≈ 31,880). Render used stale scene boundaries → visuals shifted −8.45s from scene 03 on, last speech truncated. **Restart the dev server before rendering after re-timing scenes.** Confirmed: fresh restart showed [31880] and re-render (1062.72s) is fully synced.

### Verification battery (final render)
- ffprobe: 1062.720s, h264 + aac.
- Caption-cut probes at shots 16 / 30 / 111: on-time (no −8.45 shift).
- Audio tail: speech to ~1058.9s, silence after ~1060s — nothing truncated.
- Probe technique: `ffmpeg -ss lo -i file -frames:v 27 -vf scale=480:270,format=gray -f rawvideo` + numpy frame-diff max (never use `-to` after input seeking — it is output-relative).
