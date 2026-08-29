import fs from 'fs';
import path from 'path';

const timingPath = '/home/thinh/proj/youtube/protections/motion-canvas/data/timing.json';
const timing = JSON.parse(fs.readFileSync(timingPath, 'utf8'));

// 1. Update scene-data.js
const sceneDataPath = '/home/thinh/proj/youtube/protections/video/assets/scene-data.js';
let sceneData = fs.readFileSync(sceneDataPath, 'utf8');
const match = sceneData.match(/window\.BINARY_DEFENSES_SCENES = (\[.*\]);\n/);
if (match) {
    const scenes = JSON.parse(match[1]);
    for (let i = 0; i < scenes.length; i++) {
      scenes[i].start = timing.clips[i].start;
      scenes[i].end = timing.clips[i].end;
      scenes[i].duration = timing.clips[i].duration;
    }
    fs.writeFileSync(sceneDataPath, `window.BINARY_DEFENSES_SCENES = ${JSON.stringify(scenes)};\n`);
}

// 2. Update index.html data-duration
const indexPath = '/home/thinh/proj/youtube/protections/video/index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/data-duration="1767\.915"/g, `data-duration="${timing.duration}"`);
fs.writeFileSync(indexPath, indexHtml);

// 3. Update make-render-segments.mjs
const renderSegPath = '/home/thinh/proj/youtube/protections/video/scripts/make-render-segments.mjs';
let renderSeg = fs.readFileSync(renderSegPath, 'utf8');
renderSeg = renderSeg.replace(/1767\.915/g, timing.duration.toString());

const partSize = timing.duration / 6;
const parts = [];
for (let i = 0; i < 6; i++) {
  parts.push([i+1, Number((i * partSize).toFixed(3)), Number((i === 5 ? timing.duration : (i+1)*partSize).toFixed(3))]);
}
renderSeg = renderSeg.replace(/const parts = \[\s*\[[\s\S]*?\];\n/, `const parts = ${JSON.stringify(parts, null, 2).replace(/"/g, '')};\n`);
fs.writeFileSync(renderSegPath, renderSeg);

console.log("Timings updated!");
