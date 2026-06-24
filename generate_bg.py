#!/usr/bin/env python3
"""Generate 8 clean background images (no text, no emoji) for career path professions."""

from PIL import Image, ImageDraw, ImageFilter
import math, random, os

outdir = "/home/hermes/projects/career-path-landing/public/backgrounds"
os.makedirs(outdir, exist_ok=True)

images = {
    "software-dev.jpg": ("#1e3a5f", "#2563eb"),  # blue
    "doctor.jpg":       ("#5f1e1e", "#dc2626"),    # red
    "designer.jpg":     ("#3b1e5f", "#7c3aed"),    # purple
    "engineer.jpg":     ("#5f3b1e", "#d97706"),    # orange
    "marketer.jpg":     ("#1e5f4f", "#0d9488"),    # teal
    "analyst.jpg":      ("#1e3a5f", "#3b82f6"),    # blue (different accent)
    "energy.jpg":       ("#1e5f2e", "#16a34a"),    # green
    "creator.jpg":      ("#5f1e4f", "#d946ef"),    # pink
}

for fname, (bg_hex, accent_hex) in images.items():
    path = os.path.join(outdir, fname)
    w, h = 1600, 500

    bg = Image.new("RGBA", (w, h), bg_hex)
    draw_bg = ImageDraw.Draw(bg, "RGBA")

    # Parse accent color
    ar, ag, ab = int(accent_hex[1:3], 16), int(accent_hex[3:5], 16), int(accent_hex[5:7], 16)
    br, bg_r, bb = int(bg_hex[1:3], 16), int(bg_hex[3:5], 16), int(bg_hex[5:7], 16)

    random.seed(fname)

    # 1) Large gradient circles (soft, overlapping)
    for i in range(15):
        cx = random.randint(-100, w + 100)
        cy = random.randint(-100, h + 100)
        r = random.randint(100, 400)
        alpha = random.randint(20, 60)
        draw_bg.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=(ar, ag, ab, alpha))

    # 2) Wave lines
    for i in range(8):
        base_y = random.randint(30, h - 30)
        points = []
        for x in range(0, w + 20, 10):
            y = base_y + int(math.sin(x / 60 + i * 0.9) * 25 + random.randint(-8, 8))
            points.append((x, y))
        alpha = random.randint(15, 40)
        line_color = (ar, ag, ab, alpha)
        for j in range(len(points) - 1):
            draw_bg.line([points[j], points[j + 1]],
                         fill=line_color, width=random.randint(1, 4))

    # 3) Geometric shapes (rectangles and triangles)
    for i in range(10):
        x = random.randint(0, w)
        y = random.randint(0, h)
        size = random.randint(20, 120)
        alpha = random.randint(15, 45)
        color = (ar, ag, ab, alpha)
        if random.random() > 0.5:
            draw_bg.rectangle([x, y, x + size, y + size],
                              outline=color, width=random.randint(1, 3))
        else:
            draw_bg.polygon([(x, y - size),
                             (x - size // 2, y + size // 2),
                             (x + size // 2, y + size // 2)],
                            outline=color, width=random.randint(1, 3))

    # 4) Small dots
    for i in range(60):
        x = random.randint(0, w)
        y = random.randint(0, h)
        r = random.randint(2, 6)
        alpha = random.randint(20, 50)
        draw_bg.ellipse([x - r, y - r, x + r, y + r],
                        fill=(ar, ag, ab, alpha))

    # 5) Vignette overlay (dark edges)
    vignette = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw_v = ImageDraw.Draw(vignette, "RGBA")
    for x in range(w):
        for y in range(h):
            dx = min(x, w - x) / (w / 2)
            dy = min(y, h - y) / (h / 2)
            d = min(dx, dy)
            alpha = int(180 * (1 - d))
            if alpha > 0:
                draw_v.point((x, y), (0, 0, 0, alpha))

    bg = Image.alpha_composite(bg, vignette)

    # 6) Convert to RGB + slight blur
    final = bg.convert("RGB")
    final = final.filter(ImageFilter.GaussianBlur(radius=2))
    final.save(path, quality=90, optimize=True)
    print(f"Created {path} ({os.path.getsize(path)} bytes)")

print("All backgrounds generated successfully!")
