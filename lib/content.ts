import { stitchArticles } from "@/lib/stitch-screens";

import { prisma } from "@/lib/prisma";

import {

  mainCategories,

  filterCategories,

} from "@/lib/categories";

import { berandaMainCategories } from "@/lib/stitch-screens";



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

  MARKETPLACE: mainCategories.map((c) => c.id),

  FILTER: filterCategories.map((c) => c.id),

  BERANDA: berandaMainCategories.map((c) => c.id),

} as const;



export async function listCategoriesByGroup(

  group: "MARKETPLACE" | "FILTER" | "BERANDA"

) {

  const slugs = groupSlugs[group];

  try {

    return await prisma.category.findMany({

      where: { slug: { in: [...slugs] } },

      orderBy: { name: "asc" },

    });

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

  return ["Ready Stock", "New Arrival", "Best Price", "Heavy Duty"];

}

