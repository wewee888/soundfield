const fs = require('fs');
const path = require('path');

const version = '20261011';

function walkDir(dir, cb) {
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item === 'brain') continue;
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walkDir(p, cb);
    } else if (item.endsWith('.html')) {
      cb(p);
    }
  }
}

let modifiedCount = 0;

walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Bump camera.css
  if (content.includes('camera.css?v=')) {
    content = content.replace(/camera\.css\?v=[^"'\s>]+/g, `camera.css?v=${version}`);
    changed = true;
  }
  // Bump camera.js
  if (content.includes('camera.js?v=')) {
    content = content.replace(/camera\.js\?v=[^"'\s>]+/g, `camera.js?v=${version}`);
    changed = true;
  }
  // Bump site-experience.js
  if (content.includes('site-experience.js?v=')) {
    content = content.replace(/site-experience\.js\?v=[^"'\s>]+/g, `site-experience.js?v=${version}`);
    changed = true;
  }
  // Bump soundtest.css
  if (content.includes('soundtest.css?v=')) {
    content = content.replace(/soundtest\.css\?v=[^"'\s>]+/g, `soundtest.css?v=${version}`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`Updated cachebuster v=${version} across ${modifiedCount} HTML files.`);
