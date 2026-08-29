import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9337);
const url = process.argv[3] ?? 'http://127.0.0.1:9012/';
const target = (await CDP.List({port})).find(item => item.type === 'page');
if (!target) throw new Error('No page target');
const client = await CDP({port, target});
const {Page, Runtime} = client;
await Page.enable();
await Runtime.enable();
console.log(await Page.navigate({url}));
await new Promise(resolve => setTimeout(resolve, 5000));
const result = await Runtime.evaluate({
  returnByValue: true,
  expression: `(() => ({state: document.readyState, title: document.title, text: document.body.innerText.slice(0, 1800), buttons: [...document.querySelectorAll('button,[role="button"]')].map((el, index) => ({index, text: (el.innerText || el.textContent || '').trim(), title: el.getAttribute('title')}))}))()`,
});
console.log(JSON.stringify(result.result.value, null, 2));
await client.close();
