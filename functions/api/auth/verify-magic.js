// Cloudflare Pages Function: /api/auth/verify-magic
// Verifies a one-time Magic Link token OR a 6-digit email verification code

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
    const magicToken = String(body.magic_token || body.token || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const code = String(body.code || '').trim();

    if (!magicToken && (!email || !code)) {
      return json({
        ok: false,
        error: 'missing_credentials',
        message: '请提供魔法链接 Token，或邮箱与 6 位验证码',
      }, 400);
    }

    let verifiedEmail = null;
    let redirectTo = '/auth.html';
    let storedPayload = null;

    if (env.ab_test) {
      if (magicToken) {
        // Verification by magic token
        const raw = await env.ab_test.get(`magic:${magicToken}`);
        if (!raw) {
          return json({
            ok: false,
            error: 'token_expired_or_invalid',
            message: '登录凭证已失效或已被使用，请重新获取魔法链接。',
          }, 401);
        }
        try {
          storedPayload = JSON.parse(raw);
          verifiedEmail = storedPayload.email;
          redirectTo = storedPayload.redirect_to || redirectTo;
        } catch (_) {
          return json({ ok: false, error: 'corrupt_token_data' }, 500);
        }

        // Single-use: delete magic token, but keep magic_code until natural TTL so user can still enter code
        await env.ab_test.delete(`magic:${magicToken}`);
      } else if (email && code) {
        // Verification by 6-digit code
        const raw = await env.ab_test.get(`magic_code:${email}`);
        if (!raw) {
          return json({
            ok: false,
            error: 'code_expired_or_invalid',
            message: '验证码已过期或不存在，请重新发送。',
          }, 401);
        }
        try {
          storedPayload = JSON.parse(raw);
          if (String(storedPayload.code).trim() !== code) {
            return json({
              ok: false,
              error: 'code_mismatch',
              message: '验证码不正确，请重新输入。',
            }, 401);
          }
          verifiedEmail = storedPayload.email;
          redirectTo = storedPayload.redirect_to || redirectTo;

          // Single-use: delete both keys
          await env.ab_test.delete(`magic_code:${email}`);
          if (storedPayload.token) {
            await env.ab_test.delete(`magic:${storedPayload.token}`);
          }
        } catch (_) {
          return json({ ok: false, error: 'corrupt_code_data' }, 500);
        }
      }
    } else {
      // Fallback for local testing or unconfigured KV
      verifiedEmail = email || 'test@soundtest.pro';
    }

    if (!verifiedEmail) {
      return json({ ok: false, error: 'verification_failed', message: '身份验证未通过' }, 401);
    }

    // Check membership status from KV member record
    let membership = {
      active: false,
      plan: 'free',
      status: 'inactive',
      expires_at: null,
    };

    const isAdminUser = verifiedEmail.toLowerCase() === 'wewee1@gmail.com';
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
      if (env.ab_test) {
        try {
          await env.ab_test.put(`member:${verifiedEmail}`, JSON.stringify(membership), { expirationTtl: 86400 * 365 * 10 });
        } catch (_) {}
      }
    } else if (env.ab_test) {
      try {
        const memRaw = await env.ab_test.get(`member:${verifiedEmail}`);
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
        console.error('Membership lookup failed during magic verify', memErr);
      }
    }

    // Generate authenticated session token
    let sessionToken = '';
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sessionToken = 'sess_' + crypto.randomUUID().replace(/-/g, '');
      }
    } catch (_) {}
    if (!sessionToken) {
      sessionToken = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    }

    // Persist session token in KV — 30-day TTL — enables cross-device validation
    const now = new Date().toISOString();
    const clientIp = request.headers.get('cf-connecting-ip') ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     'Unknown';
    const country = request.cf?.country || request.headers.get('cf-ipcountry') || 'US';

    if (env.ab_test && sessionToken) {
      const SESSION_TTL = 30 * 24 * 60 * 60; // 30 days in seconds
      const sessPayload = JSON.stringify({
        email: verifiedEmail,
        plan: membership.active ? (membership.plan || 'pro') : 'free',
        created_at: now,
        expires_at: new Date(Date.now() + SESSION_TTL * 1000).toISOString(),
      });
      await env.ab_test.put(`sess:${sessionToken}`, sessPayload, {
        expirationTtl: SESSION_TTL,
      }).catch(err => console.error('Session KV write failed:', err));

      // Update user login tracking in KV
      try {
        const rawUser = await env.ab_test.get(`user:${verifiedEmail}`);
        if (rawUser) {
          const u = JSON.parse(rawUser);
          if (!u.firstLoginAt) {
            u.firstLoginAt = now;
            u.firstLoginConfirmed = true;
          }
          u.lastLoginAt = now;
          u.loginCount = (u.loginCount || 0) + 1;
          u.lastLoginIp = clientIp;
          u.loginStatus = 'confirmed';
          u.updatedAt = now;
          await env.ab_test.put(`user:${verifiedEmail}`, JSON.stringify(u));
        }

        // Append to history
        const rawHistory = await env.ab_test.get(`history:${verifiedEmail}`);
        let history = [];
        if (rawHistory) {
          try { history = JSON.parse(rawHistory); } catch (_) {}
        }
        if (!Array.isArray(history)) history = [];
        history.unshift({
          timestamp: now,
          action: 'magic_login',
          actionLabel: '免密魔法链接/验证码登录成功',
          page: redirectTo || '/auth.html',
          title: '快捷身份验证登录',
          ip: clientIp,
          country,
          userAgent: request.headers.get('user-agent') || '',
        });
        if (history.length > 50) history = history.slice(0, 50);
        await env.ab_test.put(`history:${verifiedEmail}`, JSON.stringify(history), {
          expirationTtl: 90 * 86400,
        });
      } catch (logErr) {
        console.error('Failed to update magic login tracking:', logErr);
      }
    }

    return json({
      ok: true,
      message: '登录成功 / Authentication successful',
      email: verifiedEmail,
      session_token: sessionToken,
      redirect_to: redirectTo,
      membership,
      firstLoginAt: now,
      lastLoginAt: now,
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
