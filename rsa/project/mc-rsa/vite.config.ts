import {defineConfig} from 'vite';
import * as mcPlugin from '@motion-canvas/vite-plugin';

// The plugin ships as CJS; under ESM interop the callable is nested.
const motionCanvas = (mcPlugin as any).default?.default ?? (mcPlugin as any).default ?? (mcPlugin as any);

export default defineConfig({
  plugins: [motionCanvas()],
});
