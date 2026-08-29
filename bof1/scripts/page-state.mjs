import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9223);
const targets = await CDP.List({host: '127.0.0.1', port});
const target = targets.find(candidate => candidate.type === 'page' && candidate.url.startsWith('http://127.0.0.1'));
const client = await CDP({target, host: '127.0.0.1', port});
const {Runtime} = client;
await Runtime.enable();
const result = await Runtime.evaluate({
  expression: `JSON.stringify({
    title: document.title,
    readyState: document.readyState,
    body: document.body.innerHTML.slice(0, 500),
    scripts: [...document.scripts].map(item => item.src),
    resources: performance.getEntriesByType('resource').map(item => ({name: item.name, duration: item.duration})),
    player: (() => {
      const element = document.querySelector('motion-canvas-player');
      return element ? {
        state: element.state,
        hasProject: Boolean(element.project),
        hasPlayer: Boolean(element.player),
        shadowText: element.shadowRoot?.innerText,
      } : null;
    })(),
  })`,
  returnByValue: true,
});
console.log(result.result.value);
await client.close();
