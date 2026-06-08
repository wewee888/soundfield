// Cloudflare Pages Function: /api/track
// Receives CTA click events from A/B test variants
// Logs to console (visible in CF Pages → Logs) and Analytics Engine dataset "ab_test_events"

export async function onRequestPost(context) {
  const { request, env } = context;
  let payload = {};
  try {
    payload = await request.json();
  } catch (_) {
    return new Response('bad json', { status: 400 });
  }
  const { variant, cta, ts, ua } = payload;
  if (!variant || !cta) {
    return new Response('missing variant/cta', { status: 400 });
  }
  const record = {
    variant: String(variant).slice(0, 8),
    cta: String(cta).slice(0, 32),
    ts: Number(ts) || Date.now(),
    ua: String(ua || '').slice(0, 200),
  };
  // Cloudflare Analytics Engine (free tier: 100K events/day)
  // Dataset binding name: ab_test_events (configured in Pages → Settings → Bindings)
  if (env.AB_TEST_EVENTS) {
    try {
      env.AB_TEST_EVENTS.writeDataPoint({
        blobs: [record.variant, record.cta],
        doubles: [record.ts],
        indexes: [record.variant + ':' + record.cta],
      });
    } catch (e) {
      console.error('analytics engine write failed', e);
    }
  }
  console.log('CTA_TRACK', JSON.stringify(record));
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
