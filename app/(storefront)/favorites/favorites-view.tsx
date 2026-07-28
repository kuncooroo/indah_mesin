"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { buildWhatsAppUrl, buildWhatsAppUrlFromText } from "@/lib/storefront/whatsapp";
import type { Product } from "@/lib/storefront/product-types";
import { useSavedProducts } from "@/components/storefront/saved-products-context";
import { cn } from "@/lib/utils";

function WaConsultIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.437 2.503 1.163 3.485l-.762 2.78 2.84-.744c.937.615 2.056.965 3.259.967 3.18 0 5.767-2.587 5.768-5.766.001-3.179-2.587-5.768-5.767-5.768zm3.385 8.19c-.147.414-.731.758-1.011.804-.265.044-.606.079-1.385-.224-1.344-.523-2.222-1.892-2.29-1.982-.066-.09-.547-.728-.547-1.387 0-.658.344-.982.467-1.114.123-.131.272-.164.362-.164.09 0 .181.001.259.005.083.004.195-.031.305.234.113.272.387.942.421 1.01.034.068.056.147.011.237-.044.091-.067.147-.134.226-.067.079-.141.176-.201.237-.068.068-.138.142-.06.276.078.135.347.573.744.927.511.456.944.597 1.079.665.135.067.213.056.291-.034.079-.09.336-.39.426-.523.09-.133.18-.111.303-.067.123.045.783.37.918.437.135.067.224.1.258.158.033.058.033.336-.114.75zM12 2C6.477 2 2 6.477 2 12c0 2.136.67 4.116 1.81 5.74L2 22l4.437-1.157C8.032 21.43 9.948 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.877 0-3.63-.527-5.124-1.435l-.366-.222-2.61.68.691-2.518-.242-.385C3.447 14.63 3 12.877 3 11c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9z" />
    </svg>
  );
}

function savedStatusBadge(product: { status: string; statusLabel?: string }) {
  if (product.status === "ready") {
    return (
      <span className="rounded-full border border-status-ready/20 bg-status-ready/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-status-ready backdrop-blur-md">
        Ready Stock
      </span>
    );
  }
  return (
    <span className="rounded-full border border-status-indent/20 bg-status-indent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-status-indent backdrop-blur-md">
      {product.statusLabel ?? "Indent"}
    </span>
  );
}

function priceNoteForSaved(item: Product) {
  return (
    item.savedPriceNote ??
    item.priceNote ??
    "Harga estimasi spesifikasi standar. Logistik belum termasuk."
  );
}

function secondaryActionLabel(action: Product["savedSecondaryAction"]) {
  switch (action) {
    case "spec":
      return "Technical Spec Sheet";
    case "availability":
      return "View Availability";
    case "brochure":
    default:
      return "Request Brochure";
  }
}

function SavedSecondaryAction({ item }: { item: Product }) {
  const action = item.savedSecondaryAction ?? "brochure";
  const detailHref = `/products/${item.id}#technical-specifications`;
  const className =
    "flex h-12 w-full items-center justify-center gap-2 rounded border border-primary font-button-text text-button-text text-primary transition-all hover:bg-surface-container active:scale-[0.98]";

  if (action === "availability") {
    return (
      <Link href={`/products/${item.id}`} className={className}>
        {secondaryActionLabel(action)}
      </Link>
    );
  }

  if (action === "spec") {
    return (
      <Link href={detailHref} className={className}>
        {secondaryActionLabel(action)}
      </Link>
    );
  }

  const brochureUrl =
    item.brochureUrl ??
    item.downloads?.find((d) => d.icon === "picture_as_pdf" || d.title.toLowerCase().includes("brosur"))
      ?.fileUrl;

  if (brochureUrl && brochureUrl !== "#") {
    return (
      <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {secondaryActionLabel(action)}
      </a>
    );
  }

  return (
    <Link href={`/products/${item.id}#downloads`} className={className}>
      {secondaryActionLabel(action)}
    </Link>
  );
}

export function FavoritesView({ initialProducts }: { initialProducts: Product[] }) {
  const { skus, loading, toggle } = useSavedProducts();
  const [catalogBySku] = useState(() => new Map(initialProducts.map((p) => [p.sku, p])));
  const [removingSku, setRemovingSku] = useState<string | null>(null);

  const saved = useMemo(() => {
    const activeSkus = loading && skus.length === 0 ? initialProducts.map((p) => p.sku) : skus;
    return activeSkus
      .map((sku) => catalogBySku.get(sku))
      .filter((p): p is Product => Boolean(p));
  }, [catalogBySku, initialProducts, loading, skus]);

  async function remove(sku: string) {
    setRemovingSku(sku);
    await toggle(sku);
    setRemovingSku(null);
  }

  function requestAllSpecsPdf() {
    if (saved.length === 0) return;
    const lines = saved.map((p) => `• ${p.sku} — ${p.name}`).join("\n");
    window.open(
      buildWhatsAppUrlFromText(
        `Halo Admin Indah Mesin, mohon kirimkan spesifikasi teknis / brosur (PDF) untuk item tersimpan berikut:\n\n${lines}\n\nTerima kasih.`
      ),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="px-margin-mobile py-8 pb-24 md:px-margin-desktop">
      <div className="mb-8">
        <h2 className="mb-2 font-headline-lg text-headline-lg font-bold text-primary md:text-headline-lg">
          Saved Items
        </h2>
        <p className="font-body-md text-on-surface-variant">
          Review and manage your high-priority industrial equipment for procurement.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface-container-low p-8 text-center">
          <MaterialSymbol name="bookmark" className="mx-auto mb-2 text-4xl text-outline" />
          <p className="text-body-md text-on-surface-variant">Belum ada item tersimpan.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-gutter">
            {saved.map((item) => (
              <article
                key={item.sku}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface-container-lowest transition-all duration-300 hover:shadow-md",
                  removingSku === item.sku && "scale-95 opacity-0"
                )}
              >
                <div className="relative aspect-video overflow-hidden bg-metallic-bg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="430px"
                  />
                  <button
                    type="button"
                    onClick={() => void remove(item.sku)}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-error shadow-sm transition-all hover:bg-white active:scale-90"
                    aria-label="Hapus dari simpanan"
                  >
                    <MaterialSymbol name="delete" className="text-xl" fill />
                  </button>
                  <div className="absolute bottom-3 left-3">{savedStatusBadge(item)}</div>
                </div>

                <div className="flex flex-col flex-grow p-component-padding">
                  <span className="mb-1 font-label-technical text-label-technical uppercase tracking-widest text-on-surface-variant">
                    SKU: {item.sku}
                  </span>
                  <Link
                    href={`/products/${item.id}`}
                    className="mb-4 font-headline-md text-headline-md text-on-surface hover:text-primary"
                  >
                    {item.name}
                  </Link>

                  <div className="mb-4 rounded bg-metallic-bg p-3">
                    <div className="mb-1 flex justify-between text-body-sm text-on-surface-variant">
                      <span>Price Estimate:</span>
                      <span className="font-bold text-on-surface">{item.priceLabel}</span>
                    </div>
                    <p className="text-[11px] italic text-on-surface-variant">{priceNoteForSaved(item)}</p>
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <a
                      href={buildWhatsAppUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded bg-[#25D366] font-button-text text-button-text text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.98]"
                    >
                      <WaConsultIcon />
                      Consult via WhatsApp
                    </a>
                    <SavedSecondaryAction item={item} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-margin-desktop flex flex-col items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface-container-low p-gutter md:flex-row">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary-container p-2 text-primary-fixed-dim">
                <MaterialSymbol name="info" />
              </span>
              <p className="font-body-md text-on-surface">
                You have <strong>{saved.length} items</strong> saved. Prices are estimates based on standard
                specifications.
              </p>
            </div>
            <button
              type="button"
              onClick={requestAllSpecsPdf}
              className="rounded bg-primary px-6 py-3 font-button-text text-button-text text-white shadow transition-colors hover:bg-primary-container active:scale-95"
            >
              Download All Specs (PDF)
            </button>
          </div>
        </>
      )}
    </main>
  );
}
