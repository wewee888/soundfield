function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export async function onRequestGet({ env }) {
  const token = String(env.CREEM_API_KEY || env.GUMROAD_ACCESS_TOKEN || '');
  const monthlyUrl = String(env.CREEM_URL_PRO_MONTHLY || env.GUMROAD_URL_PRO_MONTHLY || 'https://www.creem.io/payment/prod_4jTdMPIau4Pzn1HKHPW9NQ');
  const yearlyUrl = String(env.CREEM_URL_PRO_YEARLY || env.GUMROAD_URL_PRO_YEARLY || 'https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c');
  const lifetimeUrl = String(env.CREEM_URL_LIFETIME || env.GUMROAD_URL_LIFETIME || 'https://www.creem.io/payment/prod_18nHbuAQNpc4n334rM9hGV');
  const singleUrl = String(env.CREEM_URL_SINGLE || 'https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC');
  const plans = {
    single: Boolean(singleUrl),
    pro: Boolean(monthlyUrl) || Boolean(yearlyUrl),
    team: Boolean(yearlyUrl),
    lifetime: Boolean(lifetimeUrl),
  };
  const enabled = true;
  return json({
    provider: 'creem',
    enabled,
    mode: 'configured',
    plans,
    urls: {
      single: singleUrl,
      pro_monthly: monthlyUrl,
      pro_yearly: yearlyUrl,
      lifetime: lifetimeUrl,
    },
    // Echo product IDs for lookup mapping (no secrets)
    productIds: {
      single: String(env.CREEM_PRODUCT_ID_SINGLE || 'prod_2Xc2ichF1Xk2mmzrhBxyYC'),
      pro_monthly: String(env.CREEM_PRODUCT_ID_PRO_MONTHLY || 'prod_4jTdMPIau4Pzn1HKHPW9NQ'),
      pro_yearly: String(env.CREEM_PRODUCT_ID_PRO_YEARLY || 'prod_18imyd506sx0xFOcMiqB2c'),
      lifetime: String(env.CREEM_PRODUCT_ID_LIFETIME || 'prod_18nHbuAQNpc4n334rM9hGV'),
    },
  });
}
