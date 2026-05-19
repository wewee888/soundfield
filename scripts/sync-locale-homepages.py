#!/usr/bin/env python3
"""Regenerate locale landing pages from index.html with floating nav + deluxe footer."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
LOCALES = ("en", "zh", "es", "fr", "de", "ja", "ko", "vi", "th")

# Shared nav/footer labels per locale
NAV = {
    "en": {"features": "Features", "pricing": "Pro Pricing", "help": "Help", "account": "Account", "upgrade": "Upgrade Pro",
           "home": "index.html", "features_h": "#features", "pricing_h": "#pricing"},
    "zh": {"features": "功能", "pricing": "Pro 定价", "help": "帮助", "account": "账户", "upgrade": "升级 Pro",
           "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"},
}
for code in ("es", "fr", "de", "ja", "ko", "vi", "th"):
    NAV.setdefault(code, NAV["en"])

NAV["es"] = {"features": "Funciones", "pricing": "Precios Pro", "help": "Ayuda", "account": "Cuenta", "upgrade": "Pro",
             "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"}
NAV["fr"] = {"features": "Fonctions", "pricing": "Tarifs Pro", "help": "Aide", "account": "Compte", "upgrade": "Pro",
             "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"}
NAV["de"] = {"features": "Funktionen", "pricing": "Pro-Preise", "help": "Hilfe", "account": "Konto", "upgrade": "Pro",
             "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"}
NAV["ja"] = {"features": "機能", "pricing": "Pro料金", "help": "ヘルプ", "account": "アカウント", "upgrade": "Pro",
             "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"}
NAV["ko"] = {"features": "기능", "pricing": "Pro 요금", "help": "도움말", "account": "계정", "upgrade": "Pro",
             "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"}
NAV["vi"] = {"features": "Tính năng", "pricing": "Giá Pro", "help": "Trợ giúp", "account": "Tài khoản", "upgrade": "Pro",
             "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"}
NAV["th"] = {"features": "ฟีเจอร์", "pricing": "ราคา Pro", "help": "ช่วยเหลือ", "account": "บัญชี", "upgrade": "Pro",
             "home": "../index.html", "features_h": "#features", "pricing_h": "#pricing"}

COPY = {
    "en": {
        "lang": "en",
        "canonical": "https://soundtest.pro/en/",
        "slogan": "Free Online Noise Evidence Recorder | No App Required",
        "headline_em": "Measure dB. Lock the evidence. Stay private.",
        "start": "Start Monitoring",
        "eyebrow": "English · No app download",
        "section_features": "Four core capabilities",
        "section_scenarios": "Perfect For:",
        "free_pill": "Free Version",
        "pro_pill": "Pro Premium Version",
        "privacy_title": "Privacy Protection:",
    },
    "zh": {
        "lang": "zh-CN",
        "canonical": "https://soundtest.pro/zh/",
        "slogan": "免费在线噪音取证记录工具｜无需安装 App",
        "headline_em": "测量分贝、锁定证据、数据留在本机。",
        "start": "开始监测",
        "eyebrow": "中文 · 无需安装 App",
        "section_features": "核心功能",
        "section_scenarios": "适用场景",
        "free_pill": "免费版",
        "pro_pill": "高级版",
        "privacy_title": "隐私保护：",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "免费在线噪音取证记录工具｜<em>无需安装 App</em>。<br><em>测量分贝、锁定证据、数据留在本机。</em>"),
            ("Measure Decibels, Record Sound, Save Time &amp; Location for Legal Complaint Documentation. Neighbor noise, construction, bar &amp; street disturbance, rental dispute — start recording in one click, right in your browser.",
             "测量分贝、记录声音、保存时间与位置，用于噪音投诉资料整理。邻里噪音、装修施工、商铺街道噪音、租房纠纷 — 浏览器一键开始记录。"),
            ("Data processed locally · No upload", "本地处理 · 不上传"),
            ("No install · Multilingual · Local-first", "无需安装 · 多语言 · 本地优先"),
            ("Run AI workflow", "运行工作流"),
            ("Describe what you want to document — e.g. nightly bar noise on Elm Street", "描述要记录的场景，例如：夜间酒吧街噪"),
            ("Neighbor noise", "邻里噪音"),
            ("Construction", "施工噪音"),
            ("Bar &amp; street", "酒吧街道"),
            ("Rental dispute", "租房纠纷"),
            ("One-click start", "一键开始"),
            ("9 languages", "9 种语言"),
            ("View report samples", "查看报告样例"),
            ("Read accuracy limits", "查看精度说明"),
            ("Standby · click to wake", "待机 · 点击唤醒"),
            ("Local microphone only", "仅本地麦克风"),
            ("Four core capabilities", "核心功能"),
            ("Measure, record, stamp, and export — one calm workflow.", "测量、记录、标记、导出 — 一条清晰流程。"),
            ("Perfect For:", "适用场景："),
            ("Cool down, click once, document everything.", "冷静一次点击，完整记录现场。"),
            ("Global noise reference", "噪声参考"),
            ("Daytime Reference (6:00–22:00)", "昼间参考（6:00-22:00）"),
            ("Nighttime Reference (22:00–6:00)", "夜间参考（22:00-6:00）"),
            ("Free Version", "免费版"),
            ("Pro Premium Version", "高级版"),
            ("Start with the web tool", "先用网页工具开始"),
            ("Upgrade to Premium", "升级高级版"),
            ("Open free tool", "打开免费工具"),
            ("Create account &amp; checkout", "注册并开通"),
            ("Latest Updates", "最新更新"),
            ("Disclaimer:", "免责声明："),
            ("Privacy Protection:", "隐私保护："),
            ("The static web tool does not collect", "静态网页工具不会收集"),
            ("Product", "产品"),
            ("Resources", "资源"),
            ("Legal", "法律信息"),
            ("Language", "语言"),
            ("Open App", "打开工具"),
            ("Features", "功能"),
            ("Pro Pricing", "Pro 定价"),
            ("Help", "帮助"),
            ("Account", "账户"),
            ("Upgrade Pro", "升级 Pro"),
            ("Start Monitoring", "开始监测"),
            ("Real Time Decibel Meter", "实时分贝测量"),
            ("Audio &amp; Waveform Recording", "音频与波形记录"),
            ("Auto Time &amp; Location Stamp", "自动时间与位置标记"),
            ("Evidence Report Export", "证据报告导出"),
            ("Neighbor &amp; Apartment Noise", "邻里与公寓噪音"),
            ("Construction Renovation Noise", "装修施工噪音"),
            ("Bar, Shop &amp; Street Disturbance", "酒吧商铺与街道扰民"),
            ("Rental Dispute &amp; Legal Evidence Aid", "租房纠纷与证据辅助"),
            ("Home Environment Sound Monitoring", "居家环境声音监测"),
        ],
    },
    "es": {
        "lang": "es",
        "canonical": "https://soundtest.pro/es/",
        "slogan": "Grabador de Evidencia de Ruido Online Gratuito | Sin Instalar App",
        "headline_em": "Mide dB. Bloquea la evidencia. Mantén la privacidad.",
        "start": "Iniciar Monitoreo",
        "eyebrow": "Español · Sin instalar app",
        "section_features": "Cuatro capacidades clave",
        "section_scenarios": "Ideal para:",
        "free_pill": "Versión gratuita",
        "pro_pill": "Versión Pro Premium",
        "privacy_title": "Protección de privacidad:",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "Grabador de Evidencia de Ruido Online Gratuito | <em>Sin Instalar App</em>.<br><em>Mide dB. Bloquea la evidencia. Mantén la privacidad.</em>"),
            ("Start Monitoring", "Iniciar Monitoreo"),
            ("Four core capabilities", "Cuatro capacidades clave"),
            ("Perfect For:", "Ideal para:"),
            ("Free Version", "Versión gratuita"),
            ("Pro Premium Version", "Versión Pro Premium"),
            ("Privacy Protection:", "Protección de privacidad:"),
        ],
    },
    "fr": {
        "lang": "fr",
        "canonical": "https://soundtest.pro/fr/",
        "slogan": "Enregistreur de Bruit Preuve Gratuit Sans Application",
        "headline_em": "Mesurez les dB. Verrouillez la preuve. Restez privé.",
        "start": "Lancer la mesure",
        "eyebrow": "Français · Sans application",
        "section_features": "Quatre capacités clés",
        "section_scenarios": "Parfait pour :",
        "free_pill": "Version gratuite",
        "pro_pill": "Version Pro Premium",
        "privacy_title": "Protection de la vie privée :",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "Enregistreur de Bruit Preuve Gratuit Sans Application.<br><em>Mesurez les dB. Verrouillez la preuve. Restez privé.</em>"),
            ("Start Monitoring", "Lancer la mesure"),
            ("Four core capabilities", "Quatre capacités clés"),
            ("Perfect For:", "Parfait pour :"),
            ("Free Version", "Version gratuite"),
            ("Pro Premium Version", "Version Pro Premium"),
            ("Privacy Protection:", "Protection de la vie privée :"),
        ],
    },
    "de": {
        "lang": "de",
        "canonical": "https://soundtest.pro/de/",
        "slogan": "Kostenloser Lärmaufzeichner für Beweise | Keine App nötig",
        "headline_em": "dB messen. Beweise sichern. Privat bleiben.",
        "start": "Überwachung starten",
        "eyebrow": "Deutsch · Keine App",
        "section_features": "Vier Kernfunktionen",
        "section_scenarios": "Perfekt für:",
        "free_pill": "Kostenlose Version",
        "pro_pill": "Pro Premium Version",
        "privacy_title": "Datenschutz:",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "Kostenloser Lärmaufzeichner für Beweise | <em>Keine App nötig</em>.<br><em>dB messen. Beweise sichern. Privat bleiben.</em>"),
            ("Start Monitoring", "Überwachung starten"),
            ("Four core capabilities", "Vier Kernfunktionen"),
            ("Perfect For:", "Perfekt für:"),
            ("Free Version", "Kostenlose Version"),
            ("Pro Premium Version", "Pro Premium Version"),
            ("Privacy Protection:", "Datenschutz:"),
        ],
    },
    "ja": {
        "lang": "ja",
        "canonical": "https://soundtest.pro/ja/",
        "slogan": "無料オンライン騒音証拠記録ツール｜アプリ不要",
        "headline_em": "dBを測定。証拠を固定。プライバシーを守る。",
        "start": "測定開始",
        "eyebrow": "日本語 · アプリ不要",
        "section_features": "4つのコア機能",
        "section_scenarios": "こんな場面に：",
        "free_pill": "無料版",
        "pro_pill": "Proプレミアム版",
        "privacy_title": "プライバシー保護：",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "無料オンライン騒音証拠記録ツール｜<em>アプリ不要</em>。<br><em>dBを測定。証拠を固定。プライバシーを守る。</em>"),
            ("Start Monitoring", "測定開始"),
            ("Four core capabilities", "4つのコア機能"),
            ("Perfect For:", "こんな場面に："),
            ("Free Version", "無料版"),
            ("Pro Premium Version", "Proプレミアム版"),
            ("Privacy Protection:", "プライバシー保護："),
        ],
    },
    "ko": {
        "lang": "ko",
        "canonical": "https://soundtest.pro/ko/",
        "slogan": "무료 온라인 소음 증거 녹음 도구 | 앱 설치 불필요",
        "headline_em": "dB 측정. 증거 고정. 프라이버시 유지.",
        "start": "측정 시작",
        "eyebrow": "한국어 · 앱 설치 불필요",
        "section_features": "4가지 핵심 기능",
        "section_scenarios": "이런 경우에:",
        "free_pill": "무료 버전",
        "pro_pill": "Pro 프리미엄 버전",
        "privacy_title": "개인정보 보호:",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "무료 온라인 소음 증거 녹음 도구 | <em>앱 설치 불필요</em>.<br><em>dB 측정. 증거 고정. 프라이버시 유지.</em>"),
            ("Start Monitoring", "측정 시작"),
            ("Four core capabilities", "4가지 핵심 기능"),
            ("Perfect For:", "이런 경우에:"),
            ("Free Version", "무료 버전"),
            ("Pro Premium Version", "Pro 프리미엄 버전"),
            ("Privacy Protection:", "개인정보 보호:"),
        ],
    },
    "vi": {
        "lang": "vi",
        "canonical": "https://soundtest.pro/vi/",
        "slogan": "Công cụ ghi nhận tiếng ồn trực tuyến miễn phí | Không cần cài app",
        "headline_em": "Đo dB. Khóa bằng chứng. Giữ riêng tư.",
        "start": "Bắt đầu đo",
        "eyebrow": "Tiếng Việt · Không cần app",
        "section_features": "Bốn tính năng cốt lõi",
        "section_scenarios": "Phù hợp cho:",
        "free_pill": "Bản miễn phí",
        "pro_pill": "Bản Pro Premium",
        "privacy_title": "Bảo vệ quyền riêng tư:",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "Công cụ ghi nhận tiếng ồn trực tuyến miễn phí | <em>Không cần cài app</em>.<br><em>Đo dB. Khóa bằng chứng. Giữ riêng tư.</em>"),
            ("Start Monitoring", "Bắt đầu đo"),
            ("Four core capabilities", "Bốn tính năng cốt lõi"),
            ("Perfect For:", "Phù hợp cho:"),
            ("Free Version", "Bản miễn phí"),
            ("Pro Premium Version", "Bản Pro Premium"),
            ("Privacy Protection:", "Bảo vệ quyền riêng tư:"),
        ],
    },
    "th": {
        "lang": "th",
        "canonical": "https://soundtest.pro/th/",
        "slogan": "เครื่องมือบันทึกหลักฐานเสียงรบกวนออนไลน์ฟรี | ไม่ต้องติดตั้งแอป",
        "headline_em": "วัด dB ล็อกหลักฐาน ข้อมูลอยู่ในเครื่อง",
        "start": "เริ่มวัด",
        "eyebrow": "ไทย · ไม่ต้องติดตั้งแอป",
        "section_features": "สี่ความสามารถหลัก",
        "section_scenarios": "เหมาะสำหรับ:",
        "free_pill": "เวอร์ชันฟรี",
        "pro_pill": "เวอร์ชัน Pro Premium",
        "privacy_title": "การปกป้องความเป็นส่วนตัว:",
        "replacements": [
            ("Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
             "เครื่องมือบันทึกหลักฐานเสียงรบกวนออนไลน์ฟรี | <em>ไม่ต้องติดตั้งแอป</em>。<br><em>วัด dB ล็อกหลักฐาน ข้อมูลอยู่ในเครื่อง</em>"),
            ("Start Monitoring", "เริ่มวัด"),
            ("Four core capabilities", "สี่ความสามารถหลัก"),
            ("Perfect For:", "เหมาะสำหรับ:"),
            ("Free Version", "เวอร์ชันฟรี"),
            ("Pro Premium Version", "เวอร์ชัน Pro Premium"),
            ("Privacy Protection:", "การปกป้องความเป็นส่วนตัว:"),
        ],
    },
}


def prefix_relative_urls(html: str, prefix: str = "../") -> str:
    def fix_attr(match: re.Match[str]) -> str:
        attr, url = match.group(1), match.group(2)
        if url.startswith(("http://", "https://", "mailto:", "#", "javascript:")):
            return match.group(0)
        if url.startswith(prefix):
            return match.group(0)
        return f'{attr}="{prefix}{url}"'

    html = re.sub(r'(href|src)="([^"]+)"', fix_attr, html)
    html = html.replace('href="../#', 'href="#')
    return html


def patch_nav_brand_home(html: str, code: str) -> str:
    nav = NAV.get(code, NAV["en"])
    html = html.replace('href="index.html"', f'href="{nav["home"]}"', 1)
    html = re.sub(
        r'<a href="#features">Features</a>',
        f'<a href="{nav["features_h"]}">{nav["features"]}</a>',
        html,
        count=1,
    )
    html = re.sub(
        r'<a href="#pricing">Pro Pricing</a>',
        f'<a href="{nav["pricing_h"]}">{nav["pricing"]}</a>',
        html,
        count=1,
    )
    html = html.replace('href="accuracy.html">Help</a>', f'href="../accuracy.html">{nav["help"]}</a>', 1)
    html = html.replace('href="auth.html">Account</a>', f'href="../auth.html">{nav["account"]}</a>', 1)
    html = html.replace("<span>Upgrade Pro</span>", f"<span>{nav['upgrade']}</span>", 1)
    return html


def build_locale(code: str, source: str) -> str:
    cfg = COPY[code]
    html = source

    if code != "en":
        html = prefix_relative_urls(html)
        html = patch_nav_brand_home(html, code)
    else:
        html = patch_nav_brand_home(html.replace('href="../index.html"', 'href="../index.html"'), "en")
        html = prefix_relative_urls(html)

    html = re.sub(r'<html lang="[^"]*">', f'<html lang="{cfg["lang"]}">', html, count=1)
    html = re.sub(
        r'<link rel="canonical" href="[^"]*">',
        f'<link rel="canonical" href="{cfg["canonical"]}">',
        html,
        count=1,
    )
    html = re.sub(
        r"<title>[^<]*</title>",
        f"<title>{cfg['slogan']} · SOUNDTEST.PRO</title>",
        html,
        count=1,
    )

  # footer flags: prefix locale links
    for loc in LOCALES:
        html = html.replace(f'href="{loc}/index.html"', f'href="../{loc}/index.html"')

    reps = cfg.get("replacements", [])
    if code == "en":
        reps = [
            (
                "Free Online Noise Evidence Recorder | No App Required.<br><em>Measure dB. Lock the evidence. Stay private.</em>",
                f"{cfg['slogan']}.<br><em>{cfg['headline_em']}</em>",
            ),
            ("Start Monitoring", cfg["start"]),
            ("Four core capabilities", cfg["section_features"]),
            ("Perfect For:", cfg["section_scenarios"]),
            ("Free Version", cfg["free_pill"]),
            ("Pro Premium Version", cfg["pro_pill"]),
            ("Privacy Protection:", cfg["privacy_title"]),
            ("No install · Multilingual · Local-first", cfg["eyebrow"]),
        ]

    for old, new in sorted(reps, key=lambda x: -len(x[0])):
        html = html.replace(old, new)

    html = html.replace(">Start Monitoring<", f">{cfg['start']}<")
    return html


def main() -> None:
    source = INDEX.read_text(encoding="utf-8")
    for code in LOCALES:
        out = ROOT / code / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build_locale(code, source), encoding="utf-8")
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
