import CDP from 'chrome-remote-interface';

const port = Number(process.argv[2] ?? 9337);
console.log(`Connecting to Chrome on ${port}`);
const targetId = process.argv[3];
const target = (await CDP.List({port})).find(item => item.type === 'page' && (!targetId || item.id === targetId));
if (!target) throw new Error('No page target');
console.log(`Target: ${target.title} ${target.url}`);
const client = await CDP({port, target});
const {Runtime} = client;
await Runtime.enable();
const result = await Runtime.evaluate({
  returnByValue: true,
  expression: `(() => ({
    readyState: document.readyState,
    href: location.href,
    html: document.documentElement.outerHTML.slice(0, 2000),
    resources: performance.getEntriesByType('resource').map(entry => ({name: entry.name, duration: entry.duration, transferSize: entry.transferSize})).slice(0, 40),
    player: window.__uafPlayer ? {state: window.__uafPlayer.state, hasProject: !!window.__uafPlayer.project, hasPlayer: !!window.__uafPlayer.player, frame: window.__uafPlayer.player?.onFrameChanged?.current, duration: window.__uafPlayer.player?.onDurationChanged?.current} : null,
    playerModule: window.__playerModule ?? null,
    staticRenderer: window.__uafStatic ? {ready: window.__uafStatic.state.ready, renderedFrame: window.__uafStatic.state.renderedFrame, initialDuration: window.__uafStatic.state.duration, duration: window.__uafStatic.player.playback.duration, error: window.__uafStatic.state.renderError, frame: window.__uafStatic.player.playback.frame} : null,
    scenes: window.__uafStatic ? window.__uafStatic.player.playback.onScenesRecalculated.current.map(scene => ({name: scene.name, firstFrame: scene.firstFrame, lastFrame: scene.lastFrame, duration: scene.lastFrame - scene.firstFrame})) : null,
    title: document.title,
    text: document.body.innerText.slice(0, 2000),
    buttons: [...document.querySelectorAll('button,[role="button"]')].map((el, index) => ({index, text: (el.innerText || el.textContent || '').trim(), title: el.getAttribute('title')})),
  }))()`,
});
console.log(JSON.stringify(result.result.value, null, 2));
await client.close();
