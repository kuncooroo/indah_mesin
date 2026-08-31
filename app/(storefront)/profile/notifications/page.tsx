"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  title: string;
  body: string;
  linkUrl: string | null;
  read: boolean;
  createdAt: string;
};

export default function ProfileNotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(() => {
    void fetch("/api/profile/notifications")
      .then((r) => (r.ok ? r.json() : { notifications: [], unreadCount: 0 }))
      .then((data) => {
        setItems(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markAllRead() {
    await fetch("/api/profile/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    load();
  }

  async function markRead(id: string) {
    await fetch("/api/profile/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" title="Notifikasi" />
      <main className="min-h-screen bg-background pt-16">
        <div className="px-margin-mobile pb-24 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-body-sm text-on-surface-variant">
              {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
            </p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="font-button-text text-sm text-primary"
              >
                Tandai semua dibaca
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <MaterialSymbol name="notifications_none" className="text-5xl text-outline" />
              <p className="mt-4 font-body-md text-on-surface-variant">
                Belum ada notifikasi progress.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((n) => {
                const content = (
                  <div
                    className={cn(
                      "rounded-xl p-4 shadow-sm",
                      n.read ? "bg-surface-container-lowest" : "bg-primary/5 ring-1 ring-primary/15"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <MaterialSymbol
                        name={n.read ? "notifications" : "notifications_active"}
                        className={n.read ? "text-outline" : "text-primary"}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-body-md font-medium text-on-surface">{n.title}</p>
                        <p className="mt-1 font-body-sm text-on-surface-variant">{n.body}</p>
                        <p className="mt-2 font-label-technical text-[10px] text-outline">
                          {new Date(n.createdAt).toLocaleString("id-ID")}
                        </p>
                      </div>
                      {!n.read ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </div>
                  </div>
                );

                if (n.linkUrl) {
                  return (
                    <li key={n.id}>
                      <Link
                        href={n.linkUrl}
                        onClick={() => {
                          if (!n.read) void markRead(n.id);
                        }}
                      >
                        {content}
                      </Link>
                    </li>
                  );
                }
                return <li key={n.id}>{content}</li>;
              })}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
