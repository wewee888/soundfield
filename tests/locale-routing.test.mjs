import assert from 'node:assert';
import { test } from 'node:test';
import { resolveLocale, parseAcceptLanguage, parseCookie, onRequestGet } from '../functions/index.js';

test('IP country routing', () => {
  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'CN',
  }), 'zh');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'JP',
  }), 'ja');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'KR',
  }), 'ko');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'ES',
  }), 'es');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'MX',
  }), 'es');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'FR',
  }), 'fr');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'DE',
  }), 'de');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'VN',
  }), 'vi');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'TH',
  }), 'th');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'US',
  }), 'en');
});

test('Portuguese IP does NOT route to Spanish or Japanese', () => {
  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'PT',
    acceptLanguageHeader: 'pt-PT,pt;q=0.9,en;q=0.8',
  }), 'en');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'BR',
    acceptLanguageHeader: 'pt-BR,pt;q=0.9',
  }), 'en');
});

test('Accept-Language handles unmapped or unknown country', () => {
  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'XX',
    acceptLanguageHeader: 'zh-CN,zh;q=0.9,en;q=0.8',
  }), 'zh');

  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: '',
    acceptLanguageHeader: 'ja-JP,ja;q=0.9',
  }), 'ja');
});

test('Cookie overrides IP country', () => {
  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/'),
    countryHeader: 'JP',
    cookieHeader: 'sf_locale=zh',
  }), 'zh');
});

test('URL parameter overrides cookie and IP', () => {
  assert.strictEqual(resolveLocale({
    url: new URL('https://soundtest.pro/?lang=ja'),
    countryHeader: 'CN',
    cookieHeader: 'sf_locale=zh',
  }), 'ja');
});

test('onRequestGet returns 302 redirect with Set-Cookie for localized language', () => {
  const req = new Request('https://soundtest.pro/', {
    headers: { 'cf-ipcountry': 'CN' },
  });
  const res = onRequestGet({ request: req });
  assert.strictEqual(res.status, 302);
  assert.strictEqual(res.headers.get('Location'), '/zh/');
  assert.ok(res.headers.get('Set-Cookie').includes('sf_locale=zh'));
});

test('onRequestGet returns 302 redirect with variant for English', () => {
  const req = new Request('https://soundtest.pro/?variant=a', {
    headers: { 'cf-ipcountry': 'US' },
  });
  const res = onRequestGet({ request: req });
  assert.strictEqual(res.status, 302);
  assert.strictEqual(res.headers.get('Location'), '/a/?variant=a');
  assert.ok(res.headers.get('Set-Cookie').includes('sf_locale=en'));
  assert.ok(res.headers.get('Set-Cookie').includes('sf_variant=a'));
});
