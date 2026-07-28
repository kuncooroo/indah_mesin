import { stitchArticles } from "@/lib/storefront/content-data";

import { prisma } from "@/lib/prisma";

import { MARKETPLACE_CATEGORIES, MARKETPLACE_QUICK_FILTERS } from "@/lib/storefront/catalog-data";

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
  MARKETPLACE: MARKETPLACE_CATEGORIES.map((c) => c.id),
  FILTER: MARKETPLACE_CATEGORIES.map((c) => c.id),
  BERANDA: berandaMainCategories.map((c) => c.id),
} as const;

/** Kategori dari DB — slug group hanya fallback urutan jika perlu. */
export async function listCategoriesByGroup(group: "MARKETPLACE" | "FILTER" | "BERANDA") {
  const slugs = groupSlugs[group];
  try {
    const rows = await prisma.category.findMany({
      where: { slug: { in: [...slugs] } },
      orderBy: { name: "asc" },
    });
    if (rows.length > 0) return rows;
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
