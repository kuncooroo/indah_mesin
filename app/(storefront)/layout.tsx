import { StorefrontShell } from "@/components/storefront/layout/storefront-shell";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
