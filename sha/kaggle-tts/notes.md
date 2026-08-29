# sha-tts — VoxCPM2 voice cloning via Kaggle

## Status: WORKING (2026-08-28)

Pipeline validated end-to-end. `output.wav` (3.04s, 48kHz mono PCM) generated from
embedded 15s reference + test text, kernel v4, 2x T4, ~4 min wall time.

## Git (2026-08-28)

`~/proj/youtube` is now the canonical repo (git@github.com:loegaire/youtube.git),
branch `main`, HEAD `68ed82b`. Merged remote sha/ motion canvas project into local
tree + all video project sources (bof1, ret2libc, rop, uaf, heap_over_under_flow,
integer_vulns, fmstr2, aes, shellcode, protections, rsa, NASA, motion-repertoire,
bg-music). `.gitignore` excludes node_modules/venvs/model caches/renders/media and
dep-sharing symlinks. kaggle-tts is tracked; only generated wavs/output/ are ignored.

## Layout

- `~/proj/youtube/sha/kaggle-tts/`
  - `tts.sh` — one-command wrapper (push/poll/download), writes `latest.wav`
  - `build_kernel.py` — emits `kernel/` from template + `text.txt` + `reference/ref.opus.b64`
  - `kernel/` — generated (kernel.py ~63KB with base64-embedded ref + kernel-metadata.json)
  - `reference/` — `reference.m4a` (source, 66.6s), `ref.opus` + `ref.opus.b64` (15s@5s window, 24kbps opus, 61KB b64)
  - `text.txt` — narration text
  - `output/` — last kernel output (output.wav, reference.wav, sha-tts.log)
  - `latest.wav` — newest generated audio

## Usage

```bash
cd ~/proj/youtube/sha/kaggle-tts
./tts.sh - "Your narration text here"     # new text, same voice
./tts.sh newref.m4a "Narration"           # new reference + text
./tts.sh                                  # rebuild+rerun as-is
```

One command; poll loop handles queue + run (~4-30 min); result lands in `latest.wav`.

## Key facts / lessons

1. **Kaggle CLI `dataset_sources` did NOT mount.** Kernel v2/v3 failed with
   `/kaggle/input/sha-tts-reference/reference.m4a: No such file or directory`;
   v4 log printed `input dir: []` — input mount was empty even with a `ready`
   dataset listed in kernel-metadata.json. Root cause unresolved; worked around.
2. **Workaround: embed assets in the script kernel itself.** Reference trimmed to
   15s, opus 24kbps (~46KB), base64 (~61KB) into kernel.py source. No dataset
   dependency at all. Kernel push = the only API call that carries data.
3. Text/reference changes are passed by *regenerating kernel.py + pushing a new
   version* (`build_kernel.py`).
4. VoxCPM2 (`openbmb/VoxCPM2`, 2.29B BF16) loads with `optimize=True` on Kaggle
   T4 image (py3.12); `pip install voxcpm soundfile` at runtime works (~45s).
   `generate(reference_wav_path=...)` signature confirmed working.
5. `kaggle kernels status` returns "Permission 'kernels.get' was denied" while a
   version is queued/running — treat as running, keep polling.
6. Trim params in tts.sh: `-ss 5 -t 15` — reference.m4a has no silence gaps
   (dense speech), any window works; 5s offset avoids potential intro artifacts.
7. Generation params: cfg 2.0, timesteps 20, denoise+normalize on, retry_badcase
   ratio 6.0. Output 48kHz mono.

## Kaggle resources

- Kernel: `hajjilla/sha-tts` (private, script, 2x T4 via `machine_shape: NvidiaTeslaT4`)
- Dataset `hajjilla/sha-tts-reference` exists (reference.m4a + text.txt) but is
  currently UNUSED (mount broken). Kept as archive.
