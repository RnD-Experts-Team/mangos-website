/**
 * Generates on-brand placeholder tiles for the Bar's "Moments" gallery so it
 * renders before real photos/videos arrive. Drop real files at the same
 * paths (public/images/bar/moments/<id>.jpg) to replace them — no code changes.
 *   node scripts/gen-moments-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const SIZE = 1200;
const OUT_DIR = "public/images/bar/moments";

async function render(svg, name) {
  const out = `${OUT_DIR}/${name}.jpg`;
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  console.log("wrote", out);
}

function base(bg) {
  return `<rect width="${SIZE}" height="${SIZE}" fill="${bg}"/>`;
}

const scenes = {
  "patio-glow": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs>
        <radialGradient id="g1" cx="0.5" cy="0.72" r="0.6">
          <stop offset="0" stop-color="#5a2a1a" stop-opacity="0.8"/>
          <stop offset="1" stop-color="#0a0a0b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      ${base("#0a0a0b")}
      <rect width="${SIZE}" height="${SIZE}" fill="url(#g1)"/>
      ${Array.from({ length: 6 }, (_, i) => `<rect x="${120 + i * 170}" y="880" width="90" height="220" fill="#161412" opacity="0.85"/>`).join("")}
      <path d="M60 420 Q 600 520 1140 420" stroke="#3a2a18" stroke-width="4" fill="none" opacity="0.6"/>
      ${Array.from({ length: 16 }, (_, i) => {
        const t = i / 15, x = 60 + t * 1080, y = 420 + Math.sin(Math.PI * t) * 90;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="7" fill="#ffcf87"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="20" fill="#ffcf87" opacity="0.18"/>`;
      }).join("")}
    </svg>`,
  "string-lights": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      ${base("#08090c")}
      <path d="M0 300 Q 600 200 1200 340" stroke="#2a2420" stroke-width="4" fill="none" opacity="0.7"/>
      <path d="M0 520 Q 600 620 1200 500" stroke="#2a2420" stroke-width="4" fill="none" opacity="0.5"/>
      ${Array.from({ length: 22 }, (_, i) => {
        const t = i / 21, x = t * 1200, y = 300 + Math.sin(Math.PI * t * 1.4) * 70;
        const r = 10 + (i % 3) * 4;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r + 22}" fill="#ffcf87" opacity="0.14"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="#ffdca0"/>`;
      }).join("")}
    </svg>`,
  "hookah-smoke": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs><filter id="blur"><feGaussianBlur stdDeviation="18"/></filter></defs>
      ${base("#0b0a0a")}
      <circle cx="600" cy="980" r="70" fill="#a61e2b" opacity="0.5"/>
      <circle cx="600" cy="980" r="140" fill="#a61e2b" opacity="0.2"/>
      <g filter="url(#blur)" opacity="0.55">
        <path d="M600 950 C 560 800 680 700 610 560 C 550 440 700 360 630 220" stroke="#cfcfd2" stroke-width="46" fill="none" stroke-linecap="round"/>
        <path d="M600 950 C 640 820 520 720 590 580 C 650 460 500 380 560 240" stroke="#e8e8ea" stroke-width="28" fill="none" stroke-linecap="round" opacity="0.6"/>
      </g>
    </svg>`,
  "cocktail-pour": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs>
        <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e8863f"/>
          <stop offset="1" stop-color="#a61e2b"/>
        </linearGradient>
      </defs>
      ${base("#0a0a0b")}
      <path d="M420 260 L 780 260 L 640 700 L 560 700 Z" fill="none" stroke="#3a3a3e" stroke-width="6"/>
      <path d="M455 300 L 745 300 L 635 660 L 565 660 Z" fill="url(#liquid)" opacity="0.85"/>
      <rect x="590" y="700" width="20" height="140" fill="#3a3a3e"/>
      <ellipse cx="600" cy="845" rx="90" ry="16" fill="#3a3a3e"/>
      <path d="M600 120 L 610 300" stroke="#e8863f" stroke-width="6" opacity="0.7"/>
    </svg>`,
  "neon-sign": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs><filter id="soft"><feGaussianBlur stdDeviation="14"/></filter></defs>
      ${base("#060608")}
      <g filter="url(#soft)">
        <rect x="260" y="480" width="680" height="240" rx="120" fill="#c4212f" opacity="0.3"/>
      </g>
      <rect x="300" y="520" width="600" height="160" rx="80" fill="none" stroke="#ff5b6c" stroke-width="10" opacity="0.9"/>
      <rect x="300" y="520" width="600" height="160" rx="80" fill="none" stroke="#ffb3ba" stroke-width="3" opacity="0.7"/>
    </svg>`,
  "bar-crowd": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      ${base("#0a0a0d")}
      ${Array.from({ length: 7 }, (_, i) => `<path d="M${100 + i * 150} 1200 C ${100 + i * 150} 900 ${140 + i * 150} 820 ${160 + i * 150} 1200 Z" fill="#141416"/>`).join("")}
      ${Array.from({ length: 30 }, (_, i) => {
        const x = (i * 53) % 1200, y = 200 + ((i * 97) % 500);
        return `<circle cx="${x}" cy="${y}" r="${4 + (i % 3)}" fill="#ffcf87" opacity="${0.25 + (i % 4) * 0.12}"/>`;
      }).join("")}
    </svg>`,
  "private-room": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs>
        <radialGradient id="warm" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stop-color="#3a2214" stop-opacity="0.9"/>
          <stop offset="1" stop-color="#0a0a0b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      ${base("#0a0a0b")}
      <rect width="${SIZE}" height="${SIZE}" fill="url(#warm)"/>
      <ellipse cx="600" cy="760" rx="420" ry="120" fill="#181410" opacity="0.9"/>
      ${Array.from({ length: 5 }, (_, i) => `<circle cx="${360 + i * 120}" cy="720" r="10" fill="#ffcf87"/><circle cx="${360 + i * 120}" cy="720" r="26" fill="#ffcf87" opacity="0.2"/>`).join("")}
    </svg>`,
  "late-night": `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs>
        <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#05060a"/>
          <stop offset="1" stop-color="#0d0a08"/>
        </linearGradient>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="url(#night)"/>
      <rect x="0" y="820" width="${SIZE}" height="380" fill="#100d0a"/>
      <rect x="0" y="820" width="${SIZE}" height="10" fill="#a61e2b"/>
      <circle cx="600" cy="760" r="50" fill="#ffcf87" opacity="0.5"/>
      <circle cx="600" cy="760" r="140" fill="#ffcf87" opacity="0.12"/>
    </svg>`,
};

for (const [name, svg] of Object.entries(scenes)) {
  await render(svg, name);
}
console.log("done");
