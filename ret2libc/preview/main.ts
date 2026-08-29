import '@motion-canvas/player';
// Produced by the main Motion Canvas Vite build.
// @ts-ignore
import project from '../dist/project.js';

declare global {
  interface Window {
    __RET2LIBC_PROJECT__: typeof project;
  }
}

window.__RET2LIBC_PROJECT__ = project;
const bridge = new Blob(
  ['export default window.__RET2LIBC_PROJECT__;'],
  {type: 'text/javascript'},
);

document.querySelector('motion-canvas-player')?.setAttribute(
  'src',
  URL.createObjectURL(bridge),
);
