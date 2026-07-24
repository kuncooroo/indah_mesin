import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { createProduct, updateProduct, deleteProduct } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { AdminPreviewLink } from "@/components/admin/admin-icon-actions";
import { ProductCreateDialog, ProductEditDialog } from "@/components/admin/admin-product-crud";
import { ProductPublishToggle } from "@/components/admin/product-publish-toggle";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatPrice(currency: string, price: { toString(): string }) {
  const n = Number(price);
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const where: Prisma.ProductWhereInput = params.q
    ? {
        OR: [
          { name: { contains: params.q } },
          { sku: { contains: params.q } },
          { category: { name: { contains: params.q } } },
        ],
      }
    : {};

  const [total, rows, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
      skip: params.skip,
      take: params.pageSize,
      include: {
        category: true,
        media: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } }),
  ]);

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    label: `${c.name} (${c.slug})`,
  }));

  return (
    <>
      <AdminPageHeader title="Produk" description="Kelola katalog — search, CRUD, pagination." />
      <AdminListShell
        basePath="/admin/products"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari nama, SKU, kategori…"
        createAction={
          <ProductCreateDialog createAction={createProduct} categories={categoryOptions} />
        }
      >
        <AdminTableWrap>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-4 py-3 font-medium text-neutral-600">Produk</th>
                <th className="hidden px-4 py-3 font-medium text-neutral-600 md:table-cell">SKU</th>
                <th className="hidden px-4 py-3 font-medium text-neutral-600 lg:table-cell">Kategori</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Harga</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                rows.map((p, i) => {
                  const image = p.media[0]?.url;
                  return (
                    <tr key={p.id} className="align-middle">
                      <AdminTdNo n={rowNumber(i, params)} />
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-neutral-200 bg-neutral-50">
                            {image ? (
                              <Image src={image} alt="" fill className="object-cover" sizes="40px" />
                            ) : null}
                          </div>
                          <span className="font-medium text-neutral-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-neutral-600 md:table-cell">{p.sku}</td>
                      <td className="hidden px-4 py-3 text-neutral-600 lg:table-cell">{p.category.name}</td>
                      <td className="px-4 py-3 text-neutral-700">{formatPrice(p.currency, p.price)}</td>
                      <td className="px-4 py-3">
                        <span className="text-neutral-600">{p.stockStatus.replace(/_/g, " ")}</span>
                        {!p.isPublished ? (
                          <span className="ml-2 text-xs text-neutral-400">(nonaktif)</span>
                        ) : null}
                      </td>
                      <AdminActionCell>
                        <AdminPreviewLink href={`/products/${p.id}`} />
                        <ProductEditDialog
                          product={{
                            id: p.id,
                            name: p.name,
                            categoryId: p.categoryId,
                            currency: p.currency,
                            price: p.price.toString(),
                            priceNote: p.priceNote,
                            stockStatus: p.stockStatus,
                            isPublished: p.isPublished,
                          }}
                          primaryImageUrl={image}
                          categories={categoryOptions}
                          updateAction={updateProduct}
                        />
                        <ProductPublishToggle productId={p.id} published={p.isPublished} />
                        <AdminDeleteButton
                          action={async () => {
                            "use server";
                            await deleteProduct(p.id);
                          }}
                        />
                      </AdminActionCell>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </AdminTableWrap>
      </AdminListShell>
    </>
  );
}
