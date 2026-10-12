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

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

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
