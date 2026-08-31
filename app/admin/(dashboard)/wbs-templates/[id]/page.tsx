import { notFound } from "next/navigation";

import {
  createWbsTemplateItem,
  deleteWbsTemplateItem,
  updateWbsTemplate,
  updateWbsTemplateItem,
} from "@/lib/admin-order-progress";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import {
  WbsTemplateEditDialog,
  WbsTemplateItemCreateDialog,
  WbsTemplateItemEditDialog,
} from "@/components/admin/admin-wbs-crud";
import { AdminActionGroup, AdminBackLink, AdminPageToolbar } from "@/components/admin/admin-icon-actions";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminWbsTemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = await prisma.wbsTemplate.findUnique({
    where: { id },
    include: {
      items: {
        where: { parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          children: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
  if (!template) notFound();

  return (
    <>
      <AdminPageToolbar>
        <AdminBackLink href="/admin/wbs-templates" title="Kembali ke daftar template" />
        <WbsTemplateEditDialog row={template} updateAction={updateWbsTemplate} />
        <WbsTemplateItemCreateDialog
          templateId={template.id}
          createAction={createWbsTemplateItem}
        />
      </AdminPageToolbar>
      <AdminPageHeader
        title={template.name}
        description={`Estimasi ${template.estimatedDays} hari · ${template.active ? "Aktif" : "Nonaktif"}`}
      />

      {template.description ? (
        <p className="mb-6 max-w-2xl text-sm text-neutral-600">{template.description}</p>
      ) : null}

      <div className="space-y-4">
        {template.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            Belum ada fase. Tambah parent dulu (contoh: &quot;Mengerjakan Boiler&quot;), lalu sub-tugas
            (contoh: &quot;Cover boiler&quot;).
          </div>
        ) : (
          template.items.map((parent, idx) => (
            <div
              key={parent.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Fase {idx + 1}
                  </p>
                  <h3 className="font-semibold text-neutral-900">{parent.title}</h3>
                </div>
                <AdminActionGroup>
                  <WbsTemplateItemCreateDialog
                    templateId={template.id}
                    parentId={parent.id}
                    parentTitle={parent.title}
                    createAction={createWbsTemplateItem}
                  />
                  <WbsTemplateItemEditDialog
                    row={parent}
                    updateAction={updateWbsTemplateItem}
                  />
                  <AdminDeleteButton
                    action={async () => {
                      "use server";
                      await deleteWbsTemplateItem(parent.id);
                    }}
                  />
                </AdminActionGroup>
              </div>
              <ul className="divide-y divide-neutral-100">
                {parent.children.length === 0 ? (
                  <li className="px-5 py-4 text-sm text-neutral-400">
                    Belum ada sub-tugas — bobot penuh fase akan dihitung sebagai leaf.
                  </li>
                ) : (
                  parent.children.map((child) => (
                    <li
                      key={child.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{child.title}</p>
                        <p className="text-xs text-neutral-500">
                          Estimasi {child.estimatedHours ?? 8} jam
                        </p>
                      </div>
                      <AdminActionGroup>
                        <WbsTemplateItemEditDialog
                          row={child}
                          updateAction={updateWbsTemplateItem}
                        />
                        <AdminDeleteButton
                          action={async () => {
                            "use server";
                            await deleteWbsTemplateItem(child.id);
                          }}
                        />
                      </AdminActionGroup>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
}
