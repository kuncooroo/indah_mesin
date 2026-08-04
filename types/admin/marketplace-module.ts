/** Modul admin ↔ layar marketplace (Stitch routes di lib/stitch-screens.ts) */
export type AdminModuleKey =
  | "products"
  | "categories"
  | "articles"
  | "faq"
  | "orders"
  | "companies"
  | "customers"
  | "documents"
  | "admin";

export type AdminModuleSummary = {
  key: AdminModuleKey;
  label: string;
  adminHref: string;
  /** Jumlah yang tampil / relevan di app user */
  shopVisibleCount: number;
  /** Total record di database (jika berbeda) */
  databaseTotal: number;
  shopHref: string | null;
  stitchScreenTitle: string;
};

export type AdminDashboardInsight = {
  savedItemsTotal: number;
  legacyRfqTotal: number;
  userTotal?: number;
  adminTotal?: number;
  orderTotal?: number;
};
