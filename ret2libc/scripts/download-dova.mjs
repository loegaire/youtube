import {createWriteStream} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {basename, resolve} from 'node:path';
import {Readable} from 'node:stream';
import {finished} from 'node:stream/promises';

const url = process.argv[2];
const track = process.argv[3] ?? '1';
const out = process.argv[4];

if (!url || !out) {
  console.error('usage: node scripts/download-dova.mjs <download-page-url> <track> <out>');
  process.exit(2);
}

const headers = {
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
};

const pageResponse = await fetch(url, {headers});
if (!pageResponse.ok) {
  throw new Error(`page fetch failed: ${pageResponse.status} ${pageResponse.statusText}`);
}

const cookie = pageResponse.headers.get('set-cookie')?.split(';')[0] ?? '';
const page = await pageResponse.text();
const csrf = page.match(/name="csrfmiddlewaretoken" value="([^"]+)"/)?.[1];
if (!csrf) {
  throw new Error('csrf token not found');
}

const title = page.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ') ?? basename(url);
const options = [...page.matchAll(/<option value="(\d+)">([^<]+)<\/option>/g)].map(match => `${match[1]}:${match[2]}`);

const body = new URLSearchParams({csrfmiddlewaretoken: csrf, track});
const download = await fetch(url, {
  method: 'POST',
  headers: {
    ...headers,
    cookie,
    referer: url,
    'content-type': 'application/x-www-form-urlencoded',
  },
  body,
});

if (!download.ok) {
  throw new Error(`download failed: ${download.status} ${download.statusText}`);
}

await mkdir(resolve(out, '..'), {recursive: true});
await finished(Readable.fromWeb(download.body).pipe(createWriteStream(out)));

console.log(JSON.stringify({
  url,
  title,
  options,
  selected_track: track,
  output: out,
  content_type: download.headers.get('content-type'),
  content_length: download.headers.get('content-length'),
}, null, 2));
