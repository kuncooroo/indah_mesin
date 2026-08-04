"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  match: (path: string) => boolean;
};

const PUBLIC_NAV_ITEMS: NavItem[] = [
  {
    href: "/beranda-artikel",
    label: "Home",
    icon: "home",
    match: (p) => p === "/beranda-artikel" || p === "/home" || p === "/",
  },
  {
    href: "/categories",
    label: "Categories",
    icon: "category",
    match: (p) => p === "/categories" || p.startsWith("/products/"),
  },
  {
    href: "/favorites",
    label: "Saved",
    icon: "bookmark",
    match: (p) => p === "/favorites",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: "chat_bubble",
    match: (p) => p === "/contact",
  },
];

const PROFILE_NAV_ITEMS: NavItem[] = [
  {
    href: "/profile/orders",
    label: "My Orders",
    icon: "list_alt",
    match: (p) => p === "/profile/orders",
  },
  {
    href: "/profile/docs",
    label: "My Docs",
    icon: "description",
    match: (p) => p === "/profile/docs",
  },
  {
    href: "/profile/settings",
    label: "Account Settings",
    icon: "settings",
    match: (p) => p === "/profile/settings",
  },
  {
    href: "/profile/business",
    label: "Business Identity",
    icon: "corporate_fare",
    match: (p) => p === "/profile/business",
  },
  {
    href: "/profile/help",
    label: "Help Center / Support",
    icon: "help",
    match: (p) => p === "/profile/help",
  },
  {
    href: "/profile/privacy",
    label: "Privacy Policy",
    icon: "policy",
    match: (p) => p === "/profile/privacy",
  },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Admin Dashboard",
    icon: "dashboard",
    match: (p) => p === "/admin" || p === "/admin/dashboard",
  },
  {
    href: "/admin/companies",
    label: "Manage Companies",
    icon: "domain",
    match: (p) => p.startsWith("/admin/companies"),
  },
];

const SUPERADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/users",
    label: "Manage Admin Users",
    icon: "admin_panel_settings",
    match: (p) => p.startsWith("/admin/users"),
  },
];

type ShopNavDrawerContextValue = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const ShopNavDrawerContext = createContext<ShopNavDrawerContextValue | null>(null);

export function ShopNavDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const toggleDrawer = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeDrawer]);

  const value = useMemo(
    () => ({ open, openDrawer, closeDrawer, toggleDrawer }),
    [open, openDrawer, closeDrawer, toggleDrawer]
  );

  return (
    <ShopNavDrawerContext.Provider value={value}>
      {children}
      <ShopNavDrawerPanel />
    </ShopNavDrawerContext.Provider>
  );
}

export function useShopNavDrawer() {
  const ctx = useContext(ShopNavDrawerContext);
  if (!ctx) {
    throw new Error("useShopNavDrawer must be used within ShopNavDrawerProvider");
  }
  return ctx;
}

function DrawerLogoutButton({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    if (busy) return;
    if (!window.confirm("Sign out of MesinBagus?")) return;
    setBusy(true);
    try {
      await signOut({ redirect: false });
      onDone();
      router.replace("/profile");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className="flex w-full items-center justify-center gap-3 rounded-full bg-error-container p-component-padding font-button-text text-button-text text-on-error-container transition-all hover:bg-error/10 active:scale-[0.98] disabled:opacity-50"
    >
      <MaterialSymbol name="logout" />
      {busy ? "Logging out..." : "Logout"}
    </button>
  );
}

function ShopNavDrawerPanel() {
  const { open, closeDrawer } = useShopNavDrawer();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const displayName = user?.name || "Pengunjung";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const memberId = user?.username || user?.id?.slice(0, 8).toUpperCase();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const navItems = [
    ...PUBLIC_NAV_ITEMS,
    ...(isAdmin
      ? [
          ...ADMIN_NAV_ITEMS,
          ...(user?.role === "SUPERADMIN" ? SUPERADMIN_NAV_ITEMS : []),
        ]
      : PROFILE_NAV_ITEMS),
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] mx-auto h-dvh w-full max-w-[430px] overflow-hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={closeDrawer}
        className={cn(
          "absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        id="nav-drawer"
        aria-hidden={!open}
        aria-label="Menu navigasi"
        className={cn(
          "pointer-events-auto absolute left-0 top-0 z-10 flex h-full w-[85%] max-w-[365px] flex-col overflow-hidden bg-surface-container-lowest shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex items-center gap-4 bg-primary p-gutter pb-6 pr-14 pt-12 text-on-primary">
          <button
            type="button"
            onClick={closeDrawer}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
            aria-label="Close menu"
          >
            <MaterialSymbol name="close" className="text-[28px]" />
          </button>
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-on-primary/20 bg-primary-fixed font-headline-md text-primary">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span aria-hidden="true">{initials}</span>
              )}
            </div>
            {status === "authenticated" ? (
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-primary bg-status-ready" />
            ) : null}
          </div>
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate font-headline-md text-headline-md">
              {status === "loading" ? "Memuat akun…" : displayName}
            </h2>
            <p className="font-label-technical text-label-technical uppercase tracking-wider opacity-80">
              {memberId ? `ID: ${memberId}` : "Masuk untuk melihat akun"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map(({ href, label, icon, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeDrawer}
                  className={cn(
                    "flex items-center gap-4 rounded-xl p-component-padding transition-colors",
                    active
                      ? "bg-primary-fixed text-on-primary-fixed-variant"
                      : "text-on-surface-variant hover:bg-surface-container"
                  )}
                >
                  <MaterialSymbol name={icon} fill={active && icon === "home"} />
                  <span className="font-button-text text-button-text">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="bg-surface-container-low p-4">
          {status === "authenticated" ? (
            <DrawerLogoutButton onDone={closeDrawer} />
          ) : (
            <Link
              href="/profile"
              onClick={closeDrawer}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-primary p-component-padding font-button-text text-button-text text-on-primary transition-all active:scale-[0.98]"
            >
              <MaterialSymbol name="login" />
              Login / Register
            </Link>
          )}
          <p className="mt-3 text-center font-label-technical text-[10px] uppercase tracking-widest text-outline">
            MesinBagus v2.4.0
          </p>
        </div>
      </aside>
    </div>
  );
}
