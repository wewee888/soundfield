// Cloudflare Pages Functions Global Middleware
// 1. Detect and terminate recursive crawler traps (Applebot, Googlebot, etc.)
// 2. Intercept malformed nested paths and return HTTP 410 Gone with noindex headers
// 3. Prevent infinite spider loops
// 4. Isolate search engine spiders and track crawl intelligence without polluting human PV/UV/IP

import { detectSpider } from './_spider.js';

const SPIDER_TRAP_PATTERNS = [
  // Repeated /use-cases/ segments (e.g. /use-cases/.../use-cases/)
  /(?:\/use-cases\/[^\/]*){2,}/i,
  // Repeated /noise-levels/ segments (e.g. /noise-levels/.../noise-levels/)
  /(?:\/noise-levels\/[^\/]*){2,}/i,
  // Nested noise-levels under use-cases (e.g. /use-cases/noise-levels/)
  /\/use-cases\/.*noise-levels/i,
  // Multiple language code segments (e.g. /es/.../de/ or /es/.../fr/)
  /(?:\/(?:zh|en|es|fr|de|ja|ko|vi|th)\/[^\/]*){2,}/i,
  // Consecutive duplicated segments (e.g. /use-cases/use-cases/ or /noise-levels/noise-levels/)
  /\/([a-z0-9_-]{2,})\/\1(?:\/|$)/i,
];

const LOCALE_SEGMENTS = new Set(['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']);
const VARIANT_SEGMENTS = new Set(['a', 'b', 'c']);

// Collapse stacked locale segments to the single-locale canonical path.
// Examples: /th/zh/auth.html -> /zh/auth.html,
// /es/es/de/fr/ja/de/index.html -> /de/index.html,
// /use-cases/en/es/en/auth.html -> /use-cases/en/auth.html.
// Runs before the spider-trap 410s so resolvable stacks land on a real page
// instead of a dead end. Each pass strictly reduces the locale-segment
// count, so chained redirects always terminate.
function stackedLocaleRedirect(url) {
  const segments = url.pathname.split('/').filter(Boolean);
  const prefix = [];
  let rest = segments;
  if (rest.length > 0 && VARIANT_SEGMENTS.has(rest[0].toLowerCase())) {
    prefix.push(rest[0]);
    rest = rest.slice(1);
  }

  let changed = false;

  // Leading run of 2+ locale segments -> keep only the last one.
  let run = 0;
  while (run < rest.length && LOCALE_SEGMENTS.has(rest[run].toLowerCase())) run += 1;
  if (run >= 2) {
    rest = [rest[run - 1], ...rest.slice(run)];
    changed = true;
  }

  // Locale run stacked right after /use-cases/ -> keep only the last one.
  const uc = rest.findIndex((s) => s.toLowerCase() === 'use-cases');
  if (uc === 0 || (uc === 1 && LOCALE_SEGMENTS.has(rest[0].toLowerCase()))) {
    let sub = uc + 1;
    while (sub < rest.length && LOCALE_SEGMENTS.has(rest[sub].toLowerCase())) sub += 1;
    if (sub - (uc + 1) >= 2) {
      rest = [...rest.slice(0, uc + 1), rest[sub - 1], ...rest.slice(sub)];
      changed = true;
    }
  }

  if (!changed) return null;

  const target = new URL(url);
  target.pathname = '/' + [...prefix, ...rest].join('/') + (url.pathname.endsWith('/') ? '/' : '');
  return new Response(null, {
    status: 301,
    headers: {
      Location: target.toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

const APEX_HOST = 'soundtest.pro';
const WWW_HOST = 'www.soundtest.pro';
const NOINDEX_LEAVES = new Set([
  'auth',
  'launch-metrics',
  'monetization',
  'refund',
  'changelog',
  'camera',
]);
const LANGS = new Set(['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']);

function hostCanonicalRedirect(request) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const visitor = request.headers.get('CF-Visitor') || '';
  const clientHttp = /"scheme"\s*:\s*"http"/i.test(visitor);
  const isWww = host === WWW_HOST;
  const isApex = host === APEX_HOST;
  if (!isWww && !(clientHttp && isApex)) return null;
  url.hostname = APEX_HOST;
  url.protocol = 'https:';
  // request.url is already https at the worker when Cloudflare terminated TLS.
  // A CF-Visitor scheme of http still needs a 301 so the browser leaves http.
  const status = request.method === 'GET' || request.method === 'HEAD' ? 301 : 308;
  return new Response(null, {
    status,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

function isNoindexPath(pathname) {
  let path = pathname.split('?')[0];
  if (path.endsWith('.html')) path = path.slice(0, -5);
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return false;
  const leaf = parts[parts.length - 1];
  if (!NOINDEX_LEAVES.has(leaf)) return false;
  if (parts.length === 2 && !LANGS.has(parts[0])) return false;
  return true;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 0. Redirect stacked-locale paths to their single-locale canonical form
  const localeRedirect = stackedLocaleRedirect(url);
  if (localeRedirect) return localeRedirect;

  // 0b. One hop to https://soundtest.pro. Cloudflare "Always Use HTTPS" already
  // 301s plain http at the edge; this covers www and a missing edge rule.
  const hostRedirect = hostCanonicalRedirect(context.request);
  if (hostRedirect) return hostRedirect;

  // 1. Check for spider trap / crawler loop patterns
  for (const pattern of SPIDER_TRAP_PATTERNS) {
    if (pattern.test(pathname)) {
      return new Response('410 Gone - Invalid Recursive URL Trajectory', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }
  }

  // 2. Check for excessive depth of nested subdirectories on non-API routes
  // (All legitimate routes on soundtest.pro have at most 3 segments, e.g. /use-cases/es/bar-street-disturbance.html)
  if (!pathname.startsWith('/api/')) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 4) {
      return new Response('410 Gone - Excessive Path Depth', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }
  }

  // 3. Search Engine Spider & Crawler Telemetry Capture
  // 100% isolates spiders from human traffic metrics (PV, UV, IP) while recording crawl activity
  const ua = context.request.headers.get('user-agent') || '';
  const spider = detectSpider(ua);
  if (spider && context.env && context.env.ab_test && (context.request.method === 'GET' || context.request.method === 'HEAD')) {
    const isAsset = /\.(?:css|js|png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|map|txt|xml|webmanifest)$/i.test(pathname);
    if (!isAsset && !pathname.startsWith('/api/')) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const clientIp = context.request.headers.get('cf-connecting-ip') ||
                       context.request.headers.get('x-real-ip') ||
                       context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                       'Unknown';
      const recordSpiderAsync = async () => {
        try {
          const env = context.env;
          // 1. Increment Today Spider counter
          const spiderKey = `analytics:spider:${todayStr}`;
          const cur = parseInt(await env.ab_test.get(spiderKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(spiderKey, String(cur + 1), { expirationTtl: 86400 * 90 });

          // 2. Increment Specific Spider Type counter
          const typeKey = `analytics:spider:${spider.code}:${todayStr}`;
          const curType = parseInt(await env.ab_test.get(typeKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(typeKey, String(curType + 1), { expirationTtl: 86400 * 90 });

          // 3. Increment Lifetime Spider counter
          const lifeKey = 'lifetime:spider';
          const curLife = parseInt(await env.ab_test.get(lifeKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(lifeKey, String(curLife + 1));

          // 4. Ingest into Spiders Recent Buffer (max 100 entries)
          const rawRecent = await env.ab_test.get('spiders:recent');
          let recents = [];
          if (rawRecent) {
            try { recents = JSON.parse(rawRecent); } catch (_) {}
          }
          if (!Array.isArray(recents)) recents = [];
          recents.unshift({
            id: `sp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: spider.name,
            icon: spider.icon,
            code: spider.code,
            ip: clientIp,
            path: pathname,
            timestamp: new Date().toISOString(),
            userAgent: ua.slice(0, 150),
          });
          if (recents.length > 100) recents = recents.slice(0, 100);
          await env.ab_test.put('spiders:recent', JSON.stringify(recents), { expirationTtl: 86400 * 30 });
        } catch (_) {}
      };

      if (context.waitUntil) {
        context.waitUntil(recordSpiderAsync());
      } else {
        recordSpiderAsync();
      }
    }
  }

  const response = await context.next();
  if (!isNoindexPath(pathname)) return response;

  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, follow');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
