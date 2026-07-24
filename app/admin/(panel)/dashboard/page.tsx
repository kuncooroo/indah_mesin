import { getAdminDashboardSummary } from "@/services/admin/get-dashboard-summary";
import { ModuleSummaryTable } from "@/features/admin/components/module-summary-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminListShell } from "@/components/admin/admin-list-shell";
import { parseAdminListParams } from "@/lib/admin/list-params";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = parseAdminListParams(await searchParams);
  let modules = await getAdminDashboardSummary();

  if (params.q) {
    const q = params.q.toLowerCase();
    modules = modules.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.stitchScreenTitle.toLowerCase().includes(q) ||
        m.adminHref.toLowerCase().includes(q)
    );
  }

  const total = modules.length;
  const pageModules = modules.slice(params.skip, params.skip + params.pageSize);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Ringkasan modul — search & pagination."
      />
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
