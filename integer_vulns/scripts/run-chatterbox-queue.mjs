import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, 'audio/narration-segments.json'), 'utf8'));
const runner = path.join(root, 'scripts/run-chatterbox-bounded.mjs');
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function availableGiB() {
  const meminfo = readFileSync('/proc/meminfo', 'utf8');
  const availableKiB = Number(meminfo.match(/^MemAvailable:\s+(\d+)/m)?.[1] ?? 0);
  return availableKiB / 1024 / 1024;
}

function activeServices() {
  const result = spawnSync('systemctl', ['--user', '--no-pager', '--plain', 'list-units', 'chatterbox-*.service', '--state=active', '--no-legend'], {encoding: 'utf8'});
  return result.stdout
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('chatterbox-queue.service'))
    .join('\n');
}

async function waitForIdleHost() {
  while (activeServices()) await sleep(5_000);
  while (availableGiB() < 4.0) await sleep(15_000);
}

async function waitForClip(id) {
  const unit = `chatterbox-${id}.service`;
  const clip = path.join(root, 'audio/chatterbox-clips', `${id}.wav`);
  const log = path.join(root, 'audio/chatterbox-logs', `${id}.log`);
  while (true) {
    if (existsSync(clip)) return;
    const state = spawnSync('systemctl', ['--user', 'is-active', unit], {encoding: 'utf8'}).stdout.trim();
    if (state === 'active' && availableGiB() < 1.0) {
      console.log(`${id}: stopping at ${availableGiB().toFixed(2)} GiB host headroom`);
      spawnSync('systemctl', ['--user', 'stop', unit], {stdio: 'inherit'});
      await waitForIdleHost();
      console.log(`${id}: retrying after host memory recovery`);
      const restart = spawnSync('node', [runner, '--ids', id], {cwd: root, stdio: 'inherit'});
      if (restart.status !== 0) process.exit(restart.status ?? 1);
      continue;
    }
    if (state !== 'active') {
      const detail = existsSync(log) ? readFileSync(log, 'utf8').slice(-1500) : 'no worker log';
      throw new Error(`${id} stopped before writing audio.\n${detail}`);
    }
    await sleep(10_000);
  }
}

for (const entry of manifest) {
  const clip = path.join(root, 'audio/chatterbox-clips', `${entry.id}.wav`);
  if (existsSync(clip)) {
    console.log(`${entry.id}: existing clip`);
    continue;
  }
  await waitForIdleHost();
  console.log(`${entry.id}: starting capped owner-voice generation`);
  const start = spawnSync('node', [runner, '--ids', entry.id], {cwd: root, stdio: 'inherit'});
  if (start.status !== 0) process.exit(start.status ?? 1);
  await waitForClip(entry.id);
  console.log(`${entry.id}: complete`);
}

console.log('All Chatterbox dialog clips are ready.');
