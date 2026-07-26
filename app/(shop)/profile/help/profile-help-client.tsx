"use client";

import { useState } from "react";

import { ProfileSettingsHeader } from "@/components/shop/profile/profile-settings-header";
import { Ms } from "@/components/stitch/ms";
import { WHATSAPP_ADMIN } from "@/lib/design-tokens";
import { indahMesinContact } from "@/lib/contact";
import type { ShopFaqItem } from "@/lib/faq-shop";
import { cn } from "@/lib/utils";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg transition-all duration-300",
        open ? "bg-surface-container-highest" : "bg-surface-container-low"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-body-md text-body-md font-semibold text-on-surface">{q}</span>
        <Ms
          name="expand_more"
          className={cn(
            "text-outline transition-transform duration-300 group-hover:text-primary",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden px-5 transition-all duration-300 ease-in-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="pb-4 font-body-sm text-body-sm text-on-surface-variant">{a}</p>
      </div>
    </div>
  );
}

export function ProfileHelpClient({ faqs }: { faqs: ShopFaqItem[] }) {
  const waHref = `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
    `Halo Admin ${indahMesinContact.brandName}, saya butuh bantuan dari Help Center.`
  )}`;

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col pb-24">
          <div className="flex flex-col gap-4 bg-surface-container-low px-margin-mobile py-6">
            <div className="flex flex-col gap-1">
              <span className="font-label-technical text-label-technical uppercase tracking-wider text-primary">
                Help Desk
              </span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                How can we help you today?
              </h2>
            </div>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <Ms
                  name="search"
                  className="text-outline transition-colors group-focus-within:text-primary"
                />
              </div>
              <input
                type="text"
                placeholder="Search for parts, manuals, or tracking..."
                className="h-14 w-full rounded-xl border-none bg-surface-container-highest pl-12 pr-4 font-body-md text-on-surface placeholder:text-outline outline-none transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="-mt-4 px-margin-mobile">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "shopping_cart", title: "How to Order", sub: "RFQ & checkout process" },
                { icon: "payments", title: "Payment", sub: "Terms & bank details" },
                { icon: "local_shipping", title: "Shipping", sub: "Logistics & lead times" },
                { icon: "verified_user", title: "Warranty", sub: "Parts & service plans" },
              ].map(({ icon, title, sub }) => (
                <button
                  key={title}
                  type="button"
                  className="group flex flex-col rounded-xl bg-surface-container-lowest p-5 text-left shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 transition-colors group-hover:bg-primary group-hover:text-on-primary">
                    <Ms name={icon} />
                  </div>
                  <span className="mb-1 font-headline-md text-headline-md text-on-surface">
                    {title}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-section-gap px-margin-mobile">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">Popular Questions</h3>
              <span className="font-label-technical text-label-technical text-primary">View All</span>
            </div>
            <div className="flex flex-col gap-2">
              {faqs.map((item) => (
                <FaqItem key={item.question} q={item.question} a={item.answer} />
              ))}
            </div>
          </div>

          <div className="mt-section-gap px-margin-mobile">
            <div className="group relative h-48 w-full overflow-hidden rounded-2xl shadow-md">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCO7rJ1Pn-UgrAXZVuLICptV-N7YPFleB0fFCrKNPtQy3XmNPcWqxdlz7P5e0o72W58ztNvhdIvyy-IufF0vcOCyYX8j3NEx0wum5gqcKqg27Ss8V-4KicZJSazhR1kKDhKXwHeSyvHq1Iyu76XLmnvyIgNsc9-TLVJgm3n1x41cprxYbpAeLB_ZZS3i4IwyS5Smk1BesbH-DZQSTo6zIGp-1hbt_D5r2yb4GCO-9KRP0lOLyLTJpdy5f811LlM3Pgphph1tqgV9h5G')",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-primary/90 to-transparent p-8">
                <h4 className="mb-2 font-headline-md text-headline-md text-on-primary">
                  Need direct help?
                </h4>
                <p className="max-w-[200px] font-body-sm text-body-sm text-on-primary/80">
                  Our technical specialists are available for consultation.
                </p>
              </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all active:scale-95"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="font-button-text text-button-text">Live Support</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
