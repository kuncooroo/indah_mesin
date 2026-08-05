"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAppPopup } from "@/components/ui/app-popup";
import { FieldError, FieldHint, FormAlert } from "@/components/ui/form-feedback";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export default function ForgotPasswordPage() {
  const { showSuccess, showError } = useAppPopup();
  const [busy, setBusy] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setEmailError("");
    setResetUrl("");
    setMessage("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address.");
      showError("Please fix the highlighted fields.");
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
        showError(result.error ?? "Could not process your request.");
        return;
      }
      setMessage(result.message ?? "Request processed.");
      if (result.resetUrl) setResetUrl(result.resetUrl);
      showSuccess(result.message ?? "If the email exists, a reset link has been sent.");
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
        <h1 className="font-headline-md text-headline-md text-primary">Forgot Password</h1>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          Enter your buyer account email (including Google email). We will send a reset link to that
          address.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="block space-y-1">
            <span className="ml-1 text-label-technical text-on-surface-variant">EMAIL</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@gmail.com"
              className="h-12 w-full rounded-lg bg-surface-container-lowest px-4 outline-none ring-primary/20 focus:ring-2"
            />
            <FieldHint message="Use the email registered on your account." />
            <FieldError message={emailError} />
          </label>
          {message ? <FormAlert message={message} tone="success" /> : null}
          {resetUrl ? (
            <div className="rounded-xl border border-status-indent/30 bg-status-indent/10 p-3 text-body-sm">
              <p className="mb-2 font-medium text-status-indent">
                Development mode — SMTP is not configured. Use this link:
              </p>
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
            {busy ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      </div>
    </main>
  );
}
