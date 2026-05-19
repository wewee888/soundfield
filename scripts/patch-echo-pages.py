#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NAV = (
    '    <nav class="site-nav site-nav--floating" aria-label="Primary">\n'
    '      <div class="site-nav-main">\n'
    '        <a class="brand brand-glow" href="index.html" aria-label="SOUNDTEST.PRO home">\n'
    '          <span class="brand-mark" aria-hidden="true"></span>\n'
    '          <span class="brand-owl" aria-hidden="true"></span>\n'
    '          <span class="brand-text">SOUNDTEST<small>.PRO</small></span>\n'
    '        </a>\n'
    '        <motion class="nav-anchor-group" role="menubar">\n'
)

# Fix: write NAV without typos
NAV = (
    '    <nav class="site-nav site-nav--floating" aria-label="Primary">\n'
    '      <div class="site-nav-main">\n'
    '        <a class="brand brand-glow" href="index.html" aria-label="SOUNDTEST.PRO home">\n'
    '          <span class="brand-mark" aria-hidden="true"></span>\n'
    '          <span class="brand-owl" aria-hidden="true"></span>\n'
    '          <span class="brand-text">SOUNDTEST<small>.PRO</small></span>\n'
    '        </a>\n'
    '        <div class="nav-anchor-group" role="menubar">\n'
    '          <a href="index.html#features">Features</a>\n'
    '          <a href="index.html#pricing">Pro Pricing</a>\n'
    '          <a href="accuracy.html">Help</a>\n'
    '          <a href="auth.html">Account</a>\n'
    '        </div>\n'
    '      </motion>\n'
    '      <div class="nav-utility">\n'
    '        <a class="nav-upgrade" href="index.html#pricing">\n'
    '          <span class="star" aria-hidden="true">★</span>\n'
    '          <span>Upgrade Pro</span>\n'
    '        </a>\n'
    '      </div>\n'
    '    </nav>'
)
NAV = NAV.replace('      </motion>\n', '      </div>\n')

FOOTER_SRC = (ROOT / "index.html").read_text(encoding="utf-8")
fi = FOOTER_SRC.index('<footer class="footer-deluxe"')
fj = FOOTER_SRC.index("</footer>", fi) + len("</footer>")
FOOTER_HTML = FOOTER_SRC[fi:fj]

HERO_APP = """    <section class="hero page-hero">
      <div class="hero-split">
        <motion class="hero-split-text reveal">
          <span class="privacy-badge">Data processed locally · No upload</span>
          <span class="eyebrow">Live PWA · Local-first</span>
          <h1 class="hero-headline">Open the SOUNDTEST.PRO <em>evidence recorder</em>.</h1>
          <p class="hero-lead">Microphone analysis stays local in your browser. The full recorder supports dBA/dBC/dBZ, LAeq, L5/L10/L50/L90/L95, GPS notes, photos, audio/video, CSV, PDF, and evidence manifests.</p>
          <div class="hero-actions">
            <a class="button primary" href="soundtest.html">Launch SOUNDTEST.PRO now</a>
            <a class="button" href="privacy.html">Review privacy first</a>
            <a class="button ghost" href="samples.html">View sample reports</a>
          </div>
        </div>
        <aside class="echo-stage echo-stage--wake reveal" aria-label="Echo mascot waking the recorder">
          <div class="echo-stage-tags">
            <span class="echo-stage-tag"><span class="dot" aria-hidden="true"></span>Wake · mic permission next</span>
            <span class="echo-stage-tag"><span class="dot violet" aria-hidden="true"></span>LAeq · GPS · photos</span>
            <span class="echo-stage-tag"><span class="dot rose" aria-hidden="true"></span>Redirects in 5s</span>
          </div>
          <div class="echo-mascot echo-mascot--wake" role="img" aria-label="Echo owl waking up with glowing equalizer chest"></div>
          <div class="echo-hud" aria-hidden="true">
            <span class="echo-hud-dot"></span>
            <span class="echo-hud-value">READY</span>
            <span class="echo-hud-label">Wake</span>
          </div>
        </aside>
      </div>
    </section>"""

# sanitize any accidental motion tags
def fix_tags(s: str) -> str:
    return s.replace("<motion ", "<div ").replace("</motion>", "</div>")

HERO_APP = fix_tags(HERO_APP)

HERO_SAMPLES = fix_tags("""    <section class="hero page-hero">
      <div class="hero-split">
        <div class="hero-split-text reveal">
          <span class="privacy-badge">Data processed locally · No upload</span>
          <span class="eyebrow">Evidence outputs</span>
          <h1 class="hero-headline">See the exports <em>before</em> you trust the tool.</h1>
          <p class="hero-lead">SOUNDTEST.PRO turns a noisy hour into structured documentation: scene photos, watermarked video, PDF reports, CSV data, and JSON manifests — each with explicit limits noted on the page.</p>
          <div class="hero-actions">
            <a class="button primary" href="soundtest.html">Generate your first record</a>
            <a class="button" href="accuracy.html">Read accuracy limits</a>
          </div>
        </div>
        <aside class="echo-stage echo-stage--recording reveal" aria-label="Echo mascot capturing audio evidence">
          <motion class="echo-stage-tags">
            <span class="echo-stage-tag"><span class="dot" aria-hidden="true"></span>Recording · waveform live</span>
            <span class="echo-stage-tag"><span class="dot violet" aria-hidden="true"></span>Photo + video stamps</span>
            <span class="echo-stage-tag"><span class="dot rose" aria-hidden="true"></span>Hashes on export</span>
          </div>
          <div class="echo-mascot echo-mascot--recording" role="img" aria-label="Echo owl actively recording with pulsing equalizer"></motion>
          <div class="echo-hud" aria-hidden="true">
            <span class="echo-hud-dot" style="background:var(--accent-3)"></span>
            <span class="echo-hud-value" style="color:var(--accent-3)">REC</span>
            <span class="echo-hud-label">Capture</span>
          </div>
        </aside>
      </div>
    </section>""")

HERO_CHANGELOG = fix_tags("""    <section class="hero page-hero">
      <div class="hero-split">
        <div class="hero-split-text reveal">
          <span class="privacy-badge">Data processed locally · No upload</span>
          <span class="eyebrow">Update Record · Built in public</span>
          <h1 class="hero-headline">SOUNDTEST.PRO <em>product updates</em>.</h1>
          <p class="hero-lead">A concise record of public website, language, privacy, SEO, and evidence workflow changes — so users and partners can see what changed before trusting the tool in a real complaint workflow.</p>
          <div class="hero-actions">
            <a class="button primary" href="soundtest.html">Open the recorder</a>
            <a class="button" href="samples.html">View report samples</a>
          </div>
        </div>
        <aside class="echo-stage echo-stage--export reveal" aria-label="Echo mascot exporting a PDF report">
          <div class="echo-stage-tags">
            <span class="echo-stage-tag"><span class="dot" aria-hidden="true"></span>PDF · CSV · JSON</span>
            <span class="echo-stage-tag"><span class="dot violet" aria-hidden="true"></span>Changelog shipped</span>
            <span class="echo-stage-tag"><span class="dot rose" aria-hidden="true"></span>SEO · hreflang</span>
          </div>
          <div class="echo-mascot echo-mascot--export" role="img" aria-label="Echo owl holding an exported evidence PDF"></div>
          <div class="echo-hud" aria-hidden="true">
            <span class="echo-hud-dot" style="background:var(--accent-2)"></span>
            <span class="echo-hud-value" style="color:var(--accent-2)">PDF</span>
            <span class="echo-hud-label">Export</span>
          </div>
        </aside>
      </div>
    </section>""")

PAGES = {
    "app.html": HERO_APP,
    "samples.html": HERO_SAMPLES,
    "changelog.html": HERO_CHANGELOG,
}

for name, hero in PAGES.items():
    path = ROOT / name
    text = path.read_text(encoding="utf-8")
    text = re.sub(r'    <nav class="site-nav"[\s\S]*?</nav>\s*', NAV + "\n\n", text, count=1)
    text = re.sub(r'\s*<section class="hero">[\s\S]*?</section>\s*', "\n" + hero + "\n\n", text, count=1)
    if "footer-deluxe" not in text:
        text = text.replace("  </main>", f"\n{FOOTER_HTML}\n  </main>")
    path.write_text(text, encoding="utf-8")
    print("patched", name)
