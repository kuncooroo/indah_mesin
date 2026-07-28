"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { CatalogFilterState } from "@/lib/storefront/catalog-filters";
import { cn } from "@/lib/utils";

type BrandOption = { value: string; label: string };

type Props = {
  draft: CatalogFilterState;
  onDraftChange: (patch: Partial<CatalogFilterState>) => void;
  onApply: () => void;
  maxPrice: number;
  brandOptions: BrandOption[];
  mobileOpen: boolean;
  onToggleMobile: () => void;
};

export function CategoryFiltersPanel({
  draft,
  onDraftChange,
  onApply,
  maxPrice,
  brandOptions,
  mobileOpen,
  onToggleMobile,
}: Props) {
  return (
    <aside className="px-margin-mobile">
      <div className="sticky top-[4.5rem] rounded-xl border border-border-subtle bg-surface-container-low p-gutter">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-primary">Filters</h3>
          <button
            type="button"
            onClick={onToggleMobile}
            className="flex h-10 w-10 items-center justify-center text-primary md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close filters" : "Open filters"}
          >
            <MaterialSymbol
              name="expand_more"
              className={cn("transition-transform", mobileOpen && "rotate-180")}
            />
          </button>
        </div>

        <div className={cn("space-y-0", !mobileOpen && "hidden md:block")}>
          <div className="mb-8">
            <label className="mb-3 block font-button-text text-body-md text-primary">Stock Status</label>
            <div className="space-y-3">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={draft.ready}
                  onChange={(e) => onDraftChange({ ready: e.target.checked })}
                  className="h-5 w-5 rounded border-outline text-primary focus:ring-primary"
                />
                <span className="text-body-md text-on-surface-variant group-hover:text-primary">
                  Ready Stock
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={draft.indent}
                  onChange={(e) => onDraftChange({ indent: e.target.checked })}
                  className="h-5 w-5 rounded border-outline text-primary focus:ring-primary"
                />
                <span className="text-body-md text-on-surface-variant group-hover:text-primary">
                  Preorder
                </span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-3 block font-button-text text-body-md text-primary">
              Starting From (IDR)
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
                  value={draft.minPrice || ""}
                  onChange={(e) => onDraftChange({ minPrice: Number(e.target.value) || 0 })}
                  placeholder="Minimum Price"
                  className="w-full rounded-lg border border-border-subtle bg-surface py-2 pl-10 pr-4 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary-container"
                />
              </div>
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={1000000}
                value={Math.min(draft.minPrice, maxPrice)}
                onChange={(e) => onDraftChange({ minPrice: Number(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant accent-primary"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-3 block font-button-text text-body-md text-primary">Manufacturer</label>
            <select
              value={draft.brand}
              onChange={(e) => onDraftChange({ brand: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary-container"
            >
              {brandOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onApply}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-container py-3 font-button-text text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
