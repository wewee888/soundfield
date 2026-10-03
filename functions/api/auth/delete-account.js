// Cloudflare Pages Function: /api/auth/delete-account
// Permanently deletes user account, KV records, and associated sessions

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
    const email = String(body.email || '').trim().toLowerCase();
    const token = String(body.token || '').trim();

    if (!email) {
      return json({ ok: false, error: 'missing_email', message: 'Email is required.' }, 400);
    }

    if (env.ab_test) {
      // 1. Delete user profile record
      await env.ab_test.delete(`user:${email}`);

      // 2. If session token provided, delete session
      if (token) {
        await env.ab_test.delete(`session:${token}`);
      }

      // 3. Delete any magic codes or device authorizations associated with email
      await env.ab_test.delete(`magic:${email}`);
      await env.ab_test.delete(`device_auth:${email}`);

      return json({ ok: true, message: 'Account permanently deleted from server.' });
    }

    return json({ ok: true, message: 'Account deleted (dev mode).' });
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
