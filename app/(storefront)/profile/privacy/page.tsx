"use client";

import Image from "next/image";
import { useEffect } from "react";

import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { indahMesinContact } from "@/lib/storefront/contact";
import { cn } from "@/lib/utils";

const sections = ["collection", "usage", "security", "rights"] as const;

export default function ProfilePrivacyPage() {
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (!id) return;
        document.querySelectorAll("[data-privacy-nav]").forEach((link) => {
          const el = link as HTMLElement;
          const active = el.getAttribute("href") === `#${id}`;
          el.classList.toggle("bg-primary-container", active);
          el.classList.toggle("text-on-primary-container", active);
          el.classList.toggle("bg-surface-container", !active);
          el.classList.toggle("text-on-surface-variant", !active);
        });
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <ProfileSettingsHeader backHref="/profile" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col">
          <section className="bg-surface-container-low px-margin-mobile py-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-primary">
                <MaterialSymbol name="verified_user" className="text-[24px]" />
                <span className="font-label-technical text-label-technical uppercase tracking-wider">
                  Privacy Center
                </span>
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                Data Protection &amp; Transparency
              </h2>
              <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
                We believe privacy is a fundamental right. This policy outlines how we handle your
                industrial data with the same precision we apply to our machinery.
              </p>
              <div className="mt-4 flex items-center gap-2 font-body-sm text-body-sm text-outline">
                <MaterialSymbol name="history" className="text-[16px]" />
                <span>Last Updated: October 24, 2023</span>
              </div>
            </div>
          </section>

          <nav className="no-scrollbar sticky top-16 z-10 flex gap-4 overflow-x-auto bg-surface/90 px-margin-mobile py-4 backdrop-blur-md">
            {[
              { href: "#collection", label: "Collection" },
              { href: "#usage", label: "Usage" },
              { href: "#security", label: "Security" },
              { href: "#rights", label: "Your Rights" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                data-privacy-nav
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(href.slice(1));
                }}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 font-button-text text-body-sm",
                  href === "#collection"
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container text-on-surface-variant"
                )}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-section-gap px-margin-mobile pb-24">
            <section className="scroll-mt-32 flex flex-col gap-4" id="collection">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5">
                  <MaterialSymbol name="database" className="text-primary" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Data Collection</h3>
              </div>
              <div className="space-y-4 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                <p>
                  In our B2B industrial environment, we collect specific information necessary to
                  facilitate high-value transactions and technical support. This includes:
                </p>
                <div className="space-y-3 rounded-xl bg-surface-container-lowest p-4">
                  {[
                    {
                      title: "Corporate Identity:",
                      text: "Company name, registration details, and industry vertical.",
                    },
                    {
                      title: "Technical Requirements:",
                      text: "Machine specifications, voltage needs, and operational environment data provided via RFQ.",
                    },
                    {
                      title: "Communication Log:",
                      text: "WhatsApp interactions and email correspondence for service continuity.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <MaterialSymbol name="check_circle" className="text-[20px] text-status-ready" />
                      <div>
                        <strong className="text-on-surface">{item.title}</strong> {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="scroll-mt-32 flex flex-col gap-4" id="usage">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/5">
                  <MaterialSymbol name="insights" className="text-secondary" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Information Usage
                </h3>
              </div>
              <div className="space-y-4 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                <p>
                  Your data is never &quot;the product.&quot; We use information strictly to power
                  the following industrial workflows:
                </p>
                <ul className="list-none space-y-4">
                  {[
                    "Personalizing technical quotations and logistics planning for heavy machinery delivery.",
                    "Analyzing platform performance to optimize the machinery search experience for engineers and procurement officers.",
                    "Ensuring compliance with international trade regulations and export controls.",
                  ].map((text, i) => (
                    <li key={text} className="flex items-start gap-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 font-label-technical text-[11px] text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="scroll-mt-32 flex flex-col gap-4" id="security">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/5">
                  <MaterialSymbol name="encrypted" className="text-error" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Security Protocols
                </h3>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-inverse-surface p-6 text-inverse-on-surface">
                <div className="relative z-10 flex flex-col gap-4">
                  <p className="font-body-md opacity-90">
                    We employ enterprise-grade encryption (AES-256) for all data at rest. Our
                    infrastructure is monitored 24/7 for unauthorized access attempts.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                      <div className="mb-1 text-[10px] uppercase opacity-60">Encryption</div>
                      <div className="font-headline-md">SSL/TLS</div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                      <div className="mb-1 text-[10px] uppercase opacity-60">Access</div>
                      <div className="font-headline-md">MFA Only</div>
                    </div>
                  </div>
                </div>
                <svg
                  className="absolute right-0 top-0 opacity-10"
                  height="120"
                  viewBox="0 0 100 100"
                  width="120"
                  aria-hidden
                >
                  <path
                    d="M0 0 L100 100 M20 0 L100 80 M0 20 L80 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </section>

            <section className="flex flex-col gap-6 pt-4 scroll-mt-32" id="rights">
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-container-high p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <MaterialSymbol name="contact_mail" className="text-[32px] text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-headline-md text-headline-md text-on-surface">
                    Contact our DPO
                  </h4>
                  <p className="px-4 font-body-sm text-body-sm text-on-surface-variant">
                    Questions about your data? Our Data Protection Officer is ready to assist with
                    export requests or deletion.
                  </p>
                </div>
                <a
                  href={`mailto:${indahMesinContact.email}`}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 font-button-text text-button-text text-on-primary transition-transform active:scale-[0.98]"
                >
                  <MaterialSymbol name="alternate_email" className="text-[20px]" />
                  Contact Data Protection Officer
                </a>
              </div>
            </section>

            <footer className="flex flex-col items-center gap-4 border-t border-outline-variant py-8">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWysSn-NeelGwMe4dgvl8drzOcaq7Wu2Jb9UgcllwtuPS_3QyfDuWDj5X0ntc-YvtQMakRqcYKuiMnMMwWuaXBq0vm9WayyBCql7x_L-46TmmzK0lbYUUpFX-ewebMRdLHogfjexjTLBy2gw8OWXA7-BJcRm8YeUcbzmZBUY9AqCxIbVQOfbOoxUxodoVVjTnym5Jx-m4LMBC7cuM9V3cWvazPPf_0dIcJIFKzHgWbbcNjL_9GhOv2aTke2VmVSvvCWaDmNm60ZF45"
                alt=""
                width={120}
                height={32}
                className="h-8 w-auto opacity-40 grayscale"
              />
              <p className="text-center font-label-technical text-[11px] uppercase tracking-[0.2em] text-outline">
                Standard Industrial Privacy Framework v4.2
              </p>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}
