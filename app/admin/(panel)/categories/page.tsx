import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";

import { createCategory, updateCategory, deleteCategory } from "@/lib/admin-crud";

import { AdminPageHeader } from "@/components/admin/admin-page-header";

import {

  AdminListShell,

  AdminTableWrap,

  AdminThNo,

  AdminTdNo,

  AdminActionCell,

} from "@/components/admin/admin-list-shell";

import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";

import { CategoryCreateDialog, CategoryEditDialog } from "@/components/admin/admin-entity-crud";



type PageProps = {

  searchParams: Promise<Record<string, string | string[] | undefined>>;

};



export default async function AdminCategoriesPage({ searchParams }: PageProps) {

  const params = parseAdminListParams(await searchParams);

  const where: Prisma.CategoryWhereInput = params.q

    ? {

        OR: [{ name: { contains: params.q } }, { slug: { contains: params.q } }],

      }

    : {};



  const [total, rows, allCategories] = await Promise.all([

    prisma.category.count({ where }),

    prisma.category.findMany({

      where,

      orderBy: { name: "asc" },

      skip: params.skip,

      take: params.pageSize,

    }),

    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),

  ]);



  const parentOptions = allCategories.map((c) => ({ value: c.id, label: c.name }));



  return (

    <>

      <AdminPageHeader title="Kategori" description="CRUD kategori marketplace." />

      <AdminListShell

        basePath="/admin/categories"

        q={params.q}

        page={params.page}

        pageSize={params.pageSize}

        total={total}

        searchPlaceholder="Cari slug atau nama…"

        createAction={

          <CategoryCreateDialog createAction={createCategory} parentOptions={parentOptions} />

        }

      >

        <AdminTableWrap>

          <table className="w-full text-left text-sm">

            <thead className="border-b border-neutral-100 bg-neutral-50/80">

              <tr>

                <AdminThNo />

                <th className="px-6 py-3 font-medium text-neutral-500">Slug</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Nama</th>

                <th className="px-6 py-3 font-medium text-neutral-500">Ikon</th>

                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-neutral-100">

              {rows.map((c, i) => (

                <tr key={c.id}>

                  <AdminTdNo n={rowNumber(i, params)} />

                  <td className="px-6 py-3 font-mono text-xs">{c.slug}</td>

                  <td className="px-6 py-3 font-medium">{c.name}</td>

                  <td className="px-6 py-3 text-neutral-600">{c.icon ?? "—"}</td>

                  <AdminActionCell>

                    <CategoryEditDialog

                      row={c}

                      parentOptions={parentOptions}

                      updateAction={updateCategory}

                    />

                    <AdminDeleteButton

                      action={async () => {

                        "use server";

                        await deleteCategory(c.id);

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

