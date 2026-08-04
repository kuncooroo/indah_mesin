import Link from "next/link";
import { Heart, FileText, Users, Shield, ShoppingCart } from "lucide-react";
import type { AdminDashboardInsight } from "@/types/admin/marketplace-module";

export function AdminDashboardInsights({
  data,
}: {
  data: AdminDashboardInsight & {
    userTotal?: number;
    adminTotal?: number;
    orderTotal?: number;
  };
}) {
  const cards = [
    {
      title: "Pembeli (User)",
      value: data.userTotal ?? 0,
      hint: "Akun di tabel User",
      href: "/admin/companies",
      hrefLabel: "Kelola perusahaan / PIC →",
      icon: Users,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      title: "Admin panel",
      value: data.adminTotal ?? 0,
      hint: "Akun di tabel Admin",
      href: "/admin/users",
      hrefLabel: "Kelola admin →",
      icon: Shield,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      title: "Order / PO",
      value: data.orderTotal ?? 0,
      hint: "Total order di database",
      href: "/admin/orders",
      hrefLabel: "Buka orders →",
      icon: ShoppingCart,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Saved Items",
      value: data.savedItemsTotal,
      hint: "Wishlist pembeli",
      href: "/favorites",
      hrefLabel: "Lihat di toko →",
      icon: Heart,
      tone: "bg-rose-50 text-rose-600",
      external: true,
    },
    {
      title: "RFQ legacy",
      value: data.legacyRfqTotal,
      hint: "Arsip RFQ lama",
      href: "/admin/orders?view=legacy",
      hrefLabel: "Buka arsip RFQ →",
      icon: FileText,
      tone: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-900">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-neutral-500">{card.hint}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.tone}`}>
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
            </div>
            <Link
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noopener noreferrer" : undefined}
              className="mt-4 inline-block text-sm font-medium text-neutral-700 underline-offset-2 hover:underline"
            >
              {card.hrefLabel}
            </Link>
          </div>
        );
      })}
    </section>
  );
}
