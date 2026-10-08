/**
 * SOUNDTEST.PRO · Geo & Maps Engine
 * GPS mapping, coordinate projection (WGS-84 / GCJ-02), and multi-provider reverse geocoding
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SoundTestGeo = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

/* ── Map ── */
function geoRecords(){
  return DB.records.filter(r=>r.loc);
}

function latestGeoRecord(){
  return geoRecords()[0]||null;
}

function defaultMapProvider(){
  const isApple=/(iPad|iPhone|iPod|Macintosh)/i.test(navigator.userAgent||'');
  if(isApple)return 'apple';
  if(appLanguage==='zh-CN'||baiduKey)return 'baidu';
  return 'google';
}

function externalMapUrl(loc,provider=defaultMapProvider()){
  if(!loc)return '';
  const lat=Number(loc.lat).toFixed(6),lng=Number(loc.lng).toFixed(6);
  if(provider==='apple')return `https://maps.apple.com/?ll=${lat},${lng}&q=SOUNDTEST.PRO%20Evidence&t=m`;
  if(provider==='amap')return `https://uri.amap.com/marker?position=${lng},${lat}&name=SOUNDTEST.PRO%E5%99%AA%E9%9F%B3%E8%AE%B0%E5%BD%95&src=soundtest&coordinate=wgs84`;
  if(provider==='baidu')return `https://api.map.baidu.com/marker?location=${lat},${lng}&title=SOUNDTEST.PRO%E5%99%AA%E9%9F%B3%E8%AE%B0%E5%BD%95&content=${lat},${lng}&output=html&coord_type=wgs84`;
  return `https://maps.google.com/?q=${lat},${lng}`;
}

function openRecordInMap(id,provider=defaultMapProvider()){
  const r=DB.records.find(x=>x.id===id);
  if(!r?.loc)return toast('这条记录没有 GPS 坐标。','warn');
  window.open(externalMapUrl(r.loc,provider),'_blank','noopener');
}

function openLatestLocationMap(){
  const r=latestGeoRecord();
  if(!r)return toast('暂无带 GPS 的记录，请先在监测页获取位置并保存记录。','warn');
  openRecordInMap(r.id,defaultMapProvider());
}

function exportMapImage(){
  const c=document.getElementById('mapCvs');
  if(!geoRecords().length)return toast('暂无带 GPS 的记录，无法导出地图。','warn');
  drawMap();
  downloadCanvas(c,`soundtest.pro-map-${new Date().toISOString().replace(/[:.]/g,'-')}.png`);
  toast(appLanguage!=='zh-CN'?'Noise distribution map exported.':'噪音分布地图已导出。','info');
}

function drawMap(){
  const c=document.getElementById('mapCvs');
  const W=c.parentElement.clientWidth-28;c.width=W;
  const H=280;c.height=H;
  const ctx=c.getContext('2d');
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#111E30';ctx.fillRect(0,0,W,H);
  const geo=geoRecords();
  if(!geo.length){
    ctx.fillStyle='rgba(214,232,250,0.18)';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='13px sans-serif';
    ctx.fillText(appLanguage!=='zh-CN'?'No sessions with GPS':'暂无带 GPS 的会话',W/2,H/2);
    document.getElementById('mapList').innerHTML=`<div class="clabel">${t('ui.geoSessions')}</div><div class="empty"><strong>${t('ui.noGeoRecords','尚无带 GPS 的记录')}</strong><p>${appLanguage!=='zh-CN'?'Acquire location in monitoring and save audio/video to visualize noise here.':'在监测页点击定位并保存录音/录像后，这里会显示噪音分布。'}</p><button class="btn b-cyan" onclick="sw('m')" style="margin-top:10px">${t('ui.backMonitor','去监测页定位')}</button></div>`;
    return;
  }
  const lats=geo.map(r=>r.loc.lat),lngs=geo.map(r=>r.loc.lng);
  const pad=40;
  const toX=l=>pad+(l-Math.min(...lngs))/(Math.max(...lngs)-Math.min(...lngs)+.0001)*(W-pad*2);
  const toY=l=>H-pad-(l-Math.min(...lats))/(Math.max(...lats)-Math.min(...lats)+.0001)*(H-pad*2);
  [0,25,50,75,100].forEach(p=>{
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(pad+p/100*(W-pad*2),pad);ctx.lineTo(pad+p/100*(W-pad*2),H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad+p/100*(H-pad*2));ctx.lineTo(W-pad,pad+p/100*(H-pad*2));ctx.stroke();
  });
  geo.forEach(r=>{
    const x=toX(r.loc.lng),y=toY(r.loc.lat),col=dbCol(r.avgDb);
    ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fillStyle=col+'1C';ctx.fill();
    ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fillStyle=col;ctx.shadowBlur=11;ctx.shadowColor=col;ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 8px monospace';ctx.fillText(r.avgDb,x,y);
  });
  document.getElementById('mapList').innerHTML=`<div class="clabel">${t('ui.geoSessions')}</div>`+
    geo.map(r=>{const lv=lvInfo(r.avgDb),place=locPlaceText(r.loc);return`<div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:.5px solid var(--bdr)">
      <span style="width:8px;height:8px;border-radius:50%;background:${dbCol(r.avgDb)};box-shadow:0 0 5px ${dbCol(r.avgDb)};flex-shrink:0;display:inline-block"></span>
      <span style="font-size:10px;color:var(--tx2);flex:1"><strong style="display:block;color:var(--tx1);font-size:11px">${esc(place||(appLanguage!=='zh-CN'?'Unidentified place':'未识别地点'))}</strong>${r.time.toLocaleDateString(i18n().locale,{month:'short',day:'numeric'})} ${r.time.toLocaleTimeString(i18n().locale,{hour:'2-digit',minute:'2-digit'})}</span>
      <span class="badge ${lvBadge(r.avgDb)}">${r.avgDb}dB</span>
      <span style="font-size:9px;color:var(--tx3);font-family:monospace">${r.loc.lat},${r.loc.lng}</span>
      <button class="btn" style="height:24px;font-size:10px;padding:0 8px" onclick="openRecordInMap(${r.id})">${appLanguage!=='zh-CN'?'Open':'打开'}</button>
    </div>`;}).join('');
}


function isInChina(lat,lng){
  return lng>=72.004&&lng<=137.8347&&lat>=0.8293&&lat<=55.8271;
}

function transformLat(x,y){
  let ret=-100+2*x+3*y+.2*y*y+.1*x*y+.2*Math.sqrt(Math.abs(x));
  ret+=(20*Math.sin(6*x*Math.PI)+20*Math.sin(2*x*Math.PI))*2/3;
  ret+=(20*Math.sin(y*Math.PI)+40*Math.sin(y/3*Math.PI))*2/3;
  ret+=(160*Math.sin(y/12*Math.PI)+320*Math.sin(y*Math.PI/30))*2/3;
  return ret;
}

function transformLng(x,y){
  let ret=300+x+2*y+.1*x*x+.1*x*y+.1*Math.sqrt(Math.abs(x));
  ret+=(20*Math.sin(6*x*Math.PI)+20*Math.sin(2*x*Math.PI))*2/3;
  ret+=(20*Math.sin(x*Math.PI)+40*Math.sin(x/3*Math.PI))*2/3;
  ret+=(150*Math.sin(x/12*Math.PI)+300*Math.sin(x/30*Math.PI))*2/3;
  return ret;
}

function wgs84ToGcj02(lat,lng){
  if(!isInChina(lat,lng))return {lat,lng};
  const a=6378245,ee=.00669342162296594323;
  let dLat=transformLat(lng-105,lat-35),dLng=transformLng(lng-105,lat-35);
  const radLat=lat/180*Math.PI;
  let magic=Math.sin(radLat);
  magic=1-ee*magic*magic;
  const sqrtMagic=Math.sqrt(magic);
  dLat=(dLat*180)/((a*(1-ee))/(magic*sqrtMagic)*Math.PI);
  dLng=(dLng*180)/(a/sqrtMagic*Math.cos(radLat)*Math.PI);
  return {lat:lat+dLat,lng:lng+dLng};
}

function placeScore(item){
  const text=`${item?.name||''}${item?.type||''}${item?.businessarea||''}`;
  let score=0;
  if(/小区|公寓|花园|家园|社区|住宅|宿舍|苑|园|府|里|村|别墅|生活区/.test(text))score+=90;
  if(/商务|广场|中心|大厦|园区|学校|医院|商场/.test(text))score+=45;
  if(/道路|地名地址|交通设施|公交|停车场/.test(text))score-=35;
  if(item?.distance)score-=Math.min(20,Number(item.distance)/100);
  return score;
}

function pickBestPlaceName(items=[]){
  return items
    .filter(item=>item?.name)
    .sort((a,b)=>placeScore(b)-placeScore(a))[0]?.name||'';
}

function normalizeAmapPlace(data){
  const regeocode=data?.regeocode;
  if(data?.status!=='1'||!regeocode)return null;
  const aoi=pickBestPlaceName(regeocode.aois||[]);
  const poi=pickBestPlaceName(regeocode.pois||[]);
  const neighborhood=regeocode.addressComponent?.neighborhood?.name||'';
  const building=regeocode.addressComponent?.building?.name||'';
  const community=neighborhood||building||aoi||poi||'';
  const rawAddr=regeocode.formatted_address||'';
  let name=rawAddr;
  if(community&&!rawAddr.startsWith(community)){
    name=`${community} · ${rawAddr}`;
  }
  return {name,community,address:rawAddr,provider:appLanguage==='zh-CN'?'高德':'Amap'};
}

function normalizeBaiduPlace(data){
  const result=data?.result;
  if(data?.status!==0)throw new Error(`Baidu status ${data?.status}${data?.message?`: ${data.message}`:''}`);
  if(!result)return null;
  const poi=pickBestPlaceName(result.pois||[]);
  const community=poi||'';
  const rawAddr=result.formatted_address||'';
  let name=rawAddr;
  if(community&&!rawAddr.startsWith(community)){
    name=`${community} · ${rawAddr}`;
  }else if(result.formatted_address_poi){
    name=result.formatted_address_poi;
  }
  return {name,community,address:rawAddr,provider:appLanguage==='zh-CN'?'百度':'Baidu'};
}

function normalizeOsmPlace(data){
  if(!data)return null;
  const address=data.address||{};
  const community=data.name||address.residential||address.neighbourhood||address.suburb||address.building||'';
  const rawAddr=data.display_name||'';
  let name=rawAddr;
  if(community&&!rawAddr.startsWith(community)){
    name=`${community} · ${rawAddr}`;
  }
  return {name,community,address:rawAddr,provider:appLanguage==='zh-CN'?'公开地图':'OpenStreetMap'};
}

async function fetchJson(url){
  const res=await fetch(url,{headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

function fetchJsonp(url,callbackParam='callback',timeoutMs=9000){
  return new Promise((resolve,reject)=>{
    const cb=`sfBaiduJsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script=document.createElement('script');
    const timer=setTimeout(()=>{
      cleanup();
      reject(new Error('JSONP timeout'));
    },timeoutMs);
    function cleanup(){
      clearTimeout(timer);
      delete window[cb];
      script.remove();
    }
    window[cb]=data=>{cleanup();resolve(data);};
    script.onerror=()=>{cleanup();reject(new Error('JSONP load failed'));};
    script.src=`${url}${url.includes('?')?'&':'?'}${callbackParam}=${encodeURIComponent(cb)}`;
    document.head.appendChild(script);
  });
}

function buildPlaceLookupProviders(lat,lng){
  const gcj=wgs84ToGcj02(lat,lng);
  const effectiveBaiduKey = baiduKey || DEFAULT_BAIDU_KEY;
  return [
    {
      provider: appLanguage==='zh-CN'?'智能位置服务':'Smart Geo Service',
      priority: 'edge-cached',
      load: async () => {
        const res = await fetch(`/api/geo/reverse?lat=${lat}&lng=${lng}&lang=${encodeURIComponent(appLanguage)}`);
        if (!res.ok) throw new Error('edge proxy failed');
        const data = await res.json();
        if (data?.ok && data?.name) return { name: data.name, address: data.address || data.name, provider: data.provider === 'baidu' ? (appLanguage==='zh-CN'?'百度':'Baidu') : (appLanguage==='zh-CN'?'公开地图':'OpenStreetMap') };
        throw new Error('no place');
      },
    },
    effectiveBaiduKey?{
      provider:appLanguage==='zh-CN'?'百度地图':'Baidu Maps',
      priority:'baidu-first',
      load:async()=>normalizeBaiduPlace(await fetchJsonp(`https://api.map.baidu.com/reverse_geocoding/v3/?ak=${encodeURIComponent(effectiveBaiduKey)}&output=json&coordtype=wgs84ll&extensions_poi=1&radius=1000&location=${lat},${lng}`)),
    }:null,
    {
      provider:appLanguage==='zh-CN'?'公开地图':'OpenStreetMap',
      priority:'public-fallback',
      load:async()=>normalizeOsmPlace(await fetchJson(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`)),
    },
    amapKey?{
      provider:appLanguage==='zh-CN'?'高德':'Amap',
      priority:'manual-backup',
      load:async()=>normalizeAmapPlace(await fetchJson(`https://restapi.amap.com/v3/geocode/regeo?key=${encodeURIComponent(amapKey)}&location=${gcj.lng},${gcj.lat}&extensions=all&radius=1500&roadlevel=0&output=json`)),
    }:null,
  ].filter(Boolean);
}

async function lookupPlaceName(loc){
  if(!placeLookupOn||!loc)return null;
  const lat=Number(loc.lat),lng=Number(loc.lng);
  const providers=buildPlaceLookupProviders(lat,lng);
  if(!baiduKey)setPlaceProviderStatus(appLanguage!=='zh-CN'?'Map service: Baidu key is not configured; using public fallback.':'地图服务：未配置百度 Key，正在使用公开地图兜底。','err');
  for(const source of providers){
    try{
      setPlaceProviderStatus(appLanguage!=='zh-CN'?`Map service: trying ${source.provider}`:`地图服务：正在调用${source.provider}${source.priority==='baidu-first'?'（优先）':''}`);
      const place=await source.load();
      if(place?.name){
        setPlaceProviderStatus(appLanguage!=='zh-CN'?`Map service: ${source.provider} matched.`:`地图服务：已使用${source.provider}识别。`,'ok');
        return place;
      }
      setPlaceProviderStatus(appLanguage!=='zh-CN'?`Map service: ${source.provider} returned no place.`:`地图服务：${source.provider}未返回地点。`,'err');
    }catch(e){
      setPlaceProviderStatus(appLanguage!=='zh-CN'?`Map service: ${source.provider} failed, trying fallback.`:`地图服务：${source.provider}调用失败，正在尝试兜底。`,'err');
    }
  }
  setPlaceProviderStatus(appLanguage!=='zh-CN'?'Map service: no provider identified this place.':'地图服务：所有服务均未识别到地点。','err');
  return null;
}


  return {
    geoRecords: typeof geoRecords !== 'undefined' ? geoRecords : undefined,
    latestGeoRecord: typeof latestGeoRecord !== 'undefined' ? latestGeoRecord : undefined,
    defaultMapProvider: typeof defaultMapProvider !== 'undefined' ? defaultMapProvider : undefined,
    externalMapUrl: typeof externalMapUrl !== 'undefined' ? externalMapUrl : undefined,
    openRecordInMap: typeof openRecordInMap !== 'undefined' ? openRecordInMap : undefined,
    openLatestLocationMap: typeof openLatestLocationMap !== 'undefined' ? openLatestLocationMap : undefined,
    exportMapImage: typeof exportMapImage !== 'undefined' ? exportMapImage : undefined,
    drawMap: typeof drawMap !== 'undefined' ? drawMap : undefined,
    wgs84ToGcj02: typeof wgs84ToGcj02 !== 'undefined' ? wgs84ToGcj02 : undefined,
    isInChina: typeof isInChina !== 'undefined' ? isInChina : undefined,
    lookupPlaceName: typeof lookupPlaceName !== 'undefined' ? lookupPlaceName : undefined
  };
}));

if (typeof window !== 'undefined' && window.SoundTestGeo) {
  Object.assign(window, window.SoundTestGeo);
}
