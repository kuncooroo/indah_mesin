import { shopCatalogCategoryWhere, shopCatalogProductWhere } from "@/lib/storefront/catalog-data";
import { prisma } from "@/lib/prisma";

export type StorefrontCategory = {
  id: string;
  name: string;
  icon: string;
};

function mapRow(row: { slug: string; name: string; icon: string | null }): StorefrontCategory {
  return {
    id: row.slug,
    name: row.name,
    icon: row.icon ?? "category",
  };
}

/** Kategori storefront dari MySQL (semua kategori yang dikelola admin). */
export async function listCatalogCategories(): Promise<StorefrontCategory[]> {
  try {
    const withPublishedProducts = await prisma.category.findMany({
      where: {
        ...shopCatalogCategoryWhere,
        products: { some: shopCatalogProductWhere },
      },
      orderBy: { name: "asc" },
    });
    if (withPublishedProducts.length > 0) {
      return withPublishedProducts.map(mapRow);
    }

    const all = await prisma.category.findMany({
      where: shopCatalogCategoryWhere,
      orderBy: { name: "asc" },
    });
    return all.map(mapRow);
  } catch {
    return [];
  }
}

export async function listBerandaCategories(limit = 4): Promise<StorefrontCategory[]> {
  const cats = await listCatalogCategories();
  return cats.slice(0, limit);
}

export async function findCatalogCategoryBySlug(
  slug: string
): Promise<StorefrontCategory | undefined> {
  try {
    const row = await prisma.category.findFirst({
      where: { ...shopCatalogCategoryWhere, slug },
    });
    return row ? mapRow(row) : undefined;
  } catch {
    return undefined;
  }
}

export async function countShopCategories() {
  try {
    const [withProducts, total] = await Promise.all([
      prisma.category.count({
        where: {
          ...shopCatalogCategoryWhere,
          products: { some: shopCatalogProductWhere },
        },
      }),
      prisma.category.count({ where: shopCatalogCategoryWhere }),
    ]);
    return { withProducts, total };
  } catch {
    return { withProducts: 0, total: 0 };
  }
}
