# Builds the five static pages for the Woodle Doodle Designs site.
# Edit content here, then run:  python tools/build.py
import os, html as H

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # the site folder

# key: (wix id, ext, width, height) — all images are Sumouli's own, served from her Wix media library
IMG = {
    'studio':   ('dfe700e7e2c748f09592ac5960778e86', 'jpg', 1000, 740),
    'logo':     ('7374d73859e84e9e9d83c0d65451cde1', 'png', 1000, 1000),
    'portrait': ('03fbf73d430844bc84e6f94aeb0a9325', 'png', 1000, 1000),
    'club':     ('972202cc11764e95bbd46e1a0660661b', 'png', 1000, 562),
    'splash':   ('56a8ef677ba449a4adb2874c2550c4f5', 'jpg', 1000, 810),
    'wedding':  ('3b48d66333814b229621474e8cc9f1d9', 'jpg', 587, 1000),
    'goddess':  ('f3f8697155b14a99bf29a0c179ef540b', 'jpg', 904, 1000),
    'hug':      ('eb3c98319fc940b896692f70f2ecec71', 'jpg', 810, 1000),
    'diwali':   ('6c0f990d59814192b238f7e9418244fc', 'jpg', 1000, 1000),
    'b_who':    ('27b31ff26c734b02a81d50ba2672bd03', 'png', 1000, 1000),
    'b_stink':  ('5c80cb3460d141a98796559056556d05', 'jpg', 1000, 1000),
    'b_echo':   ('8af558337c1041a6ad2a3ded7ae336f0', 'png', 1000, 750),
    'b_xmas':   ('9e1df5eff5e345cf97be6b5a462d3a6d', 'jpg', 750, 1000),
    'b_hulo':   ('72a0c3e451e241ec8e4689cf3625c5ac', 'jpeg', 1000, 568),
    'b_bagh':   ('38506548c979441ca441249e6bc8053f', 'png', 1000, 1000),
    'b_ruskin': ('0f8f413805594fc49d6d70659651f1d2', 'jpg', 1000, 1000),
    'b_day':    ('234efa5d6bc241a793dfe3b7579df359', 'jpg', 1000, 500),
    'c_floral': ('349d94aa38594a5f9acf6e26fcaf134a', 'png', 1000, 1000),
    'c_yellow': ('32ae382833534b388d6157fd9ef50e45', 'jpg', 1000, 1000),
    'c_family': ('2601f2992aff4c55a78ddd47fd00fbf6', 'jpg', 707, 1000),
    'c_happy':  ('a432d5f5d220492fafe348cfb37e5fd7', 'jpg', 800, 1000),
    'c_boat':   ('4b5b6346e1584f02ba2e59faab94b539', 'jpg', 1000, 1000),
    'c_mrmrs':  ('79f90ce5b026471582f7a53e4759bc5b', 'jpg', 706, 1000),
    'c_bee':    ('f8460d735b0b4beba2848f4e78972dd6', 'jpg', 664, 1000),
    'c_famwed': ('3f2c6ebb6e1b47ab9f796bbd2fa8853c', 'jpg', 1000, 664),
    'c_dog':    ('8d421f503f344c3a8f1f55e90f29c47d', 'jpg', 1000, 1000),
    'c_night':  ('2de6d26b97324b99b0040bbbe50fe1d4', 'jpg', 750, 1000),
    'c_airport':('12c292fb3d234268a2e508715e2f8544', 'jpg', 857, 1000),
    'i_date':   ('970c4aeb05d84d8dabc3f291d27299f3', 'jpg', 857, 1000),
    'i_rick':   ('2019d92c4c8b4268aa4776368488c9ad', 'jpg', 857, 1000),
    'i_invite': ('1fe361d7337a4d06a7d505d6bf177d85', 'jpg', 1000, 664),
    'i_swetha': ('9c4eaee87a4a412db1b6f6993a018a0f', 'png', 1000, 1000),
    'r_baby':   ('4e9cbf49fd794f78bcd727934b14a863', 'jpg', 1000, 1000),
    'r_about':  ('1fa1fed4f399418d95b83e1e7d5cf6ae', 'png', 766, 1000),
    'r_real':   ('f6f66a475c3d43d8a6300e257e7f17fc', 'png', 766, 1000),
    'r_awe':    ('d6e06efeb6d441b1bd4bb4ec9d1d880a', 'jpg', 838, 1000),
    'r_ein':    ('3296f9f73e02493996bece7851b07e6b', 'jpg', 838, 1000),
}

def url(key, w, ratio=None, mode='fill'):
    h, ext, W, Hh = IMG[key]
    r = ratio or W / Hh
    return f"https://static.wixstatic.com/media/5dfe12_{h}~mv2.{ext}/v1/{mode}/w_{w},h_{round(w / r)},al_c,q_85,enc_auto/{h}.{ext}"

def img(key, alt, sizes='100vw', ratio=None, widths=(480, 800, 1200), eager=False, parallax=None, cls=''):
    h, ext, W, Hh = IMG[key]
    r = ratio or W / Hh
    mid = widths[min(1, len(widths) - 1)]
    srcset = ', '.join(f"{url(key, w, r)} {w}w" for w in widths)
    extra = ' fetchpriority="high"' if eager else ' loading="lazy"'
    if parallax: extra += f' data-parallax="{parallax}"'
    if cls: extra += f' class="{cls}"'
    return (f'<img src="{url(key, mid, r)}" srcset="{srcset}" sizes="{sizes}" width="{mid}" height="{round(mid / r)}" '
            f'alt="{H.escape(alt)}" decoding="async"{extra}>')

LOGO = url('logo', 240, 1.22)
LEARN = 'https://learn.woodledoodledesigns.com'
IG = 'https://www.instagram.com/woodledoodledesigns/'
FB = 'https://www.facebook.com/woodledoodledesigns/'
YT = 'https://www.youtube.com/channel/UCVokX0wIXTc6x-5HHUboJKw'
EMAIL = 'woodledoodlepage@gmail.com'
EXT = 'target="_blank" rel="noopener"'

BRANDS = ['Netflix', 'WhatsApp', 'Google', 'Facebook', 'Amazon', 'Cadbury', 'Snapchat', 'Times of India', 'Volvo',
          'Himalaya', 'Kotak Insurance', 'Fab India', 'Zara', 'Benefit India', 'Bajaj Finance', 'The Better India',
          'Plum', 'Voot', 'Naturals Ice Cream', 'Saathi Pads']

PAGES = [('index.html', 'Home'), ('work.html', 'Projects'), ('learn.html', 'Workshops & Art Club'), ('about.html', 'About')]

def head(title, desc, page):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#ffffff">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{url('studio', 1200, 1200 / 630)}">
<link rel="icon" href="{url('logo', 96, 1)}">
<link rel="preconnect" href="https://static.wixstatic.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500..700&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Outfit:wght@300..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body data-page="{page}">
'''

def nav(page):
    links = ''.join(f'<a href="{f}"{" aria-current=\"page\"" if f == page else ""}>{H.escape(n)}</a>' for f, n in PAGES)
    mlinks = links + f'<a href="contact.html"{" aria-current=\"page\"" if page == "contact.html" else ""}>Contact</a>'
    return f'''
<header class="nav" id="nav">
  <div class="nav-in">
    <a class="brand" href="index.html" aria-label="Woodle Doodle Designs, home"><img src="{LOGO}" width="76" height="62" alt="Woodle Doodle Designs"></a>
    <nav class="links" aria-label="Main">{links}</nav>
    <a class="btn btn-dark nav-cta" href="contact.html">Let’s talk</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
  </div>
</header>
<div class="menu" id="menu" hidden>
  <nav aria-label="Menu">{mlinks}</nav>
  <div class="menu-foot"><a href="mailto:{EMAIL}">{EMAIL}</a><a href="{IG}" {EXT}>Instagram ↗</a><a href="{LEARN}" {EXT}>Learn ↗</a></div>
</div>
<main>
'''

def cta(title='Have a story that needs <em>pictures?</em>', text='Custom portraits, picture books, invitations or a brand campaign: tell me a little about your idea and let’s make something lovely together.', primary=('contact.html', 'Start a project'), secondary=(f'mailto:{EMAIL}', 'Email me')):
    return f'''
  <section class="section tight">
    <div class="wrap">
      <div class="cta" data-reveal>
        <span class="spark" style="left:8%;top:18%">✦</span><span class="spark" style="right:10%;bottom:20%">✦</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <div class="btn-row"><a class="btn btn-dark" href="{primary[0]}">{primary[1]} <span class="arr">→</span></a><a class="btn btn-light" href="{secondary[0]}">{secondary[1]}</a></div>
      </div>
    </div>
  </section>
'''

def foot():
    return f'''</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="index.html" aria-label="Woodle Doodle Designs, home"><img src="{LOGO}" width="92" height="75" alt="Woodle Doodle Designs" loading="lazy"></a>
        <p class="foot-motto">Wonder more. Draw better.<br>Design freely.</p>
      </div>
      <div><h4>Explore</h4><ul><li><a href="index.html">Home</a></li><li><a href="work.html">Projects</a></li><li><a href="learn.html">Workshops &amp; Art Club</a></li><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div><h4>Projects</h4><ul><li><a href="work.html#books">Children’s books</a></li><li><a href="work.html#custom">Custom illustrations</a></li><li><a href="work.html#invites">Invitations</a></li><li><a href="work.html#brands">Brand work</a></li></ul></div>
      <div><h4>Say hi</h4><ul><li><a href="mailto:{EMAIL}">Email</a></li><li><a href="{IG}" {EXT}>Instagram</a></li><li><a href="{FB}" {EXT}>Facebook</a></li><li><a href="{YT}" {EXT}>YouTube</a></li></ul></div>
    </div>
    <div class="foot-bottom"><span>© <span data-year>2026</span> Woodle Doodle Designs · Sumouli Dutta · Kolkata, India</span><a class="to-top link" href="#top">Back to top ↑</a></div>
  </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/motion@13.4.1/dist/motion.js"></script>
<script src="assets/js/site.js"></script>
</body>
</html>
'''

TESTIMONIALS = [
    ('Apeksha', 'Loved the course!! So compact yet informative. The part which I appreciated the most apart from tips and tricks was that Sumouli was so honest about her pricing!'),
    ('Rahul Patil', 'It’s astonishing how much information you can give in such a short time. Keep going!'),
    ('Shweta Suren', 'I love the way Sumouli has taught all the minute details while creating portraits and also she has given the tips of Procreate. The best doodle artist I have come across.'),
    ('Priyanshi Joshi', 'The session was very helpful. It covered most of my doubts regarding illustrating a children’s book. I can vouch for it.'),
    ('P Aplinder Kaur', 'The course was so detailed and helpful. As an aspiring artist, I got to learn a lot of things that I need to take care of in the journey of being an artist.'),
]

PRESS = [
    ('ScoopWhoop', 'This Instagram account about being a single desi girl will speak to you on a personal level', 'https://www.scoopwhoop.com/women/this-instagram-account-about-being-a-single-desi-girl-will-speak-to-you-on-a-personal-level/'),
    ('Creative Gaga', 'Feature: Sumouli Dutta', 'https://www.creativegaga.com/sumouli-dutta/'),
    ('Weekend Trivia', 'Getting to know illustrator artist Sumouli Dutta', 'https://weekendtrivia.com/getting-to-know-illustrator-artist-sumouli-dutta-woodledoodledesigns/'),
    ('Stoned Santa', 'Deciphering doodles with Sumouli Dutta', 'https://www.stonedsanta.in/blog/deciphering-doodles-with-sumouli-dutta/'),
    ('Shivin Creations', 'Sumouli Dutta, founder of Woodle Doodle Designs', 'https://shivincreations.com/2018/03/07/sumouli-dutta-founder-of-woodle-doodle-designs/'),
    ('Eat My News', 'Earning will follow you if you are able to make quality work', 'https://www.eatmy.news/2020/09/earning-will-follow-you-if-you-are-able.html'),
    ('The Talented Indian', 'Tales of worlds that she makes glow', 'https://www.thetalentedindian.com/tales-of-worlds-that-she-makes-glow-sumouli-dutta/'),
]

# ================================================================== HOME
def home():
    marquee = ''.join(f'<span>{b}</span>' for b in BRANDS) * 2
    fave = lambda key, title, tag, ratio=None, sizes='(max-width: 900px) 50vw, 30vw': f'''<figure class="fave" data-reveal>
            <div class="frame">{img(key, title, sizes, ratio)}</div>
            <figcaption><b>{title}</b><span>{tag}</span></figcaption>
          </figure>'''
    card = lambda href, key, alt, title, text: f'''<a class="card" href="{href}" data-reveal>
          <div class="frame">{img(key, alt, '(max-width: 560px) 50vw, (max-width: 1080px) 45vw, 25vw', 4 / 4.6, (400, 640, 900))}</div>
          <h3>{title}</h3><p>{text}</p><span class="link">Check my work <span class="arr">→</span></span>
        </a>'''
    quotes = ''.join(f'''<figure class="quote"><span class="qmark" aria-hidden="true">“</span><blockquote>{H.escape(q)}</blockquote><figcaption><b>{n}</b> · workshop student</figcaption></figure>''' for n, q in TESTIMONIALS)
    press = ''.join(f'<a href="{u}" {EXT}>{n}</a>' for n, t, u in PRESS)
    return head('Woodle Doodle Designs · Illustrations by Sumouli Dutta',
                'Illustrator Sumouli Dutta from Kolkata, India: children’s books, custom illustrations, invitations and brand collaborations. Wonder more. Draw better. Design freely.', 'home') + nav('index.html') + f'''
  <section class="hero" id="top">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="hello hand" data-reveal>Hey! I’m Sumouli ✏️</p>
        <h1 data-reveal style="--d:.08">Illustrations that feel like a <em>warm hug.</em></h1>
        <p class="lead" data-reveal style="--d:.16">I’m an illustrator from Kolkata, India, and the founder of Woodle Doodle Designs. I draw children’s books, custom portraits, invitations and stories for brands, with lots of colour and a little bit of magic.</p>
        <div class="btn-row" data-reveal style="--d:.24"><a class="btn btn-dark" href="work.html">See my work <span class="arr">→</span></a><a class="btn btn-soft" href="learn.html">Join the Art Club</a></div>
        <div class="stats" data-reveal style="--d:.32">
          <div class="stat"><b>327K</b><span>friends on Instagram</span></div>
          <div class="stat"><b>100+</b><span>live workshops</span></div>
          <div class="stat"><b>500+</b><span>artists taught</span></div>
        </div>
      </div>
      <div class="hero-art" data-reveal="img" style="--d:.1">
        <div class="frame">{img('studio', 'Sumouli’s illustration of an artist drawing at her desk in a cosy, lamp-lit studio', '(max-width: 900px) 100vw, 55vw', 4 / 3.3, (640, 1000, 1400, 1800), eager=True, parallax=24)}</div>
        <div class="hero-note"><i>📍</i><span>Kolkata, India · Founder, WDD</span></div>
        <a class="badge" href="learn.html" aria-label="Join the WDD Art Club">
          <svg viewBox="0 0 100 100" aria-hidden="true"><defs><path id="ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><text font-size="9.4" letter-spacing="2.2" fill="#596274" font-family="Outfit, sans-serif"><textPath href="#ring">WDD ART CLUB ✦ JOIN THE CLUB ✦</textPath></text></svg>
          <b aria-hidden="true">✏️</b>
        </a>
      </div>
    </div>
  </section>

  <div class="brands" aria-label="Brands Sumouli has worked with">
    <p>Brands I’ve worked with</p>
    <div class="marquee" aria-hidden="true">{marquee}</div>
    <p class="sr-only">{", ".join(BRANDS)}</p>
  </div>

  <section class="section">
    <div class="wrap">
      <div class="head" data-reveal>
        <span class="eyebrow">What I make</span>
        <h2>Little worlds, made <span class="u">just for you.</span></h2>
      </div>
      <div class="cards" data-stagger>
        {card('work.html#custom', 'c_yellow', 'Custom illustrated portrait of a smiling couple on a yellow background', 'Custom illustrations', 'Portraits of you, your people and your pets, for gifts, walls and keepsakes.')}
        {card('work.html#books', 'b_who', 'Illustration of a boy flying a little plane over a city, from a children’s book', 'Children’s books', 'Picture books and covers full of colour, in English and Bengali.')}
        {card('work.html#invites', 'hug', 'Illustrated couple embracing, made for an invitation card', 'Invitation cards', 'Illustrated save-the-dates and wedding invitations your guests will keep.')}
        {card('work.html#brands', 'splash', 'Illustration of a happy boy leaping into a river', 'Brand collaborations', 'Campaigns, stickers, packaging, murals and merchandise for brands.')}
      </div>
    </div>
  </section>

  <section class="section tint-mist">
    <div class="wrap">
      <div class="head-row">
        <div class="head" data-reveal><span class="eyebrow">A few favourites</span><h2>Pieces I keep <em>coming back to.</em></h2></div>
        <a class="link" href="work.html" data-reveal>View all projects <span class="arr">→</span></a>
      </div>
      <div class="faves">
        <div class="col">{fave('wedding', 'Wedding portrait', 'Custom')}</div>
        <div class="col">{fave('goddess', 'Festive illustration', 'Illustration')}{fave('diwali', 'WhatsApp Diwali stickers', 'Brand work')}</div>
        <div class="col">{fave('b_echo', 'Echo and Shadow', 'Children’s book')}{fave('c_dog', 'Pet portrait', 'Custom')}</div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="club">
        <div data-reveal>
          <span class="eyebrow">WDD Art Club</span>
          <h2>An art club that feels like <em>home.</em></h2>
          <p class="lead" style="margin-top:1rem">A cosy community for budding artists, built to make learning art more affordable. Join for ₹1000 a month and cancel any time.</p>
          <ul class="ticks">
            <li>Live workshops every month</li>
            <li>In-depth and step-by-step tutorials</li>
            <li>Brushes, palettes and other digital goodies</li>
            <li>A friendly community of artists</li>
          </ul>
          <div class="btn-row"><a class="btn btn-dark" href="{LEARN}" {EXT}>Join the Art Club <span class="arr">↗</span></a><a class="btn btn-light" href="learn.html">How it works</a></div>
        </div>
        <div class="frame" data-reveal="img">{img('club', 'WDD Art Club: learn art at an affordable price', '(max-width: 900px) 100vw, 50vw', 16 / 9.5)}</div>
      </div>
    </div>
  </section>

  <section class="section tint-mist">
    <div class="wrap">
      <div class="head center" data-reveal><span class="eyebrow">Kind words</span><h2>From the workshop <em>family.</em></h2></div>
      <div class="quotes" data-reveal>{quotes}<div class="dots"></div></div>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap">
      <div class="head center" data-reveal style="margin-bottom:28px"><span class="eyebrow">Featured in</span></div>
      <div class="press" data-reveal>{press}</div>
    </div>
  </section>
''' + cta() + foot()

# ================================================================== PROJECTS
WORK = [
    ('b_who', 'Who Will I Be?', 'books'), ('b_echo', 'Echo and Shadow', 'books'), ('b_xmas', 'The Muslim Girl Who Loved Christmas', 'books'),
    ('b_stink', 'Stink Series', 'books'), ('b_hulo', 'হুলো বিড়াল আর টুলো বিড়াল', 'books'), ('b_bagh', 'আমার বাঘমামাই', 'books'),
    ('b_ruskin', 'Tales From My Heart, Ruskin Bond', 'books'), ('b_day', 'Day and night, a picture-book spread', 'books'),
    ('wedding', 'Wedding portrait', 'custom'), ('c_floral', 'Couple portrait in bloom', 'custom'), ('c_yellow', 'Couple portrait', 'custom'),
    ('c_family', 'Family memories', 'custom'), ('c_happy', 'Happiness is…', 'custom'), ('c_boat', 'On the river', 'custom'),
    ('c_mrmrs', 'Mr & Mrs', 'custom'), ('c_bee', 'Bumble to my bee', 'custom'), ('c_famwed', 'Family wedding', 'custom'),
    ('c_dog', 'Pet portrait', 'custom'), ('c_night', 'Wedding night', 'custom'), ('c_airport', 'Kolkata airport', 'custom'),
    ('goddess', 'Festive illustration', 'custom'),
    ('hug', 'Invitation illustration', 'invites'), ('i_date', 'Save the date', 'invites'), ('i_rick', 'Rick & Shikha, save the date', 'invites'),
    ('i_invite', 'Wedding invitation', 'invites'), ('i_swetha', 'Swetha & Rakesh', 'invites'),
    ('splash', 'Brand collaboration', 'brands'), ('diwali', 'WhatsApp Diwali stickers', 'brands'), ('r_baby', 'Baby hero sticker set', 'brands'),
    ('r_about', 'All about you, for Livogen', 'brands'), ('r_real', 'Reality, for Livogen', 'brands'), ('r_awe', 'I’m awesome and I know it', 'brands'),
    ('r_ein', 'I am the future Einstein', 'brands'),
]
CATS = [('all', 'All'), ('books', 'Children’s books'), ('custom', 'Custom illustrations'), ('invites', 'Invitations'), ('brands', 'Brand work')]
LABEL = {'books': 'Children’s book', 'custom': 'Custom illustration', 'invites': 'Invitation', 'brands': 'Brand work'}

def work():
    counts = {c: sum(1 for w in WORK if c == 'all' or w[2] == c) for c, _ in CATS}
    filters = ''.join(f'<button type="button" data-filter="{c}" aria-pressed="{str(c == "all").lower()}">{n}<sup>{counts[c]}</sup></button>' for c, n in CATS)
    items = ''
    for key, title, cat in WORK:
        items += f'''<button class="item" type="button" data-cat="{cat}" data-title="{H.escape(title)}" data-label="{LABEL[cat]}" data-full="{url(key, 1600, None, 'fit')}" aria-label="Open {H.escape(title)}">
          <div class="frame">{img(key, title, '(max-width: 900px) 50vw, 33vw', None, (400, 700, 1000))}</div>
          <span class="cap"><b>{H.escape(title)}</b><span>{LABEL[cat]}</span></span>
        </button>'''
    cloud = ''.join(f'<span class="chip">{b}</span>' for b in BRANDS)
    return head('Projects · Woodle Doodle Designs', 'Children’s books, custom illustrations, invitation cards and brand collaborations by illustrator Sumouli Dutta.', 'work') + nav('work.html') + f'''
  <section class="page-head" id="top">
    <div class="wrap">
      <span class="eyebrow" data-reveal>My projects</span>
      <h1 data-reveal style="--d:.08">Stories I’ve had the joy of <em>drawing.</em></h1>
      <p class="lead" data-reveal style="--d:.16">Children’s books, custom portraits and wedding invitations, plus work for brands: product packaging, logos, wall murals, calendars, social media posts, T-shirts and merchandise. Here are a few for you to enjoy!</p>
    </div>
  </section>

  <section class="section tight" style="padding-top:10px">
    <div class="wrap">
      <div class="filters" role="group" aria-label="Filter projects" data-reveal>{filters}</div>
      <div class="grid">{items}</div>
    </div>
  </section>

  <section class="section tint-mist">
    <div class="wrap split">
      <div data-reveal>
        <span class="eyebrow">Collaboration &amp; promotion</span>
        <h2>Brands I’ve shared a <span class="u">story</span> with.</h2>
        <p class="lead" style="margin-top:1.1rem">I’ve been lucky to work with some amazing brands on promotions for social media, packaging and campaigns, from global names to much-loved Indian favourites.</p>
      </div>
      <div class="brand-cloud" data-reveal style="--d:.1">{cloud}<span class="chip">and many more ✦</span></div>
    </div>
  </section>

  <div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Artwork viewer" hidden>
    <div class="lb-stage"><img id="lbImg" alt=""></div>
    <div class="lb-bar">
      <div><b id="lbTitle"></b><span id="lbCat"></span></div>
      <div class="lb-btns"><button type="button" data-prev aria-label="Previous">←</button><button type="button" data-next aria-label="Next">→</button><button type="button" data-close aria-label="Close">✕</button></div>
    </div>
  </div>
''' + cta('Want your story <em>drawn?</em>') + foot()

# ================================================================== LEARN
def learn():
    tcards = ''.join(f'<figure class="t-card" data-reveal><blockquote>“{H.escape(q)}”</blockquote><figcaption><b>{n}</b> · workshop student</figcaption></figure>' for n, q in TESTIMONIALS)
    topics = ''.join(f'<span class="chip">{t}</span>' for t in ['Character design', 'Light & shadow', 'Children’s book illustration', 'Procreate light study', 'Ambience', 'Procreate for beginners', 'Semi-realistic portraits', 'Stylization', 'Character drawing', 'Invoices & T&C for artists'])
    return head('Workshops & Art Club · Woodle Doodle Designs', 'Live art workshops and the WDD Art Club by illustrator Sumouli Dutta: tutorials, brushes, community and more from ₹1000 a month.', 'learn') + nav('learn.html') + f'''
  <section class="page-head" id="top">
    <div class="wrap">
      <span class="eyebrow" data-reveal>Workshops &amp; Art Club</span>
      <h1 data-reveal style="--d:.08">Making art feel <em>affordable</em> and a little magical.</h1>
      <p class="lead" data-reveal style="--d:.16">Alongside my own work, I run a learning platform for budding artists: live workshops every month, and an Art Club where we learn, share and grow together.</p>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap club-grid">
      <div class="price-card" data-reveal>
        <span class="eyebrow">WDD Art Club</span>
        <h2>Join the club</h2>
        <p class="price" style="margin:1.4rem 0 .6rem">₹1000 <small>/ month</small></p>
        <p>Join anytime, change your membership anytime and cancel anytime. You’re billed on the day you join, then monthly on that same date.</p>
        <a class="btn btn-dark" href="{LEARN}" {EXT}>Become a member <span class="arr">↗</span></a>
      </div>
      <div class="perks" data-reveal style="--d:.1">
        <h3>What you’ll find inside</h3>
        <ul class="ticks">
          <li>Live workshops every month</li><li>In-depth tutorial videos</li><li>Step-by-step tutorials</li><li>Quick tips and learning tricks</li>
          <li>Real-time process videos</li><li>Brushes, palettes and digital merch</li><li>Chances to work on live projects</li><li>A community of artists</li>
        </ul>
        <p style="margin:1.4rem 0 0;font-size:.95rem">Plus my sketchbook feed, draw-with-me videos, sneak peeks, layered PSD files and studio vlogs.</p>
      </div>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap">
      <div class="steps" data-stagger>
        <div class="step" data-reveal><h3>Join in a minute</h3><p>Pick your membership on the learning platform. No long forms, no fuss.</p></div>
        <div class="step" data-reveal><h3>Learn live</h3><p>Monthly live workshops plus tutorials you can watch at your own pace.</p></div>
        <div class="step" data-reveal><h3>Grow together</h3><p>Share your work and keep going with a warm community of artists.</p></div>
      </div>
    </div>
  </section>

  <section class="section tint-mist">
    <div class="wrap split">
      <div data-reveal>
        <span class="eyebrow">Live workshops</span>
        <h2>Learn it live, <em>together.</em></h2>
        <p class="lead" style="margin-top:1.1rem">We organise workshops every month for artists at every stage, from first sketches to professional practice.</p>
        <div class="big-stats"><div><b>100+</b><span>workshops held</span></div><div><b>500+</b><span>artists taught</span></div></div>
      </div>
      <div data-reveal style="--d:.1">
        <h3 style="margin-bottom:1.1rem">Topics we’ve covered</h3>
        <div class="topics">{topics}</div>
        <p style="margin-top:2rem"><a class="btn btn-dark" href="{LEARN}" {EXT}>See upcoming workshops <span class="arr">↗</span></a></p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="head center" data-reveal><span class="eyebrow">Kind words</span><h2>What students <em>say.</em></h2></div>
      <div class="t-grid">{tcards}</div>
    </div>
  </section>
''' + cta('Stay in the <em>know.</em>', 'New workshops, Art Club news and little art tips, straight to your inbox.', ('https://www.woodledoodledesigns.com/testimonial', 'Subscribe for updates ↗'), (LEARN, 'Visit the learning platform')) + foot()

# ================================================================== ABOUT
def about():
    cloud = ''.join(f'<span class="chip">{b}</span>' for b in BRANDS)
    press = ''.join(f'<li><a href="{u}" {EXT}><b>{n}</b><span>{H.escape(t)}</span><em>Read ↗</em></a></li>' for n, t, u in PRESS)
    return head('About · Woodle Doodle Designs', 'Meet Sumouli Dutta, illustrator from Kolkata and founder of Woodle Doodle Designs.', 'about') + nav('about.html') + f'''
  <section class="page-head" id="top">
    <div class="wrap about-grid">
      <div class="portrait" data-reveal="img"><div class="frame">{img('portrait', 'Portrait of Sumouli Dutta surrounded by illustrated flowers', '(max-width: 900px) 90vw, 40vw', 1, (480, 800, 1000))}</div></div>
      <div>
        <span class="eyebrow" data-reveal>About me</span>
        <h1 data-reveal style="--d:.08">Hello! My name is <em>Sumouli.</em></h1>
        <p class="lead" data-reveal style="--d:.16">I’m an illustrator and digital artist from India with a degree in art, and the founder of Woodle Doodle Designs. I’ve illustrated children’s books, drawn storyboards and created art for brands: packaging design, promotions, wall murals, merchandise and more.</p>
        <p data-reveal style="--d:.22">I also run a learning platform for budding artists, with one simple vision: to make learning art more affordable.</p>
        <p class="sign" data-reveal style="--d:.28">Love, Sumouli ✏️</p>
      </div>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap">
      <div class="does" data-stagger>
        <div class="do" data-reveal><i>📚</i><h3>Children’s books</h3><p>Covers and picture books that make little readers linger on every page.</p></div>
        <div class="do" data-reveal><i>🎨</i><h3>Digital illustration</h3><p>Warm, colourful portraits and scenes, made to order.</p></div>
        <div class="do" data-reveal><i>🎬</i><h3>Storyboarding</h3><p>Turning ideas into frames that tell the story clearly.</p></div>
        <div class="do" data-reveal><i>✨</i><h3>Art for brands</h3><p>Packaging, promotions, wall murals and merchandise.</p></div>
      </div>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap">
      <figure class="band" data-reveal="img" style="margin:0">
        <div class="frame">{img('studio', 'Illustrated artist’s studio with warm lamps, plants and sketches', '100vw', 21 / 9, (800, 1400, 2000), parallax=30)}</div>
        <figcaption>the studio, where the magic (and the mess) happens</figcaption>
      </figure>
    </div>
  </section>

  <section class="section tint-mist">
    <div class="wrap split">
      <div data-reveal><span class="eyebrow">Brands</span><h2>Some of the lovely teams I’ve <em>worked with.</em></h2></div>
      <div class="brand-cloud" data-reveal style="--d:.1">{cloud}<span class="chip">and many more ✦</span></div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="head" data-reveal><span class="eyebrow">In the press</span><h2>Kind stories <em>about the work.</em></h2></div>
      <ul class="press-list" data-reveal>{press}</ul>
    </div>
  </section>
''' + cta() + foot()

# ================================================================== CONTACT
def contact():
    return head('Contact · Woodle Doodle Designs', 'Get in touch with illustrator Sumouli Dutta for custom illustrations, children’s books, invitations, brand collaborations and workshops.', 'contact') + nav('contact.html') + f'''
  <section class="page-head" id="top">
    <div class="wrap contact-grid">
      <div>
        <span class="eyebrow" data-reveal>Contact</span>
        <h1 data-reveal style="--d:.08">Let’s make something <em>lovely</em> together.</h1>
        <p class="lead" data-reveal style="--d:.16">Custom portraits, book projects, invitations, brand collaborations or workshops. Tell me a little about your idea and I’ll get back to you.</p>
        <ul class="info" data-reveal style="--d:.24">
          <li><i>✉️</i><div><small>Email</small><a href="mailto:{EMAIL}">{EMAIL}</a></div></li>
          <li><i>📍</i><div><small>Studio</small><span>Kolkata, India</span></div></li>
          <li><i>🕘</i><div><small>Hours</small><span>Monday to Friday, 9:00 AM to 7:00 PM IST</span></div></li>
        </ul>
        <div class="socials" data-reveal style="--d:.3"><a class="chip" href="{IG}" {EXT}>Instagram ↗</a><a class="chip" href="{FB}" {EXT}>Facebook ↗</a><a class="chip" href="{YT}" {EXT}>YouTube ↗</a><a class="chip" href="{LEARN}" {EXT}>Learning platform ↗</a></div>
      </div>
      <form class="form" id="contactForm" novalidate data-reveal style="--d:.12">
        <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-type">I’d love to talk about</label>
          <select id="f-type" name="type"><option>A custom illustration</option><option>A children’s book</option><option>An invitation card</option><option>A brand collaboration</option><option>Workshops or the Art Club</option><option>Just saying hi</option></select></div>
        <div class="field"><label for="f-msg">Your idea</label><textarea id="f-msg" name="message" required placeholder="Tell me about the story, the people in it, and when you’d like it…"></textarea></div>
        <p class="form-note" role="alert"></p>
        <p class="form-ok" hidden>Thank you! Your email app should open with your note ready to send. If it doesn’t, write to <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
        <div><button class="btn btn-dark" type="submit">Send my note <span class="arr">→</span></button></div>
      </form>
    </div>
  </section>
''' + foot()

for name, fn in [('index.html', home), ('work.html', work), ('learn.html', learn), ('about.html', about), ('contact.html', contact)]:
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        f.write(fn())
print('built')
