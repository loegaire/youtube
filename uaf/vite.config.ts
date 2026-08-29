import {defineConfig} from 'vite';
import ffmpegModule from '@motion-canvas/ffmpeg';
import motionCanvasModule from '@motion-canvas/vite-plugin';

const motionCanvas = typeof motionCanvasModule === 'function'
  ? motionCanvasModule
  : (motionCanvasModule as {default: typeof motionCanvasModule}).default;
const ffmpeg = typeof ffmpegModule === 'function'
  ? ffmpegModule
  : (ffmpegModule as {default: typeof ffmpegModule}).default;

const localEditorHtml = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="stylesheet" href="/@fs//home/thinh/proj/youtube/bof1/node_modules/@motion-canvas/ui/dist/style.css" /><title>Motion Canvas</title></head><body><script type="module" src="/@id/__x00__virtual:editor"></script></body></html>`;

export default defineConfig({
  // The stock editor template links to an external syntax-highlighting stylesheet.
  // Rendering must be self-contained: an unavailable CDN otherwise blocks the editor's
  // module script before Motion Canvas can initialize.
  plugins: [
    {
      name: 'uaf-local-editor-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const request = req as unknown as {url?: string; headers?: {host?: string}};
          if (!request.url || new URL(request.url, `http://${request.headers?.host ?? '127.0.0.1'}`).pathname !== '/') return next();
          res.setHeader('Content-Type', 'text/html');
          res.end(localEditorHtml);
        });
      },
    },
    motionCanvas(),
    ffmpeg(),
  ],
  cacheDir: '.vite',
  server: {fs: {allow: ['/home/thinh/proj/youtube/uaf', '/home/thinh/proj/youtube/motion-repertoire']}},
  build: {target: 'es2022', rollupOptions: {output: {entryFileNames: 'project.js'}}},
});
