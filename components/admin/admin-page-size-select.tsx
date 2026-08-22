"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AdminPageSizeSelect({
  pageSize,
  options,
}: {
  pageSize: number;
  options: number[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="inline-flex items-center gap-2 text-sm text-neutral-600">
      <span>Per halaman</span>
      <select
        className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm"
        value={pageSize}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          const next = e.target.value;
          if (next === "10") params.delete("pageSize");
          else params.set("pageSize", next);
          params.delete("page");
          const qs = params.toString();
          router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        }}
      >
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
