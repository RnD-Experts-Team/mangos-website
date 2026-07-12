/**
 * Placeholder imagery for the /bar detail sections:
 *   - the About "drink shelf" photo
 *   - one tile per menu item (category glyph, no text — the card supplies the name)
 * Drop real photos at the same paths to replace them.
 *   node scripts/gen-bar-detail-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

async function render(svg, out) {
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  console.log("wrote", out);
}

/* ---- About: backlit bottle shelf ---- */
const AW = 1200;
const AH = 900;
const bottleColors = ["#c98b3a", "#a61e2b", "#3a6ea8", "#7a3f8c", "#d0b24a", "#c05a2b", "#4a8c6f"];
const bottles = bottleColors
  .map((c, i) => {
    const x = 110 + i * 150;
    const bh = 300 + ((i * 47) % 130);
    const y = 560 - bh;
    return `
      <rect x="${x}" y="${y}" width="90" height="${bh}" rx="14" fill="${c}" opacity="0.82"/>
      <rect x="${x + 34}" y="${y - 70}" width="22" height="80" rx="6" fill="${c}" opacity="0.82"/>
      <rect x="${x}" y="${y}" width="90" height="${bh}" rx="14" fill="url(#sheen)"/>`;
  })
  .join("");
const about = `
<svg xmlns="http://www.w3.org/2000/svg" width="${AW}" height="${AH}" viewBox="0 0 ${AW} ${AH}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#141018"/>
      <stop offset="1" stop-color="#0a0a0b"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="led" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#c4212f"/>
      <stop offset="0.5" stop-color="#8a4bd0"/>
      <stop offset="1" stop-color="#2a6cff"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="${AW}" height="${AH}" fill="url(#bg)"/>
  <rect x="0" y="556" width="${AW}" height="26" fill="url(#led)" filter="url(#glow)" opacity="0.7"/>
  ${bottles}
  <rect x="0" y="560" width="${AW}" height="10" fill="url(#led)" opacity="0.95"/>
  <rect x="0" y="575" width="${AW}" height="325" fill="#0c0c0e"/>
  <rect x="0" y="575" width="${AW}" height="325" fill="url(#led)" opacity="0.05"/>
  <rect width="${AW}" height="${AH}" fill="#000" opacity="0.1"/>
</svg>`;

/* ---- Menu tiles: category glyph on a tinted glow ---- */
const S = 800;
const glyphs = {
  cocktails: `<path d="M250 300 L550 300 L410 470 L390 470 Z M400 470 L400 590 M330 595 L470 595"
      fill="none" stroke="#f0c26a" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="470" cy="330" r="12" fill="#a61e2b"/>`,
  hookah: `<ellipse cx="400" cy="600" rx="90" ry="34" fill="none" stroke="#9fb0ff" stroke-width="10"/>
      <path d="M400 566 L400 320 M360 320 L440 320 L430 250 L370 250 Z" fill="none" stroke="#9fb0ff" stroke-width="10" stroke-linejoin="round"/>
      <path d="M440 300 C 560 320 560 460 470 500" fill="none" stroke="#9fb0ff" stroke-width="9" stroke-linecap="round"/>`,
  "food-and-beverages": `<ellipse cx="400" cy="420" rx="150" ry="150" fill="none" stroke="#f0a86a" stroke-width="10"/>
      <ellipse cx="400" cy="420" rx="96" ry="96" fill="none" stroke="#f0a86a" stroke-width="6" opacity="0.6"/>
      <path d="M250 300 L250 420 M270 300 L270 420 M230 300 L230 420 M250 420 L250 560" fill="none" stroke="#f0a86a" stroke-width="8" stroke-linecap="round"/>`,
};
const tints = {
  cocktails: ["#3a2410", "#c98b3a"],
  hookah: ["#1a1830", "#6a5bd0"],
  "food-and-beverages": ["#2a1810", "#c05a2b"],
};

const items = {
  cocktails: ["whiskey-flight", "house-margarita", "mango-mule", "craft-beer-seltzers", "tequila-sunrise", "old-fashioned"],
  hookah: ["double-apple", "mint-chill", "blue-mist", "grape-ice", "custom-house-blend", "led-tipsy-hookah"],
  "food-and-beverages": ["chicken-wings", "loaded-fries", "mozzarella-sticks", "fried-pickles", "mango-smoothie", "coffee-tea"],
};

function tile(cat, i) {
  const [deep, bright] = tints[cat];
  const cx = 30 + (i % 3) * 20;
  const cy = 28 + (i % 2) * 24;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="g" cx="${cx}%" cy="${cy}%" r="75%">
      <stop offset="0" stop-color="${deep}"/>
      <stop offset="1" stop-color="#0a0a0b"/>
    </radialGradient>
    <radialGradient id="spot" cx="50%" cy="45%" r="50%">
      <stop offset="0" stop-color="${bright}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${bright}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${S}" height="${S}" fill="url(#g)"/>
  <rect width="${S}" height="${S}" fill="url(#spot)"/>
  <g opacity="0.9">${glyphs[cat]}</g>
  <rect x="0" y="${S - 6}" width="${S}" height="6" fill="#a61e2b" opacity="0.7"/>
</svg>`;
}

await render(about, "public/images/bar/about-drinks.jpg");
for (const [cat, slugs] of Object.entries(items)) {
  for (let i = 0; i < slugs.length; i++) {
    // Main thumbnail + 2 variants (different glow angle) for the product dialog.
    for (let v = 0; v < 3; v++) {
      const name = v === 0 ? slugs[i] : `${slugs[i]}-${v + 1}`;
      await render(tile(cat, i * 3 + v), `public/images/bar/menu/${name}.jpg`);
    }
  }
}
console.log("done");
