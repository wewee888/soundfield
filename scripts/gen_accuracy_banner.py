import os, math
from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 680
img = Image.new('RGBA', (W, H), (8, 12, 24, 255))
draw = ImageDraw.Draw(img)

font_title = ImageFont.truetype(r'C:\Windows\Fonts\seguisb.ttf', 32)
font_sub = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 17)
font_card_head = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 19)
font_badge = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 12)
font_body = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 14)
font_body_bold = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 14)
font_mono = ImageFont.truetype(r'C:\Windows\Fonts\arial.ttf', 13)

# Outer border
draw.rounded_rectangle([(16, 16), (W-16, H-16)], radius=20, outline=(40, 56, 95, 255), width=2)

# Header
draw.text((48, 38), 'ACOUSTIC MEASUREMENT ENGINE & CALIBRATION ARCHITECTURE', fill=(255, 255, 255, 255), font=font_title)
draw.text((48, 80), 'Understanding the Web Audio API processing chain, frequency weighting curves, and device hardware tolerances', fill=(140, 165, 205, 255), font=font_sub)

draw.rounded_rectangle([(W-270, 40), (W-48, 76)], radius=8, fill=(35, 30, 65, 255), outline=(90, 80, 160, 255))
draw.text((W-254, 49), 'IEC 61672 BOUNDARY GUIDE', fill=(190, 170, 255, 255), font=font_badge)

card_y0, card_y1 = 120, H - 40
card_w = (W - 96 - 40) // 3

# ---- Panel 1: Frequency Weighting (A vs C vs Z) ----
p1_x0 = 48
p1_x1 = p1_x0 + card_w
draw.rounded_rectangle([(p1_x0, card_y0), (p1_x1, card_y1)], radius=14, fill=(14, 20, 36, 255), outline=(50, 75, 125, 255), width=1)
draw.rounded_rectangle([(p1_x0 + 16, card_y0 + 16), (p1_x0 + 125, card_y0 + 38)], radius=6, fill=(30, 70, 110, 255))
draw.text((p1_x0 + 24, card_y0 + 20), 'IEC CURVES', fill=(130, 200, 255, 255), font=font_badge)
draw.text((p1_x0 + 16, card_y0 + 48), 'Frequency Weighting', fill=(255, 255, 255, 255), font=font_card_head)

# Graph box
g_x0, g_y0, g_x1, g_y1 = p1_x0 + 16, card_y0 + 86, p1_x1 - 16, card_y1 - 65
draw.rounded_rectangle([(g_x0, g_y0), (g_x1, g_y1)], radius=10, fill=(18, 26, 46, 255), outline=(60, 85, 135, 255))

# Grid lines
for y in range(g_y0 + 30, g_y1 - 20, 40):
    draw.line([(g_x0 + 30, y), (g_x1 - 20, y)], fill=(30, 42, 70, 255), width=1)
for x in range(g_x0 + 60, g_x1 - 20, 70):
    draw.line([(x, g_y0 + 20), (x, g_y1 - 30)], fill=(30, 42, 70, 255), width=1)

# Axis labels
draw.text((g_x0 + 26, g_y1 - 24), '20Hz', fill=(100, 125, 160, 255), font=font_mono)
draw.text((g_x0 + 160, g_y1 - 24), '1kHz', fill=(100, 125, 160, 255), font=font_mono)
draw.text((g_x0 + 310, g_y1 - 24), '8kHz', fill=(100, 125, 160, 255), font=font_mono)
draw.text((g_x1 - 55, g_y1 - 24), '20kHz', fill=(100, 125, 160, 255), font=font_mono)

# Curve A (human ear response - attenuates lows and highs, peaks at 2.5kHz)
pts_a = []
for i in range(50):
    t = i / 49.0
    x = g_x0 + 35 + int(t * (g_x1 - g_x0 - 55))
    # A-weighting curve shape
    y = g_y0 + 75 + int(110 * math.exp(-3.5 * t) - 25 * math.sin(t * math.pi * 1.5) + (35 * t**2))
    pts_a.append((x, min(max(y, g_y0 + 25), g_y1 - 35)))
draw.line(pts_a, fill=(56, 239, 125, 255), width=3)

# Curve C (flatter across mid/low)
pts_c = []
for i in range(50):
    t = i / 49.0
    x = g_x0 + 35 + int(t * (g_x1 - g_x0 - 55))
    y = g_y0 + 55 + int(20 * math.exp(-4 * t) + 15 * (t**3))
    pts_c.append((x, min(max(y, g_y0 + 25), g_y1 - 35)))
draw.line(pts_c, fill=(56, 180, 255, 255), width=2)

# Legend
draw.line([(g_x0 + 30, g_y0 + 25), (g_x0 + 55, g_y0 + 25)], fill=(56, 239, 125, 255), width=3)
draw.text((g_x0 + 62, g_y0 + 18), 'A-weighting (dBA · Human ear)', fill=(180, 240, 200, 255), font=font_mono)
draw.line([(g_x0 + 30, g_y0 + 45), (g_x0 + 55, g_y0 + 45)], fill=(56, 180, 255, 255), width=2)
draw.text((g_x0 + 62, g_y0 + 38), 'C-weighting (dBC · Low freq bass)', fill=(160, 210, 255, 255), font=font_mono)

draw.text((p1_x0 + 16, card_y1 - 48), 'Browser-native biquad filter nodes accurately mimic standard IEC A/C weighting curves.', fill=(160, 185, 215, 255), font=font_body)

# ---- Panel 2: Signal Flow Chain ----
p2_x0 = p1_x1 + 20
p2_x1 = p2_x0 + card_w
draw.rounded_rectangle([(p2_x0, card_y0), (p2_x1, card_y1)], radius=14, fill=(14, 20, 36, 255), outline=(50, 75, 125, 255), width=1)
draw.rounded_rectangle([(p2_x0 + 16, card_y0 + 16), (p2_x0 + 135, card_y0 + 38)], radius=6, fill=(70, 50, 110, 255))
draw.text((p2_x0 + 24, card_y0 + 20), 'SIGNAL CHAIN', fill=(210, 175, 255, 255), font=font_badge)
draw.text((p2_x0 + 16, card_y0 + 48), 'Web Audio Processing', fill=(255, 255, 255, 255), font=font_card_head)

flow_y0 = card_y0 + 86
steps = [
    ('1. Acoustic Input', 'Physical sound waves enter smartphone microphone', (120, 150, 220)),
    ('2. AGC Bypass & WebAudio', 'echoCancellation:false, autoGainControl:false', (100, 200, 240)),
    ('3. Biquad Weighting Filter', 'IEC 61672 A-weighting IIR cascade filter', (140, 220, 160)),
    ('4. AnalyserNode & RMS', 'Time-domain windowing, Fast/Slow response, LAeq', (255, 200, 100)),
    ('5. Calibrated Decibels', 'Applies reference offset (default 0 dB civilian)', (255, 130, 130))
]

for idx, (head, desc, col) in enumerate(steps):
    sy0 = flow_y0 + idx * 56
    draw.rounded_rectangle([(p2_x0 + 16, sy0), (p2_x1 - 16, sy0 + 48)], radius=8, fill=(20, 28, 50, 255), outline=(col[0]//2, col[1]//2, col[2]//2, 200), width=1)
    draw.text((p2_x0 + 28, sy0 + 6), head, fill=col, font=font_body_bold)
    draw.text((p2_x0 + 28, sy0 + 26), desc, fill=(160, 185, 215, 255), font=font_mono)

draw.text((p2_x0 + 16, card_y1 - 48), 'Completely client-side DSP pipeline running without remote cloud latency or privacy exposure.', fill=(160, 185, 215, 255), font=font_body)

# ---- Panel 3: Calibration & Legal Boundaries ----
p3_x0 = p2_x1 + 20
p3_x1 = p3_x0 + card_w
draw.rounded_rectangle([(p3_x0, card_y0), (p3_x1, card_y1)], radius=14, fill=(14, 20, 36, 255), outline=(50, 75, 125, 255), width=1)
draw.rounded_rectangle([(p3_x0 + 16, card_y0 + 16), (p3_x0 + 140, card_y0 + 38)], radius=6, fill=(100, 40, 50, 255))
draw.text((p3_x0 + 24, card_y0 + 20), 'LEGAL NOTICE', fill=(255, 160, 170, 255), font=font_badge)
draw.text((p3_x0 + 16, card_y0 + 48), 'Accuracy Boundaries', fill=(255, 255, 255, 255), font=font_card_head)

p3_content_y0 = card_y0 + 86

# Comparison Table Box
draw.rounded_rectangle([(p3_x0 + 16, p3_content_y0), (p3_x1 - 16, p3_content_y0 + 140)], radius=8, fill=(20, 26, 46, 255), outline=(60, 75, 110, 255))
draw.text((p3_x0 + 26, p3_content_y0 + 12), 'Equipment Comparison:', fill=(255, 255, 255, 255), font=font_body_bold)
draw.text((p3_x0 + 26, p3_content_y0 + 36), '• Class 1 Certified Meter:  ±0.7 dB accuracy', fill=(100, 220, 160, 255), font=font_mono)
draw.text((p3_x0 + 26, p3_content_y0 + 58), '• Class 2 Field Meter:       ±1.4 dB accuracy', fill=(100, 200, 240, 255), font=font_mono)
draw.text((p3_x0 + 26, p3_content_y0 + 80), '• iPhone / Safari WebApp:    ±2.5 dB (calibrated)', fill=(255, 210, 110, 255), font=font_mono)
draw.text((p3_x0 + 26, p3_content_y0 + 102), '• Android / Mixed WebApp:    ±4 to 6 dB (uncalibrated)', fill=(255, 140, 140, 255), font=font_mono)

# Guidance notice
draw.rounded_rectangle([(p3_x0 + 16, p3_content_y0 + 150), (p3_x1 - 16, p3_content_y0 + 285)], radius=8, fill=(32, 20, 26, 255), outline=(120, 50, 60, 255))
draw.text((p3_x0 + 26, p3_content_y0 + 160), 'Defensible Usage Guidelines:', fill=(255, 180, 180, 255), font=font_body_bold)
draw.text((p3_x0 + 26, p3_content_y0 + 185), '1. Document repeated patterns across days', fill=(220, 190, 195, 255), font=font_mono)
draw.text((p3_x0 + 26, p3_content_y0 + 207), '2. Keep constant distance & room state', fill=(220, 190, 195, 255), font=font_mono)
draw.text((p3_x0 + 26, p3_content_y0 + 229), '3. Pair dB logs with timestamped photos', fill=(220, 190, 195, 255), font=font_mono)
draw.text((p3_x0 + 26, p3_content_y0 + 251), '4. Verify formal disputes with Class 1 meter', fill=(220, 190, 195, 255), font=font_mono)

draw.text((p3_x0 + 16, card_y1 - 48), 'Civilian reference and documentation aid only. Not certified for court litigation.', fill=(160, 185, 215, 255), font=font_body)

out_path = r'assets/images/microphone_calibration_test.webp'
img.save(out_path, 'WEBP', quality=88, method=6)
print(f'Successfully generated {out_path} ({os.path.getsize(out_path)} bytes)')
