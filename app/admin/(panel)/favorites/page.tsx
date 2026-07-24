import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";

import { createSavedItem, deleteSavedItem } from "@/lib/admin-crud";

import { AdminPageHeader } from "@/components/admin/admin-page-header";

import {

  AdminListShell,

  AdminTableWrap,

  AdminThNo,

  AdminTdNo,

  AdminActionCell,

} from "@/components/admin/admin-list-shell";

import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";

import { FavoriteCreateDialog } from "@/components/admin/admin-entity-crud";



type PageProps = {

  searchParams: Promise<Record<string, string | string[] | undefined>>;

};



export default async function AdminFavoritesPage({ searchParams }: PageProps) {

  const params = parseAdminListParams(await searchParams);

  const where: Prisma.SavedItemWhereInput = params.q

    ? {

        OR: [

          { user: { username: { contains: params.q } } },

          { user: { name: { contains: params.q } } },

          { product: { sku: { contains: params.q } } },

          { product: { name: { contains: params.q } } },

        ],

      }

    : {};



  const [total, rows, users, products] = await Promise.all([

    prisma.savedItem.count({ where }),

    prisma.savedItem.findMany({

      where,

      include: {

        user: { select: { username: true, name: true, email: true } },

        product: { select: { sku: true, name: true } },

      },

      orderBy: { createdAt: "desc" },

      skip: params.skip,

      take: params.pageSize,

    }),

    prisma.user.findMany({

      where: { role: "BUYER" },

      select: { id: true, username: true, name: true, email: true },

      orderBy: { username: "asc" },

      take: 200,

    }),

    prisma.product.findMany({

      select: { id: true, sku: true, name: true },

      orderBy: { name: "asc" },

      take: 200,

    }),

  ]);



  return (

    <>

      <AdminPageHeader title="Favorit" description="Bookmark produk pengguna." />

      <AdminListShell

        basePath="/admin/favorites"

        q={params.q}

        page={params.page}

        pageSize={params.pageSize}

        total={total}

        searchPlaceholder="Cari user atau produk…"

        createAction={

          <FavoriteCreateDialog

            createAction={createSavedItem}

            users={users.map((u) => ({

              id: u.id,

              label: u.name ?? u.username ?? u.email,

            }))}

            products={products.map((p) => ({

              id: p.id,

              label: `${p.sku} — ${p.name}`,

            }))}

          />

        }

      >

        <AdminTableWrap>

          <table className="w-full text-left text-sm">

            <thead className="border-b border-neutral-100 bg-neutral-50/80">

              <tr>

                <AdminThNo />

                <th className="px-6 py-3 font-medium text-neutral-500">Pengguna</th>

                <th className="px-6 py-3 font-medium text-neutral-500">SKU</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Produk</th>

                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-100">

              {rows.map((f, i) => (

                <tr key={f.id}>

                  <AdminTdNo n={rowNumber(i, params)} />

                  <td className="px-6 py-3">

                    {f.user?.name ?? f.user?.username ?? f.user?.email ?? "—"}

                  </td>

                  <td className="px-6 py-3 font-mono text-xs">{f.product.sku}</td>

                  <td className="px-6 py-3">{f.product.name}</td>

                  <AdminActionCell>

                    <AdminDeleteButton

                      action={async () => {

                        "use server";

                        await deleteSavedItem(f.id);

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

