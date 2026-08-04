"use client";

import { SessionProvider } from "next-auth/react";
import { ADMIN_AUTH_BASE_PATH } from "@/lib/auth-cookies";

/** SessionProvider khusus panel admin (cookie & endpoint terpisah). */
export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath={ADMIN_AUTH_BASE_PATH}>{children}</SessionProvider>;
}
