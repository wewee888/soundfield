// Cloudflare Pages Function: /api/admin/logout
// Secure Session Destruction for Super Admin Console

import { destroyAdminSession } from './_auth.js';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate',
      'access-control-allow-origin': '*',
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const authHeader = request.headers.get('authorization') || '';
    const body = await request.json().catch(() => ({}));
    const token =
      authHeader.replace(/^Bearer\s+/i, '').trim() ||
      request.headers.get('x-admin-token') ||
      body.token ||
      '';

    if (token) {
      await destroyAdminSession(env, token);
    }

    return json({ ok: true, message: 'Admin session destroyed successfully' });
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
      'access-control-allow-headers': 'content-type, authorization, x-admin-token, x-admin-email',
    },
  });
}
