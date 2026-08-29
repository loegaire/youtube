import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9336);
const url = process.argv[3] ?? 'http://127.0.0.1:9000/';
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const targets = await CDP.List({port});
const target = targets.find(candidate =>
  candidate.type === 'page' && candidate.url.startsWith(url),
) ?? targets.find(candidate => candidate.type === 'page');
if (!target) {
  throw new Error('No headless Chrome page target is available.');
}

const client = await CDP({port, target});
const {Runtime} = client;
await Runtime.enable();

for (let attempt = 0; attempt < 180; attempt++) {
  const ready = await Runtime.evaluate({
    expression: `Boolean([...document.querySelectorAll('button')].find(
      button => button.getAttribute('title') === 'Video Settings'
    ))`,
    returnByValue: true,
  });
  if (ready.result.value) break;
  await sleep(500);
}

const renderVisible = await Runtime.evaluate({
  expression: `Boolean([...document.querySelectorAll('button')].find(
    button => button.textContent.trim() === 'Render'
  ))`,
  returnByValue: true,
});
if (!renderVisible.result.value) {
  await Runtime.evaluate({
    expression: `([...document.querySelectorAll('button')].find(
      button => button.getAttribute('title') === 'Video Settings'
    ))?.click()`,
  });
  await sleep(500);
}

const render = await Runtime.evaluate({
  expression: `(() => {
    const button = [...document.querySelectorAll('button')].find(
      item => item.textContent.trim() === 'Render'
    );
    if (!button) return false;
    button.click();
    return true;
  })()`,
  returnByValue: true,
});

if (!render.result.value) {
  throw new Error('Motion Canvas Render button was not found.');
}

console.log(`Motion Canvas render started at ${url}`);
await client.close();
