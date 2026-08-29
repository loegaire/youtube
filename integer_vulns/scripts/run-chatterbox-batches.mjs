import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const manifest = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
for (const entry of manifest) {
  const result = spawnSync('node', ['scripts/run-chatterbox-bounded.mjs', '--ids', entry.id], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
