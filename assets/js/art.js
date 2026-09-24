/* ==========================================================================
   Woodle Doodle — painted vignettes
   Hand-built SVG "paintings" (4:5, like an Instagram post) that stand in for
   Sumouli's real artwork. To use real pieces, give a PIECES entry an `img`
   path (e.g. img: 'assets/art/rainy-bus-stop.jpg') and it will be used instead.
   ========================================================================== */
(() => {
  'use strict';
  let uid = 0;

  const wrap = (u, inner, scale = 9) => `<svg viewBox="0 0 400 500" width="400" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="pp${u}" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="3" seed="${u % 50}" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <clipPath id="cp${u}"><rect width="400" height="500"/></clipPath>
    </defs>
    <g clip-path="url(#cp${u})"><g filter="url(#pp${u})">${inner}</g></g>
  </svg>`;

  // seeded random so each vignette looks the same every time
  const rng = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const circles = (list, fill, extra = '') => `<g fill="${fill}" ${extra}>${list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
  const rainLines = (seed, n, box, color = '#dfe3ff', op = .55) => {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = box[0] + r() * box[2], y = box[1] + r() * box[3], l = 10 + r() * 18;
      s += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}l-${(l * .25).toFixed(1)} ${l.toFixed(1)}"/>`;
    }
    return `<g stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="${op}">${s}</g>`;
  };

  const SCENES = {
    /* ------------------------------------------------ Waiting for the 327 */
    busstop: u => `
      <defs>
        <linearGradient id="s${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3aa3"/><stop offset=".62" stop-color="#8b98e6"/><stop offset="1" stop-color="#e9c4b4"/></linearGradient>
        <radialGradient id="l${u}"><stop offset="0" stop-color="#ffe7a8"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>
      </defs>
      <rect x="-20" y="-20" width="440" height="540" fill="url(#s${u})"/>
      <path d="M-20 300V230h40v-30h30v40h40v-60h30v70h50v-30h40v60H-20z" fill="#8791dc" opacity=".7"/>
      <path d="M40 330c0-60 4-110-8-160" stroke="#3a468f" stroke-width="14" fill="none"/>
      ${circles([[40, 150, 90], [150, 110, 82], [30, 250, 70], [170, 210, 62]], '#24399c')}
      ${circles([[110, 88, 50], [40, 168, 40], [190, 160, 36]], '#3d62c6')}
      ${circles([[70, 260, 40], [180, 250, 34]], '#2a7f86')}
      ${circles([[130, 66, 20], [55, 128, 17], [196, 140, 14], [96, 196, 12]], '#86c486', 'opacity=".9"')}
      <rect x="280" y="-20" width="140" height="350" fill="#efd3b4"/>
      <rect x="280" y="-20" width="16" height="350" fill="#d8b596"/>
      <rect x="312" y="56" width="72" height="84" fill="#ffd98a"/>
      <path d="M312 98h72M348 56v84" stroke="#8a5a3a" stroke-width="5"/>
      <path d="M300 250h120v24c-8 10-15 0-20 0s-12 10-20 0-12 10-20 0-12 10-20 0-12 10-20 0-12 10-20 0z" fill="#e5483b"/>
      <circle cx="296" cy="214" r="80" fill="url(#l${u})"/>
      <path d="M284 196h24l-5 20h-14z" fill="#1b1f4b"/>
      <rect x="-20" y="322" width="440" height="42" fill="#a3aae6"/>
      <rect x="-20" y="362" width="440" height="160" fill="#4d5abc"/>
      <path d="M288 366c6 40-4 80 4 140h20c-6-60 4-100-2-140z" fill="#f4ad62" opacity=".75"/>
      <path d="M146 366c4 30-2 60 3 100h10c-4-40 3-70-1-100z" fill="#e5483b" opacity=".6"/>
      <ellipse cx="190" cy="430" rx="130" ry="14" fill="#b4bbf2" opacity=".55"/>
      <rect x="148" y="176" width="6" height="170" fill="#dcdff2"/>
      <circle cx="151" cy="172" r="25" fill="#e5483b" stroke="#f7f0e3" stroke-width="5"/>
      <path d="M186 268c8-44 92-44 100 0q-12-9-25 0q-12-9-25 0q-12-9-25 0q-12-9-25 0z" fill="#e5483b"/>
      <path d="M236 232v70" stroke="#1b1f4b" stroke-width="3"/>
      <path d="M223 292c0-18 26-18 26 0l-4 34h-18z" fill="#2a2140"/>
      <circle cx="236" cy="286" r="11" fill="#f2c3a0"/>
      <path d="M220 304h32l8 44h-48z" fill="#f3ab3a"/>
      <rect x="222" y="346" width="10" height="10" rx="3" fill="#e5483b"/><rect x="240" y="346" width="10" height="10" rx="3" fill="#e5483b"/>
      <ellipse cx="190" cy="342" rx="12" ry="14" fill="#fff8ec"/><circle cx="190" cy="324" r="9" fill="#fff8ec"/>
      <path d="M183 318l1-9 5 5zM197 318l-1-9-5 5z" fill="#fff8ec"/>
      <g transform="translate(110 420)"><path d="M-22 0h44l-8 10h-28z" fill="#fff8ec"/><path d="M-12 0l10-20v20z" fill="#f7f0e3"/><path d="M-2-20l12 20h-12z" fill="#d9dcf0"/></g>
      ${rainLines(3, 70, [-10, -10, 420, 520])}`,

    /* ------------------------------------------------- Chai by the window */
    chai: u => `
      <defs><linearGradient id="w${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3aa3"/><stop offset="1" stop-color="#7c8de0"/></linearGradient>
      <radialGradient id="g${u}"><stop offset="0" stop-color="#ffd98a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>
      <rect x="-20" y="-20" width="440" height="540" fill="#f2d4b3"/>
      <rect x="50" y="40" width="300" height="270" rx="10" fill="url(#w${u})"/>
      ${circles([[90, 300, 70], [200, 318, 60], [320, 292, 80]], '#2a7f86')}
      ${circles([[140, 276, 32], [290, 250, 26]], '#5aa05a')}
      ${rainLines(7, 46, [55, 45, 290, 250])}
      <rect x="50" y="40" width="300" height="270" rx="10" fill="none" stroke="#f7f0e3" stroke-width="12"/>
      <path d="M200 40v270M50 175h300" stroke="#f7f0e3" stroke-width="8"/>
      <rect x="30" y="304" width="340" height="26" rx="4" fill="#e7c08e"/>
      <path d="M70 272h50l-6 34h-38z" fill="#d0673f"/>
      <g fill="#5aa05a"><ellipse cx="82" cy="246" rx="10" ry="26" transform="rotate(-25 82 246)"/><ellipse cx="106" cy="240" rx="10" ry="28" transform="rotate(20 106 240)"/><ellipse cx="95" cy="232" rx="8" ry="30"/></g>
      <rect x="-20" y="330" width="440" height="190" fill="#b8744a"/>
      <path d="M-20 384h440M-20 446h440" stroke="#9c5f3b" stroke-width="3" opacity=".5"/>
      <circle cx="300" cy="350" r="110" fill="url(#g${u})"/>
      <g transform="rotate(-8 130 420)"><rect x="56" y="380" width="160" height="104" rx="4" fill="#fff8ec"/><path d="M136 380v104" stroke="#e6d6b8" stroke-width="3"/><path d="M76 424c20-22 36 12 52-8M150 410c14 14 30-10 50 6M152 440h44" stroke="#3148c8" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g transform="rotate(22 262 462)"><rect x="220" y="456" width="92" height="11" fill="#f3ab3a"/><path d="M312 456l16 5.5-16 5.5z" fill="#f2c3a0"/><rect x="214" y="456" width="8" height="11" fill="#ef8fa0"/></g>
      <ellipse cx="300" cy="374" rx="46" ry="10" fill="#f7f0e3"/>
      <path d="M268 330h64l-6 42h-52z" fill="#e5483b"/>
      <path d="M332 338c18 0 18 24 0 24" stroke="#e5483b" stroke-width="7" fill="none"/>
      <ellipse cx="300" cy="331" rx="32" ry="6" fill="#c98a4a"/>
      <g stroke="#fff8ec" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"><path d="M288 318c-10-14 10-22 0-40"/><path d="M308 316c-10-14 10-24 0-44"/></g>`,

    /* ------------------------------------------------------ Rooftop moon */
    moon: u => {
      const r = rng(11); let stars = '';
      for (let i = 0; i < 26; i++) stars += `<circle cx="${(r() * 400).toFixed(0)}" cy="${(r() * 200).toFixed(0)}" r="${(1 + r() * 2).toFixed(1)}"/>`;
      return `
      <defs><linearGradient id="n${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141a52"/><stop offset="1" stop-color="#3a4fbf"/></linearGradient>
      <radialGradient id="m${u}"><stop offset="0" stop-color="#fff3c9" stop-opacity=".55"/><stop offset="1" stop-color="#fff3c9" stop-opacity="0"/></radialGradient></defs>
      <rect x="-20" y="-20" width="440" height="540" fill="url(#n${u})"/>
      <g fill="#fff3c9" opacity=".8">${stars}</g>
      <circle cx="290" cy="110" r="120" fill="url(#m${u})"/>
      <circle cx="290" cy="110" r="44" fill="#fff3c9"/>
      <circle cx="276" cy="100" r="8" fill="#f1e2ad"/><circle cx="302" cy="124" r="5" fill="#f1e2ad"/>
      <path d="M-20 300h120v-40h80v60h70v-90h90v70h80v-30h20V520H-20z" fill="#232a6e"/>
      <g fill="#ffd98a"><rect x="30" y="320" width="14" height="18"/><rect x="200" y="260" width="14" height="18"/><rect x="226" y="260" width="14" height="18"/><rect x="330" y="300" width="14" height="18" opacity=".6"/></g>
      <rect x="110" y="236" width="36" height="26" rx="6" fill="#3a46a4"/><rect x="270" y="206" width="30" height="26" rx="6" fill="#3a46a4"/>
      <path d="M-20 370h90v-30h110v50h100v-40h140V520H-20z" fill="#2d379a"/>
      <g fill="#ffd98a"><rect x="96" y="360" width="16" height="20"/><rect x="220" y="390" width="16" height="20"/><rect x="330" y="372" width="16" height="20" opacity=".7"/></g>
      <path d="M20 342q120 26 250-6" stroke="#f7f0e3" stroke-width="2" fill="none"/>
      <path d="M52 348h22l-2 26h-18z" fill="#e5483b"/><path d="M92 352l12 0 8 26-24 0z" fill="#f3ab3a"/>
      <path d="M130 354h26v18h-26z" fill="#ef8fa0"/><path d="M178 352h20l4 30h-28z" fill="#5aa05a"/><path d="M222 348h18v20h-18z" fill="#b3b9f0"/>
      <g fill="#141a52"><ellipse cx="330" cy="264" rx="14" ry="10"/><circle cx="318" cy="254" r="7"/><path d="M313 250l1-7 4 4zM322 249l2-7 2 6z"/><path d="M344 266c10-2 12-14 6-20" stroke="#141a52" stroke-width="3" fill="none"/></g>`;
    },

    /* ----------------------------------------- Where the paper boat goes */
    boat: u => `
      <defs><linearGradient id="b${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6dd2"/><stop offset="1" stop-color="#2f3fa8"/></linearGradient></defs>
      <rect x="-20" y="-20" width="440" height="540" fill="url(#b${u})"/>
      <circle cx="330" cy="70" r="110" fill="#2a7f86" opacity=".6"/>
      <circle cx="60" cy="120" r="90" fill="#7c8de0" opacity=".5"/>
      <path d="M260 -20c6 80-6 160 4 260h22c-8-100 4-180-2-260z" fill="#f4ad62" opacity=".45"/>
      <g fill="none" stroke="#c7ccf7" stroke-width="2.5" opacity=".6"><ellipse cx="200" cy="310" rx="120" ry="36"/><ellipse cx="200" cy="310" rx="170" ry="56"/><ellipse cx="200" cy="310" rx="220" ry="78"/></g>
      <ellipse cx="80" cy="400" rx="22" ry="9" fill="#f3ab3a" transform="rotate(30 80 400)"/>
      <ellipse cx="330" cy="420" rx="20" ry="8" fill="#5aa05a" transform="rotate(-20 330 420)"/>
      <ellipse cx="310" cy="150" rx="18" ry="7" fill="#e5483b" transform="rotate(40 310 150)"/>
      <ellipse cx="100" cy="220" rx="16" ry="7" fill="#86c486" transform="rotate(-50 100 220)"/>
      <ellipse cx="200" cy="330" rx="96" ry="12" fill="#1b1f4b" opacity=".25"/>
      <path d="M108 284h184l-30 42h-124z" fill="#fff8ec"/>
      <path d="M140 284l52-94v94z" fill="#f7f0e3"/>
      <path d="M192 190l60 94h-60z" fill="#d9dcf0"/>
      <path d="M192 190v94" stroke="#c9cdf2" stroke-width="2"/>
      <path d="M150 262l28-50M160 270l20-34" stroke="#3148c8" stroke-width="2" opacity=".4" stroke-linecap="round"/>
      ${rainLines(21, 20, [0, 0, 400, 500], '#e7e9ff', .35)}`,

    /* ---------------------------------------------------- The lemon tree */
    lemon: u => {
      const r = rng(5); let lemons = '';
      const spots = [[120, 170], [180, 120], [250, 150], [300, 210], [150, 250], [220, 220], [270, 280], [100, 230], [200, 290], [330, 160], [240, 90]];
      spots.forEach(([x, y]) => {
        const a = (r() * 80 - 40).toFixed(0);
        lemons += `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="15" ry="11" fill="#f7d33a"/><ellipse cx="${x - 4}" cy="${y - 4}" rx="4" ry="2.5" fill="#fff6c2"/></g>`;
      });
      return `
      <defs><linearGradient id="k${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb0f0"/><stop offset="1" stop-color="#f7f0e3"/></linearGradient></defs>
      <rect x="-20" y="-20" width="440" height="540" fill="url(#k${u})"/>
      <circle cx="340" cy="70" r="42" fill="#ffd98a"/>
      <path d="M200 520c0-90 10-150-12-220M196 360c30-20 60-30 90-60M194 390c-30-20-60-30-80-70" stroke="#8a5a3a" stroke-width="20" fill="none" stroke-linecap="round"/>
      ${circles([[110, 200, 90], [210, 150, 104], [310, 200, 84], [170, 270, 84], [290, 280, 72]], '#2f8a86')}
      ${circles([[160, 150, 56], [260, 130, 54], [120, 250, 46], [320, 240, 40]], '#5aa05a')}
      ${circles([[210, 100, 26], [140, 120, 18], [300, 170, 20], [240, 240, 20]], '#9fd18a', 'opacity=".9"')}
      ${lemons}
      <path d="M-20 440c120-36 300-36 440 0V520H-20z" fill="#9fcf8a"/>
      <path d="M-20 470c140-20 300-16 440 6V520H-20z" fill="#7cbd73"/>
      <path d="M52 432h100l-12 54h-76z" fill="#c98a4a"/>
      <path d="M58 450h88M62 468h80" stroke="#a36b36" stroke-width="3"/>
      <ellipse cx="82" cy="430" rx="14" ry="10" fill="#f7d33a"/><ellipse cx="108" cy="426" rx="14" ry="10" fill="#f7d33a"/><ellipse cx="128" cy="432" rx="13" ry="9" fill="#f3c42a"/>`;
    },

    /* ------------------------------------------------- Afternoon cat nap */
    cat: u => `
      <rect x="-20" y="-20" width="440" height="540" fill="#ef8fa0"/>
      <rect x="-20" y="330" width="440" height="190" fill="#e6b38a"/>
      <rect x="160" y="50" width="150" height="190" rx="8" fill="#b3b9f0"/>
      <circle cx="270" cy="100" r="22" fill="#ffd98a"/>
      <path d="M160 145h150M235 50v190" stroke="#fff8ec" stroke-width="8"/>
      <rect x="160" y="50" width="150" height="190" rx="8" fill="none" stroke="#fff8ec" stroke-width="10"/>
      <path d="M170 240l140 0 90 280h-270z" fill="#ffe2a6" opacity=".7"/>
      <path d="M30 330l0-60c10-40 50-40 60 0v60z" fill="#5aa05a"/>
      <path d="M22 330h76l-8 56h-60z" fill="#d0673f"/>
      <ellipse cx="210" cy="400" rx="140" ry="46" fill="#3148c8"/>
      <g fill="#b3b9f0">${[[120, 392], [160, 410], [200, 388], [250, 414], [290, 396], [230, 430], [150, 430]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g>
      <path d="M296 392c26 26-30 56-130 44" stroke="#fff8ec" stroke-width="18" fill="none" stroke-linecap="round"/>
      <ellipse cx="214" cy="376" rx="90" ry="42" fill="#fff8ec"/>
      <ellipse cx="244" cy="360" rx="34" ry="18" fill="#f3ab3a"/>
      <circle cx="148" cy="370" r="31" fill="#fff8ec"/>
      <path d="M126 350l2-26 18 14zM164 344l10-22 6 24z" fill="#fff8ec"/>
      <path d="M130 344l2-12 8 7z" fill="#ef8fa0"/>
      <path d="M134 372q6 5 12 0M152 372q6 5 12 0" stroke="#1b1f4b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M146 382l3 3 3-3z" fill="#ef8fa0"/>
      <path d="M100 300h16l-16 16h16M76 270h12l-12 12h12" stroke="#1b1f4b" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="340" cy="456" r="24" fill="#e5483b"/>
      <path d="M322 446c12 6 26 6 36 0M320 462c14 6 26 6 38-2M334 434c-4 14-4 28 4 44" stroke="#f7a09a" stroke-width="3" fill="none"/>
      <path d="M316 462c-40 20-80 0-120 20" stroke="#e5483b" stroke-width="3" fill="none"/>`,

    /* ------------------------------------------------ A crowd of umbrellas */
    umbrellas: u => {
      const brol = (cx, cy, r, c1, c2) => {
        let w = '';
        for (let k = 0; k < 8; k += 2) {
          const a1 = k * Math.PI / 4, a2 = (k + 1) * Math.PI / 4;
          w += `<path d="M${cx} ${cy}L${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a2)).toFixed(1)} ${(cy + r * Math.sin(a2)).toFixed(1)}z" fill="${c2}"/>`;
        }
        return `<ellipse cx="${cx + 6}" cy="${cy + 8}" rx="${r}" ry="${r}" fill="#1b1f4b" opacity=".25"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${c1}"/>${w}<circle cx="${cx}" cy="${cy}" r="4" fill="#1b1f4b"/>`;
      };
      return `
      <rect x="-20" y="-20" width="440" height="540" fill="#4b57b8"/>
      <g fill="#f7f0e3" opacity=".75">${Array.from({ length: 9 }, (_, i) => `<rect x="${-10 + i * 48}" y="170" width="26" height="170"/>`).join('')}</g>
      <path d="M-20 80h440M-20 440h440" stroke="#f3ab3a" stroke-width="6" stroke-dasharray="30 20"/>
      ${brol(80, 120, 52, '#e5483b', '#f7a09a')}
      ${brol(230, 90, 44, '#f3ab3a', '#ffd98a')}
      ${brol(340, 170, 50, '#2f8a86', '#6cc2b8')}
      ${brol(150, 250, 58, '#3148c8', '#7088e2')}
      ${brol(300, 300, 46, '#ef8fa0', '#fbd0d7')}
      ${brol(70, 380, 48, '#5aa05a', '#9fd18a')}
      ${brol(210, 420, 54, '#fff8ec', '#e6d6b8')}
      ${brol(360, 440, 40, '#e5483b', '#f3ab3a')}
      ${rainLines(9, 60, [-10, -10, 420, 520], '#dfe3ff', .45)}`;
    },

    /* ----------------------------------------------- The old tram in fog */
    tram: u => `
      <defs><linearGradient id="f${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd3f4"/><stop offset="1" stop-color="#efe4f0"/></linearGradient>
      <linearGradient id="h${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f0e3" stop-opacity="0"/><stop offset="1" stop-color="#f7f0e3" stop-opacity=".8"/></linearGradient>
      <radialGradient id="e${u}"><stop offset="0" stop-color="#fff3c9"/><stop offset="1" stop-color="#fff3c9" stop-opacity="0"/></radialGradient></defs>
      <rect x="-20" y="-20" width="440" height="540" fill="url(#f${u})"/>
      <path d="M-20 330V200h50v-40h40v60h60v-80h40v80h80v-50h50v70h60v-30h40v130z" fill="#b9bee9" opacity=".8"/>
      <path d="M-20 120c150 16 250 16 440-4" stroke="#6f78c7" stroke-width="2" fill="none"/>
      <path d="M40 330V140M360 330V150" stroke="#9aa2e0" stroke-width="6"/>
      <circle cx="40" cy="140" r="26" fill="url(#e${u})"/><circle cx="360" cy="150" r="26" fill="url(#e${u})"/>
      <path d="M-20 520L150 330h100l170 190z" fill="#b9bde8"/>
      <path d="M110 520L180 330M170 520L192 330M230 520L208 330M290 520L220 330" stroke="#8c93d6" stroke-width="4"/>
      <path d="M200 176l-22-46 44-10" stroke="#1b1f4b" stroke-width="3" fill="none"/>
      <rect x="128" y="172" width="144" height="16" rx="6" fill="#e39a2c"/>
      <rect x="118" y="184" width="164" height="156" rx="18" fill="#f3ab3a"/>
      <rect x="164" y="190" width="72" height="16" rx="3" fill="#1b1f4b"/>
      <rect x="136" y="214" width="128" height="70" rx="8" fill="#b3b9f0"/>
      <path d="M200 214v70" stroke="#f3ab3a" stroke-width="5"/>
      <rect x="118" y="294" width="164" height="16" fill="#3148c8"/>
      <circle cx="150" cy="324" r="9" fill="#fff3c9"/><circle cx="250" cy="324" r="9" fill="#fff3c9"/>
      <circle cx="150" cy="324" r="30" fill="url(#e${u})"/><circle cx="250" cy="324" r="30" fill="url(#e${u})"/>
      <path d="M40 400c0-30 60-30 60 0z" fill="#9aa2e0"/><path d="M70 400v40" stroke="#9aa2e0" stroke-width="4"/>
      <path d="M300 420c0-34 70-34 70 0z" fill="#e5483b" opacity=".7"/><path d="M335 420v40" stroke="#e5483b" stroke-width="4" opacity=".7"/>
      <rect x="-20" y="300" width="440" height="220" fill="url(#h${u})"/>`,
  };

  // Sumouli's own artwork, served from her Wix media library at 4:5 (the frame shape).
  // Remove an `img` line to fall back to the hand-drawn stand-in for that slot.
  const wix = (id, ext) => `https://static.wixstatic.com/media/5dfe12_${id}~mv2.${ext}/v1/fill/w_800,h_1000,al_c,q_85,enc_auto/${id}.${ext}`;
  const PIECES = [
    { key: 'busstop',   img: wix('dfe700e7e2c748f09592ac5960778e86', 'jpg'), title: 'The studio',               note: 'Where it all happens: a warm lamp, a busy desk and a lot of sketches.', tag: 'personal' },
    { key: 'chai',      img: wix('3b48d66333814b229621474e8cc9f1d9', 'jpg'), title: 'Wedding portrait',         note: 'A custom illustration made for a couple’s big day.',                    tag: 'custom illustration' },
    { key: 'moon',      img: wix('f3f8697155b14a99bf29a0c179ef540b', 'jpg'), title: 'Festive illustration',     note: 'Colour, gold and a glowing moon.',                                       tag: 'illustration' },
    { key: 'boat',      img: wix('9e1df5eff5e345cf97be6b5a462d3a6d', 'jpg'), title: 'The Muslim Girl Who Loved Christmas', note: 'Cover illustration for a picture book full of festive colour.',       tag: 'children’s book' },
    { key: 'lemon',     img: wix('27b31ff26c734b02a81d50ba2672bd03', 'png'), title: 'Who Will I Be?',           note: 'Illustrations for the children’s book by Ann Thomas.',                   tag: 'children’s book' },
    { key: 'cat',       img: wix('8d421f503f344c3a8f1f55e90f29c47d', 'jpg'), title: 'Pet portrait',             note: 'A custom portrait of a very good dog.',                                  tag: 'custom illustration' },
    { key: 'umbrellas', img: wix('6c0f990d59814192b238f7e9418244fc', 'jpg'), title: 'WhatsApp Diwali stickers', note: 'A festive sticker pack made for WhatsApp.',                             tag: 'brand work' },
    { key: 'tram',      img: wix('56a8ef677ba449a4adb2874c2550c4f5', 'jpg'), title: 'Brand collaboration',      note: 'An illustration made for a brand campaign.',                            tag: 'brand work' },
  ];

  /* Each painting is built once, turned into an image, and reused.
     An <img> is rasterised a single time, so moving/rotating it later is nearly free,
     whereas an inline SVG with paint filters would be re-filtered on every repaint. */
  const cache = {};
  const url = key => {
    if (cache[key]) return cache[key];
    const u = ++uid;
    const markup = wrap(u, (SCENES[key] || SCENES.busstop)(u));
    try { cache[key] = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' })); }
    catch (e) { cache[key] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup); }
    return cache[key];
  };
  /* Every public piece from woodledoodledesigns.com, for the My Projects gallery.
     [wix id, file type, width, height, title, category] */
  const CATS = { books: 'Children’s book', custom: 'Customised illustration', invites: 'Invitation card', brands: 'Brand collaboration' };
  const WORK = [
    ['27b31ff26c734b02a81d50ba2672bd03', 'png', 1000, 1000, 'Who Will I Be?', 'books'],
    ['3b48d66333814b229621474e8cc9f1d9', 'jpg', 587, 1000, 'Wedding portrait', 'custom'],
    ['6c0f990d59814192b238f7e9418244fc', 'jpg', 1000, 1000, 'WhatsApp Diwali stickers', 'brands'],
    ['970c4aeb05d84d8dabc3f291d27299f3', 'jpg', 857, 1000, 'Save the date', 'invites'],
    ['8af558337c1041a6ad2a3ded7ae336f0', 'png', 1000, 750, 'Echo and Shadow', 'books'],
    ['32ae382833534b388d6157fd9ef50e45', 'jpg', 1000, 1000, 'Couple portrait', 'custom'],
    ['56a8ef677ba449a4adb2874c2550c4f5', 'jpg', 1000, 810, 'Brand collaboration', 'brands'],
    ['9e1df5eff5e345cf97be6b5a462d3a6d', 'jpg', 750, 1000, 'The Muslim Girl Who Loved Christmas', 'books'],
    ['eb3c98319fc940b896692f70f2ecec71', 'jpg', 810, 1000, 'Invitation illustration', 'invites'],
    ['f3f8697155b14a99bf29a0c179ef540b', 'jpg', 904, 1000, 'Festive illustration', 'custom'],
    ['1fa1fed4f399418d95b83e1e7d5cf6ae', 'png', 766, 1000, 'All about you, for Livogen', 'brands'],
    ['349d94aa38594a5f9acf6e26fcaf134a', 'png', 1000, 1000, 'Couple portrait in bloom', 'custom'],
    ['5c80cb3460d141a98796559056556d05', 'jpg', 1000, 1000, 'Stink Series', 'books'],
    ['2019d92c4c8b4268aa4776368488c9ad', 'jpg', 857, 1000, 'Rick & Shikha, save the date', 'invites'],
    ['2601f2992aff4c55a78ddd47fd00fbf6', 'jpg', 707, 1000, 'Family memories', 'custom'],
    ['4e9cbf49fd794f78bcd727934b14a863', 'jpg', 1000, 1000, 'Baby hero sticker set', 'brands'],
    ['72a0c3e451e241ec8e4689cf3625c5ac', 'jpeg', 1000, 568, 'হুলো বিড়াল আর টুলো বিড়াল', 'books'],
    ['a432d5f5d220492fafe348cfb37e5fd7', 'jpg', 800, 1000, 'Happiness is…', 'custom'],
    ['1fe361d7337a4d06a7d505d6bf177d85', 'jpg', 1000, 664, 'Wedding invitation', 'invites'],
    ['8d421f503f344c3a8f1f55e90f29c47d', 'jpg', 1000, 1000, 'Pet portrait', 'custom'],
    ['f6f66a475c3d43d8a6300e257e7f17fc', 'png', 766, 1000, 'Reality, for Livogen', 'brands'],
    ['38506548c979441ca441249e6bc8053f', 'png', 1000, 1000, 'আমার বাঘমামাই', 'books'],
    ['4b5b6346e1584f02ba2e59faab94b539', 'jpg', 1000, 1000, 'On the river', 'custom'],
    ['9c4eaee87a4a412db1b6f6993a018a0f', 'png', 1000, 1000, 'Swetha & Rakesh', 'invites'],
    ['79f90ce5b026471582f7a53e4759bc5b', 'jpg', 706, 1000, 'Mr & Mrs', 'custom'],
    ['d6e06efeb6d441b1bd4bb4ec9d1d880a', 'jpg', 838, 1000, 'I’m awesome and I know it', 'brands'],
    ['0f8f413805594fc49d6d70659651f1d2', 'jpg', 1000, 1000, 'Tales From My Heart, Ruskin Bond', 'books'],
    ['f8460d735b0b4beba2848f4e78972dd6', 'jpg', 664, 1000, 'Bumble to my bee', 'custom'],
    ['3296f9f73e02493996bece7851b07e6b', 'jpg', 838, 1000, 'I am the future Einstein', 'brands'],
    ['3f2c6ebb6e1b47ab9f796bbd2fa8853c', 'jpg', 1000, 664, 'Family wedding', 'custom'],
    ['234efa5d6bc241a793dfe3b7579df359', 'jpg', 1000, 500, 'Day and night, a picture-book spread', 'books'],
    ['2de6d26b97324b99b0040bbbe50fe1d4', 'jpg', 750, 1000, 'Wedding night', 'custom'],
    ['12c292fb3d234268a2e508715e2f8544', 'jpg', 857, 1000, 'Kolkata airport', 'custom'],
  ].map(([id, ext, w, h, title, cat]) => ({ id, ext, w, h, title, cat, label: CATS[cat] }));
  // any size of any piece, straight from her Wix media library
  const photo = (p, width) => `https://static.wixstatic.com/media/5dfe12_${p.id}~mv2.${p.ext}/v1/fill/w_${width},h_${Math.round(width * p.h / p.w)},al_c,q_85,enc_auto/${p.id}.${p.ext}`;

  const svg = (key, alt = '') => {
    const p = PIECES.find(x => x.key === key);
    const src = p && p.img ? p.img : url(key);
    return `<img class="art-img" src="${src}" alt="${alt}" decoding="async" draggable="false">`;
  };

  window.WDD = Object.assign(window.WDD || {}, { art: { svg, PIECES, SCENES, rng, WORK, CATS, photo } });
})();
