import { findProductById, findProductBySku } from "@/lib/catalog";
import { PoPreviewContent } from "./po-preview-content";

export default async function PoPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productId } = await searchParams;
  const poProduct = productId
    ? await findProductById(productId)
    : await findProductBySku("FDP-RTR-500");

  return <PoPreviewContent poProduct={poProduct ?? undefined} />;
}
