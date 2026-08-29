#!/usr/bin/env python3
import json
from pathlib import Path

manifest = json.loads(Path('audio/narration-segments.json').read_text())
start = 0.0
rows = []
for index, entry in enumerate(manifest, 1):
    end = start + entry['duration']
    def stamp(value):
        hours = int(value // 3600); minutes = int(value % 3600 // 60); seconds = value % 60
        return f'{hours:02d}:{minutes:02d}:{seconds:06.3f}'.replace('.', ',')
    rows += [str(index), f'{stamp(start)} --> {stamp(end)}', entry['text'], '']
    start = end
Path('assets/captions').mkdir(parents=True, exist_ok=True)
Path('assets/captions/integer-bugs.srt').write_text('\n'.join(rows))
