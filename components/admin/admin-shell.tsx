import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isSuper = role === "SUPERADMIN";

  return (
    <div className="flex min-h-dvh bg-neutral-50 font-sans text-neutral-900 antialiased">
      <AdminSidebar
        userName={session?.user?.name ?? session?.user?.username ?? "Admin"}
        userEmail={session?.user?.email ?? `${session?.user?.username ?? "admin"}@indahmesin.com`}
        isSuperAdmin={isSuper}
      />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
