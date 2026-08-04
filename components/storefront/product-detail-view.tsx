"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { Product } from "@/lib/storefront/product-types";
import { SaveProductButton } from "@/components/storefront/saved-products-context";
import { ProductDetailHeader } from "@/components/storefront/product-detail-header";
import { StorefrontMobileFixedBar } from "@/components/storefront/layout/mobile-fixed-bar";
import { getProductDetailEnrichment } from "@/lib/storefront/product-detail-enrichment";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PO_DRAFT,
  defaultVoltageForProduct,
  writePoDraft,
} from "@/lib/storefront/po-draft";

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
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const enrichment = getProductDetailEnrichment(product.sku);

  const images = useMemo(() => {
    if (enrichment?.gallery.length) return enrichment.gallery;
    const base = product.gallery?.length ? [product.image, ...product.gallery] : [product.image];
    return base.filter(Boolean);
  }, [enrichment, product.gallery, product.image]);

  const [activeImage, setActiveImage] = useState(0);
  const [poBusy, setPoBusy] = useState(false);
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
  const priceLabel = product.priceLabel.replace(/^Mulai dari\s*/i, "Starting from ");
  const priceNote = product.priceNote
    ?.replace("Harga belum termasuk", "Price excludes")
    .replace("instalasi", "installation")
    .replace("pengiriman luar kota", "out-of-town delivery");

  async function createPoDraft() {
    if (sessionStatus === "loading" || poBusy) return;

    if (sessionStatus !== "authenticated") {
      router.push(
        `/profile?need=po&next=${encodeURIComponent(poPreviewHref)}`
      );
      return;
    }
    setPoBusy(true);
    try {
      const response = await fetch("/api/profile/po-readiness");
      const result = (await response.json()) as {
        ready?: boolean;
        missingFields?: string[];
        completionPath?: string | null;
      };

      if (!result.ready) {
        const missing = result.missingFields?.filter((field) => field !== "login") ?? [];
        const target = result.completionPath ?? "/profile/business";
        const params = new URLSearchParams({
          need: "po",
          product: product.id,
          missing: missing.join(","),
        });
        router.push(`${target}?${params.toString()}`);
        return;
      }

      writePoDraft(
        {
          ...DEFAULT_PO_DRAFT,
          voltage: defaultVoltageForProduct(product),
          quantity: 1,
          requestId: crypto.randomUUID(),
        },
        product.id
      );
      router.push(poPreviewHref);
    } finally {
      setPoBusy(false);
    }
  }

  return (
    <>
      <ProductDetailHeader />

      <main className="space-y-6 px-margin-mobile py-6 pb-24">
        <nav
          className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant"
          aria-label="Breadcrumb"
        >
          <span>Equipment List</span>
          <MaterialSymbol name="chevron_right" className="text-[16px]" />
          <span>Food Processing</span>
          <MaterialSymbol name="chevron_right" className="text-[16px]" />
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
                    <MaterialSymbol name="play_circle" className="text-4xl text-white" />
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
          <p className="text-2xl font-bold text-primary">{priceLabel}</p>
          {priceNote ? (
            <p className="mt-1 text-body-sm italic text-outline">{priceNote}</p>
          ) : null}
        </div>

        {features.length > 0 ? (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-on-surface">
              <MaterialSymbol name="featured_play_list" className="text-primary" />
              Product Features
            </h4>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <MaterialSymbol name="check_circle" className="mt-0.5 shrink-0 text-status-ready" />
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
                  <MaterialSymbol name={icon} className="shrink-0 text-primary" />
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

      <StorefrontMobileFixedBar bottomClass="bottom-16" className="sticky-ctwa border-t border-border bg-white/90 p-4 backdrop-blur-md">
        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={() => void createPoDraft()}
            disabled={sessionStatus === "loading" || poBusy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white py-3.5 font-bold text-primary shadow-sm transition-colors hover:bg-primary-container active:bg-primary-container disabled:opacity-60"
          >
            <MaterialSymbol name="note_add" />
            {sessionStatus === "loading" || poBusy
              ? "Checking Account…"
              : sessionStatus === "unauthenticated"
                ? "Login to Create PO Draft"
                : "Create PO Draft"}
          </button>
        </div>
      </StorefrontMobileFixedBar>
    </>
  );
}
