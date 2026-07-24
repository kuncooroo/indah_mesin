import { SHOP_MOBILE_WIDTH } from "@/lib/shop-viewport";
import { cn } from "@/lib/utils";

type ShopMobileFixedBarProps = {
  children: React.ReactNode;
  className?: string;
  bottomClass?: string;
};

/** Bar fixed bawah yang mengikuti lebar viewport mobile (Stitch), bukan full desktop. */
export function ShopMobileFixedBar({
  children,
  className,
  bottomClass = "bottom-16",
}: ShopMobileFixedBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 flex justify-center",
        bottomClass
      )}
    >
      <div className={cn("pointer-events-auto w-full", SHOP_MOBILE_WIDTH, className)}>
        {children}
      </div>
    </div>
  );
}
