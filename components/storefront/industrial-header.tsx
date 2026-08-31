"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useShopNavDrawer } from "@/components/storefront/shop-nav-drawer";
import { ShopSearchForm } from "@/components/storefront/shop-search-form";
import type { Product } from "@/lib/storefront/product-types";

interface IndustrialHeaderProps {
  showAccount?: boolean;
  showSearch?: boolean;
}

/** Top App Bar — MesinBagus marketplace */
export function IndustrialHeader({
  showAccount = true,
  showSearch = true,
}: IndustrialHeaderProps) {
  const { openDrawer } = useShopNavDrawer();
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const avatar = session?.user?.image?.trim() || null;

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
      <div className="flex h-16 items-center justify-between px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container active:opacity-80"
            aria-label="Open menu"
          >
            <MaterialSymbol name="menu" />
          </button>
          <Link href="/beranda-artikel" className="font-headline-md text-headline-md font-bold text-primary">
            MesinBagus
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
              aria-label={searchOpen ? "Close search" : "Search products"}
              aria-expanded={searchOpen}
            >
              <MaterialSymbol name={searchOpen ? "close" : "search"} />
            </button>
          ) : null}
          {showAccount ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary text-on-primary transition-opacity hover:opacity-90"
              aria-label="Profile"
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element -- local /uploads + Google avatars must render reliably
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <MaterialSymbol name="person" className="text-[18px]" />
              )}
            </Link>
          ) : null}
        </div>
      </div>
      {showSearch && searchOpen ? (
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
