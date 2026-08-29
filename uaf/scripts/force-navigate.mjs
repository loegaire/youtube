import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9337);
const url = process.argv[3] ?? 'http://127.0.0.1:9012/';
const target = (await CDP.List({port})).find(item => item.type === 'page');
if (!target) throw new Error('No page target');
const client = await CDP({port, target});
console.log('navigate request');
console.log(await client.Page.navigate({url}));
await new Promise(resolve => setTimeout(resolve, 4000));
const result = await client.Runtime.evaluate({
  returnByValue: true,
  expression: `({href: location.href, readyState: document.readyState, title: document.title, text: document.body.innerText.slice(0, 1200), buttons: [...document.querySelectorAll('button')].map(button => button.innerText.trim()).filter(Boolean)})`,
});
console.log(JSON.stringify(result.result.value, null, 2));
await client.close();
