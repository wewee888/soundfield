// Cloudflare Pages Function: /api/admin/grant
// Grants, upgrades, or revokes membership for a user email via Cloudflare KV

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  });
}

function verifyAuth(request, env) {
  const adminSecret = String(env.ADMIN_SECRET || 'soundtest_admin_2026');
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-admin-token') ||
                new URL(request.url).searchParams.get('token') || '';
  return token === adminSecret;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!verifyAuth(request, env)) {
    return json({ ok: false, error: 'unauthorized', message: 'Admin authentication required' }, 401);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const plan = String(body.plan || 'pro').toLowerCase();
    const action = String(body.action || 'grant').toLowerCase(); // 'grant' or 'revoke'
    const note = String(body.note || 'Admin manual grant');

    if (!email || !email.includes('@')) {
      return json({ ok: false, error: 'invalid_email', message: 'Valid email address is required' }, 400);
    }

    if (!['single', 'pro', 'yearly', 'lifetime'].includes(plan)) {
      return json({ ok: false, error: 'invalid_plan', message: 'Plan must be single, pro, yearly, or lifetime' }, 400);
    }

    if (!env.ab_test) {
      return json({ ok: false, error: 'kv_not_bound', message: 'KV ab_test is not bound' }, 503);
    }

    if (action === 'revoke') {
      await env.ab_test.delete(`member:${email}`);
      return json({ ok: true, action: 'revoked', email });
    }

    // Determine expiration
    const now = new Date();
    let expiresAt = null;
    let days = parseInt(body.days || 0, 10);
    if (!days) {
      if (plan === 'pro') days = 30;
      else if (plan === 'yearly') days = 365;
      else if (plan === 'lifetime') days = 36500;
      else if (plan === 'single') days = 365;
    }

    const expDate = new Date(now.getTime() + days * 86400 * 1000);
    expiresAt = expDate.toISOString();

    const memberRecord = {
      email,
      plan: plan === 'yearly' ? 'team' : plan,
      plan_display: plan,
      status: 'paid',
      granted_at: now.toISOString(),
      expires_at: expiresAt,
      note,
      granted_by: 'super_admin',
    };

    // Store in KV with expiration
    await env.ab_test.put(`member:${email}`, JSON.stringify(memberRecord), {
      expirationTtl: Math.min(days * 86400, 86400 * 365 * 10),
    });

    return json({
      ok: true,
      action: 'granted',
      email,
      plan: memberRecord.plan,
      expires_at: expiresAt,
      granted_at: memberRecord.granted_at,
      note,
    });
  } catch (err) {
    return json({ ok: false, error: 'grant_failed', message: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization, x-admin-token',
    },
  });
}
