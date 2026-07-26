import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { createCompany, updateCompany, deleteCompany } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { CompanyCreateDialog, CompanyEditDialog } from "@/components/admin/admin-company-crud";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCompaniesPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const where: Prisma.CompanyWhereInput = params.q
    ? {
        OR: [
          { companyName: { contains: params.q } },
          { npwpNumber: { contains: params.q } },
          { nibNumber: { contains: params.q } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    prisma.company.count({ where }),
    prisma.company.findMany({
      where,
      orderBy: { companyName: "asc" },
      skip: params.skip,
      take: params.pageSize,
      include: { _count: { select: { users: true, addresses: true } } },
    }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Perusahaan"
        description="Data PT pembeli / vendor — kelola detail, alamat, dan PIC dari satu tempat."
      />
      <AdminListShell
        basePath="/admin/companies"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari nama perusahaan, NPWP…"
        createAction={<CompanyCreateDialog createAction={createCompany} />}
      >
        <AdminTableWrap>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-6 py-3 font-medium text-neutral-500">Nama</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Tipe</th>
                <th className="hidden px-6 py-3 font-medium text-neutral-500 md:table-cell">NPWP</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Alamat</th>
                <th className="px-6 py-3 font-medium text-neutral-500">PIC</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Verifikasi</th>
                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((c, i) => (
                <tr key={c.id}>
                  <AdminTdNo n={rowNumber(i, params)} />
                  <td className="px-6 py-3 font-medium">
                    <Link
                      href={`/admin/companies/${c.id}`}
                      className="text-neutral-900 underline-offset-2 hover:underline"
                    >
                      {c.companyName}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{c.type}</td>
                  <td className="hidden px-6 py-3 font-mono text-xs md:table-cell">
                    {c.npwpNumber ?? "—"}
                  </td>
                  <td className="px-6 py-3">{c._count.addresses}</td>
                  <td className="px-6 py-3">{c._count.users}</td>
                  <td className="px-6 py-3">
                    {c.isVerified ? (
                      <span className="text-emerald-700">Verified</span>
                    ) : (
                      <span className="text-neutral-400">Belum</span>
                    )}
                  </td>
                  <AdminActionCell>
                    <CompanyEditDialog row={c} updateAction={updateCompany} />
                    <AdminDeleteButton
                      action={async () => {
                        "use server";
                        await deleteCompany(c.id);
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
