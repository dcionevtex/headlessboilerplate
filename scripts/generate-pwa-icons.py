"""
One-off generator for the PWA app icons in public/icons/.

Not part of the build — run manually (`python scripts/generate-pwa-icons.py`,
requires Pillow: `pip install pillow`) whenever the brand mark changes. Draws
a "C" monogram in white on the CIONE DIY wordmark's red (sampled from
public/images/cione_logo.png) — a solid-red tile reads far better in a home
screen grid / app drawer than the logo's actual white background would.
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
FONT_PATH = r"C:\Windows\Fonts\arialbd.ttf"  # any bold sans works

BG = (233, 61, 59, 255)     # sampled from the CIONE DIY wordmark in cione_logo.png
FG = (255, 255, 255, 255)   # white glyph on the brand red — a white-on-white icon
                             # (this template's header/background) has poor shelf
                             # presence in a home-screen grid or app drawer


def make_icon(size, safe_zone_ratio, filename):
    """safe_zone_ratio: glyph height as a fraction of the canvas. Use ~0.5
    for maskable icons (Android crops to a circle/squircle, so content must
    stay inside the inner ~80% safe zone) and ~0.6 for plain/apple icons."""
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    glyph = "C"
    font_size = int(size * safe_zone_ratio)
    font = ImageFont.truetype(FONT_PATH, font_size)

    bbox = draw.textbbox((0, 0), glyph, font=font)
    text_h = bbox[3] - bbox[1]
    while text_h > size * safe_zone_ratio and font_size > 10:
        font_size -= 4
        font = ImageFont.truetype(FONT_PATH, font_size)
        bbox = draw.textbbox((0, 0), glyph, font=font)
        text_h = bbox[3] - bbox[1]
    text_w = bbox[2] - bbox[0]

    x = (size - text_w) / 2 - bbox[0]
    y = (size - text_h) / 2 - bbox[1]
    draw.text((x, y), glyph, font=font, fill=FG)

    path = os.path.join(OUT_DIR, filename)
    img.convert("RGB").save(path, "PNG")
    print("wrote", path, img.size)


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    make_icon(512, 0.5, "icon-512-maskable.png")
    make_icon(192, 0.5, "icon-192-maskable.png")
    make_icon(512, 0.62, "icon-512.png")
    make_icon(192, 0.62, "icon-192.png")
    make_icon(180, 0.6, "apple-touch-icon.png")  # source for src/app/apple-icon.png
    print("done")
