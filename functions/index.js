// Override static /index.html so / triggers variant assignment
// instead of serving the old homepage. /a/, /b/, /c/ remain static.
const VARIANTS = ['a', 'b', 'c'];

function parseCookie(header, name) {
  if (!header) return null;
  const parts = header.split(';');
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    const k = p.slice(0, eq).trim();
    if (k === name) return p.slice(eq + 1).trim();
  }
  return null;
}

function pickVariant() {
  const r = Math.random();
  const i = Math.floor(r * VARIANTS.length);
  return VARIANTS[Math.min(i, VARIANTS.length - 1)];
}

function onRequestGet(context) {
  const url = new URL(context.request.url);
  const override = url.searchParams.get('variant');
  let variant = override && VARIANTS.indexOf(override) !== -1 ? override : null;

  if (!variant) {
    const cookieHeader = context.request.headers.get('cookie') || '';
    variant = parseCookie(cookieHeader, 'sf_variant');
    if (!variant || VARIANTS.indexOf(variant) === -1) {
      variant = pickVariant();
    }
  }

  const search = url.search || '';
  const dest = '/' + variant + '/' + search;
  return new Response(null, {
    status: 302,
    headers: {
      'Location': dest,
      'Set-Cookie': 'sf_variant=' + variant + '; Path=/; Max-Age=31536000; SameSite=Lax',
      'Cache-Control': 'no-store',
    },
  });
}

export { onRequestGet };