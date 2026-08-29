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
await Page.navigate({url});
await Page.loadEventFired();
await new Promise(resolve => setTimeout(resolve, 2500));

const result = await Runtime.evaluate({
  returnByValue: true,
  expression: `(() => ({
    title: document.title,
    href: location.href,
    text: document.body.innerText.slice(0, 1600),
    buttons: [...document.querySelectorAll('button,[role="button"],input,select')]
      .slice(0, 80)
      .map((el, index) => ({
        index,
        tag: el.tagName,
        type: el.getAttribute('type'),
        aria: el.getAttribute('aria-label'),
        title: el.getAttribute('title'),
        text: (el.innerText || el.value || '').trim().slice(0, 120),
        classes: el.className,
      })),
  }))()`,
});

console.log(JSON.stringify(result.result.value, null, 2));
await client.close();
