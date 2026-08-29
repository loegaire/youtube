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
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
