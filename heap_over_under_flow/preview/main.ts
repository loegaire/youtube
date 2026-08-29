import '@motion-canvas/player';
import project from '../dist/project.js';

declare global { interface Window { __HEAP_VIDEO_PROJECT__: typeof project; } }

window.__HEAP_VIDEO_PROJECT__ = project;
const bridge = new Blob(['export default window.__HEAP_VIDEO_PROJECT__;'], {type: 'text/javascript'});
document.querySelector('motion-canvas-player')?.setAttribute('src', URL.createObjectURL(bridge));
