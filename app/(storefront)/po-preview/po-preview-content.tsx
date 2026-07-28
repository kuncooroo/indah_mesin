"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { Product } from "@/lib/storefront/product-types";
import {
  buildPoQuotationMessage,
  buildWhatsAppUrlFromText,
  resolveAppOrigin,
} from "@/lib/storefront/whatsapp";
import {
  defaultVoltageForProduct,
  readPoDraft,
  type PoDraft,
} from "@/lib/storefront/po-draft";
import { StorefrontMobileFixedBar } from "@/components/storefront/layout/mobile-fixed-bar";

const PO_PREVIEW_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAap20epLLo9exrbwx0nQ1LnM0e4u76CQ3937L4nLzfNEERpTtzK9TGhFVp9Lymk5RpYTpXE3FM6ZCFcU5AU7ejYe5lA0sNbzKXE_VhYN8g-1sgTtXlq-wTWxHjOETgo3AzhCF0XcktctN0Sv7wQJvWLhUSkYkd8pCr76qDEpGEgZBRVh3q8Dy8aH4fhTY3ebh4SZEvTVOwEbbX9drNuyI-bQXd7TO7c3T1N1mIxqWdnzk9et9b4W_6kVlfJhsWNFBf7a6XIprV7oU7";

function WaIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function PoPreviewContent({ poProduct }: { poProduct?: Product }) {
  const backHref = poProduct ? `/products/${poProduct.id}` : "/beranda-artikel";

  const productForMessage = useMemo(
    () =>
      poProduct ??
      ({
        id: "industrial-retort-sterilizer-high-pressure-steam",
        sku: "FDP-RTR-500",
        name: "Industrial Retort Sterilizer - High Pressure Steam",
      } as Product),
    [poProduct]
  );

  const [draft, setDraft] = useState<PoDraft | null>(null);
  const [appUrl, setAppUrl] = useState(
    () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  );

  const productId = productForMessage.id;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAppUrl(resolveAppOrigin());
      const saved = readPoDraft(productId);
      setDraft({
        ...saved,
        voltage: saved.voltage || defaultVoltageForProduct(poProduct),
      });
    });
    return () => window.clearTimeout(timeoutId);
  }, [productId, poProduct]);

  const messagePreview = useMemo(() => {
    if (!draft) return "";
    return buildPoQuotationMessage({
      product: productForMessage,
      appUrl,
      voltage: draft.voltage,
      quantity: draft.quantity,
      company: draft.companyName,
    });
  }, [appUrl, draft, productForMessage]);

  const waHref = buildWhatsAppUrlFromText(messagePreview);
  const pdfHref = poProduct
    ? `/po-preview/pdf?product=${encodeURIComponent(poProduct.id)}`
    : "/po-preview/pdf";
  const editHref = poProduct
    ? `/po-preview/edit?product=${encodeURIComponent(poProduct.id)}`
    : "/po-preview/edit?product=industrial-retort-sterilizer-high-pressure-steam";

  const heroImage = poProduct?.image || PO_PREVIEW_IMAGE;
  const statusLabel = poProduct?.statusLabel ?? "Ready Stock";

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface px-margin-mobile">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={backHref}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-surface-container active:opacity-80"
            aria-label="Go back"
          >
            <MaterialSymbol name="arrow_back" className="text-primary" />
          </Link>
          <h1 className="truncate font-headline-md text-headline-md font-bold text-primary">
            Review Purchase Order
          </h1>
        </div>
      </header>

      <main className="space-y-6 px-margin-mobile py-8 pb-4">
        {poProduct && (
          <section className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-white shadow-sm">
            <div className="relative h-48 w-full shrink-0">
              <Image src={heroImage} alt={poProduct.name} fill className="object-cover" sizes="430px" />
            </div>
            <div className="flex flex-col justify-center p-6">
              <span className="mb-1 font-label-technical text-label-technical text-primary">
                SKU: {poProduct.sku}
              </span>
              <h2 className="mb-2 font-headline-md text-headline-md text-on-surface">{poProduct.name}</h2>
              <span className="w-fit rounded-full bg-status-ready/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-status-ready">
                {statusLabel}
              </span>
            </div>
          </section>
        )}

        <div className="flex flex-col gap-6">
          <section className="space-y-4 rounded-lg border border-border-subtle bg-white p-6">
            <h3 className="flex items-center gap-2 font-button-text text-button-text text-primary">
              <MaterialSymbol name="settings_input_component" />
              Selection Details
            </h3>
            <table className="zebra-table w-full text-sm">
              <tbody>
                <tr>
                  <td className="px-3 py-2 font-medium text-on-surface-variant">Voltage</td>
                  <td className="px-3 py-2 text-right font-label-technical text-on-surface">
                    {draft?.voltage ?? "—"}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-on-surface-variant">Quantity</td>
                  <td className="px-3 py-2 text-right font-label-technical text-on-surface">
                    {draft?.quantity ?? 1} Unit{draft && draft.quantity > 1 ? "s" : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-4 rounded-lg border border-border-subtle bg-white p-6">
            <h3 className="flex items-center gap-2 font-button-text text-button-text text-primary">
              <MaterialSymbol name="corporate_fare" />
              Company Information
            </h3>
            <div className="space-y-3">
              {draft &&
                (
                  [
                    ["Your Name (PIC)", draft.picName],
                    ["Company Name (Nama Usaha)", draft.companyName],
                    ["Phone Number", draft.phone],
                    ["Company Address", draft.address],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <label className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">
                      {label}
                    </label>
                    <p className="border-b border-dashed border-outline-variant py-1 text-body-md">{value}</p>
                  </div>
                ))}
            </div>
          </section>
        </div>

        <section className="flex flex-col gap-4 rounded-lg bg-primary-container p-6 text-white">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-on-primary-container">
              Estimated Price
            </p>
            <h3 className="font-headline-lg text-3xl font-bold">
              {poProduct?.priceLabel ?? "Rp 285.000.000+"}
            </h3>
          </div>
          <div className="rounded border border-white/20 bg-white/10 p-4 text-xs">
            <div className="flex items-start gap-2">
              <MaterialSymbol name="info" className="shrink-0 text-sm" />
              <p>
                This is a quotation request. The final price may vary based on customization,
                shipping, and installation requirements.
              </p>
            </div>
          </div>
        </section>

        {messagePreview ? (
          <section className="space-y-3">
            <h3 className="font-button-text text-button-text text-primary">
              Message Preview (WhatsApp)
            </h3>
            <div className="relative rounded-lg border border-border-subtle bg-metallic-bg p-4 font-body-sm text-on-surface-variant">
              <MaterialSymbol name="chat" className="absolute right-4 top-4 text-4xl text-primary opacity-20" />
              <p className="whitespace-pre-line leading-relaxed">{messagePreview}</p>
            </div>
          </section>
        ) : null}

        <div className="flex flex-col items-center gap-4 py-4">
          <Link
            href={editHref}
            className="flex items-center gap-2 font-button-text text-primary transition-all active:opacity-80"
          >
            <MaterialSymbol name="edit" />
            Edit Selection Details
          </Link>
          <Link
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-primary px-6 py-2 font-button-text text-primary transition-all active:bg-primary/5"
          >
            <MaterialSymbol name="download" />
            Download Purchase Order (PDF)
          </Link>
        </div>
      </main>

      <StorefrontMobileFixedBar
        bottomClass="bottom-0"
        className="sticky-cta-shadow bg-surface/80 p-4 backdrop-blur-md"
      >
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 font-button-text text-white shadow-lg transition-transform active:scale-95 hover:bg-[#20bd5c]"
        >
          <WaIcon />
          Send Request to WhatsApp
        </a>
      </StorefrontMobileFixedBar>
    </>
  );
}
