// Cloudflare Pages Function: /api/auth/login
// Verifies user email and SHA-256 hashed password from Cloudflare KV (env.ab_test)
// Generates a 30-day session token and returns membership status for multi-device sync

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

function generateSessionToken() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return 'sess_' + crypto.randomUUID().replace(/-/g, '');
    }
  } catch (_) {}
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const passwordHash = String(body.passwordHash || '').trim();

    if (!email || !email.includes('@')) {
      return json({ ok: false, error: 'email_req', message: 'Email is required.' }, 400);
    }

    if (!passwordHash) {
      return json({ ok: false, error: 'pwd_req', message: 'Password is required.' }, 400);
    }

    if (env.ab_test) {
      // Look up user in KV
      const rawUser = await env.ab_test.get(`user:${email}`);
      if (!rawUser) {
        return json({ ok: false, error: 'no_account', message: '未找到该邮箱对应的账号，请先注册 / No account found with this email.' }, 404);
      }

      let userData;
      try {
        userData = JSON.parse(rawUser);
      } catch (_) {
        return json({ ok: false, error: 'corrupt_user_record' }, 500);
      }

      if (userData.passwordHash !== passwordHash) {
        return json({ ok: false, error: 'pwd_incorrect', message: '密码错误，请核对后重试 / Incorrect password.' }, 401);
      }

      // Look up fresh membership status
      let membership = { active: false, plan: 'free', status: 'inactive', expires_at: null };
      const isAdminUser = email.toLowerCase() === 'wewee1@gmail.com';

      if (isAdminUser) {
        membership = {
          active: true,
          plan: 'team',
          plan_display: 'Team 超级管理员',
          role: 'admin',
          status: 'paid',
          expires_at: '2099-12-31T23:59:59.000Z',
          granted_by: 'system_root',
        };
        try {
          await env.ab_test.put(`member:${email}`, JSON.stringify(membership), { expirationTtl: 86400 * 365 * 10 });
        } catch (_) {}
      } else {
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
                role: memData.role || 'user',
                status: memData.status || 'paid',
                expires_at: memData.expires_at || null,
                granted_by: memData.granted_by || 'system',
              };
            }
          }
        } catch (memErr) {
          console.error('Membership lookup failed during login:', memErr);
        }
      }

      // Generate 30-day session token
      const sessionToken = generateSessionToken();
      const SESSION_TTL = 30 * 24 * 60 * 60; // 30 days
      const now = new Date().toISOString();
      const sessPayload = JSON.stringify({
        email: userData.email,
        plan: membership.active ? (membership.plan || 'pro') : 'free',
        created_at: now,
        expires_at: new Date(Date.now() + SESSION_TTL * 1000).toISOString(),
      });

      await env.ab_test.put(`sess:${sessionToken}`, sessPayload, {
        expirationTtl: SESSION_TTL,
      });

      return json({
        ok: true,
        message: '登录成功 / Login successful.',
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        session_token: sessionToken,
        membership,
        createdAt: userData.createdAt || now,
      });
    }

    // Dev fallback if KV not bound
    const mockToken = generateSessionToken();
    return json({
      ok: true,
      message: 'Login successful (dev mode).',
      email,
      name: email.split('@')[0],
      session_token: mockToken,
      membership: { active: false, plan: 'free', status: 'inactive', expires_at: null },
      dev: true,
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
