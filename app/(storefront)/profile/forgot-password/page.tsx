"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FieldError, FormAlert } from "@/components/ui/form-feedback";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export default function ForgotPasswordPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setEmailError("");
    setResetUrl("");
    setMessage("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Masukkan email yang valid.");
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        resetUrl?: string;
      };
      if (!response.ok) {
        setError(result.error ?? "Gagal memproses permintaan.");
        return;
      }
      setMessage(result.message ?? "Permintaan diproses.");
      if (result.resetUrl) setResetUrl(result.resetUrl);
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
          Kembali ke login
        </Link>
        <h1 className="font-headline-md text-headline-md text-primary">Lupa Kata Sandi</h1>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          Masukkan email akun pembeli. Kami siapkan tautan untuk mengatur ulang kata sandi.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="block space-y-1">
            <span className="ml-1 text-label-technical text-on-surface-variant">EMAIL</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              className="h-12 w-full rounded-lg bg-surface-container-lowest px-4 outline-none ring-primary/20 focus:ring-2"
            />
            <FieldError message={emailError} />
          </label>
          <FormAlert message={error} />
          {message ? (
            <p className="rounded-xl bg-secondary-container/40 p-3 text-body-sm text-on-surface">
              {message}
            </p>
          ) : null}
          {resetUrl ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-body-sm">
              <p className="mb-2 font-medium text-primary">Tautan reset (berlaku 1 jam):</p>
              <Link href={resetUrl} className="break-all text-primary underline">
                {resetUrl}
              </Link>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-button-text text-on-primary disabled:opacity-60"
          >
            {busy ? "Memproses…" : "Kirim Tautan Reset"}
          </button>
        </form>
      </div>
    </main>
  );
}
