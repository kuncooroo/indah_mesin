"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";

import { PhoneInput } from "@/components/storefront/phone-input";
import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { useAppPopup } from "@/components/ui/app-popup";
import { FieldError, FieldHint, FormAlert, inputErrorClass } from "@/components/ui/form-feedback";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { phoneFieldError, parseStoredPhone } from "@/lib/storefront/country-dial-codes";
import { shopCanvasClassName } from "@/lib/storefront/layout-mode";
import { cn } from "@/lib/utils";

export default function ProfileSettingsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background pt-16">
          <div className="px-4 py-8 text-on-surface-variant">Loading settings…</div>
        </main>
      }
    >
      <ProfileSettingsClient />
    </Suspense>
  );
}

function ProfileSettingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const needPo = searchParams.get("need") === "po";
  const productId = searchParams.get("product");
  const { showSuccess, showError } = useAppPopup();
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [avatar, setAvatar] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [liveMissing, setLiveMissing] = useState<string[]>([]);

  useEffect(() => {
    void fetch("/api/profile")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Failed to load profile.");
        return result;
      })
      .then((result) => {
        if (!result?.user) return;
        setName(result.user.name);
        setEmail(result.user.email);
        setPhone(result.user.phone ?? "");
        setPosition(result.user.position ?? "");
        if (result.user.avatar) setAvatar(result.user.avatar);
      })
      .catch((reason: unknown) => {
        showError(reason instanceof Error ? reason.message : "Failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, [showError]);

  useEffect(() => {
    if (!needPo) return;
    void fetch("/api/profile/po-readiness")
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (result?.missingFields) setLiveMissing(result.missingFields as string[]);
      })
      .catch(() => undefined);
  }, [needPo, phone]);

  function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2_000_000) {
      showError("Choose a JPG, PNG, or WebP image up to 2 MB.");
      return;
    }
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    const national = parseStoredPhone(phone).national;
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Full name must be at least 2 characters.";
    const phoneErr = phoneFieldError(national, needPo);
    if (phoneErr) nextErrors.phone = phoneErr;
    if (newPassword) {
      if (newPassword.length < 8) nextErrors.newPassword = "New password must be at least 8 characters.";
      if (!currentPassword) nextErrors.currentPassword = "Enter your current password.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showError("Please fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    try {
      let avatarUrl: string | undefined;
      if (pendingFile) {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const uploadResponse = await fetch("/api/profile/avatar", {
          method: "POST",
          body: formData,
        });
        const uploadResult = (await uploadResponse.json()) as { error?: string; url?: string };
        if (!uploadResponse.ok || !uploadResult.url) {
          showError(uploadResult.error ?? "Failed to upload profile photo.");
          return;
        }
        avatarUrl = uploadResult.url;
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || "",
          ...(avatarUrl ? { avatar: avatarUrl } : {}),
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        user?: {
          name: string;
          email: string;
          phone: string | null;
          avatar: string | null;
        };
      };
      if (!response.ok) {
        showError(result.error ?? "Account changes could not be saved.");
        return;
      }
      if (result.user) {
        setName(result.user.name);
        setEmail(result.user.email);
        setPhone(result.user.phone ?? "");
        setAvatar(result.user.avatar ?? "");
        setPendingFile(null);
        try {
          await updateSession({
            name: result.user.name,
            email: result.user.email,
            image:
              result.user.avatar && !result.user.avatar.startsWith("data:")
                ? result.user.avatar
                : undefined,
          });
        } catch {
          // optional
        }
      }
      setCurrentPassword("");
      setNewPassword("");
      setFieldErrors({});
      if (needPo && productId) {
        showSuccess("Account changes saved successfully.");
        router.push(`/po-preview?product=${encodeURIComponent(productId)}`);
      } else {
        router.push("/profile?saved=account");
      }
    } catch {
      showError("Connection problem. Please try saving again.");
    } finally {
      setSaving(false);
    }
  }

  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  const poAlert =
    needPo && liveMissing.length > 0
      ? `Complete the following to create a PO: ${liveMissing.join(", ")}.`
      : "";

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" title="Account Settings" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col pb-32">
          <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="group relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary-fixed font-headline-lg-mobile text-2xl text-primary shadow-md">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name || "Profile photo"}
                    width={96}
                    height={96}
                    unoptimized={avatar.startsWith("data:")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-110"
                aria-label="Change profile photo"
              >
                <MaterialSymbol name="photo_camera" className="text-[18px]" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={changePhoto}
                className="hidden"
              />
            </div>
            <div className="mt-4 text-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {loading ? "Loading profile…" : name}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {position || "Procurement contact"}
              </p>
            </div>
          </div>

          <div className={cn("space-y-6 px-4", loading && "pointer-events-none opacity-60")}>
            {poAlert ? <FormAlert message={poAlert} tone="warning" /> : null}

            <div className="space-y-4">
              <div className="mb-1 flex items-center gap-2">
                <MaterialSymbol name="person_outline" className="text-[20px] text-primary" />
                <h3 className="font-button-text text-button-text text-on-surface">
                  Account Details
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={cn(
                    "h-12 w-full rounded-xl border border-transparent bg-surface-container px-4 font-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/20",
                    inputErrorClass(Boolean(fieldErrors.name))
                  )}
                  placeholder="Enter your full name"
                />
                <FieldHint message="Minimum 2 characters." />
                <FieldError message={fieldErrors.name} />
              </div>

              <div className="space-y-1.5 opacity-80">
                <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="h-12 w-full cursor-not-allowed rounded-xl bg-surface-dim/30 px-4 font-body-md text-on-surface-variant outline-none"
                />
                <FieldHint message="Contact an admin to change your company email." />
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                  Phone Number
                </label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  error={fieldErrors.phone}
                  required={needPo}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="mb-1 flex items-center gap-2">
                <MaterialSymbol name="shield" className="text-[20px] text-primary" />
                <h3 className="font-button-text text-button-text text-on-surface">Security</h3>
              </div>
              <button
                type="button"
                disabled={session?.user.authProvider === "google"}
                onClick={() => setPasswordOpen((o) => !o)}
                className="group flex w-full items-center justify-between rounded-xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex flex-col items-start">
                  <span className="font-body-md font-medium text-on-surface">Change Password</span>
                  <span className="font-body-sm text-on-surface-variant">
                    {session?.user.authProvider === "google"
                      ? "Password is managed by Google"
                      : "Update your account password"}
                  </span>
                </div>
                <MaterialSymbol
                  name="chevron_right"
                  className={cn(
                    "text-on-surface-variant transition-transform group-hover:translate-x-1",
                    passwordOpen && "rotate-90"
                  )}
                />
              </button>
              {passwordOpen && session?.user.authProvider !== "google" ? (
                <div className="animate-slide-down space-y-4 overflow-hidden pt-2">
                  <div className="space-y-1.5">
                    <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      aria-invalid={Boolean(fieldErrors.currentPassword)}
                      className={cn(
                        "h-12 w-full rounded-xl border border-transparent bg-surface-container px-4 font-body-md text-on-surface outline-none",
                        inputErrorClass(Boolean(fieldErrors.currentPassword))
                      )}
                      placeholder="••••••••"
                    />
                    <FieldError message={fieldErrors.currentPassword} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      aria-invalid={Boolean(fieldErrors.newPassword)}
                      className={cn(
                        "h-12 w-full rounded-xl border border-transparent bg-surface-container px-4 font-body-md text-on-surface outline-none",
                        inputErrorClass(Boolean(fieldErrors.newPassword))
                      )}
                      placeholder="Min. 8 characters"
                    />
                    <FieldHint message="Use at least 8 characters." />
                    <FieldError message={fieldErrors.newPassword} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
            <div
              className={cn(
                "pointer-events-auto w-full border-t border-border-subtle bg-surface/80 p-4 backdrop-blur-lg",
                shopCanvasClassName()
              )}
            >
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={loading || saving}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-button-text text-button-text text-on-primary shadow-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MaterialSymbol name={saving ? "progress_activity" : "save"} />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
