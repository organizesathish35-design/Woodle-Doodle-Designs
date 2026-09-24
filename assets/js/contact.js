/* ==========================================================================
   Stop 05 — The Post Office
   The letter folds into a paper plane, flies off, then opens the visitor's
   mail app with everything filled in.
   ========================================================================== */
(() => {
  'use strict';

  // Sumouli's contact address, as listed on woodledoodledesigns.com/contact
  const EMAIL = 'woodledoodlepage@gmail.com';

  const W = window.WDD, d = document, M = W.M;
  W.makeRain(d.getElementById('cRain'), { density: .25, alpha: .28, color: '70,90,200', speed: .8 });

  const form = d.getElementById('letter');
  const name = d.getElementById('fName');
  const mail = d.getElementById('fMail');
  const msg = d.getElementById('fMsg');
  const sig = d.getElementById('sigName');
  const err = d.getElementById('lErr');
  const fly = d.getElementById('fly');
  const sent = d.getElementById('sent');
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const complete = () => name.value.trim() && emailOk(mail.value) && msg.value.trim().length > 3;

  let wasReady = false;
  function sync() {
    sig.textContent = name.value.trim() || 'you';
    const ready = !!complete();
    form.classList.toggle('ready-to-send', ready);
    if (ready && !wasReady) W.sound.blip(820);
    wasReady = ready;
  }
  [name, mail, msg].forEach(el => el.addEventListener('input', () => { el.classList.remove('invalid'); err.textContent = ''; sync(); }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [];
    if (!name.value.trim()) bad.push([name, 'your name']);
    if (!emailOk(mail.value)) bad.push([mail, 'an email I can reply to']);
    if (msg.value.trim().length <= 3) bad.push([msg, 'a little story']);
    if (bad.length) {
      bad.forEach(([el]) => { el.classList.remove('invalid'); void el.offsetWidth; el.classList.add('invalid'); });
      err.textContent = `Almost! Just need ${bad.map(b => b[1]).join(' and ')}.`;
      bad[0][0].focus();
      return;
    }
    launch();
  });

  function launch() {
    const topic = (form.querySelector('input[name="topic"]:checked') || {}).value || 'Hello';
    const subject = `✈ ${topic}, from ${name.value.trim()}`;
    const body = `${msg.value.trim()}\n\n— ${name.value.trim()}\n${mail.value.trim()}`;
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const r = form.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    form.classList.add('folding');
    W.sound.blip(500);

    const land = () => {
      fly.style.opacity = 0;
      sent.hidden = false;
      sent.querySelector('h2').setAttribute('tabindex', '-1');
      sent.querySelector('h2').focus({ preventScroll: true });
      W.toast('Plane launched ✈');
      setTimeout(() => { location.href = href; }, 500);
    };
    if (!M || W.reduce) { form.style.visibility = 'hidden'; land(); return; }

    // 1 · fold the letter (Motion keyframes with timed offsets)
    M.animate(form, {
      transform: [
        'perspective(900px) rotateX(0deg) scale(1, 1) rotate(0deg)',
        'perspective(900px) rotateX(70deg) scale(.85, .85) rotate(0deg)',
        'perspective(900px) rotateX(0deg) scale(.4, .25) rotate(-12deg)',
        'perspective(900px) rotateX(0deg) scale(.12, .12) rotate(-30deg)',
      ],
      opacity: [1, 1, 1, 0],
    }, { duration: 1.1, times: [0, .45, .75, 1], ease: [.65, 0, .35, 1] }).then(() => {
      form.style.visibility = 'hidden';
      fly.style.opacity = 1;
      const x0 = cx - 60, y0 = cy - 40;
      W.sound.bell();
      // 2 · the plane loops once, then sails off the top of the screen
      M.animate(fly, {
        transform: [
          `translate(${x0}px, ${y0}px) rotate(10deg) scale(.4)`,
          `translate(${x0 - 90}px, ${y0 + 30}px) rotate(-6deg) scale(1)`,
          `translate(${x0 + 60}px, ${y0 - 120}px) rotate(-28deg) scale(1.05)`,
          `translate(${x0 - 20}px, ${y0 - 220}px) rotate(-60deg) scale(.95)`,
          `translate(${innerWidth + 160}px, -240px) rotate(-18deg) scale(.6)`,
        ],
      }, { duration: 2.1, times: [0, .18, .45, .62, 1], ease: 'easeInOut' }).then(land);
    });
  }

  d.getElementById('again').addEventListener('click', () => {
    sent.hidden = true;
    form.getAnimations().forEach(a => a.cancel());
    form.style.transform = ''; form.style.opacity = '';
    form.reset();
    form.classList.remove('folding', 'ready-to-send');
    form.style.visibility = '';
    wasReady = false;
    sync();
    if (M) M.animate(form, { opacity: [0, 1], transform: ['translateY(40px) rotate(3deg)', 'translateY(0px) rotate(0deg)'] }, { type: 'spring', bounce: .3, duration: .8 });
    name.focus({ preventScroll: true });
  });

  sync();
})();
