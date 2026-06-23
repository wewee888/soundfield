function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

const LOOKUP_RATE_WINDOW_MS = 10 * 60 * 1000;
const LOOKUP_RATE_LIMIT = 12;
const rateBucket = new Map();

async function readBody(request) {
  try {
    return await request.json();
  } catch (e) {
    return {};
  }
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = rateBucket.get(ip) || { count: 0, windowStart: now };
  if (now - current.windowStart > LOOKUP_RATE_WINDOW_MS) {
    current.count = 0;
    current.windowStart = now;
  }
  current.count += 1;
  rateBucket.set(ip, current);
  return current.count > LOOKUP_RATE_LIMIT;
}

function planFromProductId(productId, env) {
  const id = String(productId || '');
  if (id && id === String(env.GUMROAD_PRODUCT_ID_PRO_MONTHLY || '')) return 'pro';
  if (id && id === String(env.GUMROAD_PRODUCT_ID_PRO_YEARLY || '')) return 'team';
  if (id && id === String(env.GUMROAD_PRODUCT_ID_LIFETIME || '')) return 'lifetime';
  return 'pro';
}

async function gumroadRequest(path, token) {
  const response = await fetch(`https://api.gumroad.com/v2${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`gumroad_${response.status}`);
  }
  return payload;
}

// Treat refunded/chargeback/disputed as inactive.
const ACTIVE_SALE_STATUSES = new Set(['paid', 'preorder_authorization_successful']);
// For subscriptions, treat these as active.
const ACTIVE_SUB_STATUSES = new Set(['active', 'on_trial', 'past_due']);

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (isRateLimited(ip)) {
    return json({ error: 'too_many_requests' }, 429);
  }
  const body = await readBody(request);
  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return json({ error: 'invalid_email' }, 400);
  }
  const token = String(env.GUMROAD_ACCESS_TOKEN || '');
  if (!token) {
    return json({ error: 'billing_not_configured' }, 503);
  }

  try {
    // Subscriptions (recurring products) — check this first so renewals map to pro/team.
    let subsResult = { success: true, subscriptions: [] };
    try {
      subsResult = await gumroadRequest('/subscriptions', token);
    } catch (e) {
      // Continue to one-off sales
    }
    const activeSub = (subsResult.subscriptions || []).find((s) =>
      ACTIVE_SUB_STATUSES.has(String(s.status || ''))
    );
    if (activeSub) {
      const productId = activeSub.product_id || (activeSub.product && activeSub.product.id);
      const plan = planFromProductId(productId, env);
      return json({
        active: true,
        plan,
        status: activeSub.status || 'active',
        renewsAt: activeSub.renews_at || activeSub.end_date || '',
        subscriptionId: activeSub.id || '',
        source: 'subscription',
      });
    }

    // One-off / lifetime purchases via /sales
    // Gumroad /sales doesn't have an email filter; fetch first page and filter client-side.
    const salesResult = await gumroadRequest('/sales?page[size]=100', token);
    const userSales = (salesResult.sales || []).filter((s) => {
      if (!s.email || String(s.email).toLowerCase() !== email) return false;
      if (!ACTIVE_SALE_STATUSES.has(String(s.status || ''))) return false;
      return true;
    });

    if (userSales.length === 0) {
      return json({ active: false, plan: 'free', status: 'inactive' });
    }

    // Use the most recent sale.
    const latest = userSales.sort((a, b) =>
      String(b.created_at || '').localeCompare(String(a.created_at || ''))
    )[0];

    const plan = planFromProductId(latest.product_id || (latest.product && latest.product.id), env);
    return json({
      active: true,
      plan,
      status: latest.status || 'paid',
      renewsAt: '',
      saleId: latest.id || '',
      source: 'sale',
    });
  } catch (e) {
    return json({ error: 'lookup_failed', message: e.message || 'unknown' }, 502);
  }
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