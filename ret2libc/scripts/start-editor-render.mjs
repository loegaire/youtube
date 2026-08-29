import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9335);
const url = process.argv[3] ?? 'http://127.0.0.1:9010/';

const targets = await CDP.List({port});
const target = targets.find(item => item.type === 'page');
if (!target) {
  throw new Error('no Chrome page target found');
}

const client = await CDP({port, target});
const {Page, Runtime} = client;
await Page.enable();
await Runtime.enable();

if (!target.url.startsWith(url)) {
  await Page.navigate({url});
  await Page.loadEventFired();
  await new Promise(resolve => setTimeout(resolve, 2500));
}

const click = await Runtime.evaluate({
  returnByValue: true,
  expression: `(() => {
    const buttons = [...document.querySelectorAll('button')];
    const button = buttons.find(el => (el.innerText || el.textContent || '').trim() === 'RENDER');
    if (!button) return {ok: false, text: document.body.innerText.slice(0, 600)};
    button.click();
    return {ok: true, text: document.body.innerText.slice(0, 600)};
  })()`,
});

console.log(JSON.stringify(click.result.value, null, 2));
await new Promise(resolve => setTimeout(resolve, 3000));

const status = await Runtime.evaluate({
  returnByValue: true,
  expression: `(() => ({
    text: document.body.innerText.slice(0, 1200),
    activeElement: document.activeElement?.tagName,
  }))()`,
});
console.log(JSON.stringify(status.result.value, null, 2));
await client.close();
