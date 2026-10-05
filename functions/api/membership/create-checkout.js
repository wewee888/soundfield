// Creem.io checkout URL builder. Redirects to Creem checkout pages with buyer email and tracking.
const PLAN_URL_ENV = {
  single: 'CREEM_URL_SINGLE',
  pro: 'CREEM_URL_PRO_MONTHLY',
  team: 'CREEM_URL_PRO_YEARLY',
  lifetime: 'CREEM_URL_LIFETIME',
};

const DEFAULT_URLS = {
  single: 'https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC',
  pro: 'https://www.creem.io/payment/prod_4jTdMPIau4Pzn1HKHPW9NQ',
  team: 'https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c',
  lifetime: 'https://www.creem.io/payment/prod_18nHbuAQNpc4n334rM9hGV',
};

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

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await readBody(request);
  const plan = String(body.plan || '').toLowerCase();
  const email = String(body.email || '').trim().toLowerCase();
  const source = String(body.source || 'soundtest-pro-web');

  if (!['single', 'pro', 'team', 'lifetime'].includes(plan)) {
    return json({ error: 'invalid_plan' }, 400);
  }
  if (!email || !email.includes('@')) {
    return json({ error: 'invalid_email' }, 400);
  }

  const envKey = PLAN_URL_ENV[plan];
  const baseUrl = String(
    env[envKey] ||
    (plan === 'pro' && env.GUMROAD_URL_PRO_MONTHLY) ||
    (plan === 'team' && env.GUMROAD_URL_PRO_YEARLY) ||
    (plan === 'lifetime' && env.GUMROAD_URL_LIFETIME) ||
    DEFAULT_URLS[plan] || ''
  );
  if (!baseUrl) {
    return json({ error: 'billing_not_configured' }, 503);
  }

  // Append buyer email + tracking params (Gumroad will prefill checkout)
  let checkoutUrl = baseUrl;
  try {
    const u = new URL(baseUrl);
    if (email) u.searchParams.set('email', email);
    u.searchParams.set('source', source);
    u.searchParams.set('plan', plan);
    checkoutUrl = u.toString();
  } catch (e) {
    // Bad URL in env — fall back to plain baseUrl
  }

  // Record order checkout creation in KV for funnel tracking
  if (env.ab_test) {
    const creemOrderId = `creem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const planFees = { single: '1.99', pro: '4.99', team: '24.99', lifetime: '79.99' };
    try {
      await env.ab_test.put(
        `order:${creemOrderId}`,
        JSON.stringify({
          plan,
          fee: planFees[plan] || '4.99',
          currency: 'USD',
          provider: 'creem',
          status: 'pending',
          email,
          created_at: new Date().toISOString(),
        }),
        { expirationTtl: 86400 * 30 }
      );
    } catch (_) {}
  }

  return json({ ok: true, plan, checkoutUrl });
}

export function onRequestGet() {
  return new Response(
    JSON.stringify({ error: 'method_not_allowed', message: 'POST {plan,email} only' }),
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