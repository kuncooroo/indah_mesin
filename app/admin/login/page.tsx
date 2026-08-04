import { redirect } from "next/navigation";
import { getAdminSession, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

type PageProps = {
  searchParams: Promise<{ access?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const session = await getAdminSession();
  if (session?.user && isAdminRole(session.user.role)) {
    redirect("/admin/dashboard");
  }

  const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  const loginVisible = settings?.adminLoginVisible ?? true;
  const { access } = await searchParams;
  const accessKey = process.env.ADMIN_LOGIN_ACCESS_KEY?.trim();
  const unlockedByKey = Boolean(accessKey && access === accessKey);

  if (!loginVisible && !unlockedByKey) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-zinc-900">Login admin disembunyikan</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Halaman ini sedang nonaktif. Superadmin dapat mengaktifkannya lagi dari dashboard, atau
            buka dengan parameter akses rahasia.
          </p>
          <a
            href="/beranda-artikel"
            className="mt-6 inline-block text-sm font-medium text-zinc-700 underline-offset-2 hover:underline"
          >
            Kembali ke marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Indah Mesin
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Admin</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Masuk untuk mengelola katalog dan pengguna.
          </p>
          {!loginVisible && unlockedByKey ? (
            <p className="mt-2 text-xs text-amber-700">Akses via kunci rahasia (login disembunyikan).</p>
          ) : null}
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
