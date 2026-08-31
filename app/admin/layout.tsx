import type { Metadata } from "next";
import { AdminSessionProvider } from "@/components/providers/admin-session-provider";
import { AdminToaster } from "@/components/admin/admin-toaster";
import { NO_INDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: NO_INDEX,
  title: {
    default: "Admin",
    template: "%s | MesinBagus Admin",
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider>
      {children}
      <AdminToaster />
    </AdminSessionProvider>
  );
}
