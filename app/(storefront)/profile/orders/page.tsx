"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  type OrderStatus,
  type ProfileOrder,
} from "@/lib/storefront/profile-demo-data";
import { cn } from "@/lib/utils";

type Filter = "all" | OrderStatus;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "processed", label: "Processed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "processed") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 font-label-technical text-[11px] text-on-secondary-container">
        <span className="h-1.5 w-1.5 rounded-full bg-status-ready" /> PROCESSED
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-surface-container-highest px-3 py-1 font-label-technical text-[11px] text-on-surface">
        <MaterialSymbol name="check_circle" className="text-[14px]" /> COMPLETED
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-error-container px-3 py-1 font-label-technical text-[11px] text-on-error-container">
      <MaterialSymbol name="cancel" className="text-[14px]" /> CANCELLED
    </span>
  );
}

export default function ProfileOrdersPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [orders, setOrders] = useState<ProfileOrder[]>([]);

  useEffect(() => {
    void fetch("/api/profile/orders")
      .then((response) => (response.ok ? response.json() : { orders: [] }))
      .then((result) => setOrders(result.orders ?? []));
  }, []);

  const visible = useMemo(
    () => orders.filter((o) => filter === "all" || o.status === filter),
    [filter, orders]
  );

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col pb-24">
          <div className="space-y-4 px-margin-mobile pb-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-sm text-on-surface-variant">Welcome back, Procurement</p>
                <h2 className="font-headline-md text-headline-md text-primary">Purchase Orders</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <MaterialSymbol name="analytics" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="font-body-sm text-on-surface-variant">Active POs</p>
                <p className="font-label-technical text-headline-md text-primary">
                  {orders.filter((order) => order.status === "processed").length}
                </p>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="font-body-sm text-on-surface-variant">Pending Value</p>
                <p className="font-label-technical text-headline-md text-primary">
                  {orders.length > 0 ? orders[0].amount : "Rp 0"}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky top-16 z-30 overflow-x-auto border-b border-border-subtle bg-background/95 py-3 backdrop-blur-md no-scrollbar px-margin-mobile">
            <div className="flex min-w-max gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "rounded-full px-5 py-1.5 font-button-text text-body-sm transition-all",
                    filter === f.id
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length > 0 ? (
            <div className="space-y-4 px-margin-mobile pt-6" id="po-list">
              {visible.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className={cn(
                    "group relative w-full cursor-pointer overflow-hidden rounded-xl bg-surface-container-lowest p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]",
                    order.status === "cancelled" && "opacity-90"
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-technical text-sm uppercase tracking-wider text-primary">
                        {order.poNumber}
                      </span>
                      <span className="font-body-sm text-on-surface-variant">{order.dateLabel}</span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className={order.status === "cancelled" ? "opacity-60" : undefined}>
                      <p className="font-body-sm text-on-surface-variant">{order.description}</p>
                      <p className="font-headline-md text-headline-md text-on-surface">
                        {order.amount}
                      </p>
                    </div>
                    <MaterialSymbol
                      name="chevron_right"
                      className="text-outline transition-colors group-hover:text-primary"
                    />
                  </div>
                  {order.status === "processed" ? (
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center px-margin-mobile py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container">
                <MaterialSymbol name="search_off" className="text-5xl text-outline" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">No orders found</h3>
              <p className="mt-2 max-w-[240px] font-body-md text-on-surface-variant">
                Adjust your filters to see more purchase orders.
              </p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-6 font-button-text text-primary"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="fixed bottom-6 right-6 z-40">
            <Link
              href="/categories"
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-on-primary shadow-xl transition-all hover:bg-primary-container active:scale-95"
            >
              <MaterialSymbol name="add" />
              <span className="font-button-text">New PO</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
