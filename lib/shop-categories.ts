import { MARKETPLACE_CATEGORIES, shopCatalogCategoryWhere, shopCatalogProductWhere } from "@/lib/marketplace-catalog";
import type { MainCategory } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

export type ShopCategory = MainCategory;

const staticIconBySlug = new Map<string, string>(
  MARKETPLACE_CATEGORIES.map((c) => [c.id, c.icon] as const)
);
const staticNameBySlug = new Map<string, string>(
  MARKETPLACE_CATEGORIES.map((c) => [c.id, c.name] as const)
);

const slugOrder: string[] = MARKETPLACE_CATEGORIES.map((c) => c.id);

function sortByCatalogOrder(rows: ShopCategory[]): ShopCategory[] {
  return [...rows].sort((a, b) => slugOrder.indexOf(a.id) - slugOrder.indexOf(b.id));
}

function mapRow(row: { slug: string; name: string; icon: string | null }): ShopCategory {
  return {
    id: row.slug,
    name: staticNameBySlug.get(row.slug) ?? row.name,
    icon: row.icon ?? staticIconBySlug.get(row.slug) ?? "category",
  };
}

export async function listCatalogCategories(): Promise<ShopCategory[]> {
  try {
    const rows = await prisma.category.findMany({
      where: {
        ...shopCatalogCategoryWhere,
        products: { some: shopCatalogProductWhere },
      },
    });
    if (rows.length > 0) {
      return sortByCatalogOrder(rows.map(mapRow));
    }
    const all = await prisma.category.findMany({
      where: shopCatalogCategoryWhere,
    });
    if (all.length > 0) {
      return sortByCatalogOrder(all.map(mapRow));
    }
  } catch {
    /* DB belum siap */
  }
  return [...MARKETPLACE_CATEGORIES];
}

export async function listBerandaCategories(limit = 4): Promise<ShopCategory[]> {
  const cats = await listCatalogCategories();
  return cats.slice(0, limit);
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
    return {
      withProducts: MARKETPLACE_CATEGORIES.length,
      total: MARKETPLACE_CATEGORIES.length,
    };
  }
}
