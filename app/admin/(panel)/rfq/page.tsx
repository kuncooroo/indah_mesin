import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";

import { updateRfqRequest, deleteRfqRequest } from "@/lib/admin-crud";

import { AdminPageHeader } from "@/components/admin/admin-page-header";

import {

  AdminListShell,

  AdminTableWrap,

  AdminThNo,

  AdminTdNo,

  AdminActionCell,

} from "@/components/admin/admin-list-shell";

import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";

import { RfqEditDialog } from "@/components/admin/admin-entity-crud";



type PageProps = {

  searchParams: Promise<Record<string, string | string[] | undefined>>;

};



export default async function AdminRfqPage({ searchParams }: PageProps) {

  const params = parseAdminListParams(await searchParams);

  const where: Prisma.RfqRequestWhereInput = params.q

    ? {

        OR: [

          { rfqNumber: { contains: params.q } },

          { picName: { contains: params.q } },

          { companyName: { contains: params.q } },

          { user: { username: { contains: params.q } } },

        ],

      }

    : {};



  const [total, rows] = await Promise.all([

    prisma.rfqRequest.count({ where }),

    prisma.rfqRequest.findMany({

      where,

      orderBy: { createdAt: "desc" },

      include: { user: { select: { username: true, name: true } }, items: true },

      skip: params.skip,

      take: params.pageSize,

    }),

  ]);



  return (

    <>

      <AdminPageHeader title="RFQ" description="Request for quotation." />

      <AdminListShell

        basePath="/admin/rfq"

        q={params.q}

        page={params.page}

        pageSize={params.pageSize}

        total={total}

        searchPlaceholder="Cari nomor RFQ, PIC, perusahaan…"

      >

        <AdminTableWrap>

          <table className="w-full text-left text-sm">

            <thead className="border-b border-neutral-100 bg-neutral-50/80">

              <tr>

                <AdminThNo />

                <th className="px-6 py-3 font-medium text-neutral-500">No. RFQ</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Pelanggan</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Status</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Item</th>

                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-100">

              {rows.map((o, i) => (

                <tr key={o.id}>

                  <AdminTdNo n={rowNumber(i, params)} />

                  <td className="px-6 py-3 font-mono text-xs">{o.rfqNumber}</td>

                  <td className="px-6 py-3">{o.user?.name ?? o.picName ?? "—"}</td>

                  <td className="px-6 py-3">{o.status}</td>

                  <td className="px-6 py-3">{o.items.length}</td>

                  <AdminActionCell>

                    <RfqEditDialog
                      row={{
                        id: o.id,
                        status: o.status,
                        picName: o.picName,
                        companyName: o.companyName,
                      }}
                      updateAction={updateRfqRequest}
                    />

                    <AdminDeleteButton

                      action={async () => {

                        "use server";

                        await deleteRfqRequest(o.id);

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

