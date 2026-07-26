"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "detail", label: "Detail PT" },
  { id: "addresses", label: "Daftar Alamat Pabrik" },
  { id: "pic", label: "Daftar PIC / User" },
] as const;

export type CompanyAdminTab = (typeof tabs)[number]["id"];

export function AdminCompanyTabs({ companyId }: { companyId: string }) {
  const searchParams = useSearchParams();
  const current = (searchParams.get("tab") as CompanyAdminTab | null) ?? "detail";

  return (
    <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
      {tabs.map((tab) => {
        const active = current === tab.id;
        const href =
          tab.id === "detail"
            ? `/admin/companies/${companyId}`
            : `/admin/companies/${companyId}?tab=${tab.id}`;
        return (
          <Link
            key={tab.id}
            href={href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
      <Link
        href="/admin/companies"
        className="ml-auto self-center text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        ← Semua perusahaan
      </Link>
    </div>
  );
}
