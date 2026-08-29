import {chromium} from '/usr/local/lib/node_modules/n8n/node_modules/playwright/index.mjs';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:9000/');
  await page.waitForTimeout(5000);
  
  const canvases = await page.evaluate(() => {
    function getCanvases(node, arr) {
      if (node.shadowRoot) getCanvases(node.shadowRoot, arr);
      for (let child of node.childNodes) {
        if (child.nodeType === 1) {
          if (child.tagName.toLowerCase() === 'canvas') {
            arr.push({width: child.width, height: child.height});
          }
          getCanvases(child, arr);
        }
      }
      return arr;
    }
    return getCanvases(document.body, []);
  });
  console.log('Canvases:', canvases);
  await browser.close();
})();
