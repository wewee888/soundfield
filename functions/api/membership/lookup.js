function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store',
    },
  });
}

const LOOKUP_RATE_WINDOW_MS=10*60*1000;
const LOOKUP_RATE_LIMIT=12;
const rateBucket=new Map();

async function readBody(request){
  try{
    return await request.json();
  }catch(e){
    return {};
  }
}

function planFromName(name=''){
  const lower=name.toLowerCase();
  if(lower.includes('team'))return 'team';
  if(lower.includes('life'))return 'lifetime';
  return 'pro';
}

async function lemonRequest(path,apiKey){
  const response=await fetch(`https://api.lemonsqueezy.com/v1${path}`,{
    headers:{
      'Accept':'application/vnd.api+json',
      'Authorization':`Bearer ${apiKey}`,
    },
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok){
    throw new Error(`lemon_${response.status}`);
  }
  return payload;
}

function isRateLimited(ip){
  const now=Date.now();
  const current=rateBucket.get(ip)||{count:0,windowStart:now};
  if(now-current.windowStart>LOOKUP_RATE_WINDOW_MS){
    current.count=0;
    current.windowStart=now;
  }
  current.count+=1;
  rateBucket.set(ip,current);
  return current.count>LOOKUP_RATE_LIMIT;
}

export async function onRequestPost({request,env}){
  const ip=request.headers.get('cf-connecting-ip')||'unknown';
  if(isRateLimited(ip)){
    return json({error:'too_many_requests'},429);
  }
  const body=await readBody(request);
  const email=String(body.email||'').trim().toLowerCase();
  if(!email||!email.includes('@')){
    return json({error:'invalid_email'},400);
  }
  const apiKey=String(env.LEMON_SQUEEZY_API_KEY||'');
  if(!apiKey){
    return json({error:'billing_not_configured'},503);
  }

  try{
    const encoded=encodeURIComponent(email);
    const subscriptions=await lemonRequest(`/subscriptions?filter[user_email]=${encoded}&page[size]=5&sort=-created_at`,apiKey);
    const activeSub=(subscriptions.data||[]).find(item=>['active','on_trial','past_due'].includes(item?.attributes?.status));
    if(activeSub){
      const attrs=activeSub.attributes||{};
      const variantName=attrs.variant_name||attrs.product_name||'';
      return json({
        active:true,
        plan:planFromName(variantName),
        status:attrs.status||'active',
        renewsAt:attrs.renews_at||attrs.ends_at||'',
        subscriptionId:activeSub.id||'',
      });
    }

    const orders=await lemonRequest(`/orders?filter[user_email]=${encoded}&page[size]=10&sort=-created_at`,apiKey);
    const paidOrder=(orders.data||[]).find(item=>{
      const attrs=item?.attributes||{};
      const status=String(attrs.status||'').toLowerCase();
      const variant=String(attrs.first_order_item?.variant_name||attrs.first_order_item?.product_name||'').toLowerCase();
      return status==='paid'&&variant.includes('life');
    });
    if(paidOrder){
      return json({
        active:true,
        plan:'lifetime',
        status:'paid',
        renewsAt:'',
        orderId:paidOrder.id||'',
      });
    }

    return json({active:false,plan:'free',status:'inactive'});
  }catch(e){
    return json({error:'lookup_failed',message:e.message||'unknown'},502);
  }
}
