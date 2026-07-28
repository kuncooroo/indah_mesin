import { usePathname } from "next/navigation";
import { shopCanvasClassName } from "@/lib/storefront/layout-mode";
import { cn } from "@/lib/utils";

type StorefrontMobileFixedBarProps = {
  children: React.ReactNode;
  className?: string;
  bottomClass?: string;
};

/** Bar fixed bawah yang mengikuti lebar canvas shop (mobile / product detail). */
export function StorefrontMobileFixedBar({
  children,
  className,
  bottomClass = "bottom-16",
}: StorefrontMobileFixedBarProps) {
  const pathname = usePathname();
  const canvasClass = shopCanvasClassName(pathname);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 flex justify-center",
        bottomClass
      )}
    >
      <div className={cn("pointer-events-auto w-full", canvasClass, className)}>
        {children}
      </div>
    </div>
  );
}
