"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { MaterialSymbol } from "@/components/ui/material-symbol";

export function ProfileLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    if (busy) return;
    if (!window.confirm("Are you sure you want to logout?")) return;
    setBusy(true);
    await signOut({ redirect: false });
    router.push("/beranda-artikel");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className="group mt-4 flex w-full items-center rounded-xl bg-error-container/20 p-4 text-left transition-colors hover:bg-error-container/40 disabled:opacity-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full text-error transition-transform group-hover:scale-110">
        <MaterialSymbol name="logout" />
      </div>
      <div className="ml-4 flex-1">
        <div className="font-button-text text-button-text text-error">
          {busy ? "Logging out..." : "Logout"}
        </div>
        <div className="font-body-sm text-body-sm text-error/70">Keluar dari Akun</div>
      </div>
    </button>
  );
}
