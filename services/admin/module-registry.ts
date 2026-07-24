import type { AdminModuleKey } from "@/types/admin/marketplace-module";
import { stitchScreens } from "@/lib/stitch-screens";

type ModuleMeta = {
  key: AdminModuleKey;
  label: string;
  adminHref: string;
  shopHref: string | null;
  stitchScreenTitle: string;
};

function stitchTitleForPath(path: string) {
  return stitchScreens.find((s) => s.path === path)?.title ?? "Marketplace";
}

/** Metadata modul — selaras route shop Stitch, tanpa tebakan layout. */
export const adminModuleRegistry: ModuleMeta[] = [
  {
    key: "products",
    label: "Produk",
    adminHref: "/admin/products",
    shopHref: "/categories",
    stitchScreenTitle: stitchTitleForPath("/categories"),
  },
  {
    key: "categories",
    label: "Kategori",
    adminHref: "/admin/categories",
    shopHref: "/categories",
    stitchScreenTitle: stitchTitleForPath("/categories"),
  },
  {
    key: "articles",
    label: "Artikel",
    adminHref: "/admin/articles",
    shopHref: "/beranda-artikel",
    stitchScreenTitle: stitchTitleForPath("/beranda-artikel"),
  },
  {
    key: "reviews",
    label: "Ulasan",
    adminHref: "/admin/reviews",
    shopHref: null,
    stitchScreenTitle: "Belum ada frame Stitch",
  },
  {
    key: "faq",
    label: "FAQ",
    adminHref: "/admin/faq",
    shopHref: null,
    stitchScreenTitle: "Belum ada frame Stitch",
  },
  {
    key: "rfq",
    label: "RFQ",
    adminHref: "/admin/rfq",
    shopHref: "/po-preview",
    stitchScreenTitle: stitchTitleForPath("/po-preview"),
  },
  {
    key: "favorites",
    label: "Favorit",
    adminHref: "/admin/favorites",
    shopHref: "/favorites",
    stitchScreenTitle: stitchTitleForPath("/favorites"),
  },
  {
    key: "customers",
    label: "Pelanggan",
    adminHref: "/admin/customers",
    shopHref: "/profile",
    stitchScreenTitle: stitchTitleForPath("/profile"),
  },
  {
    key: "admin",
    label: "Admin",
    adminHref: "/admin/users",
    shopHref: null,
    stitchScreenTitle: "Panel admin (bukan tampilan user)",
  },
];

export function getModuleMeta(key: AdminModuleKey) {
  const meta = adminModuleRegistry.find((m) => m.key === key);
  if (!meta) throw new Error(`Unknown module: ${key}`);
  return meta;
}
