import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'));
const python = path.join(root, '.chatterbox-venv', 'bin', 'python');
const generator = path.join(root, 'scripts', 'generate-chatterbox.py');
const verifier = path.join(root, 'scripts', 'verify-batch-asr.py');
const clips = path.join(root, 'audio', 'chatterbox-clips');
const qa = path.join(root, 'audio', 'qa');
mkdirSync(qa, {recursive: true});

const pending = manifest
  .filter(entry => !existsSync(path.join(clips, `${entry.id}.wav`)))
  .map(entry => entry.id);

for (let offset = 0; offset < pending.length; offset += 3) {
  const ids = pending.slice(offset, offset + 3);
  const generation = spawnSync(python, [generator, '--ids', ids.join(',')], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      HF_HOME: path.join(root, '.chatterbox-models'),
      OMP_NUM_THREADS: '2',
      MKL_NUM_THREADS: '2',
      NUMBA_CACHE_DIR: '/tmp/rop-numba-cache',
      TOKENIZERS_PARALLELISM: 'false',
    },
  });
  if (generation.status !== 0) process.exit(generation.status ?? 1);

  const batchName = `batch-${ids.join('-')}`;
  const batchManifest = path.join(clips, `${batchName}.json`);
  const verification = spawnSync(python, [
    verifier,
    batchManifest,
    '--clips', clips,
    '--max-wer', '0.30',
    '--report', path.join(qa, `${batchName}-asr.json`),
  ], {
    cwd: root,
    stdio: 'inherit',
  });
  if (verification.status !== 0) process.exit(verification.status ?? 1);
}

console.log('Every pending owner-voice batch passed local Whisper ASR.');
