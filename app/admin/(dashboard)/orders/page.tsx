import type { Prisma } from "@prisma/client";
import { Suspense } from "react";

import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { updateOrder, deleteOrder, updateRfqRequest, deleteRfqRequest } from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminOrdersViewTabs } from "@/components/admin/admin-orders-view-tabs";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { OrderEditDialog } from "@/components/admin/admin-company-crud";
import { RfqEditDialog } from "@/components/admin/admin-entity-crud";

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

function readView(sp: Record<string, string | string[] | undefined>) {
  return sp.view === "legacy" ? "legacy" : "orders";
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const view = readView(sp);
  const params = parseAdminListParams(sp);

  return (
    <>
      <AdminPageHeader
        title="Order / PO"
        description={
          view === "legacy"
            ? "Arsip permintaan RFQ lama — alur baru lewat Draf PO & WhatsApp."
            : "Header PO & quotation — status draft hingga approved."
        }
      />
      <Suspense fallback={<div className="mb-6 h-10 animate-pulse rounded-lg bg-neutral-100" />}>
        <AdminOrdersViewTabs />
      </Suspense>
      {view === "legacy" ? (
        <LegacyRfqSection params={params} />
      ) : (
        <OrdersSection params={params} />
      )}
    </>
  );
}

async function OrdersSection({ params }: { params: ReturnType<typeof parseAdminListParams> }) {
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
        _count: { select: { items: true } },
      },
    }),
  ]);

  return (
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
              <th className="px-6 py-3 font-medium text-neutral-500">PIC</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Perusahaan</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Item</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Total</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
              <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((o, i) => (
              <tr key={o.id}>
                <AdminTdNo n={rowNumber(i, params)} />
                <td className="px-6 py-3 font-mono text-xs font-medium">{o.orderNumber}</td>
                <td className="px-6 py-3">{o.user?.name ?? "—"}</td>
                <td className="px-6 py-3">{o.company?.companyName ?? "—"}</td>
                <td className="px-6 py-3">{o._count.items}</td>
                <td className="px-6 py-3">{formatIdr(o.totalEstimatedPrice)}</td>
                <td className="px-6 py-3">{o.status.replace(/_/g, " ")}</td>
                <AdminActionCell>
                  <OrderEditDialog
                    row={{ id: o.id, status: o.status, notes: o.notes }}
                    updateAction={updateOrder}
                  />
                  <AdminDeleteButton
                    action={async () => {
                      "use server";
                      await deleteOrder(o.id);
                    }}
                  />
                </AdminActionCell>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableWrap>
    </AdminListShell>
  );
}

async function LegacyRfqSection({ params }: { params: ReturnType<typeof parseAdminListParams> }) {
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
    <AdminListShell
      basePath="/admin/orders?view=legacy"
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
              <th className="px-6 py-3 font-medium text-neutral-500">Perusahaan</th>
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
                <td className="px-6 py-3">{o.companyName ?? "—"}</td>
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
  );
}
