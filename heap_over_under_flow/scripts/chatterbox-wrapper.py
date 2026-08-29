#!/usr/bin/env python3
"""Run the proven local Chatterbox batch generator with a numba cache shim.

The shared Python 3.12 environment has a numba/librosa cache-locator issue.
The shim preserves synthesis while disabling only compiled-function disk caches;
the owner voice, model, and generated audio remain entirely local.
"""

from __future__ import annotations

import runpy
import sys

import numba


def no_cache(factory):
    def wrapped(*args, **kwargs):
        kwargs["cache"] = False
        return factory(*args, **kwargs)

    return wrapped


numba.jit = no_cache(numba.jit)
numba.njit = no_cache(numba.njit)
numba.vectorize = no_cache(numba.vectorize)
numba.guvectorize = no_cache(numba.guvectorize)

GENERATOR = "/home/thinh/proj/youtube/bof1/scripts/generate-chatterbox.py"
sys.argv[0] = GENERATOR
runpy.run_path(GENERATOR, run_name="__main__")
