import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber, type AdminListParams } from "@/lib/admin/list-params";
import { buyerRoles } from "@/lib/buyer-roles";
import {
  updateCompany,
  deleteCompany,
  createCompanyAddress,
  updateCompanyAddress,
  deleteCompanyAddress,
  updateCustomer,
  deleteCustomer,
} from "@/lib/admin-crud";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCompanyTabs, type CompanyAdminTab } from "@/components/admin/admin-company-tabs";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import {
  CompanyEditDialog,
  CompanyAddressCreateDialog,
  CompanyAddressEditDialog,
} from "@/components/admin/admin-company-crud";
import { CustomerEditDialog } from "@/components/admin/admin-entity-crud";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseTab(raw: string | string[] | undefined): CompanyAdminTab {
  const v = typeof raw === "string" ? raw : "detail";
  if (v === "addresses" || v === "pic") return v;
  return "detail";
}

export default async function AdminCompanyDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const tab = parseTab(sp.tab);
  const listParams = parseAdminListParams(sp);

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true, addresses: true, orders: true } },
    },
  });

  if (!company) notFound();

  const companyOptions = [{ id: company.id, label: company.companyName }];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={company.companyName}
        description="Manajemen perusahaan — detail PT, alamat pabrik, dan PIC pengguna."
      />

      <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-neutral-100" />}>
        <AdminCompanyTabs companyId={company.id} />
      </Suspense>

      {tab === "detail" ? (
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-neutral-500">Tipe</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-900">{company.type}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-neutral-500">Verifikasi</dt>
              <dd className="mt-1 text-sm">
                {company.isVerified ? (
                  <span className="text-emerald-700">Verified</span>
                ) : (
                  <span className="text-neutral-400">Belum</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-neutral-500">NPWP</dt>
              <dd className="mt-1 font-mono text-sm">{company.npwpNumber ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-neutral-500">NIB</dt>
              <dd className="mt-1 font-mono text-sm">{company.nibNumber ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-neutral-500">Alamat</dt>
              <dd className="mt-1 text-sm">{company._count.addresses} lokasi</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-neutral-500">PIC</dt>
              <dd className="mt-1 text-sm">{company._count.users} pengguna</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-neutral-500">Order / PO</dt>
              <dd className="mt-1 text-sm">{company._count.orders} transaksi</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <CompanyEditDialog row={company} updateAction={updateCompany} />
            <AdminDeleteButton
              action={async () => {
                "use server";
                await deleteCompany(company.id);
              }}
            />
            <Link
              href={`/admin/companies/${company.id}?tab=addresses`}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Kelola alamat
            </Link>
            <Link
              href={`/admin/companies/${company.id}?tab=pic`}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Kelola PIC
            </Link>
          </div>
        </section>
      ) : null}

      {tab === "addresses" ? (
        <CompanyAddressesSection companyId={company.id} listParams={listParams} q={listParams.q} />
      ) : null}

      {tab === "pic" ? (
        <CompanyPicSection
          companyId={company.id}
          companyOptions={companyOptions}
          listParams={listParams}
          q={listParams.q}
        />
      ) : null}
    </div>
  );
}

async function CompanyAddressesSection({
  companyId,
  listParams,
  q,
}: {
  companyId: string;
  listParams: AdminListParams;
  q: string;
}) {
  const where: Prisma.CompanyAddressWhereInput = {
    companyId,
    ...(q
      ? {
          OR: [{ label: { contains: q } }, { city: { contains: q } }, { addressDetail: { contains: q } }],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.companyAddress.count({ where }),
    prisma.companyAddress.findMany({
      where,
      orderBy: { label: "asc" },
      skip: listParams.skip,
      take: listParams.pageSize,
    }),
  ]);

  const basePath = `/admin/companies/${companyId}?tab=addresses`;

  return (
    <AdminListShell
      basePath={basePath}
      q={q}
      page={listParams.page}
      pageSize={listParams.pageSize}
      total={total}
      searchPlaceholder="Cari label, kota…"
      createAction={
        <CompanyAddressCreateDialog createAction={createCompanyAddress} fixedCompanyId={companyId} />
      }
    >
      <AdminTableWrap>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50/80">
            <tr>
              <AdminThNo />
              <th className="px-6 py-3 font-medium text-neutral-500">Label</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Alamat</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Kota</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Utama</th>
              <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((a, i) => (
              <tr key={a.id}>
                <AdminTdNo n={rowNumber(i, listParams)} />
                <td className="px-6 py-3 font-medium">{a.label}</td>
                <td className="max-w-xs truncate px-6 py-3 text-neutral-600">{a.addressDetail}</td>
                <td className="px-6 py-3">{a.city}</td>
                <td className="px-6 py-3">{a.isPrimary ? "Ya" : "—"}</td>
                <AdminActionCell>
                  <CompanyAddressEditDialog row={a} updateAction={updateCompanyAddress} />
                  <AdminDeleteButton
                    action={async () => {
                      "use server";
                      await deleteCompanyAddress(a.id);
                    }}
                  />
                </AdminActionCell>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableWrap>
    </AdminListShell>
  );
}

async function CompanyPicSection({
  companyId,
  companyOptions,
  listParams,
  q,
}: {
  companyId: string;
  companyOptions: { id: string; label: string }[];
  listParams: AdminListParams;
  q: string;
}) {
  const where: Prisma.UserWhereInput = {
    role: { in: buyerRoles },
    companyId,
    ...(q
      ? {
          OR: [
            { username: { contains: q } },
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: listParams.skip,
      take: listParams.pageSize,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        companyName: true,
        customBuyerId: true,
        verificationStatus: true,
      },
    }),
  ]);

  const basePath = `/admin/companies/${companyId}?tab=pic`;

  return (
    <AdminListShell
      basePath={basePath}
      q={q}
      page={listParams.page}
      pageSize={listParams.pageSize}
      total={total}
      searchPlaceholder="Cari nama, email, WA…"
    >
      <AdminTableWrap>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50/80">
            <tr>
              <AdminThNo />
              <th className="px-6 py-3 font-medium text-neutral-500">PIC</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Email / WA</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Role</th>
              <th className="px-6 py-3 text-right font-medium text-neutral-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((u, i) => (
              <tr key={u.id}>
                <AdminTdNo n={rowNumber(i, listParams)} />
                <td className="px-6 py-3 font-medium">{u.name ?? u.username ?? "—"}</td>
                <td className="px-6 py-3 text-xs">
                  <div>{u.email}</div>
                  <div className="text-neutral-500">{u.phone ?? "—"}</div>
                </td>
                <td className="px-6 py-3">{u.role}</td>
                <AdminActionCell>
                  <CustomerEditDialog row={u} companies={companyOptions} updateAction={updateCustomer} />
                  <AdminDeleteButton
                    action={async () => {
                      "use server";
                      await deleteCustomer(u.id);
                    }}
                  />
                </AdminActionCell>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableWrap>
    </AdminListShell>
  );
}
