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
import { IndustrialTopBar } from "@/components/shop/industrial-top-bar";
import { CategoryFiltersPanel } from "@/components/shop/category-filters-panel";
import { CategoryProductCard } from "@/components/shop/category-product-card";

function parseSort(raw: string | null): CatalogSort {
  if (raw === "price_asc" || raw === "price_desc" || raw === "name") return raw;
  return "newest";
}

export function CategoriesView({
  products,
  categories,
}: {
  products: Product[];
  categories: ShopCategory[];
}) {
  const tabs = categories.length > 0 ? categories : [...MARKETPLACE_CATEGORIES];
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = searchParams.get("cat");
  const defaultCat =
    initialCat && tabs.some((c) => c.id === initialCat) ? initialCat : tabs[0]?.id ?? "mesin-sterilisasi";

  const quick = searchParams.get("filter");
  const quickPatch = quickFilterToState(quick);

  const [activeCat, setActiveCat] = useState(defaultCat);
  const [filters, setFilters] = useState<CatalogFilterState>({
    q: searchParams.get("q") ?? "",
    category: defaultCat,
    ready: quickPatch.ready ?? true,
    indent: quickPatch.indent ?? true,
    minPrice: 0,
    sort: quickPatch.sort ?? parseSort(searchParams.get("sort")),
  });

  useEffect(() => {
    setActiveCat(defaultCat);
    setFilters((f) => ({
      ...f,
      category: defaultCat,
      q: searchParams.get("q") ?? "",
      sort: quickPatch.sort ?? parseSort(searchParams.get("sort")),
      ready: quickPatch.ready ?? f.ready,
      indent: quickPatch.indent ?? f.indent,
    }));
  }, [defaultCat, searchParams, quickPatch.indent, quickPatch.ready, quickPatch.sort]);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.priceAmount ?? 0), 500_000_000),
    [products]
  );

  const filtered = useMemo(
    () =>
      filterAndSortProducts(products, {
        ...filters,
        category: activeCat,
      }),
    [products, filters, activeCat]
  );

  const activeCategoryName = tabs.find((c) => c.id === activeCat)?.name ?? "Kategori";

  function syncUrl(cat: string, q: string) {
    const params = new URLSearchParams();
    if (cat && cat !== tabs[0]?.id) params.set("cat", cat);
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    router.replace(`/categories${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  return (
    <>
      <IndustrialTopBar />

      <main className="mx-auto w-full max-w-7xl md:px-margin-desktop">
        <section className="space-y-4 px-margin-mobile py-4">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary md:font-headline-lg md:text-headline-lg">
            Kategori &amp; Filter
          </h2>
          <div className="relative max-w-3xl">
            <Ms name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="search"
              value={filters.q}
              onChange={(e) => {
                const q = e.target.value;
                setFilters((f) => ({ ...f, q }));
                syncUrl(activeCat, q);
              }}
              placeholder="Cari mesin, SKU..."
              className="w-full rounded-xl border border-border-subtle bg-white py-3 pl-12 pr-4 font-body-md shadow-sm focus:border-primary focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        <section className="mb-6 overflow-x-auto whitespace-nowrap border-b border-border-subtle px-margin-mobile hide-scrollbar">
          <div className="flex gap-8">
            {tabs.map(({ id, name, icon }) => {
              const active = activeCat === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveCat(id);
                    syncUrl(id, filters.q);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 transition-all",
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

        <div className="md:grid md:grid-cols-12 md:gap-gutter">
          <CategoryFiltersPanel
            filters={filters}
            maxPrice={maxPrice}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
          />

          <div className="px-margin-mobile py-6 md:col-span-9 md:px-0 md:py-0">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-body-sm text-on-surface-variant">
                <span className="font-bold text-primary">{filtered.length}</span> Mesin{" "}
                {activeCategoryName} Ditemukan
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-border-subtle bg-surface-container-low p-8 text-center">
                <Ms name="search_off" className="mx-auto mb-2 text-4xl text-outline" />
                <p className="font-body-md text-on-surface-variant">
                  Tidak ada mesin sesuai filter. Coba ubah kategori atau reset filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                  <CategoryProductCard key={product.dbProductId ?? product.sku} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
