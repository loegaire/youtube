import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import path from 'node:path';

const port = Number(process.argv[2] ?? 9333);
const output = path.resolve(process.argv[3] ?? 'review/audit-frames');
const expectedUrl = process.argv[4] ?? 'http://127.0.0.1:4173/';
const fps = Number(process.argv[5] ?? 24);
const beats = JSON.parse(readFileSync('data/beats.json', 'utf8'));
const chapters = [...new Set(beats.map(beat => beat.chapter))].map(chapter => {
  const rows = beats.filter(beat => beat.chapter === chapter);
  return {
    chapter,
    start: rows[0].start,
    end: rows.at(-1).end,
  };
});

const samples = [];
for (const [index, chapter] of chapters.entries()) {
  samples.push(
    {label: `${String(index).padStart(2, '0')}-start`, time: chapter.start + 0.7},
    {label: `${String(index).padStart(2, '0')}-mid`, time: (chapter.start + chapter.end) / 2},
    {label: `${String(index).padStart(2, '0')}-end`, time: chapter.end - 0.7},
  );
  if (index < chapters.length - 1) {
    samples.push(
      {label: `${String(index).padStart(2, '0')}-seam-before`, time: chapter.end - 0.12},
      {label: `${String(index).padStart(2, '0')}-seam-after`, time: chapter.end + 0.12},
    );
  }
}

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
      const canvas = player?.shadowRoot?.querySelector('canvas');
      return {
        title: document.title,
        player: Boolean(player?.player),
        canvas: Boolean(canvas),
        duration: player?.player?.onDurationChanged?.current ?? 0,
      };
    })()`,
    returnByValue: true,
  });
  ready = check.result.value;
  if (ready?.title && ready.player && ready.canvas && ready.duration > 0) break;
  await new Promise(resolve => setTimeout(resolve, 250));
}
if (!ready?.player || !ready.canvas || !ready.duration) {
  throw new Error(`Motion Canvas preview did not become ready: ${JSON.stringify(ready)}`);
}

const init = await Runtime.evaluate({
  expression: `(() => {
    const player = document.querySelector('motion-canvas-player');
    if (!player?.player) throw new Error('Motion Canvas player missing');
    player.style.width = '1920px';
    player.style.height = '1080px';
    document.body.style.width = '1920px';
    document.body.style.height = '1080px';
    player.shadowRoot.querySelector('.overlay')?.remove();
    return {
      duration: player.player.onDurationChanged.current,
      canvases: [...player.shadowRoot.querySelectorAll('canvas')].map(c => [c.width, c.height]),
    };
  })()`,
  returnByValue: true,
});
if (init.exceptionDetails) {
  throw new Error(init.exceptionDetails.exception?.description ?? init.exceptionDetails.text);
}
console.log(JSON.stringify(init.result.value));

const manifest = [];
for (const sample of samples) {
  const targetFrame = Math.round(sample.time * fps);
  await Runtime.evaluate({
    expression: `document.querySelector('motion-canvas-player').player.requestSeek(${targetFrame})`,
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    const current = await Runtime.evaluate({
      expression: `document.querySelector('motion-canvas-player').player.onFrameChanged.current`,
      returnByValue: true,
    });
    if (Math.abs(current.result.value - targetFrame) <= 1) break;
    await new Promise(resolve => setTimeout(resolve, 80));
  }
  await new Promise(resolve => setTimeout(resolve, 160));
  const frame = await Runtime.evaluate({
    expression: `(() => {
      const canvases = [...document.querySelector('motion-canvas-player').shadowRoot.querySelectorAll('canvas')];
      const canvas = canvases.find(item => item.width === 1920 && item.height === 1080);
      if (!canvas) throw new Error('Delivery canvas missing');
      return canvas.toDataURL('image/png');
    })()`,
    returnByValue: true,
  });
  if (frame.exceptionDetails || !frame.result.value) {
    throw new Error(
      frame.exceptionDetails?.exception?.description
      ?? frame.exceptionDetails?.text
      ?? `Frame capture returned no data at ${sample.time}s`,
    );
  }
  const filename = `${sample.label}-${sample.time.toFixed(2).replace('.', '_')}s.png`;
  await writeFile(
    path.join(output, filename),
    Buffer.from(frame.result.value.replace(/^data:image\/png;base64,/, ''), 'base64'),
  );
  manifest.push({...sample, targetFrame, filename});
  console.log(filename);
}

await writeFile(
  path.join(output, 'manifest.json'),
  `${JSON.stringify({samples: manifest}, null, 2)}\n`,
);
await client.close();
