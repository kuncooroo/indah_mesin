import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";

import { updateCustomer, deleteCustomer } from "@/lib/admin-crud";

import { AdminPageHeader } from "@/components/admin/admin-page-header";

import {

  AdminListShell,

  AdminTableWrap,

  AdminThNo,

  AdminTdNo,

  AdminActionCell,

} from "@/components/admin/admin-list-shell";

import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";

import { CustomerEditDialog } from "@/components/admin/admin-entity-crud";



type PageProps = {

  searchParams: Promise<Record<string, string | string[] | undefined>>;

};



export default async function AdminCustomersPage({ searchParams }: PageProps) {

  const params = parseAdminListParams(await searchParams);

  const where: Prisma.UserWhereInput = {

    role: "BUYER",

    ...(params.q

      ? {

          OR: [

            { username: { contains: params.q } },

            { name: { contains: params.q } },

            { companyName: { contains: params.q } },

            { customBuyerId: { contains: params.q } },

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

        username: true,

        name: true,

        email: true,

        companyName: true,

        customBuyerId: true,

        verificationStatus: true,

      },

    }),

  ]);



  return (

    <>

      <AdminPageHeader title="Pelanggan" description="Akun BUYER marketplace." />

      <AdminListShell

        basePath="/admin/customers"

        q={params.q}

        page={params.page}

        pageSize={params.pageSize}

        total={total}

        searchPlaceholder="Cari username, perusahaan, buyer ID…"

      >

        <AdminTableWrap>

          <table className="w-full text-left text-sm">

            <thead className="border-b border-neutral-100 bg-neutral-50/80">

              <tr>

                <AdminThNo />

                <th className="px-6 py-3 font-medium text-neutral-500">Username</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Nama</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Perusahaan</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Buyer ID</th>

                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-100">

              {rows.map((u, i) => (

                <tr key={u.id}>

                  <AdminTdNo n={rowNumber(i, params)} />

                  <td className="px-6 py-3 font-medium">{u.username ?? u.email}</td>

                  <td className="px-6 py-3">{u.name ?? "—"}</td>

                  <td className="px-6 py-3">{u.companyName ?? "—"}</td>

                  <td className="px-6 py-3 font-mono text-xs">{u.customBuyerId ?? "—"}</td>

                  <AdminActionCell>

                    <CustomerEditDialog row={u} updateAction={updateCustomer} />

                    <AdminDeleteButton

                      action={async () => {

                        "use server";

                        await deleteCustomer(u.id);

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

