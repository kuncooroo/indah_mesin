import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { updateOrder, deleteOrder } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { OrderEditDialog } from "@/components/admin/admin-company-crud";
import {
  AdminOrderDetailLink,
  AdminOrderProgressLink,
} from "@/components/admin/admin-icon-actions";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatIdr(value: { toString(): string }) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatOrderAt(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);

  const where: Prisma.OrderWhereInput = params.q
    ? {
        OR: [
          { orderNumber: { contains: params.q } },
          { company: { companyName: { contains: params.q } } },
          { user: { name: { contains: params.q } } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.pageSize,
      include: {
        user: { select: { name: true, email: true } },
        company: { select: { companyName: true } },
        _count: { select: { items: true, documents: true } },
      },
    }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Order / PO"
        description="Kelola purchase order, progress WBS, dan dokumen terkait."
      />
      <AdminListShell
        basePath="/admin/orders"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari nomor PO, PIC, perusahaan…"
      >
        <AdminTableWrap>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80">
              <tr>
                <AdminThNo />
                <th className="px-6 py-3 font-medium text-neutral-500">No. PO</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Waktu Order</th>
                <th className="px-6 py-3 font-medium text-neutral-500">PIC</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Perusahaan</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Item</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Dokumen</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Total</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Progress</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-neutral-500">
                    Tidak ada order.
                  </td>
                </tr>
              ) : (
                rows.map((o, i) => (
                  <tr key={o.id}>
                    <AdminTdNo n={rowNumber(i, params)} />
                    <td className="px-6 py-3 font-mono text-xs font-medium">{o.orderNumber}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-xs text-neutral-600">
                      {formatOrderAt(o.createdAt)}
                    </td>
                    <td className="px-6 py-3">{o.user?.name ?? "—"}</td>
                    <td className="px-6 py-3">{o.company?.companyName ?? "—"}</td>
                    <td className="px-6 py-3">{o._count.items}</td>
                    <td className="px-6 py-3">{o._count.documents}</td>
                    <td className="px-6 py-3">{formatIdr(o.totalEstimatedPrice)}</td>
                    <td className="px-6 py-3 tabular-nums">{Number(o.progressPercent)}%</td>
                    <td className="px-6 py-3">{o.status.replace(/_/g, " ")}</td>
                    <AdminActionCell>
                      <AdminOrderDetailLink href={`/admin/orders/${o.id}`} />
                      <AdminOrderProgressLink href={`/admin/orders/${o.id}/progress`} />
                      <OrderEditDialog
                        row={{ id: o.id, status: o.status, notes: o.notes }}
                        updateAction={updateOrder}
                      />
                      <AdminDeleteButton
                        action={async () => {
                          "use server";
                          return deleteOrder(o.id);
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
