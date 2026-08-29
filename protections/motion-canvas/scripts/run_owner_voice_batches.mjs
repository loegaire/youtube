#!/usr/bin/env node
/* Generate the owner-cloned narration in bounded CPU batches, then gate each
 * batch locally with Whisper before moving on.  This deliberately has no TTS
 * fallback: a missing owner clip is a release failure. */
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(path.join(root, 'audio/narration-segments.json'), 'utf8'));
const clips = path.join(root, 'audio/owner-clips');
const qa = path.join(root, 'audio/qa');
const python = '/home/thinh/proj/youtube/fmstr2/.chatterbox-venv/bin/python';
mkdirSync(qa, {recursive: true});

const missing = manifest.filter(row => !existsSync(path.join(clips, `${row.id}-speech.wav`)));
console.log(`Owner clone: ${manifest.length - missing.length}/${manifest.length} clips already present; ${missing.length} to synthesize.`);
for (let index = 0; index < missing.length; index += 3) {
  const batch = missing.slice(index, index + 3);
  const ids = batch.map(row => row.id).join(',');
  console.log(`\n[owner batch ${index / 3 + 1}/${Math.ceil(missing.length / 3)}] ${ids}`);
  const generated = spawnSync(python, ['scripts/generate_owner_voice.py', '--ids', ids], {cwd: root, stdio: 'inherit'});
  if (generated.status !== 0) process.exit(generated.status ?? 1);
  const batchFile = path.join(clips, `batch-${batch.map(row => row.id).join('-')}.json`);
  const report = path.join(qa, `asr-${batch[0].id}-${batch.at(-1).id}.json`);
  const checked = spawnSync('python3', ['scripts/verify_batch_asr.py', batchFile, '--clips', clips, '--report', report, '--max-wer', '0.30'], {cwd: root, stdio: 'inherit'});
  if (checked.status !== 0) {
    console.error(`ASR gate failed for ${ids}; keeping outputs for review and stopping.`);
    process.exit(checked.status ?? 1);
  }
}
console.log('\nAll owner-cloned narration clips passed their per-batch local ASR gate.');
