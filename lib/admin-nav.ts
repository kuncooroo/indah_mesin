import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Newspaper,
  MessageSquare,
  HelpCircle,
  FileText,
  Heart,
  Users,
  Shield,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  superOnly?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/articles", label: "Artikel", icon: Newspaper },
  { href: "/admin/reviews", label: "Ulasan", icon: MessageSquare },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/rfq", label: "RFQ", icon: FileText },
  { href: "/admin/favorites", label: "Favorit", icon: Heart },
  { href: "/admin/customers", label: "Pelanggan", icon: Users },
  { href: "/admin/users", label: "Admin", icon: Shield, superOnly: true },
];

export type AdminModuleRow = {
  label: string;
  href: string;
  count: number;
  icon: LucideIcon;
};
