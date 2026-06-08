"""
Renders brand PWA icons (192, 512) to PNG, faithfully matching assets/icon.svg.

Design source: assets/icon.svg
  - 512x512 viewBox
  - rounded rect bg #070B14, radius 112 (21.875% — iOS app icon proportion)
  - outer ring: circle r=178 stroke #2AFFD4 width 18 opacity 0.32
  - sound wave zigzag path stroke #2AFFD4 width 28 round caps
  - center amber dot: circle r=36 fill #FFB520

Renders at 4x supersample, then downsample for clean antialiasing.
"""
from PIL import Image, ImageDraw
import os, math

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
os.makedirs(OUT_DIR, exist_ok=True)

# Brand palette (must match assets/icon.svg and :root in soundtest.html)
BG = (7, 11, 20, 255)            # #070B14
ACCENT = (42, 255, 212, 255)     # #2AFFD4
AMBER = (255, 181, 32, 255)      # #FFB520

SS = 4  # supersample factor


def draw_icon(size: int) -> Image.Image:
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img, "RGBA")

    # Geometry scaled to s (SVG viewBox is 512)
    f = s / 512.0
    def px(v): return v * f

    # 1) Rounded square background (iOS-style superellipse approximation = rounded rect)
    radius = int(px(112))
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=radius, fill=BG)

    # 2) Outer ring (mint, low opacity for "halo" effect)
    ring_r = px(178)
    ring_w = px(18)
    cx, cy = s / 2, s / 2
    d.ellipse(
        (cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r),
        outline=ACCENT, width=int(ring_w),
    )
    # Apply 0.32 opacity by drawing then alpha-blending with BG
    ring_layer = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(ring_layer).ellipse(
        (cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r),
        outline=ACCENT, width=int(ring_w),
    )
    # Fade alpha to 0.32 of original
    r, g, b, a = ring_layer.split()
    a = a.point(lambda p: int(p * 0.32))
    ring_layer = Image.merge("RGBA", (r, g, b, a))
    img = Image.alpha_composite(img, ring_layer)

    # 3) Sound wave zigzag path
    # SVG path: M92 276 h44 l42-116 62 216 50-146 34 72 28-52 h68
    wave_layer = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wave_layer)
    stroke = int(px(28))
    pts = [
        (92, 276), (136, 276),
        (178, 160), (240, 376),
        (290, 230), (324, 302),
        (352, 250), (420, 250),
    ]
    scaled = [(p[0] * f, p[1] * f) for p in pts]
    wd.line(scaled, fill=ACCENT, width=stroke, joint="curve")
    # round caps on endpoints
    for cap_pt in (scaled[0], scaled[-1]):
        wd.ellipse(
            (cap_pt[0] - stroke / 2, cap_pt[1] - stroke / 2,
             cap_pt[0] + stroke / 2, cap_pt[1] + stroke / 2),
            fill=ACCENT,
        )
    img = Image.alpha_composite(img, wave_layer)

    # 4) Center amber dot (measurement indicator)
    dot_r = px(36)
    d = ImageDraw.Draw(img)
    d.ellipse(
        (cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r),
        fill=AMBER,
    )

    # Downsample with high-quality filter
    final = img.resize((size, size), Image.LANCZOS)
    return final


def main():
    for size in (192, 512):
        out = draw_icon(size)
        path = os.path.join(OUT_DIR, f"icon-{size}.png")
        out.save(path, "PNG", optimize=True)
        size_kb = os.path.getsize(path) / 1024
        print(f"  OK {path}  ({size}x{size}, {size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
