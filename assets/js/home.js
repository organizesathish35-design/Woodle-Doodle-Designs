/* ==========================================================================
   Stop 01 — The Bus Stop
   Motion (Framer Motion's vanilla engine) handles the scroll-linked parallax,
   the spring letter drop, the marquee and the counter. Scroll-linked Motion
   animations run on the browser's compositor where supported, so they stay
   smooth even when the main thread is busy.
   ========================================================================== */
(() => {
  'use strict';
  const W = window.WDD, d = document, M = W.M;
  const { clamp, lerp } = W;

  /* ------------------------------------------------ hero: parallax scene */
  const hero = d.querySelector('.hero');
  const stage = d.getElementById('stage');
  const scene = d.getElementById('scene');
  const copy = d.querySelector('.hero-copy');
  const heroFoot = d.querySelector('.hero-foot');
  const heroVis = W.watch(hero, '0px');
  const layers = [...scene.querySelectorAll('.layer')].map(el => ({ el, depth: +el.dataset.depth || 0, drift: el.hasAttribute('data-drift') }));

  const rain = W.makeRain(d.getElementById('heroRain'), { density: 1.1, alpha: .62, splash: true, floor: .74 });

  // Scroll parallax. Rich devices: every depth plane moves on its own.
  // Lite devices: the whole scene moves as one layer (far less GPU memory).
  let stops = [];
  function setupScroll() {
    stops.forEach(fn => fn && fn());
    stops = [];
    layers.forEach(l => { l.el.style.transform = ''; });
    scene.style.transform = '';
    if (!M || W.reduce) return;
    const range = { target: hero, offset: ['start start', 'end end'] };
    const ride = (el, kf) => stops.push(M.scroll(M.animate(el, kf, { ease: 'linear' }), range));
    if (W.rich) layers.forEach(l => ride(l.el, { transform: ['translateY(0px)', `translateY(${(-l.depth * 150).toFixed(0)}px)`] }));
    else ride(scene, { transform: ['translateY(0px)', 'translateY(-70px)'] });
    ride(copy, { opacity: [1, 0, 0], transform: ['translateY(0px)', 'translateY(-170px)', 'translateY(-220px)'] });
    ride(heroFoot, { opacity: [1, 0, 0, 0], transform: ['translateY(0px)', 'translateY(60px)', 'translateY(60px)', 'translateY(60px)'] });
  }
  setupScroll();
  W.onLite(setupScroll);
  if (!M) W.onScroll(() => {   // fallback without Motion
    const p = W.sticky(hero);
    scene.style.transform = `translateY(${(-p * 70).toFixed(1)}px)`;
    copy.style.opacity = clamp(1 - p * 1.7);
    copy.style.transform = `translateY(${-p * 170}px)`;
    heroFoot.style.opacity = clamp(1 - p * 3);
  });

  // Mouse parallax: rich machines only, written to the separate `translate`
  // property so it never fights the scroll animation on `transform`.
  let mx = 0, my = 0, tx = 0, ty = 0;
  if (W.fine) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width * 2 - 1;
      my = (e.clientY - r.top) / r.height * 2 - 1;
    });
    stage.addEventListener('pointerleave', () => { mx = 0; my = 0; });
  }
  W.onFrame(() => {
    if (!W.rich || !heroVis.on) return;
    const nx = lerp(tx, mx, .06), ny = lerp(ty, my, .06);
    if (Math.abs(nx - tx) + Math.abs(ny - ty) < .0004) return;
    tx = nx; ty = ny;
    for (const l of layers) {
      if (l.drift) continue;
      l.el.style.translate = `${(-tx * l.depth * 46).toFixed(1)}px ${(-ty * l.depth * 20).toFixed(1)}px`;
    }
    if (rain) rain.targetWind = -.12 + tx * .3;
  });
  W.onLite(() => layers.forEach(l => { l.el.style.translate = ''; }));

  /* the title letters fall like raindrops (Motion springs), and jiggle when touched */
  const title = d.getElementById('heroTitle');
  const chars = [...W.splitChars(title)];
  W.whenReady(() => {
    if (M && !W.reduce) {
      M.animate(chars, { transform: ['translateY(-110vh) rotate(-24deg)', 'translateY(0vh) rotate(0deg)'] },
        { type: 'spring', bounce: .38, duration: 1.15, delay: M.stagger(.06, { startDelay: .1 }) });
    } else if (W.reduce) chars.forEach(c => { c.style.transform = 'none'; });
  });
  chars.forEach(ch => ch.addEventListener('pointerenter', () => {
    if (!M || !d.documentElement.classList.contains('ready')) return;
    M.animate(ch, { transform: ['translateY(0px) rotate(0deg)', 'translateY(-22px) rotate(-10deg)', 'translateY(0px) rotate(0deg)'] }, { duration: .55, ease: 'easeOut' });
  }));

  /* a paper plane on a lazy loop across the sky (lives in its own unfiltered layer) */
  const plane = d.getElementById('plane');
  const planePath = d.getElementById('planePath');
  const trail = d.querySelector('.plane-trail');
  const PL = planePath.getTotalLength();
  const LOOP = 17000;
  let skip = false;
  W.onFrame((y, v, t) => {
    if (W.reduce || !heroVis.on) return;
    if (W.cheap && (skip = !skip)) return;
    const dd = Math.min((t % LOOP) / LOOP * (PL + 500), PL);
    const a = planePath.getPointAtLength(dd), b = planePath.getPointAtLength(Math.min(PL, dd + 3));
    plane.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 57.2958).toFixed(1)})`);
    const seg = Math.min(dd, 300);
    trail.style.strokeDasharray = `${seg} ${PL + 600}`;
    trail.style.strokeDashoffset = -(dd - seg);
  });

  /* ------------------------------------------- hero: things you can poke */
  const lamp = scene.querySelector('.lamp');
  const cat = scene.querySelector('.cat');
  const girl = scene.querySelector('.girl');
  const sign = scene.querySelector('.sign-head');
  const retrigger = (el, cls, ms) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove(cls), ms); };

  lamp.addEventListener('click', () => {
    const off = scene.classList.toggle('lamp-off');
    W.sound.blip(off ? 300 : 700);
    W.toast(off ? 'click. goodnight, lamp.' : 'and there was light ✨');
  });
  cat.addEventListener('click', () => { retrigger(cat, 'meowing', 1800); W.sound.blip(980); });
  girl.addEventListener('click', () => { retrigger(girl, 'twirl', 1250); W.sound.blip(620); });
  sign.addEventListener('click', () => {
    retrigger(sign, 'ding', 1350);
    W.sound.bell();
    W.toast('Ding ding! The 327 is on its way 🚌');
  });

  /* puddles ripple where you tap */
  const ripples = d.getElementById('ripples');
  let rippled = false;
  stage.addEventListener('click', e => {
    if (e.target.closest('.lamp, .cat, .girl, .sign-head, a, button, .hero-title')) return;
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left, yy = e.clientY - r.top;
    if (yy < r.height * .66) return;
    for (let i = 0; i < (W.cheap ? 2 : 3); i++) {
      const s = d.createElement('span');
      s.className = 'ripple';
      s.style.left = x + 'px'; s.style.top = yy + 'px';
      s.style.setProperty('--d', (i * .18) + 's');
      ripples.appendChild(s);
      setTimeout(() => s.remove(), 2200);
    }
    W.sound.blip(420 + Math.random() * 200);
    if (!rippled) { rippled = true; W.toast('plip. plop. 💧'); }
  });

  /* ------------------------------------------------- story: word scrub */
  const story = d.getElementById('story');
  const scrub = d.getElementById('scrub');
  const words = [];
  (function split(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = d.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(' ')); return; }
          const s = d.createElement('span'); s.className = 'sw'; s.textContent = part;
          words.push(s); frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) split(n);
    });
  })(scrub);

  W.prepDraw(story);
  const doodles = [...story.querySelectorAll('.story-doodle')].map((svg, i) => ({
    start: .3 + i * .18, last: -1,
    paths: [...svg.querySelectorAll('[data-draw]')].map(p => ({ p, len: parseFloat(p.style.strokeDasharray) || 300 })),
  }));
  const storyVis = W.watch(story, '0px');
  let lit = -1;
  W.onScroll(() => {
    if (!storyVis.on) return;
    const p = W.sticky(story);
    const n = Math.round(clamp((p - .04) / .72) * words.length);
    if (n !== lit) {
      const lo = Math.min(n, lit < 0 ? 0 : lit), hi = Math.max(n, lit < 0 ? words.length : lit);
      for (let i = lo; i < hi; i++) words[i].classList.toggle('lit', i < n);
      lit = n;
    }
    doodles.forEach(dd => {
      const k = Math.round(clamp((p - dd.start) / .22) * 100) / 100;
      if (k === dd.last) return;
      dd.last = k;
      dd.paths.forEach(({ p: path, len }) => { path.style.strokeDashoffset = len * (1 - k); });
    });
  });

  /* ------------------------------------------- pillars: stacking cards */
  const pillars = [...d.querySelectorAll('.pillar')];
  const dims = pillars.map(p => { const s = d.createElement('span'); s.className = 'pillar-dim'; p.appendChild(s); return s; });
  const pillarsVis = W.watch(d.getElementById('pillars'), '0px');
  const lastK = pillars.map(() => -1);
  W.onScroll(() => {
    if (!pillarsVis.on) return;
    for (let i = 0; i < pillars.length - 1; i++) {
      const cur = pillars[i].getBoundingClientRect();
      const next = pillars[i + 1].getBoundingClientRect();
      const k = Math.round(clamp(1 - (next.top - cur.top) / (innerHeight * .75)) * 200) / 200;
      if (k === lastK[i]) continue;
      lastK[i] = k;
      pillars[i].style.transform = `scale(${(1 - k * .07).toFixed(4)})`;
      dims[i].style.opacity = (k * .3).toFixed(3);
    }
  });

  /* ------------------------ marquees: a Motion loop that speeds up with scroll */
  const loops = [...d.querySelectorAll('.marquee-track')].map((t, i) =>
    M && !W.reduce ? M.animate(t, { transform: i ? ['translateX(-50%)', 'translateX(0%)'] : ['translateX(0%)', 'translateX(-50%)'] },
      { duration: 30, repeat: Infinity, ease: 'linear' }) : null);
  let lastSpeed = 1;
  W.onScroll((y, v) => {
    const s = Math.round((v < -.5 ? -1 : 1) * (1 + Math.min(Math.abs(v) * .12, 6)) * 10) / 10;
    if (s === lastSpeed) return;
    lastSpeed = s;
    loops.forEach(a => { if (a) a.speed = s; });
  });

  /* ----------------------------------------- table: draggable polaroids */
  const top = d.getElementById('tableTop');
  const picks = [
    ['busstop', 20, 36, -8], ['lemon', 44, 60, 5], ['cat', 70, 34, -4], ['moon', 30, 74, 7], ['umbrellas', 80, 70, -6],
  ];
  let z = 10;
  picks.forEach(([key, x, y, r], i) => {
    const P = W.art.PIECES.find(p => p.key === key);
    const f = d.createElement('figure');
    f.className = 'polaroid drag';
    f.dataset.cursor = 'drag me';
    f.style.left = x + '%';
    f.style.top = y + '%';
    f.style.setProperty('--r', r + 'deg');
    f.style.setProperty('--d', (i * .13).toFixed(2));
    f.style.zIndex = ++z;
    f.innerHTML = `<span class="tape"></span><div class="pic">${W.art.svg(key, P.title)}</div><figcaption>${P.title}</figcaption>`;
    top.appendChild(f);
    makeDraggable(f, r);
  });

  function makeDraggable(el, baseR) {
    let sx, sy, ox = 0, oy = 0, rot = baseR, lastX = 0, dragging = false, raf = 0;
    const paint = () => {
      raf = 0;
      el.style.setProperty('--x', ox + 'px');
      el.style.setProperty('--y', oy + 'px');
      el.style.setProperty('--r', rot + 'deg');
    };
    el.addEventListener('pointerdown', e => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add('grab');
      el.style.zIndex = ++z;
      sx = e.clientX - ox; sy = e.clientY - oy; lastX = e.clientX;
      W.sound.blip(500);
    });
    el.addEventListener('pointermove', e => {
      if (!dragging) return;
      ox = e.clientX - sx; oy = e.clientY - sy;
      rot = clamp(rot + (e.clientX - lastX) * .25, baseR - 18, baseR + 18);
      lastX = e.clientX;
      if (!raf) raf = requestAnimationFrame(paint);   // one style write per frame, however fast the pointer
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('grab');
      baseR = clamp(rot * .6, -12, 12);
      rot = baseR;
      el.style.setProperty('--r', baseR + 'deg');
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  new IntersectionObserver(([e], o) => {
    if (e.isIntersecting) { top.classList.add('landed'); o.disconnect(); }
  }, { threshold: .25 }).observe(top);

  /* -------------------------------------------------- followers counter */
  const fol = d.getElementById('followers');
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    if (M && !W.reduce) M.animate(0, 327, { duration: 2.2, ease: [.16, 1, .3, 1], onUpdate: v => { fol.textContent = Math.round(v); } });
    else fol.textContent = 327;
  }, { threshold: .6 }).observe(fol);
})();
