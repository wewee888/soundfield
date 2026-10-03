// Cloudflare Pages Function: /api/auth/change-password
// Updates user password hash in Cloudflare KV (env.ab_test)

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
    const currentPasswordHash = String(body.currentPasswordHash || '').trim();
    const newPasswordHash = String(body.newPasswordHash || '').trim();

    if (!email || !currentPasswordHash || !newPasswordHash) {
      return json({ ok: false, error: 'missing_fields', message: 'Required fields missing.' }, 400);
    }

    if (newPasswordHash.length < 32) {
      return json({ ok: false, error: 'new_pwd_len', message: 'New password hash is invalid.' }, 400);
    }

    if (env.ab_test) {
      const rawUser = await env.ab_test.get(`user:${email}`);
      if (!rawUser) {
        return json({ ok: false, error: 'no_account', message: 'No account found.' }, 404);
      }

      let userData;
      try {
        userData = JSON.parse(rawUser);
      } catch (_) {
        return json({ ok: false, error: 'corrupt_user_record' }, 500);
      }

      if (userData.passwordHash !== currentPasswordHash) {
        return json({ ok: false, error: 'cur_pwd_incorrect', message: 'Current password is incorrect.' }, 401);
      }

      userData.passwordHash = newPasswordHash;
      userData.updatedAt = new Date().toISOString();
      await env.ab_test.put(`user:${email}`, JSON.stringify(userData));

      return json({ ok: true, message: 'Password updated successfully.' });
    }

    return json({ ok: true, message: 'Password updated (dev mode).' });
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
