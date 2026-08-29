import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const source = await readFile(resolve(projectDir, 'index.html'), 'utf8');
const outputDir = resolve(projectDir, 'compositions');
const parts = [
  [
    1,
    0,
    229.266
  ],
  [
    2,
    229.266,
    458.532
  ],
  [
    3,
    458.532,
    687.798
  ],
  [
    4,
    687.798,
    917.063
  ],
  [
    5,
    917.063,
    1146.329
  ],
  [
    6,
    1146.329,
    1375.595
  ]
];

await mkdir(outputDir, {recursive: true});

for (const [number, from, to] of parts) {
  const duration = Number((to - from).toFixed(3));
  const id = `binary-defenses-part-${String(number).padStart(2, '0')}`;
  const segmentPrelude = `<script>window.BINARY_DEFENSES_SEGMENT_START=${from};window.BINARY_DEFENSES_SEGMENT_END=${to};</script>`;
  const output = source
    .replaceAll('src="assets/', 'src="../assets/')
    .replace('data-composition-id="binary-defenses" data-start="0" data-duration="1375.595"', `data-composition-id="${id}" data-start="0" data-duration="${duration}"`)
    .replace('id="film" class="clip" data-start="0" data-duration="1375.595"', `id="film" class="clip" data-start="0" data-duration="${duration}"`)
    .replace('id="owner-narration" src="../assets/audio/binary-defenses-narration.wav" data-start="0" data-duration="1375.595"', `id="owner-narration" src="../assets/audio/binary-defenses-narration.wav" data-start="0" data-duration="${duration}" data-media-start="${from}"`)
    .replace('    <script>\n      window.__timelines', `    ${segmentPrelude}\n    <script>\n      window.__timelines`)
    .replace("      const scenes = window.BINARY_DEFENSES_SCENES;", "      const segmentStart = window.BINARY_DEFENSES_SEGMENT_START || 0;\n      const segmentEnd = window.BINARY_DEFENSES_SEGMENT_END || Infinity;\n      const scenes = window.BINARY_DEFENSES_SCENES\n        .filter(scene => scene.start >= segmentStart && scene.end <= segmentEnd)\n        .map(scene => ({...scene, start: scene.start - segmentStart, end: scene.end - segmentStart}));");
  await writeFile(resolve(outputDir, `part-${String(number).padStart(2, '0')}.html`), output);
}

console.log(`Generated ${parts.length} render segments in ${outputDir}`);
