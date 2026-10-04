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
      </g>`
  };

  window.placeArt = function (kind) {
    const fn = SCENES[kind] || SCENES.panorama;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" role="img">${fn()}</svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  };
})();
