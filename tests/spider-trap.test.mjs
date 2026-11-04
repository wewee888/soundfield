import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Spider Trap Protection: 404.html exists and is properly isolated from indexers', () => {
  const file404 = path.join(rootDir, '404.html');
  assert.ok(fs.existsSync(file404), '404.html must exist at root to prevent Cloudflare Pages SPA 200 OK fallback');

  const html = fs.readFileSync(file404, 'utf8');
  assert.match(html, /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i, '404.html must contain noindex');
  assert.match(html, /<title>[^<]+<\/title>/i, '404.html must have a valid title');
  assert.match(html, /<meta[^>]+name=["']description["']/i, '404.html must have a meta description');
});

test('Spider Trap Protection: functions/_middleware.js detects and blocks recursive crawler loops', async () => {
  const mwPath = path.join(rootDir, 'functions', '_middleware.js');
  assert.ok(fs.existsSync(mwPath), 'functions/_middleware.js must exist');

  const mwModule = await import(`file://${mwPath.replace(/\\/g, '/')}`);
  assert.equal(typeof mwModule.onRequest, 'function', 'functions/_middleware.js must export onRequest');

  // Test real-world spider trap URLs captured from Applebot logs
  const trappedUrls = [
    'https://soundtest.pro/use-cases/noise-levels/es/use-cases/de/fr/es/index.html',
    'https://soundtest.pro/use-cases/noise-levels/use-cases/noise-levels/th/es/use-cases/use-cases/bar-street-disturbance.html',
    'https://soundtest.pro/use-cases/use-cases/fr/noise-levels/noise-levels/es/en/use-cases/property-noise-complaint-report.html',
    'https://soundtest.pro/use-cases/use-cases/index.html',
  ];

  for (const trapUrl of trappedUrls) {
    let nextCalled = false;
    const response = await mwModule.onRequest({
      request: new Request(trapUrl),
      next: () => {
        nextCalled = true;
        return new Response('ok');
      },
    });

    assert.equal(nextCalled, false, `Crawler trap ${trapUrl} must be intercepted, not passed to next()`);
    assert.equal(response.status, 410, `Crawler trap ${trapUrl} must return HTTP 410`);
    assert.match(response.headers.get('X-Robots-Tag') || '', /noindex/i, 'Response must have X-Robots-Tag: noindex');
  }

  // A stack of locale prefixes collapses to the last locale instead of 410.
  const stacked = await mwModule.onRequest({
    request: new Request('https://soundtest.pro/es/de/fr/noise-levels.html'),
    next: () => {
      throw new Error('stacked locales must redirect');
    },
  });
  assert.equal(stacked.status, 301);
  assert.equal(new URL(stacked.headers.get('Location')).pathname, '/fr/noise-levels.html');

  // Legitimate routes must pass through
  const normalUrls = [
    'https://soundtest.pro/',
    'https://soundtest.pro/index.html',
    'https://soundtest.pro/soundtest.html',
    'https://soundtest.pro/es/',
    'https://soundtest.pro/es/noise-levels.html',
    'https://soundtest.pro/use-cases/',
    'https://soundtest.pro/use-cases/bar-street-disturbance.html',
    'https://soundtest.pro/use-cases/es/bar-street-disturbance.html',
  ];

  for (const normalUrl of normalUrls) {
    let nextCalled = false;
    const response = await mwModule.onRequest({
      request: new Request(normalUrl),
      next: () => {
        nextCalled = true;
        return new Response('passed');
      },
    });

    assert.equal(nextCalled, true, `Normal URL ${normalUrl} must pass through`);
    assert.equal(await response.text(), 'passed');
  }
});

test('Host canonicalization: www and plain http redirect once to https://soundtest.pro', async () => {
  const mwModule = await import(`file://${path.join(rootDir, 'functions', '_middleware.js').replace(/\\/g, '/')}`);

  const www = await mwModule.onRequest({
    request: new Request('https://www.soundtest.pro/noise-levels/?q=1'),
    next: () => {
      throw new Error('www must not be rendered');
    },
  });
  assert.equal(www.status, 301);
  assert.equal(www.headers.get('Location'), 'https://soundtest.pro/noise-levels/?q=1');

  const insecure = await mwModule.onRequest({
    request: new Request('https://soundtest.pro/accuracy', {
      headers: { 'CF-Visitor': '{"scheme":"http"}' },
    }),
    next: () => {
      throw new Error('http must not be rendered');
    },
  });
  assert.equal(insecure.status, 301);
  assert.equal(insecure.headers.get('Location'), 'https://soundtest.pro/accuracy');

  const post = await mwModule.onRequest({
    request: new Request('https://www.soundtest.pro/api/membership/lookup', { method: 'POST' }),
    next: () => {
      throw new Error('www POST must not be rendered');
    },
  });
  assert.equal(post.status, 308);
  assert.equal(post.headers.get('Location'), 'https://soundtest.pro/api/membership/lookup');
});

test('Noindex header is attached to login, billing, changelog, refund, and camera responses', async () => {
  const mwModule = await import(`file://${path.join(rootDir, 'functions', '_middleware.js').replace(/\\/g, '/')}`);
  for (const url of [
    'https://soundtest.pro/auth',
    'https://soundtest.pro/zh/refund/',
    'https://soundtest.pro/camera.html',
    'https://soundtest.pro/launch-metrics',
  ]) {
    const response = await mwModule.onRequest({
      request: new Request(url),
      next: () => new Response('page', { headers: { 'Content-Type': 'text/html' } }),
    });
    assert.equal(response.status, 200, url);
    assert.match(response.headers.get('X-Robots-Tag') || '', /noindex/i, url);
    assert.equal(await response.text(), 'page');
  }

  const home = await mwModule.onRequest({
    request: new Request('https://soundtest.pro/accuracy'),
    next: () => new Response('guide'),
  });
  assert.equal(home.headers.get('X-Robots-Tag'), null);
  assert.equal(await home.text(), 'guide');
});

test('Spider Trap Protection: Zero relative href attributes in all public HTML files', () => {
  const skipDirs = new Set(['.git', 'node_modules', '_temp', 'test-results']);
  const violations = [];

  function scan(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      const rel = path.relative(rootDir, full).replace(/\\/g, '/');
      if (ent.isDirectory()) {
        if (!skipDirs.has(ent.name)) scan(full);
      } else if (ent.isFile() && ent.name.endsWith('.html')) {
        const content = fs.readFileSync(full, 'utf8');
        const re = /href=["']([^"']+)["']/g;
        let match;
        while ((match = re.exec(content)) !== null) {
          const h = match[1].trim();
          if (!h.startsWith('/') && !h.startsWith('http://') && !h.startsWith('https://') &&
              !h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('tel:') &&
              !h.startsWith('javascript:') && !h.startsWith('${')) {
            violations.append ? violations.append(`${rel} -> ${h}`) : violations.push(`${rel} -> ${h}`);
          }
        }
      }
    }
  }

  scan(rootDir);
  assert.deepEqual(violations, [], `Found ${violations.length} relative href links that could trigger spider traps:\n${violations.join('\n')}`);
});

test('Spider Trap Protection: site-experience.js does not contain relative fallback paths', () => {
  const jsContent = fs.readFileSync(path.join(rootDir, 'assets', 'site-experience.js'), 'utf8');
  assert.doesNotMatch(jsContent, /\.\.\/use-cases\//, 'site-experience.js must not contain ../use-cases/');
  assert.doesNotMatch(jsContent, /basePrefix\s*\+\s*['"]use-cases\//, 'site-experience.js must not build unslashed use-cases links');
});
