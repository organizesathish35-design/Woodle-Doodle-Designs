/* ==========================================================================
   Stop 03 — The Classroom
   ========================================================================== */
(() => {
  'use strict';
  const W = window.WDD, d = document;
  const { lerp } = W;

  /* ---------------------------------------------------------- the desk */
  const doodle = d.querySelector('.self-draw');
  if (doodle) doodle.style.setProperty('--len', Math.ceil(doodle.getTotalLength()));

  const pencils = [...d.querySelectorAll('#desk .pencil')];
  const roll = [1, -.7, .85];
  let px = 0, cx = 0;
  if (W.fine) addEventListener('pointermove', e => { px = e.clientX / innerWidth * 2 - 1; }, { passive: true });
  W.onFrame(() => {
    if (Math.abs(px - cx) < .001) return;
    cx = lerp(cx, px, .05);
    pencils.forEach((p, i) => { p.style.transform = `translateX(${(cx * 22 * roll[i]).toFixed(1)}px) rotate(${(cx * 2 * roll[i]).toFixed(2)}deg)`; });
  });

  /* ------------------------------------------------ tickets: tilt + tear */
  d.querySelectorAll('.tk').forEach(tk => {
    if (W.fine && !W.reduce) {
      tk.addEventListener('pointermove', e => {
        const r = tk.getBoundingClientRect();
        tk.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 10).toFixed(2) + 'deg');
        tk.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 10).toFixed(2) + 'deg');
      });
      tk.addEventListener('pointerleave', () => { tk.style.setProperty('--rx', '0deg'); tk.style.setProperty('--ry', '0deg'); });
    }
    const stub = tk.querySelector('.tk-stub');
    const board = tk.querySelector('.board');
    tk.querySelector('.tear').addEventListener('click', () => {
      if (tk.classList.contains('torn')) return;
      const clone = stub.cloneNode(true);
      clone.classList.add('stub-fall');
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a, button').forEach(x => { x.tabIndex = -1; });
      Object.assign(clone.style, { left: stub.offsetLeft + 'px', top: stub.offsetTop + 'px', width: stub.offsetWidth + 'px', height: stub.offsetHeight + 'px' });
      tk.appendChild(clone);
      if (W.M && !W.reduce) {
        // Motion: the stub flutters down with a little spin
        clone.style.animation = 'none';
        W.M.animate(clone, { transform: ['translate(0px, 0px) rotate(0deg)', 'translate(10px, 20px) rotate(10deg)', 'translate(60px, 320px) rotate(42deg)'], opacity: [1, 1, 0] },
          { duration: 1.2, times: [0, .3, 1], ease: 'easeIn' }).then(() => clone.remove());
        W.M.animate(board, { transform: ['scale(.3) rotate(-12deg)', 'scale(1) rotate(0deg)'], opacity: [0, 1] }, { type: 'spring', bounce: .5, duration: .7, delay: .1 });
      } else clone.addEventListener('animationend', () => clone.remove());
      tk.classList.add('torn');
      const stamp = d.createElement('span');
      stamp.className = 'punched';
      stamp.textContent = 'boarded ✓';
      tk.querySelector('.tk-main').appendChild(stamp);
      W.sound.blip(320);
      setTimeout(() => board.focus({ preventScroll: true }), 120);
      W.toast('Ticket torn! All aboard →');
    });
  });

  /* ---------------------------------------------------- notebook ticks */
  const boxes = [...d.querySelectorAll('.nb-item input')];
  const note = d.getElementById('nbNote');
  const say = n => n === 0 ? 'tick what you’d like to learn. I’ll wait ✏️'
    : n < 3 ? `${n} ticked, a lovely start 🌱`
    : n < 6 ? `${n} ticked. ooh, you’re keen 🎨`
    : n < 9 ? `${n} ticked. you’re basically ArtClub material 🧸`
    : 'all nine! pull up a chair, see you in class ✨';
  const sayClub = n => n === 0 ? 'tick the ones you’re most excited about ✏️'
    : n < 4 ? `${n} ticked, good taste 🌱`
    : n < 8 ? `${n} ticked. you’re going to love it here 🎨`
    : 'all eight! see you inside the club 💖';
  boxes.forEach(b => b.addEventListener('change', () => {
    const n = boxes.filter(x => x.checked).length;
    if (note) note.textContent = (note.dataset.say === 'club' ? sayClub : say)(n);
    W.sound.blip(480 + n * 45);
  }));

  /* ------------------------------------------------ this month's post-it */
  const cal = d.getElementById('cal');
  if (!cal) return;
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  d.getElementById('planMonth').textContent = `${now.toLocaleString('en', { month: 'long' })} plan ✨`;
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  let cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(x => `<span class="dow" aria-hidden="true">${x}</span>`).join('');
  for (let i = 0; i < first; i++) cells += '<span aria-hidden="true"></span>';
  for (let dd = 1; dd <= days; dd++) {
    const today = dd === now.getDate();
    cells += `<span class="day${today ? ' today' : ''}"${today ? ' aria-current="date"' : ''}>${dd}</span>`;
  }
  cal.innerHTML = cells;
})();
