import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: NO_INDEX,
  title: "Purchase Order",
};

export default function PoPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
