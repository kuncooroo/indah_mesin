"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Ms } from "@/components/stitch/ms";
import { shopNavUser } from "@/lib/profile-demo-data";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  match: (path: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
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

  function handleLogout() {
    if (busy) return;
    if (!window.confirm("Keluar dari akun IndustrialX?")) return;
    setBusy(true);
    window.setTimeout(() => {
      onDone();
      router.push("/beranda-artikel");
      router.refresh();
      setBusy(false);
    }, 400);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className="flex w-full items-center justify-center gap-3 rounded-full bg-error-container p-component-padding font-button-text text-button-text text-on-error-container transition-all hover:bg-error/10 active:scale-[0.98] disabled:opacity-50"
    >
      <Ms name="logout" />
      {busy ? "Logging out..." : "Logout"}
    </button>
  );
}

function ShopNavDrawerPanel() {
  const { open, closeDrawer } = useShopNavDrawer();
  const pathname = usePathname();

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
            <Ms name="close" className="text-[28px]" />
          </button>
          <div className="relative shrink-0">
            <Image
              src={shopNavUser.avatar}
              alt={shopNavUser.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border-2 border-on-primary/20 object-cover"
            />
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-primary bg-status-ready" />
          </div>
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate font-headline-md text-headline-md">{shopNavUser.name}</h2>
            <p className="font-label-technical text-label-technical uppercase tracking-wider opacity-80">
              ID: {shopNavUser.memberId}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {NAV_ITEMS.map(({ href, label, icon, match }) => {
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
                  <Ms name={icon} fill={active && icon === "home"} />
                  <span className="font-button-text text-button-text">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="bg-surface-container-low p-4">
          <DrawerLogoutButton onDone={closeDrawer} />
          <p className="mt-3 text-center font-label-technical text-[10px] uppercase tracking-widest text-outline">
            IndustrialX v2.4.0
          </p>
        </div>
      </aside>
    </div>
  );
}
