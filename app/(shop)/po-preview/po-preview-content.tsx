"use client";

import Link from "next/link";
import Image from "next/image";
import { Ms } from "@/components/stitch/ms";
import type { Product } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { indahMesinContact } from "@/lib/contact";
import { ShopMobileFixedBar } from "@/components/layout/shop-mobile-fixed-bar";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function PoPreviewContent({ poProduct }: { poProduct?: Product }) {
  const waHref = poProduct
    ? buildWhatsAppUrl(poProduct)
    : `https://wa.me/${indahMesinContact.phoneTel.replace("+", "")}`;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <Link
            href="/products/fdp-rtr-500"
            className="rounded-full p-2 transition-colors hover:bg-surface-container active:opacity-80"
          >
            <Ms name="arrow_back" className="text-primary" />
          </Link>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            Review Purchase Order
          </h1>
        </div>
        <span className="hidden font-headline-md text-headline-md font-bold text-primary md:block">
          IndustrialX
        </span>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-margin-mobile py-8 pb-40 md:px-margin-desktop md:pb-24">
        {poProduct && (
          <section className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-white shadow-sm md:flex-row">
            <div className="relative h-48 w-full shrink-0 md:h-auto md:w-48">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAap20epLLo9exrbwx0nQ1LnM0e4u76CQ3937L4nLzfNEERpTtzK9TGhFVp9Lymk5RpYTpXE3FM6ZCFcU5AU7ejYe5lA0sNbzKXE_VhYN8g-1sgTtXlq-wTWxHjOETgo3AzhCF0XcktctN0Sv7wQJvWLhUSkYkd8pCr76qDEpGEgZBRVh3q8Dy8aH4fhTY3ebh4SZEvTVOwEbbX9drNuyI-bQXd7TO7c3T1N1mIxqWdnzk9et9b4W_6kVlfJhsWNFBf7a6XIprV7oU7"
                alt={poProduct.name}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <div className="flex flex-col justify-center p-6">
              <span className="mb-1 font-label-technical text-label-technical text-primary">
                SKU: {poProduct.sku}
              </span>
              <h2 className="mb-2 font-headline-md text-headline-md text-on-surface">
                Industrial Retort Sterilizer
              </h2>
              <span className="w-fit rounded-full bg-status-ready/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-status-ready">
                Ready Stock
              </span>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="space-y-4 rounded-lg border border-border-subtle bg-white p-6">
            <h3 className="flex items-center gap-2 font-button-text text-button-text text-primary">
              <Ms name="settings_input_component" />
              Selection Details
            </h3>
            <table className="zebra-table w-full text-sm">
              <tbody>
                <tr>
                  <td className="px-3 py-2 font-medium text-on-surface-variant">Voltage</td>
                  <td className="px-3 py-2 text-right font-label-technical">
                    380V / 3 Phase
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-on-surface-variant">Quantity</td>
                  <td className="px-3 py-2 text-right font-label-technical">1 Unit</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-3 rounded-lg border border-border-subtle bg-white p-6">
            <h3 className="flex items-center gap-2 font-button-text text-button-text text-primary">
              <Ms name="corporate_fare" />
              Company Information
            </h3>
            <div className="space-y-3">
              {[
                ["Your Name (PIC)", "Budi Santoso"],
                ["Company Name (Nama Usaha)", "PT. Pangan Makmur Abadi"],
                ["Phone Number", indahMesinContact.phoneDisplay],
                [
                  "Company Address",
                  "Jl. Industri Raya No. 45, Cikarang, Bekasi, Jawa Barat",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">
                    {label}
                  </label>
                  <p className="border-b border-dashed border-outline-variant py-1 text-body-md">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="flex flex-col items-center justify-between gap-4 rounded-lg bg-primary-container p-6 text-white md:flex-row">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-on-primary-container">
              Estimated Price
            </p>
            <h3 className="font-headline-lg text-3xl font-bold">
              {poProduct?.priceLabel ?? "Rp 285.000.000+"}
            </h3>
          </div>
          <div className="rounded border border-white/20 bg-white/10 p-4 text-xs md:max-w-xs">
            <div className="flex items-start gap-2">
              <Ms name="info" className="text-sm" />
              <p>
                This is a quotation request. The final price may vary based on
                customization, shipping, and installation requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-button-text text-button-text text-primary">
            Message Preview (WhatsApp)
          </h3>
          <div className="relative rounded-lg border border-border-subtle bg-metallic-bg p-4 font-body-sm text-on-surface-variant">
            <Ms
              name="chat"
              className="absolute right-4 top-4 text-4xl text-primary opacity-20"
            />
            <p className="whitespace-pre-line leading-relaxed">
              {`Hello ${indahMesinContact.brandName} Team,

I am interested in requesting a quotation for:
*Product:* Industrial Retort Sterilizer (FDP-RTR-500)
*Voltage:* 380V / 3 Phase
*Quantity:* 1 Unit

*Company:* PT. Pangan Makmur Abadi
*Link:* ${appUrl}/products/fdp-rtr-500

Please provide the detailed manual and a formal quotation including shipping to Jakarta.`}
            </p>
          </div>
        </section>

        <div className="flex flex-col items-center gap-4 py-4">
          <button
            type="button"
            className="flex items-center gap-2 font-button-text text-primary transition-all hover:underline"
          >
            <Ms name="edit" />
            Edit Selection Details
          </button>
          <Link
            href="/po-preview/pdf"
            className="flex items-center gap-2 rounded-full border border-primary px-6 py-2 font-button-text text-primary transition-all hover:bg-primary/5"
          >
            <Ms name="download" />
            Download Purchase Order (PDF)
          </Link>
        </div>
      </main>

      <ShopMobileFixedBar className="sticky-cta-shadow bg-surface/80 p-4 backdrop-blur-md">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 font-button-text text-white shadow-lg transition-transform active:scale-95 hover:bg-[#20bd5c]"
        >
          <Ms name="chat" />
          Send Request to WhatsApp
        </a>
      </ShopMobileFixedBar>
    </>
  );
}
