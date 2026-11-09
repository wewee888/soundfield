// Cloudflare Pages Function: /api/track-visit
// Zero-auth Edge Visitor Telemetry & Real-Time Intelligence Collector
// Automatically records anonymous visitors, pageviews, geo-location, referrers, and enforces IP-based pricing tier.
// Strictly segregates human traffic (PV, UV, IP) from automated search engine spiders.

import { detectSpider } from '../_spider.js';

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

function parseChannel(referrer, currentHost = 'soundtest.pro') {
  if (!referrer || typeof referrer !== 'string') return '直接访问 (Direct)';
  const refTrimmed = referrer.trim();
  if (
    !refTrimmed ||
    refTrimmed === 'null' ||
    refTrimmed === 'undefined' ||
    refTrimmed === '-' ||
    refTrimmed.startsWith('about:') ||
    refTrimmed.startsWith('javascript:')
  ) {
    return '直接访问 (Direct)';
  }

  let refUrl;
  try {
    refUrl = new URL(refTrimmed);
  } catch (_) {
    // 无具体有效网址的请求，一律归为直接访问
    return '直接访问 (Direct)';
  }

  const hostname = refUrl.hostname.toLowerCase();
  // 站内自身页面流转（如从首页点击进入工具页），一律归为直接访问，严禁误判为外部引流
  if (
    hostname === currentHost ||
    hostname === 'soundtest.pro' ||
    hostname === 'www.soundtest.pro' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.soundtest.pro')
  ) {
    return '直接访问 (Direct)';
  }

  // 1. 搜索引擎来源
  if (hostname.includes('google.')) return 'Google 搜索';
  if (hostname.includes('baidu.')) return '百度搜索';
  if (hostname.includes('bing.')) return 'Bing 搜索';
  if (hostname.includes('sogou.')) return '搜狗搜索';
  if (hostname.includes('so.com') || hostname.includes('haosou.')) return '360 搜索';
  if (hostname.includes('yahoo.')) return 'Yahoo 搜索';
  if (hostname.includes('duckduckgo.')) return 'DuckDuckGo';

  // 2. 社交与通讯渠道
  if (hostname.includes('weixin') || hostname.includes('qq.com')) return '微信生态';
  if (hostname.includes('twitter.com') || hostname.includes('t.co') || hostname.includes('x.com')) return 'X (Twitter)';
  if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'Facebook';
  if (hostname.includes('reddit.com')) return 'Reddit';
  if (hostname.includes('youtube.com')) return 'YouTube';
  if (hostname.includes('zhihu.com')) return '知乎引流';
  if (hostname.includes('weibo.com')) return '微博引流';
  if (hostname.includes('douyin.com') || hostname.includes('tiktok.com')) return '抖音/TikTok';

  // 3. 真实外部引流（必须具备真实第三方外部域名）
  return `外部引流 (${hostname})`;
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

    // 🕷️ 搜索引擎蜘蛛与自动化爬虫严格隔离门禁 (Spider Isolation Gate)
    // 若识别为搜索引擎爬虫 (Baidu, Google, Bing, Bytespider等)，计入专属蜘蛛爬行流水，严禁计入真实人类的“访问人数 (IP)”、“独立访客 (UV)”与“浏览量 (PV)”
    const spider = detectSpider(userAgent);
    if (spider) {
      if (env && env.ab_test) {
        try {
          const spiderKey = `analytics:spider:${todayStr}`;
          const cur = parseInt(await env.ab_test.get(spiderKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(spiderKey, String(cur + 1), { expirationTtl: 86400 * 90 });

          const typeKey = `analytics:spider:${spider.code}:${todayStr}`;
          const curType = parseInt(await env.ab_test.get(typeKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(typeKey, String(curType + 1), { expirationTtl: 86400 * 90 });

          const lifeKey = 'lifetime:spider';
          const curLife = parseInt(await env.ab_test.get(lifeKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(lifeKey, String(curLife + 1));

          const rawRecent = await env.ab_test.get('spiders:recent');
          let recents = [];
          if (rawRecent) {
            try { recents = JSON.parse(rawRecent); } catch (_) {}
          }
          if (!Array.isArray(recents)) recents = [];
          recents.unshift({
            id: `sp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: spider.name,
            icon: spider.icon,
            code: spider.code,
            ip: clientIp,
            path: rawPage,
            timestamp: now,
            userAgent: userAgent.slice(0, 150),
          });
          if (recents.length > 100) recents = recents.slice(0, 100);
          await env.ab_test.put('spiders:recent', JSON.stringify(recents), { expirationTtl: 86400 * 30 });
        } catch (_) {}
      }

      return json({
        ok: true,
        isSpider: true,
        spiderName: spider.name,
        spiderIcon: spider.icon,
        message: 'Spider crawl captured and isolated from human metrics',
      });
    }

    const visitorId = String(body.visitorId || `vid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`).slice(0, 50);
    const token = String(body.sessionToken || '').trim();
    let rawPage = String(body.page || '/').trim();
    if (rawPage.startsWith('javascript:') || rawPage.startsWith('data:') || rawPage.startsWith('vbscript:') || rawPage.startsWith('blob:') || /[\u0000-\u001F\u007F]/.test(rawPage)) {
      rawPage = '/';
    }
    const page = rawPage.slice(0, 200);
    const title = String(body.title || '').replace(/[<>"']/g, '').slice(0, 120);
    const referrer = String(body.referrer || request.headers.get('referer') || '').slice(0, 250);
    const reqHost = new URL(request.url).hostname.toLowerCase();
    const channel = parseChannel(referrer, reqHost);
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

        // 2. Increment Daily PV Counter (页面总浏览量)
        const pvKey = `analytics:pv:${todayStr}`;
        const curPv = parseInt(await env.ab_test.get(pvKey).catch(() => '0') || '0', 10);
        await env.ab_test.put(pvKey, String(curPv + 1), { expirationTtl: 86400 * 90 });

        // 3. Mark Unique Visitor for today (UV 独立访客：基于客户端设备凭证去重)
        const uvCheckKey = `uv:${todayStr}:${visitorId}`;
        const alreadySeenUv = await env.ab_test.get(uvCheckKey);
        if (!alreadySeenUv) {
          await env.ab_test.put(uvCheckKey, '1', { expirationTtl: 86400 * 2 });
          const uvKey = `analytics:uv:${todayStr}`;
          const curUv = parseInt(await env.ab_test.get(uvKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(uvKey, String(curUv + 1), { expirationTtl: 86400 * 90 });

          const totalUvKey = 'lifetime:uv';
          const curTotalUv = parseInt(await env.ab_test.get(totalUvKey).catch(() => '0') || '0', 10);
          await env.ab_test.put(totalUvKey, String(curTotalUv + 1));
        }

        // 4. Mark Independent IP for today (访问人数：基于真实公网客户端 IP 地址去重)
        if (clientIp && clientIp !== 'Unknown') {
          const ipCheckKey = `ip:${todayStr}:${clientIp}`;
          const alreadySeenIp = await env.ab_test.get(ipCheckKey);
          if (!alreadySeenIp) {
            await env.ab_test.put(ipCheckKey, '1', { expirationTtl: 86400 * 2 });
            const ipKey = `analytics:ip:${todayStr}`;
            const curIp = parseInt(await env.ab_test.get(ipKey).catch(() => '0') || '0', 10);
            await env.ab_test.put(ipKey, String(curIp + 1), { expirationTtl: 86400 * 90 });

            const totalIpKey = 'lifetime:ip';
            const curTotalIp = parseInt(await env.ab_test.get(totalIpKey).catch(() => '0') || '0', 10);
            await env.ab_test.put(totalIpKey, String(curTotalIp + 1));
          }
        }

        // 5. Update Lifetime Total PV Counter (历史累计总浏览量)
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
