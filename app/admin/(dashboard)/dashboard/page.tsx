import {
  getAdminDashboardSummary,
  getAdminDashboardInsights,
} from "@/services/admin/get-dashboard-summary";
import { ModuleSummaryTable } from "@/components/admin/admin-module-summary-table";
import { AdminDashboardInsights } from "@/components/admin/admin-dashboard-insights";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminListShell } from "@/components/admin/admin-list-shell";
import { AdminLoginVisibilityToggle } from "@/components/admin/admin-login-visibility-toggle";
import { parseAdminListParams } from "@/lib/admin/list-params";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  const [modules, insights, session, settings] = await Promise.all([
    getAdminDashboardSummary(),
    getAdminDashboardInsights(),
    getAdminSession(),
    prisma.siteSetting.findUnique({ where: { id: "default" } }),
  ]);
  const isSuper = session?.user?.role === "SUPERADMIN";
  const adminLoginVisible = settings?.adminLoginVisible ?? true;

  let filtered = modules;
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = modules.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.stitchScreenTitle.toLowerCase().includes(q) ||
        m.adminHref.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const pageModules = filtered.slice(params.skip, params.skip + params.pageSize);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Ringkasan modul — search & pagination."
      />
      {isSuper ? <AdminLoginVisibilityToggle visible={adminLoginVisible} /> : null}
      <AdminDashboardInsights data={insights} />
      <AdminListShell
        basePath="/admin/dashboard"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari modul…"
      >
        <ModuleSummaryTable modules={pageModules} startIndex={params.skip} />
      </AdminListShell>
    </div>
  );
}
