"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Factory, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_USERS = [
  { username: "user", password: "Indah@2026", role: "Operator" },
  { username: "admin", password: "Indah@2026", role: "Admin" },
  { username: "superadmin", password: "Indah@2026", role: "Super Admin" },
];

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const user = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem(
        "indah_mesin_session",
        JSON.stringify({ username: user.username, role: user.role })
      );
      toast.success(`Selamat datang, ${user.role}`);
      router.push("/dashboard");
    } else {
      toast.error("Username atau password salah");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-scada-muted">
          Username
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="user / admin / superadmin"
          autoComplete="username"
          required
          className="h-11 border-scada-border bg-scada-elevated text-scada-text placeholder:text-scada-muted/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-scada-muted">
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
            className="h-11 border-scada-border bg-scada-elevated pr-10 text-scada-text placeholder:text-scada-muted/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-scada-muted"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-scada-cyan text-scada-primary font-semibold hover:bg-scada-cyan/90"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Masuk...
          </>
        ) : (
          "Masuk ke SCADA"
        )}
      </Button>

      <div className="rounded-lg border border-scada-border bg-scada-elevated/50 p-3">
        <p className="mb-2 text-[11px] font-medium text-scada-muted">
          Akun demo
        </p>
        <div className="space-y-1 font-mono text-[10px] text-scada-muted">
          <p>user / admin / superadmin</p>
          <p>Password: Indah@2026</p>
        </div>
      </div>
    </form>
  );
}

export function LoginHero() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-scada-cyan/30 bg-scada-cyan/10 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <Factory className="size-8 text-scada-cyan" />
      </div>
      <h1 className="text-2xl font-bold text-scada-text">Indah Mesin</h1>
      <p className="mt-1 text-sm text-scada-muted">
        Industrial SCADA Retort Monitoring
      </p>
    </div>
  );
}
