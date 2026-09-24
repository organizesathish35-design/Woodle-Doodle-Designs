/* ==========================================================================
   Stop 02 — The Clothesline
   ========================================================================== */
(() => {
  'use strict';
  const W = window.WDD, d = document, M = W.M;
  const { clamp, lerp } = W;

  W.splitChars(d.getElementById('wTitle'));
  W.makeRain(d.getElementById('wRain'), { density: .3, alpha: .3, color: '70,90,200', speed: .75 });

  /* -------------------------------------------------- hang the washing */
  const line = d.getElementById('line');
  const track = d.getElementById('track');
  const rope = d.getElementById('rope');
  const ropePath = rope.querySelector('.rope-line');
  const posts = rope.querySelector('.posts');
  const endEl = track.querySelector('.line-end');
  const P = W.art.PIECES;

  const pieces = P.map((p, i) => {
    const f = d.createElement('figure');
    f.className = 'piece';
    f.style.setProperty('--dy', (Math.sin(i * 1.3) * 18).toFixed(1) + 'px');
    f.innerHTML = `<div class="piece-inner">
        <span class="peg" aria-hidden="true"></span>
        <button class="frame" type="button" data-cursor="take it down" aria-label="Open “${p.title}”"><div class="art">${W.art.svg(p.key, p.title)}</div></button>
        <figcaption class="tag"><span class="hand">${String(i + 1).padStart(2, '0')}</span>${p.title}</figcaption>
      </div>`;
    track.insertBefore(f, endEl);
    const piece = { el: f, inner: f.firstElementChild, frame: f.querySelector('.frame'), phase: Math.random() * 6.28, amp: 1.2 + Math.random() * 1.6, speed: .0008 + Math.random() * .0007, rot: 0 };
    piece.frame.addEventListener('click', () => openPiece(i));
    return piece;
  });

  let trackW = 0, span = 0;
  function layout() {
    trackW = track.scrollWidth;
    span = Math.max(0, trackW - innerWidth);
    line.style.height = (span + innerHeight) + 'px';
    const H = innerHeight;
    rope.setAttribute('width', trackW);
    rope.setAttribute('height', H);
    rope.setAttribute('viewBox', `0 0 ${trackW} ${H}`);
    const pts = pieces.map(p => [p.el.offsetLeft + p.el.offsetWidth / 2, p.el.offsetTop - 3]);
    const gap = pieces.length > 1 ? pts[1][0] - pts[0][0] : 300;
    const x0 = Math.max(24, pts[0][0] - gap * .9), y0 = pts[0][1] - 26;
    const last = pts[pts.length - 1];
    const x1 = last[0] + gap * .7, y1 = last[1] - 22;
    const all = [[x0, y0], ...pts, [x1, y1]];
    let dPath = `M${x0} ${y0}`;
    for (let i = 1; i < all.length; i++) {
      const [ax, ay] = all[i - 1], [bx, by] = all[i];
      dPath += ` Q${((ax + bx) / 2).toFixed(1)} ${(Math.max(ay, by) + 34).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
    }
    ropePath.setAttribute('d', dPath);
    const post = (x, y) => `<rect x="${x - 9}" y="${y - 16}" width="18" height="${H - y + 40}" rx="4" fill="#b8744a" stroke="#1b1f4b" stroke-width="2.5"/><rect x="${x - 14}" y="${y - 22}" width="28" height="10" rx="4" fill="#9c5f3b" stroke="#1b1f4b" stroke-width="2.5"/>`;
    posts.innerHTML = post(x0, y0) + post(x1, y1);
    bindTrack();
  }
  let unbind = null;
  function bindTrack() {
    if (unbind) unbind();
    unbind = null;
    track.style.transform = '';
    if (M) unbind = M.scroll(M.animate(track, { transform: ['translateX(0px)', `translateX(${-span}px)`] }, { ease: 'linear' }),
      { target: line, offset: ['start start', 'end end'] });
  }
  layout();
  addEventListener('resize', layout);
  if (d.fonts) d.fonts.ready.then(layout);

  /* ----------------------------------------------- rainbow + wind + hud */
  const bows = [...d.querySelectorAll('.rainbow [data-draw]')];
  W.prepDraw(d.querySelector('.rainbow'));
  const bowLens = bows.map(p => parseFloat(p.style.strokeDasharray) || 2000);
  const sock = d.getElementById('sock');
  const hud = d.getElementById('hudCount');
  let wind = 0, lastCount = '';

  const lineVis = W.watch(line, '0px');
  let skip = false, lastBow = -1;
  // the gentle sway + wind is the only per-frame work, and only while the line is on screen
  W.onFrame((y, v, t) => {
    if (!lineVis.on) return;
    if (!M) track.style.transform = `translate3d(${(-W.sticky(line) * span).toFixed(1)}px,0,0)`;
    if (W.lite && (skip = !skip)) return;
    wind = lerp(wind, clamp(-v * 1.1, -18, 18), W.lite ? .14 : .07);
    pieces.forEach((pc, i) => {
      const target = W.reduce ? 0 : Math.sin(t * pc.speed + pc.phase) * pc.amp + wind * (.8 + (i % 3) * .18);
      const next = lerp(pc.rot, target, W.lite ? .22 : .12);
      if (Math.abs(next - pc.rot) < .01) return;
      pc.rot = next;
      pc.inner.style.transform = `rotate(${pc.rot.toFixed(2)}deg)`;
    });
    const w = Math.min(50, Math.abs(wind) / 18 * 50);
    sock.style.transform = `translateX(${((wind < 0 ? -w : w) / 2).toFixed(2)}%) scaleX(${(w / 100).toFixed(3)})`;
  });
  W.onScroll(() => {
    if (!lineVis.on) return;
    const p = W.sticky(line);
    const bp = Math.round(p * 100) / 100;
    if (bp !== lastBow) { lastBow = bp; bows.forEach((b, i) => { b.style.strokeDashoffset = bowLens[i] * (1 - clamp(p * 1.3 - i * .06)); }); }
    const count = `${String(Math.min(P.length, Math.floor(p * P.length) + 1)).padStart(2, '0')} / ${String(P.length).padStart(2, '0')}`;
    if (count !== lastCount) { hud.textContent = count; lastCount = count; }
  });

  /* --------------------------------------------------- the full gallery */
  const A = W.art, WORK = A.WORK;
  const gGrid = d.getElementById('gGrid');
  const gFilters = d.getElementById('gFilters');
  const TABS = [['all', 'All my work'], ['books', 'Children’s books'], ['custom', 'Customised illustrations'], ['invites', 'Invitation cards'], ['brands', 'Brand collaborations']];
  const NOTES = { books: 'Children’s book illustration.', custom: 'A customised illustration, made to order.', invites: 'An illustrated invitation card.', brands: 'Illustration made for a brand collaboration.' };
  gFilters.innerHTML = TABS.map(([k, n]) => `<button type="button" data-filter="${k}" aria-pressed="${k === 'all'}">${n}<sup>${k === 'all' ? WORK.length : WORK.filter(w => w.cat === k).length}</sup></button>`).join('');
  const tilt = [-1.6, 1.2, -.6, 1.8, -1.2, .8], tapeTilt = [-4, 3, -2, 5];
  const gItems = WORK.map((p, i) => {
    const el = d.createElement('button');
    el.type = 'button';
    el.className = 'g-item';
    el.dataset.cat = p.cat;
    el.dataset.cursor = 'look closer';
    el.style.setProperty('--r', tilt[i % tilt.length] + 'deg');
    el.style.setProperty('--tr', tapeTilt[i % tapeTilt.length] + 'deg');
    el.setAttribute('aria-label', `Open “${p.title}”`);
    el.innerHTML = `<span class="g-tape" aria-hidden="true"></span><span class="g-pic"><img src="${A.photo(p, 600)}" srcset="${A.photo(p, 400)} 400w, ${A.photo(p, 600)} 600w, ${A.photo(p, 900)} 900w" sizes="(max-width: 860px) 45vw, 30vw" width="600" height="${Math.round(600 * p.h / p.w)}" alt="${p.title}" loading="lazy" decoding="async"></span><span class="g-cap"><small>${p.label}</small>${p.title}</span>`;
    gGrid.appendChild(el);
    return { el, p };
  });
  gItems.forEach(g => g.el.addEventListener('click', () => {
    const shown = gItems.filter(x => !x.el.hidden);
    open(shown.map(galleryEntry), shown.indexOf(g));
  }));

  function filterTo(cat, animate) {
    gFilters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === cat));
    const shown = [];
    gItems.forEach(g => { g.el.hidden = !(cat === 'all' || g.p.cat === cat); if (!g.el.hidden) shown.push(g.el); });
    if (animate && M && !W.reduce) {
      M.animate(shown, { opacity: [0, 1], transform: ['translateY(24px) rotate(0deg)', 'translateY(0px) rotate(0deg)'] },
        { duration: .6, ease: [.22, 1, .36, 1], delay: M.stagger(.03) }).then(() => shown.forEach(el => { el.style.transform = ''; }));
    }
  }
  gFilters.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    filterTo(b.dataset.filter, true);
    W.sound.blip(560);
    history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : '#' + b.dataset.filter);
  });
  // arriving from a link like work.html#books: pre-filter and glide down to the gallery
  const hashCat = location.hash.slice(1);
  if (TABS.some(t => t[0] === hashCat)) {
    filterTo(hashCat, false);
    W.whenReady(() => setTimeout(() => W.scrollTo(d.getElementById('gallery'), { offset: 20 }), 350));
  }

  /* -------------------------------------------------------- lightbox */
  const lb = d.getElementById('lb');
  const lbArt = d.getElementById('lbArt');
  const $ = id => d.getElementById(id);
  let list = [], cur = -1, busy = false;

  const pieceEntry = (p, i) => ({ html: () => A.svg(p.key, p.title), title: p.title, note: p.note, tag: p.tag, ar: .8,
    src: () => pieces[i].frame, rot: () => pieces[i].rot, show: () => centerOn(i) });
  const galleryEntry = g => ({ html: () => `<img class="art-img" src="${A.photo(g.p, 1200)}" alt="${g.p.title}" decoding="async">`,
    title: g.p.title, note: NOTES[g.p.cat], tag: g.p.label, ar: g.p.w / g.p.h, src: () => g.el.querySelector('.g-pic'), rot: () => 0 });
  function openPiece(i) { open(P.map(pieceEntry), i); }

  function fill(i) {
    const it = list[i];
    lbArt.style.setProperty('--ar', it.ar.toFixed(4));
    lbArt.innerHTML = it.html();
    $('lbTag').textContent = it.tag;
    $('lbNo').textContent = `no. ${String(i + 1).padStart(2, '0')} of ${String(list.length).padStart(2, '0')}`;
    $('lbTitle').textContent = it.title;
    $('lbNote').textContent = it.note;
  }
  const delta = (src, dst) => {
    const a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
    return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})`;
  };
  function centerOn(i) {
    const pc = pieces[i];
    const x = pc.el.offsetLeft + pc.el.offsetWidth / 2 - innerWidth / 2;
    const top = line.getBoundingClientRect().top + scrollY + clamp(x / Math.max(1, span)) * span;
    if (W.lenis) W.lenis.scrollTo(top, { immediate: true, force: true });
    else scrollTo(0, top);
  }
  function open(items, i) {
    if (busy || i < 0) return;
    busy = true; list = items; cur = i;
    fill(i);
    lb.hidden = false;
    W.lock(true);
    const src = list[i].src();
    const from = delta(src, lbArt) + ` rotate(${list[i].rot().toFixed(1)}deg)`;
    const HOME = 'translate(0px, 0px) scale(1) rotate(0deg)';
    src.style.visibility = 'hidden';
    requestAnimationFrame(() => lb.classList.add('open'));
    if (M && !W.reduce) M.animate(lbArt, { transform: [from, HOME] }, { type: 'spring', bounce: .22, duration: .8 }).then(() => { busy = false; });
    else busy = false;
    lb.querySelector('.btn[data-close]').focus({ preventScroll: true });
    W.sound.blip(700);
  }
  function close() {
    if (busy || lb.hidden) return;
    busy = true;
    const src = list[cur].src();
    lb.classList.remove('open');
    const done = () => {
      src.style.visibility = '';
      lb.hidden = true;
      lbArt.style.transform = '';
      W.lock(false);
      busy = false;
      (src.closest('button') || src).focus({ preventScroll: true });
    };
    if (M && !W.reduce) M.animate(lbArt, { transform: ['translate(0px, 0px) scale(1)', delta(src, lbArt)] }, { duration: .6, ease: [.65, 0, .35, 1] }).then(done);
    else done();
  }
  function step(dir) {
    if (busy) return;
    const next = (cur + dir + list.length) % list.length;
    list[cur].src().style.visibility = '';
    list[next].src().style.visibility = 'hidden';
    cur = next;
    if (list[next].show) list[next].show();
    if (!M || W.reduce) { fill(next); return; }
    M.animate(lbArt, { opacity: [1, 0], transform: ['translateX(0px) rotate(0deg)', `translateX(${-dir * 40}px) rotate(${-dir * 4}deg)`] }, { duration: .22, ease: 'easeIn' })
      .then(() => {
        fill(next);
        M.animate(lbArt, { opacity: [0, 1], transform: [`translateX(${dir * 40}px) rotate(${dir * 4}deg)`, 'translateX(0px) rotate(0deg)'] }, { type: 'spring', bounce: .3, duration: .6 });
      });
    W.sound.blip(600 + dir * 80);
  }
  lb.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) close();
    else if (e.target.closest('[data-prev]')) step(-1);
    else if (e.target.closest('[data-next]')) step(1);
  });
  d.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  /* ----------------------------------------------- process: build it up */
  const art = d.getElementById('procArt');
  const stamp = d.getElementById('procStamp');
  const names = ['', 'notice', 'sketch', 'colour', 'light & rain'];
  W.prepDraw(art);
  const steps = [...d.querySelectorAll('.proc-step')];
  const so = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const n = e.target.dataset.step;
    steps.forEach(s => s.classList.toggle('active', s === e.target));
    if (art.dataset.step === n) return;
    art.dataset.step = n;
    if (+n >= 2) W.drawIn(art);
    stamp.textContent = `step ${n} · ${names[n]}`;
    stamp.classList.remove('bump'); void stamp.offsetWidth; stamp.classList.add('bump');
  }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => so.observe(s));
})();
