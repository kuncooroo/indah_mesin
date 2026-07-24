/**
 * Urutan frame Stitch (Markdown Design System / IndustrialX).
 * design.md (17471124193786396757) tidak punya route UI.
 */
export const stitchScreens = [
  {
    order: 1,
    screenId: "752245e124a9439b82a70f682ba883b4",
    path: "/beranda-artikel",
    title: "Beranda dengan Artikel - Marketplace Industri",
  },
  {
    order: 2,
    screenId: "bb41ef25b6c34486943534852176efd8",
    path: "/po-preview/pdf",
    title: "Pratinjau PDF Purchase Order (A4)",
    desktop: true,
  },
  {
    order: 3,
    screenId: "360986f2dda64e95b30635bb6e1867b7",
    path: "/categories",
    title: "Kategori Food Processing - Ikon Simpan Bookmark",
  },
  {
    order: 4,
    screenId: "13f81347e6534b66bccc8d291ca920cd",
    path: "/contact",
    title: "Hubungi Kami & Lokasi Showroom",
  },
  {
    order: 5,
    screenId: "b40a6a126b6045f381cb4fd440ab02a8",
    path: "/marketplace-flow",
    title: "IndustrialX Marketplace Flow",
  },
  {
    order: 6,
    screenId: "285524d07ebe4be58f7453d94572964e",
    path: "/products/fdp-rtr-500",
    title: "Detail Produk - Retort Sterilizer",
    productSku: "FDP-RTR-500",
  },
  {
    order: 7,
    screenId: "8ae17002fd82414389dd020deee642b5",
    path: "/favorites",
    title: "Daftar Simpanan - Marketplace Industri",
  },
  {
    order: 9,
    screenId: "5720607af4934137bf50bb47e32cdfb4",
    path: "/po-preview",
    title: "Pratinjau Purchase Order dengan Profil Lengkap",
  },
  {
    order: 10,
    screenId: "710008f5dfb54336ab3738003f95f6b7",
    path: "/profile",
    title: "Profil Pengguna - IndustrialX",
  },
] as const;

export function stitchPathByOrder(order: number) {
  return stitchScreens.find((s) => s.order === order)?.path;
}

export function nextStitchPath(currentPath: string) {
  const idx = stitchScreens.findIndex((s) => s.path === currentPath);
  if (idx < 0 || idx >= stitchScreens.length - 1) return null;
  return stitchScreens[idx + 1].path;
}

export function prevStitchPath(currentPath: string) {
  const idx = stitchScreens.findIndex((s) => s.path === currentPath);
  if (idx <= 0) return null;
  return stitchScreens[idx - 1].path;
}

/** SKU item simpanan dari screen Daftar Simpanan */
export const stitchSavedSkus = ["VMC-850-X4", "IND-RT-1200", "COMP-RS-25"] as const;

/** Artikel beranda — screen 752245 */
export const stitchArticles = [
  {
    category: "Teknologi",
    title: "Cara Memilih Mesin Sterilisasi yang Tepat untuk Skala UKM",
    date: "12 Okt 2023",
    readTime: "5 min read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADeKcWqycgN_OmPR9oO-dNxTvxSw6gI0tvY-tyFPyAGMaHcl1EsKhztbtSE1FacgBefZSa8MiCVZne1o87Yn3cLFD7RVAUPtyebQLMYhgIq76NkA9htKpTU245tnIx3ksI6KR6BA7keKslt3a32lMidPxozyrjp5gqAIi9Reqqd4AzLuzQuP_QyuEwfTEaFt5x4qwgeDSpnoU_2t_s8iB_-_0NQrbEdtGTOqjj6LPLTDy5v8YAzMw4yFll90Rg12LnowLTR4dJRlXy",
  },
  {
    category: "Tips Bisnis",
    title: "Tren Pengemasan Kaleng 2024: Ramah Lingkungan & Efisien",
    date: "10 Okt 2023",
    readTime: "4 min read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwkw6D20FPs_Hu4dMGcD9yRo21WWcQaqN9URmL4-OlcRU0i-M0rHtbAIMuaQB0rE9LS57V6eC5ImBVqfFS8v7udAqBgY7RA4qtdvifoPXVmY2FHSgRxEmlEJE5WEbAUjbjgLcTfTdvsC-syMq50jCHYX4XTXkXRwOSBC3AcH51dWQAngZhfTCBiWQucKpu7h1OwU9JD2h_5Hu34vCdYFFvpNZgKD6q1O5be1kOcEABNb8cBhp96vCBnLnA2hlZxA1t5sq8UGMlRQE3",
  },
  {
    category: "Operasional",
    title: "Optimasi Produksi dengan Sistem Konveyor Otomatis",
    date: "08 Okt 2023",
    readTime: "6 min read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU7vgEjQaXmeGIHpMtBU_oHD9kIdG8kQjcfXg2FTkzAAB6SrfhpIaGAIgBhkVrG2L7EO71ut3Y8uuVUnm6OREbx7RqW2Zl0WBHmmnJviX3H4Zn8CEFNJ-NLlsGIYVa08er8M7w01_09UbfTYhdNIe06_T9ON-a0G_mBOljB8CJqDxMrsiQXXHFKdycZ2qsmh1CK7hz4CL1zfyrmmBSAtb4DHIw0IvwSy2b92i6iU0w9rWAy2FG7YzODT3xN5iV5SyRus7l5-U_RQ0l",
  },
] as const;

/** Kategori utama — screen Beranda Artikel (752245) */
export const berandaMainCategories = [
  { id: "sterilisasi", name: "Mesin Sterilisasi", icon: "cleaning_services" },
  { id: "penutup-kaleng", name: "Mesin Penutup Kaleng", icon: "view_in_ar" },
  { id: "seal-kemasan", name: "Mesin Seal Kemasan", icon: "inventory_2" },
  { id: "konveyor", name: "Mesin Konveyor", icon: "conveyor_belt" },
  { id: "produksi", name: "Mesin Produksi", icon: "factory" },
] as const;
