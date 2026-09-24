# Woodle Doodle Designs — website for Sumouli Dutta

The design is one rainy bus route: every page is a "stop", with brush-stroke page changes, a route-map menu and hand-drawn details. The content is Sumouli's real brand, taken from woodledoodledesigns.com and her Instagram.

| # | Page | What it says |
|---|---|---|
| 01 | `index.html` — Home | Hero → who I am & what we do at WDD → four service cards (Brand Collaborations, Customised Illustrations, WDD Art Club, Custom Invitation Cards) → sketchbook of my work → brands I loved working with → footer |
| 02 | `work.html` — My Projects | A few favourites on the clothesline, then the full gallery of 33 pieces with category filters and a lightbox. Deep links: `#books`, `#custom`, `#invites`, `#brands` |
| 03 | `club.html` — WDD Art Club | ₹1000/month membership ticket, the 8 member perks, how it works & billing, a note from Sumouli |
| 04 | `learn.html` — Workshops | 100+ workshops, 500+ artists; workshop topics as tear-off tickets; real student reviews; this month's plan |
| 05 | `featured.html` — Featured At | 7 press features pinned to a board, each linking to the real article |
| 06 | `about.html` — About | Her bio, a flip-through diary of what she does and who she draws for, her Instagram card, sticker board |
| 07 | `contact.html` — Contact | Airmail letter that folds into a paper plane; email, studio, hours and socials |

## Her real details used

- **Email:** woodledoodlepage@gmail.com · **Studio:** Kolkata, India · **Hours:** Mon–Fri, 9 AM – 7 PM IST
- **Brands:** Netflix, WhatsApp, Google, Facebook, Amazon, Cadbury, Snapchat and more
- **Links:** [Instagram](https://www.instagram.com/woodledoodledesigns/) · [learning platform](https://learn.woodledoodledesigns.com)

## Logo

Her Woodle Doodle Designs logo is traced to vector at `assets/logo.svg`, so it stays sharp at any size. It's used in the nav, the footer, the browser tab icon (`assets/favicon.svg`, on her coral red) and the loading screen.

On the loading screen the logo draws itself: each letter's outline is inked in, left to right across the three lines, the fill washes in behind it, and a paper plane loops past as it finishes. The paths are grouped `wl-woodle` / `wl-doodle` / `wl-designs` and each carries a `--i` index that sets its turn in the sequence (see `.loader-logo` in `assets/css/base.css`).

To re-trace from a new logo file, run `python tools/trace-logo.py` — it reads the logo PNG, follows the shapes, groups them into rows and writes `assets/logo.svg`. Set the `SRC` path at the top of that file first.

## Artwork

All 33 pieces are Sumouli's own, loaded from her Wix media library at the right size for each screen. The list lives in `WORK` in `assets/js/art.js`; the 8 framed pieces on the clothesline and home table are in `PIECES` in the same file. Watermark-protected images on her site were left out.

If her Wix site ever goes offline the images stop loading — save local copies into `assets/art/` and point the URLs there.

## Animation & performance

- **Motion** (motion.dev, Framer Motion for plain JavaScript) drives the spring reveals, scroll-linked parallax, the clothesline, the lightbox, marquees and the paper-plane flight.
- **Lite mode** switches on automatically for low-power devices, or if the first seconds run below ~38fps: lighter rain, native scrolling, no cursor trail. Add `?lite` to any URL to preview it.
- **Touch tier.** A modern phone reports plenty of cores and memory, so it never qualified for lite mode and ended up running the full desktop-weight rain on a screen where fill-rate is the scarce thing. `core.js` now also sets a `touch` flag from `(pointer: coarse)`, and `cheap = lite || touch` is what the heavy loops check: the rain renders at 1x pixel ratio, with 45% of the drops, no splashes, and on every other frame. Desktop is untouched — `touch` is false in any mouse-driven browser.
- **`assets/css/mobile.css`** carries the small-screen polish and is linked *last* on all seven pages, after each page's own stylesheet, so its rules actually win the cascade. Every rule sits inside `max-width: 900px` or `pointer: coarse`, so laptop and desktop rendering is byte-for-byte what it was. It covers:
  - `svh` instead of `vh` for every full-height section, so nothing shifts mid-scroll when the address bar slides away;
  - `env(safe-area-inset-*)` padding so the nav clears the notch and the footer, toasts and HUDs clear the home bar;
  - 44–58px hit areas on the tools, the route button and every button;
  - `overscroll-behavior` so a swipe inside the route menu or the lightbox can't drag the page behind it, and swiping past the end of the sketchbook can't trigger the browser's back gesture;
  - no horizontal overhang — the process steps fade rather than slide in, and the angled card sections clip, which is what kept `work.html` from rendering the whole page zoomed out;
  - lighter paint: one drop-shadow per sticker instead of a stack, idle cloud/sun loops off, hover-only transitions off.
- **Scroll reach.** The projects clothesline needed about four screens of scrolling to walk end to end on a phone; on touch it now maps the same line onto 70% of that distance, so one swipe carries you meaningfully further along it.
- Measured at 390x844 with 6x CPU throttling, a full-page scroll of all seven pages holds a 16.7ms median and 16.8ms p95 — a locked 60fps, with the only dropped frames at first paint.

## Run locally

`python -m http.server 5173` inside this folder, then open http://localhost:5173.

`_archive/minimal-version/` holds an earlier minimal redesign, kept for reference only. It isn't linked from the site.
