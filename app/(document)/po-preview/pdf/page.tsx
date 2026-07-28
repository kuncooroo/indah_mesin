import { getServerSession } from "next-auth";
import { PoPdfToolbar, type PoDocumentData } from "./po-pdf-view";
import { authOptions } from "@/lib/auth";
import { findProductById } from "@/lib/storefront/catalog";
import { prisma } from "@/lib/prisma";

type PoPreviewPdfPageProps = {
  searchParams: Promise<{ product?: string }>;
};

/** Full-viewport PO preview — dibuka di tab baru dari Review PO (tanpa shop shell). */
export default async function PoPreviewPdfPage({ searchParams }: PoPreviewPdfPageProps) {
  const { product: productId } = await searchParams;
  const [product, session] = await Promise.all([
    productId ? findProductById(productId) : undefined,
    getServerSession(authOptions),
  ]);
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
      })
    : null;
  const iframeSrc = productId
    ? `/documents/po-template.html?product=${encodeURIComponent(productId)}`
    : "/documents/po-template.html";
  const backHref = productId
    ? `/po-preview?product=${encodeURIComponent(productId)}`
    : "/po-preview";
  const documentData: PoDocumentData = {
    authenticatedBuyer: Boolean(user),
    productId: product?.id ?? productId ?? "",
    productName: product?.name ?? "Industrial Machine",
    productSku: product?.sku ?? "N/A",
    unitPrice: product?.priceAmount ?? 0,
    priceLabel: product?.priceLabel ?? "Contact for price",
    buyerName: user?.name ?? session?.user?.name ?? "Buyer",
    buyerCompany: user?.company?.companyName ?? user?.companyName ?? "Independent Buyer",
    buyerAddress: user?.companyAddress ?? "Address not provided",
    buyerEmail: user?.email ?? session?.user?.email ?? "Email not provided",
    buyerPhone: user?.phone ?? "Phone not provided",
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <PoPdfToolbar backHref={backHref} iframeSrc={iframeSrc} documentData={documentData} />
    </div>
  );
}
