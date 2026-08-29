import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const slateDir = resolve(projectDir, 'assets/render-slates');
const source = await readFile(resolve(projectDir, 'assets/scene-data.js'), 'utf8');
const sandbox = {window: {}};
vm.runInNewContext(source, sandbox, {filename: 'scene-data.js'});
const scenes = sandbox.window.BINARY_DEFENSES_SCENES;
const fps = 24;
const totalFrames = 42430;
const lines = [];
let framesWritten = 0;

for (const [index, scene] of scenes.entries()) {
  const frames = index === scenes.length - 1 ? totalFrames - framesWritten : Math.round(scene.duration * fps);
  const sourcePath = resolve(slateDir, `scene-${String(scene.number).padStart(2, '0')}.png`).replace(/'/g, "'\\''");
  for (let frame = 0; frame < frames; frame += 1) {
    lines.push(`file '${sourcePath}'`, `duration ${(1 / fps).toFixed(9)}`);
  }
  framesWritten += frames;
}

await mkdir(slateDir, {recursive: true});
const finalPath = resolve(slateDir, 'scene-53.png').replace(/'/g, "'\\''");
lines.push(`file '${finalPath}'`);
await writeFile(resolve(slateDir, 'frame-list.txt'), `${lines.join('\n')}\n`);
console.log(`Wrote ${framesWritten} 24fps frame entries for ${scenes.length} scenes.`);
