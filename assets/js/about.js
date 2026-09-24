/* ==========================================================================
   Stop 04 — The Diary
   ========================================================================== */
(() => {
  'use strict';
  const W = window.WDD, d = document;
  const { clamp } = W;

  /* ------------------------------------------------ portrait in the rain */
  W.makeRain(d.getElementById('archRain'), { density: .9, alpha: .4, speed: .9 });
  const portrait = d.getElementById('portrait');
  const arch = portrait.querySelector('.arch');
  if (W.fine && !W.reduce) {
    portrait.addEventListener('pointermove', e => {
      const r = portrait.getBoundingClientRect();
      arch.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 12).toFixed(2) + 'deg');
      arch.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2) + 'deg');
    });
    portrait.addEventListener('pointerleave', () => { arch.style.setProperty('--ry', '0deg'); arch.style.setProperty('--rx', '0deg'); });
  }

  /* ---------------------------------------------------------- flip book */
  const book = d.getElementById('book');
  const leaves = [...book.querySelectorAll('.leaf')];
  const prev = d.getElementById('bookPrev');
  const next = d.getElementById('bookNext');
  const label = d.getElementById('bookPage');
  const mobile = matchMedia('(max-width: 720px)');
  let at = 0; // number of leaves flipped

  function render() {
    leaves.forEach((leaf, i) => {
      const flipped = i < at;
      leaf.classList.toggle('flipped', flipped);
      // the leaf in motion goes on top, then settles into the stack
      leaf.style.zIndex = flipped ? i + 1 : leaves.length * 2 - i;
    });
    book.classList.toggle('closed', at === 0);
    book.classList.toggle('ended', at === leaves.length);
    prev.disabled = at === 0;
    next.disabled = at === leaves.length;
    label.textContent = at === 0 ? 'cover' : at === leaves.length ? 'the end' : `pages ${at * 2 - 1}–${at * 2}`;
  }
  function turn(dir) {
    if (mobile.matches) {
      book.scrollBy({ left: dir * book.clientWidth * .84, behavior: W.reduce ? 'auto' : 'smooth' });
      return;
    }
    const n = clamp(at + dir, 0, leaves.length);
    if (n === at) return;
    const moving = dir > 0 ? leaves[at] : leaves[at - 1];
    moving.style.zIndex = 99;
    at = n;
    setTimeout(render, 10);
    W.sound.blip(dir > 0 ? 560 : 460);
  }
  let swiped = false;
  leaves.forEach((leaf, i) => leaf.addEventListener('click', e => {
    if (swiped) { swiped = false; return; }
    if (mobile.matches || e.target.closest('a, button')) return;
    turn(i < at ? -1 : 1);
  }));
  prev.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  d.addEventListener('keydown', e => {
    const r = book.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === 'ArrowRight') turn(1);
    if (e.key === 'ArrowLeft') turn(-1);
  });
  let sx = null;
  book.addEventListener('pointerdown', e => { sx = e.clientX; });
  book.addEventListener('pointerup', e => {
    if (sx === null || mobile.matches) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) { swiped = true; turn(dx < 0 ? 1 : -1); setTimeout(() => { swiped = false; }, 50); }
  });
  render();

  /* ------------------------------------------------------- sticker board */
  const S = {
    teddy: `<svg viewBox="0 0 100 100"><circle cx="26" cy="24" r="12" fill="#b07a4f"/><circle cx="74" cy="24" r="12" fill="#b07a4f"/><circle cx="26" cy="24" r="6" fill="#e8c49c"/><circle cx="74" cy="24" r="6" fill="#e8c49c"/><circle cx="50" cy="50" r="34" fill="#c08a5c"/><ellipse cx="50" cy="62" rx="15" ry="11" fill="#e8c49c"/><circle cx="38" cy="46" r="4" fill="#1b1f4b"/><circle cx="62" cy="46" r="4" fill="#1b1f4b"/><path d="M46 58h8l-4 5z" fill="#1b1f4b"/><path d="M44 68q6 5 12 0" stroke="#1b1f4b" stroke-width="2.5" fill="none" stroke-linecap="round"/><g fill="#ef8fa0" opacity=".7"><circle cx="30" cy="58" r="5"/><circle cx="70" cy="58" r="5"/></g></svg>`,
    lemon: `<svg viewBox="0 0 100 100"><ellipse cx="48" cy="56" rx="38" ry="30" fill="#f7d33a" transform="rotate(-18 48 56)"/><ellipse cx="36" cy="46" rx="10" ry="5" fill="#fff3a8" transform="rotate(-30 36 46)"/><path d="M78 36l10-12" stroke="#1b1f4b" stroke-width="3"/><ellipse cx="84" cy="18" rx="12" ry="6" fill="#5aa05a" transform="rotate(-35 84 18)"/></svg>`,
    plane: `<svg viewBox="0 0 100 100"><path d="M92 14 8 46l28 10 10 28 14-20 20 10z" fill="#fff8ec" stroke="#1b1f4b" stroke-width="3" stroke-linejoin="round"/><path d="M92 14 36 56m56-42L60 64" stroke="#1b1f4b" stroke-width="2.5" fill="none"/><path d="M36 56l10 28 14-20z" fill="#b3b9f0"/></svg>`,
    umbrella: `<svg viewBox="0 0 100 100"><path d="M8 50C12 24 32 10 50 10s38 14 42 40q-7-6-14 0-7-6-14 0-7-6-14 0-7-6-14 0-7-6-14 0-7-6-14 0z" fill="#e5483b"/><path d="M50 50v34q0 8-8 8t-8-8" stroke="#1b1f4b" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M20 40c6-14 16-22 26-24" stroke="#f7a09a" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
    chai: `<svg viewBox="0 0 100 100"><path d="M40 30c-8-10 8-16 0-28M56 30c-8-10 8-18 0-30" stroke="#b3b9f0" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M20 40h56l-6 46H26z" fill="#e5483b"/><path d="M76 48c16 0 16 24 0 24" stroke="#e5483b" stroke-width="7" fill="none"/><ellipse cx="48" cy="40" rx="28" ry="6" fill="#c98a4a"/><path d="M36 60h24" stroke="#fff8ec" stroke-width="3" stroke-linecap="round"/><text x="48" y="78" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="16" fill="#fff8ec">chai</text></svg>`,
    star: `<svg viewBox="0 0 100 100"><path d="M50 6l12 28 30 4-22 20 6 30-26-15-26 15 6-30L8 38l30-4z" fill="#f3ab3a"/><circle cx="40" cy="48" r="3" fill="#1b1f4b"/><circle cx="60" cy="48" r="3" fill="#1b1f4b"/><path d="M44 58q6 5 12 0" stroke="#1b1f4b" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    pencil: `<svg viewBox="0 0 100 100"><g transform="rotate(-40 50 50)"><rect x="12" y="40" width="62" height="20" fill="#f3ab3a"/><path d="M74 40l22 10-22 10z" fill="#f2c3a0"/><path d="M90 47l6 3-6 3z" fill="#1b1f4b"/><rect x="2" y="40" width="12" height="20" rx="3" fill="#ef8fa0"/><path d="M12 50h62" stroke="#e39a2c" stroke-width="2"/></g></svg>`,
    cat: `<svg viewBox="0 0 100 100"><path d="M18 40 22 8l22 20zM82 40 78 8 56 28z" fill="#fff8ec"/><path d="M24 30l2-14 10 10zM76 30l-2-14-10 10z" fill="#ef8fa0"/><ellipse cx="50" cy="56" rx="36" ry="32" fill="#fff8ec"/><path d="M34 54q5 4 10 0M56 54q5 4 10 0" stroke="#1b1f4b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M46 64h8l-4 4z" fill="#ef8fa0"/><path d="M20 62h14M20 70h14M66 62h14M66 70h14" stroke="#b3b9f0" stroke-width="2"/></svg>`,
    heart: `<svg viewBox="0 0 100 100"><path d="M50 88C20 66 8 50 8 32 8 18 20 8 32 8c8 0 14 4 18 10 4-6 10-10 18-10 12 0 24 10 24 24 0 18-12 34-42 56z" fill="#f3c42a"/><path d="M24 26c2-6 8-10 14-10" stroke="#fff3a8" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
    sign: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#e5483b" stroke="#fff8ec" stroke-width="8"/><text x="50" y="60" text-anchor="middle" font-family="Fraunces, serif" font-weight="900" font-size="26" fill="#fff8ec">WDD</text></svg>`,
  };
  const board = d.getElementById('stickerboard');
  const keys = Object.keys(S);
  let z = 10;
  const stickers = keys.map((k, i) => {
    const el = d.createElement('div');
    el.className = 'sticker drag';
    el.dataset.cursor = 'drag';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `${k} sticker`);
    el.style.setProperty('--i', i);
    el.innerHTML = S[k];
    board.appendChild(el);
    drag(el);
    return el;
  });
  const rnd = (a, b) => a + Math.random() * (b - a);
  function mess() {
    // scatter on a jittered grid so nothing hides completely behind a neighbour
    const cols = innerWidth < 600 ? 3 : 5, rows = Math.ceil(stickers.length / cols);
    const cells = stickers.map((_, i) => i).sort(() => Math.random() - .5);
    stickers.forEach((el, i) => {
      const c = cells[i] % cols, r = Math.floor(cells[i] / cols);
      el.style.left = clamp((c + .5) / cols * 100 + rnd(-7, 7), 8, 92) + '%';
      el.style.top = clamp((r + .5) / rows * 84 + rnd(-8, 8), 12, 80) + '%';
      el.style.setProperty('--r', rnd(-28, 28).toFixed(1) + 'deg');
    });
  }
  function tidy() {
    const cols = innerWidth < 600 ? 3 : 5;
    const rows = Math.ceil(stickers.length / cols);
    stickers.forEach((el, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      el.style.left = (100 / (cols + 1) * (c + 1)) + '%';
      el.style.top = (100 / (rows + 1) * (r + 1) - 4) + '%';
      el.style.setProperty('--r', '0deg');
    });
  }
  mess();
  d.getElementById('tidy').addEventListener('click', () => { tidy(); W.toast('Ahh, so neat. Marie Kondo would be proud ✨'); });
  d.getElementById('mess').addEventListener('click', () => { mess(); W.toast('That’s more like my actual desk 🙃'); });
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { board.classList.add('in'); o.disconnect(); } }, { threshold: .3 }).observe(board);

  function drag(el) {
    let on = false, ox = 0, oy = 0, lastTap = 0;
    el.addEventListener('pointerdown', e => {
      const now = Date.now();
      if (now - lastTap < 320) { el.classList.remove('spin'); void el.offsetWidth; el.classList.add('spin'); W.sound.blip(900); }
      lastTap = now;
      on = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      el.style.zIndex = ++z;
      const r = el.getBoundingClientRect();
      ox = e.clientX - (r.left + r.width / 2);
      oy = e.clientY - (r.top + r.height / 2);
    });
    el.addEventListener('pointermove', e => {
      if (!on) return;
      const b = board.getBoundingClientRect();
      const x = clamp((e.clientX - ox - b.left) / b.width, .03, .97);
      const y = clamp((e.clientY - oy - b.top) / b.height, .04, .96);
      el.style.left = (x * 100) + '%';
      el.style.top = (y * 100) + '%';
      el.style.setProperty('--r', clamp(e.movementX * 2, -30, 30).toFixed(1) + 'deg');
    });
    const end = () => { if (!on) return; on = false; el.classList.remove('dragging'); el.style.setProperty('--r', rnd(-12, 12).toFixed(1) + 'deg'); };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('animationend', () => el.classList.remove('spin'));
  }
})();
