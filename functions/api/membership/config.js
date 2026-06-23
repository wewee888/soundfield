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
  const token = String(env.GUMROAD_ACCESS_TOKEN || '');
  const monthlyUrl = String(env.GUMROAD_URL_PRO_MONTHLY || '');
  const yearlyUrl = String(env.GUMROAD_URL_PRO_YEARLY || '');
  const lifetimeUrl = String(env.GUMROAD_URL_LIFETIME || '');
  const plans = {
    pro: Boolean(monthlyUrl) || Boolean(yearlyUrl),
    team: Boolean(yearlyUrl),
    lifetime: Boolean(lifetimeUrl),
  };
  const enabled = Boolean(token) && Object.values(plans).some(Boolean);
  return json({
    provider: 'gumroad',
    enabled,
    mode: enabled ? 'configured' : 'disabled',
    plans,
    urls: {
      pro_monthly: monthlyUrl,
      pro_yearly: yearlyUrl,
      lifetime: lifetimeUrl,
    },
    // Echo product IDs for lookup mapping (no secrets)
    productIds: {
      pro_monthly: String(env.GUMROAD_PRODUCT_ID_PRO_MONTHLY || ''),
      pro_yearly: String(env.GUMROAD_PRODUCT_ID_PRO_YEARLY || ''),
      lifetime: String(env.GUMROAD_PRODUCT_ID_LIFETIME || ''),
    },
  });
}
