// Order status check endpoint (checks KV and XunhuPay official query API)
export async function md5(message) {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const digest = await crypto.subtle.digest({ name: 'MD5' }, data);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch (_) {}
  const { createHash } = await import('node:crypto');
  return createHash('md5').update(message, 'utf8').digest('hex');
}

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

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const order_id = url.searchParams.get('order_id') || '';
    const open_order_id = url.searchParams.get('open_order_id') || '';

    if (!order_id && !open_order_id) {
      return json({ paid: false, error: 'missing_order_id' }, 400);
    }

    // 1. Check Cloudflare KV first if available
    if (env.ab_test && order_id) {
      try {
        const stored = await env.ab_test.get(`order:${order_id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.status === 'paid') {
            return json({
              paid: true,
              plan: parsed.plan,
              fee: parsed.fee,
              order_id,
              open_order_id: parsed.open_order_id || open_order_id,
            });
          }
        }
      } catch (_) {}
    }

    // 2. Query XunhuPay official query API as real-time source of truth
    const appid = String(env.HUPIJIAO_APPID || '').trim();
    const appsecret = String(env.HUPIJIAO_APPSECRET || '').trim();
    if (!appid || !appsecret) {
      return json({ paid: false, error: 'gateway_unconfigured' });
    }
    const queryUrl = 'https://api.xunhupay.com/payment/query.html';

    const params = {
      appid,
      time: String(Math.floor(Date.now() / 1000)),
      nonce_str: `rnd_${Math.random().toString(36).slice(2, 10)}`,
    };
    if (open_order_id) {
      params.open_order_id = open_order_id;
    } else {
      params.out_trade_order = order_id;
    }

    const sortedKeys = Object.keys(params).sort();
    const queryStr = sortedKeys
      .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    const signStr = queryStr + appsecret;
    params.hash = (await md5(signStr)).toLowerCase();

    const queryResp = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const result = await queryResp.json().catch(() => ({}));

    if (result.errcode === 0 && result.data) {
      const status = String(result.data.status || '');
      const isPaid = status === 'OD' || status === 'complete' || status === 'paid';

      let plan = 'single';
      const fee = String(result.data.total_amount || '');
      if (fee === '9.90') plan = 'pro';
      else if (fee === '19.90') plan = 'yearly';
      else if (fee === '39.90') plan = 'lifetime';
      else if (fee === '1998.00' || fee === '1998') plan = 'team';

      // If KV stored the order creation plan, prefer it
      if (env.ab_test && order_id) {
        try {
          const preOrder = await env.ab_test.get(`order:${order_id}`);
          if (preOrder) {
            const parsedPre = JSON.parse(preOrder);
            if (parsedPre.plan) plan = parsedPre.plan;
          }
        } catch (_) {}
      }

      if (isPaid && env.ab_test && order_id) {
        try {
          await env.ab_test.put(
            `order:${order_id}`,
            JSON.stringify({
              plan,
              fee,
              status: 'paid',
              open_order_id: result.data.open_order_id || open_order_id,
              paid_at: result.data.paid_date || new Date().toISOString(),
            }),
            { expirationTtl: 86400 * 365 }
          );
        } catch (_) {}
      }

      return json({
        paid: isPaid,
        status,
        plan,
        fee,
        order_id,
        open_order_id: result.data.open_order_id || open_order_id,
      });
    }

    return json({ paid: false, status: 'pending', order_id });
  } catch (err) {
    return json({ paid: false, error: err.message }, 500);
  }
}
