"use client";

import { Ms } from "@/components/stitch/ms";
import type { CatalogFilterState, CatalogSort } from "@/lib/catalog-filters";

type Props = {
  filters: CatalogFilterState;
  onChange: (patch: Partial<CatalogFilterState>) => void;
  maxPrice: number;
};

export function CategoryFiltersPanel({ filters, onChange, maxPrice }: Props) {
  return (
    <aside className="px-margin-mobile md:px-0 md:col-span-3">
      <div className="sticky top-20 rounded-xl border border-border-subtle bg-surface-container-low p-gutter">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-primary">Filters</h3>
        </div>

        <div className="mb-8">
          <label className="mb-3 block font-button-text text-body-md text-primary">Status Stok</label>
          <div className="space-y-3">
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={filters.ready}
                onChange={(e) => onChange({ ready: e.target.checked })}
                className="h-5 w-5 rounded border-outline text-primary focus:ring-primary"
              />
              <span className="text-body-md text-on-surface-variant group-hover:text-primary">
                Ready Stock
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={filters.indent}
                onChange={(e) => onChange({ indent: e.target.checked })}
                className="h-5 w-5 rounded border-outline text-primary focus:ring-primary"
              />
              <span className="text-body-md text-on-surface-variant group-hover:text-primary">
                Inden
              </span>
            </label>
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 block font-button-text text-body-md text-primary">
            Mulai Dari (IDR)
          </label>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-outline">
                Rp
              </span>
              <input
                type="number"
                min={0}
                step={1000000}
                value={filters.minPrice || ""}
                onChange={(e) => onChange({ minPrice: Number(e.target.value) || 0 })}
                placeholder="Harga Minimum"
                className="w-full rounded-lg border border-border-subtle bg-surface py-2 pl-10 pr-4 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary-container"
              />
            </div>
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={1000000}
              value={Math.min(filters.minPrice, maxPrice)}
              onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant accent-primary"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 block font-button-text text-body-md text-primary">Urutkan</label>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as CatalogSort })}
            className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary-container"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="name">Nama A-Z</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              ready: true,
              indent: true,
              minPrice: 0,
              sort: "newest",
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-container py-3 font-button-text text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary"
        >
          Reset Filter
        </button>
      </div>
    </aside>
  );
}
