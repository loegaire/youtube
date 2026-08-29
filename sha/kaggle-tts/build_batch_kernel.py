#!/usr/bin/env python3
"""Build a batch TTS kernel: generate one wav per script segment in a single Kaggle run.

Usage: python3 build_batch_kernel.py segments.json
Writes kernel-batch/ (kernel.py + kernel-metadata.json) ready for `kaggle kernels push`.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

TEMPLATE = '''import base64
import json
import subprocess
import sys
import zipfile
from pathlib import Path

SEGMENTS_JSON = __SEGMENTS_JSON__
VOICE_B64 = "__VOICE_B64__"


def sh(cmd):
    print("+", " ".join(cmd), flush=True)
    return subprocess.run(cmd, check=True)


sh([sys.executable, "-m", "pip", "install", "-q", "-U", "voxcpm", "soundfile", "faster-whisper"])

import torch  # noqa: E402
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
from voxcpm import VoxCPM  # noqa: E402

print("GPU count:", torch.cuda.device_count(), flush=True)

work = Path("/kaggle/working")
out_dir = work / "audio"
out_dir.mkdir(exist_ok=True)

voice_m4a = work / "voice.m4a"
voice_wav = work / "voice_full.wav"
voice_m4a.write_bytes(base64.b64decode(VOICE_B64))
sh([
    "ffmpeg", "-y", "-v", "error",
    "-i", str(voice_m4a),
    "-vn", "-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le",
    str(voice_wav),
])


def f0_of(path, sr=24000):
    import wave
    w = wave.open(path)
    sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    frame = int(0.05 * sr)
    hop = int(0.025 * sr)
    f0s = []
    for i in range(0, max(1, len(x) - frame), hop):
        f = x[i:i + frame]
        if np.sqrt((f ** 2).mean()) < 0.02:
            continue
        f = f - f.mean()
        ac = np.correlate(f, f, "full")[frame - 1:]
        lo, hi = int(sr / 400), min(int(sr / 60), len(ac) - 1)
        if hi <= lo:
            continue
        pk = np.argmax(ac[lo:hi]) + lo
        if ac[pk] > 0.3 * ac[0]:
            f0s.append(sr / pk)
    return float(np.median(f0s)) if f0s else 0.0


# VoxCPM2 voice cloning requires prompt_wav_path AND prompt_text (exact
# transcript of the prompt wav) together, plus reference_wav_path for max
# similarity. Cut a sentence-aligned ~15s window from the reference audio
# using whisper word timestamps so prompt_text matches the audio exactly.
from faster_whisper import WhisperModel  # noqa: E402

wm = WhisperModel("small", device="cuda", compute_type="float16")
wsegs, _ = wm.transcribe(str(voice_wav), language="en", beam_size=5, word_timestamps=True)
wsegs = list(wsegs)
print("FULL TRANSCRIPT:", " ".join(s.text.strip() for s in wsegs), flush=True)

cands = []
for i in range(len(wsegs)):
    for j in range(i, len(wsegs)):
        d = wsegs[j].end - wsegs[i].start
        if 12.0 <= d <= 18.0:
            cands.append((abs(d - 15.0), i, j))
        elif d > 18.0:
            break
if not cands:
    raise RuntimeError("no valid sentence-aligned prompt window in reference audio")
_, wi, wj = min(cands)
p0, p1 = wsegs[wi].start, wsegs[wj].end
prompt_text = " ".join(wsegs[k].text.strip() for k in range(wi, wj + 1)).strip()
print(f"PROMPT_WINDOW: [{p0:.3f} -> {p1:.3f}] dur={p1 - p0:.2f}s", flush=True)
print("PROMPT_TEXT:", repr(prompt_text), flush=True)
if not prompt_text:
    raise RuntimeError("empty whisper transcript of reference audio")

prompt_wav = work / "prompt.wav"
sh([
    "ffmpeg", "-y", "-v", "error",
    "-ss", f"{p0:.3f}", "-to", f"{p1:.3f}",
    "-i", str(voice_wav),
    "-vn", "-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le",
    str(prompt_wav),
])
print(f"F0 prompt: {f0_of(str(prompt_wav)):.1f} Hz", flush=True)

try:
    model = VoxCPM.from_pretrained(
        "openbmb/VoxCPM2", load_denoiser=True, device="cuda", optimize=True,
    )
except Exception as e:
    print("optimize=True load failed, retrying without optimize:", repr(e), flush=True)
    model = VoxCPM.from_pretrained(
        "openbmb/VoxCPM2", load_denoiser=True, device="cuda", optimize=False,
    )

segments = json.loads(SEGMENTS_JSON)
sr = model.tts_model.sample_rate
durations = {}
failed = []

for i, seg in enumerate(segments):
    sid = str(seg["id"]).zfill(3)
    text = seg["text"]
    if not text.strip():
        durations[sid] = None
        print(f"[{i + 1}/{len(segments)}] seg_{sid}: (no narration, skipped)", flush=True)
        continue
    ok = False
    for attempt in range(3):
        try:
            wav = model.generate(
                text=text,
                prompt_wav_path=str(prompt_wav),
                prompt_text=prompt_text,
                reference_wav_path=str(prompt_wav),
                cfg_value=2.0,
                inference_timesteps=20,
                normalize=True,
                denoise=True,
                retry_badcase=True,
                retry_badcase_max_times=3,
                retry_badcase_ratio_threshold=6.0,
            )
            sf.write(str(out_dir / f"seg_{sid}.wav"), wav, sr)
            durations[sid] = round(len(wav) / sr, 3)
            print(f"[{i + 1}/{len(segments)}] seg_{sid}: {durations[sid]:.2f}s", flush=True)
            ok = True
            break
        except Exception as e:
            print(f"seg_{sid} attempt {attempt + 1} failed: {repr(e)}", flush=True)
            torch.cuda.empty_cache()
    if not ok:
        durations[sid] = None
        failed.append(sid)
    if (i + 1) % 10 == 0:
        torch.cuda.empty_cache()

(out_dir / "durations.json").write_text(json.dumps(durations, indent=1))
print("failed:", failed, flush=True)

zip_path = work / "audio.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_STORED) as z:
    for f in sorted(out_dir.iterdir()):
        z.write(f, f"audio/{f.name}")

total = sum(v for v in durations.values() if v)
print(f"DONE segments={len(durations)} failed={len(failed)} total_audio={total:.1f}s", flush=True)
'''


def main():
    segments_file = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "manifest" / "segments.json"
    segments = json.loads(segments_file.read_text())
    import base64 as _b64
    voice_b64 = _b64.b64encode(Path("/home/thinh/proj/youtube/voice.m4a").read_bytes()).decode("ascii")

    seg_json = json.dumps(segments, ensure_ascii=True, separators=(",", ":"))
    src = TEMPLATE.replace("__SEGMENTS_JSON__", repr(seg_json)).replace("__VOICE_B64__", voice_b64)

    out_dir = ROOT / "kernel-batch"
    out_dir.mkdir(exist_ok=True)
    (out_dir / "kernel.py").write_text(src, encoding="utf-8")

    metadata = {
        "id": "hajjilla/sha-tts",
        "title": "sha-tts",
        "code_file": "kernel.py",
        "language": "python",
        "kernel_type": "script",
        "is_private": True,
        "enable_gpu": True,
        "enable_internet": True,
        "machine_shape": "NvidiaTeslaT4",
        "dataset_sources": [],
        "competition_sources": [],
        "kernel_sources": [],
        "model_sources": [],
    }
    (out_dir / "kernel-metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(f"built {out_dir}/kernel.py ({len(src)} bytes, {len(segments)} segments)")


if __name__ == "__main__":
    main()
