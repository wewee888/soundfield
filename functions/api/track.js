// Cloudflare Pages Function: /api/track
// Receives CTA click events from A/B test variants
// Persists to KV (counters) + logs to console
// All KV reads use cacheTtl:0 to avoid stale-edge reads

const VARIANTS = ['A', 'B', 'C'];
const CTAS = [
  'start_monitoring',
  'view_sample',
  'bento_neighbor',
  'bento_construction',
  'bento_bar',
  'bento_rental',
  'pricing_free',
  'pricing_pro',
];

export async function onRequestPost(context) {
  const { request, env } = context;
  let payload = {};
  try {
    payload = await request.json();
  } catch (_) {
    return new Response('bad json', { status: 400 });
  }
  const variant = String(payload.variant || '').slice(0, 8).toUpperCase();
  const cta = String(payload.cta || '').slice(0, 32);
  if (!VARIANTS.includes(variant) || !CTAS.includes(cta)) {
    return new Response('invalid variant/cta', { status: 400 });
  }
  const ts = Number(payload.ts) || Date.now();

  if (env.ab_test) {
    try {
      // Atomically read-modify-write each counter with minimum-allowed cacheTtl (30s)
      // to reduce edge cache staleness. KV's minimum cacheTtl is 30s.
      const ctaKey = `clicks:${variant}:${cta}`;
      const cur = parseInt((await env.ab_test.get(ctaKey, { cacheTtl: 30 })) || '0', 10);
      await env.ab_test.put(ctaKey, String(cur + 1));

      const totalKey = `clicks:${variant}:_total`;
      const total = parseInt((await env.ab_test.get(totalKey, { cacheTtl: 30 })) || '0', 10);
      await env.ab_test.put(totalKey, String(total + 1));

      const lifeKey = 'lifetime:total';
      const life = parseInt((await env.ab_test.get(lifeKey, { cacheTtl: 30 })) || '0', 10);
      await env.ab_test.put(lifeKey, String(life + 1));
    } catch (e) {
      console.error('KV write failed', e);
    }
  }

  console.log('CTA_TRACK', JSON.stringify({ variant, cta, ts }));
  return new Response('ok', {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

export async function onRequestGet() {
  return new Response('POST only', { status: 405 });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
