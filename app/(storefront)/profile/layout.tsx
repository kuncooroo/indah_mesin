import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo";

/** Default: account & auth flows are not indexed. Public pages override (e.g. privacy). */
export const metadata: Metadata = {
  robots: NO_INDEX,
};

export default function ProfileSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
