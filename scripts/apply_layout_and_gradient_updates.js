const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// 1. Update HTML files: remove bookmark buttons and restore neon gradient H1 structure
const indexFiles = [
  { path: 'index.html', titleMain: 'Free Online Noise Evidence Recorder', hook: 'No App Required', sep: ' | ', subhead: 'Accurate Decibel Monitoring &amp; Tamper-Proof Evidence' },
  { path: 'en/index.html', titleMain: 'Free Online Noise Evidence Recorder', hook: 'No App Required', sep: ' | ', subhead: 'Accurate Decibel Monitoring &amp; Tamper-Proof Evidence' },
  { path: 'zh/index.html', titleMain: '免费在线噪音取证记录工具', hook: '无需安装 App', sep: ' ｜ ', subhead: '精准捕捉环境分贝，锁定客观防伪证据' },
  { path: 'de/index.html', titleMain: 'Kostenloser Lärmaufzeichner für Beweise', hook: 'Keine App nötig', sep: ' | ', subhead: 'dB messen. Beweise sichern. Privat bleiben.' },
  { path: 'es/index.html', titleMain: 'Grabador de Evidencia de Ruido Online Gratuito', hook: 'Sin Instalar App', sep: ' | ', subhead: 'Mide dB. Bloquea la evidencia. Mantén la privacidad.' },
  { path: 'fr/index.html', titleMain: 'Enregistreur de Bruit Preuve Gratuit', hook: 'Sans Application', sep: ' | ', subhead: 'Mesurez les dB. Verrouillez la preuve. Restez privé.' },
  { path: 'ja/index.html', titleMain: '無料オンライン騒音証拠記録ツール', hook: 'アプリ不要', sep: '｜', subhead: 'dBを測定。証拠を固定。プライバシーを守る。' },
  { path: 'ko/index.html', titleMain: '무료 온라인 소음 증거 녹음 도구', hook: '앱 설치 불필요', sep: ' | ', subhead: 'dB 측정. 증거 고정. 프라이버시 유지.' },
  { path: 'th/index.html', titleMain: 'เครื่องมือบันทึกหลักฐานเสียงรบกวนออนไลน์ฟรี', hook: 'ไม่ต้องติดตั้งแอป', sep: ' | ', subhead: 'วัด dB ล็อกหลักฐาน ข้อมูลอยู่ในเครื่อง' },
  { path: 'vi/index.html', titleMain: 'Công cụ ghi nhận tiếng ồn trực tuyến miễn phí', hook: 'Không cần cài app', sep: ' | ', subhead: 'Đo dB. Khóa bằng chứng. Giữ riêng tư.' }
];

indexFiles.forEach(item => {
  const filePath = path.join(rootDir, item.path);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Remove nav bookmark button
  html = html.replace(/<button[^>]*class="[^"]*nav-bookmark-btn[^"]*"[\s\S]*?<\/button>\s*/g, '');

  // Remove hero bookmark bar
  html = html.replace(/<div[^>]*class="[^"]*hero-bookmark-bar[^"]*"[\s\S]*?<\/div>\s*/g, '');

  // Update H1 with neon gradient hook em and clean title-main / subhead
  const newH1 = `<h1 class="hero-headline"><span class="hero-title-main">${item.titleMain}</span>${item.sep}<em>${item.hook}</em><br><span class="hero-subhead">${item.subhead}</span></h1>`;
  html = html.replace(/<h1 class="hero-headline">[\s\S]*?<\/h1>/, newH1);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated ' + item.path);
});

// Remove bookmark button from samples pages
['samples.html', 'zh/samples.html', 'en/samples.html'].forEach(rel => {
  const filePath = path.join(rootDir, rel);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/<button[^>]*class="[^"]*nav-bookmark-btn[^"]*"[\s\S]*?<\/button>\s*/g, '');
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated ' + rel);
});

// Remove bookmark button from soundtest.html
const soundtestPath = path.join(rootDir, 'soundtest.html');
if (fs.existsSync(soundtestPath)) {
  let html = fs.readFileSync(soundtestPath, 'utf8');
  html = html.replace(/<button class="app-bookmark-btn"[\s\S]*?<\/button>\s*/g, '');
  fs.writeFileSync(soundtestPath, html, 'utf8');
  console.log('Updated soundtest.html');
}

console.log('HTML files updated successfully.');
