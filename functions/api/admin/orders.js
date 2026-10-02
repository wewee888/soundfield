// Cloudflare Pages Function: /api/admin/orders
// Returns all orders, revenue metrics, and active member grants for Super Admin

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

function verifyAuth(request, env) {
  const adminSecret = String(env.ADMIN_SECRET || 'soundtest_admin_2026');
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-admin-token') ||
                new URL(request.url).searchParams.get('token') || '';
  return token === adminSecret;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!verifyAuth(request, env)) {
    return json({ ok: false, error: 'unauthorized', message: 'Admin authentication required' }, 401);
  }

  if (!env.ab_test) {
    return json({
      ok: true,
      stats: {
        totalRevenueCny: '0.00',
        todayRevenueCny: '0.00',
        totalOrders: 0,
        paidOrders: 0,
        planBreakdown: { single: 0, pro: 0, yearly: 0, lifetime: 0 },
      },
      orders: [],
      members: [],
      warning: 'KV namespace ab_test not bound in this environment',
    });
  }

  try {
    // 1. Fetch all orders from KV
    const orderList = await env.ab_test.list({ prefix: 'order:', limit: 500 });
    const orders = [];
    const todayStr = new Date().toISOString().slice(0, 10);
    let totalCny = 0;
    let todayCny = 0;
    let paidCount = 0;
    const planBreakdown = { single: 0, pro: 0, yearly: 0, lifetime: 0 };

    for (const keyObj of orderList.keys) {
      try {
        const raw = await env.ab_test.get(keyObj.name);
        if (!raw) continue;
        const item = JSON.parse(raw);
        const orderId = keyObj.name.replace(/^order:/, '');
        const feeNum = parseFloat(item.fee || '0') || 0;
        const isPaid = item.status === 'paid' || item.status === 'OD' || item.status === 'complete';

        if (isPaid) {
          paidCount++;
          totalCny += feeNum;
          const paidDate = (item.paid_at || item.created_at || '').slice(0, 10);
          if (paidDate === todayStr) {
            todayCny += feeNum;
          }
          const p = String(item.plan || 'single').toLowerCase();
          if (planBreakdown[p] !== undefined) planBreakdown[p]++;
        }

        orders.push({
          order_id: orderId,
          trade_order_id: item.trade_order_id || orderId,
          plan: item.plan || 'single',
          fee: item.fee || '0.00',
          title: item.title || 'SOUNDTEST.PRO 服务',
          status: isPaid ? 'paid' : (item.status || 'pending'),
          paid_at: item.paid_at || null,
          created_at: item.created_at || keyObj.metadata?.created_at || null,
          openid: item.openid || '',
          transaction_id: item.transaction_id || '',
        });
      } catch (_) {}
    }

    // Sort orders by date descending
    orders.sort((a, b) => {
      const ta = a.paid_at || a.created_at || '';
      const tb = b.paid_at || b.created_at || '';
      return tb.localeCompare(ta);
    });

    // 2. Fetch all admin-granted members from KV
    const memberList = await env.ab_test.list({ prefix: 'member:', limit: 200 });
    const members = [];
    for (const keyObj of memberList.keys) {
      try {
        const raw = await env.ab_test.get(keyObj.name);
        if (!raw) continue;
        const m = JSON.parse(raw);
        members.push({
          email: keyObj.name.replace(/^member:/, ''),
          plan: m.plan || 'pro',
          granted_at: m.granted_at || '',
          expires_at: m.expires_at || '',
          note: m.note || '',
          status: m.status || 'active',
        });
      } catch (_) {}
    }

    members.sort((a, b) => (b.granted_at || '').localeCompare(a.granted_at || ''));

    return json({
      ok: true,
      stats: {
        totalRevenueCny: totalCny.toFixed(2),
        todayRevenueCny: todayCny.toFixed(2),
        totalOrders: orders.length,
        paidOrders: paidCount,
        planBreakdown,
        totalMembers: members.length,
      },
      orders,
      members,
    });
  } catch (err) {
    return json({ ok: false, error: 'read_failed', message: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization, x-admin-token',
    },
  });
}
