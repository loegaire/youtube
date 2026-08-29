import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';

const port = 9227;
const expectedUrl = 'http://127.0.0.1:5173/';
const frames = [
  ['00-hook', 10], ['01-evidence', 50], ['02-source', 125], ['03-odometer', 190],
  ['04-wheel', 270], ['05-trigger', 360], ['06-dominoes', 445], ['07-mismatch', 520],
  ['08-signedness', 590], ['09-addition', 650], ['10-underflow', 720], ['11-truncation', 790],
  ['12-bounds', 870], ['13-conversion', 960], ['14-allocation', 1060], ['15-heap', 1160],
  ['16-index', 1240], ['17-pointer', 1315], ['18-architecture', 1400], ['19-disasm', 1495],
  ['20-fix', 1600], ['21-checklist', 1695], ['22-outro', 1755],
];

const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => candidate.type === 'page' && candidate.url.startsWith(expectedUrl));
if (!target) throw new Error(`No preview page for ${expectedUrl}`);

const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Page} = client;
await Promise.all([Runtime.enable(), Page.enable()]);
await mkdir('review/master-keyframes', {recursive: true});

for (const [name, seconds] of frames) {
  await Runtime.evaluate({
    expression: `(() => document.querySelector('motion-canvas-player')?.player?.requestSeek(Math.round(${seconds} * 24)))()`,
    awaitPromise: true,
  });
  await new Promise(resolve => setTimeout(resolve, 2400));
  const dimensions = await Runtime.evaluate({
    expression: `(() => {
      const player = document.querySelector('motion-canvas-player');
      const canvases = player ? [...player.shadowRoot.querySelectorAll('canvas')] : [];
      const canvas = canvases.find(item => item.width === 1920 && item.height === 1080)
        ?? canvases.sort((a, b) => b.width * b.height - a.width * a.height)[0];
      if (!canvas) throw new Error('1080p canvas not found');
      const rect = canvas.getBoundingClientRect();
      return JSON.stringify({x: rect.x, y: rect.y, width: rect.width, height: rect.height});
    })()`,
    returnByValue: true,
  });
  const rect = JSON.parse(dimensions.result.value);
  const shot = await Page.captureScreenshot({format: 'png', clip: {...rect, scale: 1920 / rect.width}, captureBeyondViewport: false});
  await writeFile(`review/master-keyframes/${name}.png`, Buffer.from(shot.data, 'base64'));
  console.log(`${name} ${seconds}s`);
}

await client.close();
