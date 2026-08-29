const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error('usage: node scripts/inspect-dova-list.mjs <url...>');
  process.exit(2);
}

for (const url of urls) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
    },
  });
  if (!response.ok) {
    console.log(JSON.stringify({url, ok: false, status: response.status}));
    continue;
  }
  const page = await response.text();
  const title = page.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ');
  const description = page.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const options = [...page.matchAll(/<option value="(\d+)">([^<]+)<\/option>/g)].map(match => `${match[1]}:${match[2]}`);
  console.log(JSON.stringify({url, ok: true, title, description, options}));
}
