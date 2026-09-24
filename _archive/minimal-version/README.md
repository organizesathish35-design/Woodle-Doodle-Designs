# Woodle Doodle Designs · Sumouli Dutta

A soft, calm, minimal portfolio rebuilt around the structure and content of woodledoodledesigns.com.

| Page | What's on it |
|---|---|
| `index.html` | Hero with her studio artwork, brands she's worked with, "What I make" (4 services), favourite pieces, WDD Art Club, workshop testimonials, press |
| `work.html` | All projects with filters (Children's books · Custom illustrations · Invitations · Brand work) and a lightbox; brand collaborations. Link straight to a filter with `work.html#books`, `#custom`, `#invites` or `#brands` |
| `learn.html` | WDD Art Club (₹1000/month, perks, billing), how it works, live workshops (100+ held, 500+ artists, topics), testimonials, subscribe |
| `about.html` | Portrait and bio, what she does, studio artwork, brands, press features |
| `contact.html` | Email, studio, hours, socials, and a form that opens the visitor's mail app addressed to woodledoodlepage@gmail.com |

## How it's built

- Plain HTML + one stylesheet (`assets/css/site.css`) + one script (`assets/js/site.js`). No build step.
- **Images** are Sumouli's own, loaded from her Wix media library (`static.wixstatic.com`) at the right size for each screen (responsive `srcset`, modern formats, lazy loading). Watermark-protected images on her site were deliberately left out.
- **Motion** (the vanilla-JS engine behind Framer Motion) for soft fade-and-rise reveals, gentle image parallax, the brand marquee, testimonials, gallery filtering and the lightbox.
- **Seamless page changes** use the browser's built-in View Transitions (a soft cross-fade), with no extra script.
- **Lenis** smooth scrolling on capable desktops; low-power devices (≤4 cores, <4 GB RAM, Data Saver, reduced motion) automatically get native scrolling and no parallax.

## Before going live

- If her Wix site is ever taken down, the images will stop loading. Save local copies into `assets/img/` and point the image URLs at them.
- The "Subscribe" button links to her current Wix subscribe page. Swap it for her newsletter link if that moves.

## Editing content

Page content (text, image list, testimonials, press, brands) lives in `tools/build.py`. Edit it, then run `python tools/build.py` to regenerate the five HTML pages. Styles and behaviour are in `assets/css/site.css` and `assets/js/site.js`.
