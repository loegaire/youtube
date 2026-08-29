import {closeSync, existsSync, mkdirSync, openSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const manifest = 'audio/narration-segments-expanded.json';
const clips = 'audio/chatterbox-clips-safe';
const entries = JSON.parse(readFileSync(manifest, 'utf8'));
const python = '/home/thinh/proj/youtube/fmstr2/.chatterbox-venv/bin/python';
const generator = '/home/thinh/proj/youtube/bof1/scripts/generate-chatterbox.py';
const reference = 'audio/reference/voice-reference.wav';
const logs = 'audio/narration-logs';
// The generator itself refuses to start below 3 GiB.  A 4 GiB preflight keeps
// a safety margin while allowing the model to continue after normal OS cache
// pressure; each clip is a fresh process so its model memory is released.
const minAvailableGiB = 4.0;

mkdirSync(logs, {recursive: true});

function availableGiB() {
  const line = readFileSync('/proc/meminfo', 'utf8').split('\n').find(row => row.startsWith('MemAvailable:'));
  return Number(line.match(/\d+/)[0]) / 1024 / 1024;
}

for (let index = 0; index < entries.length; index += 1) {
  const entry = entries[index];
  if (existsSync(`${clips}/${entry.id}.wav`)) {
    console.log(`${entry.id}: already accepted`);
    continue;
  }
  const available = availableGiB();
  if (available < minAvailableGiB) {
    throw new Error(`Refusing ${entry.id}: ${available.toFixed(2)} GiB available; need ${minAvailableGiB} GiB.`);
  }
  console.log(`\n[${index + 1}/${entries.length}] ${entry.id} — ${entry.duration}s target; ${available.toFixed(2)} GiB available`);
  const log = openSync(`${logs}/${entry.id}.log`, 'w');
  const result = spawnSync(python, [generator, '--ids', entry.id, '--manifest', manifest, '--reference', reference, '--output', clips, '--seed-offset', String(40 + index)], {
    // Chatterbox uses a dense tqdm stream.  Capture it per clip so the
    // long-running production job stays observable without losing the runner
    // to terminal-output backpressure.
    stdio: ['ignore', log, log],
    env: {
      ...process.env,
      HF_HOME: '/home/thinh/proj/youtube/fmstr2/.chatterbox-models',
      HF_HUB_OFFLINE: '1',
      NUMBA_CACHE_DIR: '/tmp/ret2libc-numba-cache',
    },
  });
  closeSync(log);
  if (result.status !== 0) {
    console.error(`${entry.id}: generation failed; inspect ${logs}/${entry.id}.log`);
    process.exit(result.status ?? 1);
  }
  console.log(`${entry.id}: complete`);
}
