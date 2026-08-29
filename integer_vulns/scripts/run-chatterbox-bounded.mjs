import {mkdirSync, readFileSync} from 'node:fs';
import {spawn, spawnSync} from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const idsIndex = args.indexOf('--ids');
const segmentId = idsIndex >= 0 ? args[idsIndex + 1] : undefined;

if (!segmentId || segmentId.includes(',')) {
  throw new Error('Usage: node scripts/run-chatterbox-bounded.mjs --ids <one-segment-id>');
}

const manifest = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
if (!manifest.some(entry => entry.id === segmentId)) {
  throw new Error(`Unknown segment: ${segmentId}`);
}

function availableGiB() {
  const meminfo = readFileSync('/proc/meminfo', 'utf8');
  const availableKiB = Number(meminfo.match(/^MemAvailable:\s+(\d+)/m)?.[1] ?? 0);
  return availableKiB / 1024 / 1024;
}

// Leave room for the desktop, browser, renderer, and kernel page cache.
if (availableGiB() < 4.0) {
  throw new Error(`Refusing Chatterbox: ${availableGiB().toFixed(2)} GiB host RAM available; need 4.00 GiB.`);
}

const pythonArgs = ['scripts/generate-chatterbox.py', '--ids', segmentId];
if (args.includes('--force')) pythonArgs.push('--force');

const scopeName = `chatterbox-${segmentId}`;
const logDirectory = path.resolve('audio/chatterbox-logs');
mkdirSync(logDirectory, {recursive: true});
const logPath = path.join(logDirectory, `${segmentId}.log`);
const python = path.resolve('.chatterbox-venv/bin/python');
const generator = path.resolve('scripts/generate-chatterbox.py');
const worker = spawn('systemd-run', [
  '--user', '--collect', '--quiet', `--unit=${scopeName}`,
  '-p', 'MemoryHigh=3.3G',
  '-p', 'MemoryMax=3.75G',
  '-p', 'MemorySwapMax=0',
  // Bound CPU as well, but let BLAS use four cores rather than serializing
  // every autoregressive token on one core.
  '-p', 'CPUQuota=400%',
  '-p', 'TasksMax=32',
  '-p', `StandardOutput=append:${logPath}`,
  '-p', `StandardError=append:${logPath}`,
  '--', 'nice', '-n', '10', python, generator, ...pythonArgs.slice(1),
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NUMBA_CACHE_DIR: '/tmp/numba-cache',
    OMP_NUM_THREADS: '1',
    MKL_NUM_THREADS: '1',
    TOKENIZERS_PARALLELISM: 'false',
  },
});

let stoppedForHostHeadroom = false;
const watchdog = setInterval(() => {
  const free = availableGiB();
  if (free >= 1.5 || stoppedForHostHeadroom) return;
  stoppedForHostHeadroom = true;
  console.error(`Stopping ${scopeName}: host availability fell to ${free.toFixed(2)} GiB.`);
  spawnSync('systemctl', ['--user', 'stop', scopeName], {stdio: 'inherit'});
}, 5_000);

worker.on('error', error => {
  clearInterval(watchdog);
  throw error;
});
worker.on('close', code => {
  clearInterval(watchdog);
  process.exit(code ?? 1);
});
