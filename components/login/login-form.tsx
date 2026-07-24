"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Ms } from "@/components/stitch/ms";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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

    toast.success("Login berhasil");

    const res = await fetch("/api/auth/session");
    const session = (await res.json()) as {
      user?: { role?: string; name?: string };
    };
    const role = session.user?.role;

    if (role === "ADMIN" || role === "SUPERADMIN") {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/beranda-artikel";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-on-surface-variant">
          Username
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="user / admin / superadmin"
          autoComplete="username"
          required
          className="h-11 border-border-subtle bg-surface-container-low"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-on-surface-variant">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="h-11 border-border-subtle bg-surface-container-low pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            <Ms name={showPassword ? "visibility_off" : "visibility"} />
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-primary font-semibold text-on-primary hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Ms name="progress_activity" className="mr-2 animate-spin text-lg" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </Button>
    </form>
  );
}
