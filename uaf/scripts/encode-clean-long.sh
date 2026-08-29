#!/usr/bin/env bash
set -euo pipefail

ffmpeg -y -hide_banner -loglevel warning \
  -framerate 24 -start_number 0 -i output/project/%06d.png \
  -stream_loop -1 -i assets/music/dova-7674-kamikakushi-loop.mp3 \
  -i audio/narration-render-aligned.wav \
  -filter_complex '[1:a]volume=0.045,afade=t=in:st=0:d=1.5,afade=t=out:st=154.667:d=1.5[music];[2:a]volume=1.0[narration];[music][narration]amix=inputs=2:duration=first:normalize=0[audio]' \
  -map 0:v:0 -map '[audio]' -t 156.166667 \
  -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -threads 1 \
  -c:a aac -b:a 192k -movflags +faststart \
  renders/uaf-foundations-owner-voice-clean.mp4
