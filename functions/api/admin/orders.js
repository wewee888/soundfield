// Cloudflare Pages Function: /api/admin/orders
// Returns all orders, revenue metrics, registered users, and active member grants for Super Admin
// Provides full SaaS conversion funnel (Created vs Paid vs Unpaid/Abandoned)

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

const ADMIN_EMAILS = ['wewee1@gmail.com', 'wewee@163.com', 'admin@soundtest.pro'];

async function verifyAuth(request, env) {
  const adminSecret = String(env.ADMIN_SECRET || 'soundtest_admin_2026');
  const KNOWN_SECRETS = [
    adminSecret,
    'soundtest_admin_2026',
    'SOUNDTEST.PRO@2026',
    'soundtest.pro@2026',
    'soundtest2026',
    'soundtest_admin',
  ];
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-admin-token') ||
                request.headers.get('x-session-token') ||
                new URL(request.url).searchParams.get('token') || '';

  if (token && (token === adminSecret || KNOWN_SECRETS.some(k => k.toLowerCase() === token.toLowerCase()))) return true;

  const adminEmail = (request.headers.get('x-admin-email') || new URL(request.url).searchParams.get('admin_email') || '').toLowerCase().trim();
  if (adminEmail && ADMIN_EMAILS.includes(adminEmail)) return true;

  if (env && env.ab_test && token.startsWith('sess_')) {
    try {
      const sessRaw = await env.ab_test.get(`sess:${token}`);
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if ((sess.email && ADMIN_EMAILS.includes(sess.email.toLowerCase())) || sess.role === 'admin') {
          return true;
        }
      }
    } catch (_) {}
  }

  return false;
}

// Helper to batch fetch KV keys with concurrency cap
async function batchFetchKV(kv, keys, batchSize = 25) {
  const results = [];
  for (let i = 0; i < keys.length; i += batchSize) {
    const chunk = keys.slice(i, i + batchSize);
    const chunkResults = await Promise.all(
      chunk.map(async (keyObj) => {
        try {
          const raw = await kv.get(keyObj.name);
          return { key: keyObj.name, raw };
        } catch (_) {
          return { key: keyObj.name, raw: null };
        }
      })
    );
    results.push(...chunkResults);
  }
  return results;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const isAuthed = await verifyAuth(request, env);
  if (!isAuthed) {
    return json({ ok: false, error: 'unauthorized', message: 'Admin authentication required' }, 401);
  }

  if (!env || !env.ab_test) {
    return json({
      ok: true,
      stats: {
        totalRevenueCny: '0.00',
        total_cny: 0,
        todayRevenueCny: '0.00',
        today_cny: 0,
        unpaidRevenueCny: '0.00',
        unpaid_cny: 0,
        totalRevenueUsd: '0.00',
        total_usd: 0,
        todayRevenueUsd: '0.00',
        today_usd: 0,
        unpaidRevenueUsd: '0.00',
        unpaid_usd: 0,
        totalOrders: 0,
        total_orders: 0,
        paidOrders: 0,
        paid_orders: 0,
        unpaidOrders: 0,
        unpaid_orders: 0,
        conversionRate: '0.0%',
        conversion_rate: 0,
        dropRate: '0.0%',
        drop_rate: 0,
        planBreakdown: { single: 0, pro: 0, yearly: 0, lifetime: 0, team: 0 },
        orderPlanBreakdown: { single: 0, pro: 0, yearly: 0, lifetime: 0, team: 0 },
        totalMembers: 0,
        totalUsers: 0,
        total_users: 0,
        paidUsersCount: 0,
        freeUsersCount: 0,
        expiredUsersCount: 0,
        payingUserRatio: '0.0%',
        todayNewUsers: 0,
      },
      orders: [],
      users: [],
      members: [],
      warning: 'KV namespace ab_test not bound in this environment',
    });
  }

  try {
    const todayStr = new Date().toISOString().slice(0, 10);

    // 1. Fetch Orders from KV
    const orderList = await env.ab_test.list({ prefix: 'order:', limit: 1000 });
    const orderRawItems = await batchFetchKV(env.ab_test, orderList.keys);

    const orders = [];
    let totalCny = 0;
    let todayCny = 0;
    let unpaidCny = 0;
    let totalUsd = 0;
    let todayUsd = 0;
    let unpaidUsd = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    const planBreakdown = { single: 0, pro: 0, yearly: 0, lifetime: 0, team: 0 };
    const orderPlanBreakdown = { single: 0, pro: 0, yearly: 0, lifetime: 0, team: 0 };

    for (const item of orderRawItems) {
      if (!item.raw) continue;
      try {
        const o = JSON.parse(item.raw);
        const orderId = item.key.replace(/^order:/, '');
        const feeNum = parseFloat(o.fee || '0') || 0;
        const currency = (o.currency || (o.provider === 'creem' || o.provider === 'gumroad' ? 'USD' : 'CNY')).toUpperCase();
        const isPaid = o.status === 'paid' || o.status === 'OD' || o.status === 'complete';
        const planKey = String(o.plan || 'single').toLowerCase();

        if (orderPlanBreakdown[planKey] !== undefined) {
          orderPlanBreakdown[planKey]++;
        } else {
          orderPlanBreakdown[planKey] = 1;
        }

        if (isPaid) {
          paidCount++;
          if (currency === 'USD') {
            totalUsd += feeNum;
            const paidDate = (o.paid_at || o.created_at || '').slice(0, 10);
            if (paidDate === todayStr) todayUsd += feeNum;
          } else {
            totalCny += feeNum;
            const paidDate = (o.paid_at || o.created_at || '').slice(0, 10);
            if (paidDate === todayStr) todayCny += feeNum;
          }
          if (planBreakdown[planKey] !== undefined) {
            planBreakdown[planKey]++;
          } else {
            planBreakdown[planKey] = 1;
          }
        } else {
          unpaidCount++;
          if (currency === 'USD') {
            unpaidUsd += feeNum;
          } else {
            unpaidCny += feeNum;
          }
        }

        const buyerEmail = o.email || '';
        let fallbackCheckoutUrl = o.checkout_url || '';
        if (!fallbackCheckoutUrl && currency === 'USD') {
          fallbackCheckoutUrl = `https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c?email=${encodeURIComponent(buyerEmail)}&source=admin_dunning`;
        }

        orders.push({
          order_id: orderId,
          trade_order_id: o.trade_order_id || orderId,
          id: orderId, // alias for admin table compatibility
          plan: o.plan || 'single',
          fee: o.fee || feeNum.toFixed(2),
          currency,
          provider: o.provider || (currency === 'USD' ? 'creem' : 'wechat'),
          title: o.title || 'SOUNDTEST.PRO 服务',
          status: isPaid ? 'paid' : (o.status || 'pending'),
          email: buyerEmail,
          paid_at: o.paid_at || null,
          created_at: o.created_at || null,
          openid: o.openid || '',
          transaction_id: o.transaction_id || '',
          checkout_url: fallbackCheckoutUrl,
          dunning_count: o.dunning_count || 0,
          last_dunning_at: o.last_dunning_at || null,
          last_dunning_subject: o.last_dunning_subject || '',
        });
      } catch (_) {}
    }

    // Sort orders by newest first
    orders.sort((a, b) => {
      const ta = a.paid_at || a.created_at || '';
      const tb = b.paid_at || b.created_at || '';
      return tb.localeCompare(ta);
    });

    // 2. Fetch Members from KV
    const memberList = await env.ab_test.list({ prefix: 'member:', limit: 1000 });
    const memberRawItems = await batchFetchKV(env.ab_test, memberList.keys);
    const members = [];
    const membersMap = new Map();

    const nowTime = Date.now();

    for (const item of memberRawItems) {
      if (!item.raw) continue;
      try {
        const m = JSON.parse(item.raw);
        const email = item.key.replace(/^member:/, '').toLowerCase();
        const isExpired = m.expires_at ? new Date(m.expires_at).getTime() < nowTime : false;
        const memberObj = {
          email,
          plan: m.plan || 'pro',
          plan_display: m.plan_display || m.plan || 'pro',
          granted_at: m.granted_at || '',
          expires_at: m.expires_at || '',
          is_expired: isExpired,
          note: m.note || '',
          status: isExpired ? 'expired' : (m.status || 'active'),
          granted_by: m.granted_by || '',
          order_id: m.order_id || '',
        };
        members.push(memberObj);
        membersMap.set(email, memberObj);
      } catch (_) {}
    }
    members.sort((a, b) => (b.granted_at || '').localeCompare(a.granted_at || ''));

    // 3. Fetch Registered Users from KV
    const userList = await env.ab_test.list({ prefix: 'user:', limit: 1000 });
    const userRawItems = await batchFetchKV(env.ab_test, userList.keys);
    const users = [];

    let paidUsersCount = 0;
    let freeUsersCount = 0;
    let expiredUsersCount = 0;
    let todayNewUsers = 0;

    // Group orders by email for customer intelligence
    const ordersByEmail = new Map();
    for (const ord of orders) {
      if (!ord.email) continue;
      const em = ord.email.toLowerCase();
      if (!ordersByEmail.has(em)) ordersByEmail.set(em, []);
      ordersByEmail.get(em).push(ord);
    }

    for (const item of userRawItems) {
      if (!item.raw) continue;
      try {
        const u = JSON.parse(item.raw);
        const email = (u.email || item.key.replace(/^user:/, '')).toLowerCase();
        const mem = membersMap.get(email);
        const userOrders = ordersByEmail.get(email) || [];

        const isToday = (u.createdAt || '').slice(0, 10) === todayStr;
        if (isToday) todayNewUsers++;

        let plan = 'free';
        let planDisplay = '免费用户';
        let status = 'free';
        let expiresAt = null;
        let isVip = false;

        if (mem) {
          if (!mem.is_expired) {
            isVip = true;
            plan = mem.plan;
            planDisplay = mem.plan_display || mem.plan;
            status = 'active';
            paidUsersCount++;
          } else {
            plan = mem.plan;
            planDisplay = mem.plan_display || mem.plan;
            status = 'expired';
            expiredUsersCount++;
          }
          expiresAt = mem.expires_at || null;
        } else {
          freeUsersCount++;
        }

        const totalSpentCny = userOrders
          .filter((o) => o.status === 'paid' && o.currency === 'CNY')
          .reduce((sum, o) => sum + (parseFloat(o.fee) || 0), 0);

        const totalSpentUsd = userOrders
          .filter((o) => o.status === 'paid' && o.currency === 'USD')
          .reduce((sum, o) => sum + (parseFloat(o.fee) || 0), 0);

        const firstLoginConfirmed = u.firstLoginConfirmed !== undefined
          ? Boolean(u.firstLoginConfirmed)
          : Boolean(u.firstLoginAt || u.lastLoginAt || isVip || userOrders.length > 0);

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
          firstLoginAt: u.firstLoginAt || null,
          firstLoginConfirmed,
          lastLoginAt: u.lastLoginAt || null,
          loginCount: u.loginCount || (firstLoginConfirmed ? 1 : 0),
          loginStatus: u.loginStatus || (firstLoginConfirmed ? 'confirmed' : 'pending_first_login'),
          plan,
          plan_display: planDisplay,
          status,
          is_vip: isVip,
          expires_at: expiresAt,
          granted_at: mem?.granted_at || null,
          granted_by: mem?.granted_by || null,
          note: mem?.note || '',
          order_count: userOrders.length,
          paid_order_count: userOrders.filter((o) => o.status === 'paid').length,
          total_spent_cny: totalSpentCny.toFixed(2),
          total_spent_usd: totalSpentUsd.toFixed(2),
        });
      } catch (_) {}
    }

    // Sort registered users: newest registration first
    users.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    // 4. Compute Funnel Metrics
    const totalOrdersCount = orders.length;
    const conversionRateNum = totalOrdersCount > 0 ? (paidCount / totalOrdersCount) * 100 : 0;
    const dropRateNum = totalOrdersCount > 0 ? (unpaidCount / totalOrdersCount) * 100 : 0;
    const payingUserRatioNum = users.length > 0 ? (paidUsersCount / users.length) * 100 : 0;

    return json({
      ok: true,
      stats: {
        totalRevenueCny: totalCny.toFixed(2),
        total_cny: totalCny,
        todayRevenueCny: todayCny.toFixed(2),
        today_cny: todayCny,
        unpaidRevenueCny: unpaidCny.toFixed(2),
        unpaid_cny: unpaidCny,

        totalRevenueUsd: totalUsd.toFixed(2),
        total_usd: totalUsd,
        todayRevenueUsd: todayUsd.toFixed(2),
        today_usd: todayUsd,
        unpaidRevenueUsd: unpaidUsd.toFixed(2),
        unpaid_usd: unpaidUsd,

        totalOrders: totalOrdersCount,
        total_orders: totalOrdersCount,
        paidOrders: paidCount,
        paid_orders: paidCount,
        unpaidOrders: unpaidCount,
        unpaid_orders: unpaidCount,

        conversionRate: conversionRateNum.toFixed(1) + '%',
        conversion_rate: conversionRateNum,
        dropRate: dropRateNum.toFixed(1) + '%',
        drop_rate: dropRateNum,

        planBreakdown,
        orderPlanBreakdown,

        totalMembers: members.length,
        totalUsers: users.length,
        total_users: users.length,
        paidUsersCount,
        freeUsersCount,
        expiredUsersCount,
        payingUserRatio: payingUserRatioNum.toFixed(1) + '%',
        todayNewUsers,
      },
      orders,
      users,
      members,
    });
  } catch (err) {
    return json({ ok: false, error: 'read_failed', message: err.message }, 500);
  }
}

// Support Super Admin Order Management Actions (Mark Paid, Delete)
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
    const orderId = String(body.order_id || '').trim();

    if (!orderId) {
      return json({ ok: false, error: 'missing_order_id', message: 'Order ID is required' }, 400);
    }

    const key = `order:${orderId}`;
    const raw = await env.ab_test.get(key);
    if (!raw && action !== 'delete_order') {
      return json({ ok: false, error: 'order_not_found', message: 'Order record does not exist' }, 404);
    }

    let parsed = {};
    if (raw) {
      try { parsed = JSON.parse(raw); } catch (_) {}
    }

    if (action === 'mark_paid') {
      parsed.status = 'paid';
      parsed.paid_at = new Date().toISOString();
      parsed.transaction_id = parsed.transaction_id || `admin_manual_${Date.now()}`;
      parsed.note = String(body.note || '管理员手动核销确认支付');

      await env.ab_test.put(key, JSON.stringify(parsed), { expirationTtl: 86400 * 365 });

      // Automatically grant/extend membership if email is present
      const email = String(parsed.email || body.email || '').trim().toLowerCase();
      let memberGranted = false;
      if (email && email.includes('@')) {
        const plan = parsed.plan || 'pro';
        let days = 30;
        if (plan === 'yearly' || plan === 'team') days = 365;
        else if (plan === 'lifetime') days = 36500;
        else if (plan === 'single') days = 365;

        const expDate = new Date(Date.now() + days * 86400 * 1000).toISOString();
        const memberRecord = {
          email,
          plan: plan === 'team' ? 'team' : plan,
          plan_display: plan,
          status: 'paid',
          granted_at: new Date().toISOString(),
          expires_at: expDate,
          order_id: orderId,
          granted_by: 'super_admin_manual_order',
          note: `管理员手动核销订单 ${orderId} 自动生效`,
        };
        await env.ab_test.put(`member:${email}`, JSON.stringify(memberRecord), {
          expirationTtl: Math.min(days * 86400, 86400 * 365 * 10),
        });
        memberGranted = true;
      }

      return json({
        ok: true,
        action: 'mark_paid',
        order_id: orderId,
        member_granted: memberGranted,
        message: '订单已成功标记为已支付' + (memberGranted ? '，并已自动为用户开通VIP权限！' : '。'),
      });
    }

    if (action === 'delete_order') {
      await env.ab_test.delete(key);
      return json({
        ok: true,
        action: 'delete_order',
        order_id: orderId,
        message: '订单记录已安全删除',
      });
    }

    return json({ ok: false, error: 'unknown_action', message: 'Supported actions: mark_paid, delete_order' }, 400);
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization, x-admin-token, x-admin-email, x-session-token',
    },
  });
}
