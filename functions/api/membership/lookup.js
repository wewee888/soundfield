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

    // 0. Super Admin Auto-Grant for wewee1@gmail.com
    if (email === 'wewee1@gmail.com') {
      const superAdminMem = {
        active: true,
        plan: 'team',
        plan_display: 'Team 超级管理员',
        role: 'admin',
        status: 'paid',
        expires_at: '2099-12-31T23:59:59.000Z',
        granted_by: 'system_root',
      };
      if (env.ab_test) {
        try {
          await env.ab_test.put(`member:${email}`, JSON.stringify(superAdminMem), { expirationTtl: 86400 * 365 * 10 });
        } catch (_) {}
      }
      return json(superAdminMem);
    }

    // 1. Check Cloudflare KV ab_test first (manual grants, WeChat Pay, Creem)
    if (env.ab_test) {
      try {
        const kvRaw = await env.ab_test.get(`member:${email}`);
        if (kvRaw) {
          const mem = JSON.parse(kvRaw);
          const notExpired = !mem.expires_at || new Date(mem.expires_at).getTime() > Date.now();
          if (notExpired) {
            return json({
              active: true,
              plan: mem.plan || 'pro',
              plan_display: mem.plan_display || mem.plan || 'pro',
              status: mem.status || 'paid',
              saleId: mem.order_id || 'cf_kv_grant',
              expires_at: mem.expires_at || null,
              granted_by: mem.granted_by || 'system',
            });
          }
        }
      } catch (kvErr) {
        console.error('KV membership lookup error:', kvErr);
      }
    }

    const token = String(env.GUMROAD_ACCESS_TOKEN || '');
    if (!token) {
      return json({ active: false, plan: 'free', status: 'inactive', note: 'kv_checked' });
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