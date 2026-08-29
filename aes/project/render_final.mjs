import {chromium} from '/usr/local/lib/node_modules/n8n/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {existsSync, mkdirSync, rmdirSync, rmSync} from 'node:fs';

(async () => {
  rmSync('output/project', {recursive: true, force: true});
  mkdirSync('output/project', {recursive: true});

  console.log('Launching browser...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
  await page.goto('http://localhost:9000/');
  console.log('Waiting for UI...');
  await page.waitForTimeout(10000); // Wait for the project to load
  
  // Click the Render button!
  console.log('Clicking Render button...');
  const success = await page.evaluate(async () => {
    function findButtonByText(node) {
      if (node.shadowRoot) {
        let res = findButtonByText(node.shadowRoot);
        if (res) return res;
      }
      for (let child of node.childNodes) {
        if (child.nodeType === 1) {
          if (child.tagName.toLowerCase() === 'button' && child.textContent.trim() === 'Render') {
            return child;
          }
          let res = findButtonByText(child);
          if (res) return res;
        }
      }
      return null;
    }
    const btn = findButtonByText(document.body);
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (!success) {
    console.error('Failed to find Render button.');
    process.exit(1);
  }

  console.log('Render started. Waiting for completion...');
  // Monitor until the button says Render again (meaning it finished rendering and went back from Cancel/Stop to Render).
  // Or just wait until output/project/ stops getting new files for 10 seconds.
  
  let lastFrameCount = 0;
  let stagnantCount = 0;
  let currentFrameCount = 0;
  const fs = await import('node:fs/promises');
  
  while (true) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const files = await fs.readdir('output/project');
      currentFrameCount = files.length;
    } catch(e) {
      currentFrameCount = 0;
    }
    
    console.log(`Frames rendered: ${currentFrameCount}`);
    
    if (currentFrameCount > 0 && currentFrameCount === lastFrameCount) {
      stagnantCount++;
      if (stagnantCount >= 10) {
        console.log('Rendering seems complete (no new frames for 20s).');
        break;
      }
    } else {
      stagnantCount = 0;
    }
    lastFrameCount = currentFrameCount;
    
    // Check if the button is back to "Render"
    const isDone = await page.evaluate(() => {
      function findButtonByText(node, text) {
        if (node.shadowRoot) {
          let res = findButtonByText(node.shadowRoot, text);
          if (res) return res;
        }
        for (let child of node.childNodes) {
          if (child.nodeType === 1) {
            if (child.tagName.toLowerCase() === 'button' && child.textContent.trim() === text) {
              return child;
            }
            let res = findButtonByText(child, text);
            if (res) return res;
          }
        }
        return null;
      }
      return !!findButtonByText(document.body, 'Render');
    });
    if (isDone && currentFrameCount > 0) {
      console.log('Render button is back. Completed.');
      break;
    }
  }

  await browser.close();
  
  console.log(`Rendering completed! Total frames: ${currentFrameCount}`);
  
  // Now run ffmpeg
  console.log('Running ffmpeg to compile video...');
  const encoder = spawn('ffmpeg', [
    '-y',
    '-framerate', '60',
    '-i', 'output/project/%06d.png',
    '-i', 'audio/narration.wav',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    'output/video-final.mp4'
  ], {stdio: 'inherit'});
  
  encoder.on('close', (code) => {
    console.log(`ffmpeg exited with code ${code}`);
    process.exit(code);
  });
})();
