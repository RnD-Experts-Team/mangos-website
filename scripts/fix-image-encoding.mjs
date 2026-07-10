/**
 * The real building photos were saved with a .jpg extension but are
 * actually PNG-encoded bytes (mismatched container vs extension). Next's
 * built-in image optimizer (sharp) trips on that, so next/image renders
 * blank while a raw <img> (no optimization) still works. Re-encode each
 * file as a true JPEG at the same path to fix it for good.
 *   node scripts/fix-image-encoding.mjs
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const targets = ["public/images/bar/bar-building.jpg", "public/images/grill/grill-building.jpg"];

for (const path of targets) {
  const input = await readFile(path);
  const meta = await sharp(input).metadata();
  const output = await sharp(input).rotate().jpeg({ quality: 90, mozjpeg: true }).toBuffer();
  await writeFile(path, output);
  console.log(`${path}: was ${meta.format} ${meta.width}x${meta.height} → re-encoded as true JPEG (${output.length} bytes)`);
}
