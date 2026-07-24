import { ShopBottomNav } from "@/components/layout/shop-bottom-nav";
import { WhatsAppFab } from "@/components/shop/whatsapp-fab";
import { SHOP_MOBILE_WIDTH } from "@/lib/shop-viewport";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-metallic-bg md:flex md:justify-center">
      <div
        className={`shop-mobile-canvas relative mx-auto min-h-dvh w-full ${SHOP_MOBILE_WIDTH} bg-surface pb-20 font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container md:min-h-dvh md:shadow-[0_0_0_1px_var(--color-border-subtle),0_12px_40px_rgba(0,35,111,0.08)]`}
      >
        {children}
        <WhatsAppFab />
        <ShopBottomNav />
      </div>
    </div>
  );
}
