import Link from "next/link";
import { Heart, FileText } from "lucide-react";
import type { AdminDashboardInsight } from "@/types/admin/marketplace-module";

export function AdminDashboardInsights({ data }: { data: AdminDashboardInsight }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Saved Items (pembeli)
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-900">
              {data.savedItemsTotal}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Wishlist di app user — tidak perlu menu admin terpisah.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <Heart className="h-5 w-5" strokeWidth={1.75} />
          </div>
        </div>
        <Link
          href="/favorites"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-neutral-700 underline-offset-2 hover:underline"
        >
          Lihat halaman Saved di toko →
        </Link>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              RFQ legacy (arsip)
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-900">
              {data.legacyRfqTotal}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Data lama — kelola di tab Arsip pada Order / PO.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <FileText className="h-5 w-5" strokeWidth={1.75} />
          </div>
        </div>
        <Link
          href="/admin/orders?view=legacy"
          className="mt-4 inline-block text-sm font-medium text-neutral-700 underline-offset-2 hover:underline"
        >
          Buka arsip RFQ →
        </Link>
      </div>
    </section>
  );
}
