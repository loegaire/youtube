#!/usr/bin/env bash
set -euo pipefail

source_dir="${1:-review/audit-frames}"
output_dir="${2:-review/contact-sheets}"
mkdir -p "$output_dir"

mapfile -t frames < <(find "$source_dir" -maxdepth 1 -type f -name '*.png' | sort)
page=0
for ((offset=0; offset<${#frames[@]}; offset+=12)); do
  subset=("${frames[@]:offset:12}")
  magick montage "${subset[@]}" \
    -thumbnail 480x270 \
    -background '#050B08' \
    -geometry 480x270+4+4 \
    -tile 3x4 \
    "$output_dir/page-$(printf '%02d' "$page").png"
  page=$((page + 1))
done
