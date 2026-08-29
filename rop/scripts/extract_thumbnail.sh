#!/usr/bin/env bash
set -euo pipefail

input="${1:?usage: extract_thumbnail.sh <video> <timestamp> <output.png>}"
timestamp="${2:?usage: extract_thumbnail.sh <video> <timestamp> <output.png>}"
output="${3:?usage: extract_thumbnail.sh <video> <timestamp> <output.png>}"

mkdir -p "$(dirname "$output")"
ffmpeg -y -v error -threads 2 -ss "$timestamp" -i "$input" -frames:v 1 -vf "scale=1920:1080:flags=lanczos" "$output"
ffprobe -v error -show_entries stream=width,height -of default=nk=1:nw=1 "$output"

