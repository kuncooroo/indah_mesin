import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { createArchiveDocument, deleteArchiveDocument } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { ArchiveDocumentCreateDialog } from "@/components/admin/admin-company-crud";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDocumentsPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const where: Prisma.ArchiveDocumentWhereInput = params.q
    ? {
        OR: [
          { documentName: { contains: params.q } },
          { fileUrl: { contains: params.q } },
          { user: { name: { contains: params.q } } },
          { order: { orderNumber: { contains: params.q } } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    prisma.archiveDocument.count({ where }),
    prisma.archiveDocument.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.pageSize,
      include: {
        user: { select: { name: true } },
        order: { select: { orderNumber: true } },
      },
    }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Dokumen (Docs)"
        description="Arsip PDF — draf PO, quotation, invoice, brosur."
      />
      <AdminListShell
        basePath="/admin/documents"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari nama dokumen, PO…"
        createAction={<ArchiveDocumentCreateDialog createAction={createArchiveDocument} />}
      >
        <AdminTableWrap>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-6 py-3 font-medium text-neutral-500">Nama</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Tipe</th>
                <th className="hidden px-6 py-3 font-medium text-neutral-500 md:table-cell">Order</th>
                <th className="hidden px-6 py-3 font-medium text-neutral-500 lg:table-cell">PIC</th>
                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((d, i) => (
                <tr key={d.id}>
                  <AdminTdNo n={rowNumber(i, params)} />
                  <td className="px-6 py-3">
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {d.documentName}
                    </a>
                  </td>
                  <td className="px-6 py-3">{d.documentType.replace(/_/g, " ")}</td>
                  <td className="hidden px-6 py-3 font-mono text-xs md:table-cell">
                    {d.order?.orderNumber ?? "—"}
                  </td>
                  <td className="hidden px-6 py-3 lg:table-cell">{d.user?.name ?? "—"}</td>
                  <AdminActionCell>
                    <AdminDeleteButton
                      action={async () => {
                        "use server";
                        await deleteArchiveDocument(d.id);
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
