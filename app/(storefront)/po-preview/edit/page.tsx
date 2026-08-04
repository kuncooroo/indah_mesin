import { notFound, redirect } from "next/navigation";

import { getStorefrontSession } from "@/lib/auth";
import { findProductById } from "@/lib/storefront/catalog";
import { getPoBuyerContext } from "@/lib/storefront/po-buyer-context";
import { PoEditForm } from "./po-edit-form";

export default async function PoEditPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productId } = await searchParams;
  if (!productId) notFound();
  const session = await getStorefrontSession();
  const nextPath = `/po-preview/edit?product=${encodeURIComponent(productId)}`;
  if (!session?.user?.id) {
    redirect(`/profile?need=po&next=${encodeURIComponent(nextPath)}`);
  }
  const [product, buyer] = await Promise.all([
    findProductById(productId),
    getPoBuyerContext(session.user.id),
  ]);
  if (!product) notFound();
  if (!buyer) redirect("/profile");
  if (!buyer.poReady) {
    const params = new URLSearchParams({
      need: "po",
      product: productId,
      missing: buyer.missingFields.join(","),
    });
    redirect(`${buyer.completionPath ?? "/profile/business"}?${params.toString()}`);
  }
  return (
    <PoEditForm
      product={product}
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
