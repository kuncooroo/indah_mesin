"use client";

import { SessionProvider } from "next-auth/react";
import { AppPopupProvider } from "@/components/ui/app-popup";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppPopupProvider>{children}</AppPopupProvider>
    </SessionProvider>
  );
}
