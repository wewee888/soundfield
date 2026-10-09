// Asynchronous callback endpoint for XunhuPay (Hupijiao)
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

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const contentType = request.headers.get('content-type') || '';
    let data = {};

    if (contentType.includes('application/json')) {
      data = await request.json().catch(() => ({}));
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData().catch(() => new FormData());
      for (const [key, val] of formData.entries()) {
        data[key] = val;
      }
    } else {
      const text = await request.text().catch(() => '');
      const searchParams = new URLSearchParams(text);
      for (const [key, val] of searchParams.entries()) {
        data[key] = val;
      }
    }

    const appsecret = String(env.HUPIJIAO_APPSECRET || '').trim();
    if (!appsecret) {
      console.error('[Hupijiao Notify] Critical: HUPIJIAO_APPSECRET environment variable is not configured');
      return new Response('fail: gateway secret unconfigured', { status: 500 });
    }
    const receivedHash = String(data.hash || '').toLowerCase();
    const trade_order_id = String(data.trade_order_id || '');
    const status = String(data.status || '');

    // Verify hash signature
    const sortedKeys = Object.keys(data).sort();
    const queryStr = sortedKeys
      .filter((k) => k !== 'hash' && data[k] !== undefined && data[k] !== null && data[k] !== '')
      .map((k) => `${k}=${data[k]}`)
      .join('&');
    const signStr = queryStr + appsecret;
    const computedHash = (await md5(signStr)).toLowerCase();

    if (computedHash !== receivedHash) {
      return new Response('fail: invalid signature', { status: 400 });
    }

    // If payment is successful (status 'OD' or 'complete')
    if (status === 'OD' || status === 'complete' || status === 'paid') {
      if (env.ab_test && trade_order_id) {
        try {
          const existing = await env.ab_test.get(`order:${trade_order_id}`).catch(() => null);
          let parsed = {};
          if (existing) {
            try { parsed = JSON.parse(existing); } catch (_) {}
          }
          parsed.status = 'paid';
          parsed.paid_at = new Date().toISOString();
          parsed.transaction_id = data.transaction_id || '';
          parsed.openid = data.openid || '';
          await env.ab_test.put(`order:${trade_order_id}`, JSON.stringify(parsed), { expirationTtl: 86400 * 365 });

          // If user email was associated, activate their membership in KV
          if (parsed.email && parsed.email.includes('@')) {
            const plan = parsed.plan || 'pro';
            let days = 30;
            if (plan === 'yearly') days = 365;
            else if (plan === 'team') days = 365;
            else if (plan === 'lifetime') days = 36500;
            else if (plan === 'single') days = 365;

            const expDate = new Date(Date.now() + days * 86400 * 1000).toISOString();
            const memberRecord = {
              email: parsed.email,
              plan: plan === 'team' ? 'team' : (plan === 'yearly' || plan === 'lifetime' || plan === 'pro' ? 'pro' : plan),
              plan_display: plan,
              status: 'paid',
              granted_at: new Date().toISOString(),
              expires_at: expDate,
              order_id: trade_order_id,
              granted_by: 'wechat_pay',
            };
            await env.ab_test.put(`member:${parsed.email}`, JSON.stringify(memberRecord), {
              expirationTtl: Math.min(days * 86400, 86400 * 365 * 10),
            });
          }
        } catch (_) {}
      }
    }

    // Return success to Hupijiao gateway so it stops sending retries
    return new Response('success', {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    return new Response('fail: ' + (err.message || 'error'), { status: 500 });
  }
}
