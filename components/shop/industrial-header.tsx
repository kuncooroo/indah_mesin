"use client";

import Link from "next/link";
import { useState } from "react";
import { Ms } from "@/components/stitch/ms";
import { useShopNavDrawer } from "@/components/shop/shop-nav-drawer";
import { ShopSearchForm } from "@/components/shop/shop-search-form";
import { MARKETPLACE_PRODUCTS } from "@/lib/marketplace-catalog";

interface IndustrialHeaderProps {
  showAccount?: boolean;
  showSearch?: boolean;
}

/** Top App Bar — IndustrialX marketplace */
export function IndustrialHeader({
  showAccount = true,
  showSearch = true,
}: IndustrialHeaderProps) {
  const { openDrawer } = useShopNavDrawer();
  const [searchOpen, setSearchOpen] = useState(false);

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
            <Ms name="menu" />
          </button>
          <Link href="/beranda-artikel" className="font-headline-md text-headline-md font-bold text-primary">
            IndustrialX
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
              <Ms name={searchOpen ? "close" : "search"} />
            </button>
          ) : null}
          {showAccount ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-opacity hover:opacity-90"
              aria-label="Profile"
            >
              <Ms name="person" className="text-[18px]" />
            </Link>
          ) : null}
        </div>
      </div>
      {showSearch && searchOpen ? (
        <div className="animate-slide-down border-t border-border-subtle px-margin-mobile py-3">
          <ShopSearchForm
            suggestions={[...MARKETPLACE_PRODUCTS]}
            autoFocus
            returnToCatalogWhenEmpty
          />
        </div>
      ) : null}
    </header>
  );
}
