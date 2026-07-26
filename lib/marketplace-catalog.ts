import type { Product, ProductStatus } from "@/lib/products";
import type { Prisma } from "@prisma/client";

/** Slug kategori — selaras admin & storefront */
export const MARKETPLACE_CATEGORIES = [
  {
    id: "mesin-sterilisasi",
    name: "Mesin Sterilisasi",
    icon: "biotech",
  },
  {
    id: "mesin-penutup-kaleng",
    name: "Mesin Penutup Kaleng",
    icon: "lunch_dining",
  },
  {
    id: "mesin-seal-kemasan",
    name: "Mesin Seal Kemasan",
    icon: "inventory_2",
  },
  {
    id: "mesin-produksi",
    name: "Mesin Produksi",
    icon: "precision_manufacturing",
  },
] as const;

export type MarketplaceCategorySlug = (typeof MARKETPLACE_CATEGORIES)[number]["id"];

export const MARKETPLACE_QUICK_FILTERS = [
  { id: "ready", label: "Ready Stock" },
  { id: "indent", label: "Inden" },
  { id: "new", label: "Terbaru" },
  { id: "price", label: "Harga Terbaik" },
] as const;

const RETORT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuATo9OiVElbXKff7x40hmph9vONdRV6AGfrMN3Mb3Ju3Cq3DvETTRvmYOzLpOhmLfEG9C_sqxjZH4dnVNbcnnxVOhN-guDUElL0HS6ycfeeRcRKGt0umRNiSf-712ViaLkwTS8L2tRjpWM1RCzEKCRrYkfrj3ea6aJjip3m9dNJ0yTkvDYdL4huGO-2JpuToXHUrWcF2qRHjs0mXBCU_C1YT4ZWLqQwQEj9wLEgMjGBXXRSubKUovCaZySiAHB3ilPNCpbAHE5QW2vz";

const GENERIC_MACHINE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCtTKLH6D5sgnWoHc5DaIFwdx-E0KHMwu_MYMUf8nMkIKlE38ozC3w_z-3zFg4gPZWmFOi25TF6eLiyXrMnZjqH1so1lQfbtIrs-CrlJ7tQDDlAoZmAaf7Dh-4h2Q3vd0GJdvpsnDa4UWkhoaVgVv6pwGQSpWamaMq-Twn_8dlYqRmqvdk5DXM3SLL6RhbZcWS4vOJZY2Kr7smo2-AhNQO-qy7JrmwesrC12k_fi9TYx8b3tZI5MAQ3Xf6jWX9-hM54LGbBZQnq-mtA";

type CatalogSeed = Product & { category: MarketplaceCategorySlug };

/** Enam produk resmi Indah Mesin — satu sumber untuk seed & fallback. */
export const MARKETPLACE_PRODUCTS: CatalogSeed[] = [
  {
    id: "industrial-retort-sterilizer-high-pressure-steam",
    sku: "FDP-RTR-500",
    name: "Industrial Retort Sterilizer - High Pressure Steam",
    subtitle: "Double-tank water immersion retort untuk sterilisasi food grade.",
    category: "mesin-sterilisasi",
    categoryLabel: "Mesin Sterilisasi",
    image: RETORT_IMAGE,
    priceLabel: "Mulai dari Rp 285.000.000+",
    priceNote: "*Harga belum termasuk instalasi & pengiriman luar kota.",
    status: "ready",
    statusLabel: "Ready Stock",
    features: [
      "Double-tank water immersion untuk efisiensi energi.",
      "Kontrol PLC otomatis untuk ramping suhu presisi.",
      "Distribusi panas merata untuk produk kaleng & pouch.",
    ],
    specs: [
      { label: "Model", value: "RTR-500 Food Grade" },
      { label: "Kapasitas", value: "500 Liter / Batch" },
      { label: "Suhu Maks", value: "147°C" },
    ],
  },
  {
    id: "sterilisator-uap-batch-200l",
    sku: "IMS-STEAM-200",
    name: "Sterilisator Uap Batch 200L",
    subtitle: "Autoclave industri untuk UHT, kaleng, dan pouch skala menengah.",
    category: "mesin-sterilisasi",
    categoryLabel: "Mesin Sterilisasi",
    image: GENERIC_MACHINE,
    priceLabel: "Mulai dari Rp 165.000.000+",
    status: "indent",
    statusLabel: "Inden ±21 hari",
    features: ["Jacket heating uniform.", "Interlock tekanan & suhu.", "Data logging batch."],
    specs: [
      { label: "Kapasitas", value: "200 Liter" },
      { label: "Tekanan kerja", value: "0,35 MPa" },
    ],
  },
  {
    id: "mesin-penutup-kaleng-semi-otomatis",
    sku: "IMS-CAN-80",
    name: "Mesin Penutup Kaleng Semi-Otomatis",
    subtitle: "Seamer kaleng diameter 52–99 mm untuk lini F&B.",
    category: "mesin-penutup-kaleng",
    categoryLabel: "Mesin Penutup Kaleng",
    image: GENERIC_MACHINE,
    priceLabel: "Mulai dari Rp 48.500.000+",
    status: "ready",
    statusLabel: "Ready Stock",
    features: ["Roll seaming presisi.", "Tooling cepat ganti ukuran.", "Panel touch HMI."],
    specs: [
      { label: "Kecepatan", value: "40–80 kaleng/menit" },
      { label: "Diameter", value: "52–99 mm" },
    ],
  },
  {
    id: "lini-penutup-kaleng-rotary",
    sku: "IMS-CAN-LINE",
    name: "Lini Penutup Kaleng Rotary High-Speed",
    subtitle: "Can seamer rotary untuk kapasitas produksi tinggi.",
    category: "mesin-penutup-kaleng",
    categoryLabel: "Mesin Penutup Kaleng",
    image: GENERIC_MACHINE,
    priceLabel: "Mulai dari Rp 320.000.000+",
    status: "indent",
    statusLabel: "Inden ±45 hari",
    features: ["Rotary 6 head seaming.", "Integrasi conveyor.", "Monitoring OEE ready."],
    specs: [
      { label: "Kapasitas", value: "300–600 kaleng/menit" },
      { label: "Power", value: "380V 3 Phase" },
    ],
  },
  {
    id: "continuous-band-sealer-industrial",
    sku: "IMS-SEAL-450",
    name: "Continuous Band Sealer Industrial",
    subtitle: "Mesin seal kemasan plastik continuous untuk pouch & standing bag.",
    category: "mesin-seal-kemasan",
    categoryLabel: "Mesin Seal Kemasan",
    image: GENERIC_MACHINE,
    priceLabel: "Mulai dari Rp 22.000.000+",
    status: "ready",
    statusLabel: "Ready Stock",
    features: ["Heater PID stabil.", "Lebar seal adjustable.", "Counter produksi."],
    specs: [
      { label: "Lebar seal", value: "10–15 mm" },
      { label: "Kecepatan", value: "5–12 m/menit" },
    ],
  },
  {
    id: "mesin-produksi-mixing-filling",
    sku: "IMS-PROD-1000",
    name: "Mesin Produksi Mixing & Filling Line",
    subtitle: "Lini mixing, filling, dan seal untuk produksi skala industri.",
    category: "mesin-produksi",
    categoryLabel: "Mesin Produksi",
    image: GENERIC_MACHINE,
    priceLabel: "Mulai dari Rp 410.000.000+",
    status: "indent",
    statusLabel: "Inden ±60 hari",
    features: ["CIP ready stainless pipeline.", "Filling volumetric servo.", "Integrasi MES optional."],
    specs: [
      { label: "Kapasitas filling", value: "1.000–3.000 L/jam" },
      { label: "Material contact", value: "SS316L" },
    ],
  },
];

export const MARKETPLACE_SKUS = MARKETPLACE_PRODUCTS.map((p) => p.sku);

export function catalogProductToSeedStatus(status: ProductStatus) {
  switch (status) {
    case "indent":
      return "INDENT" as const;
    case "contact":
      return "OUT_OF_STOCK" as const;
    default:
      return "READY_STOCK" as const;
  }
}

export function parseCatalogPriceIdr(priceLabel: string): number {
  const digits = priceLabel.replace(/[^\d]/g, "");
  return parseInt(digits, 10) || 0;
}

/** Slug kategori yang tampil di toko & admin (sumber sama). */
export const MARKETPLACE_CATEGORY_SLUGS = MARKETPLACE_CATEGORIES.map((c) => c.id);

/** Produk yang tampil di halaman user — admin memakai filter yang sama. */
export const shopCatalogProductWhere: Prisma.ProductWhereInput = {
  isPublished: true,
  sku: { in: [...MARKETPLACE_SKUS] },
};

export const shopCatalogCategoryWhere: Prisma.CategoryWhereInput = {
  slug: { in: [...MARKETPLACE_CATEGORY_SLUGS] },
};

export function adminProductListWhere(
  q?: string
): Prisma.ProductWhereInput {
  if (!q?.trim()) return shopCatalogProductWhere;
  const term = q.trim();
  return {
    AND: [
      shopCatalogProductWhere,
      {
        OR: [
          { name: { contains: term } },
          { sku: { contains: term } },
          { category: { name: { contains: term } } },
        ],
      },
    ],
  };
}

export function adminCategoryListWhere(q?: string): Prisma.CategoryWhereInput {
  if (!q?.trim()) return shopCatalogCategoryWhere;
  const term = q.trim();
  return {
    AND: [
      shopCatalogCategoryWhere,
      {
        OR: [{ name: { contains: term } }, { slug: { contains: term } }],
      },
    ],
  };
}

export function sortProductsByCatalogSku<T extends { sku: string }>(rows: T[]): T[] {
  const rank = new Map(MARKETPLACE_SKUS.map((sku, i) => [sku, i]));
  return [...rows].sort(
    (a, b) => (rank.get(a.sku) ?? 999) - (rank.get(b.sku) ?? 999)
  );
}

export function sortCategoriesByCatalogSlug<T extends { slug: string }>(rows: T[]): T[] {
  const rank = new Map<string, number>(
    MARKETPLACE_CATEGORY_SLUGS.map((slug, i) => [slug, i])
  );
  return [...rows].sort(
    (a, b) => (rank.get(a.slug) ?? 999) - (rank.get(b.slug) ?? 999)
  );
}
