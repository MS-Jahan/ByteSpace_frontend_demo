#!/usr/bin/env python3
"""Strip the baked drop-shadow from the two portrait PNGs.

The Figma exports carry a soft shadow inside the raster; the design draws its own
shadow (CSS drop-shadow on the wrapper), so the baked one shows as a hard-edged
haze. We keep only pixels within 6px of the fully opaque silhouette.
Run: python3 scripts/make-cutouts.py  (needs Pillow + numpy)
"""
import hashlib, json, os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public')
JOBS = [('home-image-eb157cb563', 'growth-person'), ('home-image-7be5f04241', 'create-person')]
os.makedirs(f'{ROOT}/assets/cutouts', exist_ok=True)
derived = {}
for src, name in JOBS:
    im = Image.open(f'{ROOT}/assets/{src}.png').convert('RGBA')
    a = np.array(im)[..., 3]
    solid = Image.fromarray(((a >= 250) * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(13))
    arr = np.array(im)
    arr[..., 3] = np.where(np.array(solid) > 0, a, 0)
    out = f'{ROOT}/assets/cutouts/{name}.png'
    Image.fromarray(arr).save(out, optimize=True)
    data = open(out, 'rb').read()
    derived[name] = {'file': f'cutouts/{name}.png', 'from': f'{src}.png', 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
mp = f'{ROOT}/assets-manifest.json'
m = json.load(open(mp))
m.setdefault('derived', {}).update(derived)
json.dump(m, open(mp, 'w'), indent=2)
print(json.dumps(derived, indent=1))
