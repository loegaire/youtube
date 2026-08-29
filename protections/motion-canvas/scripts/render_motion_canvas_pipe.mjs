#!/usr/bin/env node
/**
 * Render Motion Canvas through Playwright's browser pipe.  This keeps the
 * resource-bounded deterministic canvas export available in sandboxes that
 * forbid listening sockets; no HTTP server or remote-debugging port is used.
 */
import {chromium} from '/usr/local/lib/node_modules/n8n/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {once} from 'node:events';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const get = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
};
const fps = Number(get('--fps', '12'));
const startFrame = Number(get('--start', '0'));
const maxFrames = Number(get('--limit', '0'));
const output = path.resolve(get('--output', 'output/segment.mp4'));
const pagePath = path.join(root, 'audit-dist/index.html');
if (!existsSync(pagePath)) throw new Error(`Audit build is missing: ${pagePath}`);
if (!Number.isInteger(fps) || fps < 12 || fps > 60) throw new Error('Use an integer fps from 12 to 60.');
if (!Number.isInteger(startFrame) || startFrame < 0) throw new Error('Use a non-negative --start frame.');

mkdirSync(path.dirname(output), {recursive: true});
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  chromiumSandbox: false,
  args: [
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-sync',
    '--metrics-recording-only',
    '--no-first-run',
  ],
});
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
page.on('console', (message) => {
  if (message.type() === 'error') process.stderr.write(`browser: ${message.text()}\n`);
});
await page.goto(pathToFileURL(pagePath).href, {waitUntil: 'load', timeout: 120_000});
await page.waitForFunction(() => {
  const element = document.querySelector('motion-canvas-player');
  const player = element?.player;
  const canvas = [...(element?.shadowRoot?.querySelectorAll('canvas') ?? [])]
    .find((item) => item.width === 1920 && item.height === 1080);
  return player?.duration?.current > 0 && player?.playback?.fps > 0 && Boolean(canvas);
}, null, {timeout: 120_000});

const info = await page.evaluate(() => {
  const element = document.querySelector('motion-canvas-player');
  const player = element.player;
  const canvas = [...element.shadowRoot.querySelectorAll('canvas')]
    .find((item) => item.width === 1920 && item.height === 1080);
  return {
    durationFrames: player.duration.current,
    playerFps: player.playback.fps,
    canvas: Boolean(canvas),
  };
});
const durationSeconds = info.durationFrames / info.playerFps;
const fullFrames = Math.ceil(durationSeconds * fps);
if (startFrame >= fullFrames) throw new Error(`Start ${startFrame} is outside ${fullFrames} frames.`);
const totalFrames = maxFrames > 0 ? Math.min(maxFrames, fullFrames - startFrame) : fullFrames - startFrame;

const encoder = spawn('nice', [
  '-n', '10', 'ffmpeg', '-y', '-hide_banner', '-loglevel', 'warning', '-stats',
  '-f', 'image2pipe', '-vcodec', 'png', '-framerate', String(fps), '-i', 'pipe:0',
  '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-threads', '2', '-movflags', '+faststart', output,
], {stdio: ['pipe', 'inherit', 'inherit']});
let encodeError;
encoder.on('error', (error) => { encodeError = error; });

for (let index = 0; index < totalFrames; index++) {
  const outputFrame = startFrame + index;
  const sourceFrame = Math.min(
    info.durationFrames - 1,
    Math.round(outputFrame * info.playerFps / fps),
  );
  const dataUrl = await page.evaluate(async (target) => {
    const element = document.querySelector('motion-canvas-player');
    const player = element.player;
    player.requestSeek(target);
    for (let attempt = 0; attempt < 1200; attempt++) {
      if (Math.abs(player.frame.current - target) <= 1) break;
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    if (Math.abs(player.frame.current - target) > 1) {
      throw new Error(`seek timeout at ${target}`);
    }
    const canvas = [...element.shadowRoot.querySelectorAll('canvas')]
      .find((item) => item.width === 1920 && item.height === 1080);
    if (!canvas) throw new Error('delivery canvas missing');
    return canvas.toDataURL('image/png');
  }, sourceFrame);
  const png = Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
  if (!encoder.stdin.write(png)) await once(encoder.stdin, 'drain');
  if (encodeError) throw encodeError;
  if (index === 0 || (index + 1) % (fps * 10) === 0 || index + 1 === totalFrames) {
    console.log(`Motion Canvas pipe export ${index + 1}/${totalFrames}`);
  }
}

encoder.stdin.end();
const [code] = await once(encoder, 'close');
await browser.close();
if (code !== 0) throw new Error(`FFmpeg exited with ${code}`);
console.log(JSON.stringify({
  output,
  fps,
  startFrame,
  frames: totalFrames,
  sourceDuration: durationSeconds,
}, null, 2));
