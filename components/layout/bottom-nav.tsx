"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/machines", label: "Mesin", icon: Activity },
  { href: "/alarms", label: "Alarm", icon: AlertTriangle },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-scada-border bg-scada-secondary/95 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-w-[64px] flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors",
                active
                  ? "text-scada-cyan"
                  : "text-scada-muted hover:text-scada-text"
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  active && "drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                )}
              />
              <span>{label}</span>
              {active && (
                <span className="absolute bottom-0.5 h-0.5 w-8 rounded-full bg-scada-cyan" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
