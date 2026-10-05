// Universal MD5 helper for Cloudflare Workers / Node.js
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

const PLAN_CONFIGS = {
  single: { fee: '3.90', title: 'SOUNDTEST.PRO-单次报告取证解锁' },
  pro: { fee: '9.90', title: 'SOUNDTEST.PRO-专业版月度订阅' },
  yearly: { fee: '19.90', title: 'SOUNDTEST.PRO-专业版年度订阅' },
  lifetime: { fee: '39.90', title: 'SOUNDTEST.PRO-终身买断专业版' },
  team: { fee: '1998.00', title: 'SOUNDTEST.PRO-企业团队年度版' },
};

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
    const plan = String(body.plan || 'single').toLowerCase();
    const cfg = PLAN_CONFIGS[plan] || PLAN_CONFIGS.single;

    // Strict IP Country & Geo Pricing Enforcement:
    // Chinese users get CNY domestic pricing.
    // Pure overseas visitors (US, GB, JP, etc. on non-Chinese versions) pay USD via Creem.io and are blocked here.
    const country = String(request.cf?.country || request.headers.get('cf-ipcountry') || '').toUpperCase();
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const acceptLang = String(request.headers.get('accept-language') || '').toLowerCase();
    const isZh = String(body.lang || '').startsWith('zh') || acceptLang.includes('zh') || (request.headers.get('referer') || '').includes('/zh');

    if (!isLocalhost && country && country !== 'CN' && !isZh) {
      return json({
        ok: false,
        error: 'geo_pricing_restricted',
        message: '人民币测试价格仅支持中国大陆及中文用户访问 / CNY test pricing is restricted to users in the Chinese region.',
        pricingTier: 'overseas',
        currency: 'USD',
        country,
      }, 403);
    }

    const appid = String(env.HUPIJIAO_APPID || '201906177810');
    const appsecret = String(env.HUPIJIAO_APPSECRET || 'f94f1168d88f40156b719b84b8823681');
    const gateway = String(env.HUPIJIAO_GATEWAY || 'https://api.xunhupay.com/payment/do.html');

    const trade_order_id = `sf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const time = String(Math.floor(Date.now() / 1000));
    const nonce_str = `rnd_${Math.random().toString(36).slice(2, 10)}`;
    const notify_url = 'https://soundtest.pro/api/payment/hupijiao-notify';
    const return_url = String(body.return_url || 'https://soundtest.pro/soundtest.html');

    const params = {
      version: '1.1',
      appid,
      trade_order_id,
      total_fee: cfg.fee,
      title: cfg.title,
      time,
      notify_url,
      return_url,
      nonce_str,
    };

    // Calculate MD5 hash
    const sortedKeys = Object.keys(params).sort();
    const queryStr = sortedKeys
      .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    const signStr = queryStr + appsecret;
    const hash = (await md5(signStr)).toLowerCase();
    params.hash = hash;

    // Send order to XunhuPay gateway
    const resp = await fetch(gateway, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await resp.json().catch(() => ({}));
    if (result.errcode === 0) {
      // Save order metadata in KV if available
      if (env.ab_test) {
        try {
          await env.ab_test.put(
            `order:${trade_order_id}`,
            JSON.stringify({
              plan,
              fee: cfg.fee,
              currency: 'CNY',
              provider: 'wechat',
              status: 'pending',
              email: String(body.email || '').trim().toLowerCase(),
              open_order_id: String(result.openid || ''),
              created_at: new Date().toISOString(),
            }),
            { expirationTtl: 86400 * 30 }
          );
        } catch (_) {}
      }

      return json({
        ok: true,
        order_id: trade_order_id,
        open_order_id: String(result.openid || ''),
        plan,
        total_fee: cfg.fee,
        title: cfg.title,
        url: result.url,
        url_qrcode: result.url_qrcode,
      });
    }

    return json({
      ok: false,
      error: result.errmsg || 'payment_init_failed',
      errcode: result.errcode,
    }, 500);
  } catch (err) {
    return json({ ok: false, error: err.message || 'internal_error' }, 500);
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
