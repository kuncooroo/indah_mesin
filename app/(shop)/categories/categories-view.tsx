"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ms } from "@/components/stitch/ms";
import { MARKETPLACE_CATEGORIES } from "@/lib/marketplace-catalog";
import type { ShopCategory } from "@/lib/shop-categories";
import type { Product } from "@/lib/products";
import {
  filterAndSortProducts,
  quickFilterToState,
  type CatalogFilterState,
  type CatalogSort,
} from "@/lib/catalog-filters";
import { cn } from "@/lib/utils";
import { IndustrialHeader } from "@/components/shop/industrial-header";
import { PwaBanner } from "@/components/shop/pwa-banner";
import { CategoryFiltersPanel } from "@/components/shop/category-filters-panel";
import { CategoryProductCard } from "@/components/shop/category-product-card";

const PAGE_SIZE = 4;

function parseSort(raw: string | null): CatalogSort {
  if (raw === "price_asc" || raw === "price_desc" || raw === "name") return raw;
  return "newest";
}

const ALL_CATEGORY = { id: "all", name: "All", icon: "apps" as const };

function defaultFilters(searchParams: URLSearchParams): CatalogFilterState {
  const quick = searchParams.get("filter");
  const quickPatch = quickFilterToState(quick);
  return {
    q: searchParams.get("q") ?? "",
    category: "all",
    ready: quickPatch.ready ?? true,
    indent: quickPatch.indent ?? true,
    minPrice: quickPatch.minPrice ?? 0,
    sort: quickPatch.sort ?? parseSort(searchParams.get("sort")),
    brand: "all",
  };
}

export function CategoriesView({
  products,
  categories,
}: {
  products: Product[];
  categories: ShopCategory[];
}) {
  const tabs = categories.length > 0 ? categories : [...MARKETPLACE_CATEGORIES];
  const tabsWithAll = [ALL_CATEGORY, ...tabs];
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = searchParams.get("cat");
  const defaultCat =
    initialCat && tabs.some((c) => c.id === initialCat) ? initialCat : "all";

  const [activeCat, setActiveCat] = useState(defaultCat);
  const [applied, setApplied] = useState<CatalogFilterState>(() => defaultFilters(searchParams));
  const [draft, setDraft] = useState<CatalogFilterState>(() => defaultFilters(searchParams));
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setActiveCat(defaultCat);
    const next = defaultFilters(searchParams);
    setApplied(next);
    setDraft(next);
    setPage(1);
  }, [defaultCat, searchParams]);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.priceAmount ?? 0), 500_000_000),
    [products]
  );

  const brandOptions = useMemo(() => {
    const cats = tabs.map((t) => ({ value: t.id, label: t.name }));
    return [{ value: "all", label: "All Manufacturers" }, ...cats];
  }, [tabs]);

  const filtered = useMemo(() => {
    const categoryForFilter =
      applied.brand !== "all" ? applied.brand : activeCat === "all" ? "all" : activeCat;
    return filterAndSortProducts(products, {
      ...applied,
      category: categoryForFilter,
      brand: "all",
      q: applied.q || searchParams.get("q") || "",
    });
  }, [products, applied, activeCat, searchParams]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeCategoryName =
    activeCat === "all"
      ? "Catalog"
      : tabs.find((c) => c.id === activeCat)?.name ?? "Category";

  function syncUrl(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat && cat !== "all") params.set("cat", cat);
    else params.delete("cat");
    const qs = params.toString();
    router.replace(`/categories${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function applyFilters() {
    setApplied({ ...draft, q: applied.q, sort: applied.sort });
    setPage(1);
  }

  return (
    <>
      <PwaBanner />
      <IndustrialHeader />

      <main className="mx-auto w-full">
        <section className="px-margin-mobile py-4">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
            Categories &amp; Filters
          </h2>
        </section>

        <section className="mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap border-b border-border-subtle px-margin-mobile">
          <div className="flex gap-8">
            {tabsWithAll.map(({ id, name, icon }) => {
              const active = activeCat === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveCat(id);
                    syncUrl(id);
                    setPage(1);
                  }}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1 py-3 transition-all",
                    active
                      ? "active-category text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  <Ms name={icon} className={active ? "text-primary" : ""} />
                  <span className="max-w-[5.5rem] truncate font-button-text text-body-sm">{name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <CategoryFiltersPanel
          draft={draft}
          onDraftChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
          onApply={applyFilters}
          maxPrice={maxPrice}
          brandOptions={brandOptions}
          mobileOpen={filtersOpen}
          onToggleMobile={() => setFiltersOpen((o) => !o)}
        />

        <div className="px-margin-mobile py-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-sm text-on-surface-variant">
              <span className="font-bold text-primary">{filtered.length}</span>{" "}
              {activeCategoryName} Machines Found
            </p>
            <div className="flex items-center gap-1">
              <span className="text-body-sm text-on-surface-variant">Sort:</span>
              <div className="relative inline-flex items-center">
                <select
                  value={applied.sort}
                  onChange={(e) => {
                    const sort = e.target.value as CatalogSort;
                    setApplied((a) => ({ ...a, sort }));
                    setDraft((d) => ({ ...d, sort }));
                    setPage(1);
                  }}
                  className="w-auto cursor-pointer appearance-none border-none bg-transparent py-0 pl-0 pr-4 font-button-text text-body-sm text-primary [field-sizing:content] focus:ring-0"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Lowest Price</option>
                  <option value="price_desc">Highest Price</option>
                  <option value="name">Name A–Z</option>
                </select>
                <Ms
                  name="expand_more"
                  className="pointer-events-none absolute right-[-2px] text-[18px] text-primary"
                />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-surface-container-low p-8 text-center">
              <Ms name="search_off" className="mx-auto mb-2 text-4xl text-outline" />
              <p className="font-body-md text-on-surface-variant">
                No machines match these filters. Adjust the filters and select Apply Filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-gutter">
              {pageItems.map((product) => (
                <CategoryProductCard key={product.dbProductId ?? product.sku} product={product} />
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE ? (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-on-surface-variant transition-colors hover:bg-surface-variant disabled:opacity-40"
                aria-label="Previous page"
              >
                <Ms name="chevron_left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full font-button-text transition-colors",
                    n === safePage
                      ? "bg-primary text-on-primary"
                      : "border border-border-subtle text-on-surface-variant hover:bg-surface-variant"
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-on-surface-variant transition-colors hover:bg-surface-variant disabled:opacity-40"
                aria-label="Next page"
              >
                <Ms name="chevron_right" />
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
