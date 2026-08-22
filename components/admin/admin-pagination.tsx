import Link from "next/link";
import { ADMIN_PAGE_SIZE_OPTIONS, adminTotalPages } from "@/lib/admin/list-params";
import { AdminPageSizeSelect } from "@/components/admin/admin-page-size-select";

type AdminPaginationProps = {
  basePath: string;
  total: number;
  page: number;
  pageSize: number;
  q: string;
  sort?: string;
};

export function AdminPagination({
  basePath,
  total,
  page,
  pageSize,
  q,
  sort,
}: AdminPaginationProps) {
  const totalPages = adminTotalPages(total, pageSize);

  function href(p: number, size = pageSize) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (size !== 10) params.set("pageSize", String(size));
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-neutral-500">
          {from}–{to} dari {total} data
          {q ? ` · pencarian “${q}”` : ""}
        </p>
        <AdminPageSizeSelect pageSize={pageSize} options={[...ADMIN_PAGE_SIZE_OPTIONS]} />
      </div>
      {totalPages > 1 ? (
        <div className="flex items-center gap-1">
          <Link
            href={href(page - 1)}
            aria-disabled={page <= 1}
            className={`rounded-md border border-neutral-200 px-3 py-1.5 text-sm ${
              page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"
            }`}
          >
            Sebelumnya
          </Link>
          <span className="px-2 text-sm tabular-nums text-neutral-700">
            {page} / {totalPages}
          </span>
          <Link
            href={href(page + 1)}
            aria-disabled={page >= totalPages}
            className={`rounded-md border border-neutral-200 px-3 py-1.5 text-sm ${
              page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"
            }`}
          >
            Berikutnya
          </Link>
        </div>
      ) : null}
    </div>
  );
}
