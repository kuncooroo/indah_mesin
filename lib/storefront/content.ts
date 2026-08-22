import { stitchArticles } from "@/lib/storefront/content-data";

import { prisma } from "@/lib/prisma";

import { MARKETPLACE_QUICK_FILTERS } from "@/lib/storefront/catalog-data";

import { berandaMainCategories } from "@/lib/storefront/content-data";

export type ArticleCard = {
  category: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
};

function formatArticleDate(d: Date) {
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function listPublishedArticles(): Promise<ArticleCard[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length > 0) {
      return rows.map((a) => ({
        category: a.category,
        title: a.title,
        date: formatArticleDate(a.publishedAt),
        readTime: `${a.readMinutes} min read`,
        image: a.imageUrl,
        slug: a.slug,
      }));
    }
  } catch {
    /* fallback */
  }
  return stitchArticles.map((a) => ({
    ...a,
    slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40),
  }));
}

const groupSlugs = {
  BERANDA: berandaMainCategories.map((c) => c.id),
} as const;

/** Kategori dari DB — MARKETPLACE/FILTER = semua kategori; BERANDA bisa prefer slug legacy. */
export async function listCategoriesByGroup(group: "MARKETPLACE" | "FILTER" | "BERANDA") {
  try {
    if (group === "BERANDA") {
      const slugs = groupSlugs.BERANDA;
      const preferred = await prisma.category.findMany({
        where: { slug: { in: [...slugs] } },
        orderBy: { name: "asc" },
      });
      if (preferred.length > 0) return preferred;
    }
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export async function listActiveQuickFilters() {
  try {
    const rows = await prisma.quickFilter.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows.map((r) => r.label);
  } catch {
    /* fallback */
  }
  return MARKETPLACE_QUICK_FILTERS.map((f) => f.label);
}
