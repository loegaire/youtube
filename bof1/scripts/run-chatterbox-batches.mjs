import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'));
const python = path.join(root, '.chatterbox-venv', 'bin', 'python');
const asrPython = path.join(root, '.asr-venv', 'bin', 'python');
const generator = path.join(root, 'scripts', 'generate-chatterbox.py');
const verifier = path.join(root, 'scripts', 'verify-narration.py');
const clips = path.join(root, 'audio', 'chatterbox-clips');
const qa = path.join(clips, 'qa-batches');
mkdirSync(qa, {recursive: true});
const pending = manifest
  .filter(entry => !existsSync(path.join(clips, `${entry.id}.wav`)))
  .map(entry => entry.id);

for (let offset = 0; offset < pending.length; offset += 3) {
  const ids = pending.slice(offset, offset + 3);
  const result = spawnSync(python, [generator, '--ids', ids.join(',')], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
    env: {
      ...process.env,
      HF_HOME: path.join(root, '.chatterbox-models'),
      OMP_NUM_THREADS: '2',
      MKL_NUM_THREADS: '2',
      TOKENIZERS_PARALLELISM: 'false',
    },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);

  const batchName = `batch-${ids.join('-')}`;
  const batchManifest = path.join(clips, `${batchName}.json`);
  for (const variant of ['raw', 'fitted']) {
    const verification = spawnSync(asrPython, [
      verifier,
      batchManifest,
      '--clips', clips,
      '--variant', variant,
      '--max-wer', '0.30',
      '--report', path.join(qa, `${batchName}-asr-${variant}.json`),
    ], {
      cwd: root,
      encoding: 'utf8',
      stdio: 'inherit',
    });
    if (verification.status !== 0) process.exit(verification.status ?? 1);
  }
}

console.log('Every pending Chatterbox batch passed raw and fitted ASR.');
