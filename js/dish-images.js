/* ===================================================================
   Portowa Fala — generator ilustracji potraw (SVG -> data URI)
   Każde danie dostaje własny obrazek, widoczny na karcie menu.
   =================================================================== */
(function () {
  "use strict";

  const W = 400, H = 250;

  function defs(extra) {
    return `<defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fcf7ee"/><stop offset="1" stop-color="#e7d9bf"/>
      </linearGradient>
      <linearGradient id="plateg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e9ee"/>
      </linearGradient>
      <linearGradient id="bowlg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dbe2e8"/>
      </linearGradient>
      <linearGradient id="glassg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(255,255,255,.7)"/>
        <stop offset="0.5" stop-color="rgba(255,255,255,.12)"/>
        <stop offset="1" stop-color="rgba(255,255,255,.55)"/>
      </linearGradient>
      <radialGradient id="iceg" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#efe9dd"/>
      </radialGradient>
      ${extra || ""}
    </defs>`;
  }

  function plate(inner) {
    return `<ellipse cx="200" cy="202" rx="122" ry="14" fill="#000" opacity="0.08"/>
      <ellipse cx="200" cy="150" rx="116" ry="74" fill="url(#plateg)" stroke="#d2dae1" stroke-width="3"/>
      <ellipse cx="200" cy="150" rx="93" ry="57" fill="none" stroke="#e5ebef" stroke-width="2"/>
      ${inner}`;
  }

  function bowl(surface, inner) {
    return `<ellipse cx="200" cy="204" rx="118" ry="13" fill="#000" opacity="0.08"/>
      <path d="M76 138 Q76 206 200 206 Q324 206 324 138 Z" fill="url(#bowlg)" stroke="#d2dae1" stroke-width="3"/>
      <ellipse cx="200" cy="138" rx="124" ry="41" fill="${surface}"/>
      <ellipse cx="200" cy="138" rx="124" ry="41" fill="none" stroke="#e9eef2" stroke-width="4"/>
      ${inner}`;
  }

  function glass(liquid, inner) {
    return `<ellipse cx="200" cy="214" rx="44" ry="8" fill="#000" opacity="0.1"/>
      <path d="M160 64 L171 198 Q200 212 229 198 L240 64 Z" fill="url(#glassg)" stroke="#c8d3da" stroke-width="3"/>
      <path d="M167 98 L176 190 Q200 202 224 190 L233 98 Z" fill="${liquid}"/>
      <ellipse cx="200" cy="98" rx="33" ry="12" fill="${liquid}"/>
      ${inner}`;
  }

  function cup(liquid, inner, foam) {
    return `<ellipse cx="200" cy="210" rx="46" ry="9" fill="#000" opacity="0.1"/>
      <path d="M252 110 q38 2 38 26 q0 26 -38 26" fill="none" stroke="#d2dae1" stroke-width="8" stroke-linecap="round"/>
      <path d="M150 92 h100 l-9 92 a22 22 0 0 1 -22 20 h-38 a22 22 0 0 1 -22 -20 z" fill="#ffffff" stroke="#d2dae1" stroke-width="3"/>
      <ellipse cx="200" cy="92" rx="50" ry="15" fill="${liquid}"/>
      <ellipse cx="200" cy="92" rx="50" ry="15" fill="none" stroke="#e4eaef" stroke-width="3"/>
      ${foam ? `<ellipse cx="200" cy="92" rx="30" ry="9" fill="#fff8ec" opacity="0.92"/>` : ""}
      ${inner}`;
  }

  /* --- poszczególne dania --- */
  const ART = {
    soup: (s) => bowl(s.c, `
      <path d="M120 132 q30 -14 60 -4 q40 12 96 -2" fill="none" stroke="${s.a}" stroke-width="4" opacity="0.5" stroke-linecap="round"/>
      <path d="M150 128 q26 10 46 0" fill="none" stroke="#ffffff" stroke-width="5" opacity="0.6" stroke-linecap="round"/>
      ${s.g === "dill" ? `<g stroke="#4f9e3f" stroke-width="3" stroke-linecap="round"><path d="M170 124 l6 10"/><path d="M176 122 l4 12"/><path d="M230 130 l6 10"/><path d="M236 128 l3 12"/></g>` : ""}
      ${s.g === "egg" ? `<ellipse cx="205" cy="132" rx="20" ry="14" fill="#fff7ea"/><circle cx="205" cy="130" r="7" fill="#f4c531"/><path d="M150 150 q20 12 40 4" fill="none" stroke="${s.a}" stroke-width="3" opacity="0.5"/>` : ""}
      ${s.g === "noodle" ? `<g stroke="#f0cf7a" stroke-width="4" fill="none" opacity="0.9"><path d="M150 140 q30 16 60 -2 q20 -10 40 4"/><path d="M160 132 q40 18 80 -4"/></g><circle cx="200" cy="126" r="6" fill="#4f9e3f"/>` : ""}
      ${s.g === "seeds" ? `<g fill="#6b4423"><ellipse cx="168" cy="126" rx="4" ry="2"/><ellipse cx="188" cy="120" rx="4" ry="2"/><ellipse cx="214" cy="128" rx="4" ry="2"/><ellipse cx="236" cy="122" rx="4" ry="2"/><ellipse cx="200" cy="136" rx="4" ry="2"/></g><path d="M160 132 q40 -16 82 2" fill="none" stroke="#fff" stroke-width="4" opacity="0.55"/>` : ""}
    `),

    fish: (s) => plate(`
      ${s.sauce ? `<ellipse cx="212" cy="154" rx="74" ry="34" fill="${s.a}" opacity="0.45"/>` : ""}
      <path d="M120 150 q52 -34 126 -18 q22 5 30 20 q-12 24 -58 28 q-80 6 -98 -30 z" fill="${s.c}" stroke="${s.a}" stroke-width="3"/>
      <path d="M142 142 q44 -14 88 -4" fill="none" stroke="${s.a}" stroke-width="2" opacity="0.45"/>
      <path d="M150 162 q40 10 80 2" fill="none" stroke="${s.a}" stroke-width="2" opacity="0.35"/>
      ${s.g === "mushroom" ? `<g fill="#a9713a"><ellipse cx="168" cy="126" rx="13" ry="8"/><ellipse cx="196" cy="120" rx="15" ry="9"/><ellipse cx="228" cy="126" rx="12" ry="7"/></g>` : ""}
      ${s.g === "lemon" ? `<g transform="rotate(-18 300 168)"><path d="M282 168 a20 20 0 0 0 40 0 z" fill="#f6d43a" stroke="#e0b81c" stroke-width="2"/><path d="M290 168 h22 M296 174 h12" stroke="#e8c625" stroke-width="2"/></g>` : ""}
      <g fill="#f2d9a0"><circle cx="120" cy="186" r="9"/><circle cx="140" cy="192" r="9"/><circle cx="160" cy="188" r="9"/></g>
      <g stroke="#4f9e3f" stroke-width="2" opacity="0.8"><path d="M118 182 l4 -8"/><path d="M142 188 l4 -8"/></g>
    `),

    grillfish: (s) => plate(`
      <path d="M120 150 q52 -34 126 -18 q22 5 30 20 q-12 24 -58 28 q-80 6 -98 -30 z" fill="${s.c}" stroke="${s.a}" stroke-width="3"/>
      <g stroke="${s.a}" stroke-width="6" stroke-linecap="round" opacity="0.75">
        <path d="M150 126 L176 166"/><path d="M178 120 L204 160"/><path d="M206 118 L232 158"/><path d="M234 122 L258 160"/>
      </g>
      <g transform="rotate(-18 300 170)"><path d="M282 170 a20 20 0 0 0 40 0 z" fill="#f6d43a" stroke="#e0b81c" stroke-width="2"/></g>
      <g fill="#f2d9a0"><circle cx="120" cy="188" r="9"/><circle cx="140" cy="194" r="9"/></g>
    `),

    shrimp: (s) => plate(`
      <g fill="${s.c}" stroke="${s.a}" stroke-width="3">
        <path d="M150 118 q-24 18 0 40 q22 20 44 -2 q-20 -4 -26 -18 q6 -14 26 -18 q-24 -18 -44 -2 z"/>
        <path d="M210 126 q-24 18 0 40 q22 20 44 -2 q-20 -4 -26 -18 q6 -14 26 -18 q-24 -18 -44 -2 z"/>
        <path d="M180 168 q-20 16 2 34 q20 16 38 -2 q-18 -4 -22 -16 q5 -12 22 -16 q-20 -16 -40 0 z"/>
      </g>
      <g fill="#f6e6a8"><circle cx="152" cy="150" r="3"/><circle cx="212" cy="158" r="3"/><circle cx="200" cy="196" r="3"/></g>
      <path d="M120 150 l-14 -8 M280 150 l14 -8" stroke="#4f9e3f" stroke-width="3"/>
    `),

    pancake: (s) => plate(`
      <g stroke="${s.a}" stroke-width="3">
        <ellipse cx="176" cy="164" rx="46" ry="30" fill="${s.c}"/>
        <ellipse cx="212" cy="146" rx="46" ry="30" fill="${s.c}"/>
        <ellipse cx="236" cy="170" rx="42" ry="27" fill="${s.c}"/>
      </g>
      <g stroke="${s.a}" stroke-width="3" opacity="0.55"><path d="M148 160 q28 10 56 -4"/><path d="M188 142 q28 12 54 -2"/><path d="M210 168 q26 10 50 -4"/></g>
      <ellipse cx="214" cy="140" rx="22" ry="12" fill="#fdf6ea" opacity="0.85"/>
    `),

    cutlet: (s) => plate(`
      <path d="M128 134 q56 -22 122 -6 q30 8 26 30 q-6 24 -46 28 q-70 8 -98 -14 q-14 -22 -4 -38 z" fill="${s.c}" stroke="${s.a}" stroke-width="3"/>
      <g fill="${s.a}" opacity="0.45"><circle cx="160" cy="146" r="3"/><circle cx="188" cy="138" r="3"/><circle cx="216" cy="150" r="3"/><circle cx="180" cy="166" r="3"/><circle cx="210" cy="170" r="3"/><circle cx="240" cy="160" r="3"/></g>
      <g transform="rotate(-18 306 168)"><path d="M288 168 a19 19 0 0 0 38 0 z" fill="#f6d43a" stroke="#e0b81c" stroke-width="2"/></g>
      <g fill="#f2d9a0"><circle cx="122" cy="188" r="9"/><circle cx="142" cy="193" r="9"/></g>
    `),

    pierogi: (s) => plate(`
      <g fill="${s.c}" stroke="${s.a}" stroke-width="3">
        <path d="M124 160 a34 26 0 0 0 68 0 z"/>
        <path d="M196 150 a34 26 0 0 0 68 0 z"/>
        <path d="M158 186 a34 26 0 0 0 68 0 z"/>
      </g>
      <g fill="none" stroke="${s.a}" stroke-width="2" opacity="0.6">
        <path d="M140 156 q18 8 36 0"/><path d="M212 146 q18 8 36 0"/><path d="M174 182 q18 8 36 0"/>
      </g>
      <g fill="#e8b25c" opacity="0.9"><circle cx="150" cy="140" r="3"/><circle cx="230" cy="132" r="3"/><circle cx="196" cy="176" r="3"/></g>
      <path d="M280 160 q14 -10 24 0" fill="none" stroke="#4f9e3f" stroke-width="3"/>
    `),

    fries: (s) => `
      <ellipse cx="200" cy="206" rx="96" ry="12" fill="#000" opacity="0.08"/>
      <path d="M138 190 h124 l-10 -70 h-104 z" fill="#f2ead6" stroke="#d8cba9" stroke-width="3"/>
      <g stroke="${s.a}" stroke-width="3" stroke-linejoin="round">
        <path d="M150 128 l-8 -74 h16 l6 74 z" fill="${s.c}"/>
        <path d="M172 124 l-4 -84 h16 l4 84 z" fill="${s.c}"/>
        <path d="M196 122 v-88 h16 v88 z" fill="${s.c}"/>
        <path d="M220 124 l4 -82 h16 l-4 82 z" fill="${s.c}"/>
        <path d="M244 128 l8 -70 h16 l-8 74 z" fill="${s.c}"/>
      </g>
      <g fill="#c94f3a"><circle cx="176" cy="196" r="4"/><circle cx="206" cy="200" r="4"/><circle cx="232" cy="194" r="4"/></g>
    `,

    potatoes: (s) => plate(`
      <g fill="${s.c}" stroke="${s.a}" stroke-width="2">
        <ellipse cx="164" cy="146" rx="26" ry="20"/><ellipse cx="206" cy="134" rx="27" ry="21"/>
        <ellipse cx="244" cy="150" rx="26" ry="20"/><ellipse cx="186" cy="174" rx="26" ry="20"/>
        <ellipse cx="228" cy="176" rx="26" ry="20"/>
      </g>
      <ellipse cx="200" cy="126" rx="26" ry="12" fill="#fdf6ea" opacity="0.9"/>
      <g stroke="#4f9e3f" stroke-width="3" stroke-linecap="round">
        <path d="M150 134 l6 8"/><path d="M212 120 l6 8"/><path d="M252 140 l6 8"/><path d="M196 166 l6 8"/>
      </g>
    `),

    kluski: (s) => plate(`
      <g fill="${s.c}" stroke="${s.a}" stroke-width="2">
        <circle cx="162" cy="146" r="24"/><circle cx="206" cy="136" r="24"/><circle cx="248" cy="150" r="24"/>
        <circle cx="184" cy="178" r="24"/><circle cx="230" cy="180" r="24"/>
      </g>
      <g fill="${s.a}" opacity="0.55"><circle cx="162" cy="146" r="7"/><circle cx="206" cy="136" r="7"/><circle cx="248" cy="150" r="7"/><circle cx="184" cy="178" r="7"/><circle cx="230" cy="180" r="7"/></g>
      <path d="M150 118 q40 -18 100 2" fill="none" stroke="#c98a2a" stroke-width="3" opacity="0.5"/>
    `),

    salad: (s) => plate(`
      <g stroke="${s.c}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.95">
        <path d="M142 152 q20 -18 44 -4 q18 12 40 -6"/>
        <path d="M150 172 q26 -14 48 0 q20 12 44 -6"/>
        <path d="M160 128 q24 -12 44 2 q18 12 40 -4"/>
      </g>
      <g fill="${s.a}"><circle cx="170" cy="142" r="5"/><circle cx="214" cy="152" r="5"/><circle cx="242" cy="128" r="5"/><circle cx="190" cy="170" r="5"/></g>
    `),

    beets: (s) => plate(`
      <g fill="${s.c}" stroke="${s.a}" stroke-width="2">
        <path d="M134 152 l24 -18 26 14 -10 26 -30 4 z"/>
        <path d="M188 132 l26 -8 20 18 -14 24 -28 -4 z"/>
        <path d="M214 172 l24 -12 22 16 -12 22 -30 -2 z"/>
      </g>
      <g fill="#fff" opacity="0.35"><circle cx="154" cy="150" r="3"/><circle cx="206" cy="142" r="3"/><circle cx="234" cy="180" r="3"/></g>
      <path d="M150 190 q40 8 80 0" fill="none" stroke="${s.a}" stroke-width="3" opacity="0.5"/>
    `),

    bread: (s) => `
      <ellipse cx="200" cy="204" rx="92" ry="12" fill="#000" opacity="0.08"/>
      <g stroke="${s.a}" stroke-width="3">
        <path d="M120 190 l30 -92 78 -8 -18 100 z" fill="${s.c}"/>
        <path d="M186 190 l34 -100 74 6 -24 94 z" fill="${s.c}"/>
      </g>
      <g fill="none" stroke="#fdf6ea" stroke-width="4" opacity="0.7"><path d="M150 100 l-8 84"/><path d="M216 92 l-10 90"/></g>
      <g fill="#4f9e3f"><circle cx="146" cy="150" r="4"/><circle cx="220" cy="146" r="4"/></g>
    `,

    rice: (s) => bowl(s.c, `
      <g fill="#ffffff" opacity="0.95">
        <ellipse cx="150" cy="130" rx="5" ry="3"/><ellipse cx="170" cy="124" rx="5" ry="3"/>
        <ellipse cx="192" cy="132" rx="5" ry="3"/><ellipse cx="214" cy="122" rx="5" ry="3"/>
        <ellipse cx="236" cy="130" rx="5" ry="3"/><ellipse cx="252" cy="124" rx="5" ry="3"/>
        <ellipse cx="160" cy="142" rx="5" ry="3"/><ellipse cx="200" cy="144" rx="5" ry="3"/>
        <ellipse cx="240" cy="142" rx="5" ry="3"/>
      </g>
      <g fill="${s.a}"><circle cx="180" cy="118" r="5"/><circle cx="228" cy="138" r="5"/><circle cx="156" cy="150" r="5"/></g>
    `),

    cake: (s) => plate(`
      <path d="M150 176 l0 -58 h100 l0 58 z" fill="${s.c}" stroke="${s.a}" stroke-width="3"/>
      <ellipse cx="200" cy="146" rx="50" ry="14" fill="#fdf2d8" stroke="${s.a}" stroke-width="2"/>
      <ellipse cx="200" cy="118" rx="50" ry="14" fill="${s.a}"/>
      <ellipse cx="200" cy="118" rx="50" ry="14" fill="none" stroke="${s.a}" stroke-width="2"/>
      <g fill="#8a5a2a"><circle cx="180" cy="114" r="4"/><circle cx="218" cy="117" r="4"/><circle cx="200" cy="122" r="4"/></g>
      <path d="M150 160 q50 12 100 0" fill="none" stroke="${s.a}" stroke-width="2" opacity="0.4"/>
    `),

    pie: (s) => plate(`
      <ellipse cx="200" cy="158" rx="82" ry="38" fill="${s.c}" stroke="${s.a}" stroke-width="3"/>
      <ellipse cx="200" cy="150" rx="82" ry="38" fill="${s.c}" stroke="${s.a}" stroke-width="3"/>
      <g stroke="${s.a}" stroke-width="4" opacity="0.8"><path d="M140 146 q60 -20 120 0"/><path d="M150 158 q50 16 100 0"/><path d="M170 130 v34"/><path d="M230 130 v34"/></g>
      <circle cx="200" cy="110" r="26" fill="url(#iceg)" stroke="#e0d7c6" stroke-width="2"/>
      <circle cx="192" cy="104" r="7" fill="#fff" opacity="0.9"/>
    `),

    pudding: (s) => `
      <ellipse cx="200" cy="200" rx="78" ry="11" fill="#000" opacity="0.08"/>
      <path d="M140 120 h120 l-12 68 a20 20 0 0 1 -20 16 h-56 a20 20 0 0 1 -20 -16 z" fill="#fbf3e5" stroke="#ded2ba" stroke-width="3"/>
      <ellipse cx="200" cy="120" rx="60" ry="18" fill="#fdf8ee" stroke="#ded2ba" stroke-width="3"/>
      <ellipse cx="200" cy="120" rx="60" ry="18" fill="${s.c}"/>
      <path d="M156 122 q44 -14 88 0 q-10 14 -44 14 q-34 0 -44 -14 z" fill="${s.a}" opacity="0.85"/>
      <g fill="#c0325f"><circle cx="182" cy="116" r="4"/><circle cx="212" cy="114" r="4"/></g>
      <path d="M206 104 q10 -14 24 -12" fill="none" stroke="#4f9e3f" stroke-width="3"/>
    `,

    icecream: (s) => plate(`
      <circle cx="170" cy="150" r="34" fill="${s.c2 || "#fff3c4"}" stroke="#e6dcc4" stroke-width="3"/>
      <circle cx="230" cy="150" r="34" fill="${s.c}" stroke="#e6dcc4" stroke-width="3"/>
      <circle cx="200" cy="114" r="34" fill="${s.c2 || "#fff3c4"}" stroke="#e6dcc4" stroke-width="3"/>
      <path d="M200 68 l-30 54 h60 z" fill="#d99b52" stroke="#b97a24" stroke-width="3"/>
      <g stroke="#b97a24" stroke-width="2"><path d="M186 86 h28"/><path d="M180 100 h40"/></g>
      <circle cx="186" cy="106" r="4" fill="${s.a}"/>
    `),

    donut: (s) => plate(`
      <g>
        <circle cx="168" cy="156" r="42" fill="${s.c}" stroke="#c98a2a" stroke-width="3"/>
        <circle cx="168" cy="156" r="16" fill="#fdf6ea" stroke="#c98a2a" stroke-width="3"/>
        <circle cx="244" cy="150" r="42" fill="${s.c}" stroke="#c98a2a" stroke-width="3"/>
        <circle cx="244" cy="150" r="16" fill="#fdf6ea" stroke="#c98a2a" stroke-width="3"/>
      </g>
      <path d="M136 140 q34 -22 64 -4" fill="none" stroke="${s.a}" stroke-width="9" stroke-linecap="round" opacity="0.9"/>
      <path d="M212 134 q34 -22 64 -4" fill="none" stroke="${s.a}" stroke-width="9" stroke-linecap="round" opacity="0.9"/>
      <g fill="#ffffff"><circle cx="150" cy="132" r="2.5"/><circle cx="228" cy="128" r="2.5"/><circle cx="262" cy="146" r="2.5"/><circle cx="176" cy="126" r="2.5"/></g>
    `),

    glass: (s) => glass(s.c, `
      <g fill="#ffffff" opacity="0.5"><circle cx="188" cy="132" r="4"/><circle cx="208" cy="150" r="4"/><circle cx="196" cy="172" r="4"/></g>
      ${s.g === "mint" ? `<g stroke="#4f9e3f" stroke-width="4" stroke-linecap="round" fill="none"><path d="M180 96 q-8 -18 6 -24"/><path d="M192 96 q10 -16 24 -14"/></g>` : ""}
      ${s.g === "fruit" ? `<g fill="#c0325f"><circle cx="196" cy="140" r="7"/><circle cx="214" cy="158" r="7"/></g>` : ""}
      ${s.g === "straw" ? `<path d="M214 60 l-14 150" stroke="#e2603a" stroke-width="7" stroke-linecap="round"/>` : ""}
      ${s.g === "lemon" ? `<path d="M224 90 a16 16 0 0 0 22 14 z" fill="#f6d43a" stroke="#e0b81c" stroke-width="2"/>` : ""}
      ${s.g === "foam" ? `<ellipse cx="200" cy="98" rx="34" ry="13" fill="#fff8ec"/>` : ""}
    `),

    cup: (s) => cup(s.c, `
      ${s.g === "steam" ? `<g fill="none" stroke="#d9cfc0" stroke-width="3" stroke-linecap="round" opacity="0.8"><path d="M182 66 q-8 -12 0 -22"/><path d="M206 64 q-8 -14 0 -26"/></g>` : ""}
      ${s.g === "lemon" ? `<path d="M232 84 a15 15 0 0 0 20 12 z" fill="#f6d43a" stroke="#e0b81c" stroke-width="2"/>` : ""}
    `, s.g === "foam")
  };

  // Specyfikacja wyglądu każdego dania (kolory + wariant)
  const SPEC = {
    z1: { kind: "soup", c: "#f0c469", a: "#e08b3a", g: "dill" },
    z2: { kind: "soup", c: "#e6d2a8", a: "#b98b4a", g: "dill" },
    z3: { kind: "soup", c: "#e58bb0", a: "#c65c8a", g: "egg" },
    z4: { kind: "soup", c: "#f2d889", a: "#e0a83a", g: "noodle" },
    z5: { kind: "soup", c: "#e8862f", a: "#c96a1c", g: "seeds" },

    o1: { kind: "fish", c: "#f6d9a8", a: "#c98a2a", g: "mushroom", sauce: true },
    o2: { kind: "fish", c: "#f7e3bb", a: "#e8b96a", g: "lemon" },
    o3: { kind: "grillfish", c: "#e8b06a", a: "#a5642a" },
    o4: { kind: "shrimp", c: "#ff9d6e", a: "#e2603a" },
    o5: { kind: "pancake", c: "#e8b25c", a: "#b9802f" },
    o6: { kind: "cutlet", c: "#d99b52", a: "#b06f2a" },
    o7: { kind: "pierogi", c: "#f2e2b8", a: "#d8b56a" },

    d1: { kind: "fries", c: "#f2c14e", a: "#d99b1f" },
    d2: { kind: "potatoes", c: "#f0d9a8", a: "#c9a86a" },
    d3: { kind: "kluski", c: "#f3ead2", a: "#c9a86a" },
    d4: { kind: "salad", c: "#8fc85a", a: "#e8862f" },
    d5: { kind: "beets", c: "#a52d5a", a: "#7d1f42" },
    d6: { kind: "bread", c: "#e0b46a", a: "#a5642a" },
    d7: { kind: "rice", c: "#f4efe2", a: "#e0a83a" },

    de1: { kind: "cake", c: "#f6e2b0", a: "#c98a2a" },
    de2: { kind: "pie", c: "#e0a94e", a: "#b97a24" },
    de3: { kind: "pudding", c: "#fdf6ec", a: "#c0325f" },
    de4: { kind: "icecream", c: "#f6a9c2", c2: "#fff3c4", a: "#6b4423" },
    de5: { kind: "donut", c: "#e8b25c", a: "#f2a0bd" },

    n1: { kind: "glass", c: "#b3203f", g: "fruit" },
    n2: { kind: "glass", c: "#f2d94e", g: "mint", }, 
    n3: { kind: "glass", c: "#cfe9f2", g: "bubbles" },
    n4: { kind: "cup", c: "#6b4423", g: "foam" },
    n5: { kind: "cup", c: "#c98a2a", g: "steam" },
    n6: { kind: "glass", c: "#f59a1f", g: "lemon" },
    n7: { kind: "glass", c: "#e8a82a", g: "foam" }
  };

  // Kolejny specyficzny dodatek: oranżada dostaje słomkę
  SPEC.n2.g = "mint";
  SPEC.n1.g = "fruit";

  function svgFor(cat, item) {
    const s = SPEC[item.id] || { kind: cat === "napoje" ? "glass" : "fish", c: "#e8b06a", a: "#b06f2a", g: "lemon" };
    const fn = ART[s.kind] || ART.fish;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
      ${defs()}
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <ellipse cx="200" cy="46" rx="150" ry="60" fill="#ffffff" opacity="0.25"/>
      ${fn(s)}
    </svg>`;
  }

  window.dishArt = function (item, cat) {
    try {
      return "data:image/svg+xml," + encodeURIComponent(svgFor(cat, item));
    } catch (e) {
      return "";
    }
  };
})();
