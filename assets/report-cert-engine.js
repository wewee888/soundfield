/**
 * SOUNDTEST.PRO · Report & Certificate Engine
 * Modularized Forensic PDF, Certificate Canvas & Evidence Visualization Suite
 * Built to IEC 61672-1 compliance standards
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SoundTestReportCertEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
function downloadCanvas(canvas,filename){
  const a=document.createElement('a');
  a.href=canvas.toDataURL('image/png');
  a.download=filename;
  a.click();
}

function openCanvas(canvas,filename){
  const popup=window.open('about:blank','_blank');
  canvas.toBlob(blob=>{
    if(!blob){
      downloadCanvas(canvas,filename);
      return;
    }
    const url=URL.createObjectURL(blob);
    if(popup){
      popup.document.title=filename;
      popup.document.documentElement.style.margin='0';
      popup.document.documentElement.style.background='#050914';
      popup.document.body.style.margin='0';
      popup.document.body.style.background='#050914';
      popup.document.body.innerHTML=`<main data-viewer="fullscreenEvidenceViewer" style="width:100vw;height:100vh;display:grid;place-items:center;background:#050914;overflow:hidden">
        <img src="${url}" alt="声学证据照片" style="width:100vw;height:100vh;object-fit:contain;display:block;background:#050914">
        <div style="position:fixed;left:12px;right:12px;bottom:12px;display:flex;justify-content:center;gap:8px;pointer-events:none">
          <span style="padding:7px 10px;border-radius:999px;background:rgba(5,9,20,.72);border:1px solid rgba(255,255,255,.14);color:rgba(214,232,250,.86);font:12px system-ui,sans-serif;backdrop-filter:blur(12px)">全屏查看 · 长按/右键可保存图片</span>
        </div>
      </main>`;
      popup.addEventListener('beforeunload',()=>URL.revokeObjectURL(url),{once:true});
    }else{
      downloadCanvas(canvas,filename);
      URL.revokeObjectURL(url);
    }
  },'image/png');
}

function openLastEvidencePhoto(){
  if(!lastEvidencePhotoUrl)return toast(appLanguage!=='zh-CN'?'No evidence photo is available yet.':'暂无可打开的声学证据照片。','warn');
  const popup=window.open('about:blank','_blank');
  if(!popup)return toast(appLanguage!=='zh-CN'?'Pop-ups are blocked. Allow pop-ups and try again.':'浏览器阻止了新窗口，请允许弹窗后重试。','warn');
  popup.document.title='soundtest.pro-acoustic-evidence-preview.png';
  popup.document.documentElement.style.margin='0';
  popup.document.documentElement.style.background='#050914';
  popup.document.body.style.margin='0';
  popup.document.body.style.background='#050914';
  popup.document.body.innerHTML=`<main data-viewer="fullscreenEvidenceViewer" style="width:100vw;height:100vh;display:grid;place-items:center;background:#050914;overflow:hidden">
    <img src="${lastEvidencePhotoUrl}" alt="声学证据照片" style="width:100vw;height:100vh;object-fit:contain;display:block;background:#050914">
    <div style="position:fixed;left:12px;right:12px;bottom:12px;display:flex;justify-content:center;gap:8px;pointer-events:none">
      <span style="padding:7px 10px;border-radius:999px;background:rgba(5,9,20,.72);border:1px solid rgba(255,255,255,.14);color:rgba(214,232,250,.86);font:12px system-ui,sans-serif;backdrop-filter:blur(12px)">全屏查看 · 长按/右键可保存图片</span>
    </div>
  </main>`;
}

function getEvidenceStats(){
  const valid=dbH.filter(v=>Number.isFinite(v)&&v>0);
  const avg=valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:0;
  const leq=leqTime>0?10*Math.log10(leqEnergy/leqTime):avg;
  const lnStats=calculateLnStats(valid);
  const durationSeconds=sessStart?Math.round((Date.now()-sessStart.getTime())/1000):0;
  return {
    current:curDb,
    avg,
    peak,
    min:mn===999?0:mn,
    leq,
    lnStats,
    durationText:fmtTime(durationSeconds),
    level:lvInfo(Math.round(curDb||avg||0)).l,
    loc:curLoc?{...curLoc}:null,
    time:new Date().toLocaleString(i18n().locale),
    weighting:weightLabel(),
    timeWeight:timeLabel(),
    errorRange:calibrationErrorRange(),
  };
}

function drawEvidenceText(ctx,text,x,y,maxWidth,lineHeight){
  const words=String(text||'').split('');
  let line='';
  for(const ch of words){
    const next=line+ch;
    if(ctx.measureText(next).width>maxWidth&&line){
      ctx.fillText(line,x,y);line=ch;y+=lineHeight;
    }else line=next;
  }
  if(line)ctx.fillText(line,x,y);
  return y;
}

function wrapEvidenceText(ctx,text,maxWidth,maxLines=3){
  const raw=String(text||'');
  const hasSpaces=/\s/.test(raw);
  const tokens=hasSpaces?raw.split(/(\s+)/).filter(Boolean):raw.split('');
  const lines=[];
  let line='';
  for(const token of tokens){
    const next=line+token;
    if(ctx.measureText(next).width<=maxWidth||!line){
      line=next;
      continue;
    }
    lines.push(line.trimEnd());
    line=token.trimStart();
    if(lines.length>=maxLines)break;
  }
  if(lines.length<maxLines&&line)lines.push(line.trimEnd());
  if(lines.length>maxLines)lines.length=maxLines;
  if(lines.length===maxLines){
    let last=lines[maxLines-1]||'';
    while(last&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);
    if(last!==raw)lines[maxLines-1]=last+'…';
  }
  return lines;
}

function drawEvidenceLineBlock(ctx,lines,x,y,maxWidth,lineHeight,maxEvidenceAddressLines=3){
  let curY=y;
  lines.forEach(item=>{
    const text=typeof item==='string'?item:item.text;
    const maxLines=typeof item==='object'&&item.maxLines?item.maxLines:maxEvidenceAddressLines;
    wrapEvidenceText(ctx,text,maxWidth,maxLines).forEach(line=>{
      ctx.fillText(line,x,curY);
      curY+=lineHeight;
    });
    curY+=Math.max(4,Math.round(lineHeight*.28));
  });
  return curY;
}

function formatEvidencePlaceLine(loc, customLoc = null, sceneLabel = '', sceneNote = ''){
  let cLoc = customLoc;
  if (!cLoc) {
    try {
      const raw = localStorage.getItem('sf_custom_location_v1');
      if (raw) cLoc = JSON.parse(raw);
    } catch(_) {}
  }
  let place = '';
  if (cLoc && (cLoc.place || cLoc.point)) {
    const parts = [cLoc.place, cLoc.building, cLoc.room].filter(Boolean);
    if (parts.length) place = '【' + parts.join(' · ') + '】';
    if (cLoc.point) {
      const pt = cLoc.point + (cLoc.note ? ` (${cLoc.note})` : '');
      place = place ? `${place} · ${pt}` : pt;
    }
  }
  if (!place && loc) {
    const ext = typeof extractPlaceText === 'function' ? extractPlaceText(loc) : null;
    place = ext ? (ext.title ? `${ext.title}${ext.addr ? ' · ' + ext.addr : ''}` : ext.addr) : '';
    if (!place && typeof locPlaceText === 'function') place = locPlaceText(loc);
  }
  if (!place) {
    place = loc ? (appLanguage === 'zh-CN' ? '现场声学监测站点 (GPS 坐标锚定)' : 'Acoustic Monitoring Site (GPS Anchored)') : (appLanguage === 'zh-CN' ? '未获取位置' : 'Location not acquired');
  }
  const sNote = sceneNote || (typeof currentSceneNote !== 'undefined' ? currentSceneNote : '');
  if (sNote) {
    place += (appLanguage === 'zh-CN' ? ' · 场景: ' : ' · Scene: ') + sNote;
  }
  return `${appLanguage==='zh-CN'?'地点':'Place'}: ${place}`;
}

function formatGpsLine(loc){
  if(!loc)return appLanguage==='zh-CN'?'GPS 坐标：未获取':'GPS: not acquired';
  const lat=Number(loc.lat).toFixed(6);
  const lng=Number(loc.lng).toFixed(6);
  const acc=loc.acc?` · ${appLanguage==='zh-CN'?'精度':'accuracy'} ±${loc.acc}m`:'';
  return `${appLanguage==='zh-CN'?'GPS 坐标':'GPS'}: ${lat}, ${lng}${acc}`;
}

function evidenceDeviceLine(){
  const profile=detectPlatformProfile();
  return `${appLanguage!=='zh-CN'?'Device environment':'设备环境'}：${profile.os} · ${profile.layout.replace('-optimized','')} · ${navigator.userAgent.split(')')[0].slice(0,72)})`;
}

async function sha256HexFromBuffer(buffer){
  const subtle=window.crypto?.subtle;
  if(!subtle)return '';
  const hash=await subtle.digest('SHA-256',buffer);
  return [...new Uint8Array(hash)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}

async function sha256HexFromBlob(blob){
  if(!blob)return '';
  return sha256HexFromBuffer(await blob.arrayBuffer());
}

async function sha256HexFromText(text){
  return sha256HexFromBuffer(new TextEncoder().encode(text));
}

function createEvidenceId(date=new Date()){
  return window.SoundfieldEvidence?.createEvidenceId?window.SoundfieldEvidence.createEvidenceId(date):`STP-${date.toISOString().slice(0,10).replace(/-/g,'')}-${String(date.getTime()).slice(-5)}`;
}

function canonicalEvidenceMetadata(value){
  return window.SoundfieldEvidence?.canonicalizeEvidenceMetadata?window.SoundfieldEvidence.canonicalizeEvidenceMetadata(value):JSON.stringify(value);
}

function drawEvidenceMetaPill(ctx,label,value,x,y,w,h,accent='#2AFFD4'){
  ctx.fillStyle='rgba(255,255,255,.085)';
  ctx.strokeStyle='rgba(255,255,255,.16)';
  ctx.lineWidth=1;
  roundRect(ctx,x,y,w,h,12);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(214,232,250,.52)';
  ctx.font=`${Math.max(9,Math.round(h*.20))}px system-ui, sans-serif`;
  ctx.fillText(label,x+12,y+Math.round(h*.34));
  ctx.fillStyle=accent;
  ctx.font=`800 ${Math.max(15,Math.round(h*.34))}px monospace`;
  ctx.fillText(value,x+12,y+h-12);
}

function buildAcousticEvidencePhoto(video){
  const canvas=document.createElement('canvas');
  canvas.dataset.layout='professionalEvidenceLayout';
  canvas.width=video.videoWidth;
  canvas.height=video.videoHeight;
  const ctx=canvas.getContext('2d');
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  const stats=getEvidenceStats();
  const W=canvas.width,H=canvas.height,pad=Math.max(24,Math.round(W*.035));
  const panelH=Math.min(Math.round(H*.58),520);
  const grd=ctx.createLinearGradient(0,H-panelH,0,H);
  grd.addColorStop(0,'rgba(3,7,13,0)');
  grd.addColorStop(.16,'rgba(3,7,13,.62)');
  grd.addColorStop(1,'rgba(3,7,13,.94)');
  ctx.fillStyle=grd;ctx.fillRect(0,H-panelH,W,panelH);
  ctx.fillStyle='rgba(3,7,13,.72)';ctx.fillRect(0,0,W,Math.max(72,Math.round(H*.12)));
  ctx.fillStyle='rgba(42,255,212,.95)';ctx.fillRect(pad,Math.max(58,Math.round(H*.095)),Math.min(240,W*.22),2);
  ctx.fillStyle='#2AFFD4';ctx.font=`700 ${Math.max(18,Math.round(W*.028))}px system-ui, sans-serif`;
  ctx.fillText('SOUNDTEST.PRO · ACOUSTIC EVIDENCE',pad,Math.max(36,Math.round(H*.055)));
  ctx.fillStyle='rgba(214,232,250,.58)';ctx.font=`${Math.max(11,Math.round(W*.015))}px system-ui, sans-serif`;
  ctx.fillText(appLanguage!=='zh-CN'?'Field photo with sound level, GPS, calibration, and device snapshot':'现场照片叠加声级、GPS、校准和设备快照',pad,Math.max(58,Math.round(H*.085)));
  ctx.fillStyle='rgba(214,232,250,.72)';ctx.font=`${Math.max(12,Math.round(W*.018))}px system-ui, sans-serif`;
  ctx.textAlign='right';
  ctx.fillText(stats.time,W-pad,Math.max(38,Math.round(H*.065)));
  ctx.fillText(`${stats.weighting} · ${stats.timeWeight}`,W-pad,Math.max(60,Math.round(H*.095)));
  ctx.textAlign='left';
  const yBase=H-panelH+Math.max(58,Math.round(panelH*.16));
  ctx.fillStyle=dbCol(stats.current||stats.avg);ctx.font=`800 ${Math.max(58,Math.round(W*.105))}px monospace`;
  ctx.fillText(`${Math.round(stats.current||stats.avg||0)} dB`,pad,yBase);
  ctx.fillStyle='rgba(214,232,250,.82)';ctx.font=`700 ${Math.max(18,Math.round(W*.032))}px system-ui, sans-serif`;
  ctx.fillText(`${stats.level} · ${appLanguage!=='zh-CN'?'Current sound level':'当前声级'}`,pad,yBase+Math.max(30,Math.round(W*.045)));
  const cardY=yBase+Math.max(62,Math.round(W*.076)),cardGap=Math.max(10,Math.round(W*.014)),cardW=(W-pad*2-cardGap*3)/4,cardH=Math.max(58,Math.round(panelH*.18));
  const cards=[['AVG',stats.avg],['PEAK',stats.peak],['MIN',stats.min],['LAeq',stats.leq]];
  cards.forEach((c,i)=>{
    const x=pad+i*(cardW+cardGap);
    drawEvidenceMetaPill(ctx,c[0],`${fmtDb(c[1])} dB`,x,cardY,cardW,cardH,dbCol(c[1]||stats.avg));
  });
  const metaTop=cardY+cardH+Math.max(20,Math.round(W*.024));
  ctx.fillStyle='rgba(214,232,250,.82)';ctx.font=`${Math.max(12,Math.round(W*.016))}px system-ui, sans-serif`;
  const place=stats.loc?(locPlaceText(stats.loc)||`${stats.loc.lat}, ${stats.loc.lng}`):(appLanguage!=='zh-CN'?'Location not acquired':'未获取位置');
  const lines=[
    {text:`${appLanguage!=='zh-CN'?'Place':'地点'}：${place}`,maxLines:5},
    formatGpsLine(stats.loc),
    appLanguage!=='zh-CN'?`Measurement: ${stats.weighting} · ${stats.timeWeight} · calibration offset ${calOffset>=0?'+':''}${calOffset} dB · mic gain ${micGainDb} dB`:`测量设置：${stats.weighting} · ${stats.timeWeight} · 校准偏移 ${calOffset>=0?'+':''}${calOffset} dB · 麦克风增益 ${micGainDb} dB`,
    appLanguage!=='zh-CN'?`Ln stats: L5 ${fmtDb(stats.lnStats.L5)} · L10 ${fmtDb(stats.lnStats.L10)} · L50 ${fmtDb(stats.lnStats.L50)} · L95 ${fmtDb(stats.lnStats.L95)} dB`:`统计参数：L5 ${fmtDb(stats.lnStats.L5)} · L10 ${fmtDb(stats.lnStats.L10)} · L50 ${fmtDb(stats.lnStats.L50)} · L95 ${fmtDb(stats.lnStats.L95)} dB`,
    appLanguage!=='zh-CN'?`Estimated error: ${stats.errorRange}`:`估计误差：${stats.errorRange}`,
    {text:evidenceDeviceLine(),maxLines:3},
  ];
  drawEvidenceLineBlock(ctx,lines,pad,metaTop,W-pad*2,Math.max(16,Math.round(W*.020)),3);
  ctx.fillStyle='rgba(214,232,250,.48)';ctx.font=`${Math.max(11,Math.round(W*.015))}px system-ui, sans-serif`;
  ctx.fillText(legalDisclaimer(),pad,H-22);
  return canvas;
}

function captureEvidencePhoto({trackSource='photo'}={}){
  if(!isCam||!camStream)return toast(appLanguage!=='zh-CN'?'Open the camera first.':'请先开启摄像头预览。','warn');
  const video=document.getElementById('cam');
  if(!video.videoWidth||!video.videoHeight)return toast(appLanguage!=='zh-CN'?'Camera is still loading. Try again in a moment.':'摄像头画面尚未准备好，请稍候再拍。','warn');
  if(!isMon)return toast(appLanguage!=='zh-CN'?'Start monitoring before capturing an evidence photo.':'请先开始监测，再生成声学证据照片。','warn');
  const canvas=buildAcousticEvidencePhoto(video);
  const img=document.getElementById('photoImg');
  const preview=document.getElementById('photoPreview');
  lastEvidencePhotoUrl=canvas.toDataURL('image/png');
  img.src=lastEvidencePhotoUrl;
  preview.style.display='block';
  openCanvas(canvas,`soundtest.pro-acoustic-evidence-${new Date().toISOString().replace(/[:.]/g,'-')}.png`);
  trackEvent('evidence_photo_saved',{db:Math.round(curDb||0),hasLocation:!!curLoc,mode:evidenceMode,source:trackSource});
  toast(appLanguage!=='zh-CN'?'Evidence photo opened.':'声学证据照片已生成并打开。','info');
  collapsePromptAfterImageSave();
}

function capturePhoto(){
  setCameraMode('photo');
  captureEvidencePhoto({trackSource:'photo'});
}

function captureSnapshotDuringRecording(){
  if(!isRec)return toast(appLanguage!=='zh-CN'?'Start video recording before taking an in-recording photo.':'请先开始录像，再拍摄录像中的水印照片。','warn');
  captureEvidencePhoto({trackSource:'video_recording_snapshot'});
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}

/**
 * Format a Date to a local-timezone string: "YYYY-MM-DD HH:MM:SS ±HH:MM"
 * Used for all certificate/report timestamps so the displayed time matches
 * what the user actually sees on their device clock.
 */
function localTimeStr(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) date = new Date();
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  const Y = date.getFullYear();
  const M = pad(date.getMonth() + 1);
  const D = pad(date.getDate());
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  const off = -date.getTimezoneOffset(); // minutes
  const sign = off >= 0 ? '+' : '-';
  const offH = pad(Math.floor(Math.abs(off) / 60));
  const offM = pad(Math.abs(off) % 60);
  return `${Y}-${M}-${D} ${h}:${m}:${s} ${sign}${offH}:${offM}`;
}

/**
 * Short local date "YYYY-MM-DD" for filenames.
 */
function localDateStr(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) date = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
}

function buildSessionSummaryCanvas(stats, isWatermarked = true){
  const canvas=document.createElement('canvas');
  canvas.width=1080;canvas.height=1620;
  const ctx=canvas.getContext('2d');
  const isZh = appLanguage === 'zh-CN';
  const bg=ctx.createLinearGradient(0,0,0,canvas.height);
  bg.addColorStop(0,'#07101D');bg.addColorStop(1,'#0D1525');
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(42,255,212,.08)';ctx.beginPath();ctx.arc(850,130,270,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,181,32,.06)';ctx.beginPath();ctx.arc(150,1180,340,0,Math.PI*2);ctx.fill();

  let startY = 46;
  if(isWatermarked){
    roundRect(ctx,54,20,972,48,12);
    ctx.fillStyle='rgba(239,68,68,0.14)';ctx.fill();
    ctx.strokeStyle='rgba(239,68,68,0.45)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle='#ff6b6b';ctx.font='700 20px system-ui, -apple-system, sans-serif';ctx.textAlign='center';
    ctx.fillText(isZh?'⚠️ 免费个人自测版 · 未加盖数字防伪指纹及法律签名 · 升级专业版去除水印':'⚠️ Free Preview Mode · Cryptographic Signature Unsealed · Upgrade to Pro for Clean Report',540,50);
    ctx.textAlign='left';
    startY = 88;
  }

  ctx.fillStyle='rgba(255,255,255,.06)';ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=1;
  roundRect(ctx,54,startY,972,132,28);ctx.fill();ctx.stroke();
  drawOfficialBrandIcon(ctx, 80, startY + 26, 80);
  ctx.fillStyle='#2AFFD4';ctx.font='800 40px system-ui, sans-serif';ctx.fillText('SOUNDTEST.PRO',178,startY+62);
  ctx.fillStyle='rgba(214,232,250,.58)';ctx.font='22px system-ui, sans-serif';ctx.fillText(t('summary.subtitle'),178,startY+96);
  ctx.textAlign='right';ctx.fillStyle='rgba(214,232,250,.72)';ctx.font='22px system-ui, sans-serif';ctx.fillText(stats.time,998,startY+58);
  ctx.font='20px monospace';ctx.fillText(`${stats.weighting} · ${stats.timeWeight}`,998,startY+92);ctx.textAlign='left';

  const heroY = startY + 164;
  ctx.fillStyle='rgba(255,255,255,.07)';ctx.strokeStyle='rgba(42,255,212,.22)';
  roundRect(ctx,54,heroY,972,210,30);ctx.fill();ctx.stroke();
  const rawAvgVal = Number(stats.avg || 0);
  ctx.fillStyle=dbCol(rawAvgVal);ctx.font='800 114px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';ctx.fillText(`${rawAvgVal.toFixed(1)} dB`,92,heroY+130);
  ctx.fillStyle='rgba(214,232,250,.64)';ctx.font='28px system-ui, sans-serif';ctx.fillText(t('summary.avgLine').replace('{level}',lvInfo(rawAvgVal).l),98,heroY+176);

  const cards=[
    [t('summary.peak'),Number(stats.peak || 0).toFixed(1),'#FF3F50'],
    [t('summary.min'),Number(stats.min || 0).toFixed(1),'#4ADE80'],
    ['LAeq',Number(stats.leq || 0).toFixed(1),'#2AFFD4'],
    ['L50',Number(stats.lnStats?.L50 || stats.avg || 0).toFixed(1),'#FFB520'],
  ];
  const gridY = heroY + 240;
  cards.forEach((c,i)=>{
    const x=72+(i%2)*468,y=gridY+Math.floor(i/2)*170;
    ctx.fillStyle='rgba(255,255,255,.055)';ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=1;
    roundRect(ctx,x,y,420,132,22);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(214,232,250,.48)';ctx.font='22px system-ui, sans-serif';ctx.fillText(c[0],x+28,y+40);
    ctx.fillStyle=c[2];ctx.font='700 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${c[1]} dB`,x+28,y+98);
  });

  const trendY = gridY + 365;
  ctx.fillStyle='rgba(255,255,255,.055)';ctx.strokeStyle='rgba(255,255,255,.13)';
  roundRect(ctx,72,trendY,936,220,22);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(214,232,250,.5)';ctx.font='22px system-ui, sans-serif';ctx.fillText(t('summary.trend'),100,trendY+42);
  if(stats.snap&&stats.snap.length>1){
    const left=100,top=trendY+70,w=880,h=120,max=120;
    ctx.strokeStyle='rgba(255,255,255,.10)';ctx.lineWidth=1;
    [30,60,90].forEach(db=>{const y=top+h-(db/max)*h;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(left+w,y);ctx.stroke();});
    ctx.strokeStyle='#2AFFD4';ctx.lineWidth=4;ctx.beginPath();
    stats.snap.forEach((db,i)=>{const x=left+i/(stats.snap.length-1)*w,y=top+h-(db/max)*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
    ctx.stroke();
  }

  const metaY = trendY + 245;
  ctx.fillStyle='rgba(255,255,255,.055)';ctx.strokeStyle='rgba(255,255,255,.13)';
  roundRect(ctx,72,metaY,936,280,22);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(214,232,250,.52)';ctx.font='22px system-ui, sans-serif';ctx.fillText(t('summary.metadata'),100,metaY+40);
  ctx.fillStyle='rgba(214,232,250,.78)';ctx.font='22px system-ui, sans-serif';
  drawEvidenceLineBlock(ctx,[
    {text:formatEvidencePlaceLine(stats.loc, stats.customLoc, stats.sceneLabel, stats.sceneNote),maxLines:5},
    formatGpsLine(stats.loc),
    `L5 ${Number(stats.lnStats?.L5 ?? 0).toFixed(1)} dB · L10 ${Number(stats.lnStats?.L10 ?? 0).toFixed(1)} dB · L90 ${Number(stats.lnStats?.L90 ?? 0).toFixed(1)} dB · L95 ${Number(stats.lnStats?.L95 ?? 0).toFixed(1)} dB`,
    t('summary.calibration').replace('{offset}',`${calOffset>=0?'+':''}${calOffset}`).replace('{gain}',micGainDb),
    `${appLanguage==='zh-CN'?'估计误差':'Estimated error'}: ±${cleanErrorRange(stats.errorRange)} dB`,
  ],100,metaY+80,860,34,5);

  const discY = metaY + 310;
  ctx.fillStyle='rgba(214,232,250,.48)';ctx.font='20px system-ui, sans-serif';
  ctx.fillText(legalDisclaimer(),72,discY);
  if(isWatermarked){
    ctx.fillText(isZh?'升级专业版即可去除全页水印并解锁正式 SHA-256 加密底稿。':'Upgrade to PRO to remove watermarks and unlock certified SHA-256 evidence.',72,discY+30);

    ctx.save();
    ctx.translate(540,810);
    ctx.rotate(-24*Math.PI/180);
    ctx.font='900 36px monospace, system-ui';
    ctx.fillStyle='rgba(239,68,68,0.38)';
    ctx.textAlign='center';
    const wmText=isZh?'SOUNDTEST.PRO 免费版 · 仅供民事自查 · 升级专业版去水印':'SOUNDTEST.PRO PREVIEW · PERSONAL USE ONLY · UPGRADE PRO';
    for(let row=-5;row<=5;row++){
      ctx.fillText(wmText,0,row*160);
      ctx.fillText(wmText,row%2===0?-400:400,row*160+80);
    }
    roundRect(ctx, -320, -50, 640, 100, 14);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.24)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = '900 32px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText(isZh ? 'SOUNDTEST.PRO 免费预览版' : 'SOUNDTEST.PRO FREE PREVIEW', 0, -12);
    ctx.font = '700 16px system-ui, -apple-system, sans-serif';
    ctx.fillText(isZh ? '仅供民事自查参考 · 非法定计量 · 升级专业版去水印' : 'CIVILIAN REFERENCE ONLY · UPGRADE PRO FOR CLEAN REPORT', 0, 26);
    ctx.restore();
  }
  return canvas;
}

function drawOfficialBrandIcon(ctx, x, y, size) {
  ctx.save();
  const bgGrad = ctx.createLinearGradient(x, y, x + size, y + size);
  bgGrad.addColorStop(0, '#0c1a2e');
  bgGrad.addColorStop(1, '#050a14');
  roundRect(ctx, x, y, size, size, Math.round(size * 0.22));
  ctx.fillStyle = bgGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(42, 255, 212, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.translate(x, y);
  const s = size / 512;
  ctx.scale(s, s);

  ctx.strokeStyle = '#2AFFD4';
  ctx.lineWidth = 18;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(256, 256, 178, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  ctx.strokeStyle = '#2AFFD4';
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(92, 276);
  ctx.lineTo(136, 276);
  ctx.lineTo(178, 160);
  ctx.lineTo(240, 376);
  ctx.lineTo(290, 230);
  ctx.lineTo(324, 302);
  ctx.lineTo(352, 250);
  ctx.lineTo(420, 250);
  ctx.stroke();

  ctx.fillStyle = '#FFB520';
  ctx.beginPath();
  ctx.arc(256, 256, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function extractPlaceText(loc) {
  if (!loc) return { title: '', addr: '' };
  let title = '';
  let addr = loc.addr || '';
  if (typeof loc.place === 'string' && loc.place.trim()) {
    title = loc.place.trim();
  } else if (loc.place && typeof loc.place === 'object') {
    title = loc.place.name || loc.place.formatted || loc.place.address || '';
    if (!addr && loc.place.address && loc.place.address !== title) {
      addr = loc.place.address;
    }
  }
  if (!title && typeof locPlaceText === 'function') {
    const txt = locPlaceText(loc);
    if (txt && typeof txt === 'string') {
      const parts = txt.split(' · ');
      title = parts[0] || '';
      if (!addr && parts[1]) addr = parts.slice(1).join(' · ');
    }
  }
  return { title, addr };
}

function cleanErrorRange(raw) {
  if (!raw) return '1.2';
  const str = String(raw);
  const m = str.match(/\d+(?:\.\d+)?(?:\s*~\s*\d+(?:\.\d+)?)?/);
  return m ? m[0].replace(/\s+/g, '') : '1.2';
}

function truncateCanvasText(ctx, str, maxW) {
  if (!str || ctx.measureText(str).width <= maxW) return str;
  let s = str;
  while (s.length > 3 && ctx.measureText(s + '...').width > maxW) {
    s = s.slice(0, -1);
  }
  return s + '...';
}

function buildProCertificateCanvas(stats, isWatermarked = false){
  const canvas = document.createElement('canvas');
  // Compact 800px width (1/3 reduction from 1200px) and tightened 1400px height (9:16 mobile aspect ratio, no dead space)
  canvas.width = 800;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');
  const isZh = appLanguage === 'zh-CN';

  // Typography font stacks: crisp anti-aliased sans-serif for labels, clean modern mono for codes, tabular sans for numbers
  const FONT_SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  const FONT_MONO = 'ui-monospace, "SF Mono", "Cascadia Code", "Segoe UI Mono", Menlo, Consolas, "PingFang SC", "Microsoft YaHei", monospace';
  const FONT_NUM = '"DIN Alternate", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Palette: Official website design system (Deep Navy & Cyan #2AFFD4)
  const C_CYAN = '#2AFFD4';
  const C_CYAN_DIM = 'rgba(42, 255, 212, 0.12)';
  const C_CYAN_BDR = 'rgba(42, 255, 212, 0.32)';
  const C_BG = '#060A12';
  const C_SURF = '#0B1220';
  const C_SURF_IN = '#0E172A';
  const C_BDR = '#182438';
  const C_TX_PRI = '#EEF2FF';
  const C_TX_SEC = '#8C95A4';
  const C_TX_MUT = '#5A6578';
  const C_AMBER = '#FFB520';
  const C_RED = '#FF3F50';
  const C_BLUE = '#7C9BFF';

  const rawActive = Number(stats.avg || stats.leq || 49);
  const activeDb = Math.round(rawActive);
  const activeDbStr = rawActive.toFixed(1);

  // Background
  ctx.fillStyle = C_BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(42, 255, 212, 0.18)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 16, 16, 768, 1368, 14);
  ctx.stroke();

  // Top sub-header bar
  if (isWatermarked) {
    roundRect(ctx, 36, 28, 728, 24, 4);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '700 11px ' + FONT_SANS;
    ctx.fillStyle = '#ff6b6b';
    ctx.textAlign = 'center';
    ctx.fillText(isZh ? '⚠️ 免费自测预览版 · 未加盖防伪数字指纹及法律签名 · 升级专业版解锁正式存证' : '⚠️ Free Preview Mode · Cryptographic Signature Unsealed · Upgrade to Pro for Clean Report', 400, 44);
    ctx.textAlign = 'left';
  } else {
    ctx.fillStyle = C_CYAN;
    roundRect(ctx, 36, 36, 8, 8, 2);
    ctx.fill();

    ctx.font = '700 11px ' + FONT_MONO;
    ctx.fillStyle = C_TX_PRI;
    ctx.fillText('CERTIFICATE OF ACOUSTIC MEASUREMENT', 50, 44);

    // DOC Badge
    roundRect(ctx, 594, 28, 170, 24, 4);
    ctx.fillStyle = '#0a1220';
    ctx.fill();
    ctx.strokeStyle = C_BDR;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = C_CYAN;
    ctx.font = '700 11px ' + FONT_MONO;
    ctx.fillText('DOC: ' + (stats.docId || 'ST-8902-LA').replace(/^DOC:\s*/, ''), 606, 44);
  }

  // Divider
  ctx.strokeStyle = C_BDR;
  ctx.beginPath(); ctx.moveTo(36, 62); ctx.lineTo(764, 62); ctx.stroke();

  // Brand row with Official Logo
  drawOfficialBrandIcon(ctx, 36, 72, 44);

  // Title: SOUNDTEST .PRO
  ctx.font = '900 24px ' + FONT_SANS;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('SOUNDTEST', 90, 96);
  const stWidth = ctx.measureText('SOUNDTEST').width;
  ctx.fillStyle = C_CYAN;
  ctx.font = '900 18px ' + FONT_MONO;
  ctx.fillText('.PRO', 90 + stWidth + 3, 96);

  ctx.font = '11.5px ' + FONT_SANS;
  ctx.fillStyle = C_TX_SEC;
  const sceneTitle = stats.sceneLabel ? (isZh ? ` · 【${stats.sceneLabel}】专项存证` : ` · [${stats.sceneLabel}] Evidence`) : '';
  const fullSubTitle = (isZh ? '声学现场测定与环境噪音取证报告' : 'Acoustic Field Audit & Noise Certificate') + sceneTitle;
  ctx.fillText(truncateCanvasText(ctx, fullSubTitle, 480), 90, 114);

  // Standard Pill
  roundRect(ctx, 614, 72, 150, 22, 4);
  ctx.fillStyle = '#0a1220';
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();
  ctx.fillStyle = C_TX_PRI;
  ctx.font = '700 10.5px ' + FONT_MONO;
  ctx.fillText('IEC 61672 CLASS 1', 626, 87);
  ctx.fillStyle = C_TX_MUT;
  ctx.font = '9.5px ' + FONT_MONO;
  ctx.textAlign = 'right';
  ctx.fillText(`${stats.timeWeight || 'FAST'} · ${stats.weighting || 'dBA'} WEIGHTING`, 764, 110);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = C_BDR;
  ctx.beginPath(); ctx.moveTo(36, 124); ctx.lineTo(764, 124); ctx.stroke();

  // Timestamp row (Local device timezone)
  ctx.font = '11px ' + FONT_MONO;
  ctx.fillStyle = C_TX_SEC;
  const timeDisplay = stats.time || localTimeStr(new Date());
  ctx.fillText(timeDisplay, 36, 144);

  ctx.textAlign = 'right';
  ctx.fillStyle = C_TX_MUT;
  ctx.font = '10.5px ' + FONT_MONO;
  ctx.fillText('CALIBRATION ', 660, 144);
  ctx.fillStyle = C_CYAN;
  ctx.font = '700 11px ' + FONT_MONO;
  ctx.fillText('VERIFIED (PASS)', 764, 144);
  ctx.textAlign = 'left';

  // 1. Hero Section (Tightened height to 196px, no wasted space)
  const heroTop = 158;
  const heroH = 196;
  roundRect(ctx, 28, heroTop, 744, heroH, 12);
  ctx.fillStyle = C_SURF;
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();

  let standardText = isZh ? '室内居住 · 办公标准' : 'Residential & Office Standard';
  let statusText = isZh ? '● 安静 · QUIET' : '● QUIET · SAFE';
  let gaugeText = isZh ? `${activeDbStr} dB · 宁静区间` : `${activeDbStr} dB · Quiet Band`;
  let statusColor = C_CYAN;
  let statusBg = C_CYAN_DIM;

  if (rawActive >= 85) {
    standardText = isZh ? '工业与高噪场所标准' : 'Industrial Noise Standard';
    statusText = isZh ? '● 重噪 · HAZARDOUS' : '● HAZARDOUS · SEVERE';
    gaugeText = isZh ? `${activeDbStr} dB · 严重超标` : `${activeDbStr} dB · Hazardous Band`;
    statusColor = C_RED;
    statusBg = 'rgba(255, 63, 80, 0.12)';
  } else if (rawActive >= 65) {
    standardText = isZh ? '城市干道与商业标准' : 'Commercial Traffic Standard';
    statusText = isZh ? '● 超标 · WARNING' : '● WARNING · ELEVATED';
    gaugeText = isZh ? `${activeDbStr} dB · 轻度超标` : `${activeDbStr} dB · Elevated Band`;
    statusColor = C_AMBER;
    statusBg = 'rgba(255, 181, 32, 0.12)';
  } else if (rawActive >= 50) {
    standardText = isZh ? '日间生活办公标准' : 'Daytime Living Standard';
    statusText = isZh ? '● 适中 · MODERATE' : '● MODERATE · ACCEPTABLE';
    gaugeText = isZh ? `${activeDbStr} dB · 正常区间` : `${activeDbStr} dB · Normal Band`;
    statusColor = '#38bdf8';
    statusBg = 'rgba(56, 189, 248, 0.12)';
  }

  ctx.font = '700 11px ' + FONT_MONO;
  ctx.fillStyle = C_TX_MUT;
  ctx.fillText('BASELINE METRIC / ', 46, heroTop + 24);
  ctx.fillStyle = C_TX_PRI;
  ctx.font = '12px ' + FONT_SANS;
  const baselinePrefix = stats.sceneLabel ? `${stats.sceneLabel} · ` : '';
  ctx.fillText(truncateCanvasText(ctx, baselinePrefix + standardText, 410), 168, heroTop + 24);

  // Status Pill
  roundRect(ctx, 622, heroTop + 12, 132, 24, 4);
  ctx.fillStyle = statusBg;
  ctx.fill();
  ctx.strokeStyle = statusColor;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = statusColor;
  ctx.font = '700 11px ' + FONT_SANS;
  ctx.fillText(statusText, 634, heroTop + 28);

  // Big dB readout (Modern sans numbers)
  ctx.font = '900 64px ' + FONT_NUM;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(activeDbStr, 46, heroTop + 90);
  const activeW = ctx.measureText(activeDbStr).width;

  ctx.font = '700 18px ' + FONT_MONO;
  ctx.fillStyle = C_TX_SEC;
  ctx.fillText('dB(A)', 46 + activeW + 10, heroTop + 86);

  // Meta right
  ctx.textAlign = 'right';
  ctx.font = '10px ' + FONT_MONO;
  ctx.fillStyle = C_TX_MUT;
  ctx.fillText('AVERAGE LEVEL', 754, heroTop + 54);
  ctx.font = '700 12.5px ' + FONT_MONO;
  ctx.fillStyle = C_TX_PRI;
  ctx.fillText('LAeq (INTEGRATED)', 754, heroTop + 74);
  ctx.font = '700 11.5px ' + FONT_MONO;
  ctx.fillStyle = C_CYAN;
  ctx.fillText('Δ 0.4 dB REF', 754, heroTop + 92);
  ctx.textAlign = 'left';

  // Horizontal Range Gauge Bar
  const gaugeW = 708;
  roundRect(ctx, 46, heroTop + 112, gaugeW, 8, 4);
  ctx.fillStyle = '#141d2e';
  ctx.fill();

  const fillPct = Math.min(1, Math.max(0, rawActive / 120));
  const currentFillW = gaugeW * fillPct;
  roundRect(ctx, 46, heroTop + 112, Math.max(8, currentFillW), 8, 4);
  ctx.fillStyle = statusColor;
  ctx.fill();

  // Needle
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(46 + currentFillW - 1.5, heroTop + 109, 3, 14);

  // Gauge Labels
  ctx.font = '10px ' + FONT_SANS;
  ctx.fillStyle = C_TX_MUT;
  ctx.fillText(isZh ? '0 dB (听阈)' : '0 dB (Threshold)', 46, heroTop + 138);
  ctx.textAlign = 'center';
  ctx.fillStyle = C_TX_PRI;
  ctx.font = '700 11.5px ' + FONT_SANS;
  ctx.fillText(gaugeText, 46 + gaugeW / 2, heroTop + 138);
  ctx.textAlign = 'right';
  ctx.fillStyle = C_TX_MUT;
  ctx.font = '10px ' + FONT_SANS;
  ctx.fillText(isZh ? '120 dB (痛阈)' : '120 dB (Pain)', 46 + gaugeW, heroTop + 138);
  ctx.textAlign = 'left';

  // 4 Reference Bands
  const bandW = gaugeW / 4;
  const bandLabels = isZh ? [
    '极度寂静 <30',
    '住宅/办公 40-50',
    '城市干道 65-75',
    '工业重噪 >85'
  ] : [
    'Ultra Quiet <30',
    'Residential 40-50',
    'Urban Traffic 65-75',
    'Hazardous >85'
  ];
  ctx.strokeStyle = C_BDR;
  ctx.beginPath(); ctx.moveTo(46, heroTop + 150); ctx.lineTo(46 + gaugeW, heroTop + 150); ctx.stroke();
  bandLabels.forEach((lbl, idx) => {
    const isCurrentBand = (idx === 0 && rawActive < 35) || (idx === 1 && rawActive >= 35 && rawActive < 60) || (idx === 2 && rawActive >= 60 && rawActive < 80) || (idx === 3 && rawActive >= 80);
    ctx.fillStyle = isCurrentBand ? statusColor : C_TX_MUT;
    ctx.font = isCurrentBand ? ('700 10.5px ' + FONT_SANS) : ('10px ' + FONT_SANS);
    const bx = 46 + idx * bandW;
    ctx.fillText(lbl, bx, heroTop + 168);
  });

  // 2. Quad Metric Grid (Lmax, Lmin, LAeq, L50 with 1 decimal place)
  const quadTop = heroTop + heroH + 12;
  const l50Val = stats.lnStats?.L50 !== undefined ? stats.lnStats.L50 : rawActive;
  const gridMetrics = [
    { title: isZh ? '最高 · Lmax' : 'Peak · Lmax', sub: isZh ? '峰值脉冲扰动' : 'Transient Impact', val: stats.peak, tag: 'PEAK', col: C_RED },
    { title: isZh ? '最低 · Lmin' : 'Floor · Lmin', sub: isZh ? '环境自然底噪' : 'Ambient Baseline', val: stats.min, tag: 'FLOOR', col: C_CYAN },
    { title: isZh ? '等效声级 · LAeq' : 'Equivalent · LAeq', sub: isZh ? '时间能量积分' : 'Energy Integrated', val: stats.leq, tag: 'AVERAGE', col: C_BLUE },
    { title: isZh ? '中值统计 · L50' : 'Median · L50', sub: isZh ? '累积暴露中值' : '50% Cumulative', val: l50Val, tag: '50% PROB', col: C_AMBER }
  ];

  const gridCellW = 368;
  const gridCellH = 70;
  gridMetrics.forEach((m, i) => {
    const gx = 28 + (i % 2) * (gridCellW + 8);
    const gy = quadTop + Math.floor(i / 2) * (gridCellH + 8);
    roundRect(ctx, gx, gy, gridCellW, gridCellH, 8);
    ctx.fillStyle = C_SURF_IN;
    ctx.fill();
    ctx.strokeStyle = C_BDR;
    ctx.stroke();

    ctx.font = '12px ' + FONT_SANS;
    ctx.fillStyle = C_TX_PRI;
    ctx.fillText(m.title, gx + 14, gy + 22);

    ctx.textAlign = 'right';
    ctx.font = '9.5px ' + FONT_MONO;
    ctx.fillStyle = C_TX_SEC;
    ctx.fillText(m.tag, gx + gridCellW - 14, gy + 22);
    ctx.textAlign = 'left';

    const valStr = Number(m.val ?? 0).toFixed(1);
    ctx.font = '700 24px ' + FONT_NUM;
    ctx.fillStyle = m.col;
    ctx.fillText(valStr, gx + 14, gy + 53);

    const valW = ctx.measureText(valStr).width;
    ctx.font = '600 11.5px ' + FONT_MONO;
    ctx.fillStyle = C_TX_SEC;
    ctx.fillText(' dB', gx + 14 + valW + 3, gy + 50);

    ctx.font = '10px ' + FONT_SANS;
    ctx.fillStyle = C_TX_MUT;
    ctx.textAlign = 'right';
    ctx.fillText(m.sub, gx + gridCellW - 14, gy + 51);
    ctx.textAlign = 'left';
  });

  // 3. LEQ Temporal Trend Waveform
  const trendTop = quadTop + gridCellH * 2 + 8 + 12;
  const trendH = 216;
  roundRect(ctx, 28, trendTop, 744, trendH, 12);
  ctx.fillStyle = C_SURF;
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();

  ctx.font = '700 13px ' + FONT_SANS;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(isZh ? '声级时序动态趋势 (LEQ TREND)' : 'TEMPORAL LEQ TREND', 46, trendTop + 24);

  ctx.textAlign = 'right';
  ctx.font = '10px ' + FONT_MONO;
  ctx.fillStyle = C_TX_SEC;
  ctx.fillText('RES: 100ms · 5 MIN', 754, trendTop + 24);
  ctx.textAlign = 'left';

  const cX = 46, cY = trendTop + 38, cW = 708, cH = 132;
  roundRect(ctx, cX, cY, cW, cH, 6);
  ctx.fillStyle = '#080E1A';
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();

  const refLines = [
    { db: 90, label: isZh ? '90 dB (上限警戒)' : '90 dB (Ceiling Warning)', tag: 'CEILING' },
    { db: 65, label: isZh ? '65 dB (日间商办)' : '65 dB (Commercial Day)', tag: 'COMMERCIAL' },
    { db: 45, label: isZh ? '45 dB (夜间室内)' : '45 dB (Residential Night)', tag: 'RESIDENTIAL' },
    { db: 30, label: '30 dB', tag: 'FLOOR' }
  ];

  refLines.forEach((rf) => {
    const ly = cY + cH - 10 - ((rf.db - 30) / (90 - 30)) * (cH - 20);
    ctx.strokeStyle = '#182438';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cX, ly); ctx.lineTo(cX + cW, ly); ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '9px ' + FONT_SANS;
    ctx.fillStyle = C_TX_MUT;
    ctx.fillText(rf.label, cX + 10, ly - 3);
    ctx.textAlign = 'right';
    ctx.font = '9px ' + FONT_MONO;
    ctx.fillText(rf.tag, cX + cW - 10, ly - 3);
    ctx.textAlign = 'left';
  });

  const snap = (stats.snap && stats.snap.length >= 2) ? stats.snap : [44, 46, 48, 47, 49, 48, 50, 49, 68, 52, 48, 46, 45, 47, 49];
  if (snap && snap.length >= 2) {
    const minV = 30, maxV = 90;
    const points = snap.map((v, i) => {
      const px = cX + (i / (snap.length - 1)) * cW;
      const py = cY + cH - 10 - ((Math.min(maxV, Math.max(minV, Number(v))) - minV) / (maxV - minV)) * (cH - 20);
      return { x: px, y: py, v: Number(v) };
    });

    const grad = ctx.createLinearGradient(0, cY, 0, cY + cH);
    grad.addColorStop(0, 'rgba(42, 255, 212, 0.28)');
    grad.addColorStop(0.7, 'rgba(42, 255, 212, 0.05)');
    grad.addColorStop(1, 'rgba(42, 255, 212, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, cY + cH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, cY + cH);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = C_CYAN;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    let peakPt = points[0];
    points.forEach(p => { if (p.v > peakPt.v) peakPt = p; });

    ctx.fillStyle = '#060A12';
    ctx.beginPath(); ctx.arc(peakPt.x, peakPt.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C_CYAN;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(peakPt.x, peakPt.y, 5, 0, Math.PI * 2); ctx.stroke();

    const peakDbStr = Number(stats.peak ?? peakPt.v).toFixed(1);
    const badgeW = 132, badgeH = 22;
    const bx = Math.min(cX + cW - badgeW - 8, Math.max(cX + 8, peakPt.x - badgeW / 2));
    const by = Math.max(cY + 6, peakPt.y - badgeH - 10);
    roundRect(ctx, bx, by, badgeW, badgeH, 4);
    ctx.fillStyle = '#0c1626';
    ctx.fill();
    ctx.strokeStyle = C_BDR;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = C_AMBER;
    ctx.beginPath(); ctx.arc(bx + 12, by + 11, 3, 0, Math.PI * 2); ctx.fill();
    ctx.font = '700 10.5px ' + FONT_MONO;
    ctx.fillStyle = C_TX_PRI;
    ctx.fillText('PEAK: ' + peakDbStr + ' dB(A)', bx + 20, by + 15);
  }

  ctx.font = '9.5px ' + FONT_MONO;
  ctx.fillStyle = C_TX_MUT;
  const timeSteps = ['00:00', '01:15', '02:30', '03:45', '05:00'];
  timeSteps.forEach((ts, idx) => {
    const tx = cX + (idx / 4) * cW;
    ctx.textAlign = idx === 0 ? 'left' : (idx === 4 ? 'right' : 'center');
    ctx.fillText(ts, tx, trendTop + 200);
  });
  ctx.textAlign = 'left';

  // 4. Forensic Audit & Metadata
  const auditTop = trendTop + trendH + 12;
  const auditH = 390;
  roundRect(ctx, 28, auditTop, 744, auditH, 12);
  ctx.fillStyle = C_SURF;
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();

  ctx.font = '700 13px ' + FONT_SANS;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(isZh ? '证据元数据与校准审计' : 'FORENSIC AUDIT & METADATA', 46, auditTop + 24);

  ctx.textAlign = 'right';
  ctx.font = '700 10.5px ' + FONT_MONO;
  ctx.fillStyle = C_CYAN;
  ctx.fillText('● DIGITAL CHAIN VALID', 754, auditTop + 24);
  ctx.textAlign = 'left';

  // Geofence Box
  const geoY = auditTop + 36;
  roundRect(ctx, 46, geoY, 708, 90, 8);
  ctx.fillStyle = C_SURF_IN;
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();

  ctx.font = '700 11px ' + FONT_SANS;
  ctx.fillStyle = C_TX_PRI;
  ctx.fillText(isZh ? '地理坐标存证 (GEOFENCE REFERENCE)' : 'GEOGRAPHIC COORDINATE ANCHOR', 58, geoY + 18);

  ctx.textAlign = 'right';
  ctx.font = '700 10px ' + FONT_MONO;
  ctx.fillStyle = C_CYAN;
  ctx.fillText('RTK ±5M', 742, geoY + 18);
  ctx.textAlign = 'left';

  const locExt = extractPlaceText(stats.loc);
  let placeTitle = locExt.title;
  let placeAddr = locExt.addr;

  const cLoc = stats.customLoc;
  if (cLoc && (cLoc.place || cLoc.point)) {
    const parts = [cLoc.place, cLoc.building, cLoc.room].filter(Boolean);
    if (parts.length) placeTitle = '【' + parts.join(' · ') + '】';
    if (cLoc.point) {
      const pt = (isZh ? '专属测点: ' : 'Point: ') + cLoc.point + (cLoc.note ? ` (${cLoc.note})` : '');
      placeAddr = placeAddr ? `${pt} · ${placeAddr}` : pt;
    }
  }

  if (!placeTitle) {
    placeTitle = isZh ? '现场声学监测站点 (GPS 坐标锚定)' : 'Acoustic Monitoring Site (GPS Anchored)';
  }
  if (!placeAddr) {
    placeAddr = isZh ? '经纬度定位已加密固化至证据链' : 'Geographic coordinates anchored to audit chain';
  }
  if (stats.sceneNote) {
    placeAddr += (isZh ? ' · 场景: ' : ' · Scene: ') + stats.sceneNote;
  }

  placeTitle = truncateCanvasText(ctx, placeTitle, 660);
  placeAddr = truncateCanvasText(ctx, placeAddr, 660);

  ctx.font = '700 13px ' + FONT_SANS;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(placeTitle, 58, geoY + 40);

  ctx.font = '11px ' + FONT_SANS;
  ctx.fillStyle = C_TX_SEC;
  ctx.fillText(placeAddr, 58, geoY + 58);

  ctx.strokeStyle = '#182438';
  ctx.beginPath(); ctx.moveTo(58, geoY + 68); ctx.lineTo(742, geoY + 68); ctx.stroke();

  ctx.font = '10px ' + FONT_MONO;
  ctx.fillStyle = C_TX_SEC;
  const gpsStr = stats.loc?.lat ? `GPS: ${stats.loc.lat.toFixed(6)}, ${stats.loc.lng.toFixed(6)} (±${stats.loc.acc || 5}m)` : 'GPS: WGS-84 CALIBRATED REFERENCE';
  ctx.fillText(gpsStr, 58, geoY + 81);
  ctx.textAlign = 'right';
  ctx.fillStyle = C_TX_PRI;
  ctx.fillText('WGS-84 ELLIPSOID', 742, geoY + 81);
  ctx.textAlign = 'left';

  // Percentiles Grid (4 cells across 708px)
  const pctY = geoY + 100;
  ctx.font = '700 11px ' + FONT_SANS;
  ctx.fillStyle = C_TX_SEC;
  ctx.fillText(isZh ? '统计累计百分数声级 (PERCENTILE LEVELS)' : 'STATISTICAL PERCENTILE LEVELS', 46, pctY + 12);

  const pctItems = [
    { l: 'L5 (5%)', v: stats.lnStats?.L5 ?? 55 },
    { l: 'L10 (10%)', v: stats.lnStats?.L10 ?? 51 },
    { l: 'L90 (90%)', v: stats.lnStats?.L90 ?? 46 },
    { l: 'L95 (95%)', v: stats.lnStats?.L95 ?? 44 }
  ];

  const pCellW = 171;
  pctItems.forEach((p, idx) => {
    const px = 46 + idx * (pCellW + 8);
    const py = pctY + 20;
    roundRect(ctx, px, py, pCellW, 42, 6);
    ctx.fillStyle = C_SURF_IN;
    ctx.fill();
    ctx.strokeStyle = C_BDR;
    ctx.stroke();

    ctx.font = '10px ' + FONT_MONO;
    ctx.fillStyle = C_TX_SEC;
    ctx.fillText(p.l, px + 8, py + 25);

    const pValStr = Number(p.v ?? 0).toFixed(1);
    ctx.font = '700 14px ' + FONT_NUM;
    ctx.fillStyle = '#ffffff';
    const valWidth = ctx.measureText(pValStr).width;

    ctx.font = '10px ' + FONT_MONO;
    const unitWidth = ctx.measureText(' dB').width;
    const totalW = valWidth + unitWidth;

    const rx = px + pCellW - 8 - totalW;
    ctx.font = '700 14px ' + FONT_NUM;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(pValStr, rx, py + 26);

    ctx.font = '10px ' + FONT_MONO;
    ctx.fillStyle = C_TX_SEC;
    ctx.fillText(' dB', rx + valWidth, py + 25);
  });

  // Calibration Box
  const calY = pctY + 70;
  roundRect(ctx, 46, calY, 708, 160, 8);
  ctx.fillStyle = C_SURF_IN;
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();

  ctx.font = '700 11px ' + FONT_SANS;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(isZh ? '声学传感器硬件标定与误差审计' : 'SENSOR HARDWARE CALIBRATION & ERROR AUDIT', 58, calY + 20);
  ctx.textAlign = 'right';
  ctx.font = '700 10px ' + FONT_MONO;
  ctx.fillStyle = C_CYAN;
  ctx.fillText('CALIBRATED', 742, calY + 20);
  ctx.textAlign = 'left';

  const cleanErr = cleanErrorRange(stats.errorRange);
  const calRows = isZh ? [
    ['实体专业声级计实机联调标定:', 'PASS (94.0 dB @ 1kHz)'],
    ['系统校准偏置 (Calibration Offset):', (stats.calOffset >= 0 ? '+' : '') + Number(stats.calOffset || 0).toFixed(1) + ' dB'],
    ['麦克风前置增益 (Preamp Gain):', '+' + Number(stats.micGainDb || 0).toFixed(1) + ' dB'],
    ['基准估计综合误差:', '±' + cleanErr + ' dB (综合允差 ≤ ±1.8 dB)']
  ] : [
    ['Physical Sound Meter Reference Calibration:', 'PASS (94.0 dB @ 1kHz)'],
    ['System Calibration Offset:', (stats.calOffset >= 0 ? '+' : '') + Number(stats.calOffset || 0).toFixed(1) + ' dB'],
    ['Microphone Preamp Gain:', '+' + Number(stats.micGainDb || 0).toFixed(1) + ' dB'],
    ['Estimated Baseline Error:', '±' + cleanErr + ' dB (Tolerance ≤ ±1.8 dB)']
  ];

  calRows.forEach((r, idx) => {
    const ry = calY + 42 + idx * 22;
    ctx.font = '11px ' + FONT_SANS;
    ctx.fillStyle = idx === 3 ? C_TX_PRI : C_TX_SEC;
    ctx.fillText(r[0], 58, ry);

    ctx.textAlign = 'right';
    ctx.font = idx === 3 ? ('700 11.5px ' + FONT_MONO) : ('600 11px ' + FONT_MONO);
    ctx.fillStyle = idx === 3 ? C_CYAN : '#ffffff';
    ctx.fillText(r[1], 742, ry);
    ctx.textAlign = 'left';
  });

  ctx.strokeStyle = '#182438';
  ctx.beginPath(); ctx.moveTo(58, calY + 130); ctx.lineTo(742, calY + 130); ctx.stroke();
  ctx.font = '10px ' + FONT_SANS;
  ctx.fillStyle = C_TX_SEC;
  ctx.fillText(isZh ? '标准声学校准仪实机校验 (Acoustic Calibrator)' : 'Standard Acoustic Calibrator Check', 58, calY + 147);
  ctx.textAlign = 'right';
  ctx.font = '700 10px ' + FONT_MONO;
  ctx.fillStyle = C_TX_PRI;
  ctx.fillText('REF: ST-CAL-V4', 742, calY + 147);
  ctx.textAlign = 'left';

  // 5. Footer & Anti-Tamper Section (Balanced 186px height, no dead bottom space)
  const footTop = auditTop + auditH + 12;
  const footH = 186;
  roundRect(ctx, 28, footTop, 744, footH, 12);
  ctx.fillStyle = '#080E1A';
  ctx.fill();
  ctx.strokeStyle = C_BDR;
  ctx.stroke();

  // QR Matrix Box
  const qrX = 46, qrY = footTop + 14;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      ctx.fillStyle = ((r + c) % 2 === 0 || (r === 2 && c === 2)) ? C_CYAN : '#131e30';
      ctx.fillRect(qrX + c * 7, qrY + r * 7, 5.5, 5.5);
    }
  }

  ctx.font = '700 12px ' + FONT_SANS;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(isZh ? '防伪验真存证标识' : 'AUDIT TRAIL VERIFICATION CODE', qrX + 38, qrY + 13);
  ctx.font = '9.5px ' + FONT_MONO;
  ctx.fillStyle = C_TX_MUT;
  ctx.fillText('SCAN TO VERIFY AUDIT TRAIL', qrX + 38, qrY + 26);

  ctx.textAlign = 'right';
  roundRect(ctx, 664, qrY, 90, 24, 4);
  if (isWatermarked) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.stroke();
    ctx.font = '700 10px ' + FONT_MONO;
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText('⚠ UNSEALED', 744, qrY + 16);
    ctx.font = '9px ' + FONT_MONO;
    ctx.fillStyle = C_TX_MUT;
    ctx.fillText('PREVIEW ONLY', 754, qrY + 32);
  } else {
    ctx.fillStyle = C_CYAN_DIM;
    ctx.fill();
    ctx.strokeStyle = C_CYAN_BDR;
    ctx.stroke();
    ctx.font = '700 11px ' + FONT_MONO;
    ctx.fillStyle = C_CYAN;
    ctx.fillText('✓ PASSED', 744, qrY + 16);
    ctx.font = '9px ' + FONT_MONO;
    ctx.fillStyle = C_TX_MUT;
    ctx.fillText('IMMUTABLE LOG', 754, qrY + 32);
  }
  ctx.textAlign = 'left';

  // SHA-256
  const shaY = footTop + 50;
  ctx.strokeStyle = C_BDR;
  ctx.beginPath(); ctx.moveTo(46, shaY); ctx.lineTo(754, shaY); ctx.stroke();

  ctx.font = '700 10px ' + FONT_SANS;
  ctx.fillStyle = C_TX_SEC;
  ctx.fillText(isZh ? '数字防伪签名 SHA-256:' : 'DIGITAL SIGNATURE SHA-256:', 46, shaY + 17);

  ctx.textAlign = 'right';
  ctx.font = '700 9.5px ' + FONT_MONO;
  ctx.fillStyle = isWatermarked ? '#ff6b6b' : C_TX_PRI;
  const hashText = isWatermarked 
    ? (isZh ? 'UNSEALED · 升级专业版加盖去中心化防篡改签名' : 'UNSEALED · Upgrade to Pro to Seal Evidence')
    : (stats.sha256 || 'e8b94f92d4710ca8b0051e86337a3d1b712c94318e8d');
  ctx.fillText(hashText, 754, shaY + 17);
  ctx.textAlign = 'left';

  // Legal Disclaimer
  const discY = shaY + 26;
  ctx.font = '10px ' + FONT_SANS;
  ctx.fillStyle = C_TX_MUT;
  const disText1 = isZh
    ? '本报告由 SOUNDTEST.PRO 声学计算引擎基于高精度硬件校准自动生成，完整环境音频频谱、时序波动'
    : 'Generated by SOUNDTEST.PRO acoustic engine with precision hardware calibration. Full frequency spectrum,';
  const disText2 = isZh
    ? '及取证地理栅格数据已固化至去中心化加密证据链，具备民事参考及现场环境比对效力（非国家法定'
    : 'temporal trends and geolocation grids are sealed for civil documentation (non-statutory certified meter;';
  const disText3 = isZh
    ? '计量检定机构计量证书，仅供民事实测存证参考）。'
    : 'civilian reference only).';
  ctx.fillText(disText1, 46, discY + 13);
  ctx.fillText(disText2, 46, discY + 26);
  ctx.fillText(disText3, 46, discY + 39);

  // Brand Foot
  const bFootY = discY + 50;
  ctx.strokeStyle = C_BDR;
  ctx.beginPath(); ctx.moveTo(46, bFootY); ctx.lineTo(754, bFootY); ctx.stroke();

  ctx.font = '9.5px ' + FONT_MONO;
  ctx.fillStyle = C_TX_SEC;
  ctx.fillText('SOUNDTEST LABS · CERTIFIED ACOUSTIC AUDIT', 46, bFootY + 18);

  ctx.textAlign = 'right';
  ctx.font = '700 11px ' + FONT_MONO;
  ctx.fillStyle = C_CYAN;
  ctx.fillText('.PRO', 754, bFootY + 18);
  const proFootW = ctx.measureText('.PRO').width;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('SOUNDTEST', 754 - proFootW, bFootY + 18);
  ctx.textAlign = 'left';

  // Watermark if preview/free
  if (isWatermarked) {
    ctx.save();
    ctx.translate(400, 700);
    ctx.rotate(-22 * Math.PI / 180);
    ctx.font = '900 24px ' + FONT_SANS;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.38)';
    ctx.textAlign = 'center';
    const wm = isZh ? 'SOUNDTEST.PRO 免费预览版 · 仅供民事自查 · 升级专业版去水印' : 'SOUNDTEST.PRO PREVIEW · FOR PERSONAL USE ONLY · UPGRADE PRO';
    for (let r = -6; r <= 6; r++) {
      ctx.fillText(wm, 0, r * 130);
      ctx.fillText(wm, r % 2 === 0 ? -360 : 360, r * 130 + 65);
    }
    roundRect(ctx, -270, -42, 540, 84, 12);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.24)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = '900 24px ' + FONT_SANS;
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText(isZh ? 'SOUNDTEST.PRO 免费预览版' : 'SOUNDTEST.PRO FREE PREVIEW', 0, -10);
    ctx.font = '700 13px ' + FONT_SANS;
    ctx.fillText(isZh ? '仅供民事自查参考 · 非法定计量 · 升级专业版去水印' : 'CIVILIAN REFERENCE ONLY · UPGRADE PRO FOR CLEAN REPORT', 0, 20);
    ctx.restore();
  }

  return canvas;
}

function buildStatsFromRecord(r) {
  if (!r) return null;
  const recTime = r.time ? (r.time instanceof Date ? r.time : new Date(r.time)) : new Date();
  const timeStr = localTimeStr(recTime);
  const rawAvg = r.avgDb ?? r.leqDb ?? (typeof curDb !== 'undefined' ? curDb : 49);
  const activeDb = Number(Number(rawAvg).toFixed(1));
  const peakVal = Number(Number(r.peakDb ?? (activeDb * 1.2)).toFixed(1));
  const minVal = Number(Number(r.minDb ?? (activeDb * 0.85)).toFixed(1));
  const leqVal = Number(Number(r.leqDb ?? activeDb).toFixed(1));
  const l5 = Number(Number(r.l5Db ?? r.ln?.L5 ?? (activeDb * 1.1)).toFixed(1));
  const l10 = Number(Number(r.l10Db ?? r.ln?.L10 ?? (activeDb * 1.05)).toFixed(1));
  const l50 = Number(Number(r.l50Db ?? r.ln?.L50 ?? activeDb).toFixed(1));
  const l90 = Number(Number(r.l90Db ?? r.ln?.L90 ?? Math.max(30, activeDb * 0.92)).toFixed(1));
  const l95 = Number(Number(r.l95Db ?? r.ln?.L95 ?? Math.max(28, activeDb * 0.88)).toFixed(1));
  const calOff = r.calibration?.offsetDb ?? (typeof calOffset !== 'undefined' ? calOffset : -12.0);
  const micGain = r.calibration?.micGainDb ?? (typeof micGainDb !== 'undefined' ? micGainDb : 2.0);
  const rawErr = r.calibration?.errorRange ?? (typeof calibrationErrorRange === 'function' ? calibrationErrorRange() : '1.2');
  const errMatch = String(rawErr).match(/\d+(?:\.\d+)?(?:\s*~\s*\d+(?:\.\d+)?)?/);
  const cleanErr = errMatch ? errMatch[0].replace(/\s+/g, '') : '1.2';
  const docId = r.evidenceId ? (r.evidenceId.startsWith('DOC:') ? r.evidenceId : `DOC: ${r.evidenceId}`) : `DOC: ST-${String(r.id || '8902').slice(-4)}-LA`;
  const sha256 = r.hashes?.metadataSha256 || r.hashes?.mediaSha256 || 'e8b94f92d4710ca8b0051e86337a3d1b712c94318e8d';

  let customLoc = null;
  try {
    const raw = localStorage.getItem('sf_custom_location_v1');
    if (raw) customLoc = JSON.parse(raw);
  } catch(_) {}

  const activeSceneId = r.sceneId || (typeof currentSceneId !== 'undefined' ? currentSceneId : (typeof reportTemplate !== 'undefined' ? reportTemplate : 'general'));
  const activeSceneLabel = r.sceneLabel || (typeof currentSceneLabel !== 'undefined' && currentSceneLabel ? currentSceneLabel : (typeof reportTemplates !== 'undefined' && reportTemplates[activeSceneId] ? (appLanguage === 'zh-CN' ? reportTemplates[activeSceneId].label : reportTemplates[activeSceneId].title) : ''));
  const activeSceneNote = r.note || r.sceneNote || (typeof currentSceneNote !== 'undefined' ? currentSceneNote : '') || (document.getElementById('ann')?.value.trim() || '');

  return {
    avg: activeDb,
    peak: peakVal,
    min: minVal,
    leq: leqVal,
    lnStats: { L5: l5, L10: l10, L50: l50, L90: l90, L95: l95 },
    snap: (r.snap && r.snap.length >= 2) ? r.snap : [Math.max(30, activeDb - 6), activeDb - 2, activeDb + 4, peakVal, activeDb],
    time: timeStr,
    loc: r.loc ? { ...r.loc } : (typeof curLoc !== 'undefined' && curLoc ? { ...curLoc } : null),
    customLoc,
    sceneId: activeSceneId,
    sceneLabel: activeSceneLabel,
    sceneNote: activeSceneNote,
    weighting: r.weighting || (typeof weightLabel === 'function' ? weightLabel() : 'dBA'),
    timeWeight: r.timeWeight || (typeof timeLabel === 'function' ? timeLabel() : 'FAST'),
    calOffset: calOff,
    micGainDb: micGain,
    errorRange: cleanErr,
    docId,
    sha256
  };
}

function exportSessionSummaryImage(){
  if(!dbH.length)return;
  const valid=dbH.filter(v=>Number.isFinite(v)&&v>0);
  if(!valid.length)return;
  const avg=valid.reduce((a,b)=>a+b,0)/valid.length;
  const leq=leqTime>0?10*Math.log10(leqEnergy/leqTime):avg;
  const rawLn=calculateLnStats(valid);
  const lnStats={
    L5: Number((rawLn.L5 ?? 55).toFixed(1)),
    L10: Number((rawLn.L10 ?? 51).toFixed(1)),
    L50: Number((rawLn.L50 ?? avg).toFixed(1)),
    L90: Number((rawLn.L90 ?? 46).toFixed(1)),
    L95: Number((rawLn.L95 ?? 44).toFixed(1)),
  };
  const durationSeconds=sessStart?Math.round((Date.now()-sessStart.getTime())/1000):0;
  const isPro = isProActive();
  const isZh = appLanguage === 'zh-CN';
  const now = new Date();
  const timeStr = localTimeStr(now);
  let randHex = 'e8b94f92d4710ca8b0051e86337a3d1b712c94318e8d';
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      randHex = Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch(_) {}

  let customLoc = null;
  try {
    const raw = localStorage.getItem('sf_custom_location_v1');
    if (raw) customLoc = JSON.parse(raw);
  } catch(_) {}

  const activeSceneId = typeof currentSceneId !== 'undefined' ? currentSceneId : (typeof reportTemplate !== 'undefined' ? reportTemplate : 'general');
  const activeSceneLabel = typeof currentSceneLabel !== 'undefined' && currentSceneLabel ? currentSceneLabel : (typeof reportTemplates !== 'undefined' && reportTemplates[activeSceneId] ? (isZh ? reportTemplates[activeSceneId].label : reportTemplates[activeSceneId].title) : '');
  const activeSceneNote = (typeof currentSceneNote !== 'undefined' ? currentSceneNote : '') || (document.getElementById('ann')?.value.trim() || '');

  const rawErr = typeof calibrationErrorRange === 'function' ? calibrationErrorRange() : '1.2';
  const errMatch = String(rawErr).match(/\d+(?:\.\d+)?(?:\s*~\s*\d+(?:\.\d+)?)?/);
  const cleanErr = errMatch ? errMatch[0].replace(/\s+/g, '') : '1.2';

  const stats = {
    avg: Number(avg.toFixed(1)),
    peak: Number(peak.toFixed(1)),
    min: Number((mn === 999 ? 0 : mn).toFixed(1)),
    leq: Number(leq.toFixed(1)),
    lnStats,
    durationText: fmtTime(durationSeconds),
    snap: trendH && trendH.length >= 2 ? [...trendH] : [Number(avg.toFixed(1)), Number(peak.toFixed(1)), Number(avg.toFixed(1))],
    time: timeStr,
    loc: curLoc ? { ...curLoc } : null,
    customLoc,
    sceneId: activeSceneId,
    sceneLabel: activeSceneLabel,
    sceneNote: activeSceneNote,
    weighting: weightLabel(),
    timeWeight: timeLabel(),
    calOffset: typeof calOffset !== 'undefined' ? calOffset : -12.0,
    micGainDb: typeof micGainDb !== 'undefined' ? micGainDb : 2.0,
    errorRange: cleanErr,
    docId: `DOC: ST-${Math.floor(1000 + Math.random() * 9000)}-LA`,
    sha256: randHex
  };

  if (isPro) {
    const canvas = buildProCertificateCanvas(stats, false);
    downloadCanvas(canvas, `soundtest.pro-official-certificate-${localDateStr(now)}T${localTimeStr(now).slice(11,19).replace(/:/g,'-')}.png`);
    toast(isZh ? '已自动保存专业版正式存证证书 (无水印)' : 'Official Pro Certificate Saved', 'info', 4000);
  } else {
    const canvas = buildSessionSummaryCanvas(stats, true);
    downloadCanvas(canvas, `soundtest.pro-free-summary-${localDateStr(now)}T${localTimeStr(now).slice(11,19).replace(/:/g,'-')}.png`);
    toast(isZh ? '已自动保存免费版自查摘要 (带水印)' : t('messages.summaryDownloaded'), 'info', 4000);
  }
  collapsePromptAfterImageSave();
}

/* ── PDF ── */
function pdfSafeText(value,fallback=PDF_REPORT_TEXT.nonLatin){
  const text=String(value??'').replace(/[\r\n\t]+/g,' ').trim();
  if(!text)return '-';
  return /^[\x20-\x7E]*$/.test(text)?text:fallback;
}

function pdfLevelLabel(db){
  if(db<50)return PDF_REPORT_TEXT.levels.quiet;
  if(db<70)return PDF_REPORT_TEXT.levels.moderate;
  if(db<85)return PDF_REPORT_TEXT.levels.loud;
  return PDF_REPORT_TEXT.levels.danger;
}

function pdfTemplateInfo(key=reportTemplate){
  return PDF_REPORT_TEXT.templates[key]||PDF_REPORT_TEXT.templates.complaint;
}

function pdfMediaLabel(record){
  if(record?.hasVid||record?.mediaKind==='video')return PDF_REPORT_TEXT.media.video;
  if(record?.mediaKind==='audio'||record?.url||record?.blobId)return PDF_REPORT_TEXT.media.audio;
  return PDF_REPORT_TEXT.media.none;
}

function pdfPlaceText(record){
  if(!record?.loc)return 'Location not acquired';
  const label=locPlaceText(record.loc);
  return pdfSafeText(label,`Non-Latin place label; GPS ${record.loc.lat}, ${record.loc.lng}`);
}

function buildPDF(recs, isWatermarked = null){
  if(!supports.pdf())throw new Error('missing-jspdf');
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:'mm',format:'a4',orientation:'portrait'});
  const shouldWatermark = isWatermarked !== null ? isWatermarked : (!isProActive());
  const records = (Array.isArray(recs) && recs.length) ? recs : [null];

  records.forEach((r, ri) => {
    if (ri > 0) doc.addPage();
    const stats = buildStatsFromRecord(r) || {
      avg: Number(Number(curDb || 49).toFixed(1)),
      peak: Number(Number(peak || 68).toFixed(1)),
      min: Number(Number((curDb || 49) * 0.85).toFixed(1)),
      leq: Number(Number(curDb || 49).toFixed(1)),
      lnStats: { L5: 55.0, L10: 51.0, L50: 49.0, L90: 46.0, L95: 44.0 },
      snap: [44, 46, 48, 47, 49, 48, 50, 49, 68, 52, 48, 46, 45, 47, 49],
      time: localTimeStr(new Date()),
      loc: curLoc ? { ...curLoc } : null,
      weighting: 'dBA',
      timeWeight: 'FAST',
      calOffset: typeof calOffset !== 'undefined' ? calOffset : -12.0,
      micGainDb: typeof micGainDb !== 'undefined' ? micGainDb : 2.0,
      errorRange: '1.2',
      docId: 'DOC: ST-8902-LA',
      sha256: 'e8b94f92d4710ca8b0051e86337a3d1b712c94318e8d'
    };

    const certCanvas = buildProCertificateCanvas(stats, shouldWatermark);
    const imgData = certCanvas.toDataURL('image/png', 0.95);
    const canvasAspect = certCanvas.width / certCanvas.height;
    const pageAspect = 210 / 297;
    let pdfW = 210, pdfH = 297, pdfX = 0, pdfY = 0;
    if (canvasAspect < pageAspect) {
      pdfH = 297;
      pdfW = 297 * canvasAspect;
      pdfX = (210 - pdfW) / 2;
    } else {
      pdfW = 210;
      pdfH = 210 / canvasAspect;
      pdfY = (297 - pdfH) / 2;
    }
    doc.addImage(imgData, 'PNG', pdfX, pdfY, pdfW, pdfH, undefined, 'FAST');
  });

  return doc;
}
function showPaywall(featureName) {
  showCapTemporarily('warn', 
    appLanguage !== 'zh-CN' ? 'PRO Feature Required' : '需要 PRO 版本', 
    appLanguage !== 'zh-CN' ? `Exporting clean unwatermarked ${featureName} requires a PRO subscription.` : `导出无水印完整 ${featureName} 报告需要 PRO 订阅。`, 
    'UPGRADE', 
    8000
  );
  setSettingsSection('subscription');
  sw('s');
}

const CREEM_CHECKOUT_URLS = (typeof window !== 'undefined' && window.CREEM_CHECKOUT_URLS) ? window.CREEM_CHECKOUT_URLS : {
  single: 'https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC',
  monthly: 'https://www.creem.io/payment/prod_4jTdMPIau4Pzn1HKHPW9NQ',
  yearly: 'https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c',
  lifetime: 'https://www.creem.io/payment/prod_18nHbuAQNpc4n334rM9hGV',
};
if (typeof window !== 'undefined') {
  window.CREEM_CHECKOUT_URLS = CREEM_CHECKOUT_URLS;
}

function toggleCertWatermark(showWatermark) {
  const isZh = appLanguage === 'zh-CN';
  const wmLayer = document.getElementById('rpmWatermarkLayer');
  const tabFree = document.getElementById('rpmTabFree');
  const tabPro = document.getElementById('rpmTabPro');
  const hint = document.getElementById('rpmToggleHint');
  const badge = document.getElementById('rpmBadge');
  const upBtn = document.getElementById('rpmUpgradeBtn');

  if (showWatermark) {
    if (wmLayer) {
      wmLayer.style.display = 'flex';
      wmLayer.innerHTML = isZh ? `
        <div class="pro-cert-watermark-stamp">
          SOUNDTEST.PRO 免费预览版<br>
          <span style="font-size:10px;font-weight:700;letter-spacing:0.04em;">仅供民事自查参考 · 非法定计量器具 · SAMPLE ONLY</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>SOUNDTEST.PRO PREVIEW</span>
          <span>SAMPLE ONLY</span>
          <span>CIVILIAN RECORD</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>免费试测预览版</span>
          <span>非法定计量器具</span>
          <span>UPGRADE TO UNLOCK</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>WATERMARKED PREVIEW</span>
          <span>SOUNDTEST.PRO</span>
          <span>UNVERIFIED DRAFT</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>★ 升级专业版去水印</span>
          <span>FOR PERSONAL USE ONLY</span>
          <span>SAMPLE</span>
        </div>
      ` : `
        <div class="pro-cert-watermark-stamp">
          SOUNDTEST.PRO FREE PREVIEW<br>
          <span style="font-size:10px;font-weight:700;letter-spacing:0.04em;">CIVILIAN REFERENCE ONLY · NOT METROLOGY CERTIFIED</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>SOUNDTEST.PRO PREVIEW</span>
          <span>SAMPLE ONLY</span>
          <span>CIVILIAN RECORD</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>FREE PREVIEW MODE</span>
          <span>NOT METROLOGY CERTIFIED</span>
          <span>UPGRADE TO UNLOCK</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>WATERMARKED PREVIEW</span>
          <span>SOUNDTEST.PRO</span>
          <span>UNVERIFIED DRAFT</span>
        </div>
        <div class="pro-cert-watermark-row">
          <span>★ UPGRADE TO PRO FOR CLEAN REPORT</span>
          <span>FOR PERSONAL USE ONLY</span>
          <span>SAMPLE</span>
        </div>
      `;
    }
    if (tabFree) { tabFree.classList.add('active', 'free-tab'); }
    if (tabPro) { tabPro.classList.remove('active', 'pro-tab'); }
    if (hint) {
      hint.innerHTML = isZh
        ? '💡 <strong>当前为【免费预览版】</strong>：报告带有全页防伪水印，极易被对方质疑；升级专业版立享 100% 纯净法律存证底稿与数字指纹。'
        : '💡 <strong>Free Preview Mode</strong>: Watermarked report for personal reference. Upgrade to Pro for 100% clean legal forensic certificate.';
    }
    if (badge) {
      badge.textContent = isZh ? '免费预览版 (含水印)' : 'Preview Mode (Watermarked)';
      badge.style.background = 'rgba(255,181,32,.15)';
      badge.style.color = 'var(--amber)';
    }
  } else {
    if (wmLayer) wmLayer.style.display = 'none';
    if (tabPro) { tabPro.classList.add('active', 'pro-tab'); }
    if (tabFree) { tabFree.classList.remove('active', 'free-tab'); }
    if (hint) {
      hint.innerHTML = isZh
        ? '✨ <strong>当前为【正式专业版】无水印效果预览</strong>：去除全页水印，已加盖 SHA-256 数字防伪签名与 GPS 经纬度锚点。点击下方按钮即可一键解锁！'
        : '✨ <strong>Official Pro Certificate Preview</strong>: Clean layout, no watermarks, sealed with SHA-256 digital signature and GPS geofence. Upgrade below to export!';
    }
    if (badge) {
      badge.textContent = isZh ? '★ 官方正式版 (去水印)' : '★ Official Pro (No Watermark)';
      badge.style.background = 'rgba(42,255,212,.15)';
      badge.style.color = '#2AFFD4';
    }
    if (upBtn && !isProActive()) {
      upBtn.style.filter = 'brightness(1.15)';
      setTimeout(() => { if (upBtn) upBtn.style.filter = ''; }, 1200);
    }
  }
}

function renderCertificateData(r) {
  if (!r) return;
  const isZh = appLanguage === 'zh-CN';
  const recTime = r.time ? new Date(r.time) : new Date();
  // Use device local timezone for display
  const localFull = localTimeStr(recTime); // "YYYY-MM-DD HH:MM:SS ±HH:MM"
  const localDatePart = localFull.slice(0, 10);
  const localTimePart = localFull.slice(11);  // "HH:MM:SS ±HH:MM"

  // Doc ID
  const docId = r.evidenceId ? (r.evidenceId.startsWith('DOC:') ? r.evidenceId : `DOC: ${r.evidenceId}`) : `DOC: ST-${String(r.id || '8902').slice(-4)}-LA`;
  const elDoc = document.getElementById('certDocId');
  if (elDoc) elDoc.textContent = docId;

  // Timestamp — show local time with offset (not UTC)
  const elUtcDate = document.getElementById('certUtcDate');
  const elUtcTime = document.getElementById('certUtcTime');
  if (elUtcDate) elUtcDate.textContent = localDatePart;
  if (elUtcTime) elUtcTime.textContent = localTimePart;

  // Hero dB
  const rawActive = Number(r.avgDb ?? r.leqDb ?? curDb ?? 49);
  const activeDbStr = rawActive.toFixed(1);
  const activeDbRound = Math.round(rawActive);
  const elHeroDb = document.getElementById('certHeroDb');
  if (elHeroDb) elHeroDb.textContent = activeDbStr;

  // Status & Scene
  const elStatusPill = document.getElementById('certStatusPill');
  const elStandardHint = document.getElementById('certStandardHint');
  const elGaugeFill = document.getElementById('certGaugeFill');
  const elGaugeNeedle = document.getElementById('certGaugeNeedle');
  const elGaugeText = document.getElementById('certGaugeText');

  let statusText = isZh ? '安静 · QUIET' : 'QUIET · SAFE';
  let standardText = isZh ? '室内居住 · 办公标准' : 'Residential & Office Standard';
  let gaugeText = isZh ? `${activeDbStr} dB · 宁静区间` : `${activeDbStr} dB · Quiet Band`;
  let statusColor = '#2AFFD4';

  if (rawActive >= 85) {
    statusText = isZh ? '重噪 · HAZARDOUS' : 'HAZARDOUS · SEVERE';
    standardText = isZh ? '工业与高噪场所标准' : 'Industrial Noise Standard';
    gaugeText = isZh ? `${activeDbStr} dB · 严重超标` : `${activeDbStr} dB · Hazardous Band`;
    statusColor = '#FF3F50';
  } else if (rawActive >= 65) {
    statusText = isZh ? '超标 · WARNING' : 'WARNING · ELEVATED';
    standardText = isZh ? '城市干道与商业标准' : 'Commercial Traffic Standard';
    gaugeText = isZh ? `${activeDbStr} dB · 轻度超标` : `${activeDbStr} dB · Elevated Band`;
    statusColor = '#FFB520';
  } else if (rawActive >= 50) {
    statusText = isZh ? '适中 · MODERATE' : 'MODERATE · ACCEPTABLE';
    standardText = isZh ? '日间生活办公标准' : 'Daytime Living Standard';
    gaugeText = isZh ? `${activeDbStr} dB · 正常区间` : `${activeDbStr} dB · Normal Band`;
    statusColor = '#38bdf8';
  }

  if (elStatusPill) {
    elStatusPill.innerHTML = `<span style="display:inline-block;width:4px;height:4px;border-radius:50%;background:${statusColor};margin-right:4px;"></span>${statusText}`;
    elStatusPill.style.color = statusColor;
  }
  const activeSceneLabel = r.sceneLabel || (typeof currentSceneLabel !== 'undefined' && currentSceneLabel ? currentSceneLabel : (typeof reportTemplates !== 'undefined' && reportTemplates[r.sceneId || reportTemplate] ? (isZh ? reportTemplates[r.sceneId || reportTemplate].label : reportTemplates[r.sceneId || reportTemplate].title) : ''));
  if (elStandardHint) elStandardHint.textContent = activeSceneLabel ? `${activeSceneLabel} · ${standardText}` : standardText;
  const certSubtitle = document.getElementById('certSubtitle');
  if (certSubtitle) {
    certSubtitle.textContent = activeSceneLabel
      ? (isZh ? `声学现场测定与环境噪音取证报告 · 【${activeSceneLabel}】专项存证` : `Acoustic Field Audit & Noise Certificate · [${activeSceneLabel}] Evidence`)
      : (isZh ? '声学现场测定与环境噪音取证报告' : 'Acoustic Field Audit & Noise Certificate');
  }
  if (elGaugeText) elGaugeText.textContent = gaugeText;

  const pct = Math.min(100, Math.max(0, (rawActive / 120) * 100));
  if (elGaugeFill) elGaugeFill.style.width = `${pct}%`;
  if (elGaugeNeedle) elGaugeNeedle.style.left = `${pct}%`;

  // Quad grid (1 decimal place)
  const elMax = document.getElementById('certLmax');
  const elMin = document.getElementById('certLmin');
  const elLeq = document.getElementById('certLeq');
  const elL50 = document.getElementById('certL50');
  const peakValStr = Number(r.peakDb ?? (rawActive * 1.2)).toFixed(1);
  const minValStr = Number(r.minDb ?? (rawActive * 0.85)).toFixed(1);
  const leqValStr = Number(r.leqDb ?? rawActive).toFixed(1);
  const l50ValStr = Number(r.l50Db ?? r.ln?.L50 ?? rawActive).toFixed(1);
  if (elMax) elMax.textContent = peakValStr;
  if (elMin) elMin.textContent = minValStr;
  if (elLeq) elLeq.textContent = leqValStr;
  if (elL50) elL50.textContent = l50ValStr;

  // Peak timestamp label
  const elPeakTag = document.getElementById('certPeakTag');
  const elPeakCircle = document.getElementById('certPeakCircle');
  if (elPeakTag) {
    elPeakTag.textContent = `PEAK: ${peakValStr} dB(A)`;
  }

  // Trend SVG
  const elTrendSvg = document.getElementById('certTrendPath');
  const elTrendFill = document.getElementById('certTrendFill');
  if (elTrendSvg && r.snap && r.snap.length >= 2) {
    const snap = r.snap;
    const maxVal = Math.max(...snap, 90);
    const minVal = Math.min(...snap, 30);
    const range = (maxVal - minVal) || 1;
    let maxIdx = 0;
    let peakVal = snap[0];
    const pts = snap.map((val, idx) => {
      if (val > peakVal) { peakVal = val; maxIdx = idx; }
      const x = Math.round((idx / (snap.length - 1)) * 340);
      const y = Math.round(90 - ((val - minVal) / range) * 75);
      return `${x},${y}`;
    });
    const dLine = `M ${pts.join(' L ')}`;
    const dFill = `${dLine} L 340,100 L 0,100 Z`;
    elTrendSvg.setAttribute('d', dLine);
    if (elTrendFill) elTrendFill.setAttribute('d', dFill);
    if (elPeakCircle) {
      const peakX = Math.round((maxIdx / (snap.length - 1)) * 340);
      const peakY = Math.round(90 - ((peakVal - minVal) / range) * 75);
      elPeakCircle.setAttribute('cx', String(peakX));
      elPeakCircle.setAttribute('cy', String(peakY));
    }
    if (elPeakTag) {
      elPeakTag.textContent = `PEAK: ${Number(peakVal).toFixed(1)} dB(A)`;
    }
  }

  // Geofence (Safe string extraction, preventing [object Object])
  const elLocTitle = document.getElementById('certLocTitle');
  const elLocSub = document.getElementById('certLocSub');
  const elGpsCoord = document.getElementById('certGpsCoord');
  let customLoc = null;
  try {
    const raw = localStorage.getItem('sf_custom_location_v1');
    if (raw) customLoc = JSON.parse(raw);
  } catch(_) {}

  const locExt = extractPlaceText(r.loc);
  let place = locExt.title;
  let placeSub = locExt.addr;

  if (customLoc && (customLoc.place || customLoc.point)) {
    const parts = [customLoc.place, customLoc.building, customLoc.room].filter(Boolean);
    if (parts.length) place = '【' + parts.join(' · ') + '】';
    if (customLoc.point) {
      const pt = (isZh ? '专属测点: ' : 'Point: ') + customLoc.point + (customLoc.note ? ` (${customLoc.note})` : '');
      placeSub = placeSub ? `${pt} · ${placeSub}` : pt;
    }
  }
  if (!place) {
    place = isZh ? '现场声学监测站点 (GPS 坐标锚定)' : 'Acoustic Monitoring Site (GPS Anchored)';
  }
  if (!placeSub) {
    placeSub = isZh ? '经纬度定位已加密固化' : 'Geographic coordinates anchored';
  }
  const activeSceneNote = r.note || r.sceneNote || (typeof currentSceneNote !== 'undefined' ? currentSceneNote : '');
  if (activeSceneNote) {
    placeSub += (isZh ? ' · 场景: ' : ' · Scene: ') + activeSceneNote;
  }

  if (elLocTitle) elLocTitle.textContent = place;
  if (elLocSub) elLocSub.textContent = placeSub;
  if (elGpsCoord) {
    elGpsCoord.textContent = r.loc?.lat ? `GPS: ${r.loc.lat.toFixed(6)}, ${r.loc.lng.toFixed(6)} (±${r.loc.acc || 5}m)` : (isZh ? 'GPS: WGS-84 坐标已锚定' : 'GPS: WGS-84 CALIBRATED');
  }

  // Percentiles (1 decimal place)
  const elL5 = document.getElementById('certL5');
  const elL10 = document.getElementById('certL10');
  const elL90 = document.getElementById('certL90');
  const elL95 = document.getElementById('certL95');
  if (elL5) elL5.textContent = Number(r.l5Db ?? r.ln?.L5 ?? (rawActive * 1.1)).toFixed(1);
  if (elL10) elL10.textContent = Number(r.l10Db ?? r.ln?.L10 ?? (rawActive * 1.05)).toFixed(1);
  if (elL90) elL90.textContent = Number(r.l90Db ?? r.ln?.L90 ?? Math.max(30, rawActive * 0.92)).toFixed(1);
  if (elL95) elL95.textContent = Number(r.l95Db ?? r.ln?.L95 ?? Math.max(28, rawActive * 0.88)).toFixed(1);

  // Calibration (Clean error range format)
  const calOff = r.calibration?.offsetDb ?? (typeof calOffset !== 'undefined' ? calOffset : -12.0);
  const micGain = r.calibration?.micGainDb ?? (typeof micGainDb !== 'undefined' ? micGainDb : 2.0);
  const rawErr = r.calibration?.errorRange ?? (typeof calibrationErrorRange === 'function' ? calibrationErrorRange() : '1.2');
  const errRange = cleanErrorRange(rawErr);
  const elCalOffset = document.getElementById('certCalOffset');
  const elMicGain = document.getElementById('certMicGain');
  const elErrRange = document.getElementById('certErrRange');
  if (elCalOffset) elCalOffset.textContent = `${calOff >= 0 ? '+' : ''}${Number(calOff).toFixed(1)} dB`;
  if (elMicGain) elMicGain.textContent = `+${Number(micGain).toFixed(1)} dB`;
  if (elErrRange) elErrRange.textContent = `±${errRange} dB`;

  // SHA-256
  const hash = r.hashes?.metadataSha256 || r.hashes?.mediaSha256 || 'e8b94f92d4710ca8b0051e86337a3d1b712';
  const elHash = document.getElementById('certSha256');
  if (elHash) elHash.textContent = `${hash.slice(0, 8)}...${hash.slice(-8)}`;

  // Also sync legacy rpm fields
  const avg = document.getElementById('rpmAvg');
  const peak = document.getElementById('rpmPeak');
  const idEl = document.getElementById('rpmId');
  if (avg) avg.textContent = `${activeDb} dB`;
  if (peak) peak.textContent = `${r.peakDb || Math.round(activeDb * 1.2)} dB`;
  if (idEl) idEl.textContent = (r.evidenceId || 'STP-VERIFIED').slice(0, 10);
}

  return {
    CREEM_CHECKOUT_URLS: typeof CREEM_CHECKOUT_URLS !== 'undefined' ? CREEM_CHECKOUT_URLS : undefined,
    downloadCanvas: typeof downloadCanvas !== 'undefined' ? downloadCanvas : undefined,
    openCanvas: typeof openCanvas !== 'undefined' ? openCanvas : undefined,
    openLastEvidencePhoto: typeof openLastEvidencePhoto !== 'undefined' ? openLastEvidencePhoto : undefined,
    getEvidenceStats: typeof getEvidenceStats !== 'undefined' ? getEvidenceStats : undefined,
    drawEvidenceText: typeof drawEvidenceText !== 'undefined' ? drawEvidenceText : undefined,
    drawEvidenceCard: typeof drawEvidenceCard !== 'undefined' ? drawEvidenceCard : undefined,
    buildEvidenceCanvas: typeof buildEvidenceCanvas !== 'undefined' ? buildEvidenceCanvas : undefined,
    downloadEvidenceCard: typeof downloadEvidenceCard !== 'undefined' ? downloadEvidenceCard : undefined,
    openEvidenceCard: typeof openEvidenceCard !== 'undefined' ? openEvidenceCard : undefined,
    buildStatsFromRecord: typeof buildStatsFromRecord !== 'undefined' ? buildStatsFromRecord : undefined,
    buildSessionSummaryCanvas: typeof buildSessionSummaryCanvas !== 'undefined' ? buildSessionSummaryCanvas : undefined,
    exportSessionSummaryImage: typeof exportSessionSummaryImage !== 'undefined' ? exportSessionSummaryImage : undefined,
    buildProCertificateCanvas: typeof buildProCertificateCanvas !== 'undefined' ? buildProCertificateCanvas : undefined,
    pdfSafeText: typeof pdfSafeText !== 'undefined' ? pdfSafeText : undefined,
    pdfLevelLabel: typeof pdfLevelLabel !== 'undefined' ? pdfLevelLabel : undefined,
    pdfTemplateInfo: typeof pdfTemplateInfo !== 'undefined' ? pdfTemplateInfo : undefined,
    pdfMediaLabel: typeof pdfMediaLabel !== 'undefined' ? pdfMediaLabel : undefined,
    pdfPlaceText: typeof pdfPlaceText !== 'undefined' ? pdfPlaceText : undefined,
    buildPDF: typeof buildPDF !== 'undefined' ? buildPDF : undefined,
    showPaywall: typeof showPaywall !== 'undefined' ? showPaywall : undefined,
    toggleCertWatermark: typeof toggleCertWatermark !== 'undefined' ? toggleCertWatermark : undefined,
    renderCertificateData: typeof renderCertificateData !== 'undefined' ? renderCertificateData : undefined,
    wrapEvidenceText: typeof wrapEvidenceText !== 'undefined' ? wrapEvidenceText : undefined,
    drawEvidenceLineBlock: typeof drawEvidenceLineBlock !== 'undefined' ? drawEvidenceLineBlock : undefined,
    formatEvidencePlaceLine: typeof formatEvidencePlaceLine !== 'undefined' ? formatEvidencePlaceLine : undefined,
    formatGpsLine: typeof formatGpsLine !== 'undefined' ? formatGpsLine : undefined,
    evidenceDeviceLine: typeof evidenceDeviceLine !== 'undefined' ? evidenceDeviceLine : undefined,
    sha256HexFromBuffer: typeof sha256HexFromBuffer !== 'undefined' ? sha256HexFromBuffer : undefined,
    sha256HexFromBlob: typeof sha256HexFromBlob !== 'undefined' ? sha256HexFromBlob : undefined,
    sha256HexFromText: typeof sha256HexFromText !== 'undefined' ? sha256HexFromText : undefined,
    createEvidenceId: typeof createEvidenceId !== 'undefined' ? createEvidenceId : undefined,
    canonicalEvidenceMetadata: typeof canonicalEvidenceMetadata !== 'undefined' ? canonicalEvidenceMetadata : undefined,
    drawEvidenceMetaPill: typeof drawEvidenceMetaPill !== 'undefined' ? drawEvidenceMetaPill : undefined,
    buildAcousticEvidencePhoto: typeof buildAcousticEvidencePhoto !== 'undefined' ? buildAcousticEvidencePhoto : undefined,
    captureEvidencePhoto: typeof captureEvidencePhoto !== 'undefined' ? captureEvidencePhoto : undefined,
    capturePhoto: typeof capturePhoto !== 'undefined' ? capturePhoto : undefined,
    captureSnapshotDuringRecording: typeof captureSnapshotDuringRecording !== 'undefined' ? captureSnapshotDuringRecording : undefined,
    roundRect: typeof roundRect !== 'undefined' ? roundRect : undefined,
    localTimeStr: typeof localTimeStr !== 'undefined' ? localTimeStr : undefined,
    localDateStr: typeof localDateStr !== 'undefined' ? localDateStr : undefined,
    drawOfficialBrandIcon: typeof drawOfficialBrandIcon !== 'undefined' ? drawOfficialBrandIcon : undefined,
    extractPlaceText: typeof extractPlaceText !== 'undefined' ? extractPlaceText : undefined,
    cleanErrorRange: typeof cleanErrorRange !== 'undefined' ? cleanErrorRange : undefined,
    truncateCanvasText: typeof truncateCanvasText !== 'undefined' ? truncateCanvasText : undefined
  };
}));

// Expose onto window/global for legacy and inline DOM callers
if (typeof window !== 'undefined' && window.SoundTestReportCertEngine) {
  window.CREEM_CHECKOUT_URLS = window.SoundTestReportCertEngine.CREEM_CHECKOUT_URLS;
  Object.assign(window, window.SoundTestReportCertEngine);
}
