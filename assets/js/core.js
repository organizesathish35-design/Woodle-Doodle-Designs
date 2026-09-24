/* ==========================================================================
   Woodle Doodle — core
   Page transitions, route map, cursor, rain, sound, reveals, smooth scroll.
   ========================================================================== */
(() => {
  'use strict';

  const d = document;
  const html = d.documentElement;
  const body = d.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const safe = (fn, fallback = null) => { try { return fn(); } catch (e) { return fallback; } };
  const store = {
    get: k => safe(() => localStorage.getItem(k)),
    set: (k, v) => safe(() => localStorage.setItem(k, v)),
  };
  const sess = {
    get: k => safe(() => sessionStorage.getItem(k)),
    set: (k, v) => safe(() => sessionStorage.setItem(k, v)),
    del: k => safe(() => sessionStorage.removeItem(k)),
  };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const IG = 'https://www.instagram.com/woodledoodledesigns/';
  const LEARN = 'https://learn.woodledoodledesigns.com';

  // Every stop on the route is one real part of Woodle Doodle Designs, named plainly.
  const wix = (id, ext) => `https://static.wixstatic.com/media/5dfe12_${id}~mv2.${ext}/v1/fill/w_640,h_800,al_c,q_85,enc_auto/${id}.${ext}`;
  const STOPS = [
    { id: 'home',     href: 'index.html',    no: '01', name: 'Home',          note: 'who I am & what we do',          color: '#e5483b', img: wix('dfe700e7e2c748f09592ac5960778e86', 'jpg') },
    { id: 'work',     href: 'work.html',     no: '02', name: 'My Projects',   note: 'a gallery of all my art',        color: '#f3ab3a', img: wix('3b48d66333814b229621474e8cc9f1d9', 'jpg') },
    { id: 'club',     href: 'club.html',     no: '03', name: 'WDD Art Club',  note: 'my monthly art community',       color: '#2f8a86', img: wix('972202cc11764e95bbd46e1a0660661b', 'png') },
    { id: 'learn',    href: 'learn.html',    no: '04', name: 'Workshops',     note: 'live classes, every month',      color: '#7088e2', img: wix('27b31ff26c734b02a81d50ba2672bd03', 'png') },
    { id: 'featured', href: 'featured.html', no: '05', name: 'Featured At',   note: 'press, interviews & features',   color: '#f6bf95', img: wix('32ae382833534b388d6157fd9ef50e45', 'jpg') },
    { id: 'about',    href: 'about.html',    no: '06', name: 'About',         note: 'the artist behind @woodledoodledesigns', color: '#ef8fa0', img: wix('03fbf73d430844bc84e6f94aeb0a9325', 'png') },
    { id: 'contact',  href: 'contact.html',  no: '07', name: 'Contact',       note: 'send me a paper plane',          color: '#b3b9f0', img: wix('970c4aeb05d84d8dabc3f291d27299f3', 'jpg') },
  ];
  const PAGE = body.dataset.page || 'home';

  /* Motion = Framer Motion's vanilla-JS engine (motion.dev). Everything still works without it. */
  const M = window.Motion || null;
  if (M) html.classList.add('motion');

  /* Low-power devices get "lite" mode: lighter rain, native scroll, fewer GPU layers.
     Also switched on at runtime if the frame-rate check below finds the device struggling. */
  const conn = navigator.connection || {};
  const forced = /[?&]lite\b/.test(location.search);
  let lite = forced || reduce || !!conn.saveData
    || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)
    || (navigator.deviceMemory > 0 && navigator.deviceMemory < 4)
    || safe(() => sessionStorage.getItem('wdd-lite')) === '1';
  if (lite) html.classList.add('lite');
  const rich = fine && !lite;
  if (rich) html.classList.add('rich');

  /* Phones and tablets: the screen is small and the GPU fill-rate is precious, so the
     heavy touches (rain density, per-frame loops) run lighter here even on fast devices.
     Desktop is untouched — `touch` is false for any mouse-driven browser. */
  const touch = matchMedia('(pointer: coarse)').matches;
  if (touch) html.classList.add('touch');
  const cheap = lite || touch;   // "draw this the light way"

  const WDD = window.WDD = Object.assign(window.WDD || {}, {
    reduce, fine, lite, rich, touch, cheap, M, store, sess, clamp, lerp, wait, IG, LEARN, STOPS, PAGE,
  });

  /* ------------------------------------------------------------------ icons */
  const PLANE = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#3148c8"/><path d="M31 11 8 19l8 3 3 8 4-6 5 3z" fill="#fff8ec" stroke="#1b1f4b" stroke-width="1.6" stroke-linejoin="round"/><path d="M31 11 16 22m15-11-8 13" stroke="#1b1f4b" stroke-width="1.3" fill="none"/></svg>`;
  const PLANE_SM = `<svg viewBox="0 0 40 30" aria-hidden="true"><path d="M38 2 2 14l12 4 4 10 6-8 8 4z" fill="#fff8ec" stroke="#1b1f4b" stroke-width="2" stroke-linejoin="round"/><path d="M38 2 14 18m24-16L24 20" stroke="#1b1f4b" stroke-width="1.6" fill="none"/></svg>`;
  const ICON_RAIN = `<svg class="on" viewBox="0 0 24 24" fill="none" stroke="#1b1f4b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 15a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.4A3.4 3.4 0 0 1 17 15z" fill="#b3b9f0"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" stroke="#3148c8" stroke-width="2"/></svg>
    <svg class="off" viewBox="0 0 24 24" fill="none" stroke="#1b1f4b" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="#f3ab3a"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>`;
  const ICON_SOUND = `<svg class="on" viewBox="0 0 24 24" fill="none" stroke="#1b1f4b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#ef8fa0"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>
    <svg class="off" viewBox="0 0 24 24" fill="none" stroke="#1b1f4b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#efe3cc"/><path d="M17 9.5l5 5M22 9.5l-5 5"/></svg>`;

  const BUS = (cls = '') => `<svg class="${cls}" viewBox="0 0 240 124" aria-hidden="true">
    <g class="body">
      <rect x="8" y="16" width="222" height="84" rx="22" fill="#e5483b" stroke="#1b1f4b" stroke-width="4"/>
      <rect x="10" y="68" width="218" height="13" fill="#f3ab3a"/>
      <g fill="#b3b9f0" stroke="#1b1f4b" stroke-width="3">
        <rect x="24" y="28" width="36" height="30" rx="8"/><rect x="70" y="28" width="36" height="30" rx="8"/>
        <rect x="116" y="28" width="36" height="30" rx="8"/><rect x="162" y="28" width="26" height="30" rx="8"/>
        <rect x="198" y="28" width="24" height="40" rx="8"/>
      </g>
      <g fill="#fff8ec"><circle cx="134" cy="48" r="7"/><path d="M127 44l2-7 4 5zM141 44l-2-7-4 5z"/></g>
      <rect x="84" y="4" width="74" height="17" rx="5" fill="#1b1f4b"/>
      <text x="121" y="17" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="14" fill="#ffd98a">327 · WDD</text>
      <circle cx="223" cy="86" r="6" fill="#fff3c9" stroke="#1b1f4b" stroke-width="2"/>
    </g>
    <g class="wheel"><circle cx="62" cy="102" r="17" fill="#1b1f4b"/><circle cx="62" cy="102" r="7" fill="#f7f0e3"/><rect x="60" y="88" width="4" height="7" rx="2" fill="#f7f0e3"/></g>
    <g class="wheel"><circle cx="182" cy="102" r="17" fill="#1b1f4b"/><circle cx="182" cy="102" r="7" fill="#f7f0e3"/><rect x="180" y="88" width="4" height="7" rx="2" fill="#f7f0e3"/></g>
  </svg>`;
  const SIGN = `<svg class="foot-sign" viewBox="0 0 70 200" aria-hidden="true"><rect x="31" y="54" width="8" height="146" fill="#d9dcf0"/><rect x="20" y="96" width="30" height="40" rx="3" fill="#fff8ec"/><path d="M25 106h20M25 114h15M25 122h18" stroke="#3148c8" stroke-width="2.5"/><circle cx="35" cy="36" r="30" fill="#e5483b" stroke="#fff8ec" stroke-width="6"/><text x="35" y="43" text-anchor="middle" font-family="Fraunces, serif" font-weight="900" font-size="18" fill="#fff8ec">WDD</text></svg>`;
  WDD.icons = { PLANE, PLANE_SM, BUS, SIGN };

  /* ---------------------------------------------------------------- sound */
  const Sound = (() => {
    let ctx, master, on = false;
    function build() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      const len = ctx.sampleRate * 3;
      const brown = ctx.createBuffer(1, len, ctx.sampleRate);
      const white = ctx.createBuffer(1, len, ctx.sampleRate);
      const b = brown.getChannelData(0), w = white.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const r = Math.random() * 2 - 1;
        last = (last + 0.02 * r) / 1.02;
        b[i] = last * 3.2;
        w[i] = r;
      }
      const loop = (buf, type, freq, q, gain) => {
        const src = ctx.createBufferSource();
        src.buffer = buf; src.loop = true;
        const f = ctx.createBiquadFilter();
        f.type = type; f.frequency.value = freq; f.Q.value = q;
        const g = ctx.createGain(); g.gain.value = gain;
        src.connect(f).connect(g).connect(master);
        src.start();
      };
      loop(brown, 'lowpass', 700, .5, .9);      // the low wash of rain
      loop(white, 'bandpass', 2600, .6, .11);   // pitter-patter on the umbrella
      loop(white, 'highpass', 6500, .3, .03);   // fizz
      return true;
    }
    function set(v) {
      on = v;
      if (on && !ctx && !build()) return;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(on ? .32 : 0, ctx.currentTime, .4);
    }
    function bell() {
      if (!on || !ctx) return;
      const t = ctx.currentTime;
      [[1318, 0], [1046, .16]].forEach(([f, dt]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, t + dt);
        g.gain.linearRampToValueAtTime(.18, t + dt + .01);
        g.gain.exponentialRampToValueAtTime(.0001, t + dt + 1.1);
        o.connect(g).connect(ctx.destination);
        o.start(t + dt); o.stop(t + dt + 1.2);
      });
    }
    function blip(f = 660) {
      if (!on || !ctx) return;
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.6, t + .08);
      g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .3);
    }
    return { set, bell, blip, get on() { return on; } };
  })();
  WDD.sound = Sound;

  /* ----------------------------------------------------------------- rain */
  class Rain {
    constructor(canvas, opts = {}) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({ density: 1, alpha: .55, color: '222,228,255', splash: false, floor: .72, speed: 1, len: 1 }, opts);
      this.wind = 0; this.targetWind = opts.wind || -.15;
      this.drops = []; this.splashes = [];
      this.visible = true; this.running = false;
      this.resize = this.resize.bind(this);
      this.resize();
      this.lastW = innerWidth;
      addEventListener('resize', () => {
        if (WDD.touch && innerWidth === this.lastW) return;   // just the address bar
        this.lastW = innerWidth;
        this.resize();
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; this.sync(); }).observe(canvas);
      }
    }
    resize() {
      const r = this.c.getBoundingClientRect();
      const dpr = WDD.cheap ? 1 : Math.min(devicePixelRatio || 1, 1.5);
      this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
      this.c.width = this.w * dpr; this.c.height = this.h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(this.w * this.h / 7000 * this.o.density * (WDD.cheap ? .45 : 1));
      this.drops = Array.from({ length: Math.min(n, WDD.cheap ? 140 : 320) }, () => this.drop(true));
    }
    drop(init) {
      const z = Math.random();
      return {
        x: Math.random() * (this.w + 300) - 150,
        y: init ? Math.random() * this.h : -30 - Math.random() * 120,
        z, len: (10 + z * 24) * this.o.len, v: (7 + z * 13) * this.o.speed, a: .18 + z * .6,
      };
    }
    sync() { (WDD.rainOn && this.visible && !document.hidden) ? this.start() : this.pause(); }
    start() {
      if (this.running) return;
      this.running = true;
      const loop = () => { if (!this.running) return; this.step(); this.raf = requestAnimationFrame(loop); };
      loop();
    }
    pause() { this.running = false; cancelAnimationFrame(this.raf); if (!WDD.rainOn) this.ctx.clearRect(0, 0, this.w, this.h); }
    step() {
      // lite: draw at ~30fps, drops move twice as far per drawn frame
      if (WDD.cheap && (this.tick = !this.tick)) return;
      const k = WDD.cheap ? 2 : 1;
      const { ctx, o } = this;
      ctx.clearRect(0, 0, this.w, this.h);
      this.wind += (this.targetWind - this.wind) * .04;
      ctx.lineCap = 'round';
      for (const p of this.drops) {
        const dx = this.wind * p.v;
        p.y += p.v * k; p.x += dx * k;
        ctx.strokeStyle = `rgba(${o.color},${p.a * o.alpha})`;
        ctx.lineWidth = .6 + p.z * 1.3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - dx * p.len / p.v, p.y - p.len);
        ctx.stroke();
        const splash = o.splash && !WDD.cheap;
        const floorY = splash ? this.h * (o.floor + (1 - o.floor) * p.z) : this.h + 40;
        if (p.y > floorY) {
          if (splash && Math.random() < .6) this.splashes.push({ x: p.x, y: floorY, r: 0, max: 3 + p.z * 11, a: .7 * p.a });
          Object.assign(p, this.drop(false));
        }
      }
      if (this.splashes.length) {
        ctx.lineWidth = 1.1;
        for (const s of this.splashes) {
          s.r += .5 + s.max * .06;
          const k = 1 - s.r / s.max;
          ctx.strokeStyle = `rgba(${o.color},${k * s.a})`;
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.r, s.r * .3, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        this.splashes = this.splashes.filter(s => s.r < s.max);
      }
    }
  }
  const rains = [];
  WDD.rainOn = store.get('wdd-rain') !== 'off' && !reduce;
  WDD.Rain = Rain;
  WDD.makeRain = (canvas, opts) => { if (!canvas) return null; const r = new Rain(canvas, opts); rains.push(r); r.sync(); return r; };
  d.addEventListener('visibilitychange', () => rains.forEach(r => r.sync()));

  /* ---------------------------------------------------------------- toast */
  let toastEl, toastT;
  WDD.toast = msg => {
    if (!toastEl) { toastEl = d.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };

  /* ------------------------------------------------------------------ nav */
  const nav = d.getElementById('nav');
  if (nav) {
    nav.className = 'nav';
    nav.innerHTML = `
      <a class="logo" href="index.html" aria-label="Woodle Doodle Designs, home"><img src="assets/logo.svg" width="268" height="178" alt="Woodle Doodle Designs"></a>
      <div class="nav-tools">
        <button class="tool" id="rainBtn" type="button" aria-pressed="${WDD.rainOn}" aria-label="Rain on or off" data-cursor="${WDD.rainOn ? 'stop rain' : 'make it rain'}">${ICON_RAIN}</button>
        <button class="tool" id="soundBtn" type="button" aria-pressed="false" aria-label="Rain sounds on or off" data-cursor="listen">${ICON_SOUND}</button>
        <button class="route-btn" id="routeBtn" type="button" aria-expanded="false" aria-controls="route" data-cursor="route map"><span>Route</span><i></i></button>
      </div>`;

    const rainBtn = d.getElementById('rainBtn');
    rainBtn.addEventListener('click', () => {
      WDD.rainOn = !WDD.rainOn;
      store.set('wdd-rain', WDD.rainOn ? 'on' : 'off');
      rainBtn.setAttribute('aria-pressed', WDD.rainOn);
      rainBtn.dataset.cursor = WDD.rainOn ? 'stop rain' : 'make it rain';
      rains.forEach(r => r.sync());
      d.dispatchEvent(new CustomEvent('wdd:rain', { detail: WDD.rainOn }));
      WDD.toast(WDD.rainOn ? 'Here comes the rain again ☔' : 'Umbrellas down, the sun’s out ☀');
    });
    const soundBtn = d.getElementById('soundBtn');
    soundBtn.addEventListener('click', () => {
      Sound.set(!Sound.on);
      soundBtn.setAttribute('aria-pressed', Sound.on);
      WDD.toast(Sound.on ? 'Rain on the roof. Turn it up a little 🎧' : 'Shh… quiet now');
    });
  }

  /* ------------------------------------------------------------ route map */
  const route = d.createElement('div');
  route.className = 'route';
  route.id = 'route';
  route.setAttribute('role', 'dialog');
  route.setAttribute('aria-modal', 'true');
  route.setAttribute('aria-label', 'Route map');
  route.innerHTML = `
    <div class="route-bg"></div>
    <div class="route-inner">
      <div>
        <p class="route-kicker">Route No. 327 · the Woodle Town circular</p>
        <ol class="route-list">
          <li class="route-bus-li" aria-hidden="true"><svg class="route-bus" viewBox="0 0 124 240"><g transform="rotate(90 62 62) translate(0 0)">${BUS().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g></svg></li>
          ${STOPS.map((s, i) => `<li style="--i:${i}"><a href="${s.href}" data-stop="${s.id}" ${s.id === PAGE ? 'aria-current="page"' : ''}>
            <span class="dot" style="--c:${s.color}"></span><span class="no">${s.no}</span><span class="name">${s.name}</span><span class="note">${s.note}</span></a></li>`).join('')}
        </ol>
      </div>
      <aside class="route-side" aria-hidden="true">
        <div class="route-window"></div>
        <div class="route-meta"><span>✦ woodle doodle designs</span><a href="${IG}" target="_blank" rel="noopener">@woodledoodledesigns ↗</a></div>
      </aside>
    </div>`;
  body.appendChild(route);
  const routeBtn = d.getElementById('routeBtn');
  const routeList = route.querySelector('.route-list');
  const routeBus = route.querySelector('.route-bus');
  const routeWin = route.querySelector('.route-window');
  let previewsBuilt = false;

  function moveBus(a) {
    if (!a) return;
    const li = a.parentElement;
    routeBus.style.transform = `translateY(${li.offsetTop + li.offsetHeight / 2 - 30}px)`;
    const id = a.dataset.stop;
    routeWin.querySelectorAll('div').forEach(x => x.classList.toggle('on', x.dataset.id === id));
  }
  function openRoute() {
    if (!previewsBuilt) {
      routeWin.innerHTML = STOPS.map(s => `<div data-id="${s.id}"><img class="art-img" src="${s.img}" alt="" decoding="async"></div>`).join('');
      previewsBuilt = true;
    }
    html.classList.add('route-open');
    routeBtn && routeBtn.setAttribute('aria-expanded', 'true');
    WDD.lock(true);
    moveBus(route.querySelector('a[aria-current]') || route.querySelector('.route-list a'));
    setTimeout(() => (route.querySelector('a[aria-current]') || route.querySelector('.route-list a')).focus({ preventScroll: true }), 400);
    Sound.blip(520);
  }
  function closeRoute() {
    if (!html.classList.contains('route-open')) return;
    html.classList.remove('route-open');
    routeBtn && routeBtn.setAttribute('aria-expanded', 'false');
    WDD.lock(false);
  }
  WDD.closeRoute = closeRoute;
  routeBtn && routeBtn.addEventListener('click', () => html.classList.contains('route-open') ? closeRoute() : openRoute());
  routeList.addEventListener('pointerover', e => moveBus(e.target.closest('a')));
  routeList.addEventListener('focusin', e => moveBus(e.target.closest('a')));
  d.addEventListener('keydown', e => { if (e.key === 'Escape') closeRoute(); });

  /* ---------------------------------------------------------------- footer */
  const foot = d.getElementById('foot');
  if (foot) {
    const nx = STOPS.find(s => s.id === foot.dataset.next) || STOPS[0];
    const loop = foot.dataset.next === 'home';
    foot.className = 'foot torn-top';
    foot.innerHTML = `
      <canvas class="foot-rain" aria-hidden="true"></canvas>
      <div class="foot-glow"></div>
      <a class="next" href="${nx.href}" data-cursor="hop on">
        <span class="hand">${loop ? 'end of the line — ride again?' : 'next stop'}</span>
        <span class="display next-name">${nx.name}</span>
        <span class="next-note">${nx.note} <b>→</b></span>
      </a>
      <div class="road" aria-hidden="true">${SIGN}<div class="foot-bus">${BUS()}</div></div>
      <div class="foot-bottom">
        <a class="foot-logo" href="index.html" aria-label="Woodle Doodle Designs, home"><img src="assets/logo.svg" width="268" height="178" alt="Woodle Doodle Designs" loading="lazy"></a>
        <span>© ${new Date().getFullYear()} Woodle Doodle Designs · Sumouli Dutta. Drawn on a rainy day.</span>
        <nav aria-label="Footer">
          ${STOPS.map(s => `<a href="${s.href}">${s.name}</a>`).join('')}
          <a href="${IG}" target="_blank" rel="noopener">Instagram ↗</a>
          <a href="${LEARN}" target="_blank" rel="noopener">Learn ↗</a>
        </nav>
        <button class="to-top" type="button">${PLANE_SM} fly back up</button>
      </div>`;
    foot.querySelector('.to-top').addEventListener('click', () => WDD.scrollTo(0));
    let rang = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > .35) {
        foot.classList.add('in');
        if (!rang) { rang = true; setTimeout(() => Sound.bell(), 1900); }
      }
    }, { threshold: [0, .35, .6] }).observe(foot);
    WDD.makeRain(foot.querySelector('.foot-rain'), { density: .5, alpha: .45, splash: true, floor: .86 });
  }

  /* ------------------------------------------------------- smooth scroll */
  let lenis = null;
  if (window.Lenis && rich) {
    lenis = new window.Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: .95 });
    WDD.lenis = lenis;
  }
  let locked = 0;
  WDD.lock = on => {
    locked = on ? 1 : 0;
    if (lenis) on ? lenis.stop() : lenis.start();
    body.style.overflow = on ? 'hidden' : '';
  };
  WDD.scrollTo = (target, opts = {}) => {
    if (lenis) lenis.scrollTo(target, Object.assign({ duration: 1.6 }, opts));
    else {
      const y = typeof target === 'number' ? target : (target.getBoundingClientRect().top + scrollY + (opts.offset || 0));
      scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
  };
  d.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const t = d.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); WDD.scrollTo(t, { offset: -40 }); }
  });

  /* ---------------------------------------------------------- frame loop */
  const subs = [], scrollSubs = [];
  WDD.onFrame = fn => subs.push(fn);
  // runs only on frames where the page actually scrolled (or is still gliding)
  WDD.onScroll = fn => { scrollSubs.push(fn); fn(scrollY, 0); };
  // cheap "is this on screen?" flag, so per-frame work can skip offscreen sections
  WDD.watch = (el, margin = '120px') => {
    const state = { on: false };
    if (el) new IntersectionObserver(([e]) => { state.on = e.isIntersecting; }, { rootMargin: margin }).observe(el);
    return state;
  };
  WDD.vel = 0; WDD.scrollY = scrollY;
  WDD.progress = el => { const r = el.getBoundingClientRect(); return clamp((innerHeight - r.top) / (r.height + innerHeight)); };
  WDD.sticky = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
  let lastY = scrollY, navHidden = false, resized = false, probing = false;
  const frames = [];
  addEventListener('resize', () => { resized = true; }, { passive: true });
  function frame(t) {
    if (lenis) lenis.raf(t);
    const y = scrollY, dy = y - lastY;
    lastY = y;
    WDD.vel += (dy - WDD.vel) * .18;
    WDD.scrollY = y;
    if (nav && !locked) {
      if (y > 240 && dy > 3 && !navHidden) { nav.classList.add('hide'); navHidden = true; }
      else if ((dy < -3 || y < 240) && navHidden) { nav.classList.remove('hide'); navHidden = false; }
    }
    if (dy !== 0 || Math.abs(WDD.vel) > .05 || resized) { resized = false; for (const f of scrollSubs) f(y, WDD.vel); }
    for (const f of subs) f(y, WDD.vel, t);
    if (probing) frames.push(t);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ------------------------------------------------------------- reveals */
  function splitWords(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    el.classList.add('split');
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = d.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(' ')); return; }
            const w = d.createElement('span'); w.className = 'w';
            const s = d.createElement('span'); s.style.setProperty('--i', i++); s.textContent = p;
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return i;
  }
  WDD.splitWords = splitWords;
  WDD.splitChars = el => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/(\s+)/).map(word => /^\s+$/.test(word) ? ' ' :
      `<span class="word" aria-hidden="true">${[...word].map(ch => `<span class="ch">${ch}</span>`).join('')}</span>`).join('');
    el.querySelectorAll('.ch').forEach((c, i) => c.style.setProperty('--i', i));
    return el.querySelectorAll('.ch');
  };

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px', threshold: .01 });
  WDD.prepDraw = root => {
    const svgs = new Set();
    root.querySelectorAll('[data-draw]').forEach(p => {
      if (p.dataset.drawn) return;
      const len = p.getTotalLength ? Math.ceil(p.getTotalLength()) + 2 : 1000;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.dataset.drawn = '1';
      const svg = p.closest('svg');
      if (svg && !svg.hasAttribute('data-draw-manual')) svgs.add(svg);
    });
    return svgs;
  };
  WDD.drawIn = svg => svg.querySelectorAll('[data-draw]').forEach(p => { p.style.strokeDashoffset = 0; });
  // Motion interpolates transforms function-by-function, so both ends spell out the same functions (never 'none').
  const FROM = { '': ['translateY(40px)', 'translateY(0px)'], left: ['translateX(-50px) rotate(-2deg)', 'translateX(0px) rotate(0deg)'], pop: ['scale(.6) rotate(-8deg)', 'scale(1) rotate(0deg)'] };
  function motionReveal(el) {
    if (el.dataset.shown) return;
    el.dataset.shown = '1';
    el.classList.add('in');
    const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
    if (el.hasAttribute('data-split')) {
      M.animate(el.querySelectorAll('.w > span'), { transform: ['translateY(105%) rotate(6deg)', 'translateY(0%) rotate(0deg)'] },
        { type: 'spring', bounce: .25, duration: .9, delay: M.stagger(.035, { startDelay: delay }) });
      return;
    }
    const kind = el.dataset.reveal || '';
    if (kind === 'paint') {
      M.animate(el, { clipPath: ['inset(0 100% 0 0 round 20px)', 'inset(0 0% 0 0 round 20px)'] }, { duration: 1.2, delay, ease: [.77, 0, .18, 1] });
    } else {
      M.animate(el, { opacity: [0, 1], transform: FROM[kind] || FROM[''] },
        { type: 'spring', bounce: kind === 'pop' ? .45 : .2, duration: kind === 'pop' ? 1 : .9, delay });
    }
  }
  WDD.observe = (root = d) => {
    root.querySelectorAll('[data-split]').forEach(splitWords);
    if (M && !reduce) {
      root.querySelectorAll('[data-reveal],[data-split]').forEach(el => M.inView(el, () => motionReveal(el), { margin: '0px 0px -10% 0px' }));
    } else {
      root.querySelectorAll('[data-reveal],[data-split]').forEach(el => io.observe(el));
    }
    WDD.prepDraw(root).forEach(svg => {
      new IntersectionObserver(([e], o) => { if (e.isIntersecting) { WDD.drawIn(svg); o.disconnect(); } }, { rootMargin: '0px 0px -12% 0px' }).observe(svg);
    });
  };

  /* --------------------------------------------------------------- cursor */
  if (fine && !reduce) {
    html.classList.add('has-cursor');
    const cur = d.createElement('div');
    cur.className = 'cursor';
    cur.innerHTML = '<span class="cursor-label"></span>';
    const label = cur.firstChild;
    const trail = d.createElement('canvas');
    trail.className = 'ink-trail';
    body.append(trail, cur);
    const tctx = trail.getContext('2d');
    const sizeTrail = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      trail.width = innerWidth * dpr; trail.height = innerHeight * dpr;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeTrail();
    addEventListener('resize', sizeTrail);
    let mx = -100, my = -100, cx = -100, cy = -100, pts = [], dirty = false;
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!WDD.lite) pts.push({ x: mx, y: my, t: performance.now() });
      if (pts.length > 60) pts.shift();
      cur.classList.remove('hide');
    }, { passive: true });
    d.addEventListener('pointerleave', () => cur.classList.add('hide'));
    addEventListener('pointerdown', () => cur.classList.add('press'));
    addEventListener('pointerup', () => cur.classList.remove('press'));
    d.addEventListener('pointerover', e => {
      const t = e.target.closest('a, button, [data-cursor], label, .drag');
      const field = e.target.closest('input, textarea, select');
      cur.classList.toggle('hide', !!field);
      cur.classList.toggle('hover', !!t && !field);
      const txt = t && t.dataset.cursor;
      cur.classList.toggle('labelled', !!txt);
      if (txt) label.textContent = txt;
    });
    WDD.onFrame(() => {
      cx = lerp(cx, mx, .32); cy = lerp(cy, my, .32);
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      const now = performance.now();
      while (pts.length && now - pts[0].t > 420) pts.shift();
      if (pts.length > 1 || dirty) {
        tctx.clearRect(0, 0, innerWidth, innerHeight);
        dirty = pts.length > 1;
        tctx.lineCap = 'round'; tctx.lineJoin = 'round';
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], k = 1 - (now - b.t) / 420;
          tctx.strokeStyle = `rgba(49,72,200,${k * .55})`;
          tctx.lineWidth = 1 + k * 3.2;
          tctx.beginPath(); tctx.moveTo(a.x, a.y); tctx.lineTo(b.x, b.y); tctx.stroke();
        }
      }
    });
  }

  /* -------------------------------------------------------- transitions */
  const washName = d.getElementById('washName');
  const washLabel = d.querySelector('.wash-label');
  if (washLabel && !washLabel.querySelector('svg')) washLabel.insertAdjacentHTML('beforeend', BUS('wash-bus'));
  const isInternal = a => {
    const h = a.getAttribute('href') || '';
    return /^[\w-]+\.html(#[\w-]*)?$/.test(h) && !a.target && !a.hasAttribute('download');
  };
  function leave(href) {
    if (html.classList.contains('leaving')) return;
    const stop = STOPS.find(s => href.split('#')[0] === s.href);
    const name = stop ? stop.name : 'somewhere new';
    if (washName) washName.textContent = name;
    sess.set('wdd-t', name);
    closeRoute();
    html.classList.add('leaving');
    Sound.bell();
    setTimeout(() => { location.href = href; }, reduce ? 30 : 1150);
  }
  WDD.leave = leave;
  d.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (!isInternal(a)) return;
    const target = a.getAttribute('href').split('#')[0];
    const current = location.pathname.split('/').pop() || 'index.html';
    if (target === current && !a.closest('.route')) { e.preventDefault(); WDD.scrollTo(0); return; }
    if (target === current) { e.preventDefault(); closeRoute(); return; }
    e.preventDefault();
    leave(a.getAttribute('href'));
  });
  addEventListener('pageshow', e => { if (e.persisted) html.classList.remove('leaving', 'arriving', 'arrived'); });

  /* --------------------------------------------------------------- ready */
  const readyFns = [];
  let isReady = false;
  WDD.whenReady = fn => isReady ? fn() : readyFns.push(fn);
  function fireReady() {
    if (isReady) return;
    isReady = true;
    html.classList.add('ready');
    readyFns.forEach(fn => fn());
    if (!WDD.lite) setTimeout(probe, 1800);
  }
  const liteFns = [];
  WDD.onLite = fn => liteFns.push(fn);
  function goLite() {
    if (WDD.lite) return;
    WDD.lite = true; WDD.rich = false;
    html.classList.add('lite'); html.classList.remove('rich');
    sess.set('wdd-lite', '1');
    if (lenis) { lenis.destroy(); lenis = null; WDD.lenis = null; }
    rains.forEach(r => r.resize());
    liteFns.forEach(fn => fn());
  }
  WDD.goLite = goLite;
  function probe() {
    if (d.hidden) return;
    frames.length = 0; probing = true;
    setTimeout(() => {
      probing = false;
      if (frames.length < 10) return;
      const gaps = frames.slice(1).map((t, i) => t - frames[i]).sort((a, b) => a - b);
      const median = gaps[gaps.length >> 1];
      if (median > 26) goLite();   // slower than ~38fps → lighten the load
    }, 1500);
  }

  function runLoader() {
    const L = d.querySelector('.loader');
    if (!L) return Promise.resolve();
    const bar = L.querySelector('.loader-bar i'), note = L.querySelector('.loader-note');
    const msgs = ['sharpening pencils…', 'mixing the blues…', 'waiting for the rain…', 'here comes the bus!'];
    const fontsReady = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, wait(1600)]) : wait(300);
    return fontsReady.then(() => new Promise(res => {
      L.classList.add('go');
      const t0 = performance.now(), dur = reduce ? 200 : 2700;
      const tick = now => {
        const p = clamp((now - t0) / dur), e = 1 - Math.pow(1 - p, 2.2);
        bar.style.width = (e * 100) + '%';
        note.textContent = msgs[Math.min(msgs.length - 1, Math.floor(e * msgs.length))];
        if (p < 1) return requestAnimationFrame(tick);
        L.classList.add('lift');
        sess.set('wdd-seen', '1');
        setTimeout(res, 380);
        setTimeout(() => html.classList.remove('first'), 1300);
      };
      requestAnimationFrame(tick);
    }));
  }

  function boot() {
    WDD.observe(d);
    if (html.classList.contains('arriving')) {
      if (washName) washName.textContent = sess.get('wdd-t') || '';
      sess.del('wdd-t');
      sess.set('wdd-seen', '1');
      setTimeout(() => {
        html.classList.add('arrived');
        setTimeout(fireReady, 280);
        setTimeout(() => html.classList.remove('arriving', 'arrived'), 1400);
      }, reduce ? 0 : 420);
    } else if (html.classList.contains('first')) {
      runLoader().then(fireReady);
    } else {
      fireReady();
    }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
