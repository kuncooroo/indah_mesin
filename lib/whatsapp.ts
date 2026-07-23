import { WHATSAPP_ADMIN } from "@/lib/design-tokens";
import type { Product } from "@/lib/products";

export function buildWhatsAppUrl(product: Product, quantity = 1) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const productUrl = `${base}/products/${product.id}`;

  const text = `Halo Admin *Indah Mesin*, Saya tertarik untuk mengajukan Purchase Order (PO) / Permintaan Penawaran untuk produk berikut:

*Detail Produk:*
- Nama Mesin: ${product.name}
- Kode SKU: ${product.sku}
- Estimasi Jumlah: ${quantity} Unit

*Link Produk:* ${productUrl}

Mohon informasi mengenai ketersediaan stok, estimasi waktu pengiriman (indent), serta draft surat penawaran resmi (Quotation) untuk perusahaan kami. Terima kasih.`;

  return `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(text)}`;
}

export function trackWhatsAppLead(productName: string) {
  if (typeof window !== "undefined") {
    console.info(`Lead Event: Contacting Admin for ${productName}`);
  }
}
