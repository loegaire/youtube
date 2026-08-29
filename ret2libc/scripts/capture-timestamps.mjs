import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.argv[2] ?? 9335);
const output = path.resolve(process.argv[3] ?? 'review/native-audit');
const expectedUrl = process.argv[4] ?? 'http://127.0.0.1:9011/';
const fps = Number(process.argv[5] ?? 24);
const timestamps = (process.argv[6] ?? '4,40,92,156,250,430,610,770,920,1010,1105,1150')
  .split(',')
  .map(value => Number(value.trim()))
  .filter(Number.isFinite);

const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => (
  candidate.type === 'page' && candidate.url.startsWith(expectedUrl)
));
if (!target) throw new Error(`Preview page not found at ${expectedUrl}`);

const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Page} = client;
await Promise.all([Runtime.enable(), Page.enable()]);
await mkdir(output, {recursive: true});

let ready = null;
for (let attempt = 0; attempt < 120; attempt++) {
  const check = await Runtime.evaluate({
    expression: `(() => {
      const player = document.querySelector('motion-canvas-player');
      return {
        player: Boolean(player?.player),
        duration: player?.player?.onDurationChanged?.current ?? 0,
        canvas: Boolean(player?.shadowRoot?.querySelector('canvas')),
      };
    })()`,
    returnByValue: true,
  });
  ready = check.result.value;
  if (ready?.player && ready.duration > 0 && ready.canvas) break;
  await new Promise(resolve => setTimeout(resolve, 100));
}
if (!ready?.player || !ready.canvas) {
  throw new Error(`Motion Canvas player did not become ready: ${JSON.stringify(ready)}`);
}

await Runtime.evaluate({
  expression: `(() => {
    const player = document.querySelector('motion-canvas-player');
    player.style.width = '1920px';
    player.style.height = '1080px';
    document.body.style.width = '1920px';
    document.body.style.height = '1080px';
    player.shadowRoot.querySelector('.overlay')?.remove();
  })()`,
});

const manifest = [];
for (const time of timestamps) {
  const targetFrame = Math.round(time * fps);
  await Runtime.evaluate({
    expression: `document.querySelector('motion-canvas-player').player.requestSeek(${targetFrame})`,
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    const current = await Runtime.evaluate({
      expression: `document.querySelector('motion-canvas-player').player.onFrameChanged.current`,
      returnByValue: true,
    });
    if (Math.abs(current.result.value - targetFrame) <= 1) break;
    await new Promise(resolve => setTimeout(resolve, 60));
  }
  await new Promise(resolve => setTimeout(resolve, 140));
  const frame = await Runtime.evaluate({
    expression: `(() => {
      const canvas = [...document.querySelector('motion-canvas-player').shadowRoot.querySelectorAll('canvas')]
        .find(item => item.width === 1920 && item.height === 1080);
      if (!canvas) throw new Error('Delivery canvas missing');
      return canvas.toDataURL('image/png');
    })()`,
    returnByValue: true,
  });
  if (frame.exceptionDetails || !frame.result.value) {
    throw new Error(frame.exceptionDetails?.exception?.description ?? `No frame at ${time}s`);
  }
  const filename = `${time.toFixed(2).replace('.', '_')}s.png`;
  await writeFile(
    path.join(output, filename),
    Buffer.from(frame.result.value.replace(/^data:image\/png;base64,/, ''), 'base64'),
  );
  manifest.push({time, targetFrame, filename});
  console.log(filename);
}

await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify({fps, samples: manifest}, null, 2)}\n`);
await client.close();
