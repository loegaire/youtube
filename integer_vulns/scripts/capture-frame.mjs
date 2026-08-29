import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';

const port = Number(process.argv[2] ?? 9227);
const output = process.argv[3] ?? 'review/frame.png';
const expectedUrl = process.argv[4] ?? 'http://127.0.0.1:9010/';
const seconds = Number(process.argv[5] ?? 10);
const duration = 1785;
const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => candidate.type === 'page' && candidate.url.startsWith(expectedUrl));
if (!target) throw new Error(`No preview page for ${expectedUrl}`);

const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Page} = client;
await Promise.all([Runtime.enable(), Page.enable()]);
await Runtime.evaluate({
  expression: `(() => {
    const standalone = document.querySelector('motion-canvas-player');
    if (standalone?.player) {
      standalone.player.requestSeek(Math.round(${seconds} * 24));
      return;
    }
    const timeline = document.querySelector('[class*="_timelineWrapper_"]');
    if (!timeline) throw new Error('Timeline not found');
    const fraction = ${seconds} / ${duration};
    timeline.scrollLeft = fraction * timeline.scrollWidth;
    const rect = timeline.getBoundingClientRect();
    const x = rect.left + rect.width * fraction;
    timeline.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, button: 0, buttons: 1, pointerId: 31, clientX: x, clientY: rect.top + rect.height / 2}));
    timeline.dispatchEvent(new PointerEvent('pointerup', {bubbles: true, button: 0, buttons: 0, pointerId: 31, clientX: x, clientY: rect.top + rect.height / 2}));
  })()`,
  awaitPromise: true,
});
await new Promise(resolve => setTimeout(resolve, 2200));
const dimensions = await Runtime.evaluate({
  expression: `(() => {
    const standalone = document.querySelector('motion-canvas-player');
    const canvases = standalone
      ? [...standalone.shadowRoot.querySelectorAll('canvas')]
      : [...document.querySelectorAll('canvas')];
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
await mkdir(output.split('/').slice(0, -1).join('/') || '.', {recursive: true});
await writeFile(output, Buffer.from(shot.data, 'base64'));
console.log(JSON.stringify({seconds, rect, output}));
await client.close();
