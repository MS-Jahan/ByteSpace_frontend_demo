#!/usr/bin/env python3
"""Downscale the 2500px grey 3D renders used by Shape3D.

The largest one is drawn at 385 CSS px, so 800px covers 2x displays. Derivatives
are WebP with alpha and are recorded in the manifest's `derived` section.
Run: python3 scripts/make-renders.py  (needs Pillow with WebP support)
"""
import hashlib, json, os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public')
MAX = 800
SOURCES = ['home-home-92f21ffd63', 'home-home-a96322e3c1', 'home-home-021f81bfc4', 'home-home-f5b5a7e7fe', 'home-home-2b33854c48']
os.makedirs(f'{ROOT}/assets/renders', exist_ok=True)
derived = {}
for src in SOURCES:
    im = Image.open(f'{ROOT}/assets/{src}.png').convert('RGBA')
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    out = f'{ROOT}/assets/renders/{src}.webp'
    im.save(out, 'WEBP', quality=92, alpha_quality=100, method=6)
    data = open(out, 'rb').read()
    derived[f'render-{src}'] = {'file': f'renders/{src}.webp', 'from': f'{src}.png', 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
mp = f'{ROOT}/assets-manifest.json'
m = json.load(open(mp))
m.setdefault('derived', {}).update(derived)
json.dump(m, open(mp, 'w'), indent=2)
print(json.dumps(derived, indent=1))
