import { WHATSAPP_ADMIN } from "@/lib/storefront/design-tokens";
import type { Product } from "@/lib/storefront/product-types";

export function resolveAppOrigin(explicit?: string) {
  if (explicit) return explicit.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export type PoQuotationOptions = {
  product: Product;
  appUrl?: string;
  voltage?: string;
  quantity?: number;
  company?: string;
  poUrl?: string;
  orderNumber?: string;
};

/** Template PO / quotation — English, selaras Review PO & CTWA. */
export function buildPoQuotationMessage({
  product,
  appUrl,
  voltage = "380V / 3 Phase",
  quantity = 1,
  company = "Global Food Processing Ltd.",
  poUrl,
  orderNumber,
}: PoQuotationOptions): string {
  const origin = resolveAppOrigin(appUrl);
  const link = `${origin}/products/${product.id}`;
  const poLink = poUrl
    ? poUrl.startsWith("http")
      ? poUrl
      : `${origin}${poUrl.startsWith("/") ? "" : "/"}${poUrl}`
    : `${origin}/po-preview/pdf?product=${encodeURIComponent(product.id)}`;
  const unitLabel = quantity === 1 ? "Unit" : "Units";

  return `Hello MesinBagus Team,

I am interested in requesting a quotation for:
*Product:* ${product.name} (${product.sku})
*Voltage:* ${voltage}
*Quantity:* ${quantity} ${unitLabel}
${orderNumber ? `*PO Number:* ${orderNumber}\n` : ""}

*Company:* ${company}
*Link:* ${link}
*Generated PO:* ${poLink}

Please provide the detailed manual and a formal quotation including shipping to Jakarta.`;
}

export function buildWhatsAppUrlFromText(text: string) {
  return `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppUrl(product: Product, quantity = 1, appUrl?: string) {
  return buildWhatsAppUrlFromText(
    buildPoQuotationMessage({ product, quantity, appUrl })
  );
}

export function trackWhatsAppLead(productName: string) {
  if (typeof window !== "undefined") {
    console.info(`Lead Event: Contacting Admin for ${productName}`);
  }
}
