import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';

const port = Number(process.argv[2] ?? 9222);
const output = process.argv[3] ?? 'review/frames';
const expectedUrl = process.argv[4] ?? 'file:///home/thinh/proj/youtube/heap_over_under_flow/dist/index.html';
const fps = 24;
const duration = 1425;
const timestamps = (process.argv[5] ?? '0,17,55,188,365,618,810,1030,1205,1398,1424')
  .split(',').map(Number);

const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => candidate.type === 'page' && candidate.url.startsWith(expectedUrl));
if (!target) throw new Error(`No Motion Canvas page beginning ${expectedUrl}`);

const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Page, Log} = client;
const problems = [];
Runtime.exceptionThrown(event => {
  const details = event.exceptionDetails;
  problems.push({
    text: details?.text ?? 'runtime exception',
    description: details?.exception?.description ?? details?.exception?.value ?? null,
    stack: details?.stackTrace?.callFrames?.slice(0, 5).map(frame => `${frame.functionName || '<anonymous>'} (${frame.url}:${frame.lineNumber + 1}:${frame.columnNumber + 1})`) ?? [],
  });
});
Runtime.consoleAPICalled(event => { if (event.type === 'error') problems.push(event.args.map(arg => arg.value ?? arg.description).join(' ')); });
Log.entryAdded(({entry}) => { if (entry.level === 'error') problems.push(entry.text); });
await Promise.all([Runtime.enable(), Page.enable(), Log.enable()]);
await Page.reload({ignoreCache: true});
await new Promise(resolve => setTimeout(resolve, 7000));
await mkdir(output, {recursive: true});
const diagnostic = await Runtime.evaluate({
  expression: `JSON.stringify((() => { const player = document.querySelector('motion-canvas-player'); return {url: location.href, body: document.body.innerText.slice(0, 700), player: Boolean(player), shadow: player?.shadowRoot?.innerHTML?.slice(0, 1000), canvases: document.querySelectorAll('canvas').length, shadowCanvases: player?.shadowRoot?.querySelectorAll('canvas').length}; })())`,
  returnByValue: true,
});
console.log(diagnostic.result.value);

for (const seconds of timestamps) {
  const targetFrame = Math.min(Math.round(seconds * fps), Math.round(duration * fps));
  await Runtime.evaluate({
    expression: `(() => {
      const standalone = document.querySelector('motion-canvas-player');
      if (standalone?.player) {
        standalone.player.requestSeek(${targetFrame});
        return;
      }
      const timeline = document.querySelector('[class*="_timelineWrapper_"]');
      if (!timeline) throw new Error('Motion Canvas timeline unavailable');
      timeline.scrollLeft = ${(seconds / duration).toFixed(8)} * timeline.clientWidth;
      const rect = timeline.getBoundingClientRect();
      const options = {bubbles: true, button: 0, buttons: 1, pointerId: 17, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2};
      timeline.dispatchEvent(new PointerEvent('pointerdown', options));
      timeline.dispatchEvent(new PointerEvent('pointerup', {...options, buttons: 0}));
    })()`,
    awaitPromise: true,
  });
  for (let attempt = 0; attempt < 40; attempt++) {
    const state = await Runtime.evaluate({
      expression: `(() => document.querySelector('motion-canvas-player')?.player?.onFrameChanged?.current ?? null)()`,
      returnByValue: true,
    });
    if (state.result.value === null || Math.abs(state.result.value - targetFrame) <= 1) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  await new Promise(resolve => setTimeout(resolve, 900));
  const canvas = await Runtime.evaluate({
    expression: `(() => {
      const standalone = document.querySelector('motion-canvas-player');
      const items = standalone?.shadowRoot ? [...standalone.shadowRoot.querySelectorAll('canvas')] : [...document.querySelectorAll('canvas')];
      const canvas = items.find(item => item.width === 1920 && item.height === 1080) ?? items.sort((a, b) => b.width * b.height - a.width * a.height)[0];
      if (!canvas) throw new Error('No canvas found');
      return canvas.toDataURL('image/png');
    })()`,
    returnByValue: true,
  });
  if (!canvas.result.value) {
    throw new Error(canvas.exceptionDetails?.exception?.description ?? canvas.exceptionDetails?.text ?? 'Canvas data URL unavailable');
  }
  const data = canvas.result.value.replace(/^data:image\/png;base64,/, '');
  const name = `${String(seconds).padStart(4, '0')}s.png`;
  await writeFile(`${output}/${name}`, Buffer.from(data, 'base64'));
  console.log(name);
}

await writeFile(`${output}/runtime-problems.json`, `${JSON.stringify(problems, null, 2)}\n`);
console.log(JSON.stringify({problems}, null, 2));
await client.close();
