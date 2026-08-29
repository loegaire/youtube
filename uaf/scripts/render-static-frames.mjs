import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9337);
const targetId = process.argv[3];
const start = Number(process.argv[4] ?? 0);
const requestedEnd = process.argv[5] === undefined ? undefined : Number(process.argv[5]);
if (!targetId) throw new Error('Pass a Chrome page target id.');

const target = (await CDP.List({port})).find(item => item.id === targetId);
if (!target) throw new Error('Target not found.');
const client = await CDP({port, target});
const {Runtime} = client;
const durationResult = await Runtime.evaluate({
  returnByValue: true,
  expression: 'window.__uafStatic?.player.playback.duration',
});
const duration = Number(durationResult.result.value);
if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Invalid timeline duration: ${duration}`);
const end = Math.min(requestedEnd ?? duration, duration);
if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start) {
  throw new Error(`Invalid render range ${start}..${end}`);
}

const output = resolve('output/project');
mkdirSync(output, {recursive: true});
for (let frame = start; frame < end; frame++) {
  const result = await Runtime.evaluate({
    awaitPromise: true,
    returnByValue: true,
    expression: `(() => {
      const runtime = window.__uafStatic;
      runtime.player.deactivate();
      return runtime.player.playback.seek(${frame})
        .then(() => runtime.stage.render(runtime.player.playback.currentScene, runtime.player.playback.previousScene))
        .then(() => {
          runtime.state.renderedFrame = runtime.player.playback.frame;
          return runtime.stage.finalBuffer.toDataURL('image/png');
        });
    })()`,
  });
  if (result.exceptionDetails || typeof result.result.value !== 'string') {
    throw new Error(`Frame ${frame} failed: ${result.exceptionDetails?.text ?? 'no PNG data'}`);
  }
  const png = Buffer.from(result.result.value.replace(/^data:image\/png;base64,/, ''), 'base64');
  writeFileSync(resolve(output, `${String(frame).padStart(6, '0')}.png`), png);
  if (frame === start || (frame + 1) % 120 === 0 || frame + 1 === end) {
    console.log(JSON.stringify({frame: frame + 1, total: end, bytes: png.length}));
  }
}
await client.close();
