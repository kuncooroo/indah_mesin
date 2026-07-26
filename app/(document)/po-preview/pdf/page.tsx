import { PoPdfToolbar } from "./po-pdf-view";

type PoPreviewPdfPageProps = {
  searchParams: Promise<{ product?: string }>;
};

/** Full-viewport PO preview — dibuka di tab baru dari Review PO (tanpa shop shell). */
export default async function PoPreviewPdfPage({ searchParams }: PoPreviewPdfPageProps) {
  const { product: productId } = await searchParams;
  const iframeSrc = productId
    ? `/stitch/po-a4.html?product=${encodeURIComponent(productId)}`
    : "/stitch/po-a4.html";
  const backHref = productId
    ? `/po-preview?product=${encodeURIComponent(productId)}`
    : "/po-preview";

  return (
    <div className="flex min-h-dvh flex-col">
      <PoPdfToolbar backHref={backHref} iframeSrc={iframeSrc} />
    </div>
  );
}
