#!/usr/bin/env python3
"""Resume-safe local download of the higher-fidelity Chatterbox clone weights."""

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.chatterbox-standard-models'
os.environ['HF_HOME'] = str(CACHE)
os.environ['HF_HUB_DISABLE_TELEMETRY'] = '1'
# The local runner has short, interruptible command windows.  Plain resumable
# HTTP files are safer here than a long-lived Xet transfer worker.
os.environ['HF_HUB_DISABLE_XET'] = '1'

from huggingface_hub import snapshot_download

path = snapshot_download(
    repo_id='ResembleAI/chatterbox',
    allow_patterns=['*.safetensors', '*.json', '*.pt'],
    resume_download=True,
)
print(path)
