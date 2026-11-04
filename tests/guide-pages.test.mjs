import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const englishPages = [
  'online-decibel-meter.html',
  ...[30, 40, 50, 60, 70, 80, 90, 100, 110].map((n) => `how-loud-is-${n}-db.html`),
];

test('new guide pages use final 200 URLs and do not overclaim the meter', () => {
  const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  for (const file of englishPages) {
    const stem = file.replace(/\.html$/, '');
    const html = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert.match(html, new RegExp(`rel="canonical" href="https://soundtest\\.pro/${stem}"`));
    assert.doesNotMatch(html, /legally defensible/i, file);
    assert.doesNotMatch(html, /Class 1/i, file);
    assert.match(html, /href="\/soundtest\.html"/);
    assert.match(html, /href="\/accuracy\.html"/);
    assert.match(sitemap, new RegExp(`<loc>https://soundtest\\.pro/${stem}</loc>`));
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://soundtest\\.pro/${stem}/</loc>`));
  }
  const meter = fs.readFileSync(path.join(rootDir, 'online-decibel-meter.html'), 'utf8');
  assert.match(meter, /±1 to 5 dB/);
  assert.match(meter, /watermark/i);
  assert.match(meter, /CSV/);
  assert.match(meter, /not a certified/i);

  const gb = fs.readFileSync(path.join(rootDir, 'zh/gb-3096-2008.html'), 'utf8');
  assert.match(gb, /rel="canonical" href="https:\/\/soundtest\.pro\/zh\/gb-3096-2008"/);
  assert.match(gb, /2008 年 10 月 1 日/);
  assert.match(gb, /GB 22337-2008/);
  assert.match(gb, /GB 12523-2011/);
  assert.match(gb, /<td>1 类<\/td>\s*<td>55<\/td>\s*<td>45<\/td>/);
  assert.match(gb, /不能/);
  assert.doesNotMatch(gb, /法定计量认证仪器就是/);
  assert.match(sitemap, /<loc>https:\/\/soundtest\.pro\/zh\/gb-3096-2008<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/soundtest\.pro\/gb-3096-2008<\/loc>/);
});
