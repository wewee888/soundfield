// Cloudflare Pages Function: /api/admin/membership
// Allows Super Admin (e.g. wewee1@gmail.com) to query, configure, and grant memberships

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

const ADMIN_EMAILS = ['wewee1@gmail.com'];

async function verifyAdminCaller(request, env) {
  // Check auth header or session token or email in body/query
  const url = new URL(request.url);
  const token = request.headers.get('x-session-token') || url.searchParams.get('admin_token') || '';
  const adminEmail = request.headers.get('x-admin-email') || url.searchParams.get('admin_email') || '';

  if (ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return { ok: true, email: adminEmail.toLowerCase() };
  }

  if (env.ab_test && token) {
    try {
      const sessRaw = await env.ab_test.get(`sess:${token}`);
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if (ADMIN_EMAILS.includes((sess.email || '').toLowerCase())) {
          return { ok: true, email: sess.email.toLowerCase() };
        }
      }
    } catch (_) {}
  }

  return { ok: false };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const caller = await verifyAdminCaller(request, env);
    if (!caller.ok) {
      return json({ ok: false, error: 'unauthorized', message: '仅超级管理员有权操作此接口' }, 403);
    }

    const url = new URL(request.url);
    const targetEmail = String(url.searchParams.get('email') || '').trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      return json({ ok: false, error: 'invalid_email', message: '请提供有效的查询邮箱' }, 400);
    }

    let membership = null;
    let userInfo = null;

    if (env.ab_test) {
      try {
        const memRaw = await env.ab_test.get(`member:${targetEmail}`);
        if (memRaw) membership = JSON.parse(memRaw);
      } catch (_) {}

      try {
        const userRaw = await env.ab_test.get(`user:${targetEmail}`);
        if (userRaw) {
          const u = JSON.parse(userRaw);
          userInfo = { name: u.name, email: u.email, createdAt: u.createdAt, plan: u.plan };
        }
      } catch (_) {}
    }

    return json({
      ok: true,
      email: targetEmail,
      membership: membership || { active: false, plan: 'free', status: 'none' },
      user: userInfo,
    });
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const adminEmail = String(body.admin_email || request.headers.get('x-admin-email') || '').trim().toLowerCase();
    const adminToken = String(body.admin_token || request.headers.get('x-session-token') || '').trim();

    let isAuthorized = ADMIN_EMAILS.includes(adminEmail);
    if (!isAuthorized && env.ab_test && adminToken) {
      try {
        const sessRaw = await env.ab_test.get(`sess:${adminToken}`);
        if (sessRaw) {
          const sess = JSON.parse(sessRaw);
          if (ADMIN_EMAILS.includes((sess.email || '').toLowerCase())) {
            isAuthorized = true;
          }
        }
      } catch (_) {}
    }

    if (!isAuthorized) {
      return json({ ok: false, error: 'unauthorized', message: '仅超级管理员有权操作此接口' }, 403);
    }

    const targetEmail = String(body.target_email || body.email || '').trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      return json({ ok: false, error: 'invalid_email', message: '目标邮箱格式不正确' }, 400);
    }

    const plan = String(body.plan || 'pro').toLowerCase();
    const role = String(body.role || 'user').toLowerCase();
    const durationDays = parseInt(body.duration_days, 10) || 365;

    let expiresAt = null;
    if (durationDays >= 30000 || plan === 'lifetime') {
      expiresAt = '2099-12-31T23:59:59.000Z';
    } else {
      expiresAt = new Date(Date.now() + durationDays * 86400 * 1000).toISOString();
    }

    const memberRecord = {
      email: targetEmail,
      plan: plan === 'yearly' ? 'pro' : plan,
      plan_display: plan,
      role: ADMIN_EMAILS.includes(targetEmail) ? 'admin' : role,
      status: plan === 'free' ? 'inactive' : 'paid',
      granted_at: new Date().toISOString(),
      expires_at: plan === 'free' ? null : expiresAt,
      granted_by: `super_admin:${adminEmail || 'root'}`,
    };

    if (env.ab_test) {
      // 1. Save member record
      await env.ab_test.put(`member:${targetEmail}`, JSON.stringify(memberRecord), {
        expirationTtl: 86400 * 365 * 10,
      });

      // 2. Also update user profile plan if user exists
      try {
        const userRaw = await env.ab_test.get(`user:${targetEmail}`);
        if (userRaw) {
          const parsedUser = JSON.parse(userRaw);
          parsedUser.plan = memberRecord.plan;
          parsedUser.updatedAt = new Date().toISOString();
          await env.ab_test.put(`user:${targetEmail}`, JSON.stringify(parsedUser));
        }
      } catch (_) {}
    }

    return json({
      ok: true,
      message: `已成功为 ${targetEmail} 配置【${memberRecord.plan.toUpperCase()}】会员权限`,
      record: memberRecord,
    });
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type, x-admin-email, x-session-token',
    },
  });
}
