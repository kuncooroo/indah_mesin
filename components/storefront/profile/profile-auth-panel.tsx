"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProviders, getSession, signIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { UncontrolledPhoneFields } from "@/components/storefront/phone-input";
import { useAppPopup } from "@/components/ui/app-popup";
import { FieldError, FieldHint, inputErrorClass } from "@/components/ui/form-feedback";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { parseStoredPhone, phoneFieldError } from "@/lib/storefront/country-dial-codes";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<
  Record<
    "name" | "companyName" | "identifier" | "phone" | "password" | "confirmPassword" | "terms",
    string
  >
>;

export function ProfileAuthPanel() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const needPo = searchParams.get("need") === "po";
  const resetDone = searchParams.get("reset") === "1";
  const { showError } = useAppPopup();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    void getProviders().then((providers) => {
      setGoogleEnabled(Boolean(providers?.google));
    });
  }, []);

  function validate(form: FormData): FieldErrors {
    const next: FieldErrors = {};
    const identifier = String(form.get(mode === "login" ? "identifier" : "email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!identifier) {
      next.identifier =
        mode === "login" ? "Email or phone number is required." : "Company email is required.";
    } else if (mode === "register" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      next.identifier = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (mode === "register" && password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (mode === "register") {
      const name = String(form.get("name") ?? "").trim();
      const companyName = String(form.get("companyName") ?? "").trim();
      const phone = String(form.get("phone") ?? "").trim();
      const confirmPassword = String(form.get("confirmPassword") ?? "");

      if (name.length < 2) next.name = "Full name must be at least 2 characters.";
      if (companyName.length < 2) next.companyName = "Company name must be at least 2 characters.";
      const phoneErr = phoneFieldError(parseStoredPhone(phone).national, true);
      if (phoneErr) next.phone = phoneErr;
      if (!confirmPassword) {
        next.confirmPassword = "Please confirm your password.";
      } else if (password !== confirmPassword) {
        next.confirmPassword = "Passwords do not match.";
      }
      if (form.get("terms") !== "on") {
        next.terms = "You must agree to the Terms & Conditions and Privacy Policy.";
      }
    }

    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      showError("Please fix the highlighted fields.");
      setBusy(false);
      return;
    }

    const identifier = String(form.get(mode === "login" ? "identifier" : "email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const destination =
      nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
        ? nextPath
        : "/beranda-artikel";

    if (mode === "register") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          companyName: form.get("companyName"),
          email: identifier,
          phone: form.get("phone"),
          password,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        showError(result.error ?? "Registration failed.");
        setBusy(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      username: identifier,
      password,
      portal: "storefront",
      redirect: false,
      callbackUrl: destination,
    });
    if (result?.ok) {
      const activeSession = await getSession();
      const role = activeSession?.user.role;
      window.location.assign(
        role === "ADMIN" || role === "SUPERADMIN" ? "/admin/dashboard" : destination
      );
      return;
    }
    showError("Invalid email, phone number, or password.");
    setFieldErrors({
      identifier: "Check your email / phone number.",
      password: "Check your password.",
    });
    setBusy(false);
  }

  return (
    <main className="bg-background pb-0 pt-8">
      <div className="mx-auto flex w-full max-w-md flex-col px-margin-mobile">
        <div className="flex flex-col items-center justify-center py-section-gap">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-primary-container opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-surface-container-lowest shadow-sm">
              <MaterialSymbol
                name="precision_manufacturing"
                className="text-[48px] font-bold text-primary"
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tighter text-primary">
              MesinBagus
            </h1>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              Industrial Procurement Excellence
            </p>
          </div>
        </div>

        {needPo ? (
          <div className="mb-2 space-y-1 rounded-xl border border-error/20 bg-error-container/40 p-3">
            <FieldError message="Sign in or create an account to place a Purchase Order." />
          </div>
        ) : null}
        {resetDone ? (
          <p className="mb-2 rounded-xl bg-secondary-container/40 p-3 text-body-sm text-on-surface">
            Password updated successfully. Please sign in with your new password.
          </p>
        ) : null}

        <section className="mt-4 w-full rounded-xl bg-surface-container-low p-component-padding shadow-sm">
          <div className="mb-6 flex rounded-lg bg-surface-container-highest p-1">
            {(
              [
                { id: "login", label: "Sign in" },
                { id: "register", label: "Register" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setFieldErrors({});
                }}
                className={cn(
                  "flex-1 rounded-md py-2 text-center font-button-text text-button-text transition-all duration-200",
                  mode === tab.id
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4" noValidate>
            {mode === "register" ? (
              <>
                <AuthField
                  name="name"
                  label="FULL NAME"
                  placeholder="John Doe"
                  icon="person"
                  minLength={2}
                  hint="Minimum 2 characters."
                  error={fieldErrors.name}
                />
                <AuthField
                  name="companyName"
                  label="COMPANY NAME"
                  placeholder="PT. Industri Maju"
                  icon="factory"
                  minLength={2}
                  hint="Minimum 2 characters."
                  error={fieldErrors.companyName}
                />
                <label className="block space-y-1">
                  <span className="ml-1 block font-label-technical text-label-technical text-on-surface-variant">
                    PHONE / WHATSAPP
                  </span>
                  <UncontrolledPhoneFields error={fieldErrors.phone} />
                </label>
              </>
            ) : null}

            <AuthField
              name={mode === "login" ? "identifier" : "email"}
              label={mode === "login" ? "EMAIL / PHONE" : "COMPANY EMAIL"}
              placeholder="name@company.com"
              icon="mail"
              type={mode === "login" ? "text" : "email"}
              hint={
                mode === "login"
                  ? "Use your company email or registered phone number."
                  : "Use a valid company email address."
              }
              error={fieldErrors.identifier}
            />

            <PasswordField
              name="password"
              label={mode === "login" ? "PASSWORD" : "NEW PASSWORD"}
              placeholder={mode === "login" ? "••••••••" : "Min. 8 characters"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              visible={passwordVisible}
              onToggle={() => setPasswordVisible((visible) => !visible)}
              hint={mode === "register" ? "Use at least 8 characters." : undefined}
              error={fieldErrors.password}
            />

            {mode === "register" ? (
              <>
                <PasswordField
                  name="confirmPassword"
                  label="CONFIRM PASSWORD"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  visible={confirmVisible}
                  onToggle={() => setConfirmVisible((visible) => !visible)}
                  hint="Re-enter the same password."
                  error={fieldErrors.confirmPassword}
                />
                <label className="mt-4 flex items-start gap-2">
                  <input
                    name="terms"
                    type="checkbox"
                    className={cn(
                      "mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20",
                      fieldErrors.terms && "border-error"
                    )}
                  />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    I agree to the{" "}
                    <Link href="/profile/privacy" className="font-semibold text-primary hover:underline">
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/profile/privacy" className="font-semibold text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                <FieldError message={fieldErrors.terms} />
              </>
            ) : (
              <div className="flex justify-end">
                <Link
                  href="/profile/forgot-password"
                  className="font-body-sm text-body-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary font-button-text text-button-text text-on-primary shadow-md transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {busy
                  ? "Please wait…"
                  : mode === "login"
                    ? "Sign in to account"
                    : "Create account"}
              </span>
              <MaterialSymbol
                name={mode === "login" ? "arrow_forward" : "person_add"}
                className="text-[20px]"
              />
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-grow bg-outline-variant" />
            <span className="font-label-technical text-label-technical uppercase tracking-widest text-outline">
              Or
            </span>
            <div className="h-px flex-grow bg-outline-variant" />
          </div>

          <button
            type="button"
            disabled={googleEnabled !== true || busy}
            onClick={() =>
              signIn("google", {
                callbackUrl:
                  nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
                    ? nextPath
                    : "/beranda-artikel",
              }, {
                prompt: "select_account consent",
              })
            }
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-border-subtle bg-surface-container-lowest transition-colors active:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            <span className="font-button-text text-button-text text-on-surface">
              Continue with Google
            </span>
          </button>

          {googleEnabled === false ? (
            <div className="mt-3 space-y-1 rounded-lg border border-status-indent/30 bg-status-indent/10 p-3 text-left text-xs text-on-surface">
              <p className="font-semibold">Google sign-in is not configured.</p>
              <p>1. Create an OAuth Client in Google Cloud Console (Web application type).</p>
              <p>2. Authorized redirect URI: {"{APP_URL}/api/auth/callback/google"}</p>
              <p>
                3. Set <code className="font-mono">GOOGLE_CLIENT_ID</code> and{" "}
                <code className="font-mono">GOOGLE_CLIENT_SECRET</code> in your{" "}
                <code className="font-mono">.env</code> file.
              </p>
              <p>4. Restart the development / production server.</p>
            </div>
          ) : googleEnabled === null ? (
            <p className="mt-2 text-center text-xs text-on-surface-variant">
              Checking Google sign-in availability…
            </p>
          ) : null}
        </section>

        <div className="mt-4 pb-1 text-center">
          {mode === "register" ? (
            <p className="px-8 font-body-sm text-body-sm text-on-surface-variant">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-medium text-primary hover:underline"
              >
                Sign in here
              </button>
            </p>
          ) : (
            <p className="px-8 font-body-sm text-body-sm text-on-surface-variant">
              By continuing, you agree to our{" "}
              <Link href="/profile/privacy" className="font-medium text-primary">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/profile/privacy" className="font-medium text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

type AuthFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  icon: "person" | "factory" | "mail";
  type?: "text" | "email";
  minLength?: number;
  hint?: string;
  error?: string;
};

function AuthField({
  name,
  label,
  placeholder,
  icon,
  type = "text",
  minLength,
  hint,
  error,
}: AuthFieldProps) {
  return (
    <label className="block space-y-1">
      <span className="ml-1 block font-label-technical text-label-technical text-on-surface-variant">
        {label}
      </span>
      <span className="relative block">
        <MaterialSymbol
          name={icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline"
        />
        <input
          name={name}
          type={type}
          minLength={minLength}
          aria-invalid={Boolean(error)}
          autoComplete={
            name === "name"
              ? "name"
              : name === "companyName"
                ? "organization"
                : type === "email"
                  ? "email"
                  : "username"
          }
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-lg border border-transparent bg-surface-container-lowest pl-10 pr-4 font-body-md text-body-md outline-none transition-all focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(error))
          )}
        />
      </span>
      <FieldHint message={hint} />
      <FieldError message={error} />
    </label>
  );
}

type PasswordFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
  visible: boolean;
  onToggle: () => void;
  hint?: string;
  error?: string;
};

function PasswordField({
  name,
  label,
  placeholder,
  autoComplete,
  visible,
  onToggle,
  hint,
  error,
}: PasswordFieldProps) {
  return (
    <label className="block space-y-1">
      <span className="ml-1 block font-label-technical text-label-technical text-on-surface-variant">
        {label}
      </span>
      <span className="relative block">
        <MaterialSymbol
          name="lock"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline"
        />
        <input
          name={name}
          type={visible ? "text" : "password"}
          minLength={8}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-lg border border-transparent bg-surface-container-lowest pl-10 pr-12 font-body-md text-body-md outline-none transition-all focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(error))
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <MaterialSymbol name={visible ? "visibility_off" : "visibility"} className="text-[20px]" />
        </button>
      </span>
      <FieldHint message={hint} />
      <FieldError message={error} />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
