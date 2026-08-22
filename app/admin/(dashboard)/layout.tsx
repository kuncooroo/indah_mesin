import { AdminShell } from "@/components/admin/admin-shell";

/** Admin CRUD prioritizes freshness over aggressive caching. */
export const dynamic = "force-dynamic";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
