import {chromium} from '/usr/local/lib/node_modules/n8n/node_modules/playwright/index.mjs';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:9000/');
  await page.waitForTimeout(3000);
  
  const html = await page.evaluate(() => {
    function getShadowDOM(node) {
      let result = '';
      if (node.shadowRoot) {
        result += getShadowDOM(node.shadowRoot);
      }
      for (let child of node.childNodes) {
        if (child.nodeType === 1) { // Element
          result += '<' + child.tagName.toLowerCase();
          if (child.id) result += ' id="' + child.id + '"';
          if (child.className && typeof child.className === 'string') result += ' class="' + child.className + '"';
          if (child.title) result += ' title="' + child.title + '"';
          result += '>';
          result += getShadowDOM(child);
          result += '</' + child.tagName.toLowerCase() + '>';
        } else if (child.nodeType === 3) { // Text
          result += child.textContent;
        }
      }
      return result;
    }
    return getShadowDOM(document.body);
  });
  console.log(html);
  await browser.close();
})();
