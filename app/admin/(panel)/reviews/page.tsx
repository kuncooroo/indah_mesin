import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import {
  safeProductReviewCount,
  safeProductReviewFindMany,
} from "@/lib/admin/safe-model-count";
import { createReview, updateReview, deleteReview } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { ReviewCreateDialog, ReviewEditDialog } from "@/components/admin/admin-entity-crud";
import { AdminMigrationNotice } from "@/components/admin/admin-migration-notice";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const where: Prisma.ProductReviewWhereInput = params.q
    ? {
        OR: [
          { authorName: { contains: params.q } },
          { content: { contains: params.q } },
          { product: { name: { contains: params.q } } },
        ],
      }
    : {};

  const [total, rows, products] = await Promise.all([
    safeProductReviewCount(where),
    safeProductReviewFindMany({
      where,
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.pageSize,
    }),
    prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: 100,
    }),
  ]);

  return (
    <>
      <AdminPageHeader title="Ulasan" description="Ulasan produk pelanggan." />
      <AdminMigrationNotice model="ProductReview" />
      <AdminListShell
        basePath="/admin/reviews"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari penulis, ulasan, produk…"
        createAction={
          <ReviewCreateDialog createAction={createReview} products={products} />
        }
      >
        <AdminTableWrap>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-6 py-3 font-medium text-neutral-500">Penulis</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Rating</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Produk</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <AdminTdNo n={rowNumber(i, params)} />
                  <td className="px-6 py-3 font-medium">{r.authorName}</td>
                  <td className="px-6 py-3">{r.rating}/5</td>
                  <td className="px-6 py-3">{r.product?.name ?? "—"}</td>
                  <td className="px-6 py-3">{r.published ? "Aktif" : "Draft"}</td>
                  <AdminActionCell>
                    <ReviewEditDialog row={r} updateAction={updateReview} products={products} />
                    <AdminDeleteButton
                      action={async () => {
                        "use server";
                        await deleteReview(r.id);
                      }}
                    />
                  </AdminActionCell>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      </AdminListShell>
    </>
  );
}
