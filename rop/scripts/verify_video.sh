#!/usr/bin/env bash
set -euo pipefail

video="${1:?usage: verify_video.sh <video.mp4>}"
receipt="${2:-${video%.*}-verification.txt}"

{
  ffprobe -v error \
    -show_entries format=duration,size \
    -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels \
    -of default=noprint_wrappers=1 \
    "$video"
  ffmpeg -v error -threads 2 -i "$video" -f null -
  duration="$(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$video")"
  tail_start="$(awk -v duration="$duration" 'BEGIN { value=duration-120; if (value<0) value=0; printf "%.3f", value }')"
  ffmpeg -v info -threads 2 -ss "$tail_start" -i "$video" -af "silencedetect=noise=-45dB:d=4" -f null - 2>&1 \
    | sed -n '/silence_/p'
} >"$receipt"

printf 'Verification receipt: %s\n' "$receipt"
