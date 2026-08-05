"use client";

import { SessionProvider } from "next-auth/react";
import { AppPopupProvider } from "@/components/ui/app-popup";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppPopupProvider>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </AppPopupProvider>
    </SessionProvider>
  );
}
