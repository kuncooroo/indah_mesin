import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateOrder, deleteOrder, createArchiveDocument, deleteArchiveDocument } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { OrderEditDialog, OrderDocumentCreateDialog } from "@/components/admin/admin-company-crud";
import {
  AdminBackLink,
  AdminOrderProgressLink,
  AdminPageToolbar,
} from "@/components/admin/admin-icon-actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatIdr(value: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      company: { select: { companyName: true } },
      items: {
        include: { product: { select: { name: true, sku: true, slug: true } } },
      },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`PO ${order.orderNumber}`}
        description={`Status: ${order.status.replace(/_/g, " ")} · Progress ${Number(order.progressPercent)}% · ${new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(order.createdAt)}`}
      />

      <AdminPageToolbar>
        <AdminBackLink href="/admin/orders" title="Kembali ke daftar" />
        <AdminOrderProgressLink href={`/admin/orders/${order.id}/progress`} />
        <OrderEditDialog
          row={{ id: order.id, status: order.status, notes: order.notes }}
          updateAction={updateOrder}
        />
        <AdminDeleteButton
          action={async () => {
            "use server";
            return deleteOrder(order.id);
          }}
          label="Hapus PO"
        />
      </AdminPageToolbar>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Informasi PO</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Waktu order</dt>
              <dd className="text-neutral-900">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(order.createdAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">PIC</dt>
              <dd className="text-neutral-900">{order.user?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Email</dt>
              <dd className="text-neutral-900">{order.user?.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Perusahaan</dt>
              <dd className="text-neutral-900">{order.company?.companyName ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Total estimasi</dt>
              <dd className="font-medium text-neutral-900">{formatIdr(order.totalEstimatedPrice)}</dd>
            </div>
            {order.notes ? (
              <div>
                <dt className="text-neutral-500">Catatan</dt>
                <dd className="mt-1 text-neutral-800">{order.notes}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Item ({order.items.length})</h2>
          <ul className="mt-3 divide-y divide-neutral-100 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 py-2">
                <div>
                  <p className="font-medium text-neutral-900">{item.product.name}</p>
                  <p className="text-xs text-neutral-500">{item.product.sku} × {item.quantity}</p>
                </div>
                <span className="shrink-0 text-neutral-700">{formatIdr(item.priceAtTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-neutral-900">Dokumen PO</h2>
          <OrderDocumentCreateDialog
            createAction={createArchiveDocument}
            orderId={order.id}
            userId={order.userId ?? undefined}
          />
        </div>
        {order.documents.length === 0 ? (
          <p className="text-sm text-neutral-500">Belum ada dokumen untuk PO ini.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 text-neutral-500">
              <tr>
                <th className="py-2 font-medium">Nama</th>
                <th className="py-2 font-medium">Tipe</th>
                <th className="py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {order.documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="py-2">
                    <Link href={doc.fileUrl} className="font-medium text-neutral-900 hover:underline">
                      {doc.documentName}
                    </Link>
                  </td>
                  <td className="py-2 text-neutral-600">{doc.documentType.replace(/_/g, " ")}</td>
                  <td className="py-2 text-right">
                    <AdminDeleteButton
                      action={async () => {
                        "use server";
                        return deleteArchiveDocument(doc.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
