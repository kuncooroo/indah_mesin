"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  collectCategorySlugs,
  flattenCategoryTree,
  type StorefrontCategory,
} from "@/lib/storefront/category-utils";
import type { Product } from "@/lib/storefront/product-types";
import {
  filterAndSortProducts,
  quickFilterToState,
  type CatalogFilterState,
  type CatalogSort,
} from "@/lib/storefront/catalog-filters";
import { cn } from "@/lib/utils";
import { IndustrialHeader } from "@/components/storefront/industrial-header";
import { PwaBanner } from "@/components/storefront/pwa-banner";
import { CategoryFiltersPanel } from "@/components/storefront/category-filters-panel";
import { CategoryProductCard } from "@/components/storefront/category-product-card";

const PAGE_SIZE = 4;

function parseSort(raw: string | null): CatalogSort {
  if (raw === "price_asc" || raw === "price_desc" || raw === "name") return raw;
  return "newest";
}

const ALL_CATEGORY = { id: "all", name: "All", icon: "apps" as const };

function defaultFilters(searchParams: URLSearchParams, category = "all"): CatalogFilterState {
  const quick = searchParams.get("filter");
  const quickPatch = quickFilterToState(quick);
  return {
    q: searchParams.get("q") ?? "",
    category: "all",
    ready: quickPatch.ready ?? true,
    indent: quickPatch.indent ?? true,
    minPrice: quickPatch.minPrice ?? 0,
    sort: quickPatch.sort ?? parseSort(searchParams.get("sort")),
    brand: category,
  };
}

export function CategoriesView({
  products,
  categories,
}: {
  products: Product[];
  categories: StorefrontCategory[];
}) {
  const flatCategories = useMemo(() => flattenCategoryTree(categories), [categories]);
  const rootTabs = useMemo(() => categories, [categories]);
  const tabsWithAll = [ALL_CATEGORY, ...rootTabs];
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = searchParams.get("cat");
  const defaultCat =
    initialCat && flatCategories.some((c) => c.id === initialCat) ? initialCat : "all";

  function resolveExpandedParent(cat: string): string | null {
    if (cat === "all") return null;
    const parent = categories.find((c) => c.children?.some((ch) => ch.id === cat));
    if (parent) return parent.id;
    const root = categories.find((c) => c.id === cat);
    if (root?.children?.length) return root.id;
    return null;
  }

  const [activeCat, setActiveCat] = useState(defaultCat);
  const [expandedParent, setExpandedParent] = useState<string | null>(() =>
    resolveExpandedParent(defaultCat)
  );
  const [applied, setApplied] = useState<CatalogFilterState>(() =>
    defaultFilters(searchParams, defaultCat)
  );
  const [draft, setDraft] = useState<CatalogFilterState>(() =>
    defaultFilters(searchParams, defaultCat)
  );
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setActiveCat(defaultCat);
      setExpandedParent(resolveExpandedParent(defaultCat));
      const next = defaultFilters(searchParams, defaultCat);
      setApplied(next);
      setDraft(next);
      setPage(1);
    });
  }, [defaultCat, searchParams, categories]);

  const childTabs = useMemo(() => {
    if (!expandedParent) return [];
    const parent = categories.find((c) => c.id === expandedParent);
    return parent?.children ?? [];
  }, [expandedParent, categories]);

  const activeSlugSet = useMemo(() => {
    if (activeCat === "all") return null;
    const root = categories.find((c) => c.id === activeCat);
    if (root?.children?.length) return new Set(collectCategorySlugs(root));
    return new Set([activeCat]);
  }, [activeCat, categories]);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.priceAmount ?? 0), 500_000_000),
    [products]
  );

  const brandOptions = useMemo(() => {
    const cats = flatCategories.map((t) => ({ value: t.id, label: t.name }));
    return [{ value: "all", label: "All Manufacturers" }, ...cats];
  }, [flatCategories]);

  const filtered = useMemo(() => {
    const categoryForFilter =
      applied.brand !== "all" ? applied.brand : activeCat === "all" ? "all" : activeCat;
    let list = filterAndSortProducts(products, {
      ...applied,
      category: "all",
      brand: "all",
      q: applied.q || searchParams.get("q") || "",
    });
    if (activeSlugSet) {
      list = list.filter((p) => activeSlugSet.has(p.category));
    } else if (categoryForFilter !== "all") {
      list = list.filter((p) => p.category === categoryForFilter);
    }
    return list;
  }, [products, applied, activeCat, activeSlugSet, searchParams]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeCategoryId =
    applied.brand !== "all" ? applied.brand : activeCat === "all" ? "all" : activeCat;
  const activeCategoryName =
    activeCategoryId === "all"
      ? "Machines"
      : flatCategories.find((c) => c.id === activeCategoryId)?.name ?? "Machines";

  function selectCategory(id: string) {
    if (id === "all") {
      setExpandedParent(null);
    } else {
      const root = categories.find((c) => c.id === id);
      if (root?.children?.length) {
        setExpandedParent(id);
      } else {
        setExpandedParent(resolveExpandedParent(id));
      }
    }
    setActiveCat(id);
    setApplied((current) => ({ ...current, brand: id }));
    setDraft((current) => ({ ...current, brand: id }));
    syncUrl(id);
    setPage(1);
  }

  function syncUrl(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat && cat !== "all") params.set("cat", cat);
    else params.delete("cat");
    const qs = params.toString();
    router.replace(`/categories${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function applyFilters() {
    setApplied({ ...draft, q: applied.q, sort: applied.sort });
    if (draft.brand !== activeCat) {
      setActiveCat(draft.brand);
      syncUrl(draft.brand);
    }
    setPage(1);
  }

  return (
    <>
      <PwaBanner />
      <IndustrialHeader />

      <main className="mx-auto w-full">
        <section className="px-margin-mobile py-4">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
            Categories &amp; Filters
          </h1>
        </section>

        <section className="mb-2 overflow-x-auto hide-scrollbar whitespace-nowrap border-b border-border-subtle px-margin-mobile">
          <div className="flex gap-8">
            {tabsWithAll.map(({ id, name, icon }) => {
              const active = activeCat === id || (id !== "all" && expandedParent === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectCategory(id)}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1 py-3 transition-all",
                    active
                      ? "active-category text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  <MaterialSymbol name={icon} className={active ? "text-primary" : ""} />
                  <span className="max-w-[5.5rem] truncate font-button-text text-body-sm">{name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {childTabs.length > 0 ? (
          <section className="mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap border-b border-border-subtle bg-surface-container-low/40 px-margin-mobile">
            <div className="flex gap-6 py-1">
              {childTabs.map(({ id, name, icon }) => {
                const active = activeCat === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectCategory(id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-body-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                    )}
                  >
                    <MaterialSymbol name={icon} className="text-[18px]" />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="mb-6" />
        )}

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
              {activeCategoryName} Found
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
                <MaterialSymbol
                  name="expand_more"
                  className="pointer-events-none absolute right-[-2px] text-[18px] text-primary"
                />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-surface-container-low p-8 text-center">
              <MaterialSymbol name="search_off" className="mx-auto mb-2 text-4xl text-outline" />
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
                <MaterialSymbol name="chevron_left" />
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
                <MaterialSymbol name="chevron_right" />
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
