"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { getProduct } from "@/lib/products";
import { buildWhatsAppUrl, trackWhatsAppLead } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProduct(id);
  if (!product) notFound();

  const images = product.gallery?.length
    ? [product.image, ...product.gallery]
    : [product.image];
  const [activeImage, setActiveImage] = useState(0);

  const specs =
    product.specs ??
    [
      { label: "SKU", value: product.sku },
      { label: "Kategori", value: product.categoryLabel },
      {
        label: "Status",
        value: product.statusLabel ?? product.status,
      },
    ];

  const isReady = product.status === "ready";

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-surface px-4 py-3 safe-top">
        <Link
          href="/home"
          className="rounded-full p-2 transition-colors hover:bg-surface-container"
        >
          <ArrowLeft className="size-5 text-primary" />
        </Link>
        <span className="text-sm font-semibold text-on-surface-variant">
          {product.categoryLabel}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-surface-container"
            aria-label="Simpan"
          >
            <Bookmark className="size-5 text-primary" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-surface-container"
            aria-label="Bagikan"
          >
            <Share2 className="size-5 text-primary" />
          </button>
        </div>
      </header>

      <div className="relative aspect-[4/3] bg-metallic-bg">
        <Image
          src={images[activeImage]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="400px"
          priority
        />
        <span
          className={cn(
            "absolute left-4 top-4 rounded px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
            isReady ? "bg-status-ready" : "bg-status-indent"
          )}
        >
          {product.statusLabel}
        </span>
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border-subtle bg-white px-4 py-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveImage(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                activeImage === i
                  ? "border-primary"
                  : "border-transparent opacity-70"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-6 pb-32">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          SKU: {product.sku}
        </p>
        <h1 className="mb-2 text-xl font-bold leading-tight text-primary">
          {product.name}
        </h1>
        <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
          {product.subtitle}
        </p>

        <div className="mb-6 rounded-xl border border-border-subtle bg-metallic-bg p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
            Estimasi Harga
          </span>
          <p className="font-mono text-lg font-bold text-primary">
            {product.priceLabel}
          </p>
          {product.priceNote && (
            <p className="mt-1 text-xs text-on-surface-variant">
              {product.priceNote}
            </p>
          )}
        </div>

        {product.features && product.features.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-base font-semibold text-primary">
              Fitur Utama
            </h2>
            <ul className="space-y-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-on-surface-variant"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-status-ready" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-border-subtle bg-white">
          <div className="border-b border-border-subtle bg-surface-container/50 px-4 py-3">
            <h2 className="font-semibold text-primary">Spesifikasi Teknis</h2>
          </div>
          <dl className="divide-y divide-border-subtle">
            {specs.map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between gap-4 px-4 py-3 text-sm"
              >
                <dt className="text-on-surface-variant">{label}</dt>
                <dd className="text-right font-mono font-medium text-on-surface">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border-subtle bg-white p-4 shadow-lg">
        <div className="mx-auto max-w-lg safe-bottom">
          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppLead(product.name)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
          >
            <svg className="size-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Ajukan PO via WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
