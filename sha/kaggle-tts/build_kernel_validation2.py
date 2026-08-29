import base64, json, os, subprocess as sh

REF_M4A = "/home/thinh/proj/youtube/voice.m4a"
b64 = base64.b64encode(open(REF_M4A, "rb").read()).decode()

BODY = r'''
import base64, json, os, subprocess as sh, wave

os.makedirs("/kaggle/working", exist_ok=True)
work = __import__("pathlib").Path("/kaggle/working")

sh.run(["pip", "install", "-q", "voxcpm", "soundfile", "faster-whisper"], check=True)

REF_B64 = __REF_B64__
m4a = work / "voice.m4a"
m4a.write_bytes(base64.b64decode(REF_B64))

ref_wav = work / "voice_full.wav"
sh.run(["ffmpeg", "-y", "-v", "error", "-i", str(m4a),
        "-vn", "-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le", str(ref_wav)], check=True)

import numpy as np

def f0_of(path_or_arr, sr=24000):
    if isinstance(path_or_arr, str):
        w = wave.open(path_or_arr); sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)/32768
    else:
        x = np.asarray(path_or_arr, dtype=np.float32)
    frame = int(0.05*sr); hop = int(0.025*sr); f0s = []
    for i in range(0, max(1, len(x)-frame), hop):
        f = x[i:i+frame]
        if np.sqrt((f**2).mean()) < 0.02: continue
        f = f - f.mean()
        ac = np.correlate(f, f, "full")[frame-1:]
        lo, hi = int(sr/400), min(int(sr/60), len(ac)-1)
        if hi <= lo: continue
        pk = np.argmax(ac[lo:hi]) + lo
        if ac[pk] > 0.3*ac[0]: f0s.append(sr/pk)
    return float(np.median(f0s)) if f0s else 0.0

from faster_whisper import WhisperModel
wm = WhisperModel("small", device="cuda", compute_type="float16")

segs, info = wm.transcribe(str(ref_wav), language="en", beam_size=5, word_timestamps=True)
segs = list(segs)
full_transcript = " ".join(s.text.strip() for s in segs).strip()
print("FULL TRANSCRIPT:", repr(full_transcript), flush=True)
for s in segs:
    print(f"  seg [{s.start:6.2f} -> {s.end:6.2f}] {s.text.strip()[:90]}", flush=True)

# deterministic prompt window: sentence-aligned, duration closest to 15s in [12,18]
cands = []
for i in range(len(segs)):
    for j in range(i, len(segs)):
        d = segs[j].end - segs[i].start
        if 12.0 <= d <= 18.0:
            cands.append((abs(d-15.0), i, j))
        elif d > 18.0:
            break
assert cands, "no valid prompt window"
_, i, j = min(cands)
p0, p1 = segs[i].start, segs[j].end
prompt_text = " ".join(segs[k].text.strip() for k in range(i, j+1)).strip()
print(f"PROMPT WINDOW [{p0:.3f} -> {p1:.3f}] dur={p1-p0:.2f}s", flush=True)
print("PROMPT_TEXT:", repr(prompt_text), flush=True)

prompt_wav = work / "prompt.wav"
sh.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{p0:.3f}", "-to", f"{p1:.3f}", "-i", str(ref_wav),
        "-vn", "-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le", str(prompt_wav)], check=True)
f0_ref = f0_of(str(prompt_wav))
print(f"F0 reference: {f0_ref:.1f} Hz", flush=True)

from voxcpm import VoxCPM
try:
    model = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=True, device="cuda", optimize=True)
except Exception as e:
    print("optimize=True failed, retrying:", repr(e), flush=True)
    model = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=True, device="cuda", optimize=False)

tests = json.loads('[["A", "First, SHA-256 computes T one from H, the sigma function of E, the Choose function, a round constant, and the current message word. Then T two is computed from the sigma function of A and the Majority function."], ["B", "This gives us a fixed output size of two hundred fifty-six bits, no matter how large the input is."], ["C", "Let\\u2019s hash the text A, B, C and watch every byte move."]]')

import soundfile as sf
import re

def norm_words(t):
    return re.sub(r"[^a-z0-9 ]", "", t.lower()).split()

report = {"prompt_window": [p0, p1], "prompt_text": prompt_text, "f0_ref": f0_ref, "clones": {}}
for name, text in tests:
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
    out = work / f"clone_{name}.wav"
    sf.write(str(out), wav, model.tts_model.sample_rate)
    dur = len(wav)/model.tts_model.sample_rate
    f0 = f0_of(wav, model.tts_model.sample_rate)
    csegs, _ = wm.transcribe(str(out), language="en", beam_size=5)
    ct = " ".join(s.text.strip() for s in csegs).strip()
    tw, cw = norm_words(text), norm_words(ct)
    lead = []
    for w in cw:
        if tw and w == tw[0]:
            break
        lead.append(w)
        if len(lead) >= 6: break
    echo = " ".join(lead) if lead and lead != cw[:len(lead)] else ""
    print(f"clone_{name}: {dur:.2f}s F0={f0:.1f}Hz", flush=True)
    print(f"  INTENDED: {text[:80]}", flush=True)
    print(f"  HEARD   : {ct[:160]}", flush=True)
    print(f"  LEADING-JUNK: {echo!r}", flush=True)
    report["clones"][name] = {"dur": dur, "f0": f0, "transcript": ct, "leading_junk": echo}

(work / "report.json").write_text(json.dumps(report, indent=2))
print("DONE", flush=True)
'''

body = BODY.replace("__REF_B64__", json.dumps(b64))
import ast
ast.parse(body)
os.makedirs("kernel-validation2", exist_ok=True)
open("kernel-validation2/kernel.py", "w").write(body)
meta = {
    "id": "hajjilla/sha-tts", "title": "sha-tts", "code_file": "kernel.py",
    "language": "python", "kernel_type": "script", "is_private": "true",
    "enable_gpu": "true", "enable_internet": "true",
    "dataset_sources": [], "competition_sources": [], "kernel_sources": [],
    "machine_shape": "NvidiaTeslaT4",
}
json.dump(meta, open("kernel-validation2/kernel-metadata.json", "w"), indent=2)
print(f"built ok, {len(body)} bytes")
