"use client";

import { ShopBottomNav } from "@/components/layout/shop-bottom-nav";
import { SavedProductsProvider } from "@/components/shop/saved-products-context";
import { ShopNavDrawerProvider } from "@/components/shop/shop-nav-drawer";
import { WhatsAppFab } from "@/components/shop/whatsapp-fab";
import { shopCanvasClassName } from "@/lib/shop-layout-mode";
import { cn } from "@/lib/utils";

export function ShopShell({ children }: { children: React.ReactNode }) {
  const canvasClass = shopCanvasClassName();

  return (
    <div className="min-h-dvh bg-background md:flex md:justify-center">
      <div
        className={cn(
          "shop-mobile-canvas relative mx-auto min-h-dvh w-full bg-background pb-20 font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container md:min-h-dvh md:shadow-[0_0_0_1px_var(--color-border-subtle),0_12px_40px_rgba(0,35,111,0.08)]",
          canvasClass
        )}
      >
        <ShopNavDrawerProvider>
          <SavedProductsProvider>{children}</SavedProductsProvider>
        </ShopNavDrawerProvider>
        <WhatsAppFab />
        <ShopBottomNav />
      </div>
    </div>
  );
}
