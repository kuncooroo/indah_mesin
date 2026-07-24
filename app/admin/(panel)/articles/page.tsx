import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { createArticle, updateArticle, deleteArticle } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { ArticleCreateDialog, ArticleEditDialog } from "@/components/admin/admin-entity-crud";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const where: Prisma.ArticleWhereInput = params.q
    ? {
        OR: [{ title: { contains: params.q } }, { category: { contains: params.q } }],
      }
    : {};

  const [total, rows] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: params.skip,
      take: params.pageSize,
    }),
  ]);

  return (
    <>
      <AdminPageHeader title="Artikel" description="Kelola artikel beranda." />
      <AdminListShell
        basePath="/admin/articles"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari judul atau kategori…"
        createAction={<ArticleCreateDialog createAction={createArticle} />}
      >
        <AdminTableWrap>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-6 py-3 font-medium text-neutral-500">Judul</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Kategori</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((a, i) => (
                <tr key={a.id}>
                  <AdminTdNo n={rowNumber(i, params)} />
                  <td className="px-6 py-3 font-medium">{a.title}</td>
                  <td className="px-6 py-3">{a.category}</td>
                  <td className="px-6 py-3">{a.published ? "Aktif" : "Draft"}</td>
                  <AdminActionCell>
                    <ArticleEditDialog row={a} imageUrl={a.imageUrl} updateAction={updateArticle} />
                    <AdminDeleteButton
                      action={async () => {
                        "use server";
                        await deleteArticle(a.id);
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
