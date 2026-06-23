// Gumroad checkout URL builder. We do NOT call Gumroad's API to create a session —
// Gumroad product pages are the checkout. We just append the buyer's email and
// tracking params, then redirect.
const PLAN_URL_ENV = {
  pro: 'GUMROAD_URL_PRO_MONTHLY',
  team: 'GUMROAD_URL_PRO_YEARLY',
  lifetime: 'GUMROAD_URL_LIFETIME',
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

  if (!['pro', 'team', 'lifetime'].includes(plan)) {
    return json({ error: 'invalid_plan' }, 400);
  }
  if (!email || !email.includes('@')) {
    return json({ error: 'invalid_email' }, 400);
  }

  const baseUrl = String(env[PLAN_URL_ENV[plan]] || '');
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