import '@motion-canvas/player';
// @ts-ignore — Vite produces the project bridge as JavaScript.
import project from '../dist/project.js';

window.__UAF_PROJECT__ = project;
const bridge = new Blob(['export default window.__UAF_PROJECT__;'], {type: 'text/javascript'});
document.querySelector('motion-canvas-player')?.setAttribute('src', URL.createObjectURL(bridge));

declare global { interface Window { __UAF_PROJECT__: typeof project; } }
