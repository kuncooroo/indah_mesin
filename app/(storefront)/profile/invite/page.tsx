"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { FieldError, FormAlert, inputErrorClass } from "@/components/ui/form-feedback";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <main className="bg-background px-margin-mobile py-16 text-on-surface-variant">
          Memuat undangan…
        </main>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}

function AcceptInviteForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [info, setInfo] = useState<{
    name: string;
    email: string;
    companyName: string;
    position: string | null;
  } | null>(null);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) {
      setLoadError("Token undangan tidak ditemukan.");
      return;
    }
    void fetch(`/api/profile/invite/accept?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Undangan tidak valid.");
        setInfo(result);
      })
      .catch((reason: unknown) => {
        setLoadError(reason instanceof Error ? reason.message : "Undangan tidak valid.");
      });
  }, [token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!info) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    const nextErrors: Record<string, string> = {};
    if (password.length < 8) nextErrors.password = "Kata sandi minimal 8 karakter.";
    if (password !== confirm) nextErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/profile/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = (await response.json()) as { error?: string; email?: string };
      if (!response.ok) {
        setError(result.error ?? "Gagal menerima undangan.");
        return;
      }
      await signIn("credentials", {
        username: result.email ?? info.email,
        password,
        portal: "storefront",
        redirect: false,
      });
      router.push("/profile");
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bg-background pb-16 pt-8">
      <div className="mx-auto flex w-full max-w-md flex-col px-margin-mobile">
        <Link href="/profile" className="mb-6 inline-flex items-center gap-1 text-sm text-primary">
          <MaterialSymbol name="arrow_back" className="text-[18px]" />
          Ke login
        </Link>
        <h1 className="font-headline-md text-headline-md text-primary">Terima Undangan Tim</h1>
        {loadError ? <FormAlert message={loadError} /> : null}
        {info ? (
          <>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Anda diundang ke <span className="font-semibold text-on-surface">{info.companyName}</span>{" "}
              sebagai {info.position || "anggota tim"}.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <label className="block space-y-1">
                <span className="text-label-technical text-on-surface-variant">NAMA</span>
                <input
                  readOnly
                  value={info.name}
                  className="h-12 w-full rounded-lg bg-surface-container px-4 opacity-80"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-label-technical text-on-surface-variant">EMAIL</span>
                <input
                  readOnly
                  value={info.email}
                  className="h-12 w-full rounded-lg bg-surface-container px-4 opacity-80"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-label-technical text-on-surface-variant">BUAT KATA SANDI</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className={cn(
                    "h-12 w-full rounded-lg border border-transparent bg-surface-container-lowest px-4 outline-none focus:ring-2 focus:ring-primary/20",
                    inputErrorClass(Boolean(fieldErrors.password))
                  )}
                />
                <FieldError message={fieldErrors.password} />
              </label>
              <label className="block space-y-1">
                <span className="text-label-technical text-on-surface-variant">KONFIRMASI</span>
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={cn(
                    "h-12 w-full rounded-lg border border-transparent bg-surface-container-lowest px-4 outline-none focus:ring-2 focus:ring-primary/20",
                    inputErrorClass(Boolean(fieldErrors.confirmPassword))
                  )}
                />
                <FieldError message={fieldErrors.confirmPassword} />
              </label>
              <FormAlert message={error} />
              <button
                type="submit"
                disabled={busy}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-button-text text-on-primary disabled:opacity-60"
              >
                {busy ? "Memproses…" : "Gabung & Masuk"}
              </button>
            </form>
          </>
        ) : null}
      </div>
    </main>
  );
}
