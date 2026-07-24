import { findProductBySku } from "@/lib/catalog";
import { PoPreviewContent } from "./po-preview-content";

export default async function PoPreviewPage() {
  const poProduct = await findProductBySku("FDP-RTR-500");
  return <PoPreviewContent poProduct={poProduct} />;
}
