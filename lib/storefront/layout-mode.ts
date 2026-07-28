import { SHOP_MOBILE_WIDTH } from "@/lib/storefront/viewport";

/** Semua halaman shop tetap canvas mobile (430px), termasuk detail produk & PO. */
export function shopCanvasClassName(pathname?: string) {
  void pathname;
  return SHOP_MOBILE_WIDTH;
}

export function isPoCheckoutPath(pathname: string) {
  return (
    pathname === "/po-preview" ||
    pathname.startsWith("/po-preview/")
  );
}
