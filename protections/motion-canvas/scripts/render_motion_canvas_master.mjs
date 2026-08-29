#!/usr/bin/env node
/* Stream actual Motion Canvas canvas frames to a resource-bounded FFmpeg
 * encoder.  This is intentionally a Motion Canvas renderer, not a browser
 * screen recording: each output frame seeks the scene graph deterministically
 * and reads its delivery canvas. */
import CDP from 'chrome-remote-interface';
import {spawn} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {once} from 'node:events';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const get = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
};
const port = Number(get('--port', '9225'));
const fps = Number(get('--fps', '24'));
const startFrame = Number(get('--start', '0'));
const maxFrames = Number(get('--limit', '0'));
const videoOnly = process.argv.includes('--video-only');
const output = path.resolve(get('--output', 'output/binary-defenses-motion-canvas-clean.mp4'));
const audio = path.join(root, 'audio/narration-with-music.wav');
if (!videoOnly && !existsSync(audio)) throw new Error(`Final narration/music mix is missing: ${audio}`);
if (!Number.isInteger(fps) || fps < 12 || fps > 60) throw new Error('Use an integer output fps between 12 and 60.');
if (!Number.isInteger(startFrame) || startFrame < 0) throw new Error('Use a non-negative integer --start frame.');

mkdirSync(path.dirname(output), {recursive: true});
const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find((candidate) => candidate.type === 'page' && (
  candidate.url.startsWith('file:///') || candidate.url.startsWith('http://127.0.0.1:')
));
if (!target) throw new Error('Motion Canvas audit player was not found.');
const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime} = client;
await Runtime.enable();

await Runtime.evaluate({expression: `(async () => {
  for (let attempt = 0; attempt < 600; attempt++) {
    const element = document.querySelector('motion-canvas-player');
    const player = element?.player;
    const canvas = [...(element?.shadowRoot?.querySelectorAll('canvas') ?? [])]
      .find((item) => item.width === 1920 && item.height === 1080);
    if (player?.duration?.current > 0 && player?.playback?.fps > 0 && canvas) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
})()`, awaitPromise: true});

const state = await Runtime.evaluate({expression: `(() => {
  const element = document.querySelector('motion-canvas-player');
  const player = element?.player;
  const canvas = [...(element?.shadowRoot?.querySelectorAll('canvas') ?? [])]
    .find((item) => item.width === 1920 && item.height === 1080);
  return {durationFrames: player?.duration?.current ?? 0, playerFps: player?.playback?.fps ?? 0, canvas: Boolean(canvas)};
})()`, returnByValue: true});
const info = state.result.value;
if (!info?.durationFrames || !info?.playerFps || !info?.canvas) throw new Error(`Motion Canvas player is not render-ready: ${JSON.stringify(info)}`);
const durationSeconds = info.durationFrames / info.playerFps;
const fullFrames = Math.ceil(durationSeconds * fps);
if (startFrame >= fullFrames) throw new Error(`Start frame ${startFrame} is outside the ${fullFrames}-frame master.`);
const totalFrames = maxFrames > 0 ? Math.min(maxFrames, fullFrames - startFrame) : fullFrames - startFrame;
const audioOffset = (startFrame / fps).toFixed(6);
const encoderArgs = [
  '-n', '10', 'ffmpeg', '-y', '-hide_banner', '-loglevel', 'warning', '-stats',
  '-f', 'image2pipe', '-vcodec', 'png', '-framerate', String(fps), '-i', 'pipe:0',
];
if (!videoOnly) encoderArgs.push('-ss', audioOffset, '-i', audio);
encoderArgs.push(
  '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '2',
);
if (videoOnly) encoderArgs.push('-an');
else encoderArgs.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
encoderArgs.push('-movflags', '+faststart', output);
const encoder = spawn('nice', encoderArgs, {stdio: ['pipe', 'inherit', 'inherit']});
let encodeError;
encoder.on('error', (error) => { encodeError = error; });
for (let index = 0; index < totalFrames; index++) {
  const outputFrame = startFrame + index;
  const sourceFrame = Math.min(info.durationFrames - 1, Math.round(outputFrame * info.playerFps / fps));
  const capture = await Runtime.evaluate({
    expression: `(async () => {
      const element = document.querySelector('motion-canvas-player');
      const player = element.player;
      const target = ${sourceFrame};
      player.requestSeek(target);
      for (let attempt = 0; attempt < 1200; attempt++) {
        if (Math.abs(player.frame.current - target) <= 1) break;
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      if (Math.abs(player.frame.current - target) > 1) throw new Error('seek timeout at frame ' + target);
      const canvas = [...element.shadowRoot.querySelectorAll('canvas')].find((item) => item.width === 1920 && item.height === 1080);
      if (!canvas) throw new Error('delivery canvas missing');
      return canvas.toDataURL('image/png');
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (capture.exceptionDetails || !capture.result.value) throw new Error(capture.exceptionDetails?.exception?.description ?? `capture failed at output frame ${index}`);
  const png = Buffer.from(capture.result.value.replace(/^data:image\/png;base64,/, ''), 'base64');
  if (!encoder.stdin.write(png)) await once(encoder.stdin, 'drain');
  if (encodeError) throw encodeError;
  if (index === 0 || (index + 1) % fps === 0 || index + 1 === totalFrames) {
    console.log(`Motion Canvas export ${index + 1}/${totalFrames} (${((index + 1) / fps).toFixed(1)}s)`);
  }
}
encoder.stdin.end();
const [code] = await once(encoder, 'close');
await client.close();
if (code !== 0) throw new Error(`FFmpeg exited with ${code}`);
console.log(JSON.stringify({output, fps, startFrame, frames: totalFrames, sourceDuration: durationSeconds, videoOnly}, null, 2));
