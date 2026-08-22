import type { Metadata } from "next";
import { StorefrontShell } from "@/components/storefront/layout/storefront-shell";
import { INDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  robots: INDEX_FOLLOW,
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
