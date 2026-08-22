"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useShopNavDrawer } from "@/components/storefront/shop-nav-drawer";
import { ShopSearchForm } from "@/components/storefront/shop-search-form";
import type { Product } from "@/lib/storefront/product-types";

/** Halaman utama dengan judul teks (Contact, dll.) + hamburger */
export function ShopTitledHeader({ title }: { title: string }) {
  const { openDrawer } = useShopNavDrawer();
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    if (!searchOpen || suggestions.length > 0) return;
    let cancelled = false;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Product[]) => {
        if (!cancelled && Array.isArray(data)) setSuggestions(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [searchOpen, suggestions.length]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-surface/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-margin-mobile">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={openDrawer}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
            aria-label="Open menu"
          >
            <MaterialSymbol name="menu" />
          </button>
          <h1 className="truncate font-headline-md text-headline-md font-bold text-primary">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
            aria-label={searchOpen ? "Close search" : "Search products"}
            aria-expanded={searchOpen}
          >
            <MaterialSymbol name={searchOpen ? "close" : "search"} />
          </button>
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-opacity hover:opacity-90"
            aria-label="Account"
          >
            <MaterialSymbol name="person" className="text-[18px]" />
          </Link>
        </div>
      </div>
      {searchOpen ? (
        <div className="animate-slide-down border-t border-border-subtle px-margin-mobile py-3">
          <ShopSearchForm
            suggestions={suggestions}
            autoFocus
            returnToCatalogWhenEmpty
          />
        </div>
      ) : null}
    </header>
  );
}
