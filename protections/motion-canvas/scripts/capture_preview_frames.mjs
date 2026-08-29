#!/usr/bin/env node
/* Seek the Motion Canvas player deterministically and save a compact visual QA
 * set.  This uses the actual render canvas, never DOM screenshots. */
import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.argv[2] ?? 9223);
const output = path.resolve(process.argv[3] ?? 'review/runtime-frames');
const url = process.argv[4] ?? 'http://127.0.0.1:4173/';
const samples = [
  ['opening', 1.4], ['source', 89], ['stack', 206], ['nx', 255],
  ['canary', 402], ['aslr', 610], ['pie', 811], ['relro', 927], ['closing', 1142],
];
const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => candidate.type === 'page' && candidate.url.startsWith(url));
if (!target) throw new Error(`Motion Canvas preview not found at ${url}`);
const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Page} = client;
await Runtime.enable();
await Page.enable();
await new Promise(resolve => setTimeout(resolve, 1500));
let ready;
for (let attempt = 0; attempt < 160; attempt++) {
  const check = await Runtime.evaluate({expression: `(() => {
    const player = document.querySelector('motion-canvas-player');
    const canvas = player?.shadowRoot?.querySelector('canvas');
    return {
      player: Boolean(player?.player),
      canvas: Boolean(canvas),
      duration: player?.player?.onDurationChanged?.current ?? 0,
      fps: player?.player?.playback?.fps ?? 0,
    };
  })()`, returnByValue: true});
  ready = check.result.value;
  if (ready?.player && ready?.canvas && ready.duration > 0) break;
  await new Promise(resolve => setTimeout(resolve, 150));
}
if (!ready?.player || !ready?.canvas || !ready?.duration) {
  const debug = await Runtime.evaluate({expression: `({
    title: document.title,
    text: document.body?.innerText?.slice(0, 2000),
    html: document.body?.innerHTML?.slice(0, 2000),
    playerCount: document.querySelectorAll('motion-canvas-player').length,
  })`, returnByValue: true});
  throw new Error(`Preview did not become render-ready: ${JSON.stringify({ready, debug: debug.result.value})}`);
}
await mkdir(output, {recursive: true});
const written = [];
for (const [label, time] of samples.filter(([, seconds]) => seconds < ready.duration - .1)) {
  const frame = Math.round(time * ready.fps);
  await Runtime.evaluate({expression: `document.querySelector('motion-canvas-player').player.requestSeek(${frame})`});
  for (let attempt = 0; attempt < 120; attempt++) {
    const current = await Runtime.evaluate({expression: `document.querySelector('motion-canvas-player').player.onFrameChanged.current`, returnByValue: true});
    if (Math.abs((current.result.value ?? -999) - frame) <= 1) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  const capture = await Runtime.evaluate({expression: `(() => {
    const canvas = [...document.querySelector('motion-canvas-player').shadowRoot.querySelectorAll('canvas')]
      .find(item => item.width === 1920 && item.height === 1080);
    if (!canvas) throw new Error('delivery canvas missing');
    return canvas.toDataURL('image/png');
  })()`, returnByValue: true});
  if (capture.exceptionDetails || !capture.result.value) throw new Error(capture.exceptionDetails?.text ?? `capture failed at ${time}`);
  const filename = `${label}-${time.toFixed(1).replace('.', '_')}s.png`;
  await writeFile(path.join(output, filename), Buffer.from(capture.result.value.replace(/^data:image\/png;base64,/, ''), 'base64'));
  written.push({label, time, frame, filename});
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify({duration: ready.duration, samples: written}, null, 2) + '\n');
console.log(JSON.stringify({duration: ready.duration, output, written}, null, 2));
await client.close();
