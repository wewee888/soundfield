// Cloudflare Pages Function: /api/stats
// Returns aggregated A/B test click counts for the stats dashboard
// All reads use cacheTtl:0 to bypass KV edge cache

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

export async function onRequestGet(context) {
  const { env } = context;
  const result = {
    updated_at: new Date().toISOString(),
    lifetime_total: 0,
    variants: {},
  };
  if (!env.ab_test) {
    return new Response(JSON.stringify({ error: 'KV not bound' }, null, 2), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    result.lifetime_total = parseInt((await env.ab_test.get('lifetime:total', { cacheTtl: 0 })) || '0', 10);
    for (const v of VARIANTS) {
      const total = parseInt((await env.ab_test.get(`clicks:${v}:_total`, { cacheTtl: 0 })) || '0', 10);
      const ctas = {};
      for (const c of CTAS) {
        const n = parseInt((await env.ab_test.get(`clicks:${v}:${c}`, { cacheTtl: 0 })) || '0', 10);
        if (n > 0) ctas[c] = n;
      }
      result.variants[v] = { total, ctas };
    }
  } catch (e) {
    console.error('KV read failed', e);
    return new Response(JSON.stringify({ error: 'KV read failed', detail: String(e) }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
