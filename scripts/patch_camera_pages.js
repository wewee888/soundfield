const fs = require('fs');
const path = require('path');

const cameraFiles = [
  { file: 'camera.html', lang: 'en', refreshTitle: 'Refresh GPS Location', hudRowTitle: 'Tap to refresh high-accuracy GPS' },
  { file: 'zh/camera.html', lang: 'zh', refreshTitle: '重新获取精准现场定位', hudRowTitle: '点击刷新现场高精度 GPS 定位' },
  { file: 'en/camera.html', lang: 'en', refreshTitle: 'Refresh GPS Location', hudRowTitle: 'Tap to refresh high-accuracy GPS' },
  { file: 'es/camera.html', lang: 'es', refreshTitle: 'Actualizar ubicación GPS', hudRowTitle: 'Toca para actualizar GPS de alta precisión' },
  { file: 'fr/camera.html', lang: 'fr', refreshTitle: 'Actualiser la position GPS', hudRowTitle: 'Appuyez pour actualiser le GPS haute précision' },
  { file: 'de/camera.html', lang: 'de', refreshTitle: 'GPS-Standort aktualisieren', hudRowTitle: 'Tippen, um hochpräzises GPS zu aktualisieren' },
  { file: 'ja/camera.html', lang: 'ja', refreshTitle: 'GPS位置情報を更新', hudRowTitle: 'タップして高精度GPS位置情報を更新' },
  { file: 'ko/camera.html', lang: 'ko', refreshTitle: 'GPS 위치 새로고침', hudRowTitle: '탭하여 고정밀 GPS 위치 새로고침' },
  { file: 'vi/camera.html', lang: 'vi', refreshTitle: 'Làm mới vị trí GPS', hudRowTitle: 'Chạm để làm mới vị trí GPS độ chính xác cao' },
  { file: 'th/camera.html', lang: 'th', refreshTitle: 'รีเฟรชตำแหน่ง GPS', hudRowTitle: 'แตะเพื่อรีเฟรชตำแหน่ง GPS ความแม่นยำสูง' }
];

let updatedCount = 0;

for (const item of cameraFiles) {
  const filePath = path.join(__dirname, '..', item.file);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add #refreshGeoBtn before #switchCamBtn if not already present
  if (!content.includes('id="refreshGeoBtn"')) {
    const switchPattern = /<button type="button" id="switchCamBtn"/;
    if (switchPattern.test(content)) {
      const refreshBtnHtml = `<button type="button" id="refreshGeoBtn" class="cam-tool-btn" title="${item.refreshTitle}" aria-label="${item.refreshTitle}">\n          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>\n        </button>\n        `;
      content = content.replace(switchPattern, refreshBtnHtml + '<button type="button" id="switchCamBtn"');
    }
  }

  // 2. Update .hud-geo-row to include #hudRefreshGeoBtn and #hudGeoRow
  if (!content.includes('id="hudRefreshGeoBtn"')) {
    const geoRowPattern = /<div class="hud-geo-row"[^>]*>([\s\S]*?)<\/div>/;
    const match = content.match(geoRowPattern);
    if (match) {
      let inner = match[1];
      // If inner does not have class="hud-geo-text", add it to span id="hudGeo"
      inner = inner.replace(/<span id="hudGeo">/, '<span id="hudGeo" class="hud-geo-text">');
      // Add refresh button at the end of hud-geo-row
      const hudRefreshBtnHtml = `\n        <button type="button" id="hudRefreshGeoBtn" class="hud-geo-refresh-btn" title="${item.refreshTitle}" aria-label="${item.refreshTitle}">\n          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>\n        </button>`;
      const newGeoRow = `<div class="hud-geo-row" id="hudGeoRow" title="${item.hudRowTitle}">${inner}${hudRefreshBtnHtml}\n      </div>`;
      content = content.replace(geoRowPattern, newGeoRow);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${item.file}`);
  updatedCount++;
}

console.log(`Successfully updated ${updatedCount} camera templates.`);
