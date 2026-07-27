"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Ms } from "@/components/stitch/ms";
import type { Product } from "@/lib/products";
import { buildWhatsAppUrl, trackWhatsAppLead } from "@/lib/whatsapp";
import { SaveProductButton } from "@/components/shop/saved-products-context";
import { ProductDetailHeader } from "@/components/shop/product-detail-header";
import { ShopMobileFixedBar } from "@/components/layout/shop-mobile-fixed-bar";
import { getProductDetailEnrichment } from "@/lib/product-detail-enrichment";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PO_DRAFT,
  defaultVoltageForProduct,
  writePoDraft,
} from "@/lib/po-draft";

function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-6 w-6 shrink-0 fill-current", className)} viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function StatusBadge({ product }: { product: Product }) {
  if (product.status === "ready") {
    return (
      <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-status-ready px-3 py-1 text-body-sm font-semibold text-white">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        Ready Stock
      </div>
    );
  }
  if (product.status === "indent") {
    return (
      <div className="absolute left-4 top-4 rounded-full bg-status-indent px-3 py-1 text-body-sm font-semibold text-white">
        {product.statusLabel ?? "INDEN"}
      </div>
    );
  }
  return (
    <div className="absolute left-4 top-4 rounded-full bg-on-surface-variant/90 px-3 py-1 text-body-sm font-semibold text-white">
      {product.statusLabel ?? "Contact"}
    </div>
  );
}

export function ProductDetailView({ product }: { product: Product }) {
  const enrichment = getProductDetailEnrichment(product.sku);

  const images = useMemo(() => {
    if (enrichment?.gallery.length) return enrichment.gallery;
    const base = product.gallery?.length ? [product.image, ...product.gallery] : [product.image];
    return base.filter(Boolean);
  }, [enrichment, product.gallery, product.image]);

  const [activeImage, setActiveImage] = useState(0);
  const thumbnails = useMemo(() => {
    const pool = images.length >= 4 ? images.slice(0, 4) : images;
    while (pool.length < 4 && images[0]) pool.push(images[0]);
    return pool.slice(0, 4);
  }, [images]);

  const features = enrichment?.features ?? product.features ?? [];
  const specs = enrichment?.specs ?? product.specs ?? [{ label: "SKU", value: product.sku }];
  const downloads = enrichment?.downloads ?? [];
  const videoThumbIndex = enrichment?.videoThumbIndex;

  const displaySrc = images[activeImage] ?? images[0] ?? product.image;
  const poPreviewHref = `/po-preview?product=${encodeURIComponent(product.id)}`;
  const breadcrumbLeaf = enrichment?.breadcrumbLeaf ?? product.categoryLabel;

  return (
    <>
      <ProductDetailHeader />

      <main className="mb-24 space-y-6 px-margin-mobile py-6 pb-40">
        <nav
          className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant"
          aria-label="Breadcrumb"
        >
          <span>Equipment List</span>
          <Ms name="chevron_right" className="text-[16px]" />
          <span>Food Processing</span>
          <Ms name="chevron_right" className="text-[16px]" />
          <span className="font-medium text-primary">{breadcrumbLeaf}</span>
        </nav>

        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle bg-white">
          <Image src={displaySrc} alt={product.name} fill className="object-cover" sizes="430px" priority />
          <StatusBadge product={product} />
          <div className="absolute right-3 top-3">
            <SaveProductButton sku={product.sku} className="h-8 w-8" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {thumbnails.map((src, i) => {
            const isActive = activeImage === i;
            return (
              <button
                key={`thumb-${i}-${src}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg transition-colors",
                  isActive ? "border-2 border-primary" : "border border-border-subtle hover:border-primary"
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                {videoThumbIndex === i && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Ms name="play_circle" className="text-4xl text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div>
          <p className="mb-1 font-label-technical font-bold text-primary">#{product.sku}</p>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{product.name}</h1>
        </div>

        <div className="rounded-xl bg-surface-container p-4">
          <p className="text-body-sm text-on-surface-variant">Unit Price:</p>
          <p className="text-2xl font-bold text-primary">{product.priceLabel}</p>
          {product.priceNote ? (
            <p className="mt-1 text-body-sm italic text-outline">{product.priceNote}</p>
          ) : null}
        </div>

        {features.length > 0 ? (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-on-surface">
              <Ms name="featured_play_list" className="text-primary" />
              Product Features
            </h4>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Ms name="check_circle" className="mt-0.5 shrink-0 text-status-ready" />
                  <span className="text-body-md text-on-surface-variant">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {downloads.length > 0 ? (
            <div className="border-t border-border-subtle pt-4" id="downloads">
              <h4 className="mb-4 font-bold text-on-surface">Downloads &amp; Resources</h4>
            <div className="grid grid-cols-1 gap-3">
              {downloads.map(({ icon, title, subtitle }) => (
                <a
                  key={title}
                  href="#"
                  className="flex items-center gap-3 rounded-lg border border-border-subtle p-3 transition-colors hover:bg-surface-container-low"
                  onClick={(e) => e.preventDefault()}
                >
                  <Ms name={icon} className="shrink-0 text-primary" />
                  <div className="min-w-0 overflow-hidden">
                    <p className="truncate text-body-sm font-semibold text-on-surface">{title}</p>
                    <p className="text-[12px] text-outline">{subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <section id="technical-specifications">
          <h3 className="mb-6 border-l-4 border-primary pl-4 font-headline-md text-headline-md text-on-surface">
            Technical Specifications
          </h3>
          <div className="overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
            <table className="zebra-table w-full text-left">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-6 py-4 font-bold">Attribute</th>
                  <th className="px-6 py-4 font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="font-label-technical">
                {specs.map(({ label, value }) => (
                  <tr key={label}>
                    <td className="px-6 py-4 font-bold text-on-surface-variant">{label}</td>
                    <td className="px-6 py-4 text-primary">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {enrichment ? (
          <section className="mt-section-gap space-y-6">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative h-80 w-full">
                <Image
                  src={enrichment.benefitImage}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="430px"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/60 to-transparent p-6">
                  <p className="font-semibold text-white">
                    After-sales support &amp; on-site training included with every unit.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-headline-md text-headline-md text-on-surface">
                {enrichment.benefitTitle}
              </h3>
              <p className="mb-6 leading-relaxed text-on-surface-variant">{enrichment.benefitBody}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border-subtle bg-surface-container-low p-4">
                  <div className="mb-1 text-xl font-bold text-primary">{enrichment.statA.value}</div>
                  <div className="text-body-sm text-outline">{enrichment.statA.label}</div>
                </div>
                <div className="rounded-lg border border-border-subtle bg-surface-container-low p-4">
                  <div className="mb-1 text-xl font-bold text-primary">{enrichment.statB.value}</div>
                  <div className="text-body-sm text-outline">{enrichment.statB.label}</div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <ShopMobileFixedBar bottomClass="bottom-16" className="sticky-ctwa bg-white/80 p-4 backdrop-blur-md">
        <div className="flex gap-3">
          <Link
            href={poPreviewHref}
            onClick={() =>
              writePoDraft(
                {
                  ...DEFAULT_PO_DRAFT,
                  voltage: defaultVoltageForProduct(product),
                  quantity: 1,
                },
                product.id
              )
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary py-4 font-bold text-primary transition-transform active:scale-95"
          >
            <Ms name="description" />
            Preview PO
          </Link>
          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppLead(product.name)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 font-bold text-white shadow-lg transition-transform active:scale-95"
          >
            <WaIcon />
            Order via WhatsApp
          </a>
        </div>
      </ShopMobileFixedBar>
    </>
  );
}
