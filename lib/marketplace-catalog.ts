import type { Product, ProductStatus } from "@/lib/products";
import type { Prisma } from "@prisma/client";

/** Slug kategori — selaras admin & storefront (5 kategori, mockup IndustrialX) */
export const MARKETPLACE_CATEGORIES = [
  {
    id: "mesin-sterilisasi",
    name: "Sterilization Machines",
    icon: "cleaning_services",
  },
  {
    id: "mesin-penutup-kaleng",
    name: "Can Seaming Machines",
    icon: "view_in_ar",
  },
  {
    id: "mesin-seal-kemasan",
    name: "Packaging Sealers",
    icon: "inventory_2",
  },
  {
    id: "mesin-konveyor",
    name: "Conveyor Systems",
    icon: "precision_manufacturing",
  },
  {
    id: "mesin-produksi",
    name: "Production Machines",
    icon: "factory",
  },
] as const;

export type MarketplaceCategorySlug = (typeof MARKETPLACE_CATEGORIES)[number]["id"];

export const MARKETPLACE_QUICK_FILTERS = [
  { id: "ready", label: "Ready Stock" },
  { id: "new", label: "New Arrival" },
  { id: "price", label: "Best Price" },
  { id: "heavy", label: "Heavy Duty" },
] as const;

/** Tiga produk unggulan beranda — urutan & gambar selaras mockup IndustrialX */
export const HOME_FEATURED_SKUS = ["FDP-RTR-500", "IMS-STEAM-200", "IMS-PROD-1000"] as const;

const RETORT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuATo9OiVElbXKff7x40hmph9vONdRV6AGfrMN3Mb3Ju3Cq3DvETTRvmYOzLpOhmLfEG9C_sqxjZH4dnVNbcnnxVOhN-guDUElL0HS6ycfeeRcRKGt0umRNiSf-712ViaLkwTS8L2tRjpWM1RCzEKCRrYkfrj3ea6aJjip3m9dNJ0yTkvDYdL4huGO-2JpuToXHUrWcF2qRHjs0mXBCU_C1YT4ZWLqQwQEj9wLEgMjGBXXRSubKUovCaZySiAHB3ilPNCpbAHE5QW2vz";

const IMG_MACHINING =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsjR1YVrUEM71BWz2hhLaid3gfD0In36YfKTAxOEerk1INgZ6_hzx6QOUCvhyaHEdV61Mis1Fuje37Dy2c6-i3MSUU_29i0NCEvSXjdHzU8h_LQ6psB2AqYTGwzH2ePpSeW6hajYurLAYkHljNhn9uIlO19pAyH5oc-5XLS08OGvZNIcyNmPvBZhoW4KfAkF-Mcojc2NHrmwiHAorhUdt7Y8Zor4hGftqNBH1FRKFYwGo7VknQpnbPZDuebKLQ6jZKs6OVYenfUieX";

const IMG_FILLER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQPmVVxQ_LrTuB2zoeD13D3VZ8EoGs5AGfimiuWfsLzQ0q0nTLVEN60ncAPL-pIfIzm6jqVoh71NRucvlY31zblNZlpJr_fcIOuvePPP6qhYj_BFR_1idG-vJZy8aMEJXw_SZyRr1bC6sZYU0S97hZjycFCQ4j6jQ70pBYD5i1tS-tamsBe_mKS6z3kk1THW0PJtJsys3M0mvViQxtUOK5NLcJ0qzunCFuq1t2052Ms-Xqpn9h4mc5g_Km_iIkNT5RK_x-wsPVm2Ae";

const IMG_GENSET =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDrxWJ6RNAaT_9R8pNdOeuWQjjfedjtlMWw-XKYmkUp1QACERTYrYdO8bHN3Qag6Kg-6lifiSzMpL24w4Iv5lXWbubKlRKu5VqCi7IpMznmVHJO8z-NA-vK9COPOWb3SD7A0iNc40CN_XPXgXdRflHq8Oyz_pxOj2SuD2N6Z2tgaoYoL-GQPccH1MCL8jTLz9PyO5ZpIe0hWojBfZDLHm3OKh5_81fFsuMMZbUSeL_Mlq6hy8MNryucEeG63keUzE3kVPFL-gxmgv6n";

const IMG_CONVEYOR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBU7vgEjQaXmeGIHpMtBU_oHD9kIdG8kQjcfXg2FTkzAAB6SrfhpIaGAIgBhkVrG2L7EO71ut3Y8uuVUnm6OREbx7RqW2Zl0WBHmmnJviX3H4Zn8CEFNJ-NLlsGIYVa08er8M7w01_09UbfTYhdNIe06_T9ON-a0G_mBOljB8CJqDxMrsiQXXHFKdycZ2qsmh1CK7hz4CL1zfyrmmBSAtb4DHIw0IvwSy2b92i6iU0w9rWAy2FG7YzODT3xN5iV5SyRus7l5-U_RQ0l";

const IMG_CAN_SEAMER =
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
    savedPriceNote: "Harga estimasi spesifikasi standar. Logistik belum termasuk.",
    savedSecondaryAction: "brochure",
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
    image: IMG_FILLER,
    priceLabel: "Mulai dari Rp 165.000.000+",
    savedPriceNote: "Harga bervariasi menurut kapasitas volume. Minta penawaran resmi.",
    savedSecondaryAction: "spec",
    status: "indent",
    statusLabel: "Indent 4 Minggu",
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
    image: IMG_CAN_SEAMER,
    priceLabel: "Mulai dari Rp 48.500.000+",
    savedPriceNote: "Stok tersedia di hub Jakarta dan Surabaya.",
    savedSecondaryAction: "brochure",
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
    image: IMG_FILLER,
    priceLabel: "Mulai dari Rp 320.000.000+",
    savedPriceNote: "Lead time inden ±45 hari. Harga belum termasuk integrasi lini.",
    savedSecondaryAction: "spec",
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
    image: IMG_FILLER,
    priceLabel: "Mulai dari Rp 22.000.000+",
    savedPriceNote: "Harga entry untuk lini pouch & standing bag skala menengah.",
    savedSecondaryAction: "brochure",
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
    image: IMG_GENSET,
    priceLabel: "Mulai dari Rp 410.000.000+",
    savedPriceNote: "Konfigurasi lini disesuaikan kapasitas pabrik. Engineering review diperlukan.",
    savedSecondaryAction: "availability",
    status: "ready",
    statusLabel: "Ready Stock",
    features: ["CIP ready stainless pipeline.", "Filling volumetric servo.", "Integrasi MES optional."],
    specs: [
      { label: "Kapasitas filling", value: "1.000–3.000 L/jam" },
      { label: "Material contact", value: "SS316L" },
    ],
  },
  {
    id: "sistem-konveyor-belt-industri",
    sku: "IMS-CONV-600",
    name: "Sistem Konveyor Belt Otomatis",
    subtitle: "Optimasi produksi dengan sistem konveyor otomatis untuk lini F&B.",
    category: "mesin-konveyor",
    categoryLabel: "Mesin Konveyor",
    image: IMG_CONVEYOR,
    priceLabel: "Mulai dari Rp 95.000.000+",
    savedPriceNote: "Modul 6–24 m; instalasi dan commissioning terpisah.",
    savedSecondaryAction: "availability",
    status: "ready",
    statusLabel: "Ready Stock",
    features: ["Modular belt SS304.", "Variable speed drive.", "Sensor jamming & safety interlock."],
    specs: [
      { label: "Panjang", value: "6–24 meter" },
      { label: "Kapasitas", value: "500–2.000 kg/jam" },
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
