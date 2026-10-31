// Cloudflare Pages Functions Global Middleware
// 1. Detect and terminate recursive crawler traps (Applebot, Googlebot, etc.)
// 2. Intercept malformed nested paths and return HTTP 410 Gone with noindex headers
// 3. Prevent infinite spider loops

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

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 0. Redirect stacked-locale paths to their single-locale canonical form
  const localeRedirect = stackedLocaleRedirect(url);
  if (localeRedirect) return localeRedirect;

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

  return context.next();
}
