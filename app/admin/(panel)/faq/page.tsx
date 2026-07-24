import type { Prisma } from "@prisma/client";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { safeFaqCount, safeFaqFindMany } from "@/lib/admin/safe-model-count";
import { createFaq, updateFaq, deleteFaq } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { FaqCreateDialog, FaqEditDialog } from "@/components/admin/admin-entity-crud";
import { AdminMigrationNotice } from "@/components/admin/admin-migration-notice";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminFaqPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const where: Prisma.FaqWhereInput = params.q
    ? {
        OR: [{ question: { contains: params.q } }, { answer: { contains: params.q } }],
      }
    : {};

  const [total, rows] = await Promise.all([
    safeFaqCount(where),
    safeFaqFindMany({
      where,
      orderBy: { sortOrder: "asc" },
      skip: params.skip,
      take: params.pageSize,
    }),
  ]);

  return (
    <>
      <AdminPageHeader title="FAQ" description="Pertanyaan umum support." />
      <AdminMigrationNotice model="Faq" />
      <AdminListShell
        basePath="/admin/faq"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari pertanyaan atau jawaban…"
        createAction={<FaqCreateDialog createAction={createFaq} />}
      >
        <AdminTableWrap>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-6 py-3 font-medium text-neutral-500">Pertanyaan</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((f, i) => (
                <tr key={f.id}>
                  <AdminTdNo n={rowNumber(i, params)} />
                  <td className="max-w-md truncate px-6 py-3 font-medium">{f.question}</td>
                  <td className="px-6 py-3">{f.published ? "Aktif" : "Draft"}</td>
                  <AdminActionCell>
                    <FaqEditDialog row={f} updateAction={updateFaq} />
                    <AdminDeleteButton
                      action={async () => {
                        "use server";
                        await deleteFaq(f.id);
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
