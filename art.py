#!/usr/bin/env python3
"""Build the artwork layer: art/photo/*.jpg (preferred) or art/raw/*.jpg + art/src/*.svg  ->  art.js

Rasters are resized to a banner-friendly width and re-encoded as JPEG, then
inlined as data URIs so the app never makes a network request for an image
(the single-file build has none available anyway). Vector scenes stay SVG.

  python3 art.py  ->  art.js  (window.GLOWUP_ART)
"""
import base64
import io
import json
import os
import re

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "art", "raw")
PHOTO = os.path.join(HERE, "art", "photo")
SRC = os.path.join(HERE, "art", "src")
OUT = os.path.join(HERE, "art.js")

# id -> (file, width). Banners render at ~390-768 CSS px wide, so 640 is plenty
# at 2x for the card strips and still sharp for the hero on a phone.
RASTERS = [
    ("hero", "hero.jpg", 720),
    ("fat-loss", "fat-loss.jpg", 640),
    ("muscle", "muscle.jpg", 640),
    ("nutrition", "nutrition.jpg", 640),
    ("fasting", "fasting.jpg", 640),
    ("appetite", "appetite.jpg", 640),
    ("sleep", "sleep.jpg", 640),
    ("mens-health", "mens-health.jpg", 640),
    ("skin", "skin.jpg", 640),
    ("supplements", "supplements.jpg", 640),
    ("foundations", "foundations.jpg", 640),
    ("maintenance", "maintenance.jpg", 640),
    ("meals", "meals.jpg", 640),
    # Round 6: food-group plates (64 px square thumbs + group banner)
    ("protein", "group-protein.jpg", 420),
    ("carb", "group-carb.jpg", 420),
    ("vegetable", "group-vegetable.jpg", 420),
    ("fruit", "group-fruit.jpg", 420),
    ("articles", "articles.jpg", 560),
    # Round 6: one photograph per meal template
    ("meal-breakfast-default", "meal-eggs.jpg", 480),
    ("meal-breakfast-overnight", "meal-oats.jpg", 480),
    ("meal-lunch-chicken-rice", "meal-chicken-rice.jpg", 480),
    ("meal-dinner-lentil-stew", "meal-lentil-stew.jpg", 480),
    ("meal-lunch-canned-fish", "meal-canned-fish.jpg", 480),
    # Round 8: deep-dive guide photography (one hero + one inline per page)
    ("guide-fasting-morning", "guide-fasting-morning.jpg", 640),
    ("guide-refeed-plate", "guide-refeed-plate.jpg", 640),
    ("guide-refeed-avoid", "guide-refeed-avoid.jpg", 640),
    ("guide-glucose", "guide-glucose.jpg", 640),
    ("guide-walk", "guide-walk.jpg", 640),
    ("guide-strength", "guide-strength.jpg", 640),
    ("guide-aging-active", "guide-aging-active.jpg", 640),
    ("guide-sunscreen", "guide-sunscreen.jpg", 640),
    ("guide-grooming", "guide-grooming.jpg", 640),
    ("guide-vegfirst", "guide-vegfirst.jpg", 640),
]

art = {}
credits = {}
report = []

# Photos take priority over illustrations when both exist for an id.
PHOTO_CREDIT = {
    "foundations": {"source": "Pexels", "url": "https://www.pexels.com/photo/33936499/"},
    "maintenance": {"source": "Unsplash", "url": "https://unsplash.com/s/photos/road-horizon"},
    "skin": {"source": "Pexels", "url": "https://www.pexels.com/search/hand%20cream/"},
}

for key, fname, width in RASTERS:
    path = os.path.join(PHOTO, fname)
    kind_dir = "photo"
    if not os.path.exists(path):
        path = os.path.join(RAW, fname)
        kind_dir = "raw"
    if not os.path.exists(path):
        print("missing art:", fname)
        continue
    im = Image.open(path).convert("RGB")
    w, h = im.size
    im = im.resize((width, round(h * width / w)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=68, optimize=True, progressive=True)
    data = buf.getvalue()
    art[key] = "data:image/jpeg;base64," + base64.b64encode(data).decode()
    report.append((key, kind_dir, im.size, len(data)))
    if key in PHOTO_CREDIT:
        credits[key] = PHOTO_CREDIT[key]

for fname in (sorted(os.listdir(SRC)) if os.path.isdir(SRC) else []):
    if not fname.endswith(".svg"):
        continue
    key = fname[:-4]
    if key in art:            # a photograph already claimed this slot
        continue
    with open(os.path.join(SRC, fname), encoding="utf-8") as fh:
        svg = fh.read()
    svg = re.sub(r">\s+<", "><", svg).strip()
    art[key] = "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()
    report.append((key, "svg", "-", len(svg)))

# alt text lives with the art so every <img> is describable
ALT = {
    "hero": "Photograph of a man walking up outdoor steps at golden hour",
    "library": "Illustration of a stack of research cards and a magnifier",
    "fat-loss": "Photograph of a measuring tape, bathroom scale and notebook",
    "muscle": "Photograph of a dumbbell on a dark gym floor",
    "nutrition": "Photograph of chicken, eggs, lentils and vegetables on a table",
    "fasting": "Photograph of a kitchen clock and an empty plate",
    "appetite": "Photograph of a bowl of lentil and vegetable soup",
    "sleep": "Photograph of a bedroom at night with a warm bedside lamp",
    "mens-health": "Photograph of a home blood-pressure monitor on a desk",
    "skin": "Photograph of hands applying cream from a tube",
    "supplements": "Photograph of unbranded supplement containers and a scoop",
    "maintenance": "Photograph of a lone figure on an empty road to the horizon",
    "meals": "Photograph of three meal-prep containers of balanced meals",
    "protein": "Photograph of a plated chicken breast fillet on a white plate",
    "carb": "Photograph of a bowl of cooked brown rice and oats on a white surface",
    "vegetable": "Photograph of a bowl of mixed green vegetables on a white surface",
    "fruit": "Photograph of berries and a sliced orange on a white surface",
    "articles": "Photograph of a stack of research papers and a pen on a desk",
    "meal-breakfast-default": "Photograph of scrambled eggs, yoghurt, oats and berries",
    "meal-breakfast-overnight": "Photograph of overnight oats in a glass jar with berries",
    "meal-lunch-chicken-rice": "Photograph of chicken, rice and green vegetables in a bowl",
    "meal-dinner-lentil-stew": "Photograph of a bowl of lentil and chickpea stew",
    "meal-lunch-canned-fish": "Photograph of canned fish with crackers and salad on a plate",
    "guide-fasting-morning": "Photograph of black coffee and a glass of water on a wooden table in morning light",
    "guide-refeed-plate": "Photograph of boiled eggs, cooked greens and lentil soup with a glass of water",
    "guide-refeed-avoid": "Photograph of fried pastries, sweet tea and dates on a wooden table",
    "guide-glucose": "Photograph of a blood glucose meter, lancet pen and a handwritten log book",
    "guide-walk": "Photograph of a man walking along a quiet street at golden hour, seen from behind",
    "guide-strength": "Photograph of resistance bands, a dumbbell and a rolled exercise mat on a wooden floor",
    "guide-aging-active": "Photograph of a fit man in his sixties jogging along a park path in the morning",
    "guide-sunscreen": "Photograph of a sunscreen tube and pump bottle on a bathroom shelf",
    "guide-grooming": "Photograph of a beard trimmer, comb and folded towel on a bathroom counter",
    "guide-vegfirst": "Photograph of a bowl of cooked vegetables, roasted carrots and grilled chicken",
}

ALIAS = {"library": "articles"}   # same photograph, stored once   # same photograph, stored once
payload = {"alt": ALT, "img": art, "credit": credits, "alias": ALIAS}
with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
    fh.write("/* GlowUp artwork — generated by art.py. Do not edit by hand. */\n")
    fh.write("window.GLOWUP_ART = " + json.dumps(payload, separators=(",", ":")) + ";\n")

total = os.path.getsize(OUT)
print("wrote art.js  %.0f KB across %d images" % (total / 1024, len(art)))
for key, kind, size, n in report:
    print("  %-14s %-4s %-10s %5.1f KB" % (key, kind, size, n / 1024))
