"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";

type ProductDetailHeaderProps = {
  backHref?: string;
};

/** Sub-halaman detail — back + judul. */
export function ProductDetailHeader({ backHref = "/categories" }: ProductDetailHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface px-margin-mobile">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
          aria-label="Back"
        >
          <MaterialSymbol name="arrow_back" />
        </button>
        <h1 className="truncate font-headline-md text-headline-md font-bold text-primary">
          Product Details
        </h1>
      </div>
      <Link
        href="/categories"
        className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
        aria-label="Search"
      >
        <MaterialSymbol name="search" />
      </Link>
    </header>
  );
}
