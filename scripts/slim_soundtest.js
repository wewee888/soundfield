const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const htmlPath = path.join(rootDir, 'soundtest.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('Original soundtest.html size:', html.length, 'bytes');

// 1. Replace the giant <style> block
const styleStartTag = '<style>';
const styleEndTag = '</style>';

const sIdx = html.indexOf(styleStartTag);
const eIdx = html.indexOf(styleEndTag);

if (sIdx === -1 || eIdx === -1) {
  console.error('Style tag not found');
  process.exit(1);
}

const replacementStyle = `<link rel="stylesheet" href="assets/soundtest.css?v=20261004b">
<style>
/* Defensive ad suppression & critical layout overrides */
.live-monitor-notice{display:none!important}
.app-brand{display:flex;align-items:center;gap:10px;min-width:max-content;flex-shrink:0;text-decoration:none;color:inherit}
.action-bar-dual{display:grid;grid-template-columns:1fr 1fr;align-items:stretch;gap:8px;}
.cap-card.collapsed{
  display:none!important;
  padding:0!important;
  margin:0!important;
}
.geo-dock { display: none !important; }
#locCard { display: none !important; }
[id*="baidu_transcode"], [id*="bd_ad"], [class*="bd-ad"], [id*="cpro_"],
[id*="p_ad_"], [class*="p-ad-"], [class*="cpro-"], [id*="pos_"] {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>`;

html = html.substring(0, sIdx) + replacementStyle + html.substring(eIdx + styleEndTag.length);

// 2. Slim down buildPolicyPack and buildBetaTestChecklist
const policyPackStart = html.indexOf('function buildPolicyPack(){');
const auditItemStart = html.indexOf('function auditItem(ok,title,desc,warn=false){');

if (policyPackStart !== -1 && auditItemStart !== -1) {
  const newPolicyPackAndChecklist = `function buildPolicyPack(){
  return \`# SOUNDTEST.PRO Release Policy Pack

Full documentation: https://soundtest.pro/compliance.html

## Product Positioning
SOUNDTEST.PRO is a professional environmental noise recording and acoustic evidence aid for real-time SPL trend review, evidence photos, video records, location notes, and PDF/CSV exports.

## Legal Boundary
环境记录与证据辅助，正式检测请以经检定声级计复核为准。
For environmental documentation and evidence support only. Formal measurements should be verified with a certified sound level meter.
\`;
}

async function downloadPolicyPack(){
  try{
    const res = await fetch('POLICY_DRAFTS.md');
    if(res.ok){
      const text = await res.text();
      const blob = new Blob([text],{type:'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`soundtest.pro-policy-pack-\${new Date().toISOString().slice(0,10)}.md\`;
      a.click();
      URL.revokeObjectURL(url);
      toast('合规资料草案已导出。','info');
      return;
    }
  }catch(_){}
  const blob=new Blob([buildPolicyPack()],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=\`soundtest.pro-policy-pack-\${new Date().toISOString().slice(0,10)}.md\`;
  a.click();
  URL.revokeObjectURL(url);
  toast('合规资料草案已导出。','info');
}

function buildBetaTestChecklist(){
  return \`# SOUNDTEST.PRO Stage 1 Smoke Test Matrix

Full documentation: https://soundtest.pro/standards.html

## Core Test Script
1. Open HTTPS URL in a clean browser session.
2. Confirm microphone, camera, and location permissions.
3. Start monitoring and verify SPL measurements.
4. Capture photo and video evidence.
5. Export CSV and PDF reports.
\`;
}

async function downloadBetaTestChecklist(){
  try{
    const res = await fetch('BETA_TEST_PLAN.md');
    if(res.ok){
      const text = await res.text();
      const blob = new Blob([text],{type:'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`soundtest.pro-beta-test-checklist-\${new Date().toISOString().slice(0,10)}.md\`;
      a.click();
      URL.revokeObjectURL(url);
      toast('测试清单已导出。','info');
      return;
    }
  }catch(_){}
  const blob=new Blob([buildBetaTestChecklist()],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=\`soundtest.pro-beta-test-checklist-\${new Date().toISOString().slice(0,10)}.md\`;
  a.click();
  URL.revokeObjectURL(url);
  toast('测试清单已导出。','info');
}

`;

  html = html.substring(0, policyPackStart) + newPolicyPackAndChecklist + html.substring(auditItemStart);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('New soundtest.html size:', html.length, 'bytes');
console.log('Saved bytes:', (646394 - html.length), 'bytes reduction!');
