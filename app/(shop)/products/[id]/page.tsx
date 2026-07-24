import { notFound } from "next/navigation";
import { findProductById } from "@/lib/catalog";
import { ProductDetailView } from "@/components/shop/product-detail-view";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
