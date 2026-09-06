import os
from PIL import Image, ImageDraw, ImageFont

src_path = r'assets/images/noise_detection_app.webp'
im = Image.open(src_path).convert('RGBA')
draw = ImageDraw.Draw(im)

font_badge = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 16)
font_title = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 26)
font_sub = ImageFont.truetype(r'C:\Windows\Fonts\segoeui.ttf', 16)
font_mono = ImageFont.truetype(r'C:\Windows\Fonts\arial.ttf', 14)

# Glassmorphism badge overlay in top-right or bottom-left
W, H = im.size
b_x0, b_y0, b_x1, b_y1 = 48, H - 160, 680, H - 48

# Overlay backdrop
overlay = Image.new('RGBA', im.size, (0, 0, 0, 0))
ov_draw = ImageDraw.Draw(overlay)
ov_draw.rounded_rectangle([(b_x0, b_y0), (b_x1, b_y1)], radius=16, fill=(10, 16, 32, 220), outline=(60, 90, 160, 240), width=2)
im = Image.alpha_composite(im, overlay)
draw = ImageDraw.Draw(im)

# Badge pill
draw.rounded_rectangle([(b_x0 + 20, b_y0 + 16), (b_x0 + 180, b_y0 + 40)], radius=6, fill=(35, 75, 140, 255))
draw.text((b_x0 + 30, b_y0 + 20), 'WORKPLACE AUDIT', fill=(150, 205, 255, 255), font=font_badge)

draw.text((b_x0 + 20, b_y0 + 50), 'Facility & Industrial Noise Inspection', fill=(255, 255, 255, 255), font=font_title)
draw.text((b_x0 + 20, b_y0 + 82), 'OSHA 85 dBA Threshold Check · Equipment Room, Factory & Office dB Logs', fill=(160, 190, 230, 255), font=font_sub)

out_path = r'assets/images/workplace_noise_inspection.webp'
im.save(out_path, 'WEBP', quality=85, method=6)
print(f'Successfully generated {out_path} ({os.path.getsize(out_path)} bytes)')
