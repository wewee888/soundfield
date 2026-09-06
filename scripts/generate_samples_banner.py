import os, math
from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 720
img = Image.new('RGBA', (W, H), (8, 12, 24, 255))
draw = ImageDraw.Draw(img)

font_title = ImageFont.truetype(r'C:\Windows\Fonts\seguisb.ttf', 32)
font_sub = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 17)
font_card_head = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 20)
font_badge = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 12)
font_big_db = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 44)
font_mono = ImageFont.truetype(r'C:\Windows\Fonts\arial.ttf', 13)
font_body = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 14)
font_body_bold = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 14)

draw.rounded_rectangle([(16, 16), (W-16, H-16)], radius=20, outline=(40, 56, 95, 255), width=2)
draw.text((48, 38), 'ACOUSTIC EVIDENCE EXPORT BUNDLE · LIVE PREVIEW', fill=(255, 255, 255, 255), font=font_title)
draw.text((48, 80), 'Standardized documentation deliverables generated directly in your browser: watermarked photos, PDF reports, and raw data', fill=(140, 165, 205, 255), font=font_sub)
draw.rounded_rectangle([(W-280, 40), (W-48, 76)], radius=8, fill=(24, 40, 75, 255), outline=(70, 110, 200, 255))
draw.text((W-265, 49), 'LOCAL-FIRST · TAMPER-EVIDENT', fill=(124, 175, 255, 255), font=font_badge)

card_y0, card_y1 = 120, H - 40
card_w = (W - 96 - 40) // 3

# Card 1: Photo
c1_x0 = 48
c1_x1 = c1_x0 + card_w
draw.rounded_rectangle([(c1_x0, card_y0), (c1_x1, card_y1)], radius=14, fill=(14, 20, 36, 255), outline=(50, 75, 125, 255), width=1)
draw.rounded_rectangle([(c1_x0 + 16, card_y0 + 16), (c1_x0 + 120, card_y0 + 38)], radius=6, fill=(30, 60, 120, 255))
draw.text((c1_x0 + 24, card_y0 + 20), 'PHOTO / VIDEO', fill=(140, 185, 255, 255), font=font_badge)
draw.text((c1_x0 + 16, card_y0 + 48), 'Acoustic Overlay Frame', fill=(255, 255, 255, 255), font=font_card_head)
vf_x0, vf_y0, vf_x1, vf_y1 = c1_x0 + 16, card_y0 + 86, c1_x1 - 16, card_y1 - 65
draw.rounded_rectangle([(vf_x0, vf_y0), (vf_x1, vf_y1)], radius=10, fill=(20, 28, 50, 255), outline=(70, 95, 150, 255))
for x in range(vf_x0 + 20, vf_x1 - 20, 6):
    h_bar = int(18 + 25 * math.sin((x - vf_x0) * 0.08) * math.cos((x - vf_x0) * 0.03))
    draw.line([(x, (vf_y0+vf_y1)//2 - h_bar), (x, (vf_y0+vf_y1)//2 + h_bar)], fill=(56, 180, 255, 180), width=3)

hud_y0 = vf_y1 - 110
draw.rounded_rectangle([(vf_x0 + 8, hud_y0), (vf_x1 - 8, vf_y1 - 8)], radius=8, fill=(10, 15, 28, 230), outline=(50, 80, 140, 255))
draw.text((vf_x0 + 16, hud_y0 + 8), '78.4 dBA', fill=(255, 95, 95, 255), font=font_big_db)
draw.text((vf_x0 + 210, hud_y0 + 12), 'PEAK: 84.1 dB · LAeq: 74.2 dB', fill=(255, 220, 120, 255), font=font_mono)
draw.text((vf_x0 + 210, hud_y0 + 32), 'TIME: 2026-09-06 22:15:30 UTC+8', fill=(180, 205, 240, 255), font=font_mono)
draw.text((vf_x0 + 16, hud_y0 + 60), 'GPS: 39.9042 N, 116.4074 E | Fast / A-Weighting', fill=(140, 170, 210, 255), font=font_mono)
draw.text((vf_x0 + 16, hud_y0 + 78), 'SHA-256: 8a92f...c701 | SOUNDTEST.PRO Local Evidence', fill=(100, 220, 160, 255), font=font_mono)
draw.text((c1_x0 + 16, card_y1 - 48), 'Direct camera photo capture with burned-in telemetry, timestamp, and GPS.', fill=(160, 185, 215, 255), font=font_body)

# Card 2: PDF
c2_x0 = c1_x1 + 20
c2_x1 = c2_x0 + card_w
draw.rounded_rectangle([(c2_x0, card_y0), (c2_x1, card_y1)], radius=14, fill=(14, 20, 36, 255), outline=(50, 75, 125, 255), width=1)
draw.rounded_rectangle([(c2_x0 + 16, card_y0 + 16), (c2_x0 + 110, card_y0 + 38)], radius=6, fill=(30, 90, 80, 255))
draw.text((c2_x0 + 26, card_y0 + 20), 'PDF REPORT', fill=(100, 240, 200, 255), font=font_badge)
draw.text((c2_x0 + 16, card_y0 + 48), 'Formal Acoustic Dossier', fill=(255, 255, 255, 255), font=font_card_head)
pdf_x0, pdf_y0, pdf_x1, pdf_y1 = c2_x0 + 16, card_y0 + 86, c2_x1 - 16, card_y1 - 65
draw.rounded_rectangle([(pdf_x0, pdf_y0), (pdf_x1, pdf_y1)], radius=10, fill=(245, 247, 250, 255), outline=(200, 210, 225, 255))
draw.text((pdf_x0 + 18, pdf_y0 + 14), 'NOISE LOG & EVIDENCE REPORT', fill=(30, 45, 75, 255), font=font_body_bold)
draw.text((pdf_x0 + 18, pdf_y0 + 32), 'Case: Neighbor Impact Disturbance · Flat 4B', fill=(100, 115, 140, 255), font=font_mono)
draw.line([(pdf_x0 + 18, pdf_y0 + 48), (pdf_x1 - 18, pdf_y0 + 48)], fill=(210, 220, 235, 255), width=1)
stats_box = [(pdf_x0 + 18, pdf_y0 + 56), (pdf_x1 - 18, pdf_y0 + 115)]
draw.rounded_rectangle(stats_box, radius=6, fill=(235, 240, 248, 255))
draw.text((pdf_x0 + 26, pdf_y0 + 64), 'Metric Summary:', fill=(50, 70, 110, 255), font=font_body_bold)
draw.text((pdf_x0 + 26, pdf_y0 + 86), 'LAeq: 72.8 dB   Max: 88.5 dB   Min: 38.2 dB   L10: 79.4 dB', fill=(30, 40, 60, 255), font=font_mono)
draw.rectangle([(pdf_x0 + 18, pdf_y0 + 128), (pdf_x1 - 18, pdf_y0 + 200)], fill=(225, 232, 242, 255))
pts = []
for x in range(pdf_x0 + 26, pdf_x1 - 26, 12):
    y = pdf_y0 + 165 + int(18 * math.sin((x - pdf_x0)*0.1) * math.cos((x - pdf_x0)*0.04))
    pts.append((x, y))
if len(pts) > 1:
    draw.line(pts, fill=(50, 100, 200, 255), width=2)
draw.text((pdf_x0 + 26, pdf_y0 + 134), 'Decibel Time-History Chart (dBA)', fill=(80, 100, 130, 255), font=font_mono)
draw.text((pdf_x0 + 18, pdf_y0 + 215), 'Observer Notes: Recorded during night quiet hours (23:14)', fill=(90, 105, 130, 255), font=font_mono)
draw.text((pdf_x0 + 18, pdf_y0 + 235), 'Verification Hash: 8f4e2...d99a | Exported 100% locally', fill=(50, 130, 90, 255), font=font_mono)
draw.text((c2_x0 + 16, card_y1 - 48), 'Structured PDF ready for landlords, property management, or legal advisers.', fill=(160, 185, 215, 255), font=font_body)

# Card 3: CSV & JSON
c3_x0 = c2_x1 + 20
c3_x1 = c3_x0 + card_w
draw.rounded_rectangle([(c3_x0, card_y0), (c3_x1, card_y1)], radius=14, fill=(14, 20, 36, 255), outline=(50, 75, 125, 255), width=1)
draw.rounded_rectangle([(c3_x0 + 16, card_y0 + 16), (c3_x0 + 110, card_y0 + 38)], radius=6, fill=(80, 50, 110, 255))
draw.text((c3_x0 + 26, card_y0 + 20), 'RAW DATA', fill=(220, 160, 255, 255), font=font_badge)
draw.text((c3_x0 + 16, card_y0 + 48), 'CSV & Cryptographic Hashes', fill=(255, 255, 255, 255), font=font_card_head)
term_x0, term_y0, term_x1, term_y1 = c3_x0 + 16, card_y0 + 86, c3_x1 - 16, card_y1 - 65
draw.rounded_rectangle([(term_x0, term_y0), (term_x1, term_y1)], radius=10, fill=(6, 10, 20, 255), outline=(40, 60, 100, 255))
lines = [
    '# SOUNDTEST.PRO RAW TELEMETRY LOG',
    'timestamp,LAeq,peak_dB,min_dB,L10,L90,lat,lon',
    '2026-09-06T22:15:00,72.4,85.2,40.1,78.2,46.0,39.9,116.4',
    '2026-09-06T22:15:10,74.1,87.0,41.2,79.5,47.1,39.9,116.4',
    '2026-09-06T22:15:20,78.9,91.4,42.0,84.1,49.5,39.9,116.4',
    '2026-09-06T22:15:30,71.0,82.3,39.8,76.4,45.2,39.9,116.4',
    '',
    '{ "manifest_version": "2.4",',
    '  "evidence_id": "ev_89d31f2a4",',
    '  "weighting": "A_WEIGHTING",',
    '  "device_env": "WebAudio / 48kHz",',
    '  "sha256_hash": "c792ef84a1d604..." }'
]
ty = term_y0 + 14
for line in lines:
    col = (100, 220, 150, 255) if line.startswith('#') or 'sha256' in line else (170, 195, 230, 255)
    if 'timestamp' in line:
        col = (255, 200, 100, 255)
    draw.text((term_x0 + 14, ty), line, fill=col, font=font_mono)
    ty += 18
draw.text((c3_x0 + 16, card_y1 - 48), 'Granular second-by-second numerical series and immutable cryptographic manifest hashes.', fill=(160, 185, 215, 255), font=font_body)

out_path = r'assets/images/acoustic_evidence_samples.webp'
img.save(out_path, 'WEBP', quality=88, method=6)
print(f'Successfully generated {out_path} ({os.path.getsize(out_path)} bytes)')
