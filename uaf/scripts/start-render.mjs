import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9337);
const target = (await CDP.List({port})).find(item => item.type === 'page');
if (!target) throw new Error('No Chrome page target found');
const client = await CDP({port, target});
const {Runtime} = client;
await Runtime.enable();
const result = await Runtime.evaluate({
  returnByValue: true,
  expression: `(() => {
    const button = [...document.querySelectorAll('button')].find(el => (el.innerText || el.textContent || '').trim() === 'Render');
    if (!button) return {ok: false, buttons: [...document.querySelectorAll('button')].map(el => (el.innerText || el.textContent || '').trim()).filter(Boolean)};
    button.click();
    return {ok: true};
  })()`,
});
console.log(JSON.stringify(result.result.value, null, 2));
await client.close();
