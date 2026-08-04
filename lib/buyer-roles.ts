import type { AppRole } from "@/lib/auth";

/** Session role untuk pembeli storefront (bukan panel Admin). */
export function isStorefrontUser(role: AppRole | string | undefined) {
  return role === "USER";
}
