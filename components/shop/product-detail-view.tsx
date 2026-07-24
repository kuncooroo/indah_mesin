"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function breadcrumbLeaf(product: Product) {
  if (product.sku === "FDP-RTR-500") return "Sterilizers";
  const first = product.name.split(" ")[0];
  return first ?? product.categoryLabel;
}

export function ProductDetailView({ product }: { product: Product }) {
  const images = product.gallery?.length
    ? [product.image, ...product.gallery]
    : [product.image];
  const [activeImage, setActiveImage] = useState(0);

  const specs =
    product.specs ??
    [
      { label: "SKU", value: product.sku },
      { label: "Kategori", value: product.categoryLabel },
    ];

  const features = product.features ?? [];
  const showBenefits = product.sku === "FDP-RTR-500";

  return (
    <>
      <IndustrialTopBar />

      <main className="mx-auto mb-24 max-w-7xl px-margin-mobile py-8 md:px-margin-desktop">
        <nav className="mb-6 flex items-center gap-2 text-body-sm text-on-surface-variant">
          <span>Equipment List</span>
          <Ms name="chevron_right" className="text-[16px]" />
          <span>{product.categoryLabel}</span>
          <Ms name="chevron_right" className="text-[16px]" />
          <span className="font-medium text-primary">{breadcrumbLeaf(product)}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle bg-white">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="430px"
                priority
              />
              {product.status === "ready" && (
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-status-ready px-3 py-1 text-body-sm font-semibold text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  Ready Stock
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative aspect-square cursor-pointer overflow-hidden rounded-lg border transition-colors",
                      activeImage === i
                        ? "border-2 border-primary"
                        : "border border-border-subtle hover:border-primary"
                    )}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                    {i === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Ms name="play_circle" className="text-4xl text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div>
              <p className="mb-1 font-label-technical font-bold text-primary">#{product.sku}</p>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
                {product.name}
              </h2>
            </div>
            <div className="rounded-xl bg-surface-container p-4">
              <p className="text-body-sm text-on-surface-variant">Harga Unit:</p>
              <h3 className="text-2xl font-bold text-primary">{product.priceLabel}</h3>
              {product.priceNote && (
                <p className="mt-1 text-body-sm italic text-outline">{product.priceNote}</p>
              )}
            </div>
            {features.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-on-surface">
                  <Ms name="featured_play_list" className="text-primary" />
                  Product Features
                </h4>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Ms name="check_circle" className="mt-0.5 text-status-ready" />
                      <span className="text-body-md text-on-surface-variant">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="border-t border-border-subtle pt-4">
              <h4 className="mb-4 font-bold text-on-surface">Downloads &amp; Resources</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: "picture_as_pdf",
                    title: "Brosur Retort-Sterilizer.pdf",
                    sub: "Download Brochure",
                  },
                  {
                    icon: "description",
                    title: "SOP-Operasional-Retort.pdf",
                    sub: "Technical Manual",
                  },
                ].map(({ icon, title, sub }) => (
                  <div
                    key={title}
                    className="group flex items-center gap-3 rounded-lg border border-border-subtle p-3 transition-colors hover:bg-surface-container-low"
                  >
                    <Ms name={icon} className="text-primary" />
                    <div className="overflow-hidden">
                      <p className="truncate text-body-sm font-semibold text-on-surface">
                        {title}
                      </p>
                      <p className="text-[12px] text-outline">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <a
                href={buildWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppLead(product.name)}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] py-4 font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <WaIcon />
                PESAN VIA WHATSAPP
              </a>
              <Link
                href="/po-preview"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 font-bold text-primary transition-colors hover:bg-primary/5"
              >
                <Ms name="download" />
                REQUEST QUOTATION (RFQ)
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-section-gap">
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
                    <td className={cn("px-6 py-4", label === "Model" && "text-primary")}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {showBenefits && (
          <section className="mt-section-gap grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h3 className="mb-4 font-headline-md text-headline-md">
                Mengapa Memilih IndustrialX Retort?
              </h3>
              <p className="mb-6 leading-relaxed text-on-surface-variant">
                Sistem retort kami dirancang khusus untuk memenuhi standar ketat industri
                pengolahan makanan di Indonesia. Dengan teknologi water immersion, distribusi
                panas menjadi jauh lebih merata dibandingkan sistem steam konvensional,
                memastikan sterilisasi produk hingga ke pusat kemasan tanpa merusak tekstur
                makanan.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border-subtle bg-surface-container-low p-4">
                  <div className="mb-1 text-xl font-bold text-primary">99.9%</div>
                  <div className="text-body-sm text-outline">Sterilization Efficiency</div>
                </div>
                <div className="rounded-lg border border-border-subtle bg-surface-container-low p-4">
                  <div className="mb-1 text-xl font-bold text-primary">30%</div>
                  <div className="text-body-sm text-outline">Energy Savings</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="group relative overflow-hidden rounded-2xl">
                <Image
                  src={BENEFIT_IMAGE}
                  alt="After-sales support"
                  width={600}
                  height={320}
                  className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/60 to-transparent p-6">
                  <p className="font-semibold text-white">
                    After-sales support &amp; on-site training included with every unit.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <ShopMobileFixedBar className="sticky-ctwa bg-white/80 p-4 backdrop-blur-md md:hidden">
        <a
          href={buildWhatsAppUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppLead(product.name)}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] py-4 font-bold text-white shadow-lg transition-transform active:scale-95"
        >
          <WaIcon />
          PESAN VIA WHATSAPP
        </a>
      </ShopMobileFixedBar>
    </>
  );
}
