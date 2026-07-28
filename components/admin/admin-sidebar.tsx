"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { adminNavDashboard, adminNavGroups } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  userName: string;
  userEmail: string;
  isSuperAdmin: boolean;
};

function isNavItemActive(pathname: string, href: string, matchPrefix?: boolean): boolean {
  if (pathname === href) return true;
  if (href === "/admin/dashboard") return false;
  if (matchPrefix ?? true) return pathname.startsWith(`${href}/`);
  return false;
}

function groupIsActive(
  pathname: string,
  items: { href: string; matchPrefix?: boolean }[]
): boolean {
  return items.some((item) => isNavItemActive(pathname, item.href, item.matchPrefix));
}

export function AdminSidebar({ userName, userEmail, isSuperAdmin }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleGroups = useMemo(
    () =>
      adminNavGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.superOnly || isSuperAdmin),
        }))
        .filter((group) => group.items.length > 0),
    [isSuperAdmin]
  );

  const activeGroupIds = useMemo(
    () =>
      new Set(
        visibleGroups.filter((g) => groupIsActive(pathname, g.items)).map((g) => g.id)
      ),
    [pathname, visibleGroups]
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    queueMicrotask(() => {
      setOpenGroups((prev) => {
        const next = { ...prev };
        for (const group of visibleGroups) {
          if (activeGroupIds.has(group.id)) {
            next[group.id] = true;
          }
        }
        return next;
      });
    });
  }, [activeGroupIds, visibleGroups]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function isGroupOpen(id: string) {
    return openGroups[id] ?? activeGroupIds.has(id);
  }

  const dashboardActive = isNavItemActive(pathname, adminNavDashboard.href, false);
  const DashboardIcon = adminNavDashboard.icon;

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-5 py-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          IndustrialX
        </p>
        <p className="mt-1 text-lg font-bold text-neutral-900">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <Link
          href={adminNavDashboard.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            dashboardActive
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          )}
        >
          <DashboardIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {adminNavDashboard.label}
        </Link>

        {visibleGroups.map((group) => {
          const open = isGroupOpen(group.id);
          const groupActive = groupIsActive(pathname, group.items);
          const GroupIcon = group.icon;

          return (
            <div key={group.id} className="pt-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={open}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  groupActive && !open
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <GroupIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                <span className="min-w-0 flex-1 truncate">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200",
                    open && "rotate-180"
                  )}
                  strokeWidth={2}
                />
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-0.5 pb-1 pl-2 pt-0.5">
                    {group.items.map(({ href, label, icon: Icon, matchPrefix }) => {
                      const active = isNavItemActive(pathname, href, matchPrefix);
                      return (
                        <Link
                          key={href}
                          href={href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg py-2 pl-7 pr-3 text-sm font-medium transition-colors",
                            active
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
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
