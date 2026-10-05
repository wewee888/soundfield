const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'brain' || file === '_temp') continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const rootDir = path.resolve(__dirname, '..');
const files = walk(rootDir);
let cssBumpCount = 0;
let svgFixCount = 0;

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Bump site.css version from 20261005i to 20261005k
  if (content.includes('site.css?v=20261005i')) {
    content = content.split('site.css?v=20261005i').join('site.css?v=20261005k');
    changed = true;
    cssBumpCount++;
  }

  // Ensure uc-faq-chevron has width="20" height="20"
  const oldSvg = 'class="uc-faq-chevron" viewBox="0 0 24 24"';
  const newSvg = 'class="uc-faq-chevron" width="20" height="20" viewBox="0 0 24 24"';
  if (content.includes(oldSvg)) {
    content = content.split(oldSvg).join(newSvg);
    changed = true;
    svgFixCount++;
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
  }
}

console.log(`Updated site.css?v=20261005k in ${cssBumpCount} files.`);
console.log(`Added explicit width/height to uc-faq-chevron in ${svgFixCount} files.`);
