"use client";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    body: "By creating an account or using MesinBagus, you agree to these Terms & Conditions. If you do not agree, please do not use the platform.",
  },
  {
    id: "accounts",
    title: "Accounts & Business Identity",
    body: "You are responsible for accurate company data (including NPWP and NIB), safeguarding login credentials, and activity under your account. Invite links must only be shared with authorized team members.",
  },
  {
    id: "orders",
    title: "Quotations & Purchase Orders",
    body: "Product listings, prices, and PO drafts on MesinBagus are procurement tools. Final commercial terms may be confirmed via WhatsApp or official quotation from Indah Mesin before fulfillment.",
  },
  {
    id: "conduct",
    title: "Acceptable Use",
    body: "Do not misuse the platform, attempt unauthorized access, upload unlawful content, or use MesinBagus for purposes other than legitimate industrial procurement.",
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    body: "MesinBagus is provided to support discovery and ordering of industrial machinery. Indah Mesin is not liable for indirect losses arising from reliance on draft documents alone without confirmed commercial agreements.",
  },
] as const;

export function ProfileTermsClient() {
  return (
    <>
      <ProfileSettingsHeader backHref="/profile" title="Terms & Conditions" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col px-margin-mobile py-8">
          <section className="mb-8 flex flex-col gap-2">
            <div className="flex items-center gap-3 text-primary">
              <MaterialSymbol name="gavel" className="text-[24px]" />
              <span className="font-label-technical text-label-technical uppercase tracking-wider">
                Legal
              </span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              MesinBagus Terms &amp; Conditions
            </h2>
            <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
              Rules for using the MesinBagus marketplace operated by Indah Mesin.
            </p>
            <div className="mt-2 flex items-center gap-2 font-body-sm text-body-sm text-outline">
              <MaterialSymbol name="history" className="text-[16px]" />
              <span>Last Updated: September 1, 2026</span>
            </div>
          </section>

          <div className="flex flex-col gap-section-gap pb-10">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-label-technical text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    {section.title}
                  </h3>
                </div>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {section.body}
                </p>
              </section>
            ))}

            <footer className="border-t border-outline-variant pt-4">
              <p className="text-center font-label-technical text-[11px] uppercase tracking-[0.2em] text-outline">
                MesinBagus Terms Framework v1.0
              </p>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}
