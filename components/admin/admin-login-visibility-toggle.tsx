"use client";

import { useTransition } from "react";
import { adminToast } from "@/lib/admin/admin-toast";
import { setAdminLoginVisible } from "@/lib/admin-actions";

export function AdminLoginVisibilityToggle({ visible }: { visible: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-neutral-900">Login admin (/admin/login)</p>
        <p className="mt-1 text-xs text-neutral-500">
          Sembunyikan halaman login publik. Superadmin tetap bisa buka dengan menambahkan{" "}
          <code className="rounded bg-neutral-100 px-1">?access=nilai-dari-env</code> pada URL
          login, misalnya{" "}
          <code className="rounded bg-neutral-100 px-1">
            /admin/login?access=rahasia123
          </code>{" "}
          jika <code className="rounded bg-neutral-100 px-1">ADMIN_LOGIN_ACCESS_KEY=rahasia123</code>{" "}
          di file <code className="rounded bg-neutral-100 px-1">.env</code>.
        </p>
        <p className="mt-1 text-xs font-medium text-neutral-700">
          Status sekarang:{" "}
          <span className={visible ? "text-emerald-700" : "text-amber-700"}>
            {visible ? "Terlihat" : "Disembunyikan"}
          </span>
        </p>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            try {
              await setAdminLoginVisible(!visible);
              adminToast.success(
                !visible ? "Login admin ditampilkan kembali" : "Login admin disembunyikan"
              );
            } catch (err) {
              adminToast.error(err instanceof Error ? err.message : "Gagal mengubah status");
            }
          });
        }}
        className="shrink-0 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : visible ? "Sembunyikan login" : "Tampilkan login"}
      </button>
    </div>
  );
}
