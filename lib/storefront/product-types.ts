export type ProductStatus = "ready" | "indent" | "contact";

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  image: string;
  gallery?: string[];
  priceLabel: string;
  priceNote?: string;
  status: ProductStatus;
  statusLabel?: string;
  features?: string[];
  specs?: { label: string; value: string }[];
  savedPriceNote?: string;
  savedSecondaryAction?: "brochure" | "spec" | "availability";
  slug?: string;
  /** Prisma product UUID — untuk saved items API */
  dbProductId?: string;
  brochureUrl?: string;
  sopUrl?: string;
  indentDays?: number;
  /** Numeric price for sorting/filter (IDR) */
  priceAmount?: number;
  createdAt?: string;
  downloads?: { title: string; subtitle?: string; fileUrl: string; icon?: string }[];
}

import { MARKETPLACE_PRODUCTS } from "@/lib/storefront/catalog-data";

export function skuToProductId(sku: string) {
  return sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Fallback hanya 6 produk resmi — sama dengan seed DB */
export const products: Product[] = MARKETPLACE_PRODUCTS.map((p) => ({ ...p }));

export function getProductBySku(sku: string) {
  return products.find((p) => p.sku === sku);
}
