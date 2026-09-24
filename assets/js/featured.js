/* ==========================================================================
   Stop 05 — Featured At: press clippings pinned to a board
   (outlets and links as listed on woodledoodledesigns.com/features)
   ========================================================================== */
(() => {
  'use strict';
  const d = document;
  const PRESS = [
    ['ScoopWhoop', 'A feature on the Instagram page', 'https://www.scoopwhoop.com/women/this-instagram-account-about-being-a-single-desi-girl-will-speak-to-you-on-a-personal-level/'],
    ['Creative Gaga', 'Artist feature', 'https://www.creativegaga.com/sumouli-dutta/'],
    ['Weekend Trivia', 'Getting to know the artist', 'https://weekendtrivia.com/getting-to-know-illustrator-artist-sumouli-dutta-woodledoodledesigns/'],
    ['Stoned Santa', 'An interview about doodles', 'https://www.stonedsanta.in/blog/deciphering-doodles-with-sumouli-dutta/'],
    ['Shivin Creations', 'Founder feature', 'https://shivincreations.com/2018/03/07/sumouli-dutta-founder-of-woodle-doodle-designs/'],
    ['Eat My News', 'On making quality work', 'https://www.eatmy.news/2020/09/earning-will-follow-you-if-you-are-able.html'],
    ['The Talented Indian', 'Artist spotlight', 'https://www.thetalentedindian.com/tales-of-worlds-that-she-makes-glow-sumouli-dutta/'],
  ];
  const tilt = [-3, 2, -1.5, 3, -2.5, 1.5, -1];
  const colors = ['#e5483b', '#3148c8', '#2f8a86', '#f3ab3a', '#ef8fa0', '#7088e2', '#6d4bb8'];
  const board = d.getElementById('pressBoard');
  board.innerHTML = PRESS.map(([outlet, what, url], i) => `
    <a class="clip" href="${url}" target="_blank" rel="noopener" style="--r:${tilt[i]}deg;--c:${colors[i]}" data-reveal="pop" data-cursor="read ↗">
      <span class="clip-pin" aria-hidden="true"></span>
      <span class="clip-no hand">no. ${String(i + 1).padStart(2, '0')}</span>
      <span class="clip-outlet display">${outlet}</span>
      <span class="clip-what">${what}</span>
      <span class="clip-lines" aria-hidden="true"></span>
      <span class="clip-read hand">read the feature ↗</span>
    </a>`).join('');
  if (window.WDD && WDD.observe) WDD.observe(board);
})();
