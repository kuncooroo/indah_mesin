"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // SessionProvider admin memakai basePath `/api/admin/auth`
    const result = await signIn("credentials", {
      username: username.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Username atau password salah");
      return;
    }

    const res = await fetch("/api/admin/auth/session");
    const session = (await res.json()) as { user?: { role?: string } };
    const role = session.user?.role;

    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      toast.error("Akun ini bukan admin. Gunakan halaman marketplace.");
      await signOut({ redirect: false });
      return;
    }

    toast.success("Login berhasil");
    window.location.href = "/admin/dashboard";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="admin-username" className="mb-1.5 block text-sm font-medium text-zinc-700">
          Username
        </label>
        <input
          id="admin-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
          placeholder="admin"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
      >
        {loading ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
