/* ===================================================================
   Portowa Fala — ilustracje miejsca (panorama, port, sala, taras)
   window.placeArt("panorama" | "port" | "interior" | "terrace")
   =================================================================== */
(function () {
  "use strict";

  const W = 1200, H = 700;

  const SCENES = {
    /* Widok na morze z tarasu — zachód słońca nad Bałtykiem */
    panorama: () => `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#16324f"/><stop offset="0.38" stop-color="#6b6489"/>
          <stop offset="0.62" stop-color="#d97f6a"/><stop offset="0.78" stop-color="#f6b97a"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2b7292"/><stop offset="0.35" stop-color="#1b4f6c"/>
          <stop offset="1" stop-color="#08202f"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#fff0bd" stop-opacity="0.95"/>
          <stop offset="0.35" stop-color="#ffce7a" stop-opacity="0.6"/>
          <stop offset="1" stop-color="#ffb15a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      <ellipse cx="820" cy="470" rx="330" ry="200" fill="url(#glow)"/>
      <circle cx="820" cy="470" r="62" fill="#ffe6a2"/>
      <g fill="#ffffff" opacity="0.12">
        <ellipse cx="230" cy="150" rx="190" ry="34"/><ellipse cx="330" cy="126" rx="120" ry="26"/>
        <ellipse cx="880" cy="120" rx="170" ry="28"/><ellipse cx="760" cy="104" rx="100" ry="20"/>
      </g>
      <rect y="470" width="${W}" height="230" fill="url(#sea)"/>
      <g fill="#ffe3a6" opacity="0.55">
        <ellipse cx="820" cy="500" rx="60" ry="7"/><ellipse cx="820" cy="524" rx="96" ry="6" opacity="0.7"/>
        <ellipse cx="820" cy="552" rx="140" ry="5" opacity="0.5"/><ellipse cx="820" cy="586" rx="190" ry="4" opacity="0.35"/>
        <ellipse cx="820" cy="626" rx="240" ry="3" opacity="0.25"/>
      </g>
      <g stroke="#ffffff" stroke-linecap="round" opacity="0.16" fill="none">
        <path d="M40 520 q60 -12 120 0 t120 0" stroke-width="3"/>
        <path d="M300 570 q70 -14 140 0 t140 0" stroke-width="3"/>
        <path d="M60 620 q80 -16 160 0 t160 0" stroke-width="4"/>
        <path d="M520 640 q90 -14 180 0 t180 0" stroke-width="4"/>
      </g>
      <g fill="#0b1b26">
        <path d="M980 470 h220 v14 h-220 z"/>
        <path d="M1030 470 l10 -26 h12 l10 26 z"/>
        <path d="M1160 470 l10 -26 h12 l10 26 z"/>
        <rect x="1000" y="484" width="10" height="52"/><rect x="1080" y="484" width="10" height="52"/>
        <rect x="1150" y="484" width="10" height="52"/><rect x="1190" y="484" width="10" height="52"/>
      </g>
      <g fill="#0d1f2c">
        <path d="M120 486 q34 -10 68 0 l-8 10 q-26 -6 -52 0 z"/>
        <rect x="150" y="440" width="4" height="46"/><path d="M154 442 l34 20 -34 16 z"/>
      </g>
      <g stroke="#0d1f2c" stroke-width="3" fill="none" opacity="0.85">
        <path d="M300 190 q14 -12 28 0"/><path d="M318 190 q14 -12 28 0"/>
        <path d="M520 140 q12 -10 24 0"/><path d="M536 140 q12 -10 24 0"/>
      </g>`,
    /* Restauracja w porcie rybackim we Władysławowie */
    port: () => `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8fc7e8"/><stop offset="0.7" stop-color="#d8ecf4"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f7d97"/><stop offset="1" stop-color="#174b63"/>
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fdf6ea"/><stop offset="1" stop-color="#efe0c8"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      <g fill="#ffffff" opacity="0.7">
        <ellipse cx="220" cy="120" rx="150" ry="34"/><ellipse cx="300" cy="98" rx="96" ry="26"/>
        <ellipse cx="960" cy="150" rx="170" ry="30"/><ellipse cx="860" cy="128" rx="100" ry="22"/>
      </g>
      <rect y="420" width="${W}" height="280" fill="url(#sea)"/>
      <g stroke="#ffffff" opacity="0.18" stroke-width="4" fill="none">
        <path d="M20 470 q70 -14 140 0 t140 0"/><path d="M420 520 q80 -16 160 0 t160 0"/>
        <path d="M760 470 q70 -14 140 0 t140 0"/><path d="M120 610 q90 -16 180 0 t180 0"/>
      </g>
      <!-- budynek restauracji -->
      <g>
        <path d="M150 300 l250 -70 250 70 z" fill="#c0473c"/>
        <path d="M150 300 h500 v120 h-500 z" fill="url(#wall)"/>
        <rect x="150" y="420" width="500" height="12" fill="#d9cbb2"/>
        <g fill="#8fc3d8" stroke="#7f9bb0" stroke-width="3">
          <rect x="180" y="322" width="84" height="66"/><rect x="286" y="322" width="84" height="66"/>
          <rect x="392" y="322" width="84" height="66"/><rect x="498" y="322" width="84" height="66"/>
        </g>
        <g fill="#bcd9e6" opacity="0.75">
          <rect x="186" y="328" width="30" height="24"/><rect x="292" y="328" width="30" height="24"/>
          <rect x="398" y="328" width="30" height="24"/><rect x="504" y="328" width="30" height="24"/>
        </g>
        <rect x="330" y="404" width="70" height="16" rx="4" fill="#8a5a2a"/>
        <text x="400" y="256" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-weight="700" fill="#fff8ea">PORTowa FALA</text>
        <text x="400" y="284" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" letter-spacing="6" fill="#ffe0b8">RESTAURACJA NAD MORZEM</text>
        <path d="M320 424 h14 v60 h-14 z" fill="#b9a888"/>
      </g>
      <!-- kutry rybackie -->
      <g>
        <path d="M700 470 q60 -16 120 0 l-14 26 q-46 -10 -92 0 z" fill="#2f6f9e"/>
        <path d="M714 442 h60 v28 h-60 z" fill="#e8e2d5"/>
        <rect x="756" y="352" width="4" height="92" fill="#7a5a38"/>
        <path d="M716 452 h56" stroke="#c0473c" stroke-width="8"/>
        <circle cx="700" cy="492" r="7" fill="#c0473c"/><circle cx="820" cy="492" r="7" fill="#c0473c"/>
      </g>
      <g>
        <path d="M880 500 q55 -14 110 0 l-12 24 q-42 -9 -86 0 z" fill="#b1483c"/>
        <path d="M894 476 h50 v24 h-50 z" fill="#f2ece0"/>
        <rect x="930" y="396" width="4" height="80" fill="#7a5a38"/>
        <path d="M894 486 h50" stroke="#2f6f9e" stroke-width="7"/>
      </g>
      <g>
        <path d="M1000 452 q48 -12 96 0 l-10 22 q-38 -8 -76 0 z" fill="#3d7a5f"/>
        <rect x="1040" y="352" width="4" height="100" fill="#7a5a38"/>
        <rect x="1016" y="404" width="4" height="48" fill="#7a5a38"/>
        <path d="M1020 380 l40 24 -40 22 z" fill="#f4efe2"/>
      </g>
      <!-- nabrzeże -->
      <path d="M0 640 h1200 v60 h-1200 z" fill="#cdc3ae"/>
      <path d="M0 632 h1200 v14 h-1200 z" fill="#b8ad95"/>
      <g fill="#7d7460">
        <rect x="60" y="588" width="34" height="46" rx="8"/><rect x="900" y="596" width="34" height="46" rx="8"/>
      </g>
      <g stroke="#2b2b2b" stroke-width="3" fill="none" opacity="0.8">
        <path d="M180 200 q12 -10 24 0"/><path d="M198 200 q12 -10 24 0"/>
        <path d="M560 170 q12 -10 24 0"/><path d="M980 210 q12 -10 24 0"/>
      </g>`,
    /* Sala z panoramicznym oknem */
    interior: () => `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4f7fa8"/><stop offset="0.55" stop-color="#e79b74"/>
          <stop offset="1" stop-color="#f7c98d"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f7893"/><stop offset="1" stop-color="#12384c"/>
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f6ecd9"/><stop offset="1" stop-color="#e7d7ba"/>
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d7b489"/><stop offset="1" stop-color="#b98d5d"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#wall)"/>
      <rect y="470" width="${W}" height="230" fill="url(#floor)"/>
      <g stroke="#a97f52" stroke-width="3" opacity="0.5">
        <path d="M0 510 h1200"/><path d="M0 560 h1200"/><path d="M0 620 h1200"/>
        <path d="M120 470 l-40 230"/><path d="M420 470 l-20 230"/><path d="M760 470 l20 230"/><path d="M1060 470 l40 230"/>
      </g>
      <!-- panoramiczne okno -->
      <g>
        <rect x="90" y="90" width="1020" height="380" rx="10" fill="#2a6a86" stroke="#f3e9d6" stroke-width="18"/>
        <g>
          <rect x="108" y="108" width="984" height="344" fill="url(#sky)"/>
          <rect x="108" y="330" width="984" height="122" fill="url(#sea)"/>
          <circle cx="800" cy="316" r="44" fill="#ffe6a2"/>
          <g fill="#ffe3a6" opacity="0.5"><ellipse cx="800" cy="352" rx="80" ry="6"/><ellipse cx="800" cy="380" rx="130" ry="5"/><ellipse cx="800" cy="412" rx="190" ry="4"/></g>
          <g stroke="#fff" opacity="0.2" stroke-width="3" fill="none"><path d="M140 360 q60 -12 120 0 t120 0"/><path d="M600 400 q70 -12 140 0 t140 0"/></g>
          <path d="M1040 330 h52 v14 h-52 z" fill="#0d1f2c"/>
          <rect x="1046" y="300" width="6" height="30" fill="#0d1f2c"/><path d="M1052 302 l26 14 -26 12 z" fill="#0d1f2c"/>
        </g>
        <g stroke="#f3e9d6" stroke-width="12">
          <path d="M420 108 v344"/><path d="M740 108 v344"/><path d="M108 260 h984"/>
        </g>
      </g>
      <!-- lampy -->
      <g>
        <path d="M300 0 v60" stroke="#5c5142" stroke-width="4"/><path d="M250 60 h100 l-16 34 h-68 z" fill="#3f4a52"/>
        <ellipse cx="300" cy="116" rx="46" ry="18" fill="#ffe9b0" opacity="0.5"/>
        <path d="M900 0 v60" stroke="#5c5142" stroke-width="4"/><path d="M850 60 h100 l-16 34 h-68 z" fill="#3f4a52"/>
        <ellipse cx="900" cy="116" rx="46" ry="18" fill="#ffe9b0" opacity="0.5"/>
      </g>
      <!-- stoliki -->
      <g>
        <ellipse cx="320" cy="560" rx="120" ry="40" fill="#fffdf8" stroke="#e3d6bd" stroke-width="4"/>
        <ellipse cx="320" cy="548" rx="120" ry="40" fill="#ffffff" stroke="#e3d6bd" stroke-width="4"/>
        <rect x="308" y="588" width="24" height="70" fill="#a97f52"/>
        <g fill="#bcd9e6" stroke="#9fb8c6" stroke-width="2"><rect x="250" y="520" width="22" height="30" rx="4"/><rect x="368" y="520" width="22" height="30" rx="4"/></g>
        <ellipse cx="320" cy="546" rx="34" ry="12" fill="#f3ead6"/>
        <ellipse cx="880" cy="580" rx="120" ry="40" fill="#fffdf8" stroke="#e3d6bd" stroke-width="4"/>
        <ellipse cx="880" cy="568" rx="120" ry="40" fill="#ffffff" stroke="#e3d6bd" stroke-width="4"/>
        <rect x="868" y="608" width="24" height="70" fill="#a97f52"/>
        <g fill="#bcd9e6" stroke="#9fb8c6" stroke-width="2"><rect x="812" y="540" width="22" height="30" rx="4"/><rect x="928" y="540" width="22" height="30" rx="4"/></g>
        <ellipse cx="880" cy="566" rx="34" ry="12" fill="#f3ead6"/>
      </g>`,
    /* Taras nad wodą */
    terrace: () => `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#7fb6d9"/><stop offset="0.7" stop-color="#e8d9bd"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f7d97"/><stop offset="1" stop-color="#154459"/>
        </linearGradient>
        <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d9b183"/><stop offset="1" stop-color="#b78a58"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      <rect y="300" width="${W}" height="150" fill="url(#sea)"/>
      <g stroke="#ffffff" opacity="0.2" stroke-width="4" fill="none">
        <path d="M40 340 q70 -14 140 0 t140 0"/><path d="M420 396 q80 -14 160 0 t160 0"/><path d="M760 340 q70 -14 140 0 t140 0"/>
      </g>
      <circle cx="1010" cy="180" r="52" fill="#fff0bb" opacity="0.85"/>
      <g fill="#0d1f2c">
        <path d="M150 306 q28 -8 56 0 l-6 10 q-22 -5 -44 0 z"/><rect x="176" y="270" width="4" height="36"/><path d="M180 272 l26 16 -26 14 z"/>
      </g>
      <rect y="450" width="${W}" height="250" fill="url(#deck)"/>
      <g stroke="#a07444" stroke-width="3" opacity="0.55">
        <path d="M0 480 h1200"/><path d="M0 530 h1200"/><path d="M0 590 h1200"/><path d="M0 660 h1200"/>
        <path d="M100 450 l-60 250"/><path d="M400 450 l-30 250"/><path d="M800 450 l30 250"/><path d="M1100 450 l60 250"/>
      </g>
      <!-- balustrada -->
      <g stroke="#f4ecdd" stroke-width="8" fill="none">
        <path d="M0 452 h1200"/>
        <path d="M60 452 v64"/><path d="M200 452 v64"/><path d="M340 452 v64"/><path d="M480 452 v64"/>
        <path d="M620 452 v64"/><path d="M760 452 v64"/><path d="M900 452 v64"/><path d="M1040 452 v64"/><path d="M1180 452 v64"/>
      </g>
      <!-- stolik z parasolem -->
      <g>
        <ellipse cx="360" cy="640" rx="150" ry="42" fill="#000" opacity="0.1"/>
        <rect x="352" y="560" width="16" height="120" fill="#8a5a2a"/>
        <ellipse cx="360" cy="560" rx="120" ry="40" fill="#fffdf8" stroke="#e3d6bd" stroke-width="4"/>
        <rect x="356" y="470" width="10" height="96" fill="#8a5a2a"/>
        <path d="M226 486 q134 -74 268 0 z" fill="#e0603f"/>
        <path d="M226 486 q134 -74 268 0" fill="none" stroke="#c14d31" stroke-width="5"/>
        <circle cx="361" cy="470" r="9" fill="#8a5a2a"/>
      </g>
      <g>
        <ellipse cx="880" cy="660" rx="140" ry="40" fill="#000" opacity="0.1"/>
        <rect x="872" y="586" width="16" height="110" fill="#8a5a2a"/>
        <ellipse cx="880" cy="586" rx="112" ry="38" fill="#fffdf8" stroke="#e3d6bd" stroke-width="4"/>
        <g fill="#cde6f0" stroke="#a9c2cf" stroke-width="2"><rect x="820" y="556" width="20" height="28" rx="4"/><rect x="920" y="556" width="20" height="28" rx="4"/></g>
      </g>
      <g stroke="#2b2b2b" stroke-width="3" fill="none" opacity="0.75">
        <path d="M600 200 q12 -10 24 0"/><path d="M618 200 q12 -10 24 0"/>
        <path d="M480 160 q12 -10 24 0"/>
      </g>`,

    /* Świeży połów na lodzie — karta menu */
    catch: () => `
      <defs>
        <linearGradient id="cold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1d4c63"/><stop offset="1" stop-color="#0a2130"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#cold)"/>
      <g fill="#bfe3f2" opacity="0.45">
        <polygon points="40,110 180,70 240,170 110,220"/>
        <polygon points="290,50 430,30 470,140 320,170"/>
        <polygon points="690,80 850,50 900,160 740,195"/>
        <polygon points="960,130 1110,100 1160,215 1000,245"/>
        <polygon points="110,400 260,360 320,470 170,510"/>
        <polygon points="520,530 660,490 720,595 570,635"/>
        <polygon points="880,460 1020,430 1070,545 920,575"/>
      </g>
      <g fill="#ffffff" opacity="0.22">
        <polygon points="420,220 470,205 490,245 440,262"/>
        <polygon points="760,300 812,286 830,332 780,346"/>
        <polygon points="330,600 380,586 398,626 348,642"/>
      </g>
      <g>
        <g transform="translate(360 330) rotate(-14)">
          <ellipse rx="168" ry="60" fill="#d7e0e6"/>
          <path d="M168 -42 l82 42 -82 42 z" fill="#b6c4ce"/>
          <path d="M20 -56 q52 -34 98 -6" fill="none" stroke="#c3cfd8" stroke-width="10"/>
          <circle cx="-118" cy="-14" r="10" fill="#1f303c"/>
          <g stroke="#a8b8c2" stroke-width="5" opacity="0.65"><path d="M-88 -30 q20 30 0 60"/><path d="M-38 -40 q20 40 0 80"/><path d="M22 -40 q18 40 -2 78"/></g>
        </g>
        <g transform="translate(830 400) rotate(10) scale(0.85)">
          <ellipse rx="168" ry="60" fill="#e2c9b8"/>
          <path d="M168 -42 l82 42 -82 42 z" fill="#c8a992"/>
          <path d="M20 -56 q52 -34 98 -6" fill="none" stroke="#d8bcab" stroke-width="10"/>
          <circle cx="-118" cy="-14" r="10" fill="#33241c"/>
          <g stroke="#c09c86" stroke-width="5" opacity="0.6"><path d="M-88 -30 q20 30 0 60"/><path d="M-38 -40 q20 40 0 80"/></g>
        </g>
        <g transform="translate(600 560) rotate(-4) scale(0.72)">
          <ellipse rx="168" ry="60" fill="#c9d8e0"/>
          <path d="M168 -42 l82 42 -82 42 z" fill="#a9bcc6"/>
          <circle cx="-118" cy="-14" r="10" fill="#1f303c"/>
        </g>
      </g>
      <g transform="rotate(-16 250 520)">
        <circle cx="250" cy="520" r="52" fill="#f6d43a" stroke="#e0b81c" stroke-width="6"/>
        <g stroke="#e8c625" stroke-width="4"><path d="M250 474 v92"/><path d="M204 520 h92"/><path d="M218 488 l64 64"/><path d="M282 488 l-64 64"/></g>
      </g>
      <g stroke="#4f9e3f" stroke-width="6" stroke-linecap="round" fill="none">
        <path d="M120 300 q30 -20 60 0"/><path d="M136 286 q20 -16 40 0"/><path d="M1010 300 q30 -20 60 0"/>
      </g>`,

    /* Nakryty stolik przy oknie — rezerwacja */
    table: () => `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4f7fa8"/><stop offset="0.55" stop-color="#e79b74"/>
          <stop offset="1" stop-color="#f7c98d"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f7893"/><stop offset="1" stop-color="#12384c"/>
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f6ecd9"/><stop offset="1" stop-color="#e3d2b3"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#wall)"/>
      <rect y="500" width="${W}" height="200" fill="#d7b489" opacity="0.55"/>
      <!-- okno z widokiem -->
      <g>
        <rect x="150" y="60" width="900" height="380" rx="8" fill="#2a6a86" stroke="#f3e9d6" stroke-width="18"/>
        <rect x="168" y="78" width="864" height="344" fill="url(#sky)"/>
        <rect x="168" y="300" width="864" height="122" fill="url(#sea)"/>
        <circle cx="860" cy="286" r="40" fill="#ffe6a2"/>
        <g fill="#ffe3a6" opacity="0.5"><ellipse cx="860" cy="320" rx="76" ry="6"/><ellipse cx="860" cy="348" rx="120" ry="5"/></g>
        <g stroke="#f3e9d6" stroke-width="12"><path d="M450 78 v344"/><path d="M750 78 v344"/><path d="M168 230 h864"/></g>
      </g>
      <!-- stół -->
      <ellipse cx="600" cy="700" rx="620" ry="210" fill="#fffdf8"/>
      <ellipse cx="600" cy="700" rx="620" ry="210" fill="none" stroke="#e6dac2" stroke-width="6"/>
      <!-- talerze -->
      <g>
        <circle cx="360" cy="600" r="86" fill="#ffffff" stroke="#dde5ea" stroke-width="6"/>
        <circle cx="360" cy="600" r="58" fill="none" stroke="#e9eef2" stroke-width="5"/>
        <circle cx="360" cy="600" r="34" fill="#f2ead6"/>
        <circle cx="840" cy="620" r="86" fill="#ffffff" stroke="#dde5ea" stroke-width="6"/>
        <circle cx="840" cy="620" r="58" fill="none" stroke="#e9eef2" stroke-width="5"/>
        <circle cx="840" cy="620" r="34" fill="#f2ead6"/>
      </g>
      <!-- sztućce -->
      <g stroke="#c8d0d6" stroke-width="9" stroke-linecap="round">
        <path d="M232 556 v96"/><path d="M258 556 v96"/>
        <path d="M958 578 v96"/><path d="M984 578 v96"/>
      </g>
      <!-- kieliszki -->
      <g>
        <path d="M500 430 h72 l-10 56 a26 26 0 0 1 -52 0 z" fill="#e9f6fb" opacity="0.85" stroke="#cfe0e8" stroke-width="4"/>
        <path d="M536 512 v56" stroke="#cfe0e8" stroke-width="6"/>
        <ellipse cx="536" cy="572" rx="34" ry="9" fill="#cfe0e8"/>
        <path d="M686 440 h72 l-10 56 a26 26 0 0 1 -52 0 z" fill="#e9f6fb" opacity="0.85" stroke="#cfe0e8" stroke-width="4"/>
        <path d="M722 522 v56" stroke="#cfe0e8" stroke-width="6"/>
        <ellipse cx="722" cy="582" rx="34" ry="9" fill="#cfe0e8"/>
      </g>
      <!-- świeca -->
      <g>
        <rect x="586" y="440" width="34" height="78" rx="8" fill="#f4ecdd" stroke="#ddd2bb" stroke-width="3"/>
        <ellipse cx="603" cy="440" rx="17" ry="7" fill="#fff8ea"/>
        <path d="M603 402 q16 20 0 34 q-16 -14 0 -34 z" fill="#ffcf6a"/>
      </g>
      <!-- lampy -->
      <g>
        <path d="M300 0 v54" stroke="#5c5142" stroke-width="4"/><path d="M252 54 h96 l-16 32 h-64 z" fill="#3f4a52"/>
        <ellipse cx="300" cy="108" rx="44" ry="17" fill="#ffe9b0" opacity="0.5"/>
        <path d="M980 0 v54" stroke="#5c5142" stroke-width="4"/><path d="M932 54 h96 l-16 32 h-64 z" fill="#3f4a52"/>
        <ellipse cx="980" cy="108" rx="44" ry="17" fill="#ffe9b0" opacity="0.5"/>
      </g>`,

    /* Molo o zmierzchu — zamówienia online */
    molo: () => `
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1b2a52"/><stop offset="0.45" stop-color="#7a5a86"/>
          <stop offset="0.72" stop-color="#e08a6a"/><stop offset="0.88" stop-color="#f7c17e"/>
        </linearGradient>
        <linearGradient id="sea2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3a5f7d"/><stop offset="0.5" stop-color="#25455f"/><stop offset="1" stop-color="#0d2233"/>
        </linearGradient>
        <linearGradient id="deck2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a97a4e"/><stop offset="1" stop-color="#6f4a2b"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#dusk)"/>
      <circle cx="900" cy="470" r="60" fill="#ffdca0"/>
      <ellipse cx="900" cy="470" rx="300" ry="150" fill="#ffc98a" opacity="0.25"/>
      <rect y="470" width="${W}" height="230" fill="url(#sea2)"/>
      <g fill="#ffd9a0" opacity="0.5">
        <ellipse cx="900" cy="500" rx="70" ry="6"/><ellipse cx="900" cy="530" rx="120" ry="5"/>
        <ellipse cx="900" cy="570" rx="180" ry="4"/><ellipse cx="900" cy="620" rx="240" ry="3"/>
      </g>
      <!-- pomost -->
      <path d="M0 700 L1200 640 L1200 700 z" fill="url(#deck2)"/>
      <path d="M0 640 L1200 588 L1200 616 L0 668 z" fill="#8a5f3a"/>
      <g stroke="#5c3d24" stroke-width="4" opacity="0.6">
        <path d="M0 668 L1200 616"/><path d="M60 700 L100 646"/><path d="M320 690 L360 632"/>
        <path d="M600 676 L640 620"/><path d="M880 664 L920 606"/><path d="M1140 652 L1180 596"/>
      </g>
      <!-- latarnie -->
      <g>
        <rect x="250" y="430" width="14" height="220" fill="#2c3a44"/>
        <path d="M240 400 h34 l-6 32 h-22 z" fill="#f6d98a"/>
        <circle cx="257" cy="416" r="26" fill="#ffe9b0" opacity="0.45"/>
        <rect x="850" y="470" width="12" height="180" fill="#2c3a44"/>
        <path d="M842 444 h28 l-6 28 h-16 z" fill="#f6d98a"/>
        <circle cx="856" cy="458" r="22" fill="#ffe9b0" opacity="0.4"/>
      </g>
      <!-- łódź -->
      <g fill="#16212c">
        <path d="M980 490 q60 -16 120 0 l-14 26 q-46 -10 -92 0 z"/>
        <rect x="1044" y="392" width="5" height="98"/>
        <path d="M1049 396 l44 28 -44 26 z" fill="#22303c"/>
        <path d="M1000 462 h88" stroke="#ffd9a0" stroke-width="5" opacity="0.6"/>
      </g>
      <g fill="#0e1a24">
        <path d="M120 500 q48 -12 96 0 l-12 22 q-38 -8 -76 0 z"/>
        <rect x="164" y="430" width="4" height="70"/>
      </g>
      <g stroke="#0e1a24" stroke-width="3" fill="none" opacity="0.7">
        <path d="M560 250 q12 -10 24 0"/><path d="M578 250 q12 -10 24 0"/><path d="M700 200 q12 -10 24 0"/>
      </g>`
  };

  window.placeArt = function (kind) {
    const fn = SCENES[kind] || SCENES.panorama;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" role="img">${fn()}</svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  };
})();
