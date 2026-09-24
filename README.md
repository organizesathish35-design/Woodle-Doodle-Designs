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

## Run locally

`python -m http.server 5173` inside this folder, then open http://localhost:5173.

`_archive/minimal-version/` holds an earlier minimal redesign, kept for reference only. It isn't linked from the site.
