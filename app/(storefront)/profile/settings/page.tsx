"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { shopCanvasClassName } from "@/lib/storefront/layout-mode";
import { cn } from "@/lib/utils";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/profile")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Gagal memuat profil.");
        return result;
      })
      .then((result) => {
        if (!result?.user) return;
        setName(result.user.name);
        setEmail(result.user.email);
        setPhone((result.user.phone ?? "").replace(/^\+62\s*/, ""));
        setPosition(result.user.position ?? "");
        if (result.user.avatar) setAvatar(result.user.avatar);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Gagal memuat profil.");
      })
      .finally(() => setLoading(false));
  }, []);

  function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2_000_000) {
      setError("Pilih gambar JPG, PNG, atau WebP berukuran maksimal 2 MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setError("");
    if (name.trim().length < 2) {
      setError("Nama lengkap minimal 2 karakter.");
      return;
    }
    if (newPassword && !currentPassword) {
      setError("Masukkan kata sandi saat ini untuk mengganti kata sandi.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone ? `+62 ${phone}` : "",
          avatar: avatar || undefined,
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
        setError(result.error ?? "Perubahan akun tidak dapat disimpan.");
        return;
      }
      if (result.user) {
        setName(result.user.name);
        setEmail(result.user.email);
        setPhone((result.user.phone ?? "").replace(/^\+62\s*/, ""));
        setAvatar(result.user.avatar ?? "");
        await updateSession({
          name: result.user.name,
          email: result.user.email,
          image: result.user.avatar,
        });
        router.refresh();
      }
      setCurrentPassword("");
      setNewPassword("");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Koneksi bermasalah. Coba simpan kembali.");
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
                    alt={name || "Foto profil"}
                    width={96}
                    height={96}
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
                accept="image/*"
                onChange={changePhoto}
                className="hidden"
              />
            </div>
            <div className="mt-4 text-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {loading ? "Memuat profil…" : name}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {position || "Lead Procurement Manager"}
              </p>
            </div>
          </div>

          <div className={cn("space-y-6 px-4", loading && "pointer-events-none opacity-60")}>
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
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-12 w-full rounded-xl bg-surface-container px-4 font-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your full name"
                  />
                  <MaterialSymbol
                    name="edit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-outline"
                  />
                </div>
              </div>

              <div className="space-y-1.5 opacity-80">
                <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="h-12 w-full cursor-not-allowed rounded-xl bg-surface-dim/30 px-4 font-body-md text-on-surface-variant outline-none"
                  />
                  <MaterialSymbol
                    name="lock"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-outline"
                  />
                </div>
                <p className="ml-1 text-[11px] italic text-on-surface-variant/60">
                  Hubungi admin untuk mengubah email perusahaan.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex h-12 items-center justify-center rounded-xl bg-surface-container px-3 font-label-technical text-on-surface">
                    +62
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-12 flex-1 rounded-xl bg-surface-container px-4 font-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/20"
                    placeholder="8xx xxxx xxxx"
                  />
                </div>
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
                      className="h-12 w-full rounded-xl bg-surface-container px-4 font-body-md text-on-surface outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="h-12 w-full rounded-xl bg-surface-container px-4 font-body-md text-on-surface outline-none"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {error ? (
            <p className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-[398px] rounded-lg bg-error-container p-3 text-center text-body-sm text-on-error-container shadow-lg">
              {error}
            </p>
          ) : null}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
            <div
              className={cn(
                "pointer-events-auto w-full border-t border-border-subtle bg-surface/80 p-4 backdrop-blur-lg",
                shopCanvasClassName()
              )}
            >
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || saving}
                className={cn(
                  "flex h-14 w-full items-center justify-center gap-2 rounded-full font-button-text text-button-text shadow-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
                  saved ? "bg-status-ready text-on-primary" : "bg-primary text-on-primary"
                )}
              >
                <MaterialSymbol
                  name={saved ? "check_circle" : saving ? "progress_activity" : "save"}
                />
                {saved ? "Changes Saved!" : saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
