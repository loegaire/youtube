import {readFileSync} from 'node:fs';
import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9337);
const targetId = process.argv[3];
const targets = await CDP.List({port});
const target = targets.find(item => item.id === targetId);
if (!target) throw new Error('Target not found');
const client = await CDP({port, target});
const source = readFileSync('static-dist/uaf-static-renderer.js', 'utf8');
const result = await client.Runtime.evaluate({
  expression: source,
  awaitPromise: true,
  returnByValue: true,
});
if (result.exceptionDetails) {
  throw new Error(result.exceptionDetails.text);
}
console.log(JSON.stringify({loaded: true, bytes: source.length}, null, 2));
await client.close();
