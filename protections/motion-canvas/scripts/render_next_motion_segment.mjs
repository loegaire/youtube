import {existsSync, mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const root = new URL('..', import.meta.url).pathname;
const fps = 12, frames = 16510, chunk = 720;
const dir = `${root}output/segments`; mkdirSync(dir,{recursive:true});
for(let start=0; start<frames; start+=chunk){const out=`${dir}/${String(start/chunk).padStart(3,'0')}.mp4`;if(!existsSync(out)){const r=spawnSync('node',['scripts/render_motion_canvas_master.mjs','--port','9226','--fps',String(fps),'--start',String(start),'--limit',String(Math.min(chunk,frames-start)),'--video-only','--output',out],{cwd:root,stdio:'inherit'});process.exit(r.status??1)}}
console.log('complete');
