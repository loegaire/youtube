import {
  Canvas,
  DOMMatrix,
  DOMPoint,
  DOMRect,
  Image,
  ImageData,
  Path2D,
  createCanvas,
} from '/usr/local/lib/node_modules/n8n/node_modules/@napi-rs/canvas/index.js';
import {writeFileSync} from 'node:fs';

const makeElement = (name) => ({
  nodeName: name.toUpperCase(),
  style: {},
  dataset: {},
  children: [],
  classList: {add() {}, remove() {}},
  append(...children) { this.children.push(...children); },
  appendChild(child) { this.children.push(child); return child; },
  prepend(...children) { this.children.unshift(...children); },
  remove() {},
  setAttribute() {},
  addEventListener() {},
  removeEventListener() {},
  attachShadow() {
    this.shadowRoot = makeElement('shadow-root');
    return this.shadowRoot;
  },
  querySelector() { return null; },
});
globalThis.Canvas = Canvas;
globalThis.HTMLCanvasElement = Canvas;
globalThis.DOMMatrix = DOMMatrix;
globalThis.DOMPoint = DOMPoint;
globalThis.DOMRect = DOMRect;
globalThis.Image = Image;
globalThis.ImageData = ImageData;
globalThis.Path2D = Path2D;
globalThis.window = globalThis;
Object.defineProperty(globalThis, 'navigator', {
  value: {userAgent: 'node'},
  configurable: true,
});
globalThis.location = {origin: 'file://', hostname: 'localhost', toString: () => 'file:///'};
globalThis.window.location = globalThis.location;
globalThis.document = {
  body: makeElement('body'),
  fonts: {ready: Promise.resolve(), add() {}},
  createElement(name) {
    if (name === 'canvas') return createCanvas(1, 1);
    if (name === 'img') return new Image();
    return makeElement(name);
  },
  createElementNS(_namespace, name) { return makeElement(name); },
  createTextNode(text) { return {textContent: text}; },
  createRange() { return {selectNodeContents() {}, getBoundingClientRect: () => new DOMRect()}; },
  querySelector() { return null; },
};
globalThis.requestAnimationFrame = (callback) => setImmediate(() => callback(performance.now()));
globalThis.cancelAnimationFrame = (id) => clearImmediate(id);
globalThis.getComputedStyle = () => ({fontSize: '16px'});
globalThis.AudioContext = class {
  decodeAudioData() { return Promise.reject(new Error('Audio is disabled for video-only rendering.')); }
};
globalThis.Audio = class {
  currentTime = 0;
  duration = 0;
  muted = true;
  volume = 1;
  paused = true;
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
};

const {Player, Stage, Vector2, project} = await import('../.cache/node-motion-entry.mjs');
project.audio = null;
const player = new Player(project, {
  size: new Vector2(1920, 1080),
  resolutionScale: 1,
  fps: 60,
});
const stage = new Stage();
stage.configure({size: new Vector2(1920, 1080), resolutionScale: 1, colorSpace: 'srgb'});
let renderCount = 0;
player.onRender.subscribe(async () => {
  await stage.render(player.playback.currentScene, player.playback.previousScene);
  renderCount++;
});
for (let attempt = 0; attempt < 2000 && player.duration.current === 0; attempt++) {
  await new Promise((resolve) => setTimeout(resolve, 5));
}
if (!player.duration.current) throw new Error('duration was not calculated');
const target = 60;
const beforeRender = renderCount;
player.requestSeek(target);
player.requestRender();
for (
  let attempt = 0;
  attempt < 2000 && (player.frame.current !== target || renderCount === beforeRender);
  attempt++
) {
  await new Promise((resolve) => setTimeout(resolve, 5));
}
writeFileSync('output/test-node.png', stage.finalBuffer.toBuffer('image/png'));
player.deactivate();
console.log({duration: player.duration.current, fps: player.playback.fps});
