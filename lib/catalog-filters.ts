import type { Product } from "@/lib/products";

export type CatalogSort = "newest" | "price_asc" | "price_desc" | "name";

export type CatalogFilterState = {
  q: string;
  category: string;
  ready: boolean;
  indent: boolean;
  minPrice: number;
  sort: CatalogSort;
  brand: string;
};

export function filterAndSortProducts(products: Product[], filters: CatalogFilterState): Product[] {
  let list = [...products];

  if (filters.category && filters.category !== "all") {
    list = list.filter((p) => p.category === filters.category);
  }

  const q = filters.q.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
    );
  }

  if (filters.ready !== filters.indent) {
    if (filters.ready && !filters.indent) {
      list = list.filter((p) => p.status === "ready");
    } else if (filters.indent && !filters.ready) {
      list = list.filter((p) => p.status === "indent");
    }
  }

  if (filters.minPrice > 0) {
    list = list.filter((p) => (p.priceAmount ?? 0) >= filters.minPrice);
  }

  if (filters.brand && filters.brand !== "all") {
    list = list.filter((p) => p.category === filters.brand || p.categoryLabel === filters.brand);
  }

  switch (filters.sort) {
    case "price_asc":
      list.sort((a, b) => (a.priceAmount ?? 0) - (b.priceAmount ?? 0));
      break;
    case "price_desc":
      list.sort((a, b) => (b.priceAmount ?? 0) - (a.priceAmount ?? 0));
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      list.sort((a, b) => {
        const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
        const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
        return tb - ta;
      });
      break;
  }

  return list;
}

export function quickFilterToState(
  filterId: string | null
): Partial<CatalogFilterState> {
  switch (filterId) {
    case "ready":
      return { ready: true, indent: false, sort: "newest" };
    case "indent":
      return { ready: false, indent: true, sort: "newest" };
    case "new":
      return { sort: "newest", ready: true, indent: true };
    case "price":
      return { sort: "price_asc", ready: true, indent: true };
    case "heavy":
      return { sort: "price_desc", minPrice: 200_000_000, ready: true, indent: true };
    default:
      return {};
  }
}
