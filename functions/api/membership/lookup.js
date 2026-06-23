function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

async function readBody(request) {
  try {
    return await request.json();
  } catch (e) {
    return {};
  }
}

function planFromProductId(productId, env) {
  const id = String(productId || '');
  if (id && id === String(env.GUMROAD_PRODUCT_ID_PRO_MONTHLY || '')) return 'pro';
  if (id && id === String(env.GUMROAD_PRODUCT_ID_PRO_YEARLY || '')) return 'team';
  if (id && id === String(env.GUMROAD_PRODUCT_ID_LIFETIME || '')) return 'lifetime';
  return 'pro';
}

export async function onRequestPost({ request, env }) {
  const body = await readBody(request);
  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return json({ error: 'invalid_email' }, 400);
  }
  const token = String(env.GUMROAD_ACCESS_TOKEN || '');
  if (!token) {
    return json({ error: 'billing_not_configured' }, 503);
  }

  // List recent sales — Gumroad API v2 supports email filter via after-date or
  // we fetch a small page and filter client-side.
  let payload;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    const resp = await fetch('https://api.gumroad.com/v2/sales?page[size]=50', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    payload = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return json({ error: 'gumroad_error', status: resp.status, body: payload }, 502);
    }
  } catch (e) {
    return json({ error: 'gumroad_unreachable', message: e && e.message ? e.message : 'fetch failed' }, 502);
  }

  const sales = Array.isArray(payload && payload.sales) ? payload.sales : [];
  const userSales = sales.filter((s) => {
    if (!s || !s.email) return false;
    if (String(s.email).toLowerCase() !== email) return false;
    if (String(s.status || '') !== 'paid') return false;
    if (s.refunded === true || s.chargebacked === true) return false;
    return true;
  });

  if (userSales.length === 0) {
    return json({ active: false, plan: 'free', status: 'inactive' });
  }

  userSales.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  const latest = userSales[0];
  const plan = planFromProductId(latest.product_id || (latest.product && latest.product.id), env);

  return json({
    active: true,
    plan,
    status: latest.status || 'paid',
    saleId: latest.id || '',
  });
}

export function onRequestGet() {
  return new Response(
    JSON.stringify({ error: 'method_not_allowed', message: 'POST {email} only' }),
    {
      status: 405,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        allow: 'POST',
      },
    },
  );
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}