import Link from "next/link";

import type { AdminModuleSummary } from "@/types/admin/marketplace-module";

import type { LucideIcon } from "lucide-react";

import {

  Package,

  FolderTree,

  Newspaper,

  HelpCircle,

  Shield,

  Building2,

  ClipboardList,

  Files,

  UserRoundX,

} from "lucide-react";

import type { AdminModuleKey } from "@/types/admin/marketplace-module";



const iconByKey: Record<AdminModuleKey, LucideIcon> = {

  products: Package,

  categories: FolderTree,

  companies: Building2,

  customers: UserRoundX,

  orders: ClipboardList,

  documents: Files,

  articles: Newspaper,

  faq: HelpCircle,

  admin: Shield,

};



export function ModuleSummaryTable({

  modules,

  startIndex = 0,

}: {

  modules: AdminModuleSummary[];

  startIndex?: number;

}) {

  return (

    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">

      <div className="border-b border-neutral-100 px-6 py-4">

        <h2 className="text-base font-semibold text-neutral-900">Ringkasan Modul</h2>

        <p className="mt-1 text-xs text-neutral-500">

          Kolom &quot;Di toko&quot; = jumlah yang sama dengan sumber data halaman user.

        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[640px] text-left text-sm">

          <thead>

            <tr className="border-b border-neutral-100 bg-neutral-50/80">

              <th className="w-14 px-6 py-3 font-medium text-neutral-500">No</th>

              <th className="px-6 py-3 font-medium text-neutral-500">Modul</th>

              <th className="px-6 py-3 font-medium text-neutral-500">Di toko</th>

              <th className="px-6 py-3 font-medium text-neutral-500">Total DB</th>

              <th className="px-6 py-3 font-medium text-neutral-500">Kelola</th>

              <th className="px-6 py-3 font-medium text-neutral-500">Preview user</th>

            </tr>

          </thead>

          <tbody className="divide-y divide-neutral-100">

            {modules.map((mod, index) => {

              const Icon = iconByKey[mod.key];

              return (

                <tr key={mod.key} className="hover:bg-neutral-50/50">

                  <td className="px-6 py-4 tabular-nums text-neutral-500">

                    {startIndex + index + 1}

                  </td>

                  <td className="px-6 py-4">

                    <span className="inline-flex items-center gap-2 font-medium text-neutral-900">

                      <Icon className="h-4 w-4 text-neutral-400" strokeWidth={1.75} />

                      {mod.label}

                    </span>

                    <p className="mt-0.5 max-w-xs text-xs text-neutral-400">{mod.stitchScreenTitle}</p>

                  </td>

                  <td className="px-6 py-4 tabular-nums font-medium text-neutral-900">

                    {mod.shopVisibleCount}

                  </td>

                  <td className="px-6 py-4 tabular-nums text-neutral-600">

                    {mod.databaseTotal}

                  </td>

                  <td className="px-6 py-4">

                    <Link

                      href={mod.adminHref}

                      className="font-medium text-neutral-900 underline-offset-2 hover:underline"

                    >

                      Buka halaman

                    </Link>

                  </td>

                  <td className="px-6 py-4">

                    {mod.shopHref ? (

                      <Link

                        href={mod.shopHref}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"

                      >

                        {mod.shopHref}

                      </Link>

                    ) : (

                      <span className="text-neutral-400">—</span>

                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </section>

  );

}

