// Cloudflare Pages Function: /api/geo/pricing-tier
// Evaluates client IP address at Cloudflare Edge and returns authoritative regional pricing tier.
// Overseas visitors are strictly locked to USD (Creem.io).
// Mainland China visitors are matched with CNY test pricing (WeChat Pay / Hupijiao).

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

const COUNTRY_FLAGS = {
  US: '🇺🇸', CN: '🇨🇳', HK: '🇭🇰', TW: '🇹🇼', GB: '🇬🇧',
  JP: '🇯🇵', DE: '🇩🇪', FR: '🇫🇷', CA: '🇨🇦', AU: '🇦🇺',
  SG: '🇸🇬', KR: '🇰🇷', IN: '🇮🇳', RU: '🇷🇺', BR: '🇧🇷',
  NL: '🇳🇱', ES: '🇪🇸', IT: '🇮🇹', SE: '🇸🇪', CH: '🇨🇭',
};

export async function onRequestGet(context) {
  return handlePricingRequest(context);
}

export async function onRequestPost(context) {
  return handlePricingRequest(context);
}

async function handlePricingRequest(context) {
  const { request } = context;
  const cf = request.cf || {};

  const clientIp = request.headers.get('cf-connecting-ip') ||
                   request.headers.get('x-real-ip') ||
                   request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   '127.0.0.1';

  const country = String(cf.country || request.headers.get('cf-ipcountry') || 'US').toUpperCase();
  const city = cf.city || '';
  const region = cf.region || '';
  const colo = cf.colo || '';

  // Determine if mainland China or Chinese locale user (e.g. users behind proxy)
  const url = new URL(request.url);
  const langParam = url.searchParams.get('lang') || '';
  const acceptLang = String(request.headers.get('accept-language') || '').toLowerCase();
  const isZh = langParam.startsWith('zh') || acceptLang.includes('zh') || (request.headers.get('referer') || '').includes('/zh');

  const isChinaIp = (country === 'CN');
  const isChinaTier = isChinaIp || isZh;

  if (isChinaTier) {
    return json({
      ok: true,
      clientIp,
      country: isChinaIp ? 'CN' : country,
      city,
      region,
      flag: isChinaIp ? '🇨🇳' : (COUNTRY_FLAGS[country] || '🌐'),
      isChinaIp: true,
      pricingTier: 'china_test',
      tierName: '中国及中文区专属定价',
      currency: 'CNY',
      symbol: '¥',
      currencySymbol: '¥',
      allowedGateways: ['wechat'],
      defaultGateway: 'wechat',
      rates: {
        single: '3.90',
        pro: '9.90',
        yearly: '19.90',
        lifetime: '39.90',
        team: '1998.00',
      },
      plans: {
        single: { price: '3.90', currency: 'CNY' },
        pro: { price: '9.90', currency: 'CNY' },
        yearly: { price: '19.90', currency: 'CNY' },
        lifetime: { price: '39.90', currency: 'CNY' },
        team: { price: '1998.00', currency: 'CNY' },
      },
      lockNotice: '检测到中国大陆境内 IP，已自动应用专属测试价格。',
      preventSwitchReason: '区域定价受国家/地区网络IP监管，不支持手动跨区结算。',
    });
  }

  // Overseas Visitors (US, EU, JP, etc.) strictly locked to USD
  return json({
    ok: true,
    clientIp,
    country,
    city,
    region,
    flag: COUNTRY_FLAGS[country] || '🌐',
    isChinaIp: false,
    pricingTier: 'overseas',
    tierName: '全球国际美金区 (Global USD)',
    currency: 'USD',
    symbol: '$',
    currencySymbol: '$',
    allowedGateways: ['creem'],
    defaultGateway: 'creem',
    rates: {
      single: '1.99',
      pro: '4.99',
      yearly: '24.99',
      lifetime: '79.99',
      team: '249.00',
    },
    plans: {
      single: { price: '1.99', currency: 'USD' },
      pro: { price: '4.99', currency: 'USD' },
      yearly: { price: '24.99', currency: 'USD' },
      lifetime: { price: '79.99', currency: 'USD' },
      team: { price: '249.00', currency: 'USD' },
    },
    lockNotice: `根据您的网络 IP 属地 (${COUNTRY_FLAGS[country] || ''} ${country})，严格执行国际标准美金结算。`,
    preventSwitchReason: '非中国大陆地区 IP 不支持调用人民币测试通道，已锁定为国际信用卡与 Apple Pay (USD)。',
  });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
