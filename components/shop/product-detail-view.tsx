"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Ms } from "@/components/stitch/ms";
import type { Product } from "@/lib/products";
import { buildWhatsAppUrl, trackWhatsAppLead } from "@/lib/whatsapp";
import { ShopMobileFixedBar } from "@/components/layout/shop-mobile-fixed-bar";
import { IndustrialTopBar } from "@/components/shop/industrial-top-bar";
import { cn } from "@/lib/utils";

const BENEFIT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAL7gusB9X50NsO1Qyj7xDEP3QczUR9T8qPWfO7gPS9xrqyyi5d5mASy6UG-CgbuOMDPSSxikHYVYL2cwkgeh5uIIYfG7UR-kyMLzliLve-aPa5kfCggUOK3ebSHYEbk1pPAY76-NDOgc9uK3tLqOQ5onZmLbGnaiuYqGZ8w4xS1gOcX89vICShQnbVUexbU97o_G5vsIw8JjVu4RDZdot1xOyeG07bdISjrm216vRxa8Mkxu7a6K8CVHSGiD6AsKYijjalYLpPAMif";

function WaIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function breadcrumbLeaf(product: Product) {
  if (product.sku === "FDP-RTR-500") return "Sterilizers";
  const first = product.name.split(" ")[0];
  return first ?? product.categoryLabel;
}

function StatusBadge({ product }: { product: Product }) {
  if (product.status === "ready") {
    return (
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-status-ready px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
        <span className="h-2 w-2 rounded-full bg-white" />
        Ready Stock
      </div>
    );
  }
  if (product.status === "indent") {
    return (
      <div className="absolute left-3 top-3 rounded-full bg-status-indent/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
        {product.statusLabel ?? "Indent"}
      </div>
    );
  }
  return (
    <div className="absolute left-3 top-3 rounded-full bg-on-surface-variant/85 px-3 py-1.5 text-xs font-semibold text-white">
      {product.statusLabel ?? "Contact"}
    </div>
  );
}

const DEFAULT_DOWNLOADS = [
  { icon: "picture_as_pdf", title: "Brosur Retort-Sterilizer.pdf", sub: "Download Brochure" },
  { icon: "description", title: "SOP-Operasional-Retort.pdf", sub: "Technical Manual" },
];

const RETORT_DEFAULT_FEATURES = [
  "Double-tank water immersion retort for energy efficiency.",
  "Automated PLC control for precise temperature ramping.",
  "High-efficiency heat distribution for canned & pouched food.",
  "Safety interlock system for high-pressure operations.",
];

function isRetortProduct(product: Product) {
  return product.sku === "FDP-RTR-500" || /retort/i.test(product.name);
}

function ProductFeaturesAndDownloads({
  features,
  showDownloads,
}: {
  features: string[];
  showDownloads: boolean;
}) {
  if (features.length === 0 && !showDownloads) return null;

  return (
    <div className="mb-7 rounded-xl bg-[#f3f4fa] p-4">
      {features.length > 0 && (
        <section className={cn("pb-5", showDownloads && "mb-5 border-b border-border-subtle")}>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-primary">
            <Ms name="featured_play_list" className="text-[22px] text-primary" />
            Product Features
          </h2>
          <ul className="space-y-3.5">
            {features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <Ms
                  name="check_circle"
                  className="mt-0.5 shrink-0 text-[22px] text-status-ready"
                  fill
                />
                <span className="text-[15px] leading-relaxed text-on-surface-variant">{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showDownloads && (
        <section>
          <h2 className="mb-3 text-base font-bold text-primary">Downloads &amp; Resources</h2>
          <div className="space-y-3">
            {DEFAULT_DOWNLOADS.map(({ icon, title, sub }) => (
              <button
                key={title}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-border-subtle bg-white p-3.5 text-left shadow-sm transition-colors active:bg-surface-container"
              >
                <Ms name={icon} className="text-[26px] text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary">{title}</p>
                  <p className="text-xs text-on-surface-variant">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RetortMarketingBlock() {
  return (
    <div className="mb-6 space-y-6">
      <section className="overflow-hidden rounded-2xl shadow-sm">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={BENEFIT_IMAGE}
            alt="After-sales support"
            fill
            className="object-cover"
            sizes="430px"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/35 to-transparent px-4 pb-4 pt-16">
            <p className="text-sm font-bold leading-snug text-white">
              After-sales support &amp; on-site training included with every unit.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-on-surface">Mengapa Memilih IndustrialX Retort?</h2>
        <p className="mb-5 text-[15px] leading-relaxed text-on-surface-variant">
          Sistem retort kami dirancang khusus untuk memenuhi standar ketat industri pengolahan
          makanan di Indonesia. Dengan teknologi water immersion, distribusi panas menjadi jauh
          lebih merata dibandingkan sistem steam konvensional, memastikan sterilisasi produk hingga
          ke pusat kemasan tanpa merusak tekstur makanan.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border-subtle bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary">99.9%</p>
            <p className="mt-1 text-xs text-on-surface-variant">Sterilization Efficiency</p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary">30%</p>
            <p className="mt-1 text-xs text-on-surface-variant">Energy Savings</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function buildThumbnails(images: string[]) {
  const pool = images.filter(Boolean);
  const fallback = pool[0] ?? "";
  return Array.from({ length: 4 }, (_, i) => pool[i] ?? fallback);
}

export function ProductDetailView({ product }: { product: Product }) {
  const images = useMemo(
    () => (product.gallery?.length ? [product.image, ...product.gallery] : [product.image]),
    [product.gallery, product.image]
  );
  const [activeImage, setActiveImage] = useState(0);
  const thumbnails = useMemo(() => buildThumbnails(images), [images]);

  const specs =
    product.specs ??
    [
      { label: "SKU", value: product.sku },
      { label: "Kategori", value: product.categoryLabel },
    ];

  const features = product.features ?? [];
  const isRetort = isRetortProduct(product);
  const displayFeatures =
    features.length > 0 ? features : isRetort ? RETORT_DEFAULT_FEATURES : [];
  const showFeaturesDownloadsBlock = isRetort || displayFeatures.length > 0;

  const displaySrc = images[activeImage] ?? images[0] ?? product.image;

  return (
    <>
      <IndustrialTopBar />

      <main className="bg-surface px-4 pb-40 pt-3">
        {/* Breadcrumbs */}
        <nav
          className="mb-4 flex flex-wrap items-center gap-1 text-[13px] text-on-surface-variant"
          aria-label="Breadcrumb"
        >
          <span>Equipment List</span>
          <Ms name="chevron_right" className="text-[16px] opacity-70" />
          <span>{product.categoryLabel}</span>
          <Ms name="chevron_right" className="text-[16px] opacity-70" />
          <span className="font-semibold text-primary">{breadcrumbLeaf(product)}</span>
        </nav>

        {/* Hero image */}
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
          <Image src={displaySrc} alt={product.name} fill className="object-cover" sizes="430px" priority />
          <StatusBadge product={product} />
        </div>

        {/* Thumbnails */}
        <div className="mb-5 grid grid-cols-4 gap-2.5">
          {thumbnails.map((src, i) => {
            const isActive = activeImage === i;
            return (
              <button
                key={`thumb-${i}`}
                type="button"
                onClick={() => setActiveImage(i < images.length ? i : 0)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg bg-white",
                  isActive ? "ring-2 ring-primary ring-offset-1" : "border border-border-subtle"
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="96px" />
                {i === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Ms name="play_circle" className="text-[32px] text-white" fill />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* SKU + title + price — after gallery (Stitch) */}
        <p className="mb-1 text-sm font-bold tracking-tight text-primary">#{product.sku}</p>
        <h1 className="mb-4 text-[22px] font-bold leading-snug text-primary">{product.name}</h1>

        <div className="mb-6 rounded-xl bg-[#eef0f8] p-4">
          <p className="text-sm text-on-surface-variant">Harga Unit:</p>
          <p className="mt-0.5 text-[26px] font-bold leading-tight text-primary">{product.priceLabel}</p>
          {product.priceNote && (
            <p className="mt-2 text-xs italic leading-relaxed text-outline">{product.priceNote}</p>
          )}
        </div>

        {/* (1) Setelah harga — sebelum Technical Specifications */}
        {showFeaturesDownloadsBlock && (
          <ProductFeaturesAndDownloads
            features={displayFeatures}
            showDownloads={isRetort}
          />
        )}

        {/* Technical Specifications */}
        <section className="mb-7">
          <h2 className="mb-4 border-l-4 border-primary pl-3 text-base font-bold text-primary">
            Technical Specifications
          </h2>
          <div className="overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
            <table className="zebra-table w-full text-left text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3.5 text-sm font-bold">Attribute</th>
                  <th className="px-4 py-3.5 text-sm font-bold">Details</th>
                </tr>
              </thead>
              <tbody>
                {specs.map(({ label, value }, rowIndex) => (
                  <tr
                    key={label}
                    className={cn(rowIndex % 2 === 0 ? "bg-metallic-bg/80" : "bg-white")}
                  >
                    <td className="px-4 py-3.5 text-sm font-bold text-on-surface">{label}</td>
                    <td className="px-4 py-3.5 font-label-technical text-sm font-medium text-primary">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* (2) Setelah Technical Specifications */}
        {isRetort && <RetortMarketingBlock />}
      </main>

      {/* Sticky CTA — di atas bottom nav */}
      <ShopMobileFixedBar
        bottomClass="bottom-[4.5rem]"
        className="border-t border-border-subtle bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,35,111,0.08)] backdrop-blur-md"
      >
        <div className="flex gap-3">
          <Link
            href="/po-preview"
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white py-3 text-sm font-bold text-primary transition-transform active:scale-[0.98]"
          >
            <Ms name="description" className="text-xl" />
            Pratinjau PO
          </Link>
          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppLead(product.name)}
            className="flex min-h-[48px] flex-[1.12] items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-md transition-transform active:scale-[0.98]"
          >
            <WaIcon />
            Pesan via WA
          </a>
        </div>
      </ShopMobileFixedBar>
    </>
  );
}
