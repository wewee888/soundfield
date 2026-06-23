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
  return 'pro';
}

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const env = context.env;
    const body = await request.json().catch(function () { return {}; });
    const email = String((body && body.email) || '').trim().toLowerCase();
    if (!email || email.indexOf('@') === -1) {
      return json({ error: 'invalid_email' }, 400);
    }
    const token = String(env.GUMROAD_ACCESS_TOKEN || '');
    if (!token) {
      return json({ error: 'billing_not_configured' }, 503);
    }

    const url = 'https://api.gumroad.com/v2/sales?after=2020-01-01';
    let resp;
    try {
      resp = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
        },
      });
    } catch (e) {
      return json({ error: 'gumroad_fetch_failed', message: (e && e.message) || 'fetch failed' }, 502);
    }
    let payload = {};
    try { payload = await resp.json(); } catch (e) { payload = {}; }
    if (!resp.ok) {
      return json({ error: 'gumroad_error', status: resp.status }, 502);
    }

    const sales = Array.isArray(payload && payload.sales) ? payload.sales : [];
    const userSales = [];
    for (let i = 0; i < sales.length; i++) {
      const s = sales[i];
      if (!s || !s.email) continue;
      if (String(s.email).toLowerCase() !== email) continue;
      if (String(s.status || '') !== 'paid') continue;
      if (s.refunded === true || s.chargebacked === true) continue;
      userSales.push(s);
    }

    if (userSales.length === 0) {
      return json({ active: false, plan: 'free', status: 'inactive' });
    }

    userSales.sort(function (a, b) {
      return String(b.created_at || '').localeCompare(String(a.created_at || ''));
    });
    const latest = userSales[0];
    const plan = planFromProductId(
      latest.product_id || (latest.product && latest.product.id),
      env
    );

    return json({
      active: true,
      plan: plan,
      status: latest.status || 'paid',
      saleId: latest.id || '',
    });
  } catch (e) {
    return json({ error: 'lookup_failed', message: (e && e.message) || 'unknown' }, 500);
  }
}

export function onRequestGet() {
  return new Response(
    JSON.stringify({ error: 'method_not_allowed', message: 'POST {email} only' }),
    {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    },
  );
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { 'access-control-allow-origin': '*' },
  });
}