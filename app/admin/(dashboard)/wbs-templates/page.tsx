import Link from "next/link";
import type { Prisma } from "@prisma/client";

import {
  createWbsTemplate,
  deleteWbsTemplate,
  updateWbsTemplate,
} from "@/lib/admin-order-progress";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { WbsTemplateCreateDialog, WbsTemplateEditDialog } from "@/components/admin/admin-wbs-crud";
import { AdminWbsDetailLink } from "@/components/admin/admin-icon-actions";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminWbsTemplatesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const params = parseAdminListParams(sp);
  const where: Prisma.WbsTemplateWhereInput = params.q
    ? { name: { contains: params.q } }
    : {};

  const [total, rows] = await Promise.all([
    prisma.wbsTemplate.count({ where }),
    prisma.wbsTemplate.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: params.skip,
      take: params.pageSize,
      include: {
        _count: { select: { items: true, orders: true } },
      },
    }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Template WBS"
        description="Template Work Breakdown Structure untuk apply ke Order / PO — fase parent + sub-tugas (jam kerja maks. 8)."
      />
      <AdminListShell
        basePath="/admin/wbs-templates"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari nama template…"
        createAction={<WbsTemplateCreateDialog createAction={createWbsTemplate} />}
      >
        <AdminTableWrap>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-6 py-3 font-medium text-neutral-500">Nama</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Estimasi</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Item</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Dipakai</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <AdminTdNo n={rowNumber(i, params)} />
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/wbs-templates/${row.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {row.name}
                    </Link>
                    {row.description ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                        {row.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-3">{row.estimatedDays} hari</td>
                  <td className="px-6 py-3">{row._count.items}</td>
                  <td className="px-6 py-3">{row._count.orders} order</td>
                  <td className="px-6 py-3">{row.active ? "Aktif" : "Nonaktif"}</td>
                  <AdminActionCell>
                    <AdminWbsDetailLink href={`/admin/wbs-templates/${row.id}`} />
                    <WbsTemplateEditDialog row={row} updateAction={updateWbsTemplate} />
                    <AdminDeleteButton
                      action={async () => {
                        "use server";
                        await deleteWbsTemplate(row.id);
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
