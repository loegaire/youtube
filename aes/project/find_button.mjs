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
  
  const buttons = await page.evaluate(() => {
    function getButtons(node, arr) {
      if (node.shadowRoot) getButtons(node.shadowRoot, arr);
      for (let child of node.childNodes) {
        if (child.nodeType === 1) { // Element
          if (child.tagName.toLowerCase() === 'button') {
            arr.push({
              title: child.title,
              text: child.textContent.trim(),
              className: child.className
            });
          }
          getButtons(child, arr);
        }
      }
      return arr;
    }
    return getButtons(document.body, []);
  });
  console.log(buttons);
  await browser.close();
})();
