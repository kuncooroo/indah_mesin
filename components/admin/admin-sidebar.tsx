"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminNavItems } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  userName: string;
  userEmail: string;
  isSuperAdmin: boolean;
};

export function AdminSidebar({ userName, userEmail, isSuperAdmin }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-5 py-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          IndustrialX
        </p>
        <p className="mt-1 text-lg font-bold text-neutral-900">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {adminNavItems
          .filter((item) => !item.superOnly || isSuperAdmin)
          .map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-neutral-100 p-4">
        <p className="truncate text-sm font-semibold text-neutral-900">{userName}</p>
        <p className="truncate text-xs text-neutral-500">{userEmail}</p>
        <Link
          href="/api/auth/signout?callbackUrl=/admin/login"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Link>
      </div>
    </aside>
  );
}
