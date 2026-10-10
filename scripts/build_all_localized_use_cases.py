#!/usr/bin/env python3
"""
scripts/build_all_localized_use_cases.py

Generates all 42 use-case pages across 7 languages:
es, de, fr, ja, ko, th, vi
Each page includes:
- Standardized SEO meta and JSON-LD FAQPage schema
- Complete 7-item navigation with localized labels and active links
- Hero with 4 stat chips and device frame image
- Scenario benchmark reference table with color-coded badges
- 4-step defensible evidence workflow
- 6-card feature spotlight grid
- 4 evidentiary rules strip
- Accordion FAQ with explicit SVG chevron dimensions (width=20 height=20)
- Conversion CTA band
- Cross-scenario navigation switcher (6 pills)
- Standardized footer with language matrix and support email
- Inline FAQ toggle script and service worker registration
"""

import os
import json
from use_case_base import LOCALES, ALL_LOCALES, SCENARIO_KEYS, NAV_DATA, COMMON_LABELS, PILL_DATA, build_sidebar_html
from use_case_scenarios_data import SCENARIOS_DATA

# Load all scenario modules
import use_case_data_2_6
import use_case_data_part2
import use_case_data_part3
import use_case_data_part4
import use_case_data_part5

# Merge all scenarios
ALL_SCENARIOS = {
    **SCENARIOS_DATA,
    **use_case_data_2_6.SCENARIOS_2_TO_6,
    **use_case_data_part2.SCENARIOS_3_TO_6,
    **use_case_data_part3.SCENARIOS_PART_3,
    **use_case_data_part4.SCENARIOS_PART_4,
    **use_case_data_part5.SCENARIOS_PART_5,
}

def build_hreflang_tags(locale, scenario_slug):
    tags = []
    tags.append(f'  <link rel="canonical" href="https://soundtest.pro/use-cases/{locale}/{scenario_slug}/">')
    tags.append(f'  <link rel="alternate" hreflang="x-default" href="https://soundtest.pro/use-cases/{scenario_slug}/"/>')
    tags.append(f'  <link rel="alternate" hreflang="en" href="https://soundtest.pro/use-cases/{scenario_slug}/"/>')
    for loc in ['zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']:
        tags.append(f'  <link rel="alternate" hreflang="{loc}" href="https://soundtest.pro/use-cases/{loc}/{scenario_slug}/"/>')
    return '\n'.join(tags)

def build_nav_html(locale, scenario_slug):
    nav = NAV_DATA.get(locale, NAV_DATA['en'])
    common = COMMON_LABELS.get(locale, COMMON_LABELS['es'])
    
    return f'''    <nav class="site-nav" aria-label="Primary">
      <div class="site-nav-main">
        <a class="brand brand-glow" href="/{locale}/"><span class="brand-mark" aria-hidden="true"></span><span class="brand-text">SOUNDTEST<small>.PRO</small></span></a>
        <div class="nav-links">
          <a href="/{locale}/">{nav['home']}</a>
          <a href="/soundtest.html?lang={locale}">{nav['open_app']}</a>
          <a href="/{locale}/samples.html">{nav['samples']}</a>
          <a href="/{locale}/accuracy.html">{nav['accuracy']}</a>
          <a href="/{locale}/standards.html">{nav['standards']}</a>
          <a href="/{locale}/noise-levels.html">{nav['noise_levels']}</a>
          <a href="/{locale}/auth.html">{nav['account']}</a>
        </div>
      </div>
      <div class="nav-utility">
        <a class="nav-upgrade" href="/{locale}/#pricing">
          <span class="star" aria-hidden="true">★</span>
          <span>{nav['upgrade']}</span>
        </a>
      </div>
    </nav>'''

def build_hero_html(locale, scenario_slug, sc_data):
    hero = sc_data['hero'][locale]
    stats = sc_data['stats'][locale]
    common = COMMON_LABELS[locale]
    img = sc_data['img']
    img_alt = sc_data['img_alt'][locale]
    
    stats_html = '\n'.join([
        f'''            <div class="uc-stat">
              <span class="uc-stat-value">{val}</span>
              <span class="uc-stat-label">{lbl}</span>
            </div>''' for val, lbl in stats
    ])
    
    return f'''    <!-- Hero Section with Device Frame & Stat Strip -->
    <section class="hero">
      <div class="hero-split">
        <div class="hero-split-text reveal">
          <span class="eyebrow">{hero['eyebrow']}</span>
          <h1 class="hero-headline">{hero['headline']}</h1>
          <p class="hero-lead">{hero['lead']}</p>
          <div class="hero-actions" style="justify-content: flex-start;">
            <a class="button primary" href="/soundtest.html?lang={locale}">{common['cta_measure']}</a>
            <a class="button" href="/{locale}/samples.html">{common['cta_samples']}</a>
          </div>
          <div class="uc-stats">
{stats_html}
          </div>
        </div>
        <div class="hero-split-visual reveal" style="display: flex; justify-content: center; align-items: center;">
          <div class="hero-device-frame">
            <img src="/assets/images/{img}?v=20261006a" alt="{img_alt}" loading="lazy">
          </div>
        </div>
      </div>
    </section>'''

def build_table_html(locale, scenario_slug, sc_data):
    tbl = sc_data['table']
    common = COMMON_LABELS[locale]
    th = tbl['headers'][locale]
    rows = tbl['rows'][locale]
    
    rows_html = []
    for val, src, std, badge_cls, badge_txt in rows:
        val_cls = 'db-safe' if 'safe' in badge_cls else ('db-mild' if 'mild' in badge_cls else ('db-moderate' if 'moderate' in badge_cls else 'db-severe'))
        rows_html.append(f'''            <tr>
              <td><span class="db-val {val_cls}">{val}</span></td>
              <td>{src}</td>
              <td>{std}</td>
              <td><span class="uc-db-badge {badge_cls}">{badge_txt}</span></td>
            </tr>''')
    
    rows_str = '\n'.join(rows_html)
    
    return f'''    <!-- Scenario Decibel Benchmark Table -->
    <section class="section reveal" id="benchmarks">
      <div class="section-header">
        <span class="eyebrow">{common['sec_table']}</span>
        <h2>{tbl['title'][locale]}</h2>
        <p class="lead">{tbl['lead'][locale]}</p>
      </div>
      <div class="uc-db-section">
        <table class="uc-db-table">
          <thead>
            <tr>
              <th style="width: 18%;">{th[0]}</th>
              <th style="width: 26%;">{th[1]}</th>
              <th style="width: 36%;">{th[2]}</th>
              <th style="width: 20%;">{th[3]}</th>
            </tr>
          </thead>
          <tbody>
{rows_str}
          </tbody>
        </table>
      </div>
    </section>'''

def build_steps_html(locale, scenario_slug, sc_data):
    st = sc_data['steps']
    common = COMMON_LABELS[locale]
    items = st['items'][locale]
    
    items_html = []
    for num, icon, title, desc in items:
        items_html.append(f'''        <div class="uc-step">
          <div class="uc-step-num">{num}</div>
          <div class="uc-step-icon">{icon}</div>
          <h3 class="uc-step-title">{title}</h3>
          <p class="uc-step-desc">{desc}</p>
        </div>''')
    items_str = '\n'.join(items_html)
    
    return f'''    <!-- 4-Step Defensible Evidence Workflow -->
    <section class="section reveal" id="workflow">
      <div class="section-header">
        <span class="eyebrow">{common['sec_method']}</span>
        <h2>{st['title'][locale]}</h2>
        <p class="lead">{st['lead'][locale]}</p>
      </div>
      <div class="uc-steps">
{items_str}
      </div>
    </section>'''

def build_features_html(locale, scenario_slug, sc_data):
    ft = sc_data['features']
    common = COMMON_LABELS[locale]
    items = ft['items'][locale]
    
    items_html = []
    for icon, title, desc in items:
        items_html.append(f'''        <div class="uc-feature-card">
          <div class="uc-feature-icon">{icon}</div>
          <h3 class="uc-feature-title">{title}</h3>
          <p class="uc-feature-desc">{desc}</p>
        </div>''')
    items_str = '\n'.join(items_html)
    
    return f'''    <!-- 6 Feature Spotlight Cards -->
    <section class="section reveal" id="capabilities">
      <div class="section-header">
        <span class="eyebrow">{common['sec_features']}</span>
        <h2>{ft['title'][locale]}</h2>
        <p class="lead">{ft['lead'][locale]}</p>
      </div>
      <div class="uc-feature-grid">
{items_str}
      </div>
    </section>'''

def build_rules_html(locale, scenario_slug, sc_data):
    rl = sc_data['rules']
    common = COMMON_LABELS[locale]
    items = rl['items'][locale]
    
    items_html = []
    for icon, title, desc in items:
        items_html.append(f'''        <div class="uc-evidence-item">
          <div class="uc-evidence-icon">{icon}</div>
          <div class="uc-evidence-text">
            <strong>{title}</strong>
            <span>{desc}</span>
          </div>
        </div>''')
    items_str = '\n'.join(items_html)
    
    return f'''    <!-- Evidentiary Rules Strip -->
    <section class="section reveal" id="rules">
      <div class="section-header">
        <span class="eyebrow">{common['sec_rules']}</span>
        <h2>{rl['title'][locale]}</h2>
        <p class="lead">{rl['lead'][locale]}</p>
      </div>
      <div class="uc-evidence-strip">
{items_str}
      </div>
    </section>'''

def build_faq_html(locale, scenario_slug, sc_data):
    faqs = sc_data['faqs'][locale]
    common = COMMON_LABELS[locale]
    
    faq_items = []
    for q, a in faqs:
        faq_items.append(f'''        <div class="uc-faq-item">
          <button type="button" class="uc-faq-q" onclick="toggleUcFaq(this)" aria-expanded="false">
            <span>{q}</span>
            <svg class="uc-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="uc-faq-a">{a}</div>
        </div>''')
    
    items_str = '\n'.join(faq_items)
    
    faq_title = {
        'es': 'Preguntas frecuentes sobre este caso de ruido',
        'de': 'Häufig gestellte Fragen zu diesem Lärmszenario',
        'fr': 'Questions fréquentes sur ce cas de nuisance',
        'ja': 'この騒音トラブルに関するよくある質問（FAQ）',
        'ko': '이 소음 분쟁에 관해 자주 묻는 질문 (FAQ)',
        'th': 'คำถามที่พบบ่อยเกี่ยวกับกรณีเสียงรบกวนนี้',
        'vi': 'Câu hỏi thường gặp về trường hợp tiếng ồn này'
    }[locale]
    
    return f'''    <!-- FAQ Accordion Section -->
    <section class="section" id="faq-section">
      <div class="section-heading reveal">
        <span class="eyebrow">FAQ</span>
        <h2>{faq_title}</h2>
      </div>
      <div class="uc-faq-list reveal">
{items_str}
      </div>
      <p class="muted" style="margin-top:1.5rem; font-size:13px; text-align:center;">{common['disclaimer']}</p>
    </section>'''

def build_cta_band_html(locale, scenario_slug, sc_data):
    cta = sc_data['cta_band'][locale]
    common = COMMON_LABELS[locale]
    
    return f'''    <!-- Bottom Conversion CTA Band -->
    <section class="section reveal">
      <div class="uc-cta-band">
        <h2>{cta[0]}</h2>
        <p>{cta[1]}</p>
        <div class="uc-cta-actions">
          <a class="button primary" href="/soundtest.html?lang={locale}">{common['cta_free_band']}</a>
          <a class="button" href="https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c" target="_blank" rel="noopener">{common['cta_pro_band']}</a>
        </div>
        <div class="uc-cta-note">{common['cta_single_note']}</div>
      </div>
    </section>'''

def build_pill_switcher_html(locale, scenario_slug):
    common = COMMON_LABELS[locale]
    pills = []
    
    for key in SCENARIO_KEYS:
        icon, (title, sub) = PILL_DATA[key]['icon'], PILL_DATA[key][locale]
        is_cur = (key == scenario_slug)
        cur_cls = ' current' if is_cur else ''
        pills.append(f'''        <a class="uc-scene-pill{cur_cls}" href="/use-cases/{locale}/{key}.html">
          <span class="uc-scene-emoji">{icon}</span>
          <div class="uc-scene-label">
            <strong>{title}</strong>
            <small>{sub}</small>
          </div>
        </a>''')
    pills_str = '\n'.join(pills)
    
    return f'''    <!-- Cross-Scenario Switcher -->
    <section class="section reveal" style="padding-top: 0;">
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <span class="eyebrow">{common['explore_other']}</span>
        <h3 style="font-size: 1.25rem;">{common['explore_sub']}</h3>
      </div>
      <div class="uc-scene-nav">
{pills_str}
      </div>
    </section>'''

def build_footer_html(locale):
    common = COMMON_LABELS[locale]
    
    return f'''    <footer class="footer-deluxe" role="contentinfo">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <a class="brand brand-glow" href="/{locale}/" aria-label="SOUNDTEST.PRO home">
            <span class="brand-mark" aria-hidden="true"></span>
            <span class="brand-text">SOUNDTEST<small>.PRO</small></span>
          </a>
          <p>{common['footer_desc']}</p>
          <div class="footer-flags" aria-label="Language matrix">
            <a class="footer-flag" href="/use-cases/" title="English">🇺🇸</a>
            <a class="footer-flag" href="/use-cases/zh/" title="中文">🇨🇳</a>
            <a class="footer-flag" href="/use-cases/es/" title="Español">🇪🇸</a>
            <a class="footer-flag" href="/use-cases/fr/" title="Français">🇫🇷</a>
            <a class="footer-flag" href="/use-cases/de/" title="Deutsch">🇩🇪</a>
            <a class="footer-flag" href="/use-cases/ja/" title="日本語">🇯🇵</a>
            <a class="footer-flag" href="/use-cases/ko/" title="한국어">🇰🇷</a>
            <a class="footer-flag" href="/use-cases/vi/" title="Tiếng Việt">🇻🇳</a>
            <a class="footer-flag" href="/use-cases/th/" title="ไทย">🇹🇭</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>{common['prod_title']}</h4>
          <ul>
            <li><a href="/soundtest.html?lang={locale}">SOUNDTEST.PRO</a></li>
            <li><a href="/soundtest.html?lang={locale}">Decibel Meter</a></li>
            <li><a href="/{locale}/samples.html">Report Samples</a></li>
            <li><a href="/{locale}/accuracy.html">Accuracy &amp; Mic</a></li>
            <li><a href="/{locale}/download.html">PWA Install</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{common['res_title']}</h4>
          <ul>
            <li><a href="/{locale}/standards.html">Standards &amp; Limits</a></li>
            <li><a href="/{locale}/noise-levels.html">Noise Level Chart</a></li>
            <li><a href="/{locale}/changelog.html">Changelog</a></li>
            <li><a href="/use-cases/{locale}/neighbor-noise-evidence.html">Neighbor Noise Guide</a></li>
            <li><a href="/use-cases/{locale}/construction-noise-monitoring.html">Construction Guide</a></li>
            <li><a href="/use-cases/{locale}/rental-dispute-evidence.html">Rental Guide</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{common['legal_title']}</h4>
          <ul>
            <li><a href="/{locale}/privacy.html">Privacy Policy</a></li>
            <li><a href="/{locale}/about.html">About &amp; Contact</a></li>
            <li><a href="/{locale}/terms.html">Terms of Service</a></li>
            <li><a href="/{locale}/disclaimer.html">Disclaimer</a></li>
            <li><a href="/{locale}/compliance.html">Compliance</a></li>
            <li><a href="/{locale}/auth.html">Account &amp; Access</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{common['lang_title']}</h4>
          <ul>
            <li><a href="/use-cases/">English</a></li>
            <li><a href="/use-cases/zh/">中文</a></li>
            <li><a href="/use-cases/es/">Español</a></li>
            <li><a href="/use-cases/fr/">Français</a></li>
            <li><a href="/use-cases/de/">Deutsch</a></li>
            <li><a href="/use-cases/ja/">日本語</a></li>
            <li><a href="/use-cases/ko/">한국어</a></li>
            <li><a href="/use-cases/vi/">Tiếng Việt</a></li>
            <li><a href="/use-cases/th/">ไทย</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-meta">
        <span>© SOUNDTEST.PRO · Professional Acoustic Measurement &amp; Digital Evidence Platform · Engineered to IEC 61672 Standards.</span>
        <div style="font-size:12px;color:var(--soft);margin-top:6px;">{common['support_note']}</div>
        <div class="footer-social" aria-label="Social channels">
          <a href="mailto:support@soundtest.pro" aria-label="Customer Support (support@soundtest.pro)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>
          <a href="../../{locale}/changelog.html" aria-label="Blog"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h14v14H4z"/><path d="M8 9h6M8 13h6M8 17h4"/></svg></a>
          <a href="../../{locale}/standards.html" aria-label="Standards"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg></a>
        </div>
      </div>
    </footer>'''

def generate_use_case_page(locale, scenario_slug):
    sc_data = ALL_SCENARIOS[scenario_slug]
    faqs = sc_data['faqs'][locale]
    
    # JSON-LD Schema
    main_entities = []
    for q, a in faqs:
        main_entities.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": a
            }
        })
    json_ld = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": main_entities}, ensure_ascii=False)
    
    title_text = {
        'neighbor-noise-evidence': {
            'es': 'Pruebas de Ruido Vecinal y de Apartamentos · SOUNDTEST.PRO',
            'de': 'Nachbarschaftslärm Beweisführung · SOUNDTEST.PRO',
            'fr': 'Preuve de Bruits de Voisinage et d’Appartement · SOUNDTEST.PRO',
            'ja': '近隣・上階の騒音トラブル証拠収集 · SOUNDTEST.PRO',
            'ko': '층간소음 및 이웃 소음 법적 증빙 수집 · SOUNDTEST.PRO',
            'th': 'รวบรวมหลักฐานเสียงรบกวนข้างห้องและคอนโด · SOUNDTEST.PRO',
            'vi': 'Thu Thập Bằng Chứng Tiếng Ồn Hàng Xóm · SOUNDTEST.PRO'
        },
        'bar-street-disturbance': {
            'es': 'Registro de Ruido de Bares, Locales y Vía Pública · SOUNDTEST.PRO',
            'de': 'Lärmbelästigung durch Bars, Gastronomie & Straßen · SOUNDTEST.PRO',
            'fr': 'Constat de Nuisances de Bars, Terrasses et Rue · SOUNDTEST.PRO',
            'ja': '飲食店・居酒屋・街頭騒音の測定証拠収集 · SOUNDTEST.PRO',
            'ko': '상가, 주점 및 야간 거리 소음 증빙 수집 · SOUNDTEST.PRO',
            'th': 'บันทึกหลักฐานเสียงรบกวนจากบาร์และถนน · SOUNDTEST.PRO',
            'vi': 'Ghi Bằng Chứng Tiếng Ồn Quán Bar & Phố Đêm · SOUNDTEST.PRO'
        },
        'construction-noise-monitoring': {
            'es': 'Monitorización de Ruido de Obras y Construcción · SOUNDTEST.PRO',
            'de': 'Baustellenlärm Überwachung & Dokumentation · SOUNDTEST.PRO',
            'fr': 'Surveillance et Constat du Bruit de Chantier · SOUNDTEST.PRO',
            'ja': '工事・解体・リフォーム騒音監視と証拠収集 · SOUNDTEST.PRO',
            'ko': '공사 및 리모델링 소음 측정 모니터링 · SOUNDTEST.PRO',
            'th': 'ตรวจวัดและบันทึกหลักฐานเสียงงานก่อสร้าง · SOUNDTEST.PRO',
            'vi': 'Giám Sát Bằng Chứng Tiếng Ồn Công Trình Xây Dựng · SOUNDTEST.PRO'
        },
        'property-noise-complaint-report': {
            'es': 'Gestión y Partes de Quejas por Ruido en Fincas · SOUNDTEST.PRO',
            'de': 'Lärmprotokolle für Hausverwaltung & Eigentümer · SOUNDTEST.PRO',
            'fr': 'Gestion des Plaintes pour Bruit en Copropriété · SOUNDTEST.PRO',
            'ja': 'マンション管理会社・管理組合向け騒音調査報告 · SOUNDTEST.PRO',
            'ko': '관리사무소 및 입주자대표회의 층간소음 리포트 · SOUNDTEST.PRO',
            'th': 'รายงานข้อร้องเรียนเสียงสำหรับนิติบุคคลอาคารชุด · SOUNDTEST.PRO',
            'vi': 'Báo Cáo Tiếp Nhận Khiếu Nại Tiếng Ồn Tòa Nhà · SOUNDTEST.PRO'
        },
        'rental-dispute-evidence': {
            'es': 'Pruebas de Ruido para Disputas de Alquiler y Rescisión · SOUNDTEST.PRO',
            'de': 'Mietstreit Beweise für Mietminderung & Kündigung · SOUNDTEST.PRO',
            'fr': 'Preuves de Bruit pour Litiges Locatifs et Bail · SOUNDTEST.PRO',
            'ja': '賃貸トラブル・解約・敷金返還のための騒音証拠 · SOUNDTEST.PRO',
            'ko': '임대차 소음 분쟁 및 계약 해지 법적 증빙 · SOUNDTEST.PRO',
            'th': 'หลักฐานเสียงสำหรับข้อพิพาทการเช่าและยกเลิกสัญญา · SOUNDTEST.PRO',
            'vi': 'Bằng Chứng Tiếng Ồn Giải Quyết Tranh Chấp Thuê Nhà · SOUNDTEST.PRO'
        },
        'workplace-noise-inspection': {
            'es': 'Inspección de Ruido Laboral y Prevención de Riesgos · SOUNDTEST.PRO',
            'de': 'Lärmmessung am Arbeitsplatz & Arbeitsschutz · SOUNDTEST.PRO',
            'fr': 'Contrôle du Bruit au Travail et Santé Professionnelle · SOUNDTEST.PRO',
            'ja': '職場・オフィス・工場の騒音巡回点検 · SOUNDTEST.PRO',
            'ko': '직장 및 사업장 산업안전 소음 점검 · SOUNDTEST.PRO',
            'th': 'การตรวจวัดเสียงในสถานที่ทำงานและโรงงาน · SOUNDTEST.PRO',
            'vi': 'Kiểm Tra Tiếng Ồn Nơi Làm Việc & An Toàn Lao Động · SOUNDTEST.PRO'
        }
    }[scenario_slug][locale]
    
    meta_desc = sc_data['hero'][locale]['lead'][:155] + '...'
    
    hreflangs = build_hreflang_tags(locale, scenario_slug)
    nav_html = build_nav_html(locale, scenario_slug)
    hero_html = build_hero_html(locale, scenario_slug, sc_data)
    table_html = build_table_html(locale, scenario_slug, sc_data)
    steps_html = build_steps_html(locale, scenario_slug, sc_data)
    features_html = build_features_html(locale, scenario_slug, sc_data)
    rules_html = build_rules_html(locale, scenario_slug, sc_data)
    faq_html = build_faq_html(locale, scenario_slug, sc_data)
    sidebar_html = build_sidebar_html(locale, rel_depth='../../')
    cta_band_html = build_cta_band_html(locale, scenario_slug, sc_data)
    pills_html = build_pill_switcher_html(locale, scenario_slug)
    footer_html = build_footer_html(locale)
    
    html = f'''<!DOCTYPE html>
<html lang="{locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{meta_desc}">
  <title>{title_text}</title>

  <script type="application/ld+json">{json_ld}</script>  
{hreflangs}
  <link rel="stylesheet" href="/assets/site.css?v=20261005k">
  <link rel="manifest" href="/manifest.webmanifest">
  <script src="/assets/lang-flags.js" defer></script>
  <script src="/assets/site-i18n.js?v=20261005j" defer></script>
  <script src="/assets/site-auth.js?v=20261005j" defer></script>
  <script src="/assets/site-experience.js?v=20261005j" defer></script>
  <script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
  <script>LA.init({{id:"281wblDNvub2tk9f",ck:"281wblDNvub2tk9f"}})</script>
</head>
<body>
  <main class="site-shell">
{nav_html}

{hero_html}

    <div class="uc-article-layout">
      <div class="uc-article-main">
{table_html}

{steps_html}

{features_html}

{rules_html}

{faq_html}
      </div>
{sidebar_html}
    </div>

{cta_band_html}

{pills_html}

{footer_html}
  </main>

  <script>
    function toggleUcFaq(btn) {{
      const isExp = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', isExp ? 'false' : 'true');
      const a = btn.nextElementSibling;
      if (a) a.classList.toggle('open', !isExp);
    }}

    if ('serviceWorker' in navigator) {{
      window.addEventListener('load', () => {{
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW Registration failed:', err));
      }});
    }}
  </script>
</body>
</html>
'''
    return html

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    count = 0
    for loc in LOCALES:
        loc_dir = os.path.join(root, 'use-cases', loc)
        os.makedirs(loc_dir, exist_ok=True)
        for sc in SCENARIO_KEYS:
            file_path = os.path.join(loc_dir, f"{sc}.html")
            content = generate_use_case_page(loc, sc)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"[{count}/42] Generated {loc}/{sc}.html ({len(content)} bytes)")
    print(f"\nSuccessfully generated all {count} localized use-case pages!")

if __name__ == '__main__':
    main()
