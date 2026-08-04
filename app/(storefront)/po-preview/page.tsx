import { redirect } from "next/navigation";

import { getStorefrontSession } from "@/lib/auth";
import { findProductById, findProductBySku } from "@/lib/storefront/catalog";
import { getPoBuyerContext } from "@/lib/storefront/po-buyer-context";
import { PoPreviewContent } from "./po-preview-content";

export default async function PoPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productId } = await searchParams;
  const session = await getStorefrontSession();
  const nextPath = productId
    ? `/po-preview?product=${encodeURIComponent(productId)}`
    : "/po-preview";
  if (!session?.user?.id) {
    redirect(`/profile?need=po&next=${encodeURIComponent(nextPath)}`);
  }

  const [poProduct, buyer] = await Promise.all([
    productId ? findProductById(productId) : findProductBySku("FDP-RTR-500"),
    getPoBuyerContext(session.user.id),
  ]);
  if (!buyer) redirect("/profile");
  if (!buyer.poReady) {
    const params = new URLSearchParams({
      need: "po",
      missing: buyer.missingFields.join(","),
    });
    if (productId) params.set("product", productId);
    redirect(`${buyer.completionPath ?? "/profile/business"}?${params.toString()}`);
  }

  return (
    <PoPreviewContent
      poProduct={poProduct ?? undefined}
      buyer={{
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        companyName: buyer.companyName,
        npwpNumber: buyer.npwpNumber,
        nibNumber: buyer.nibNumber,
        address: buyer.address,
      }}
    />
  );
}
