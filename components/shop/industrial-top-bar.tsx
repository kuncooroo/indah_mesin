"use client";

import Link from "next/link";
import { Ms } from "@/components/stitch/ms";
import { useShopNavDrawer } from "@/components/shop/shop-nav-drawer";

type IndustrialTopBarProps = {
  variant?: "catalog" | "contact";
  backHref?: string;
};

/** TopAppBar — catalog, contact, product detail */
export function IndustrialTopBar({
  variant = "catalog",
  backHref = "/beranda-artikel",
}: IndustrialTopBarProps) {
  const { openDrawer } = useShopNavDrawer();

  if (variant === "contact") {
    return (
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface/80 px-margin-mobile backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <Ms name="arrow_back" className="text-primary" />
          </Link>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Contact Support</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/categories"
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
            aria-label="Cari"
          >
            <Ms name="search" />
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
            aria-label="Menu"
          >
            <Ms name="menu" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface/80 px-margin-mobile backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={openDrawer}
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
          aria-label="Menu"
        >
          <Ms name="menu" />
        </button>
        <Link href="/beranda-artikel" className="font-headline-md text-headline-md font-bold text-primary">
          IndustrialX
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/categories"
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
          aria-label="Search"
        >
          <Ms name="search" />
        </Link>
      </div>
    </header>
  );
}
