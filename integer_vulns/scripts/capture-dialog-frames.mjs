import CDP from 'chrome-remote-interface';
import {mkdir, writeFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';

const port = 9227;
const expectedUrl = 'http://127.0.0.1:5173/';
const manifest = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
const originalDurations = [28, 57, 80, 70, 85, 95, 75, 70, 60, 65, 70, 75, 85, 95, 110, 85, 75, 75, 90, 105, 110, 70, 55];

function splitForFrames(text, maxWords = 18) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(value => value.trim()).filter(Boolean) ?? [text];
  const chunks = [];
  let current = [];
  for (const sentence of sentences) {
    for (const word of sentence.split(/\s+/)) {
      current.push(word);
      if (current.length === maxWords) {
        chunks.push(current.join(' '));
        current = [];
      }
    }
  }
  if (current.length) chunks.push(current.join(' '));
  return chunks;
}

const starts = originalDurations.reduce((all, duration) => [...all, (all.at(-1) ?? 0) + duration], [0]).slice(0, -1);
const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => candidate.type === 'page' && candidate.url.startsWith(expectedUrl));
if (!target) throw new Error(`No preview page for ${expectedUrl}`);

const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Page} = client;
await Promise.all([Runtime.enable(), Page.enable()]);
await mkdir('review/dialog-frames', {recursive: true});
const framePlan = [];

for (const [sceneIndex, entry] of manifest.entries()) {
  const chunks = splitForFrames(entry.text);
  const counts = chunks.map(chunk => chunk.split(/\s+/).length);
  const total = counts.reduce((sum, count) => sum + count, 0);
  let consumed = 0;
  for (const [chunkIndex, chunk] of chunks.entries()) {
    const middle = (consumed + counts[chunkIndex] / 2) / total;
    // Capture the corresponding motion state from the original authored scene.
    const seconds = starts[sceneIndex] + originalDurations[sceneIndex] * middle;
    const file = `${entry.id}-${String(chunkIndex).padStart(2, '0')}.png`;
    await Runtime.evaluate({
      expression: `(() => document.querySelector('motion-canvas-player')?.player?.requestSeek(Math.round(${seconds} * 24)))()`,
      awaitPromise: true,
    });
    await new Promise(resolve => setTimeout(resolve, 900));
    const result = await Runtime.evaluate({
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
    const rect = JSON.parse(result.result.value);
    const shot = await Page.captureScreenshot({format: 'png', clip: {...rect, scale: 1920 / rect.width}, captureBeyondViewport: false});
    await writeFile(`review/dialog-frames/${file}`, Buffer.from(shot.data, 'base64'));
    framePlan.push({id: entry.id, file, text: chunk, words: counts[chunkIndex]});
    consumed += counts[chunkIndex];
    console.log(`${entry.id} ${chunkIndex + 1}/${chunks.length}`);
  }
}

await writeFile('review/dialog-frames/plan.json', `${JSON.stringify(framePlan, null, 2)}\n`);
await client.close();
