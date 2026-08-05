import { getAdminSession, getStorefrontSession, isAdminRole } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { PoPdfToolbar, type PoDocumentData } from "./po-pdf-view";
import { findProductById } from "@/lib/storefront/catalog";
import { prisma } from "@/lib/prisma";
import { getPoBuyerContext } from "@/lib/storefront/po-buyer-context";

type PoPreviewPdfPageProps = {
  searchParams: Promise<{ product?: string; order?: string }>;
};

type OrderSnapshot = {
  voltage?: string;
  buyerName?: string;
  buyerPhone?: string;
  companyName?: string;
  address?: string;
};

function readOrderSnapshot(notes: string | null): OrderSnapshot {
  if (!notes) return {};
  try {
    return JSON.parse(notes) as OrderSnapshot;
  } catch {
    return {};
  }
}

/** Full-viewport PO preview — dibuka di tab baru dari Review PO (tanpa shop shell). */
export default async function PoPreviewPdfPage({ searchParams }: PoPreviewPdfPageProps) {
  const { product: productId, order: orderId } = await searchParams;
  const [storefrontSession, adminSession] = await Promise.all([
    getStorefrontSession(),
    getAdminSession(),
  ]);
  const adminView = Boolean(adminSession?.user && isAdminRole(adminSession.user.role));
  const sessionUserId = storefrontSession?.user?.id;

  if (!sessionUserId && !adminView) redirect("/profile");
  if (adminView && !orderId && !sessionUserId) redirect("/admin/orders");

  const buyer = sessionUserId ? await getPoBuyerContext(sessionUserId) : null;
  if (!adminView && !buyer) redirect("/profile");
  if (!adminView && !orderId && buyer && !buyer.poReady) {
    redirect(buyer.completionPath ?? "/profile/business");
  }

  let iframeSrc = "/documents/po-template.html";
  let backHref = "/po-preview";
  let documentData: PoDocumentData;

  if (orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(adminView ? {} : { userId: sessionUserId }),
      },
      include: {
        company: true,
        user: {
          select: { name: true, email: true, phone: true },
        },
        shippingAddress: true,
        items: {
          take: 1,
          include: { product: true },
        },
      },
    });
    if (!order || !order.items[0]) notFound();
    const item = order.items[0];
    const snapshot = readOrderSnapshot(order.notes);
    const priceLabel = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(item.priceAtTime));
    iframeSrc = `/documents/po-template.html?order=${encodeURIComponent(order.id)}`;
    backHref = adminView && !sessionUserId ? "/admin/documents" : "/profile/docs";
    documentData = {
      authenticatedBuyer: true,
      productId: item.product.id,
      productName: item.product.name,
      productSku: item.product.sku,
      unitPrice: Number(item.priceAtTime),
      priceLabel,
      buyerName: snapshot.buyerName ?? order.user?.name ?? buyer?.name ?? "—",
      buyerCompany:
        snapshot.companyName ?? order.company?.companyName ?? buyer?.companyName ?? "—",
      buyerAddress:
        snapshot.address ??
        (order.shippingAddress
          ? [
              order.shippingAddress.addressDetail,
              order.shippingAddress.city,
              order.shippingAddress.postalCode,
            ]
              .filter(Boolean)
              .join(", ")
          : buyer?.address ?? "—"),
      buyerEmail: order.user?.email ?? buyer?.email ?? "—",
      buyerPhone: snapshot.buyerPhone ?? order.user?.phone ?? buyer?.phone ?? "—",
      buyerNpwp: order.company?.npwpNumber ?? buyer?.npwpNumber ?? "",
      buyerNib: order.company?.nibNumber ?? buyer?.nibNumber ?? "",
      quantity: item.quantity,
      voltage: snapshot.voltage,
      orderNumber: order.orderNumber,
      issuedAt: order.createdAt.toISOString(),
    };
  } else {
    if (!buyer) redirect("/profile");
    const product = productId ? await findProductById(productId) : undefined;
    if (!product) notFound();
    iframeSrc = `/documents/po-template.html?product=${encodeURIComponent(product.id)}`;
    backHref = `/po-preview?product=${encodeURIComponent(product.id)}`;
    documentData = {
      authenticatedBuyer: true,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      unitPrice: product.priceAmount ?? 0,
      priceLabel: product.priceLabel,
      buyerName: buyer.name,
      buyerCompany: buyer.companyName,
      buyerAddress: buyer.address,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      buyerNpwp: buyer.npwpNumber,
      buyerNib: buyer.nibNumber,
      issuedAt: new Date().toISOString(),
    };
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <PoPdfToolbar backHref={backHref} iframeSrc={iframeSrc} documentData={documentData} />
    </div>
  );
}
