# Traces the Woodle Doodle Designs logo PNG into a clean SVG,
# grouped into its three rows so each can be animated on its own.
import cv2, numpy as np
from PIL import Image

SRC = (r"C:/Users/Admin/AppData/Local/Temp/claude/"
       r"C--Users-Admin-AppData-Roaming-Claude-scratch-workspaces-ac14c2f2-8e4d-42e9-bf52-43775b0fb763-"
       r"b6982b92-2423-4e56-bd06-affb64e1b5e1-scratch-2026-09-23-4f5c6c/adaee645-c05f-4092-9b0e-607f2c48f105/images/5.png")
OUT = r"E:/portfolio website/Client works/Woodle Doodle Designs/assets/logo.svg"

S = 4  # upscale before tracing, for smoother contours
im = Image.open(SRC).convert('RGBA')
a = np.array(im)[:, :, 3]
ys, xs = np.where(a > 40)
x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
a = a[y0:y1, x0:x1]
H0, W0 = a.shape
big = cv2.resize(a, (W0 * S, H0 * S), interpolation=cv2.INTER_LANCZOS4)
_, bw = cv2.threshold(big, 128, 255, cv2.THRESH_BINARY)

cnts, hier = cv2.findContours(bw, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
hier = hier[0]

def to_path(c):
    c = cv2.approxPolyDP(c, 1.1, True).reshape(-1, 2).astype(float) / S
    if len(c) < 3:
        return None, None
    pts = [f"{x:.2f} {y:.2f}" for x, y in c]
    return "M" + "L".join(pts) + "Z", c

# outer shapes with their holes
shapes = []
for i, c in enumerate(cnts):
    if hier[i][3] != -1:          # a hole: attached to its parent below
        continue
    if cv2.contourArea(c) < 20 * S * S:
        continue
    d, pts = to_path(c)
    if not d:
        continue
    hgt = pts[:, 1].max() - pts[:, 1].min()
    holes = []
    j = hier[i][2]
    while j != -1:
        if cv2.contourArea(cnts[j]) > 8 * S * S:
            hd, _ = to_path(cnts[j])
            if hd:
                holes.append(hd)
        j = hier[j][0]
    shapes.append({'d': d + ''.join(holes), 'cy': pts[:, 1].mean(), 'cx': pts[:, 0].mean(), 'h': hgt})

# group into the three rows by vertical position
shapes.sort(key=lambda s: s['cy'])
rows, cur = [], [shapes[0]]
for s in shapes[1:]:
    if s['cy'] - cur[-1]['cy'] > H0 * 0.13:
        rows.append(cur); cur = [s]
    else:
        cur.append(s)
rows.append(cur)

# stray marks (the dot above the O) join the nearest proper row
big_rows = [r for r in rows if len(r) >= 3]
for r in rows:
    if r in big_rows:
        continue
    cy = sum(s['cy'] for s in r) / len(r)
    near = min(big_rows, key=lambda b: abs(sum(s['cy'] for s in b) / len(b) - cy))
    near.extend(r)
rows = big_rows
for r in rows:
    r.sort(key=lambda s: s['cx'])      # left to right, so it draws like handwriting

names = ['woodle', 'doodle', 'designs']
parts, i = [], 0
for n, r in enumerate(rows):
    name = names[n] if n < len(names) else f'row{n}'
    paths = ''
    for s in r:
        # --i runs across the whole logo so it draws letter by letter, like handwriting
        paths += f'<path style="--i:{i}" pathLength="100" d="{s["d"]}"/>'
        i += 1
    parts.append(f'<g class="wl-{name}" data-row="{n}">{paths}</g>')

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W0} {H0}" '
       f'fill="currentColor" fill-rule="evenodd" role="img" aria-label="Woodle Doodle Designs">'
       + ''.join(parts) + '</svg>')
open(OUT, 'w', encoding='utf-8').write(svg)
print('rows:', [len(r) for r in rows], 'viewBox:', W0, H0, 'bytes:', len(svg))
