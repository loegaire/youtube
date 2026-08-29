import '@motion-canvas/player';
import project from '../dist/project.js';

declare global {
  interface Window { __BINARY_DEFENSES_AUDIT_PROJECT__: typeof project; }
}

window.__BINARY_DEFENSES_AUDIT_PROJECT__ = project;
const bridge = new Blob(['export default window.__BINARY_DEFENSES_AUDIT_PROJECT__;'], {type: 'text/javascript'});
document.querySelector('motion-canvas-player')?.setAttribute('src', URL.createObjectURL(bridge));
