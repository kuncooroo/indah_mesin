"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAppPopup } from "@/components/ui/app-popup";
import { FieldError, FieldHint, inputErrorClass } from "@/components/ui/form-feedback";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-background px-margin-mobile py-16 text-on-surface-variant">
          Loading…
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { showError, showSuccess } = useAppPopup();
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    const nextErrors: Record<string, string> = {};
    if (!token) nextErrors.token = "Reset token is missing.";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (password !== confirm) nextErrors.confirmPassword = "Passwords do not match.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showError("Please fix the highlighted fields.");
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        showError(result.error ?? "Could not reset password.");
        return;
      }
      showSuccess("Password updated successfully.");
      router.push("/profile?reset=1");
    } catch {
      showError("Connection problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bg-background pb-16 pt-8">
      <div className="mx-auto flex w-full max-w-md flex-col px-margin-mobile">
        <Link href="/profile" className="mb-6 inline-flex items-center gap-1 text-sm text-primary">
          <MaterialSymbol name="arrow_back" className="text-[18px]" />
          Back to login
        </Link>
        <h1 className="font-headline-md text-headline-md text-primary">Reset Password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <FieldError message={fieldErrors.token} />
          <label className="block space-y-1">
            <span className="ml-1 text-label-technical text-on-surface-variant">NEW PASSWORD</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              className={cn(
                "h-12 w-full rounded-lg border border-transparent bg-surface-container-lowest px-4 outline-none focus:ring-2 focus:ring-primary/20",
                inputErrorClass(Boolean(fieldErrors.password))
              )}
            />
            <FieldHint message="Use at least 8 characters." />
            <FieldError message={fieldErrors.password} />
          </label>
          <label className="block space-y-1">
            <span className="ml-1 text-label-technical text-on-surface-variant">
              CONFIRM PASSWORD
            </span>
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
          <button
            type="submit"
            disabled={busy}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-button-text text-on-primary disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
