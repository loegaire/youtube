import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [
    (motionCanvas as any).default ? (motionCanvas as any).default() : motionCanvas(),
  ],
});
