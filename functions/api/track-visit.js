// Cloudflare Pages Function: /api/track-visit
// Zero-auth Edge Visitor Telemetry & Real-Time Intelligence Collector
// Automatically records anonymous visitors, pageviews, geo-location, referrers, and enforces IP-based pricing tier.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
      'pragma': 'no-cache',
      'expires': '0',
      'access-control-allow-origin': '*',
    },
  });
}

const COUNTRY_FLAGS = {
  US: '🇺🇸', CN: '🇨🇳', HK: '🇭🇰', TW: '🇹🇼', GB: '🇬🇧',
  JP: '🇯🇵', DE: '🇩🇪', FR: '🇫🇷', CA: '🇨🇦', AU: '🇦🇺',
  SG: '🇸🇬', KR: '🇰🇷', IN: '🇮🇳', RU: '🇷🇺', BR: '🇧🇷',
  NL: '🇳🇱', ES: '🇪🇸', IT: '🇮🇹', SE: '🇸🇪', CH: '🇨🇭',
};

function parseDevice(ua) {
  if (!ua) return '未知设备';
  if (/iPad/i.test(ua)) return 'iPad (平板)';
  if (/iPhone/i.test(ua)) return 'iPhone (iOS)';
  if (/Android/i.test(ua)) return 'Android (移动端)';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac (桌面端)';
  if (/Windows/i.test(ua)) return 'Windows (PC)';
  if (/Linux/i.test(ua)) return 'Linux (桌面端)';
  return '桌面浏览器';
}

function parseChannel(referrer) {
  if (!referrer) return '直接访问 (Direct)';
  const ref = referrer.toLowerCase();
  if (ref.includes('google.')) return 'Google 搜索';
  if (ref.includes('bing.')) return 'Bing 搜索';
  if (ref.includes('baidu.')) return '百度搜索';
  if (ref.includes('yahoo.')) return 'Yahoo 搜索';
  if (ref.includes('duckduckgo.')) return 'DuckDuckGo';
  if (ref.includes('twitter.com') || ref.includes('t.co') || ref.includes('x.com')) return 'X (Twitter)';
  if (ref.includes('facebook.com') || ref.includes('fb.com')) return 'Facebook';
  if (ref.includes('reddit.com')) return 'Reddit';
  if (ref.includes('youtube.com')) return 'YouTube';
  if (ref.includes('weixin') || ref.includes('qq.com')) return '微信生态';
  return '外部引流 (Referral)';
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const cf = request.cf || {};

    const clientIp = request.headers.get('cf-connecting-ip') ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     'Unknown';

    const country = String(cf.country || request.headers.get('cf-ipcountry') || 'US').toUpperCase();
    const city = cf.city || '';
    const region = cf.region || '';
    const colo = cf.colo || '';
    const userAgent = request.headers.get('user-agent') || '';

    const isChinaIp = (country === 'CN');
    const pricingTier = isChinaIp ? 'china_test' : 'overseas';
    const currency = isChinaIp ? 'CNY' : 'USD';
    const flag = COUNTRY_FLAGS[country] || '🌐';

    const now = new Date().toISOString();
    const todayStr = now.slice(0, 10);

    const visitorId = String(body.visitorId || `vid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`).slice(0, 50);
    const token = String(body.sessionToken || '').trim();
    const page = String(body.page || '/').slice(0, 200);
    const title = String(body.title || '').slice(0, 120);
    const referrer = String(body.referrer || request.headers.get('referer') || '').slice(0, 250);
    const channel = parseChannel(referrer);
    const device = parseDevice(userAgent);

    let email = String(body.email || '').toLowerCase().trim();
    let userName = '';
    let isRegistered = false;
    let isVip = false;
    let userPlan = 'free';

    // If session token provided, lookup user and VIP status
    if (env && env.ab_test && token.startsWith('sess_')) {
      try {
        const sessRaw = await env.ab_test.get(`sess:${token}`);
        if (sessRaw) {
          const sess = JSON.parse(sessRaw);
          if (sess.email) {
            email = sess.email.toLowerCase();
            isRegistered = true;
            userPlan = sess.plan || 'free';
            isVip = userPlan !== 'free';

            const userRaw = await env.ab_test.get(`user:${email}`);
            if (userRaw) {
              const u = JSON.parse(userRaw);
              userName = u.name || '';
            }
          }
        }
      } catch (_) {}
    } else if (env && env.ab_test && email && email.includes('@')) {
      try {
        const userRaw = await env.ab_test.get(`user:${email}`);
        if (userRaw) {
          const u = JSON.parse(userRaw);
          userName = u.name || '';
          isRegistered = true;
          const memRaw = await env.ab_test.get(`member:${email}`);
          if (memRaw) {
            const m = JSON.parse(memRaw);
            if (m.status === 'paid' || !m.expires_at || new Date(m.expires_at).getTime() > Date.now()) {
              isVip = true;
              userPlan = m.plan || 'pro';
            }
          }
        }
      } catch (_) {}
    }

    // Record Visitor Event
    const visitorEvent = {
      id: `vt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      visitorId,
      email: email || null,
      userName: userName || null,
      isRegistered,
      isVip,
      plan: userPlan,
      ip: clientIp,
      country,
      city,
      region,
      colo,
      flag,
      pricingTier,
      currency,
      page,
      title,
      referrer,
      channel,
      device,
      userAgent: userAgent.slice(0, 150),
      timestamp: now,
    };

    if (env && env.ab_test) {
      try {
        // 1. Ingest into Recent Visitors Ring Buffer (max 100 entries)
        const recentRaw = await env.ab_test.get('visitors:recent');
        let recentVisitors = [];
        if (recentRaw) {
          try { recentVisitors = JSON.parse(recentRaw); } catch (_) {}
        }
        if (!Array.isArray(recentVisitors)) recentVisitors = [];

        recentVisitors.unshift(visitorEvent);
        if (recentVisitors.length > 250) {
          recentVisitors = recentVisitors.slice(0, 250);
        }
        await env.ab_test.put('visitors:recent', JSON.stringify(recentVisitors), {
          expirationTtl: 86400 * 30, // 30 days
        });

        // 2. Increment Daily PV Counter
        const pvKey = `analytics:pv:${todayStr}`;
        const curPv = parseInt(await env.ab_test.get(pvKey).catch(() => '0') || '0', 10);
        await env.ab_test.put(pvKey, String(curPv + 1), { expirationTtl: 86400 * 90 });

        // 3. Mark Unique Visitor for today (deduplicated by visitorId:date)
        const uvCheckKey = `uv:${todayStr}:${visitorId}`;
        const alreadySeen = await env.ab_test.get(uvCheckKey);
        if (!alreadySeen) {
          await env.ab_test.put(uvCheckKey, '1', { expirationTtl: 86400 * 2 });
          const uvKey = `analytics:uv:${todayStr}`;
          const curUv = parseInt(await env.ab_test.get(uvKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(uvKey, String(curUv + 1), { expirationTtl: 86400 * 90 });
        }

        // 4. Update Lifetime Total PV Counter
        const totalKey = 'lifetime:total';
        const curTotal = parseInt(await env.ab_test.get(totalKey).catch(() => '0') || '0', 10);
        await env.ab_test.put(totalKey, String(curTotal + 1));

        // 5. If user is registered, record to their individual history trail as well
        if (email) {
          const rawHist = await env.ab_test.get(`history:${email}`);
          let hist = [];
          if (rawHist) {
            try { hist = JSON.parse(rawHist); } catch (_) {}
          }
          if (!Array.isArray(hist)) hist = [];
          hist.unshift({
            timestamp: now,
            action: 'page_view',
            actionLabel: page.includes('measure') ? '使用分贝测试仪' :
                         page.includes('auth.html') ? '访问认证中心' :
                         page.includes('checkout') ? '访问收银台' :
                         '浏览网站页面',
            page,
            title,
            referrer,
            ip: clientIp,
            country,
            city,
            userAgent: userAgent.slice(0, 150),
          });
          if (hist.length > 50) hist = hist.slice(0, 50);
          await env.ab_test.put(`history:${email}`, JSON.stringify(hist), { expirationTtl: 90 * 86400 });
        }
      } catch (kvErr) {
        console.error('Visitor telemetry KV error:', kvErr);
      }
    }

    return json({
      ok: true,
      visitorId,
      country,
      city,
      flag,
      isChinaIp,
      pricingTier,
      currency,
      symbol: isChinaIp ? '¥' : '$',
      allowedGateways: isChinaIp ? ['wechat'] : ['creem'],
      defaultGateway: isChinaIp ? 'wechat' : 'creem',
    });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
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
