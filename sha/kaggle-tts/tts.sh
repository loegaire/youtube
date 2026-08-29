#!/usr/bin/env bash
# One-command TTS via Kaggle GPU (VoxCPM2 voice cloning).
# Usage:
#   ./tts.sh                                  # rebuild+run with existing reference/ref.opus.b64 and text.txt
#   ./tts.sh reference.m4a                    # re-encode new reference, keep existing text
#   ./tts.sh reference.m4a "Narration text"   # new reference + new text
#   ./tts.sh - "Narration text"               # keep existing reference, new text
set -euo pipefail
cd "$(dirname "$0")"

KERNEL_SLUG="hajjilla/sha-tts"
REF_IN="${1:-}"
TEXT="${2:-}"

# 1. Update reference (trim to 15s window, opus-compress, base64)
if [[ -n "$REF_IN" && "$REF_IN" != "-" ]]; then
  echo ">> encoding reference: $REF_IN"
  ffmpeg -y -v error -ss 5 -t 15 -i "$REF_IN" -vn -ac 1 -ar 16000 \
    -c:a libopus -b:a 24k reference/ref.opus
  base64 -w0 reference/ref.opus > reference/ref.opus.b64
fi

# 2. Update text
if [[ -n "$TEXT" ]]; then
  printf '%s' "$TEXT" > text.txt
fi

# 3. Build kernel dir
python3 build_kernel.py

# 4. Push (this triggers the run)
echo ">> pushing kernel"
kaggle kernels push -p kernel

# 5. Grace period so status() doesn't read the previous version's status
sleep 90

# 6. Poll
echo ">> polling status (queue + run can take 10-30 min)..."
while true; do
  st=$(kaggle kernels status "$KERNEL_SLUG" 2>&1 | tail -1)
  case "$st" in
    *COMPLETE*)
      echo ">> run COMPLETE"
      break
      ;;
    *ERROR*|*CANCEL*)
      echo ">> run FAILED: $st"
      rm -rf output && mkdir -p output
      kaggle kernels output "$KERNEL_SLUG" -p output -o || true
      cat output/*.log 2>/dev/null | tail -40 || true
      exit 1
      ;;
    *)
      echo "$(date +%H:%M:%S)  queued/running..."
      ;;
  esac
  sleep 60
done

# 7. Download outputs
rm -rf output && mkdir -p output
kaggle kernels output "$KERNEL_SLUG" -p output -o

if [[ -f output/output.wav ]]; then
  cp output/output.wav latest.wav
  echo ">> done: $(pwd)/latest.wav"
  ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 latest.wav
else
  echo ">> WARNING: no output.wav in kernel output"
  ls -la output/
  exit 1
fi
