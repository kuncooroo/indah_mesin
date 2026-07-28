"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AdminSearchBarProps = {
  defaultQuery: string;
  placeholder?: string;
};

const DEBOUNCE_MS = 300;

export function AdminSearchBar({
  defaultQuery,
  placeholder = "Cari…",
}: AdminSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultQuery);

  useEffect(() => {
    queueMicrotask(() => setValue(defaultQuery));
  }, [defaultQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = value.trim();
      const currentQ = (searchParams.get("q") ?? "").trim();
      if (trimmed === currentQ) return;

      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.delete("page");

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  const showReset = Boolean(value.trim() || defaultQuery.trim());

  return (
    <div className="flex w-full max-w-md gap-2">
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-10 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300"
      />
      {showReset ? (
        <Link
          href={pathname}
          scroll={false}
          className="flex h-10 shrink-0 items-center rounded-lg border border-neutral-200 px-3 text-sm text-neutral-600 hover:bg-neutral-50"
          onClick={() => setValue("")}
        >
          Reset
        </Link>
      ) : null}
    </div>
  );
}
