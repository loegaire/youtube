import re
from pathlib import Path
import subprocess
import torch
import torchaudio
import os
import sys

# Ensure HF uses local cache
os.environ.setdefault("HF_HOME", "/home/thinh/proj/youtube/fmstr2/.chatterbox-models")
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")

from chatterbox.tts_turbo import ChatterboxTurboTTS

scenes = [
    'intro.tsx', 'gfMath.tsx', 'stateMatrix.tsx', 'subBytes.tsx',
    'shiftRows.tsx', 'mixColumns.tsx', 'addRoundKey.tsx', 'keyExpansion.tsx',
    'roundStructure.tsx', 'walkthrough.tsx', 'decryption.tsx', 'conclusion.tsx'
]
lines = []
for idx, scene in enumerate(scenes):
    p = Path('/home/thinh/proj/youtube/aes/project/src/scenes') / scene
    content = p.read_text()
    for m in re.finditer(r"showCaption\([^,]+,\s*'([^']+)',\s*([0-9.]+)\)", content):
        lines.append({
            'id': f"{idx:02d}_{len(lines):02d}",
            'text': m.group(1),
            'duration': float(m.group(2))
        })

REFERENCE = Path('/home/thinh/proj/youtube/voice.m4a')
OUTPUT_DIR = Path('/home/thinh/proj/youtube/aes/project/audio/chatterbox-clips')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("Loading model...")
torch.set_num_threads(2)
torch.set_num_interop_threads(1)
model = ChatterboxTurboTTS.from_pretrained(device="cpu")
model.prepare_conditionals(str(REFERENCE))

concat_file = OUTPUT_DIR / "concat.txt"
concat_lines = []

for entry in lines:
    segment_id = entry['id']
    text = entry['text']
    target_duration = entry['duration']
    
    raw = OUTPUT_DIR / f"{segment_id}-raw.wav"
    fitted = OUTPUT_DIR / f"{segment_id}.wav"
    
    print(f"Generating {segment_id}...")
    with torch.inference_mode():
        wav = model.generate(
            text,
            repetition_penalty=1.25,
            temperature=0.72,
            top_p=0.92,
            top_k=700,
        )
    torchaudio.save(str(raw), wav, model.sr)
    
    res = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(raw)], capture_output=True, text=True, check=True)
    raw_duration = float(res.stdout.strip())
    
    tempo = max(1.0, raw_duration / target_duration)
    filters = []
    if tempo > 1.001:
        filters.append(f"atempo={tempo:.6f}")
    filters.extend([
        "loudnorm=I=-18:TP=-1.5:LRA=7",
        "apad",
        f"atrim=duration={target_duration:.3f}",
    ])
    
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", str(raw),
        "-af", ",".join(filters), "-ar", "44100", "-ac", "2",
        "-c:a", "pcm_s16le", str(fitted),
    ], check=True)
    
    concat_lines.append(f"file '{fitted.name}'")

concat_file.write_text("\n".join(concat_lines) + "\n")

final_output = Path('/home/thinh/proj/youtube/aes/project/audio/narration.wav')
subprocess.run([
    "ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(concat_file),
    "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(final_output)
], check=True, cwd=str(OUTPUT_DIR))

print(f"Done! Created {final_output}")
