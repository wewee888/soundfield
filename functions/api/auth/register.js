// Cloudflare Pages Function: /api/auth/register
// Registers a new user account with SHA-256 hashed password in Cloudflare KV (env.ab_test)
// Enables cross-device login (e.g. registered on PC, immediately log in on mobile)

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
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const passwordHash = String(body.passwordHash || '').trim();
    const clientCreatedAt = body.clientCreatedAt ? String(body.clientCreatedAt) : null;

    if (!name || name.length < 2) {
      return json({ ok: false, error: 'name_len', message: 'Name must be at least 2 characters.' }, 400);
    }

    if (!email || !email.includes('@') || email.length > 254) {
      return json({ ok: false, error: 'email_valid', message: 'Please enter a valid email address.' }, 400);
    }

    if (!passwordHash || passwordHash.length < 32) {
      return json({ ok: false, error: 'pwd_req', message: 'Password hash is required.' }, 400);
    }

    if (env.ab_test) {
      // Check if user already exists in KV
      const existing = await env.ab_test.get(`user:${email}`);
      if (existing) {
        return json({ ok: false, error: 'email_exists', message: '该邮箱已被注册，请直接登录 / Email already registered.' }, 409);
      }

      // Check if user has an existing membership in member:${email}
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
        console.error('Membership lookup failed during registration:', memErr);
      }

      // Extract geolocation & device context from Cloudflare request headers
      const clientIp = request.headers.get('cf-connecting-ip') ||
                       request.headers.get('x-real-ip') ||
                       request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                       'Unknown';
      const country = request.cf?.country || request.headers.get('cf-ipcountry') || 'US';
      const city = request.cf?.city || '';
      const region = request.cf?.region || '';
      const language = String(body.lang || request.headers.get('accept-language')?.split(',')[0] || 'en').trim();
      const sourcePage = String(body.sourcePage || request.headers.get('referer') || '').slice(0, 250);

      // Save user record with first login and activity tracking
      const now = new Date().toISOString();
      const userRecord = {
        name,
        email,
        passwordHash,
        ip: clientIp,
        country,
        city,
        region,
        language,
        sourcePage,
        createdAt: clientCreatedAt || now,
        updatedAt: now,
        firstLoginAt: null, // Initialized as pending until first authenticated session request or login
        firstLoginConfirmed: false,
        lastLoginAt: null,
        loginCount: 0,
        loginStatus: 'pending_first_login',
      };
      await env.ab_test.put(`user:${email}`, JSON.stringify(userRecord));

      // Record first journey milestone in history:${email}
      try {
        const initialHistory = [{
          timestamp: now,
          action: 'register',
          actionLabel: '账号注册成功',
          page: sourcePage || '/auth.html',
          title: '完成 SOUNDTEST 账号注册',
          referrer: request.headers.get('referer') || '',
          ip: clientIp,
          country,
          city,
          userAgent: request.headers.get('user-agent') || '',
        }];
        await env.ab_test.put(`history:${email}`, JSON.stringify(initialHistory), {
          expirationTtl: 90 * 86400, // 90 days
        });
      } catch (histErr) {
        console.error('Failed to initialize user history:', histErr);
      }

      // Issue 30-day session token
      const sessionToken = generateSessionToken();
      const SESSION_TTL = 30 * 24 * 60 * 60; // 30 days
      const sessPayload = JSON.stringify({
        email,
        plan: membership.active ? (membership.plan || 'pro') : 'free',
        created_at: now,
        expires_at: new Date(Date.now() + SESSION_TTL * 1000).toISOString(),
      });
      await env.ab_test.put(`sess:${sessionToken}`, sessPayload, {
        expirationTtl: SESSION_TTL,
      });

      return json({
        ok: true,
        message: '账号创建成功 / Account created successfully.',
        name,
        email,
        session_token: sessionToken,
        membership,
      });
    }

    // Fallback if KV not bound (local dev)
    const mockToken = generateSessionToken();
    return json({
      ok: true,
      message: 'Account created (dev mode).',
      name,
      email,
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
