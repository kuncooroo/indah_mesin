import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const htmlDir = join(root, ".stitch-cache", "16631126552039360991", "html");

function extractImg(html, nearIndex) {
  const slice = html.slice(Math.max(0, nearIndex - 500), nearIndex + 2000);
  const m = slice.match(/src="(https:\/\/lh3\.googleusercontent\.com[^"]+)"/);
  return m?.[1] ?? null;
}

function parseCategoryHtml(html, source) {
  const items = [];
  const re =
    /SKU:\s*([A-Z0-9-]+)[\s\S]*?<h3 class="font-headline-md[^"]*"[^>]*>([^<]+)<\/h3>[\s\S]*?(READY STOCK|Indent[^<]*|Indent \([^)]+\))[\s\S]*?(?:Rp\s[\d.]+(?:\+)?|USD\s[\d,]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    items.push({ sku: m[1], name: m[2].trim(), status: m[3], source });
  }
  return items;
}

// Manual parse blocks for category page
function parseFoodCategory(html) {
  const blocks = html.split(
    '<div class="bg-surface border border-border-subtle rounded-lg overflow-hidden'
  );
  const items = [];
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const sku = b.match(/SKU:\s*([A-Z0-9-]+)/)?.[1];
    const name = b.match(
      /<h3 class="font-headline-md text-headline-md text-primary mb-2 line-clamp-2">([^<]+)/
    )?.[1];
    const status = b.match(
      /absolute top-3 left-3[^>]*>([^<]+)</
    )?.[1]?.trim();
    const price = b.match(/font-bold text-primary">([^<]+)</)?.[1];
    const img = b.match(/url\('([^']+)'\)/)?.[1] ?? b.match(/src="([^"]+)"/)?.[1];
    const desc = b.match(
      /<p class="text-body-sm text-on-surface-variant line-clamp-2 mb-4">([^<]+)/
    )?.[1];
    if (sku && name) items.push({ sku, name, status, price, img, desc, source: "360986f2" });
  }
  return items;
}

function parseKategoriFilter(html) {
  const blocks = html.split(
    '<div class="bg-surface border border-border-subtle rounded-lg overflow-hidden'
  );
  const items = [];
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const sku = b.match(/SKU:\s*([A-Z0-9-]+)/)?.[1];
    const name = b.match(/<h3 class="font-headline-md[^"]*">([^<]+)/)?.[1];
    const status = b.match(/bg-status-\w+[^>]*>([^<]+)</)?.[1]?.trim();
    const price = b.match(/text-primary font-bold[^>]*>([^<]+)</)?.[1];
    const img = b.match(/url\('([^']+)'\)/)?.[1];
    if (sku && name) items.push({ sku, name, status, price, img, source: "kategori-filter" });
  }
  return items;
}

function parseHomeCards(html, source) {
  const blocks = html.split(
    '<div class="group bg-white rounded-xl border border-border-subtle overflow-hidden'
  );
  const items = [];
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const name = b.match(/<h4 class="font-body-md font-bold[^"]*">([^<]+)/)?.[1];
    const sku = b.match(/#([A-Z0-9-]+)<\/span>/)?.[1];
    const status = b.match(/uppercase tracking-wider">([^<]+)</)?.[1];
    const price = b.match(/font-label-technical font-bold text-primary">([^<]+)/)?.[1];
    const desc = b.match(/line-clamp-2">([^<]+)/)?.[1];
    const img = b.match(/src="(https:\/\/lh3[^"]+)"/)?.[1];
    if (name && sku)
      items.push({ sku, name, status, price, desc, img, source });
  }
  return items;
}

function parseSaved(html) {
  const blocks = html.split("<article");
  const items = [];
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const sku = b.match(/SKU:\s*([A-Z0-9-]+)/)?.[1];
    const name = b.match(/<h3 class="font-headline-md[^"]*">([^<]+)/)?.[1];
    const status = b.match(/tracking-wider">([^<]+)</)?.[1];
    const price = b.match(/font-bold text-on-surface">([^<]+)/)?.[1];
    const note = b.match(/text-\[11px\][^>]*>([^<]+)/)?.[1];
    const img = b.match(/src="(https:\/\/lh3[^"]+)"/)?.[1];
    if (sku && name)
      items.push({ sku, name, status, price, priceNote: note, img, source: "saved" });
  }
  return items;
}

const all = [];
for (const file of readdirSync(htmlDir).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(join(htmlDir, file), "utf8");
  if (file.includes("360986f2")) all.push(...parseFoodCategory(html));
  if (file.includes("kategori-filter")) all.push(...parseKategoriFilter(html));
  if (file.includes("b40a6a") || file.includes("752245") || file.includes("beranda"))
    all.push(...parseHomeCards(html, file));
  if (file.includes("8ae17002") || file.includes("daftar-simpanan"))
    all.push(...parseSaved(html));
}

// dedupe by sku
const bySku = new Map();
for (const item of all) {
  if (!bySku.has(item.sku)) bySku.set(item.sku, item);
}

writeFileSync(
  join(root, "scripts", "stitch-products-raw.json"),
  JSON.stringify([...bySku.values()], null, 2)
);
console.log("Unique products:", bySku.size);
for (const p of bySku.values()) console.log(p.sku, "-", p.name);
