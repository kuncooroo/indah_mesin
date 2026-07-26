import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseAdminListParams, rowNumber } from "@/lib/admin/list-params";
import { createUser, deleteUser } from "@/lib/admin-crud";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminListShell,
  AdminTableWrap,
  AdminThNo,
  AdminTdNo,
  AdminActionCell,
} from "@/components/admin/admin-list-shell";
import { AdminDeleteButton } from "@/components/admin/admin-crud-ui";
import { UserCreateDialog } from "@/components/admin/admin-entity-crud";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/admin/dashboard");
  }

  const params = parseAdminListParams(await searchParams);
  const where: Prisma.UserWhereInput = {
    role: { in: ["ADMIN", "SUPERADMIN"] },
    ...(params.q
      ? {
          OR: [
            { username: { contains: params.q } },
            { name: { contains: params.q } },
            { email: { contains: params.q } },
          ],
        }
      : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: params.skip,
      take: params.pageSize,
      select: { id: true, username: true, name: true, email: true, role: true },
    }),
  ]);

  return (
    <>
      <AdminPageHeader title="Pengaturan Admin" description="Kelola akun admin & superadmin." />
      <AdminListShell
        basePath="/admin/users"
        q={params.q}
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        searchPlaceholder="Cari username, nama, email…"
        createAction={<UserCreateDialog createAction={createUser} />}
      >
        <AdminTableWrap>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/80">
              <tr>
                <AdminThNo />
                <th className="px-4 py-3 font-medium text-zinc-600">Username</th>
                <th className="hidden px-4 py-3 font-medium text-zinc-600 sm:table-cell">Nama</th>
                <th className="hidden px-4 py-3 font-medium text-zinc-600 md:table-cell">Email</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Role</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u, i) => (
                <tr key={u.id}>
                  <AdminTdNo n={rowNumber(i, params)} />
                  <td className="px-4 py-3 font-medium text-zinc-900">{u.username}</td>
                  <td className="hidden px-4 py-3 text-zinc-600 sm:table-cell">{u.name ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-zinc-600 md:table-cell">{u.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <UserRoleSelect
                      userId={u.id}
                      currentRole={u.role}
                      disabled={u.id === session.user.id}
                    />
                  </td>
                  <AdminActionCell>
                    {u.id !== session.user.id ? (
                      <AdminDeleteButton
                        action={async () => {
                          "use server";
                          await deleteUser(u.id);
                        }}
                      />
                    ) : (
                      <span className="text-xs text-neutral-400">—</span>
                    )}
                  </AdminActionCell>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableWrap>
      </AdminListShell>
    </>
  );
}
