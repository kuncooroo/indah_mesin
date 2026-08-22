import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo";

export const metadata: Metadata = {
  robots: NO_INDEX,
  title: "Document",
};

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh w-full bg-metallic-bg">{children}</div>;
}
