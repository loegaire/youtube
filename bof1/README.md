# How Input Becomes Control

A 1920×1080 Motion Canvas animation for picoCTF's **buffer overflow 1**. It is designed as one persistent visual argument for beginners: ordinary input fills memory, crosses a finite boundary, replaces a trusted return address, and redirects the CPU to the binary's existing `win` function.

The visual system is **Control Flow**: Swiss editorial structure, strict typographic hierarchy, restrained glass planes, and a neutral charcoal field with quiet green undertones. Amber and coral appear only when an address or corrupted state needs semantic emphasis. See [`DESIGN.md`](./DESIGN.md), the persisted [`design system`](./design-system/control-flow/MASTER.md), and the audited [`design-preview.png`](./design-preview.png).

## Run

```bash
npm install
npm run serve
```

Open the Motion Canvas editor shown by Vite (normally `http://localhost:9000`). Use the editor's Render tab to export the full video or individual scene ranges.

For a finished video, choose **Video (FFmpeg)** as the exporter and enable **Include audio**. The project also includes a resource-bounded fallback for an existing 30 fps PNG sequence:

```bash
npm run video:encode
```

This writes `output/picoctf-buffer-overflow-1-final.mp4` using two encoding threads at low process priority.

Validation:

```bash
npm run typecheck
npm run build
npm run build:preview
```

For a visual collision audit, build both projects and capture representative frames with:

```bash
node scripts/capture-scenes.mjs
```

## Dense scene map

The original 11 long scenes have been replaced by **43 cinematic scenes** containing roughly 150 individual animation beats.

| Chapter | Script range | Scenes | Visual system |
|---|---:|---:|---|
| 00 | 0:00–0:44 | 3 | Character typing, long-input escalation, redirected route |
| 01 | 0:44–1:36 | 4 | Per-cell tape construction, reading, writing, state changes |
| 02 | 1:36–2:38 | 4 | Address formation, CPU separation, instruction-pointer loop |
| 03 | 2:38–3:27 | 4 | Source, assembly, byte encoding, register and memory updates |
| 04 | 3:27–4:31 | 4 | Address-space growth, heap fade, stack push and pop |
| 05 | 4:31–5:20 | 4 | Line-by-line source isolation and unreachable `win` island |
| 06 | 5:20–6:23 | 5 | Missing capacity, bounded comparison, every overflow byte |
| 07 | 6:23–7:23 | 4 | Typed commands, disassembly, cyclic pattern, offset result |
| 08 | 7:23–8:17 | 4 | Symbol lookup, padding fill, endian reorder, exploit code |
| 09 | 8:17–9:02 | 4 | Fast replay, diagnostic, `ret` transfer, camera chase to `win` |
| 10 | 9:02–9:48 | 3 | Surviving objects, final statement, future-topic branches |

Every scene runs against an exact fixed-duration clock, preserving the supplied 9:48 endpoint. The complete shot-by-shot plan is in [`STORYBOARD.md`](./STORYBOARD.md).

## Verified local narration

The final 9:48 track uses **Resemble AI Chatterbox-Turbo** to clone the project owner's own English recording. Synthesis and speech recognition ran locally; no script or voice reference was sent to a hosted TTS service. The source take is preserved at `audio/reference/voice-original.m4a`, and the 13.8-second conditioning cut is `audio/reference/voice-reference.wav`.

The attached deliverable is `audio/narration.wav`. With the isolated Chatterbox and faster-whisper environments staged, the guarded workflow is:

```bash
npm run narration:plan
npm run narration:sync
npm run narration:pilot

# Only after all three pilots pass:
npm run narration:generate
npm run narration:finalize
```

The generator loads no more than four clips per process, uses two CPU threads, refuses to run below 3 GiB available RAM, and rejects tempo fitting above 1.15×. Code identifiers receive pronunciation-safe spoken forms while the source and visuals stay literal. All 43 raw and fitted clips passed local ASR; the full-track WER is 0.086. Evidence is in [`audio/QA.md`](./audio/QA.md), with machine-readable results under `audio/chatterbox-full/`; model and watermark notes are in [`audio/CREDITS.md`](./audio/CREDITS.md).

## Verified challenge constants

- Binary: `./chal`, 32-bit little-endian i386 ELF
- `win`: `0x080491f6`
- Offset from `buf` to saved return address: `44` bytes
- Encoded address bytes: `f6 91 04 08`

The full voice-over script remains in [`script.md`](./script.md).
