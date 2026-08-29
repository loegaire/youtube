#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="$root/.chatterbox-standard"
mkdir -p "$target"

download() {
  local name="$1"
  local expected="$2"
  if [[ -f "$target/$name" ]] && [[ "$(stat -c%s "$target/$name")" -eq "$expected" ]]; then
    printf '%s already complete\n' "$name"
    return
  fi
  curl -fL --retry 12 --retry-all-errors --continue-at - \
    -o "$target/$name" \
    "https://huggingface.co/ResembleAI/chatterbox/resolve/main/$name?download=true"
}

download ve.safetensors 5695784
download tokenizer.json 25470
download conds.pt 107374
download s3gen.safetensors 1056484620
download t3_cfg.safetensors 2129653744

printf 'standard Chatterbox weights ready in %s\n' "$target"
