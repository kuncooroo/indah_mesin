"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Ms } from "@/components/stitch/ms";
import { filterCategories } from "@/lib/categories";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { IndustrialTopBar } from "@/components/shop/industrial-top-bar";
import { CategoryFiltersPanel } from "@/components/shop/category-filters-panel";
import { CategoryProductCard } from "@/components/shop/category-product-card";
import { CategoryPagination } from "@/components/shop/category-pagination";

export function CategoriesView({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") ?? "food";
  const [activeCat, setActiveCat] = useState(
    filterCategories.some((c) => c.id === initialCat) ? initialCat : "food"
  );

  const activeCategoryName =
    filterCategories.find((c) => c.id === activeCat)?.name ?? "Food Processing";

  const filtered = useMemo(
    () => products.filter((p) => p.category === activeCat),
    [products, activeCat]
  );

  return (
    <>
      <IndustrialTopBar />

      <main className="mx-auto w-full max-w-7xl md:px-margin-desktop">
        <section className="px-margin-mobile py-4">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary md:font-headline-lg md:text-headline-lg">
            Kategori &amp; Filter
          </h2>
        </section>

        <section className="mb-6 overflow-x-auto whitespace-nowrap border-b border-border-subtle px-margin-mobile hide-scrollbar">
          <div className="flex gap-8">
            {filterCategories.map(({ id, name, icon }) => {
              const active = activeCat === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCat(id)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 transition-all",
                    active
                      ? "active-category text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  <Ms name={icon} className={active ? "text-primary" : ""} />
                  <span className="font-button-text text-body-sm">{name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="md:grid md:grid-cols-12 md:gap-gutter">
          <CategoryFiltersPanel />

          <div className="px-margin-mobile py-6 md:col-span-9 md:px-0 md:py-0">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-body-sm text-on-surface-variant">
                <span className="font-bold text-primary">{filtered.length}</span> Mesin{" "}
                {activeCategoryName} Ditemukan
              </p>
              <div className="flex items-center gap-2">
                <span className="text-body-sm text-on-surface-variant">Urutkan:</span>
                <select className="cursor-pointer border-none bg-transparent font-button-text text-body-sm text-primary focus:ring-0">
                  <option>Terbaru</option>
                  <option>Harga Terendah</option>
                  <option>Harga Tertinggi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </div>

            <CategoryPagination />
          </div>
        </div>
      </main>
    </>
  );
}
