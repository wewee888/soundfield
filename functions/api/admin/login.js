// Cloudflare Pages Function: /api/admin/login
// Verifies Super Admin Secret Key

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

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const secret = String(body.secret || '').trim();
    const adminSecret = String(env.ADMIN_SECRET || 'soundtest_admin_2026');

    if (!secret) {
      return json({ ok: false, error: 'missing_secret', message: 'Admin secret is required' }, 400);
    }

    if (secret !== adminSecret) {
      return json({ ok: false, error: 'invalid_secret', message: 'Incorrect admin secret' }, 401);
    }

    return json({
      ok: true,
      role: 'super_admin',
      token: adminSecret,
      authenticated_at: new Date().toISOString(),
    });
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
