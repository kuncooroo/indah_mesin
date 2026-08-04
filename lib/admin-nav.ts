import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Newspaper,
  HelpCircle,
  Shield,
  Building2,
  ClipboardList,
  Files,
  Store,
  Globe,
  Settings,
  UserRoundX,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  superOnly?: boolean;
  /** Match nested routes (e.g. /admin/companies/[id]) */
  matchPrefix?: boolean;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: AdminNavItem[];
};

export const adminNavDashboard: AdminNavItem = {
  href: "/admin/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "catalog",
    label: "Transaksi & Katalog",
    icon: Store,
    items: [
      { href: "/admin/products", label: "Produk", icon: Package, matchPrefix: true },
      { href: "/admin/categories", label: "Kategori", icon: FolderTree, matchPrefix: true },
      { href: "/admin/orders", label: "Order / PO", icon: ClipboardList, matchPrefix: true },
      { href: "/admin/documents", label: "Dokumen", icon: Files, matchPrefix: true },
    ],
  },
  {
    id: "entities",
    label: "Manajemen Entitas",
    icon: Building2,
    items: [
      {
        href: "/admin/companies",
        label: "Perusahaan",
        icon: Building2,
        matchPrefix: true,
      },
      {
        href: "/admin/customers",
        label: "User tanpa perusahaan",
        icon: UserRoundX,
        matchPrefix: true,
      },
    ],
  },
  {
    id: "content",
    label: "Konten Web",
    icon: Globe,
    items: [
      { href: "/admin/articles", label: "Artikel", icon: Newspaper, matchPrefix: true },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle, matchPrefix: true },
    ],
  },
  {
    id: "system",
    label: "Sistem",
    icon: Settings,
    items: [
      {
        href: "/admin/users",
        label: "Pengaturan Admin",
        icon: Shield,
        superOnly: true,
        matchPrefix: true,
      },
    ],
  },
];

/** Flat list for backwards compatibility (dashboard icons, etc.) */
export const adminNavItems: AdminNavItem[] = [
  adminNavDashboard,
  ...adminNavGroups.flatMap((g) => g.items),
];

export type AdminModuleRow = {
  label: string;
  href: string;
  count: number;
  icon: LucideIcon;
};
