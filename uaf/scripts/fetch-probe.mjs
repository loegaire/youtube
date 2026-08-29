import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9337);
const targetId = process.argv[3];
const url = process.argv[4] ?? 'http://127.0.0.1:9012/';
const target = (await CDP.List({port})).find(item => item.id === targetId);
if (!target) throw new Error('Target not found');
const client = await CDP({port, target});
const result = await client.Runtime.evaluate({
  awaitPromise: true,
  returnByValue: true,
  expression: `fetch(${JSON.stringify(url)}).then(async response => ({ok: response.ok, status: response.status, body: (await response.text()).slice(0, 300)})).catch(error => ({error: String(error)}))`,
});
console.log(JSON.stringify(result.result.value, null, 2));
await client.close();
