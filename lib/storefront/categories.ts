import { shopCatalogCategoryWhere, shopCatalogProductWhere } from "@/lib/storefront/catalog-data";
import { prisma } from "@/lib/prisma";
import {
  flattenCategoryTree,
  type StorefrontCategory,
} from "@/lib/storefront/category-utils";

export type { StorefrontCategory } from "@/lib/storefront/category-utils";
export { flattenCategoryTree, collectCategorySlugs } from "@/lib/storefront/category-utils";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  parentId: string | null;
};

function mapRow(row: CategoryRow): StorefrontCategory {
  return {
    id: row.slug,
    name: row.name,
    icon: row.icon ?? "category",
    parentId: row.parentId,
  };
}

function buildCategoryTree(rows: CategoryRow[]): StorefrontCategory[] {
  const byId = new Map(rows.map((r) => [r.id, { ...mapRow(r), children: [] as StorefrontCategory[] }]));
  const roots: StorefrontCategory[] = [];

  for (const row of rows) {
    const node = byId.get(row.id)!;
    if (row.parentId && byId.has(row.parentId)) {
      byId.get(row.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  function sortNodes(nodes: StorefrontCategory[]) {
    nodes.sort((a, b) => a.name.localeCompare(b.name, "id"));
    for (const n of nodes) {
      if (n.children?.length) sortNodes(n.children);
    }
  }
  sortNodes(roots);
  return roots;
}

async function fetchCategoryRows(): Promise<CategoryRow[]> {
  const withPublishedProducts = await prisma.category.findMany({
    where: {
      ...shopCatalogCategoryWhere,
      OR: [
        { products: { some: shopCatalogProductWhere } },
        { children: { some: { products: { some: shopCatalogProductWhere } } } },
      ],
    },
    select: { id: true, slug: true, name: true, icon: true, parentId: true },
  });

  if (withPublishedProducts.length > 0) {
    const ids = new Set(withPublishedProducts.map((c) => c.id));
    const parentIds = withPublishedProducts
      .map((c) => c.parentId)
      .filter((id): id is string => Boolean(id));
    const missingParents = parentIds.filter((id) => !ids.has(id));
    if (missingParents.length > 0) {
      const parents = await prisma.category.findMany({
        where: { id: { in: missingParents } },
        select: { id: true, slug: true, name: true, icon: true, parentId: true },
      });
      return [...withPublishedProducts, ...parents];
    }
    return withPublishedProducts;
  }

  return prisma.category.findMany({
    where: shopCatalogCategoryWhere,
    select: { id: true, slug: true, name: true, icon: true, parentId: true },
  });
}

/** Kategori storefront hierarkis (parent → children) dari MySQL. */
export async function listCatalogCategories(): Promise<StorefrontCategory[]> {
  try {
    const rows = await fetchCategoryRows();
    return buildCategoryTree(rows);
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
    const tree = await listCatalogCategories();
    const flat = flattenCategoryTree(tree);
    return flat.find((c) => c.id === slug);
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
