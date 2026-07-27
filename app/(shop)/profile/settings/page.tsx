"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { ProfileSettingsHeader } from "@/components/shop/profile/profile-settings-header";
import { Ms } from "@/components/stitch/ms";
import { profileDemoUser } from "@/lib/profile-demo-data";
import { cn } from "@/lib/utils";

export default function ProfileSettingsPage() {
  const user = profileDemoUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone.replace(/^\+62\s*/, ""));
  const [avatar, setAvatar] = useState<string>(user.settingsAvatar);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [waNotify, setWaNotify] = useState(true);
  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/profile")
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (!result?.user) return;
        setName(result.user.name);
        setEmail(result.user.email);
        setPhone((result.user.phone ?? "").replace(/^\+62\s*/, ""));
        if (result.user.avatar) setAvatar(result.user.avatar);
      });
  }, []);

  function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2_000_000) {
      setError("Select an image smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setError("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: phone ? `+62 ${phone}` : "",
        avatar,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(result.error ?? "Unable to save account changes.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col pb-32">
          <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="group relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-surface-container-highest shadow-md">
                <Image
                  src={avatar}
                  alt={name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-110"
                aria-label="Change photo"
              >
                <Ms name="photo_camera" className="text-[18px]" />
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
              <h2 className="font-headline-md text-headline-md text-on-surface">{name}</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{user.title}</p>
            </div>
          </div>

          <div className="space-y-6 px-4">
            <div className="space-y-4">
              <div className="mb-1 flex items-center gap-2">
                <Ms name="person_outline" className="text-[20px] text-primary" />
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
                  <Ms
                    name="edit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-outline"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 font-label-technical text-label-technical uppercase text-on-surface-variant">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-xl bg-surface-container px-4 font-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <Ms
                    name="edit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-outline"
                  />
                </div>
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
                <Ms name="shield" className="text-[20px] text-primary" />
                <h3 className="font-button-text text-button-text text-on-surface">Security</h3>
              </div>
              <button
                type="button"
                onClick={() => setPasswordOpen((o) => !o)}
                className="group flex w-full items-center justify-between rounded-xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
              >
                <div className="flex flex-col items-start">
                  <span className="font-body-md font-medium text-on-surface">Change Password</span>
                  <span className="font-body-sm text-on-surface-variant">Last updated 3 months ago</span>
                </div>
                <Ms
                  name="chevron_right"
                  className={cn(
                    "text-on-surface-variant transition-transform group-hover:translate-x-1",
                    passwordOpen && "rotate-90"
                  )}
                />
              </button>
              {passwordOpen ? (
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

            <div className="space-y-4 pt-4">
              <div className="mb-1 flex items-center gap-2">
                <Ms name="settings_suggest" className="text-[20px] text-primary" />
                <h3 className="font-button-text text-button-text text-on-surface">Preferences</h3>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                <div className="flex flex-col">
                  <span className="font-body-md font-medium text-on-surface">
                    WhatsApp Notifications
                  </span>
                  <span className="font-body-sm text-on-surface-variant">
                    Order updates &amp; RFQ alerts
                  </span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={waNotify}
                    onChange={(e) => setWaNotify(e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-outline-variant after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-status-ready peer-checked:after:translate-x-full peer-focus:outline-none peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full" />
                </label>
              </div>
            </div>
          </div>

          {error ? (
            <p className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-[398px] rounded-lg bg-error-container p-3 text-center text-body-sm text-on-error-container shadow-lg">
              {error}
            </p>
          ) : null}
          <div className="fixed bottom-0 left-0 z-40 w-full border-t border-border-subtle bg-surface/80 p-4 backdrop-blur-lg">
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "flex h-14 w-full items-center justify-center gap-2 rounded-full font-button-text text-button-text shadow-xl transition-all active:scale-[0.98]",
                saved ? "bg-status-ready text-on-primary" : "bg-primary text-on-primary"
              )}
            >
              <Ms name={saved ? "check_circle" : "save"} />
              {saved ? "Changes Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
