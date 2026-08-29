import {Player, Stage, Vector2} from '@motion-canvas/core';
import project from '../dist/project.js';

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
const state = {
  ready: false,
  renderedFrame: -1,
  renderError: '',
  duration: 0,
};

player.onRender.subscribe(async () => {
  try {
    await stage.render(player.playback.currentScene, player.playback.previousScene);
    state.renderedFrame = player.playback.frame;
  } catch (error) {
    state.renderError = String(error);
  }
});

Object.defineProperty(window, '__heapStatic', {
  configurable: true,
  value: {project, player, stage, state},
});

void player.configure(settings).then(() => {
  state.duration = player.onDurationChanged.current;
  state.ready = true;
  player.activate();
  player.requestSeek(0);
});
