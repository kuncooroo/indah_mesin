import { BottomNav } from "@/components/layout/bottom-nav";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-scada-primary">
      <div className="mx-auto min-h-dvh max-w-lg pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
