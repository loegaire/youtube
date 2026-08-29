#!/usr/bin/env bash
set -euo pipefail

ffmpeg -y -hide_banner -loglevel warning \
  -i renders/uaf-foundations-owner-voice-clean.mp4 \
  -vf 'ass=assets/captions/uaf-foundations-owner-voice.ass' \
  -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -threads 1 \
  -c:a copy -movflags +faststart \
  renders/uaf-foundations-owner-voice-captioned.mp4
