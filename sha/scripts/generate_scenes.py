#!/usr/bin/env python3
import json
import re
from pathlib import Path

script = Path('/home/thinh/proj/youtube/sha/script.md').read_text()
out = Path('/home/thinh/proj/youtube/sha/src/scenes')

def sec(t):
    m, s = map(int, t.split(':'))
    return m * 60 + s

chunks = re.findall(r'(?ms)^#{1,2} SCENE .*?(?=^#{1,2} SCENE |^# END CARD|\Z)', script)
shots_re = re.compile(r'###\s+(\d+)\s*\n\n\*\*Speech:\*\*\s*“([^”]+)”\s*\n\*\*Animation:\*\*\s*(.*?)\n\*\*Timing:\*\*\s*`(\d+:\d+)–(\d+:\d+)`', re.DOTALL)
files = ['01-hook','02-examples','03-toy-hash','04-sha-inner-workings','05-mini-sha','06-security','07-break-the-toy','08-toy-hash-source','09-executing-toy-hash','10-why-not-sha','11-hashing-speed','12-hashing-vs-plaintext','13-breaking-sha','14-sha256-vs-sha1','15-attacking-toy','16-other-failures','17-return-sha256','18-final-summary']
header = """import {makeScene2D, Node} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic} from '@motion-canvas/core';
import {bg, Caption, ShotVisual} from '../components';
"""
for scene, chunk in enumerate(chunks, 1):
    body = [header, '\nexport default makeScene2D(function* (view) {', '  view.add(<Node>{bg()}</Node>);', '  const caption = createRef<Caption>();', '  view.add(<Caption ref={caption} />);']
    for num, speech, anim, a, b in shots_re.findall(chunk):
        d = sec(b) - sec(a)
        body.append(f'  caption().set({json.dumps(speech)});')
        body.append(f'  const s{num} = createRef<ShotVisual>();')
        body.append(f'  view.add(<ShotVisual ref={{s{num}}} scene={{{scene}}} shot="{num}" opacity={{0}} scale={{0.92}} />);')
        body.append(f'  yield* all(s{num}().opacity(1, 0.35), s{num}().scale(1.06, {d * 0.72}, easeInOutCubic), s{num}().position.x({55 if int(num) % 2 else -55}, {d * 0.72}, easeInOutCubic), s{num}().rotation({2 if int(num) % 2 else -2}, {d * 0.72}, easeInOutCubic));')
        body.append(f'  yield* all(s{num}().opacity(0, {d * 0.28}), s{num}().position.y(-90, {d * 0.28}, easeInOutCubic));')
        body.append(f'  s{num}().remove();')
    body.append('});')
    (out / f'{files[scene-1]}.tsx').write_text('\n'.join(body))
    print(f'wrote scene {scene:02d}')
