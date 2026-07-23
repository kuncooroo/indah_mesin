"use client";

import { useState } from "react";
import Link from "next/link";
import { IndustrialHeader } from "@/components/shop/industrial-header";
import { CatalogCard } from "@/components/shop/catalog-card";
import { filterCategories } from "@/lib/categories";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

const sidebarFilters = [
  { group: "Status Stok", items: ["Ready Stock", "Indent", "Pre-Order"] },
  { group: "Rentang Harga", items: ["< Rp 100 Jt", "Rp 100-500 Jt", "> Rp 500 Jt"] },
];

export default function CategoriesPage() {
  const [activeCat, setActiveCat] = useState("food");

  return (
    <>
      <IndustrialHeader />

      <main className="pb-8">
        <section className="px-4 py-4">
          <h2 className="text-2xl font-bold text-primary">Kategori & Filter</h2>
        </section>

        <section className="mb-6 overflow-x-auto border-b border-border-subtle no-scrollbar">
          <div className="flex gap-6 px-4 whitespace-nowrap">
            {filterCategories.map(({ id, name, icon: Icon }) => {
              const active = activeCat === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCat(id)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 transition-all",
                    active
                      ? "border-b-2 border-primary text-primary"
                      : "text-on-surface-variant"
                  )}
                >
                  <Icon className="size-6" />
                  <span className="text-sm font-semibold">{name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="px-4">
          {sidebarFilters.map(({ group, items }) => (
            <div key={group} className="mb-6">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                {group}
              </h4>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-lg border border-border-subtle px-3 py-2 text-sm text-on-surface-variant hover:border-primary hover:text-primary"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-6 pt-4">
            {products
              .filter((p) => p.category === activeCat || activeCat === "food")
              .map((product) => (
                <CatalogCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
