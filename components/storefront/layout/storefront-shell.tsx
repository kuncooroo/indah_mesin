"use client";

import { StorefrontBottomNav } from "@/components/storefront/layout/bottom-nav";
import { SavedProductsProvider } from "@/components/storefront/saved-products-context";
import { ShopNavDrawerProvider } from "@/components/storefront/shop-nav-drawer";
import { WhatsAppFab } from "@/components/storefront/whatsapp-fab";
import { shopCanvasClassName } from "@/lib/storefront/layout-mode";
import { cn } from "@/lib/utils";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
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
        <StorefrontBottomNav />
      </div>
    </div>
  );
}
