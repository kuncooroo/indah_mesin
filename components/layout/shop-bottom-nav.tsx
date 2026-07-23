"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Home, LayoutGrid, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/favorites", label: "Saved", icon: Bookmark },
  { href: "/contact", label: "Contact", icon: MessageCircle },
];

export function ShopBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border-subtle bg-surface shadow-lg safe-bottom">
      <div className="mx-auto flex w-full max-w-lg justify-around px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-1 text-sm transition-colors",
                active
                  ? "scale-95 rounded-xl bg-secondary-container/20 text-primary"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              <Icon className={cn("size-5", active && "fill-primary/20")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
