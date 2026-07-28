import type { MetadataRoute } from "next";
import { listPublishedProducts } from "@/lib/storefront/catalog";
import { MARKETPLACE_CATEGORIES } from "@/lib/storefront/catalog-data";

const base = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listPublishedProducts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/beranda-artikel`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/categories`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/favorites`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const categoryRoutes = MARKETPLACE_CATEGORIES.map((c) => ({
    url: `${base}/categories?cat=${encodeURIComponent(c.id)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
