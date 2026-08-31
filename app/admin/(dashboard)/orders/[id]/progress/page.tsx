import Link from "next/link";
import { notFound } from "next/navigation";

import {
  applyTemplateToOrder,
  clearOrderProgress,
  deleteProgressPhoto,
  updateProgressTask,
} from "@/lib/admin-order-progress";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import {
  ApplyWbsTemplateDialog,
  ProgressTaskUpdateDialog,
} from "@/components/admin/admin-wbs-crud";

type PageProps = { params: Promise<{ id: string }> };

function statusLabel(status: string) {
  if (status === "COMPLETED") return "Selesai";
  if (status === "IN_PROGRESS") return "Dikerjakan";
  return "Belum";
}

function statusClass(status: string) {
  if (status === "COMPLETED") return "bg-emerald-50 text-emerald-700";
  if (status === "IN_PROGRESS") return "bg-amber-50 text-amber-800";
  return "bg-neutral-100 text-neutral-600";
}

export default async function AdminOrderProgressPage({ params }: PageProps) {
  const { id } = await params;
  const [order, templates] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        company: { select: { companyName: true } },
        progressTasks: {
          where: { parentId: null },
          orderBy: { sortOrder: "asc" },
          include: {
            children: {
              orderBy: { sortOrder: "asc" },
              include: { photos: { orderBy: { createdAt: "desc" } } },
            },
            photos: true,
          },
        },
      },
    }),
    prisma.wbsTemplate.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, estimatedDays: true },
    }),
  ]);

  if (!order) notFound();

  const progress = Number(order.progressPercent);

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Kembali ke Order / PO
        </Link>
      </div>
      <AdminPageHeader
        title={`Progress · ${order.orderNumber}`}
        description={`${order.company?.companyName ?? "—"} · ${order.user?.name ?? "—"}`}
      />

      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Progress keseluruhan
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-900">{progress}%</p>
            <p className="mt-1 text-sm text-neutral-500">
              Estimasi {order.estimatedDays ?? "—"} hari
              {order.estimatedEndDate
                ? ` · target ${order.estimatedEndDate.toLocaleDateString("id-ID")}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {order.progressTasks.length === 0 && templates.length > 0 ? (
              <ApplyWbsTemplateDialog
                orderId={order.id}
                templates={templates}
                applyAction={applyTemplateToOrder}
              />
            ) : null}
            {order.progressTasks.length > 0 ? (
              <AdminDeleteButton
                label="Reset progress"
                action={async () => {
                  "use server";
                  await clearOrderProgress(order.id);
                }}
              />
            ) : null}
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-neutral-900 transition-all"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      {order.progressTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
          {templates.length === 0 ? (
            <>
              Belum ada template WBS.{" "}
              <Link href="/admin/wbs-templates" className="font-medium text-neutral-900 underline">
                Buat template dulu
              </Link>
              .
            </>
          ) : (
            "Apply template WBS untuk mulai tracking progress."
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {order.progressTasks.map((parent, idx) => {
            const childDone = parent.children.filter((c) => c.status === "COMPLETED").length;
            const childTotal = parent.children.length;
            const parentPct =
              childTotal > 0
                ? Math.round((childDone / childTotal) * 100)
                : parent.status === "COMPLETED"
                  ? 100
                  : 0;

            return (
              <div
                key={parent.id}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                      Fase {idx + 1} · bobot {Number(parent.weightPercent)}%
                      {parent.estimatedDays ? ` · ~${parent.estimatedDays} hari` : ""}
                    </p>
                    <h3 className="font-semibold text-neutral-900">{parent.title}</h3>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {childTotal > 0
                        ? `${childDone}/${childTotal} sub selesai · ${parentPct}% fase`
                        : statusLabel(parent.status)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(parent.status)}`}
                    >
                      {statusLabel(parent.status)}
                    </span>
                    <ProgressTaskUpdateDialog
                      row={{
                        id: parent.id,
                        title: parent.title,
                        status: parent.status,
                        actualHours: parent.actualHours,
                        estimatedHours: parent.estimatedHours,
                        note: parent.note,
                        parentId: parent.parentId,
                      }}
                      updateAction={updateProgressTask}
                    />
                  </div>
                </div>

                <ul className="divide-y divide-neutral-100">
                  {parent.children.length === 0 ? (
                    <li className="px-5 py-4 text-sm text-neutral-400">
                      Tidak ada sub-tugas (fase ini adalah leaf).
                    </li>
                  ) : (
                    parent.children.map((child) => (
                      <li key={child.id} className="px-5 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-neutral-800">{child.title}</p>
                            <p className="mt-0.5 text-xs text-neutral-500">
                              Bobot {Number(child.weightPercent)}% · estimasi{" "}
                              {child.estimatedHours ?? 8} jam
                              {child.actualHours != null
                                ? ` · aktual ${child.actualHours} jam`
                                : ""}
                            </p>
                            {child.note ? (
                              <p className="mt-1 text-xs text-neutral-600">{child.note}</p>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(child.status)}`}
                            >
                              {statusLabel(child.status)}
                            </span>
                            <ProgressTaskUpdateDialog
                              row={{
                                id: child.id,
                                title: child.title,
                                status: child.status,
                                actualHours: child.actualHours,
                                estimatedHours: child.estimatedHours,
                                note: child.note,
                                parentId: child.parentId,
                              }}
                              updateAction={updateProgressTask}
                            />
                          </div>
                        </div>
                        {child.photos.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {child.photos.map((photo) => (
                              <div key={photo.id} className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={photo.url}
                                  alt={photo.caption ?? child.title}
                                  className="h-16 w-16 rounded-lg object-cover"
                                />
                                <div className="absolute -right-1 -top-1">
                                  <AdminDeleteButton
                                    action={async () => {
                                      "use server";
                                      await deleteProgressPhoto(photo.id);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
