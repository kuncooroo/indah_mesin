"use client";

import { useState, useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { adminToast } from "@/lib/admin/admin-toast";

export function AdminLogoutButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      await signOut({ callbackUrl: "/admin/login", redirect: true });
      adminToast.success("Anda telah keluar.");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </button>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Batal"
            onClick={() => !pending && setOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-neutral-900">Keluar dari admin?</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={pending}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
                onClick={() => setOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
                onClick={onConfirm}
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {pending ? "Keluar…" : "Ya, keluar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
