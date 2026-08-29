import {MetaFile, Player, Stage, ValueDispatcher, Vector2, bootstrap} from '@motion-canvas/core';
import scene00 from '../src/scenes/00-receipts';
import scene01 from '../src/scenes/01-provenance';
import scene02 from '../src/scenes/02-switchboard';
import scene03 from '../src/scenes/03-normal-call';
import scene04 from '../src/scenes/04-free';
import scene05 from '../src/scenes/05-reuse';
import scene06 from '../src/scenes/06-byte-loom';
import scene07 from '../src/scenes/07-call-theater';
import scene08 from '../src/scenes/08-clocks';
import scene09 from '../src/scenes/09-fix';

function describe(name: string, description: typeof scene00) {
  description.name = name;
  new MetaFile(name).attach(description.meta);
  description.onReplaced ??= new ValueDispatcher(description.config);
  return description;
}

const project = bootstrap(
  'uaf-static',
  {core: '3.17.2', two: '3.17.2', ui: null, vitePlugin: null},
  [],
  {
    scenes: [
      describe('00-receipts', scene00),
      describe('01-provenance', scene01),
      describe('02-switchboard', scene02),
      describe('03-normal-call', scene03),
      describe('04-free', scene04),
      describe('05-reuse', scene05),
      describe('06-byte-loom', scene06),
      describe('07-call-theater', scene07),
      describe('08-clocks', scene08),
      describe('09-fix', scene09),
    ],
  },
  new MetaFile('project'),
  new MetaFile('settings'),
);

const settings = {
  ...project.meta.getFullRenderingSettings(),
  size: new Vector2(1920, 1080),
  resolutionScale: 1,
  fps: 24,
  colorSpace: 'srgb' as const,
  background: null,
  range: [0, Infinity] as [number, number],
  audioOffset: 0,
};

const stage = new Stage();
stage.configure(settings);
stage.finalBuffer.style.display = 'block';
stage.finalBuffer.style.width = '1920px';
stage.finalBuffer.style.height = '1080px';
document.body.replaceChildren(stage.finalBuffer);

const player = new Player(project);
const state = {ready: false, renderedFrame: -1, renderError: '', duration: 0};
player.onRender.subscribe(async () => {
  try {
    await stage.render(player.playback.currentScene, player.playback.previousScene);
    state.renderedFrame = player.playback.frame;
  } catch (error) {
    state.renderError = String(error);
  }
});

Object.defineProperty(window, '__uafStatic', {configurable: true, value: {project, player, stage, state}});
void player.configure(settings).then(() => {
  state.duration = player.onDurationChanged.current;
  state.ready = true;
  player.activate();
  player.requestSeek(0);
});
