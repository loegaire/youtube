import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawn} from 'node:child_process';
import CDP from 'chrome-remote-interface';

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

const port = Number(process.argv[2] ?? 9337);
const start = Number(process.argv[3] ?? 0);
const requestedEnd = process.argv[4] === undefined ? undefined : Number(process.argv[4]);
const outputDir = resolve('output/project');

if (!Number.isFinite(port) || port <= 0) throw new Error(`Invalid port: ${process.argv[2]}`);
if (!Number.isInteger(start) || start < 0) throw new Error(`Invalid start frame: ${process.argv[3]}`);
if (requestedEnd !== undefined && (!Number.isInteger(requestedEnd) || requestedEnd <= start)) {
  throw new Error(`Invalid end frame: ${process.argv[4]}`);
}

const rendererPath = resolve('static-dist/heap-over-underflow-static-renderer.js');
if (!existsSync(rendererPath)) {
  throw new Error(`Renderer bundle not found at ${rendererPath}; run npm run build:static first.`);
}

const chrome = spawn(
  'google-chrome',
  [
    '--headless=new',
    '--remote-debugging-port',
    String(port),
    '--remote-debugging-address=127.0.0.1',
    '--no-sandbox',
    '--disable-gpu',
    '--mute-audio',
    '--user-data-dir=/tmp/heap-over-underflow-render-chrome',
    '--window-size=1920,1080',
    'about:blank',
  ],
  {stdio: 'inherit'},
);

const cleanup = async () => {
  if (!chrome.killed) {
    chrome.kill('SIGTERM');
  }
};

chrome.on('error', (error) => console.error(`Chrome launch error: ${error.message}`));
chrome.on('exit', (code, signal) => console.error(`Chrome exited: code=${code} signal=${signal}`));

try {
  console.log(`Starting headless Chrome on port ${port}...`);
  await sleep(1500);

  let targets = [];
  let lastConnectionError;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      targets = await CDP.List({host: '127.0.0.1', port});
      if (targets.length) break;
    } catch (error) {
      lastConnectionError = error;
    }
    await sleep(250);
  }
  if (!targets.length && lastConnectionError) throw lastConnectionError;
  if (!targets.length) throw new Error('No Chrome pages were exposed yet.');
  const target = targets.find((item) => item.type === 'page' && item.url.startsWith('about:blank'))
    ?? targets.find((item) => item.type === 'page');
  if (!target) throw new Error('No page target available.');

  const client = await CDP({host: '127.0.0.1', port, target});
  const {Runtime} = client;
  await Runtime.enable();

  const bootstrap = readFileSync(rendererPath, 'utf8');
  const loaded = await Runtime.evaluate({
    expression: bootstrap,
    awaitPromise: true,
    returnByValue: true,
  });
  if (loaded.exceptionDetails) throw new Error(loaded.exceptionDetails.text ?? 'Failed to load static renderer bundle.');

  let ready = false;
  for (let attempt = 0; attempt < 180; attempt++) {
    const check = await Runtime.evaluate({
      expression: 'Boolean(window.__heapStatic?.state?.ready)',
      returnByValue: true,
    });
    if (check.result?.value) {
      ready = true;
      break;
    }
    await sleep(250);
  }
  if (!ready) throw new Error('Static renderer did not become ready in time.');

  const durationResult = await Runtime.evaluate({
    expression: 'window.__heapStatic?.player?.playback?.duration',
    returnByValue: true,
  });
  const duration = Number(durationResult.result?.value);
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Invalid playback duration: ${durationResult.result?.value}`);
  }
  const end = requestedEnd ?? Math.floor(duration);
  if (!Number.isInteger(end) || end <= start) throw new Error(`Invalid computed end frame: ${end}`);

  mkdirSync(outputDir, {recursive: true});

  for (let frame = start; frame < end; frame++) {
    const result = await Runtime.evaluate({
      awaitPromise: true,
      returnByValue: true,
      expression: `(() => {
        const runtime = window.__heapStatic;
        if (!runtime) throw new Error('renderer missing');
        runtime.player.deactivate();
        return runtime.player.playback.seek(${frame})
          .then(() => runtime.stage.render(runtime.player.playback.currentScene, runtime.player.playback.previousScene))
          .then(() => runtime.stage.finalBuffer.toDataURL('image/png'));
      })()`,
    });
    if (result.exceptionDetails || typeof result.result?.value !== 'string') {
      throw new Error(`Frame ${frame} failed: ${result.exceptionDetails?.text ?? 'no PNG data returned'}`);
    }
    const value = result.result.value;
    const png = Buffer.from(value.replace(/^data:image\/png;base64,/, ''), 'base64');
    writeFileSync(resolve(outputDir, `${String(frame).padStart(6, '0')}.png`), png);
    if (frame === start || (frame + 1) % 180 === 0 || frame + 1 === end) {
      console.log(JSON.stringify({frame: frame + 1, total: end}));
    }
  }

  console.log(`Rendered ${end - start} frames to ${outputDir}`);
  await client.close();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await cleanup();
}
