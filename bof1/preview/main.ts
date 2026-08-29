import '@motion-canvas/player';
import project from '../dist/project.js';

declare global {
  interface Window {
    __MOTION_CANVAS_AUDIT_PROJECT__: typeof project;
  }
}

window.__MOTION_CANVAS_AUDIT_PROJECT__ = project;
const bridge = new Blob(
  ['export default window.__MOTION_CANVAS_AUDIT_PROJECT__;'],
  {type: 'text/javascript'},
);
document.querySelector('motion-canvas-player')?.setAttribute(
  'src',
  URL.createObjectURL(bridge),
);
