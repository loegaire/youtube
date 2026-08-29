import re
from pathlib import Path
import subprocess
import json
import os

scenes = [
    'intro.tsx', 'gfMath.tsx', 'stateMatrix.tsx', 'subBytes.tsx',
    'shiftRows.tsx', 'mixColumns.tsx', 'addRoundKey.tsx', 'keyExpansion.tsx',
    'roundStructure.tsx', 'walkthrough.tsx', 'decryption.tsx', 'conclusion.tsx'
]

OUTPUT_DIR = Path('/home/thinh/proj/youtube/aes/project/audio/chatterbox-clips')
concat_file = OUTPUT_DIR / "concat_normal.txt"
concat_lines = []

global_idx = 0

for idx, scene in enumerate(scenes):
    p = Path('/home/thinh/proj/youtube/aes/project/src/scenes') / scene
    content = p.read_text()
    
    def replace_caption(match):
        global global_idx
        segment_id = f"{idx:02d}_{global_idx:02d}"
        global_idx += 1
        
        raw_wav = OUTPUT_DIR / f"{segment_id}-raw.wav"
        fitted_wav = OUTPUT_DIR / f"{segment_id}-normal.wav"
        
        res = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(raw_wav)], capture_output=True, text=True, check=True)
        raw_duration = float(res.stdout.strip())
        
        # Add 0.3 seconds for natural pause
        new_duration = raw_duration + 0.3
        
        # Process the audio with just normalization and padding
        filters = [
            "loudnorm=I=-18:TP=-1.5:LRA=7",
            "apad",
            f"atrim=duration={new_duration:.3f}"
        ]
        
        subprocess.run([
            "ffmpeg", "-y", "-v", "error", "-i", str(raw_wav),
            "-af", ",".join(filters), "-ar", "44100", "-ac", "2",
            "-c:a", "pcm_s16le", str(fitted_wav),
        ], check=True)
        
        concat_lines.append(f"file '{fitted_wav.name}'")
        
        # Replace the duration in the source code
        original_string = match.group(0)
        # Reconstruct with new duration
        parts = original_string.rsplit(',', 1)
        return f"{parts[0]}, {new_duration:.3f})"
    
    # We must reset global_idx for each file to match the original numbering?
    # Wait, my original logic was: len(lines) across ALL scenes!
    # Ah! In generate_voice.py:
    # for idx, scene in enumerate(scenes):
    #     for m in re.finditer(...):
    #         lines.append({ 'id': f"{idx:02d}_{len(lines):02d}" })
    pass

# We need to process exactly like the original
lines_count = 0
for idx, scene in enumerate(scenes):
    p = Path('/home/thinh/proj/youtube/aes/project/src/scenes') / scene
    content = p.read_text()
    
    # Find all matches first so we can replace them accurately
    matches = list(re.finditer(r"showCaption\([^,]+,\s*'([^']+)',\s*([0-9.]+)\)", content))
    
    if not matches:
        continue
        
    new_content = content
    offset = 0
    
    for match in matches:
        segment_id = f"{idx:02d}_{lines_count:02d}"
        lines_count += 1
        
        raw_wav = OUTPUT_DIR / f"{segment_id}-raw.wav"
        fitted_wav = OUTPUT_DIR / f"{segment_id}-normal.wav"
        
        res = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(raw_wav)], capture_output=True, text=True, check=True)
        raw_duration = float(res.stdout.strip())
        
        new_duration = raw_duration + 0.3
        
        filters = [
            "loudnorm=I=-18:TP=-1.5:LRA=7",
            "apad",
            f"atrim=duration={new_duration:.3f}"
        ]
        
        subprocess.run([
            "ffmpeg", "-y", "-v", "error", "-i", str(raw_wav),
            "-af", ",".join(filters), "-ar", "44100", "-ac", "2",
            "-c:a", "pcm_s16le", str(fitted_wav),
        ], check=True)
        
        concat_lines.append(f"file '{fitted_wav.name}'")
        
        # Replace in content
        original_string = match.group(0)
        parts = original_string.rsplit(',', 1)
        new_string = f"{parts[0]}, {new_duration:.3f})"
        
        start = match.start() + offset
        end = match.end() + offset
        new_content = new_content[:start] + new_string + new_content[end:]
        offset += len(new_string) - len(original_string)
        
    p.write_text(new_content)

concat_file.write_text("\n".join(concat_lines) + "\n")

final_output = Path('/home/thinh/proj/youtube/aes/project/audio/narration.wav')
subprocess.run([
    "ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(concat_file),
    "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(final_output)
], check=True, cwd=str(OUTPUT_DIR))

print("All scenes updated and new narration.wav generated.")
