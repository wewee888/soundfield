function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function planFromProductId(productId, env) {
  const id = String(productId || '');
  if (id && id === String(env.GUMROAD_PRODUCT_ID_PRO_MONTHLY || '')) return 'pro';
  if (id && id === String(env.GUMROAD_PRODUCT_ID_PRO_YEARLY || '')) return 'team';
  if (id && id === String(env.GUMROAD_PRODUCT_ID_LIFETIME || '')) return 'lifetime';
  return 'unknown';
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function hmacHex(secret, body) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  const bytes = new Uint8Array(sig);
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const env = context.env;
    const body = await request.text();

    const secret = String(env.GUMROAD_WEBHOOK_SECRET || '');
    const headerSig = String(
      request.headers.get('x-gumroad-signature') ||
      request.headers.get('X-Gumroad-Signature') ||
      ''
    );
    if (secret) {
      if (!headerSig) {
        return json({ error: 'missing_signature' }, 401);
      }
      const expected = await hmacHex(secret, body);
      if (!timingSafeEqual(expected, headerSig.toLowerCase())) {
        return json({ error: 'invalid_signature' }, 401);
      }
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      return json({ error: 'invalid_json' }, 400);
    }

    const event = String(payload.event || payload.action || '');
    const kv = env.ab_test;
    const ts = Date.now();
    const date = new Date(ts).toISOString().slice(0, 10);
    const rand = Math.random().toString(36).slice(2, 8);

    if (event === 'sale.created' && payload.sale) {
      const sale = payload.sale;
      const plan = planFromProductId(sale.product_id, env);
      if (kv) {
        const key = 'sale:' + date + ':' + ts + ':' + rand;
        const record = {
          type: 'sale',
          plan: plan,
          email: sale.email || '',
          productId: sale.product_id || '',
          productName: sale.product_name || '',
          amount: Number(sale.price) || 0,
          currency: sale.currency || 'usd',
          quantity: Number(sale.quantity) || 1,
          status: sale.status || '',
          saleId: sale.id || '',
          country: sale.ip_country || '',
          timestamp: new Date(ts).toISOString(),
          gumroad_created_at: sale.created_at || '',
          event: event,
          raw: false,
        };
        await kv.put(key, JSON.stringify(record), { expirationTtl: 86400 * 365 });
      }
      return json({ ok: true, event: event, plan: plan, saleId: sale.id || '' });
    }

    if (event === 'ping' || event === '') {
      if (kv) {
        const key = 'evt:' + date + ':' + ts + ':' + rand;
        const record = {
          type: 'ping',
          event: event || 'ping',
          timestamp: new Date(ts).toISOString(),
        };
        await kv.put(key, JSON.stringify(record), { expirationTtl: 86400 * 30 });
      }
      return json({ ok: true, event: event || 'ping' });
    }

    if (kv) {
      const key = 'evt:' + date + ':' + ts + ':' + rand;
      const record = {
        type: 'event',
        event: event,
        timestamp: new Date(ts).toISOString(),
      };
      await kv.put(key, JSON.stringify(record), { expirationTtl: 86400 * 30 });
    }
    return json({ ok: true, event: event });
  } catch (e) {
    return json({ error: 'webhook_failed', message: (e && e.message) || 'unknown' }, 500);
  }
}

export function onRequestGet() {
  return new Response(JSON.stringify({ error: 'method_not_allowed', message: 'POST only' }), {
    status: 405,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { 'access-control-allow-origin': '*' },
  });
}