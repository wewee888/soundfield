// Cloudflare Pages Function: /api/auth/session
// Validates a session_token stored in KV and returns current membership status.
// Called silently on every page load to sync membership across devices.

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
    const token = String(body.token || body.session_token || '').trim();

    if (!token) {
      return json({ valid: false, error: 'missing_token' }, 400);
    }

    // If KV not bound (local dev), return a graceful fallback
    if (!env.ab_test) {
      return json({ valid: false, error: 'kv_unavailable', dev: true }, 503);
    }

    // Lookup session in KV
    const raw = await env.ab_test.get(`sess:${token}`);
    if (!raw) {
      return json({ valid: false, error: 'session_not_found' }, 401);
    }

    let sessData;
    try {
      sessData = JSON.parse(raw);
    } catch (_) {
      return json({ valid: false, error: 'corrupt_session' }, 500);
    }

    const { email, created_at, expires_at } = sessData;

    // Check expiry (belt-and-suspenders, KV TTL handles it too)
    if (expires_at && new Date(expires_at).getTime() < Date.now()) {
      await env.ab_test.delete(`sess:${token}`);
      return json({ valid: false, error: 'session_expired' }, 401);
    }

    // Look up fresh membership status
    let membership = { active: false, plan: 'free', status: 'inactive', expires_at: null };
    try {
      const memRaw = await env.ab_test.get(`member:${email}`);
      if (memRaw) {
        const memData = JSON.parse(memRaw);
        const notExpired = !memData.expires_at || new Date(memData.expires_at).getTime() > Date.now();
        if (notExpired) {
          membership = {
            active: true,
            plan: memData.plan || 'pro',
            plan_display: memData.plan_display || memData.plan || 'pro',
            status: memData.status || 'paid',
            expires_at: memData.expires_at || null,
            granted_by: memData.granted_by || 'system',
          };
        }
      }
    } catch (memErr) {
      console.error('Membership lookup failed during session refresh:', memErr);
    }

    // Renew TTL if the session is more than halfway through its 30-day window
    // (i.e., less than 15 days remain)
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
    const created = new Date(created_at).getTime();
    const age = Date.now() - created;
    if (age > FIFTEEN_DAYS) {
      const newExpiry = new Date(Date.now() + THIRTY_DAYS).toISOString();
      const renewed = { ...sessData, expires_at: newExpiry, renewed_at: new Date().toISOString() };
      // Renew with new 30-day TTL
      await env.ab_test.put(`sess:${token}`, JSON.stringify(renewed), {
        expirationTtl: 30 * 24 * 60 * 60,
      }).catch(() => {});
    }

    return json({
      valid: true,
      email,
      membership,
      session_created_at: created_at,
    });
  } catch (err) {
    return json({ valid: false, error: 'server_error', message: err.message }, 500);
  }
}

// DELETE: invalidate session (logout from all devices not supported in free plan,
// but this at least clears the server-side token on explicit logout)
export async function onRequestDelete(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const token = String(body.token || '').trim();
    if (token && env.ab_test) {
      await env.ab_test.delete(`sess:${token}`).catch(() => {});
    }
    return json({ ok: true });
  } catch (_) {
    return json({ ok: true }); // Always succeed on logout
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
