"use client";

import { getProviders, signIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

export function ProfileAuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    void getProviders().then((providers) => {
      setGoogleEnabled(Boolean(providers?.google));
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    if (mode === "register") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Registration failed.");
        setBusy(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      username: email,
      password,
      redirect: false,
      callbackUrl: "/profile",
    });
    if (result?.ok) {
      window.location.assign("/profile");
      return;
    }
    setError("Invalid email or password.");
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-background px-margin-mobile pb-24 pt-10">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-sm">
            <MaterialSymbol name="precision_manufacturing" className="text-[48px] text-primary" />
          </div>
          <h1 className="mt-4 font-headline-lg-mobile text-headline-lg-mobile text-primary">
            MesinBagus
          </h1>
          <p className="text-body-sm text-on-surface-variant">Industrial Procurement Excellence</p>
        </div>

        <section className="rounded-xl bg-surface-container-low p-4 shadow-sm">
          <div className="mb-6 flex rounded-lg bg-surface-container-highest p-1">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMode(tab);
                  setError("");
                }}
                className={cn(
                  "flex-1 rounded-md py-2 font-button-text capitalize",
                  mode === tab
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" ? (
              <label className="block">
                <span className="mb-1 block font-label-technical text-xs uppercase text-on-surface-variant">
                  Full Name
                </span>
                <input
                  name="name"
                  required
                  minLength={2}
                  className="h-12 w-full rounded-lg bg-white px-4 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            ) : null}
            <label className="block">
              <span className="mb-1 block font-label-technical text-xs uppercase text-on-surface-variant">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                className="h-12 w-full rounded-lg bg-white px-4 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="name@company.com"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-label-technical text-xs uppercase text-on-surface-variant">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="h-12 w-full rounded-lg bg-white px-4 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Minimum 8 characters"
              />
            </label>
            {error ? <p className="text-body-sm text-error">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary font-button-text text-white disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              <MaterialSymbol name={mode === "login" ? "arrow_forward" : "person_add"} />
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant" />
            <span className="text-xs uppercase text-outline">or</span>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>
          <button
            type="button"
            disabled={googleEnabled !== true || busy}
            onClick={() => signIn("google", { callbackUrl: "/profile" })}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-border-subtle bg-white font-button-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-lg font-bold text-[#4285F4]">G</span>
            Continue with Google
          </button>
          {googleEnabled === false ? (
            <p className="mt-2 text-center text-xs text-on-surface-variant">
              Google login is not active in the current server process. Restart the Next.js server
              after updating the OAuth environment variables.
            </p>
          ) : googleEnabled === null ? (
            <p className="mt-2 text-center text-xs text-on-surface-variant">
              Checking Google login availability…
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
