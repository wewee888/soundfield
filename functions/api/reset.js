// Cloudflare Pages Function: /api/reset
// Clears all A/B test click counters. Used to wipe stale test data from KV edge cache.
// Workers-side delete propagates correctly to all edges; wrangler CLI delete does not.

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
  const { env } = context;
  if (!env.ab_test) {
    return new Response(JSON.stringify({ error: 'KV not bound' }, null, 2), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const keysToDelete = ['lifetime:total'];
  for (const v of VARIANTS) {
    keysToDelete.push(`clicks:${v}:_total`);
    for (const c of CTAS) keysToDelete.push(`clicks:${v}:${c}`);
  }
  let deleted = 0;
  let failed = 0;
  for (const k of keysToDelete) {
    try {
      await env.ab_test.delete(k);
      deleted++;
    } catch (e) {
      console.error('KV delete failed', k, e);
      failed++;
    }
  }
  return new Response(JSON.stringify({ ok: true, deleted, failed, total: keysToDelete.length }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
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
