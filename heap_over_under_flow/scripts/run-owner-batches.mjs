import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'));
const clips = path.join(root, 'audio', 'chatterbox-clips');
const pending = manifest.filter(({id}) => !existsSync(path.join(clips, `${id}.wav`))).map(({id}) => id);
const python = '/home/thinh/proj/youtube/fmstr2/.chatterbox-venv/bin/python';
const wrapper = path.join(root, 'scripts', 'chatterbox-wrapper.py');
const reference = path.join(root, 'audio', 'reference', 'voice-reference.wav');

for (let index = 0; index < pending.length; index += 2) {
  const ids = pending.slice(index, index + 2);
  const result = spawnSync(python, [
    wrapper, '--ids', ids.join(','), '--manifest', path.join(root, 'audio', 'narration-segments.json'),
    '--reference', reference, '--output', clips,
  ], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      HF_HOME: '/home/thinh/proj/youtube/fmstr2/.chatterbox-models',
      OMP_NUM_THREADS: '2',
      MKL_NUM_THREADS: '2',
      TOKENIZERS_PARALLELISM: 'false',
    },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('All remaining local owner-voice clips were generated.');
