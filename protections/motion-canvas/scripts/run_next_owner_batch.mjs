#!/usr/bin/env node
/**
 * Render exactly the next absent owner-voice section, then prove its
 * spoken content with local ASR.  A fresh full-model process per batch keeps
 * RAM bounded; it never falls back to another voice.
 */
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const manifest = JSON.parse(readFileSync(`${root}audio/narration-segments.json`, 'utf8'));
const pending = manifest
  .map(({id}) => id)
  .filter((id) => !existsSync(`${root}audio/owner-clips/${id}-speech.wav`))
  .slice(0, 1);

if (pending.length === 0) {
  console.log(JSON.stringify({status: 'complete'}));
  process.exit(0);
}

const python = '/home/thinh/proj/youtube/fmstr2/.chatterbox-venv/bin/python';
const label = pending.join('-');
const synth = spawnSync(python, ['scripts/generate_owner_voice.py', '--ids', pending.join(',')], {
  cwd: root,
  stdio: 'inherit',
});
if (synth.status !== 0) process.exit(synth.status ?? 1);

const verify = spawnSync('python3', [
  'scripts/verify_batch_asr.py',
  `audio/owner-clips/batch-${label}.json`,
  '--clips', 'audio/owner-clips',
  '--report', `audio/qa/asr-${label}.json`,
  '--max-wer', '0.30',
], {cwd: root, stdio: 'inherit'});
if (verify.status !== 0) process.exit(verify.status ?? 1);

console.log(JSON.stringify({status: 'accepted', ids: pending}));
