import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9222);
const expectedUrl = process.argv[3] ?? 'http://127.0.0.1:9000';
const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => (
  candidate.type === 'page' && candidate.url.startsWith(expectedUrl)
));

if (!target) {
  throw new Error('Motion Canvas page not found');
}

const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime, Log, Page} = client;
const problems = [];

Runtime.exceptionThrown(event => {
  problems.push(event.exceptionDetails?.exception?.description ?? event.exceptionDetails?.text);
});
Runtime.consoleAPICalled(event => {
  if (event.type === 'error') {
    problems.push(event.args.map(arg => arg.value ?? arg.description).join(' '));
  }
});
Log.entryAdded(({entry}) => {
  if (entry.level === 'error') problems.push(entry.text);
});

await Promise.all([Runtime.enable(), Log.enable(), Page.enable()]);
await Page.reload({ignoreCache: true});
await new Promise(resolve => setTimeout(resolve, 6000));

const evaluation = await Runtime.evaluate({
  expression: `JSON.stringify({
    title: document.title,
    readyState: document.readyState,
    bodyChildren: document.body.children.length,
    canvases: document.querySelectorAll('canvas').length,
    text: document.body.innerText.slice(0, 1000),
    html: document.body.innerHTML.slice(0, 1000),
  })`,
  returnByValue: true,
});

console.log(JSON.stringify({
  page: JSON.parse(evaluation.result.value),
  problems,
}, null, 2));

await client.close();
