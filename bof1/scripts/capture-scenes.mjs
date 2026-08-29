import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';

const port = Number(process.argv[2] ?? 9223);
const output = process.argv[3] ?? '/tmp/bof1-scenes';
const expectedUrl = process.argv[4] ?? 'file:///home/thinh/proj/youtube/bof1/dist/index.html';
const timestamps = (process.argv[5] ?? '10,43,98,152,203,263,330,400,461,520,568')
  .split(',')
  .map(Number);
const duration = 588;

const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => (
  candidate.type === 'page' && candidate.url.startsWith(expectedUrl)
));
if (!target) throw new Error(`Editor page not found at ${expectedUrl}`);

const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Page} = client;
await Promise.all([Runtime.enable(), Page.enable()]);
await new Promise(resolve => setTimeout(resolve, 5000));
await mkdir(output, {recursive: true});

const canvasInfo = await Runtime.evaluate({
  expression: `JSON.stringify([
    ...document.querySelectorAll('canvas'),
    ...([...document.querySelectorAll('motion-canvas-player')].flatMap(player => [...player.shadowRoot.querySelectorAll('canvas')]))
  ].map((canvas, index) => ({
    index,
    width: canvas.width,
    height: canvas.height,
    rect: canvas.getBoundingClientRect().toJSON(),
  })))`,
  returnByValue: true,
});
console.log(canvasInfo.result.value);

for (let index = 0; index < timestamps.length; index++) {
  const seconds = timestamps[index];
  const fraction = seconds / duration;
  // The standalone player's preview rate comes from project.meta (60 FPS).
  const targetFrame = Math.round(seconds * 60);
  await Runtime.evaluate({
    expression: `(() => {
      const standalone = document.querySelector('motion-canvas-player');
      if (standalone?.player) {
        standalone.player.requestSeek(${targetFrame});
        return;
      }
      const timeline = document.querySelector('[class*="_timelineWrapper_"]');
      if (!timeline) throw new Error('Timeline not found');
      timeline.scrollLeft = ${fraction} * timeline.clientWidth;
      const rect = timeline.getBoundingClientRect();
      const options = {
        bubbles: true,
        button: 0,
        buttons: 1,
        pointerId: 17,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      };
      timeline.dispatchEvent(new PointerEvent('pointerdown', options));
      timeline.dispatchEvent(new PointerEvent('pointerup', {...options, buttons: 0}));
    })()`,
    awaitPromise: true,
  });
  for (let attempt = 0; attempt < 120; attempt++) {
    const state = await Runtime.evaluate({
      expression: `(() => {
        const standalone = document.querySelector('motion-canvas-player');
        return standalone?.player?.onFrameChanged?.current ?? null;
      })()`,
      returnByValue: true,
    });
    if (Math.abs((state.result.value ?? -1) - targetFrame) <= 1) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  // The frame dispatcher updates before the Stage finishes compositing.
  await new Promise(resolve => setTimeout(resolve, 2500));

  const frame = await Runtime.evaluate({
    expression: `(() => {
      const standalone = document.querySelector('motion-canvas-player');
      const canvases = standalone
        ? [...standalone.shadowRoot.querySelectorAll('canvas')]
        : [...document.querySelectorAll('canvas')];
      const canvas = canvases.find(item => item.width === 1920 && item.height === 1080)
        ?? canvases.sort((a, b) => b.width * b.height - a.width * a.height)[0];
      return canvas.toDataURL('image/png');
    })()`,
    returnByValue: true,
  });
  const data = frame.result.value.replace(/^data:image\/png;base64,/, '');
  const filename = `${String(index).padStart(2, '0')}-${seconds}s.png`;
  await writeFile(`${output}/${filename}`, Buffer.from(data, 'base64'));
  console.log(filename);
}

await client.close();
