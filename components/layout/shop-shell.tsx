import { ShopBottomNav } from "@/components/layout/shop-bottom-nav";
import { WhatsAppFab } from "@/components/shop/whatsapp-fab";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface font-sans text-on-surface">
      <div className="mx-auto min-h-dvh max-w-lg pb-20">{children}</div>
      <WhatsAppFab />
      <ShopBottomNav />
    </div>
  );
}
