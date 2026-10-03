#!/usr/bin/env python3
"""
scripts/sync_all_camera_pages.py

Generates and synchronizes dedicated Acoustic Evidence Camera pages (camera.html)
across all 9 supported locales:
- Root: camera.html (English / Canonical)
- Locales: zh/camera.html, en/camera.html, es/camera.html, fr/camera.html,
           de/camera.html, ja/camera.html, ko/camera.html, vi/camera.html, th/camera.html
Also synchronizes hreflang alternate links and updates sitemap.xml.
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOCALES = {
    'zh': {
        'html_lang': 'zh-CN',
        'title': '在线声学存证相机｜自动压印实时分贝、精准定位与防篡改时间戳 · SOUNDTEST.PRO',
        'desc': '无需下载 App 的在线声学存证相机。现场拍照与录像自动叠加实时分贝读数、GPS 经纬度位置、防篡改时间戳与 SHA-256 数字指纹，专为邻里噪音投诉、施工扰民巡检与租房维权设计。',
        'keywords': '声学水印相机, 噪音拍照取证, 现场分贝水印相机, 邻里纠纷拍照, 施工噪声存证',
        'appName': 'SOUNDTEST.PRO 声学存证水印相机',
        'appDesc': '无需安装客户端的浏览器声学水印相机，支持现场拍照压印分贝、经纬度及防伪数字签名。',
        'backLink': '返回分贝仪',
        'liveStatus': '声学存证监控中',
        'switchCam': '切换前后摄像头',
        'brandHud': 'SOUNDTEST.PRO · 声学存证水印',
        'sampling': '正在采样现场分贝…',
        'peakLabel': 'PEAK 峰值',
        'avgLabel': 'AVG 平均',
        'geoPending': '正在获取现场 GPS 坐标与地址…',
        'hashPending': 'SHA-256 计算中…',
        'hashDesc': '防篡改本地优先存证',
        'galleryTitle': '查看最近证据照片',
        'shutterTitle': '拍照存证',
        'modalTitle': '声学证据照片已生成',
        'saveBtn': '保存高清存证照片到相册',
        'reportBtn': '📄 前往证据库导出正式维权报告',
    },
    'en': {
        'html_lang': 'en-US',
        'title': 'Online Acoustic Evidence Camera | Watermark Real-time Decibels, GPS & Timestamp · SOUNDTEST.PRO',
        'desc': 'Zero download required. Browser-native acoustic evidence camera stamping real-time decibels, GPS coordinates, tamper-evident timestamps, and SHA-256 digital signatures onto dispute photos and videos.',
        'keywords': 'acoustic watermark camera, noise evidence camera, decibel photo watermark, neighbor dispute photos, construction noise documentation',
        'appName': 'SOUNDTEST.PRO Acoustic Evidence Camera',
        'appDesc': 'Browser-native acoustic watermark camera that stamps real-time decibels, GPS location, and cryptographic timestamps onto dispute photos.',
        'backLink': 'Back to Sound Meter',
        'liveStatus': 'Acoustic Evidence Active',
        'switchCam': 'Switch Camera',
        'brandHud': 'SOUNDTEST.PRO · Evidence Watermark',
        'sampling': 'Sampling live dB SPL…',
        'peakLabel': 'PEAK Peak',
        'avgLabel': 'AVG Average',
        'geoPending': 'Acquiring GPS coordinates & address…',
        'hashPending': 'SHA-256 Calculating…',
        'hashDesc': 'Tamper-evident local storage',
        'galleryTitle': 'View recent evidence photos',
        'shutterTitle': 'Capture evidence photo',
        'modalTitle': 'Acoustic Evidence Photo Captured',
        'saveBtn': 'Save High-Res Photo to Device',
        'reportBtn': '📄 Go to Evidence Library for Formal Report',
    },
    'es': {
        'html_lang': 'es-ES',
        'title': 'Cámara de prueba acústica online | Marcas de agua con decibelios en tiempo real, GPS y sellos de tiempo · SOUNDTEST.PRO',
        'desc': 'Sin necesidad de descargar apps. Cámara de evidencia acústica web que añade lecturas de decibelios en tiempo real, GPS y firmas SHA-256 a fotos y vídeos de disputas.',
        'keywords': 'cámara marca de agua acústica, prueba de ruido, fotos de disputas, decibelios en foto',
        'appName': 'SOUNDTEST.PRO Cámara de Prueba Acústica',
        'appDesc': 'Cámara web con sello de decibelios, coordenadas GPS y firma criptográfica para disputas por ruido.',
        'backLink': 'Volver al sonómetro',
        'liveStatus': 'Vigilancia acústica activa',
        'switchCam': 'Cambiar cámara',
        'brandHud': 'SOUNDTEST.PRO · Marca de agua de prueba',
        'sampling': 'Muestreando dB en vivo…',
        'peakLabel': 'PICO Máximo',
        'avgLabel': 'MED Promedio',
        'geoPending': 'Obteniendo GPS y dirección…',
        'hashPending': 'Calculando SHA-256…',
        'hashDesc': 'Prueba local a prueba de manipulaciones',
        'galleryTitle': 'Ver fotos de evidencia recientes',
        'shutterTitle': 'Capturar foto de prueba',
        'modalTitle': 'Foto de prueba acústica generada',
        'saveBtn': 'Guardar foto en el dispositivo',
        'reportBtn': '📄 Ir a la biblioteca para generar informe formal',
    },
    'fr': {
        'html_lang': 'fr-FR',
        'title': 'Caméra de preuve acoustique en ligne | Filigrane décibels en temps réel, GPS et horodatage · SOUNDTEST.PRO',
        'desc': 'Aucune application à télécharger. Caméra Web de constat sonore incrustant le niveau de décibels en temps réel, les coordonnées GPS et une empreinte SHA-256 infalsifiable.',
        'keywords': 'caméra filigrane acoustique, preuve de bruit, constat sonore, litige voisinage',
        'appName': 'SOUNDTEST.PRO Caméra de Constat Acoustique',
        'appDesc': 'Caméra Web avec horodatage, niveau sonore et localisation pour la documentation des nuisances sonores.',
        'backLink': 'Retour au sonomètre',
        'liveStatus': 'Surveillance acoustique active',
        'switchCam': 'Changer de caméra',
        'brandHud': 'SOUNDTEST.PRO · Filigrane de preuve',
        'sampling': 'Échantillonnage dB en cours…',
        'peakLabel': 'CRÊTE Max',
        'avgLabel': 'MOY Moyenne',
        'geoPending': 'Acquisition GPS et adresse…',
        'hashPending': 'Calcul SHA-256…',
        'hashDesc': 'Preuve locale infalsifiable',
        'galleryTitle': 'Voir les photos récentes',
        'shutterTitle': 'Capturer photo de preuve',
        'modalTitle': 'Photo de preuve acoustique générée',
        'saveBtn': 'Enregistrer la photo haute résolution',
        'reportBtn': '📄 Accéder à la bibliothèque pour le rapport officiel',
    },
    'de': {
        'html_lang': 'de-DE',
        'title': 'Online-Akustik-Beweiskamera | Echtzeit-Dezibel, GPS und fälschungssichere Zeitstempel · SOUNDTEST.PRO',
        'desc': 'Kein App-Download erforderlich. Web-Beweiskamera mit Einblendung von Echtzeit-Dezibelwerten, GPS-Koordinaten und SHA-256-Signatur für Lärmprotokolle und Nachbarschaftskonflikte.',
        'keywords': 'Akustik-Wasserzeichen-Kamera, Lärmprotokoll Foto, Dezibel Wasserzeichen, Ruhestörung Beweis',
        'appName': 'SOUNDTEST.PRO Akustische Beweiskamera',
        'appDesc': 'Browser-Beweiskamera mit Echtzeit-Dezibel-Aufdruck, GPS-Ortung und fälschungssicherem Zeitstempel.',
        'backLink': 'Zurück zum Pegelmesser',
        'liveStatus': 'Lärmbeweissicherung aktiv',
        'switchCam': 'Kamera wechseln',
        'brandHud': 'SOUNDTEST.PRO · Beweis-Wasserzeichen',
        'sampling': 'Erfasse Echtzeit-Dezibel…',
        'peakLabel': 'PEAK Spitze',
        'avgLabel': 'DURCHSCHN.',
        'geoPending': 'Ermittle GPS und Adresse…',
        'hashPending': 'SHA-256 Berechnung…',
        'hashDesc': 'Manipulationssicherer lokaler Speicher',
        'galleryTitle': 'Zuletzt aufgenommene Beweise ansehen',
        'shutterTitle': 'Beweisfoto aufnehmen',
        'modalTitle': 'Akustisches Beweisfoto erstellt',
        'saveBtn': 'Hochauflösendes Foto speichern',
        'reportBtn': '📄 Zur Beweisdatenbank für offiziellen Bericht',
    },
    'ja': {
        'html_lang': 'ja-JP',
        'title': 'オンライン音響証拠カメラ｜リアルタイムデシベル・GPS位置情報・タイムスタンプ自動記録 · SOUNDTEST.PRO',
        'desc': 'アプリのダウンロード不要。現場の写真や動画にリアルタイムのデシベル値、GPS座標、改ざん防止タイムスタンプ、SHA-256デジタル署名を自動合成するWeb音響証拠カメラ。',
        'keywords': '騒音証拠カメラ, デシベル透かしカメラ, 近隣トラブル証拠写真, 騒音測定カメラ',
        'appName': 'SOUNDTEST.PRO 音響証拠カメラ',
        'appDesc': '現場写真に騒音デシベル値、GPS位置情報、タイムスタンプを自動合成するWebカメラ。',
        'backLink': '測定器に戻る',
        'liveStatus': '音響証拠記録中',
        'switchCam': 'カメラ切替',
        'brandHud': 'SOUNDTEST.PRO · 音響証拠透かし',
        'sampling': '現場のデシベルをサンプリング中…',
        'peakLabel': 'PEAK ピーク',
        'avgLabel': 'AVG 平均',
        'geoPending': 'GPS座標と住所を取得中…',
        'hashPending': 'SHA-256 演算中…',
        'hashDesc': '改ざん防止・ローカル保存',
        'galleryTitle': '最近の証拠写真を見る',
        'shutterTitle': '証拠写真を撮影',
        'modalTitle': '音響証拠写真が生成されました',
        'saveBtn': '高画質写真をアルバムに保存',
        'reportBtn': '📄 証拠ライブラリで正式レポートを出力',
    },
    'ko': {
        'html_lang': 'ko-KR',
        'title': '온라인 음향 증거 카메라 | 실시간 데시벨, GPS 위치 및 타임스탬프 자동 워터마크 · SOUNDTEST.PRO',
        'desc': '앱 다운로드 불필요. 현장 사진과 동영상에 실시간 데시벨 수치, GPS 좌표, 위변조 방지 타임스탬프 및 SHA-256 디지털 지문을 합성하는 웹 음향 증거 카메라.',
        'keywords': '소음 증거 카메라, 데시벨 워터마크, 층간소음 사진 증거, 공사 소음 입증',
        'appName': 'SOUNDTEST.PRO 음향 증거 카메라',
        'appDesc': '현장 사진에 실시간 소음 데시벨과 위치, 시간을 합성하여 증거력을 확보하는 웹 카메라.',
        'backLink': '측정기로 돌아가기',
        'liveStatus': '음향 증거 기록 중',
        'switchCam': '카메라 전환',
        'brandHud': 'SOUNDTEST.PRO · 음향 증거 워터마크',
        'sampling': '실시간 소음 측정 중…',
        'peakLabel': 'PEAK 피크',
        'avgLabel': 'AVG 평균',
        'geoPending': 'GPS 좌표 및 주소 확인 중…',
        'hashPending': 'SHA-256 계산 중…',
        'hashDesc': '위변조 방지 로컬 우선 저장',
        'galleryTitle': '최근 증거 사진 보기',
        'shutterTitle': '증거 사진 촬영',
        'modalTitle': '음향 증거 사진이 생성되었습니다',
        'saveBtn': '고화질 사진 기기에 저장',
        'reportBtn': '📄 증거 보관함에서 정식 보고서 내보내기',
    },
    'vi': {
        'html_lang': 'vi-VN',
        'title': 'Camera bằng chứng âm thanh trực tuyến | Tự động đóng dấu decibel thời gian thực, GPS và dấu thời gian · SOUNDTEST.PRO',
        'desc': 'Không cần tải app. Camera chứng cứ âm thanh trên web tự động ghi nhận số đo dB thời gian thực, tọa độ GPS, dấu thời gian và mã băm SHA-256 chống giả mạo.',
        'keywords': 'camera chứng cứ tiếng ồn, đóng dấu decibel, chụp ảnh tiếng ồn láng giềng',
        'appName': 'SOUNDTEST.PRO Camera Bằng Chứng Âm Thanh',
        'appDesc': 'Camera trên trình duyệt tự động đóng dấu mức decibel, tọa độ GPS và dấu thời gian lên ảnh chụp.',
        'backLink': 'Quay lại máy đo',
        'liveStatus': 'Đang giám sát bằng chứng',
        'switchCam': 'Đổi camera',
        'brandHud': 'SOUNDTEST.PRO · Dấu chứng cứ âm thanh',
        'sampling': 'Đang lấy mẫu dB hiện trường…',
        'peakLabel': 'ĐỈNH Peak',
        'avgLabel': 'TB Trung bình',
        'geoPending': 'Đang lấy GPS và địa chỉ…',
        'hashPending': 'Đang tính SHA-256…',
        'hashDesc': 'Lưu trữ cục bộ chống giả mạo',
        'galleryTitle': 'Xem ảnh chứng cứ gần đây',
        'shutterTitle': 'Chụp ảnh bằng chứng',
        'modalTitle': 'Đã tạo ảnh chứng cứ âm thanh',
        'saveBtn': 'Lưu ảnh chất lượng cao vào máy',
        'reportBtn': '📄 Tới kho bằng chứng để xuất báo cáo chính thức',
    },
    'th': {
        'html_lang': 'th-TH',
        'title': 'กล้องหลักฐานเสียงออนไลน์ | ลายน้ำเดซิเบลแบบเรียลไทม์ พิกัด GPS และตราประทับเวลา · SOUNDTEST.PRO',
        'desc': 'ไม่ต้องดาวน์โหลดแอป กล้องหลักฐานเสียงบนเว็บที่ประทับค่าเดซิเบลเรียลไทม์ พิกัด GPS ตราประทับเวลา และลายนิ้วมือดิจิทัล SHA-256 ป้องกันการดัดแปลง',
        'keywords': 'กล้องหลักฐานเสียง, ลายน้ำเดซิเบล, ภาพถ่ายร้องเรียนเสียงดัง, วัดระดับเสียง',
        'appName': 'SOUNDTEST.PRO กล้องหลักฐานเสียง',
        'appDesc': 'กล้องบนเว็บที่บันทึกและประทับค่าเดซิเบล พิกัด GPS และเวลาลงบนภาพถ่ายโดยตรง',
        'backLink': 'กลับไปที่เครื่องวัด',
        'liveStatus': 'กำลังบันทึกหลักฐานเสียง',
        'switchCam': 'สลับกล้อง',
        'brandHud': 'SOUNDTEST.PRO · ลายน้ำหลักฐานเสียง',
        'sampling': 'กำลังสุ่มตัวอย่างระดับเสียง…',
        'peakLabel': 'PEAK สูงสุด',
        'avgLabel': 'AVG ค่าเฉลี่ย',
        'geoPending': 'กำลังดึงพิกัด GPS และที่อยู่…',
        'hashPending': 'กำลังคำนวณ SHA-256…',
        'hashDesc': 'จัดเก็บในเครื่อง ป้องกันการแก้ไข',
        'galleryTitle': 'ดูภาพถ่ายหลักฐานล่าสุด',
        'shutterTitle': 'ถ่ายภาพหลักฐาน',
        'modalTitle': 'สร้างภาพถ่ายหลักฐานเสียงเรียบร้อยแล้ว',
        'saveBtn': 'บันทึกภาพความละเอียดสูงลงในเครื่อง',
        'reportBtn': '📄 ไปที่คลังหลักฐานเพื่อส่งออกรายงานทางการ',
    },
}

def render_camera_page(locale_key, is_root=False):
    c = LOCALES[locale_key]
    prefix = '' if is_root else '../'
    canonical_url = 'https://soundtest.pro/camera.html' if is_root else f'https://soundtest.pro/{locale_key}/camera.html'
    return_link = 'soundtest.html' if is_root else '../soundtest.html'
    auth_link = 'auth.html' if is_root else 'auth.html'

    hreflang_links = [
        '  <link rel="canonical" href="' + canonical_url + '">',
        '  <link rel="alternate" hreflang="x-default" href="https://soundtest.pro/camera.html">',
        '  <link rel="alternate" hreflang="zh" href="https://soundtest.pro/zh/camera.html">',
        '  <link rel="alternate" hreflang="en" href="https://soundtest.pro/en/camera.html">',
        '  <link rel="alternate" hreflang="es" href="https://soundtest.pro/es/camera.html">',
        '  <link rel="alternate" hreflang="fr" href="https://soundtest.pro/fr/camera.html">',
        '  <link rel="alternate" hreflang="de" href="https://soundtest.pro/de/camera.html">',
        '  <link rel="alternate" hreflang="ja" href="https://soundtest.pro/ja/camera.html">',
        '  <link rel="alternate" hreflang="ko" href="https://soundtest.pro/ko/camera.html">',
        '  <link rel="alternate" hreflang="vi" href="https://soundtest.pro/vi/camera.html">',
        '  <link rel="alternate" hreflang="th" href="https://soundtest.pro/th/camera.html">',
    ]

    html = f'''<!DOCTYPE html>
<html lang="{c['html_lang']}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta http-equiv="Cache-Control" content="no-transform, no-siteapp">
  <meta name="applicable-device" content="pc,mobile">
  <meta name="theme-color" content="#03060c">
  <title>{c['title']}</title>
  <meta name="description" content="{c['desc']}">
  <meta name="keywords" content="{c['keywords']}">
{chr(10).join(hreflang_links)}
  <link rel="icon" type="image/svg+xml" href="{prefix}assets/icon.svg">
  <link rel="manifest" href="{prefix}manifest.webmanifest">
  <link rel="stylesheet" href="{prefix}assets/camera.css?v=2.4">
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "{c['appName']}",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web browser",
    "url": "{canonical_url}",
    "description": "{c['appDesc']}",
    "offers": {{
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }}
  }}
  </script>
  <script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
  <script>LA.init({{id:"281wblDNvub2tk9f",ck:"281wblDNvub2tk9f"}})</script>
</head>
<body>
  <!-- Fullscreen Camera Viewfinder Stage -->
  <main class="cam-stage" role="main">

    <!-- Background Camera Video Stream -->
    <div class="cam-video-viewport" aria-label="Camera Viewfinder">
      <video id="camVideo" class="cam-video" autoplay playsinline muted></video>
      <div class="cam-crosshair" aria-hidden="true"></div>
      <div id="camFlash" class="cam-flash-overlay" aria-hidden="true"></div>
    </div>

    <!-- Top Navigation & Status Bar -->
    <header class="cam-top-bar">
      <a href="{return_link}" class="cam-back-link" title="{c['backLink']}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>{c['backLink']}</span>
      </a>

      <div class="cam-live-indicator">
        <span class="cam-live-dot"></span>
        <span>{c['liveStatus']}</span>
      </div>

      <div class="cam-tool-actions">
        <button type="button" id="switchCamBtn" class="cam-tool-btn" title="{c['switchCam']}" aria-label="{c['switchCam']}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </button>
      </div>
    </header>

    <!-- Semi-transparent Watermark HUD Card (Burned into Captured Photos) -->
    <section class="cam-watermark-overlay" aria-label="Live Forensic Watermark">
      <div class="hud-header">
        <div class="hud-brand">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          <span>{c['brandHud']}</span>
        </div>
        <div class="hud-time" id="hudTime">--:--:--</div>
      </div>

      <div class="hud-main-reading">
        <div class="hud-db-number" id="hudDb">--</div>
        <span class="hud-db-unit">dB</span>
        <div class="hud-level-desc" id="hudLevelDesc">{c['sampling']}</div>
      </div>

      <div class="hud-metrics-row">
        <div class="hud-metric-pill">
          <small>{c['peakLabel']}</small>
          <strong id="hudPeak">-- dB</strong>
        </div>
        <div class="hud-metric-pill">
          <small>{c['avgLabel']}</small>
          <strong id="hudAvg">-- dB</strong>
        </div>
      </div>

      <div class="hud-geo-row">
        <svg class="hud-geo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span id="hudGeo">{c['geoPending']}</span>
      </div>

      <div class="hud-footer">
        <span id="hudHash">{c['hashPending']}</span>
        <span>{c['hashDesc']}</span>
      </div>
    </section>

    <!-- Bottom Shutter & Gallery Controls -->
    <footer class="cam-bottom-bar">
      <div class="cam-shutter-row">
        <!-- Gallery button -->
        <button type="button" id="galleryThumb" class="cam-gallery-btn" title="{c['galleryTitle']}" aria-label="{c['galleryTitle']}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </button>

        <!-- Shutter Button -->
        <button type="button" id="shutterBtn" class="cam-shutter-btn" title="{c['shutterTitle']}" aria-label="{c['shutterTitle']}">
          <div class="cam-shutter-core"></div>
        </button>

        <!-- Switch Camera Button -->
        <button type="button" class="cam-switch-btn" onclick="document.getElementById('switchCamBtn').click()" title="{c['switchCam']}" aria-label="{c['switchCam']}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/><path d="M4 8V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    </footer>
  </main>

  <!-- Evidence Photo Preview & Export Modal -->
  <div id="previewModal" class="cam-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="cam-modal-head">
      <div class="cam-modal-title" id="modalTitle">
        <span>📸</span>
        <span>{c['modalTitle']}</span>
      </div>
      <button type="button" id="closePreviewBtn" class="cam-modal-close" aria-label="Close">✕</button>
    </div>

    <div class="cam-modal-body">
      <img id="previewImg" class="cam-modal-img" src="" alt="Captured Evidence Photo">
    </div>

    <div class="cam-modal-actions">
      <button type="button" id="downloadPhotoBtn" class="cam-btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <span>{c['saveBtn']}</span>
      </button>
      <a href="{auth_link}" class="cam-btn-secondary">
        <span>{c['reportBtn']}</span>
      </a>
    </div>
  </div>

  <!-- Toast Notification Stack -->
  <div id="camToast" class="cam-toast" role="status" aria-live="polite"></div>

  <script src="{prefix}assets/camera.js?v=2.4"></script>
</body>
</html>
'''
    return html

def update_sitemap():
    sitemap_path = os.path.join(BASE_DIR, 'sitemap.xml')
    if not os.path.exists(sitemap_path):
        return
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Build sitemap block for camera.html
    urls = [
        ('https://soundtest.pro/camera.html', 'camera.html'),
        ('https://soundtest.pro/en/camera.html', 'en/camera.html'),
        ('https://soundtest.pro/zh/camera.html', 'zh/camera.html'),
        ('https://soundtest.pro/es/camera.html', 'es/camera.html'),
        ('https://soundtest.pro/fr/camera.html', 'fr/camera.html'),
        ('https://soundtest.pro/de/camera.html', 'de/camera.html'),
        ('https://soundtest.pro/ja/camera.html', 'ja/camera.html'),
        ('https://soundtest.pro/ko/camera.html', 'ko/camera.html'),
        ('https://soundtest.pro/vi/camera.html', 'vi/camera.html'),
        ('https://soundtest.pro/th/camera.html', 'th/camera.html'),
    ]

    hreflang_xml = """    <xhtml:link rel="alternate" hreflang="x-default" href="https://soundtest.pro/camera.html"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://soundtest.pro/zh/camera.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://soundtest.pro/en/camera.html"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://soundtest.pro/es/camera.html"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://soundtest.pro/fr/camera.html"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://soundtest.pro/de/camera.html"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://soundtest.pro/ja/camera.html"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://soundtest.pro/ko/camera.html"/>
    <xhtml:link rel="alternate" hreflang="vi" href="https://soundtest.pro/vi/camera.html"/>
    <xhtml:link rel="alternate" hreflang="th" href="https://soundtest.pro/th/camera.html"/>"""

    url_blocks = []
    for loc, _ in urls:
        block = f"""  <url>
    <loc>{loc}</loc>
    <lastmod>2026-10-04</lastmod>
{hreflang_xml}
  </url>"""
        url_blocks.append(block)

    camera_sitemap_block = "\n".join(url_blocks)

    # Replace existing camera.html block in sitemap.xml
    pattern = re.compile(r'  <url>\s*<loc>https://soundtest\.pro/camera\.html</loc>[\s\S]*?</url>', re.MULTILINE)
    if pattern.search(content):
        new_content = pattern.sub(camera_sitemap_block, content)
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated sitemap.xml with full multilingual camera URLs.")

def main():
    # 1. Generate localized camera pages
    for loc in LOCALES:
        out_path = os.path.join(BASE_DIR, loc, 'camera.html')
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        html = render_camera_page(loc, is_root=False)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Generated {loc}/camera.html")

    # 2. Generate root camera.html (default English / canonical)
    root_path = os.path.join(BASE_DIR, 'camera.html')
    root_html = render_camera_page('en', is_root=True)
    with open(root_path, 'w', encoding='utf-8') as f:
        f.write(root_html)
    print("Generated root camera.html (English / Canonical)")

    # 3. Update sitemap.xml
    update_sitemap()

if __name__ == '__main__':
    main()
