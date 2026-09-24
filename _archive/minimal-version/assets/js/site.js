/* ==========================================================================
   Woodle Doodle Designs — site script
   Motion (the vanilla-JS engine behind Framer Motion) for soft reveals,
   gentle parallax and small springs; Lenis for smooth scrolling on capable
   devices. Low-power devices get a lighter "lite" mode automatically.
   ========================================================================== */
(() => {
  'use strict';
  const d = document, html = d.documentElement;
  const M = window.Motion || null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const conn = navigator.connection || {};
  const lite = reduce || !!conn.saveData || /[?&]lite\b/.test(location.search)
    || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)
    || (navigator.deviceMemory > 0 && navigator.deviceMemory < 4);
  const EASE = [.22, 1, .36, 1];
  const $ = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => [...r.querySelectorAll(s)];
  if (M) html.classList.add('motion');
  if (lite) html.classList.add('lite');

  /* ---------------------------------------------------------- smooth scroll */
  let lenis = null;
  if (window.Lenis && fine && !lite) {
    lenis = new window.Lenis({ lerp: .1, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollToY = y => lenis ? lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });

  /* -------------------------------------------------------------------- nav */
  const nav = $('#nav');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 20);
    if (!html.classList.contains('menu-open')) nav.classList.toggle('hide', y > 400 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('hide');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('.burger'), menu = $('#menu');
  function setMenu(open) {
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      nav.classList.remove('hide');
      menu.hidden = false;
      lenis && lenis.stop();
      d.body.style.overflow = 'hidden';
      if (M && !reduce) {
        M.animate(menu, { opacity: [0, 1] }, { duration: .3 });
        M.animate($$('nav a, .menu-foot', menu), { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
          { duration: .6, ease: EASE, delay: M.stagger(.05, { startDelay: .08 }) });
      }
    } else {
      menu.hidden = true;
      lenis && lenis.start();
      d.body.style.overflow = '';
    }
  }
  burger && burger.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && html.classList.contains('menu-open')) setMenu(false); });

  /* ---------------------------------------------------------------- reveals */
  // [data-reveal]          → soft fade + rise
  // [data-reveal="img"]    → fade in while the picture settles from a gentle zoom
  // [data-stagger] parent  → children reveal one after another
  $$('[data-stagger]').forEach(g => $$('[data-reveal]', g).forEach((el, i) => { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i * .08).toFixed(2)); }));
  function show(el) {
    if (el.dataset.shown) return;
    el.dataset.shown = '1';
    if (!M || reduce) { el.style.opacity = 1; return; }
    const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
    if (el.dataset.reveal === 'img') {
      M.animate(el, { opacity: [0, 1] }, { duration: .9, delay, ease: EASE });
      const img = $('img', el);
      if (img && !img.hasAttribute('data-parallax')) M.animate(img, { transform: ['scale(1.08)', 'scale(1)'] }, { duration: 1.5, delay, ease: EASE });
    } else {
      M.animate(el, { opacity: [0, 1], transform: ['translateY(26px)', 'translateY(0px)'] }, { duration: .9, delay, ease: EASE });
    }
  }
  if (M && !reduce) $$('[data-reveal]').forEach(el => M.inView(el, () => show(el), { margin: '0px 0px -8% 0px' }));
  else $$('[data-reveal]').forEach(show);

  /* ------------------------------------------------ gentle parallax on art */
  if (M && !reduce && !lite) {
    $$('[data-parallax]').forEach(img => {
      const box = img.closest('.frame') || img.parentElement;
      const amt = parseFloat(img.dataset.parallax) || 40;
      M.scroll(M.animate(img, { transform: [`translateY(${-amt}px) scale(1.08)`, `translateY(${amt}px) scale(1.08)`] }, { ease: 'linear' }),
        { target: box, offset: ['start end', 'end start'] });
    });
  }

  /* ---------------------------------------------------------------- marquee */
  const mq = $('.marquee');
  if (mq && M && !reduce) {
    const loop = M.animate(mq, { transform: ['translateX(0%)', 'translateX(-50%)'] }, { duration: lite ? 80 : 60, repeat: Infinity, ease: 'linear' });
    mq.addEventListener('pointerenter', () => { loop.speed = .25; });
    mq.addEventListener('pointerleave', () => { loop.speed = 1; });
  }

  /* ------------------------------------------------------ testimonials */
  const quotes = $('.quotes');
  if (quotes) {
    const items = $$('.quote', quotes);
    const dots = $('.dots', quotes);
    let at = 0, timer = null;
    items.forEach((q, i) => {
      if (i) q.hidden = true;
      const b = d.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Show kind words ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dots.appendChild(b);
    });
    const dotEls = $$('button', dots);
    function go(i) {
      if (i === at && !items[i].hidden) return;
      items[at].hidden = true;
      at = i;
      items[at].hidden = false;
      dotEls.forEach((b, k) => b.setAttribute('aria-current', k === at));
      if (M && !reduce) M.animate(items[at], { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0px)'] }, { duration: .7, ease: EASE });
    }
    const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go((at + 1) % items.length), 7000); };
    dotEls[0].setAttribute('aria-current', 'true');
    quotes.addEventListener('pointerenter', () => clearInterval(timer));
    quotes.addEventListener('pointerleave', restart);
    restart();
  }

  /* -------------------------------------------------- gallery + lightbox */
  const grid = $('.grid');
  if (grid) {
    const items = $$('.item', grid);
    const buttons = $$('.filters button');
    function filter(cat, animate = true) {
      buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === cat));
      const shown = [];
      items.forEach(it => {
        const on = cat === 'all' || it.dataset.cat === cat;
        it.hidden = !on;
        if (on) shown.push(it);
      });
      if (animate && M && !reduce) {
        M.animate(shown, { opacity: [0, 1], transform: ['translateY(14px) scale(.98)', 'translateY(0px) scale(1)'] },
          { duration: .6, ease: EASE, delay: M.stagger(.035) });
      }
    }
    buttons.forEach(b => b.addEventListener('click', () => {
      filter(b.dataset.filter);
      history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : '#' + b.dataset.filter);
    }));
    const fromHash = animate => {
      const cat = location.hash.slice(1);
      if (cat && buttons.some(b => b.dataset.filter === cat)) filter(cat, animate);
    };
    fromHash(false);
    addEventListener('hashchange', () => { fromHash(true); scrollToY(grid.getBoundingClientRect().top + scrollY - 160); });

    // lightbox
    const lb = $('#lb'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'), lbCat = $('#lbCat');
    let list = [], idx = 0, opener = null;
    function paint() {
      const it = list[idx];
      lbImg.src = it.dataset.full;
      lbImg.alt = it.dataset.title;
      lbTitle.textContent = it.dataset.title;
      lbCat.textContent = it.dataset.label;
      if (M && !reduce) M.animate(lbImg, { opacity: [0, 1], transform: ['scale(.97)', 'scale(1)'] }, { duration: .5, ease: EASE });
    }
    function open(it) {
      list = items.filter(x => !x.hidden);
      idx = list.indexOf(it);
      opener = it;
      lb.hidden = false;
      lenis && lenis.stop();
      d.body.style.overflow = 'hidden';
      if (M && !reduce) M.animate(lb, { opacity: [0, 1] }, { duration: .35 });
      paint();
      $('[data-close]', lb).focus();
    }
    function close() {
      const done = () => { lb.hidden = true; lenis && lenis.start(); d.body.style.overflow = ''; opener && opener.focus(); };
      if (M && !reduce) M.animate(lb, { opacity: [1, 0] }, { duration: .25 }).then(done); else done();
    }
    const step = n => { idx = (idx + n + list.length) % list.length; paint(); };
    items.forEach(it => it.addEventListener('click', () => open(it)));
    lb.addEventListener('click', e => {
      if (e.target.closest('[data-close]') || e.target === lb || e.target.classList.contains('lb-stage')) close();
      else if (e.target.closest('[data-prev]')) step(-1);
      else if (e.target.closest('[data-next]')) step(1);
    });
    d.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    let sx = null;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
  }

  /* ------------------------------------------------------------ contact */
  const form = $('#contactForm');
  if (form) {
    const EMAIL = 'woodledoodlepage@gmail.com';
    const note = $('.form-note', form), ok = $('.form-ok', form);
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = form.elements;
      const bad = [];
      [['name', 'your name'], ['email', 'your email'], ['message', 'a few words about your idea']].forEach(([k, label]) => {
        const el = f[k];
        const valid = k === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) : el.value.trim().length > 1;
        el.classList.toggle('bad', !valid);
        if (!valid) bad.push(label);
      });
      if (bad.length) { note.textContent = `Almost there. Please add ${bad.join(', ')}.`; return; }
      note.textContent = '';
      const subject = `${f.type.value} · from ${f.name.value.trim()}`;
      const body = `${f.message.value.trim()}\n\n${f.name.value.trim()}\n${f.email.value.trim()}`;
      ok.hidden = false;
      if (M && !reduce) M.animate(ok, { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0px)'] }, { duration: .5, ease: EASE });
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    $$('input, textarea', form).forEach(el => el.addEventListener('input', () => el.classList.remove('bad')));
  }

  /* ------------------------------------------------------------- footer */
  $$('.to-top').forEach(b => b.addEventListener('click', e => { e.preventDefault(); scrollToY(0); }));
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
