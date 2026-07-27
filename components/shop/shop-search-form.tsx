"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export function ShopSearchForm({
  defaultQuery = "",
  className = "",
  suggestions = [],
  autoFocus = false,
  returnToCatalogWhenEmpty = false,
}: {
  defaultQuery?: string;
  className?: string;
  suggestions?: Product[];
  autoFocus?: boolean;
  returnToCatalogWhenEmpty?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery);
  const [focused, setFocused] = useState(false);

  const matches = useMemo(() => {
    const term = q.trim().toLocaleLowerCase("id");
    if (!term) return [];
    return suggestions
      .filter((product) =>
        [product.name, product.sku, product.categoryLabel]
          .join(" ")
          .toLocaleLowerCase("id")
          .includes(term)
      )
      .slice(0, 5);
  }, [q, suggestions]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/categories${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative max-w-3xl">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            const value = e.target.value;
            setQ(value);
            if (returnToCatalogWhenEmpty && !value.trim()) {
              router.replace("/categories", { scroll: false });
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          placeholder="Search CNC, packaging, or SKU..."
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={focused && q.trim().length > 0}
          aria-controls="home-search-suggestions"
          autoFocus={autoFocus}
          className="w-full rounded-xl border border-border-subtle bg-white px-4 py-4 font-body-md shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
        />
        {focused && q.trim() ? (
          <div
            id="home-search-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-border-subtle bg-white shadow-xl"
          >
            {matches.length > 0 ? (
              matches.map((product) => (
                <button
                  key={product.sku}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="flex w-full flex-col border-b border-border-subtle px-4 py-3 text-left last:border-0 hover:bg-surface-container"
                >
                  <span className="font-semibold text-on-surface">{product.name}</span>
                  <span className="font-label-technical text-xs text-primary">
                    {product.sku} · {product.categoryLabel}
                  </span>
                </button>
              ))
            ) : (
              <button
                type="submit"
                className="w-full px-4 py-3 text-left text-body-sm text-on-surface-variant hover:bg-surface-container"
              >
                Search for “{q.trim()}” in all categories
              </button>
            )}
          </div>
        ) : null}
      </div>
    </form>
  );
}
