#!/bin/bash
set -eo pipefail
exec > >(tee -a render-full.log) 2>&1

echo "=== Starting Full Build Pipeline ==="
cd /home/thinh/proj/youtube/protections/motion-canvas

echo "1. Generating owner voice..."
npm run narration:generate

echo "2. Finalizing owner voice..."
npm run narration:finalize

echo "3. Mixing background music..."
ffmpeg -y -i audio/narration.wav -stream_loop -1 -i audio/music/dova-neko-loopable.wav \
  -filter_complex "[1:a]volume=0.12[bg];[bg][0:a]sidechaincompress=threshold=0.015:ratio=12:attack=40:release=750[duckedbg];[0:a][duckedbg]amix=inputs=2:duration=first:dropout_transition=3[out]" \
  -map "[out]" audio/narration-with-music.wav

echo "4. Building captions..."
npm run captions:build
python3 /home/thinh/.codex/skills/thinh-youtube-house-style/scripts/srt_to_house_ass.py captions/binary-defenses.srt captions/binary-defenses.ass --no-prompt

echo "5. Rendering final video..."
cd ../video
npm run render

echo "=== Pipeline Complete ==="
