import type { Prisma } from "@prisma/client";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { deleteCustomer } from "@/lib/admin-crud";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Pembeli storefront yang belum terhubung ke Company. */
export default async function OrphanCustomersPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const where: Prisma.UserWhereInput = {
    companyId: null,
    ...(params.q
      ? {
          OR: [
            { username: { contains: params.q } },
            { name: { contains: params.q } },
            { email: { contains: params.q } },
            { phone: { contains: params.q } },
            { companyName: { contains: params.q } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        verificationStatus: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="User tanpa perusahaan"
        description="Akun pembeli di tabel User yang belum punya relasi Company (companyId kosong)."
      />
      <AdminListShell
        basePath="/admin/customers"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari nama, email, WA…"
      >
        <AdminTableWrap>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/80">
              <tr>
                <AdminThNo />
                <th className="px-4 py-3 font-medium text-zinc-600">Nama</th>
                <th className="hidden px-4 py-3 font-medium text-zinc-600 md:table-cell">Email / WA</th>
                <th className="hidden px-4 py-3 font-medium text-zinc-600 lg:table-cell">
                  Nama PT (legacy)
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                    Tidak ada user tanpa perusahaan.
                  </td>
                </tr>
              ) : (
                rows.map((u, i) => (
                  <tr key={u.id}>
                    <AdminTdNo n={rowNumber(i, params)} />
                    <td className="px-4 py-3 font-medium text-zinc-900">{u.name}</td>
                    <td className="hidden px-4 py-3 text-zinc-600 md:table-cell">
                      <div>{u.email}</div>
                      <div className="text-xs text-zinc-400">{u.phone ?? "—"}</div>
                    </td>
                    <td className="hidden px-4 py-3 text-zinc-600 lg:table-cell">
                      {u.companyName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wide text-zinc-500">
                      {u.verificationStatus}
                    </td>
                    <AdminActionCell>
                      <Link
                        href={`/admin/companies?q=${encodeURIComponent(u.email)}`}
                        className="text-xs font-medium text-zinc-700 underline-offset-2 hover:underline"
                      >
                        Perusahaan
                      </Link>
                      <AdminDeleteButton
                        action={async () => {
                          "use server";
                          await deleteCustomer(u.id);
                        }}
                      />
                    </AdminActionCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminTableWrap>
      </AdminListShell>
    </>
  );
}
