/**
 * Placeholder imagery for the /grill detail sections:
 *   - the About "open flame" photo
 *   - one tile per menu item (category glyph, no text — the card supplies the name)
 *   - one tile per build-your-own-bowl option
 *   - the "moments" story strip
 * Warm, day-lit palette to set the grill apart from the night-time bar.
 * Drop real photos at the same paths to replace them.
 *   node scripts/gen-grill-detail-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

async function render(svg, out) {
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  console.log("wrote", out);
}

/* Shared line-glyphs (stroked, centered ~400,400 on an 800 box). */
const GLYPHS = {
  // rolled wrap
  wrap: `<path d="M300 250 C 360 230 440 230 500 250 L470 560 C 430 575 370 575 330 560 Z" fill="none" stroke="#f2e4c9" stroke-width="12" stroke-linejoin="round"/>
    <path d="M330 330 L470 330 M336 410 L464 410 M344 490 L456 490" stroke="#f2e4c9" stroke-width="9" stroke-linecap="round"/>`,
  // burger stack
  burger: `<path d="M250 330 C 250 250 550 250 550 330 Z" fill="none" stroke="#f2c987" stroke-width="12" stroke-linejoin="round"/>
    <path d="M250 380 L550 380 M250 440 L550 440" stroke="#f2c987" stroke-width="12" stroke-linecap="round"/>
    <path d="M255 490 C 255 560 545 560 545 490" fill="none" stroke="#f2c987" stroke-width="12" stroke-linejoin="round"/>`,
  // salad bowl + leaves
  salad: `<path d="M255 420 C 255 560 545 560 545 420 Z" fill="none" stroke="#a9c07a" stroke-width="12" stroke-linejoin="round"/>
    <path d="M300 420 C 320 340 380 320 400 400 C 420 320 480 340 500 420" fill="none" stroke="#a9c07a" stroke-width="10" stroke-linecap="round"/>`,
  // grill skewer over flame
  grill: `<path d="M240 470 L560 470 M240 510 L560 510" stroke="#e08a3c" stroke-width="10" stroke-linecap="round"/>
    <circle cx="330" cy="360" r="34" fill="none" stroke="#e08a3c" stroke-width="11"/>
    <circle cx="410" cy="360" r="34" fill="none" stroke="#e08a3c" stroke-width="11"/>
    <circle cx="490" cy="360" r="34" fill="none" stroke="#e08a3c" stroke-width="11"/>
    <path d="M250 360 L560 360" stroke="#e08a3c" stroke-width="8" stroke-linecap="round"/>`,
  // simple bowl (build-your-own)
  bowl: `<path d="M245 400 C 245 560 555 560 555 400 Z" fill="none" stroke="#f2e4c9" stroke-width="12" stroke-linejoin="round"/>
    <path d="M300 400 L500 400" stroke="#f2e4c9" stroke-width="8" stroke-linecap="round"/>
    <path d="M330 340 C 360 300 440 300 470 340" fill="none" stroke="#f2e4c9" stroke-width="9" stroke-linecap="round"/>`,
};

/* deep bg tint + bright spotlight per category. */
const TINTS = {
  wraps: ["#2a2114", "#d9a441"],
  burgers: ["#2a1c10", "#e0863a"],
  salads: ["#1c2414", "#8fb34e"],
  "grilled-entrees": ["#2a1710", "#d1552b"],
  bowl: ["#241a12", "#c8a24a"],
};

const S = 800;
function tile(glyph, tintKey, i) {
  const [deep, bright] = TINTS[tintKey];
  const cx = 32 + (i % 3) * 18;
  const cy = 30 + (i % 2) * 22;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="g" cx="${cx}%" cy="${cy}%" r="80%">
      <stop offset="0" stop-color="${deep}"/>
      <stop offset="1" stop-color="#0f0d0b"/>
    </radialGradient>
    <radialGradient id="spot" cx="50%" cy="42%" r="52%">
      <stop offset="0" stop-color="${bright}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${bright}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${S}" height="${S}" fill="url(#g)"/>
  <rect width="${S}" height="${S}" fill="url(#spot)"/>
  <g opacity="0.92">${glyph}</g>
  <rect x="0" y="${S - 6}" width="${S}" height="6" fill="${bright}" opacity="0.55"/>
</svg>`;
}

/* ---- About: skewers over an open flame ---- */
const AW = 1200;
const AH = 1500; // 4:5 portrait to match the about frame
const flames = Array.from({ length: 7 }, (_, i) => {
  const x = 150 + i * 145;
  const h = 150 + ((i * 53) % 120);
  return `<path d="M${x} 1080 C ${x - 40} ${1080 - h} ${x + 30} ${1080 - h * 0.5} ${x} ${1080 - h}
    C ${x - 30} ${1080 - h * 0.5} ${x + 40} ${1080 - h} ${x} 1080 Z" fill="url(#flame)" opacity="0.8"/>`;
}).join("");
const skewers = Array.from({ length: 4 }, (_, r) => {
  const y = 640 + r * 26;
  const beads = Array.from({ length: 5 }, (_, c) => {
    const x = 250 + c * 160;
    return `<circle cx="${x}" cy="${y - 20}" r="30" fill="#b5702f" opacity="0.9"/><circle cx="${x}" cy="${y - 20}" r="30" fill="url(#sheen)"/>`;
  }).join("");
  return `<rect x="180" y="${y - 24}" width="860" height="8" rx="4" fill="#c9c4bd" opacity="0.55"/>${beads}`;
}).join("");
const about = `
<svg xmlns="http://www.w3.org/2000/svg" width="${AW}" height="${AH}" viewBox="0 0 ${AW} ${AH}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#20160e"/>
      <stop offset="0.6" stop-color="#160f0a"/>
      <stop offset="1" stop-color="#0c0a08"/>
    </linearGradient>
    <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#e0863a"/>
      <stop offset="0.6" stop-color="#e8a94a"/>
      <stop offset="1" stop-color="#f2d27a"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.08"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="72%" r="55%">
      <stop offset="0" stop-color="#e0863a" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#e0863a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${AW}" height="${AH}" fill="url(#bg)"/>
  <rect width="${AW}" height="${AH}" fill="url(#glow)"/>
  ${skewers}
  ${flames}
  <rect x="0" y="1080" width="${AW}" height="14" fill="#4a2a14"/>
  <rect x="0" y="1094" width="${AW}" height="406" fill="#0c0a08"/>
  <rect width="${AW}" height="${AH}" fill="#000" opacity="0.08"/>
</svg>`;

/* ---- Moments: warm landscape scene tiles ---- */
function moment(bright, glyph, i) {
  const W = 1000;
  const H = 1250; // portrait strip cards
  const cx = 34 + (i % 3) * 16;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="mbg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#241a12"/>
      <stop offset="1" stop-color="#0e0b09"/>
    </linearGradient>
    <radialGradient id="mspot" cx="${cx}%" cy="40%" r="65%">
      <stop offset="0" stop-color="${bright}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${bright}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#mbg)"/>
  <rect width="${W}" height="${H}" fill="url(#mspot)"/>
  <g transform="translate(100,240) scale(1.0)" opacity="0.9">${glyph}</g>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${bright}" opacity="0.5"/>
</svg>`;
}

/* ---- Menu items by category ---- */
const MENU = {
  wraps: { glyph: GLYPHS.wrap, items: ["chicken-shawarma-wrap", "beef-shawarma-wrap", "falafel-wrap", "chicken-kebab-wrap", "kofta-wrap", "halloumi-wrap"] },
  burgers: { glyph: GLYPHS.burger, items: ["classic-smash", "mango-grill-burger", "harissa-burger", "chicken-shawarma-burger", "falafel-burger", "kofta-burger"] },
  salads: { glyph: GLYPHS.salad, items: ["fattoush", "tabbouleh", "mediterranean-salad", "shawarma-salad", "hummus-plate", "mezze-sampler"] },
  "grilled-entrees": { glyph: GLYPHS.grill, items: ["mixed-grill", "shish-tawook", "beef-kofta", "lamb-chops", "grilled-salmon", "falafel-platter"] },
};

/* ---- Bowl options (single flat list; one tile each) ---- */
const BOWL = [
  "basmati", "saffron-rice", "vermicelli-rice", "mixed-greens", "half-and-half",
  "chicken-shawarma", "beef-shawarma", "chicken-kebab", "beef-kofta", "lamb", "falafel",
  "toum", "hummus", "tahini", "tzatziki", "harissa",
  "pickles", "turnips", "olives", "feta", "tomato-cucumber", "sumac-onion", "cabbage-slaw", "pita-chips",
];

/* ---- Moments ---- */
const MOMENTS = [
  ["flame-grill", "#e0863a", GLYPHS.grill],
  ["shawarma-spit", "#d9a441", GLYPHS.wrap],
  ["mezze-spread", "#8fb34e", GLYPHS.salad],
  ["fresh-pita", "#f2c987", GLYPHS.bowl],
  ["chef-adnan", "#d1552b", GLYPHS.grill],
  ["bowl-build", "#c8a24a", GLYPHS.bowl],
];

await render(about, "public/images/grill/about-kitchen.jpg");

for (const [cat, { glyph, items }] of Object.entries(MENU)) {
  for (let i = 0; i < items.length; i++) {
    // Main thumbnail + 2 variants (different spotlight angle) for the product dialog.
    for (let v = 0; v < 3; v++) {
      const name = v === 0 ? items[i] : `${items[i]}-${v + 1}`;
      await render(tile(glyph, cat, i * 3 + v), `public/images/grill/menu/${name}.jpg`);
    }
  }
}

for (let i = 0; i < BOWL.length; i++) {
  await render(tile(GLYPHS.bowl, "bowl", i), `public/images/grill/bowl/${BOWL[i]}.jpg`);
}

for (let i = 0; i < MOMENTS.length; i++) {
  const [name, bright, glyph] = MOMENTS[i];
  await render(moment(bright, glyph, i), `public/images/grill/moments/${name}.jpg`);
}

console.log("done");
