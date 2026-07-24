import { Suspense } from "react";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { AdminPagination } from "@/components/admin/admin-pagination";

type AdminListShellProps = {
  basePath: string;
  q: string;
  page: number;
  pageSize: number;
  total: number;
  searchPlaceholder?: string;
  createAction?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminListShell({
  basePath,
  q,
  page,
  pageSize,
  total,
  searchPlaceholder,
  createAction,
  children,
}: AdminListShellProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Suspense
          fallback={
            <div className="h-10 w-full max-w-md animate-pulse rounded-lg border border-neutral-100 bg-neutral-50" />
          }
        >
          <AdminSearchBar defaultQuery={q} placeholder={searchPlaceholder} />
        </Suspense>
        {createAction ? <div className="shrink-0">{createAction}</div> : null}
      </div>
      {children}
      <AdminPagination
        basePath={basePath}
        total={total}
        page={page}
        pageSize={pageSize}
        q={q}
      />
    </div>
  );
}

export function AdminTableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminThNo() {
  return (
    <th className="w-14 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
      No
    </th>
  );
}

export function AdminTdNo({ n }: { n: number }) {
  return (
    <td className="px-4 py-3 tabular-nums text-sm text-neutral-500">{n}</td>
  );
}

export function AdminActionCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3">
      <div className="flex flex-wrap justify-end gap-2">{children}</div>
    </td>
  );
}
