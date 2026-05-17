function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store',
    },
  });
}

export async function onRequestGet({env}){
  const mode=String(env.LEMON_SQUEEZY_MODE||'').toLowerCase();
  const apiKey=String(env.LEMON_SQUEEZY_API_KEY||'');
  const inferredMode=mode||(
    apiKey.startsWith('lsk_live_')?'live':
    apiKey.startsWith('lsk_test_')?'test':
    'disabled'
  );
  const plans={
    pro:Boolean(env.LEMON_VARIANT_PRO),
    team:Boolean(env.LEMON_VARIANT_TEAM),
    lifetime:Boolean(env.LEMON_VARIANT_LIFETIME),
  };
  const enabled=Boolean(apiKey)&&Object.values(plans).some(Boolean);
  return json({
    provider:'lemon_squeezy',
    enabled,
    mode:enabled?'configured':'disabled',
    plans,
  });
}
