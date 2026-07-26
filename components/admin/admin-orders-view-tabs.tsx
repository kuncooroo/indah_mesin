"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminOrdersViewTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "legacy" ? "legacy" : "orders";

  function hrefFor(next: "orders" | "legacy") {
    if (next === "orders") return pathname;
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "legacy");
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="flex gap-2 border-b border-neutral-200 pb-4">
      <Link
        href={hrefFor("orders")}
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          view === "orders"
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        )}
      >
        Order / PO
      </Link>
      <Link
        href={hrefFor("legacy")}
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          view === "legacy"
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        )}
      >
        Arsip / Legacy (RFQ)
      </Link>
    </div>
  );
}
