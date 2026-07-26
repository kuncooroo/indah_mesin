"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Ms } from "@/components/stitch/ms";

export function ShopSearchForm({
  defaultQuery = "",
  className = "",
}: {
  defaultQuery?: string;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/categories${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative max-w-3xl">
        <Ms name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari mesin, SKU, atau kategori..."
          className="w-full rounded-xl border border-border-subtle bg-white py-4 pl-12 pr-4 font-body-md shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>
    </form>
  );
}
