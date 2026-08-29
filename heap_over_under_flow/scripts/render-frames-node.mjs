import fs from 'node:fs';
import path from 'node:path';
import {Renderer, Vector2} from '@motion-canvas/core';
import {Logger} from '@motion-canvas/core/lib/app/Logger.js';
import project from '../dist/project.js';
import {existsSync} from 'node:fs';

const outputDir = path.resolve(process.cwd(), 'output/project');
const size = new Vector2(1920, 1080);
const fps = 24;

const canvasModuleCandidates = [
  path.resolve(process.cwd(), 'node_modules/@napi-rs/canvas/index.js'),
  '/usr/local/lib/node_modules/@napi-rs/canvas/index.js',
  '/usr/local/lib/node_modules/n8n/node_modules/@napi-rs/canvas/index.js',
];

const canvasModulePath = canvasModuleCandidates.find((candidate) => existsSync(candidate));
if (!canvasModulePath) {
  throw new Error('Could not locate @napi-rs/canvas/index.js');
}
const canvasModule = await import(canvasModulePath);
const {
  Canvas,
  DOMMatrix,
  DOMPoint,
  DOMRect,
  Image,
  ImageData,
  Path2D,
  createCanvas,
} = canvasModule;

function makeNode(name) {
  const node = {
    nodeName: name?.toUpperCase?.() ?? 'ELEMENT',
    ownerDocument: null,
    style: {
      getPropertyValue: () => '',
      setProperty() {},
      removeProperty() {},
      getPropertyPriority() {
        return '';
      },
    },
    styles: {
      getPropertyValue: () => '',
      setProperty() {},
      removeProperty() {},
      getPropertyPriority() {
        return '';
      },
    },
    dataset: {},
    children: [],
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return false;
      },
    },
    replaceChildren(...children) {
      this.children = [...children];
      return this;
    },
    shadowRoot: null,
    append(...children) {
      this.children.push(...children);
      return this;
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    prepend(...children) {
      this.children.unshift(...children);
      return this;
    },
    removeChild() {},
    before() {},
    after() {},
    replaceWith() {},
    cloneNode() {
      return this;
    },
    closest() {
      return null;
    },
    matches() {
      return false;
    },
    className: '',
    remove() {},
    setAttribute() {},
    getAttribute() {
      return null;
    },
    removeAttribute() {},
    addEventListener() {},
    removeEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementsByTagName() {
      return [];
    },
    hasChildNodes() {
      return this.children.length > 0;
    },
    getBoundingClientRect() {
      return new DOMRect();
    },
    getRootNode() {
      return this.ownerDocument ?? this;
    },
    attachShadow() {
      const shadowRoot = {
        mode: 'open',
        host: node,
        children: [],
        childNodes: [],
        style: {},
        append(...items) {
          this.children.push(...items);
        },
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        prepend(...items) {
          this.children.unshift(...items);
          return this;
        },
        remove() {},
        querySelector() {
          return null;
        },
        querySelectorAll() {
          return [];
        },
        getBoundingClientRect() {
          return new DOMRect();
        },
      };
      node.shadowRoot = shadowRoot;
      return shadowRoot;
    },
  };
  node.ownerDocument = globalThis.document;
  Object.defineProperty(node, 'childNodes', {
    get() {
      return this.children;
    },
    set(children) {
      this.children = [...children];
    },
  });
  if (!node.style.getPropertyValue) {
    node.style.getPropertyValue = () => '';
  }
  if (!node.styles?.getPropertyValue) {
    node.styles = {
      ...node.styles,
      getPropertyValue: () => '',
    };
  }
  return node;
}

globalThis.Canvas = Canvas;
globalThis.HTMLCanvasElement = Canvas;
globalThis.DOMMatrix = DOMMatrix;
globalThis.DOMPoint = DOMPoint;
globalThis.DOMRect = DOMRect;
globalThis.Image = Image;
globalThis.ImageData = ImageData;
globalThis.Path2D = Path2D;

globalThis.window = globalThis;
globalThis.self = globalThis;
globalThis.location = {origin: 'file://', hostname: 'localhost', toString: () => 'file:///'};
globalThis.window.location = globalThis.location;
Object.defineProperty(globalThis, 'navigator', {value: {userAgent: 'node'}, configurable: true});
globalThis.devicePixelRatio = 1;
globalThis.document = {
  body: makeNode('body'),
  documentElement: makeNode('html'),
  head: makeNode('head'),
  fonts: {
    ready: Promise.resolve(),
    add() {},
  },
  createElement(name) {
    if (name === 'canvas') return createCanvas(1, 1);
    if (name === 'img') return new Image();
    return makeNode(name);
  },
  createElementNS(_namespace, name) {
    return makeNode(name);
  },
  createTextNode(text) {
    return {textContent: text};
  },
  createRange() {
    return {selectNodeContents() {}, getBoundingClientRect: () => new DOMRect()};
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
};

Object.defineProperty(globalThis, 'document', {
  value: globalThis.document,
  configurable: true,
  enumerable: true,
  writable: true,
});

globalThis.requestAnimationFrame = (callback) => setImmediate(() => callback(performance.now()));
globalThis.cancelAnimationFrame = (id) => clearImmediate(id);
globalThis.getComputedStyle = () => ({
  fontSize: '16px',
  getPropertyValue: () => '',
});
globalThis.matchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
});
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.MutationObserver = class {
  observe() {}
  disconnect() {}
};
globalThis.AudioContext = class {
  decodeAudioData() {
    return Promise.reject(new Error('Audio disabled for node render path.'));
  }
};
globalThis.Audio = class {
  currentTime = 0;
  duration = 0;
  muted = true;
  volume = 1;
  paused = true;
  play() {
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
};

if (!project.logger) {
  project.logger = new Logger();
}
project.logger.onLogged.subscribe((entry) => {
  if (entry.level === 'error' && !String(entry.message ?? '').includes('replaceChildren') && !String(entry.message ?? '').includes('childNodes') && !String(entry.message ?? '').includes('canvas')) {
    console.error(entry.message);
  }
});

const envStart = Number(process.env.RENDER_START_FRAME);

const frameDir = path.join(outputDir);
fs.mkdirSync(frameDir, {recursive: true});
if (!Number.isFinite(envStart) || envStart <= 0) {
  for (const item of fs.readdirSync(frameDir)) {
    if (item.endsWith('.png')) {
      fs.rmSync(path.join(frameDir, item), {force: true});
    }
  }
}

const renderer = new Renderer(project);
const settings = {
  size,
  resolutionScale: 1,
  fps,
  range: [0, Number.POSITIVE_INFINITY],
  colorSpace: 'srgb',
};

const maxFrames = Number(process.env.RENDER_MAX_FRAMES) || 200000;
let totalFrames = null;
renderer.playback.fps = fps;
renderer.playback.state = 1;

await renderer.playback.recalculate();
if (!Number.isFinite(renderer.playback.duration) || renderer.playback.duration <= 0) {
  throw new Error('Unable to determine playback duration from Motion Canvas playback.');
}
totalFrames = renderer.playback.duration;
console.log(`Playback duration frames=${totalFrames}`);

let previous = -1;
renderer.exporter = {
  start: async () => {},
  async handleFrame(canvas, frame) {
    if (frame === previous) return;
    previous = frame;
    const file = path.join(frameDir, `${String(frame).padStart(6, '0')}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(file, buffer);
    if (frame % 300 === 0) console.log(`wrote frame ${frame}/${totalFrames - 1}`);
  },
  async stop() {},
};

const envEnd = Number(process.env.RENDER_END_FRAME);
const start = Number.isFinite(envStart) ? Math.max(0, Math.trunc(envStart)) : 0;
const end = Number.isFinite(envEnd)
  ? Math.min(totalFrames, maxFrames, Math.max(start + 1, Math.trunc(envEnd)))
  : Math.min(totalFrames, maxFrames);

if (!Number.isInteger(start) || start < 0) {
  throw new Error(`Invalid start frame: ${process.env.RENDER_START_FRAME}`);
}
if (!Number.isInteger(end) || end <= start) {
  throw new Error(`Invalid end frame: ${process.env.RENDER_END_FRAME ?? maxFrames}`);
}

console.log(`Rendering frames ${start}..${end - 1}`);
for (let frame = start; frame < end; frame++) {
  const time = frame / fps;
  if (frame % 100 === 0) {
    console.log(`rendering frame ${frame}`);
  }
  await renderer.renderFrame(settings, time);
}

console.log(`Rendered ${end - start} frames to ${frameDir}`);
