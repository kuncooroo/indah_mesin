import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0B1120"/>
  <rect x="64" y="64" width="384" height="384" rx="48" fill="#111827" stroke="#06B6D4" stroke-width="8"/>
  <circle cx="256" cy="200" r="56" fill="none" stroke="#06B6D4" stroke-width="12"/>
  <path d="M256 144 L256 200 L296 220" stroke="#14B8A6" stroke-width="10" stroke-linecap="round" fill="none"/>
  <rect x="120" y="300" width="80" height="100" rx="8" fill="#1F2937" stroke="#374151" stroke-width="4"/>
  <rect x="216" y="260" width="80" height="140" rx="8" fill="#1F2937" stroke="#06B6D4" stroke-width="4"/>
  <rect x="312" y="320" width="80" height="80" rx="8" fill="#1F2937" stroke="#374151" stroke-width="4"/>
  <text x="256" y="460" text-anchor="middle" font-family="Arial,sans-serif" font-size="36" font-weight="700" fill="#06B6D4">IM</text>
</svg>`;

await mkdir(outDir, { recursive: true });

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon-${size}.png`));
}

await sharp(Buffer.from(svg))
  .resize(512, 512)
  .extend({
    top: 64,
    bottom: 64,
    left: 64,
    right: 64,
    background: { r: 11, g: 17, b: 32, alpha: 1 },
  })
  .resize(512, 512)
  .png()
  .toFile(join(outDir, "icon-maskable-512.png"));

await writeFile(join(outDir, "icon.svg"), svg.trim());

console.log("PWA icons generated in public/icons/");
