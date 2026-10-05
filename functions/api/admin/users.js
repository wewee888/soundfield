// Cloudflare Pages Function: /api/admin/users
// Dedicated User Registration & Profile Management Endpoint for Super Admin

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

async function verifyAuth(request, env) {
  const adminSecret = String(env.ADMIN_SECRET || 'soundtest_admin_2026');
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-admin-token') ||
                request.headers.get('x-session-token') ||
                new URL(request.url).searchParams.get('token') || '';

  if (token && token === adminSecret) return true;

  const adminEmail = (request.headers.get('x-admin-email') || new URL(request.url).searchParams.get('admin_email') || '').toLowerCase().trim();
  if (adminEmail && ADMIN_EMAILS.includes(adminEmail)) return true;

  if (env && env.ab_test && token.startsWith('sess_')) {
    try {
      const sessRaw = await env.ab_test.get(`sess:${token}`);
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if (sess.email && ADMIN_EMAILS.includes(sess.email.toLowerCase())) {
          return true;
        }
      }
    } catch (_) {}
  }

  return false;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const isAuthed = await verifyAuth(request, env);
  if (!isAuthed) {
    return json({ ok: false, error: 'unauthorized', message: 'Admin authentication required' }, 401);
  }

  if (!env || !env.ab_test) {
    return json({ ok: true, users: [], total: 0 });
  }

  try {
    const url = new URL(request.url);
    const targetEmail = (url.searchParams.get('email') || '').toLowerCase().trim();

    if (targetEmail) {
      // Query single user detail
      const userRaw = await env.ab_test.get(`user:${targetEmail}`);
      if (!userRaw) {
        return json({ ok: false, error: 'user_not_found', message: 'User not found' }, 404);
      }
      const user = JSON.parse(userRaw);
      const memRaw = await env.ab_test.get(`member:${targetEmail}`);
      const member = memRaw ? JSON.parse(memRaw) : null;

      return json({
        ok: true,
        user: {
          name: user.name,
          email: user.email,
          ip: user.ip || 'Unknown',
          country: user.country || 'US',
          city: user.city || '',
          region: user.region || '',
          language: user.language || 'en',
          sourcePage: user.sourcePage || '',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        membership: member || { plan: 'free', status: 'none', active: false },
      });
    }

    // List all users
    const userList = await env.ab_test.list({ prefix: 'user:', limit: 1000 });
    const users = [];

    for (const keyObj of userList.keys) {
      try {
        const raw = await env.ab_test.get(keyObj.name);
        if (!raw) continue;
        const u = JSON.parse(raw);
        const email = (u.email || keyObj.name.replace(/^user:/, '')).toLowerCase();
        const memRaw = await env.ab_test.get(`member:${email}`);
        const mem = memRaw ? JSON.parse(memRaw) : null;

        users.push({
          email,
          name: u.name || '未命名',
          ip: u.ip || 'Unknown',
          country: u.country || 'US',
          city: u.city || '',
          region: u.region || '',
          language: u.language || 'en',
          sourcePage: u.sourcePage || '',
          createdAt: u.createdAt || null,
          updatedAt: u.updatedAt || null,
          membership: mem || { plan: 'free', status: 'none' },
        });
      } catch (_) {}
    }

    users.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    return json({
      ok: true,
      total: users.length,
      users,
    });
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const isAuthed = await verifyAuth(request, env);
  if (!isAuthed) {
    return json({ ok: false, error: 'unauthorized', message: 'Admin authentication required' }, 401);
  }

  if (!env || !env.ab_test) {
    return json({ ok: false, error: 'kv_not_bound', message: 'KV ab_test is not bound' }, 503);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || '').trim().toLowerCase();
    const email = String(body.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return json({ ok: false, error: 'invalid_email', message: 'Valid email is required' }, 400);
    }

    if (action === 'adjust_vip') {
      const plan = String(body.plan || 'pro').toLowerCase();
      let days = parseInt(body.days || 30, 10);
      if (plan === 'lifetime') days = 36500;
      else if (plan === 'yearly' || plan === 'team') days = 365;

      const expDate = new Date(Date.now() + days * 86400 * 1000).toISOString();
      const memberRecord = {
        email,
        plan: plan === 'team' ? 'team' : plan,
        plan_display: plan,
        status: 'paid',
        granted_at: new Date().toISOString(),
        expires_at: expDate,
        granted_by: 'super_admin_user_mgmt',
        note: String(body.note || '管理员用户后台调整'),
      };

      await env.ab_test.put(`member:${email}`, JSON.stringify(memberRecord), {
        expirationTtl: Math.min(days * 86400, 86400 * 365 * 10),
      });

      return json({
        ok: true,
        action: 'adjust_vip',
        email,
        plan,
        expires_at: expDate,
        message: `用户 ${email} 已成功调级为 ${plan.toUpperCase()} 会员！`,
      });
    }

    if (action === 'revoke_vip') {
      await env.ab_test.delete(`member:${email}`);
      return json({
        ok: true,
        action: 'revoke_vip',
        email,
        message: `用户 ${email} 的 VIP 资格已撤销，恢复免费版`,
      });
    }

    if (action === 'update_profile' || action === 'edit_user') {
      const rawUser = await env.ab_test.get(`user:${email}`);
      if (!rawUser) {
        return json({ ok: false, error: 'user_not_found', message: 'User not found' }, 404);
      }
      const u = JSON.parse(rawUser);
      if (body.name !== undefined) u.name = String(body.name).trim();
      if (body.country !== undefined) u.country = String(body.country).trim().toUpperCase();
      if (body.language !== undefined) u.language = String(body.language).trim();
      u.updatedAt = new Date().toISOString();
      await env.ab_test.put(`user:${email}`, JSON.stringify(u));

      // Synchronize membership tier if plan is specified
      if (body.plan !== undefined) {
        const plan = String(body.plan).toLowerCase();
        if (plan === 'free') {
          await env.ab_test.delete(`member:${email}`);
        } else {
          let days = parseInt(body.days || 30, 10);
          if (plan === 'lifetime') days = 36500;
          else if (plan === 'yearly' || plan === 'team') days = 365;
          const expDate = body.expires_at || new Date(Date.now() + days * 86400 * 1000).toISOString();
          const memberRecord = {
            email,
            plan: plan === 'team' ? 'team' : plan,
            plan_display: plan,
            status: 'paid',
            granted_at: new Date().toISOString(),
            expires_at: expDate,
            granted_by: 'admin_edit_user',
            note: String(body.note || '管理员后台修改用户档案'),
          };
          await env.ab_test.put(`member:${email}`, JSON.stringify(memberRecord), {
            expirationTtl: Math.min(days * 86400, 86400 * 365 * 10),
          });
        }
      }

      return json({
        ok: true,
        action: 'edit_user',
        email,
        message: `用户 ${email} 的资料与会员权限已更新成功！`,
      });
    }

    if (action === 'delete_user') {
      await env.ab_test.delete(`user:${email}`);
      await env.ab_test.delete(`member:${email}`);
      return json({
        ok: true,
        action: 'delete_user',
        email,
        message: `用户 ${email} 及其会员记录已安全注销并永久抹除`,
      });
    }

    return json({ ok: false, error: 'unknown_action', message: 'Invalid action' }, 400);
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export async function onRequestPut(context) {
  const req = context.request;
  const body = await req.json().catch(() => ({}));
  body.action = body.action || 'edit_user';
  return onRequestPost({
    ...context,
    request: new Request(req.url, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(body),
    }),
  });
}

export async function onRequestDelete(context) {
  const req = context.request;
  const url = new URL(req.url);
  const email = (url.searchParams.get('email') || '').toLowerCase().trim();
  const body = { action: 'delete_user', email };
  return onRequestPost({
    ...context,
    request: new Request(req.url, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(body),
    }),
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization, x-admin-token, x-admin-email, x-session-token',
    },
  });
}
