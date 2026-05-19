const PLAN_VARIANT_ENV={
  pro:'LEMON_VARIANT_PRO',
  team:'LEMON_VARIANT_TEAM',
  lifetime:'LEMON_VARIANT_LIFETIME',
};

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store',
    },
  });
}

async function readBody(request){
  try{
    return await request.json();
  }catch(e){
    return {};
  }
}

async function lemonCreateCheckout({env,origin,plan,email,source='soundtest-pro-web'}){
  const apiKey=String(env.LEMON_SQUEEZY_API_KEY||'');
  const storeId=String(env.LEMON_STORE_ID||'');
  const variantId=String(env[PLAN_VARIANT_ENV[plan]]||'');
  if(!apiKey||!storeId||!variantId){
    return {error:'billing_not_configured'};
  }

  const redirectUrl=String(env.LEMON_REDIRECT_URL||`${origin}/soundtest.html?membership=success`);
  const payload={
    data:{
      type:'checkouts',
      attributes:{
        checkout_data:{
          email,
          custom:{
            source,
            plan,
          },
        },
        checkout_options:{
          embed:false,
          media:false,
          logo:true,
        },
        product_options:{
          redirect_url:redirectUrl,
          enabled_variants:[Number(variantId)],
        },
      },
      relationships:{
        store:{data:{type:'stores',id:String(storeId)}},
        variant:{data:{type:'variants',id:String(variantId)}},
      },
    },
  };

  const response=await fetch('https://api.lemonsqueezy.com/v1/checkouts',{
    method:'POST',
    headers:{
      'Accept':'application/vnd.api+json',
      'Content-Type':'application/vnd.api+json',
      'Authorization':`Bearer ${apiKey}`,
    },
    body:JSON.stringify(payload),
  });
  const result=await response.json().catch(()=>null);
  if(!response.ok){
    return {error:'checkout_create_failed',status:response.status};
  }
  const checkoutUrl=result?.data?.attributes?.url;
  if(!checkoutUrl){
    return {error:'checkout_url_missing'};
  }
  return {checkoutUrl};
}

export async function onRequestPost(context){
  const {request}=context;
  const body=await readBody(request);
  const plan=String(body.plan||'').toLowerCase();
  const email=String(body.email||'').trim().toLowerCase();
  const source=String(body.source||'soundtest-pro-web');
  if(!['pro','team','lifetime'].includes(plan)){
    return json({error:'invalid_plan'},400);
  }
  if(!email||!email.includes('@')){
    return json({error:'invalid_email'},400);
  }
  const origin=new URL(request.url).origin;
  const created=await lemonCreateCheckout({...context,origin,plan,email,source});
  if(created.error){
    return json(created,502);
  }
  return json({ok:true,plan,checkoutUrl:created.checkoutUrl});
}
