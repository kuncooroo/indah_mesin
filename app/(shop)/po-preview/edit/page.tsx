import { notFound } from "next/navigation";
import { findProductById } from "@/lib/catalog";
import { PoEditForm } from "./po-edit-form";

export default async function PoEditPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productId } = await searchParams;
  if (!productId) notFound();
  const product = await findProductById(productId);
  if (!product) notFound();
  return <PoEditForm product={product} />;
}
