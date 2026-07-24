import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRole } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user && isAdminRole(session.user.role)) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Indah Mesin
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            Admin
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Masuk untuk mengelola katalog dan pengguna.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Marketplace pengguna ada di{" "}
          <a href="/beranda-artikel" className="text-zinc-600 underline-offset-2 hover:underline">
            beranda
          </a>
          .
        </p>
      </div>
    </div>
  );
}
