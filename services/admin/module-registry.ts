import type { AdminModuleKey } from "@/types/admin/marketplace-module";

import { stitchScreens } from "@/lib/storefront/content-data";

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

/** Metadata modul sidebar & dashboard — tanpa menu legacy/consumer. */

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
    key: "orders",

    label: "Order / PO",

    adminHref: "/admin/orders",

    shopHref: "/po-preview",

    stitchScreenTitle: stitchTitleForPath("/po-preview"),
  },

  {
    key: "documents",

    label: "Dokumen",

    adminHref: "/admin/documents",

    shopHref: "/profile/docs",

    stitchScreenTitle: "Arsip PDF",
  },

  {
    key: "companies",

    label: "Perusahaan",

    adminHref: "/admin/companies",

    shopHref: "/profile",

    stitchScreenTitle: stitchTitleForPath("/profile"),
  },

  {
    key: "customers",

    label: "User tanpa perusahaan",

    adminHref: "/admin/customers",

    shopHref: "/profile",

    stitchScreenTitle: "Akun pembeli tanpa Company",
  },

  {
    key: "articles",

    label: "Artikel",

    adminHref: "/admin/articles",

    shopHref: "/beranda-artikel",

    stitchScreenTitle: stitchTitleForPath("/beranda-artikel"),
  },

  {
    key: "faq",

    label: "FAQ",

    adminHref: "/admin/faq",

    shopHref: "/profile/help",

    stitchScreenTitle: "Help Center",
  },

  {
    key: "admin",

    label: "Pengaturan Admin",

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
