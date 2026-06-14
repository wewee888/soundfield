#!/usr/bin/env python3
"""Update migration script in all locale pages to detect v7 SW."""
import re
from pathlib import Path

ROOT = Path(r"E:\.site\dB_test\soundfield")
LOCALES = ["en", "zh", "de", "es", "fr", "ja", "ko", "vi", "th"]

# The new migration script — detects v7 (and v6), uses sessionStorage to avoid loop
NEW_SCRIPT = '''<script>
  (function() {
    try {
      if (sessionStorage.getItem('__sfV7Boot')) return;
      sessionStorage.setItem('__sfV7Boot', '1');
    } catch (e) { return; }
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then(function(regs) {
      var hasV7 = regs.some(function(r) {
        var u = (r.active && r.active.scriptURL) || '';
        return u.indexOf('v=7') !== -1 || u.indexOf('v=6') !== -1;
      });
      if (hasV7) return null;
      return Promise.all(regs.map(function(r) { return r.unregister(); }))
        .then(function() {
          return 'caches' in self ? caches.keys() : Promise.resolve([]);
        })
        .then(function(keys) {
          return Promise.all(keys.filter(function(k) { return k.indexOf('soundtest-pro-') === 0; }).map(function(k) { return caches.delete(k); }));
        })
        .then(function() {
          return navigator.serviceWorker.register('/sw.js?v=7');
        })
        .then(function() { location.reload(); });
    }).catch(function() {});
  })();
</script>
</html>'''

# Regex to match the old migration script (matches v6 boot too)
OLD_PATTERN = re.compile(
    r'<script>\s*\(function\(\)\s*\{.*?__sfV6Boot.*?</script>\s*</html>',
    re.DOTALL
)

ok = 0
for locale in LOCALES:
    f = ROOT / locale / "index.html"
    if not f.exists():
        print(f"MISS: {locale}/index.html")
        continue
    text = f.read_text(encoding="utf-8")
    if OLD_PATTERN.search(text):
        new_text = OLD_PATTERN.sub(NEW_SCRIPT, text)
        f.write_text(new_text, encoding="utf-8")
        ok += 1
        print(f"OK: {locale}/index.html")
    else:
        print(f"NO-MATCH: {locale}/index.html (may need manual check)")

print(f"\nUpdated {ok} of {len(LOCALES)} locale pages")
