/**
 * Generates on-brand placeholder building photos so the site renders before
 * the real photos arrive. Drop real photos at the same paths to replace them.
 *   node scripts/gen-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const W = 1920;
const H = 1280;

async function render(svg, out) {
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  console.log("wrote", out);
}

/* Bar — warm night exterior: string lights, glowing windows, neon sign. */
const bar = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b1120"/>
      <stop offset="0.55" stop-color="#0a0d16"/>
      <stop offset="1" stop-color="#050608"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.32" r="0.6">
      <stop offset="0" stop-color="#3a2a12" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#3a2a12" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <!-- building facade -->
  <rect x="0" y="470" width="${W}" height="${H - 470}" fill="#15100c"/>
  <rect x="0" y="470" width="${W}" height="14" fill="#a61e2b"/>
  <rect x="0" y="484" width="${W}" height="120" fill="#0d0a08"/>
  <!-- glowing windows -->
  ${Array.from({ length: 7 }, (_, i) => {
    const x = 150 + i * 250;
    return `<rect x="${x}" y="650" width="150" height="240" rx="6" fill="#e0a955" opacity="0.14"/>
            <rect x="${x + 16}" y="670" width="118" height="200" rx="4" fill="#caa15a" opacity="0.22"/>`;
  }).join("")}
  <!-- neon sign -->
  <g filter="url(#soft)">
    <rect x="710" y="150" width="500" height="120" rx="60" fill="#2a6cff" opacity="0.28"/>
  </g>
  <rect x="740" y="176" width="440" height="66" rx="33" fill="none" stroke="#6cc5ff" stroke-width="7" opacity="0.85"/>
  <!-- string lights -->
  <path d="M40 250 Q 960 400 1880 250" fill="none" stroke="#3a3020" stroke-width="3" opacity="0.6"/>
  ${Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const x = 40 + t * 1840;
    const y = 250 + Math.sin(Math.PI * t) * 150;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="6" fill="#ffd9a0"/>
            <circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="16" fill="#ffcf87" opacity="0.16"/>`;
  }).join("")}
  <rect width="${W}" height="${H}" fill="#000" opacity="0.12"/>
</svg>`;

/* Grill — bright daytime storefront: stone facade, awning, gold halal badge. */
const grill = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="daysky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d7dee4"/>
      <stop offset="0.6" stop-color="#c2cad2"/>
      <stop offset="1" stop-color="#aeb6bf"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#daysky)"/>
  <!-- facade -->
  <rect x="0" y="360" width="${W}" height="${H - 360}" fill="#cdc6b8"/>
  <rect x="0" y="360" width="${W}" height="200" fill="#0e0e10"/>
  <rect x="0" y="360" width="${W}" height="10" fill="#a61e2b"/>
  <!-- awning stripes -->
  ${Array.from({ length: 16 }, (_, i) =>
    `<rect x="${i * 120}" y="560" width="60" height="70" fill="#a61e2b" opacity="0.85"/>`,
  ).join("")}
  <rect x="0" y="560" width="${W}" height="70" fill="#0e0e10" opacity="0.0"/>
  <!-- windows -->
  ${Array.from({ length: 5 }, (_, i) => {
    const x = 120 + i * 350;
    return `<rect x="${x}" y="720" width="250" height="360" rx="8" fill="#8fa3ad" opacity="0.55"/>
            <rect x="${x + 12}" y="732" width="226" height="336" rx="6" fill="#c8d6db" opacity="0.4"/>`;
  }).join("")}
  <!-- gold halal badge -->
  <circle cx="960" cy="455" r="60" fill="#0e0e10"/>
  <circle cx="960" cy="455" r="60" fill="none" stroke="#c8a24a" stroke-width="5"/>
  <circle cx="960" cy="455" r="42" fill="none" stroke="#c8a24a" stroke-width="2" opacity="0.7"/>
  <rect width="${W}" height="${H}" fill="#000" opacity="0.06"/>
</svg>`;

await render(bar, "public/images/bar/bar-building.jpg");
await render(grill, "public/images/grill/grill-building.jpg");
console.log("done");
