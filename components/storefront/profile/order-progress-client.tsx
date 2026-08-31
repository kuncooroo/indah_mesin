"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

export type ProgressPhoto = { id: string; url: string; caption: string | null };

export type ProgressChild = {
  id: string;
  title: string;
  status: string;
  weightPercent: number;
  estimatedHours: number | null;
  actualHours: number | null;
  completedAt: string | null;
  note: string | null;
  photos: ProgressPhoto[];
};

export type ProgressParent = {
  id: string;
  title: string;
  status: string;
  weightPercent: number;
  estimatedDays: number | null;
  children: ProgressChild[];
};

export type OrderProgressPayload = {
  id: string;
  poNumber: string;
  dateLabel: string;
  progressPercent: number;
  estimatedDays: number | null;
  estimatedEndLabel: string | null;
  description: string;
  amount: string;
  parents: ProgressParent[];
};

function statusMeta(status: string) {
  if (status === "COMPLETED") {
    return { label: "Selesai", className: "bg-secondary-container text-on-secondary-container" };
  }
  if (status === "IN_PROGRESS") {
    return { label: "Dikerjakan", className: "bg-primary/10 text-primary" };
  }
  return { label: "Belum", className: "bg-surface-container text-on-surface-variant" };
}

function parentProgress(parent: ProgressParent) {
  if (parent.children.length === 0) {
    return parent.status === "COMPLETED" ? 100 : parent.status === "IN_PROGRESS" ? 50 : 0;
  }
  const done = parent.children.filter((c) => c.status === "COMPLETED").length;
  return Math.round((done / parent.children.length) * 100);
}

export function OrderProgressClient({ order }: { order: OrderProgressPayload }) {
  const [openId, setOpenId] = useState<string | null>(order.parents[0]?.id ?? null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const dayLabel = useMemo(() => {
    if (!order.estimatedDays) return null;
    return `Estimasi ${order.estimatedDays} hari kerja`;
  }, [order.estimatedDays]);

  return (
    <>
      <ProfileSettingsHeader backHref="/profile/orders" title="Progress PO" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col px-margin-mobile pb-24 pt-4">
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <p className="font-label-technical text-sm uppercase tracking-wider text-primary">
              {order.poNumber}
            </p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface">
              {order.description}
            </h1>
            <p className="mt-1 font-body-sm text-on-surface-variant">
              {order.dateLabel}
              {dayLabel ? ` · ${dayLabel}` : ""}
              {order.estimatedEndLabel ? ` · target ${order.estimatedEndLabel}` : ""}
            </p>

            <div className="mt-4">
              <div className="mb-1.5 flex items-end justify-between">
                <span className="font-body-sm text-on-surface-variant">Progress</span>
                <span className="font-label-technical text-headline-md text-primary">
                  {order.progressPercent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, order.progressPercent)}%` }}
                />
              </div>
              <p className="mt-2 font-headline-md text-on-surface">{order.amount}</p>
            </div>
          </div>

          {order.parents.length === 0 ? (
            <div className="mt-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
                <MaterialSymbol name="pending" className="text-4xl text-outline" />
              </div>
              <h2 className="font-headline-md text-on-surface">Belum ada progress</h2>
              <p className="mt-2 max-w-xs font-body-md text-on-surface-variant">
                Tim produksi belum menerapkan template WBS untuk PO ini.
              </p>
              <Link href="/profile/orders" className="mt-6 font-button-text text-primary">
                Kembali ke daftar PO
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <p className="font-label-technical text-label-technical uppercase tracking-wider text-outline">
                Rincian pengerjaan
              </p>
              {order.parents.map((parent) => {
                const open = openId === parent.id;
                const pct = parentProgress(parent);
                const meta = statusMeta(parent.status);
                return (
                  <div
                    key={parent.id}
                    className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 p-4 text-left"
                      onClick={() => setOpenId(open ? null : parent.id)}
                      aria-expanded={open}
                    >
                      <MaterialSymbol
                        name={open ? "expand_more" : "chevron_right"}
                        className="text-outline"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-body-md font-medium text-on-surface">{parent.title}</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container">
                          <div
                            className="h-full rounded-full bg-primary/80"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-1 font-body-sm text-on-surface-variant">
                          {pct}% · bobot {parent.weightPercent}%
                          {parent.estimatedDays ? ` · ~${parent.estimatedDays} hari` : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 font-label-technical text-[10px]",
                          meta.className
                        )}
                      >
                        {meta.label}
                      </span>
                    </button>

                    {open ? (
                      <ul className="border-t border-border-subtle divide-y divide-border-subtle">
                        {parent.children.length === 0 ? (
                          <li className="px-4 py-3 pl-12 font-body-sm text-on-surface-variant">
                            Tidak ada sub-tugas
                          </li>
                        ) : (
                          parent.children.map((child) => {
                            const childMeta = statusMeta(child.status);
                            return (
                              <li key={child.id} className="px-4 py-3 pl-12">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="font-body-md text-on-surface">{child.title}</p>
                                    <p className="mt-0.5 font-body-sm text-on-surface-variant">
                                      {child.actualHours != null
                                        ? `${child.actualHours} jam dikerjakan`
                                        : `Estimasi ${child.estimatedHours ?? 8} jam`}
                                    </p>
                                  </div>
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 font-label-technical text-[10px]",
                                      childMeta.className
                                    )}
                                  >
                                    {childMeta.label}
                                  </span>
                                </div>
                                {child.photos.length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {child.photos.map((photo) => (
                                      <button
                                        key={photo.id}
                                        type="button"
                                        onClick={() => setLightbox(photo.url)}
                                        className="relative h-14 w-14 overflow-hidden rounded-lg"
                                      >
                                        <Image
                                          src={photo.url}
                                          alt={photo.caption ?? child.title}
                                          fill
                                          className="object-cover"
                                          sizes="56px"
                                          unoptimized={photo.url.startsWith("/uploads/")}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                ) : null}
                              </li>
                            );
                          })
                        )}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {lightbox ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Tutup"
            onClick={() => setLightbox(null)}
          />
          <div className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox} alt="" className="max-h-[85vh] w-auto object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
