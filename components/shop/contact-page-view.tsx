"use client";

import Image from "next/image";
import { useState } from "react";
import { Ms } from "@/components/stitch/ms";
import type { SiteSettingsView } from "@/lib/site-settings";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";

const SUPPORT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1pPU7-vKjhQVAE5UERHqWxbPJZae1zM2gliP14niG0o45ZOvTrKrSaQdE23fXfJSkNwTMg5yEPZdcuCyDbA5Dc12xvFcycJIuMr-e3PlWlqoyydFeovYVlgkDQjcIRcQuyjbCU3cnG4t3kxLo6M70fm3j5J8JQzzZk7Iy0lrOzMvZXXnBp5wGpefQvN6iYDf2YJuW16G8xD8OEdtvV8GHFSZI37QJwPu0IO9KwiSJ181N79ZmB4c_vbZQttfIsI033N9CygrCXFUD";

function WaChatIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.437 2.503 1.163 3.485l-.762 2.78 2.84-.744c.937.615 2.056.965 3.259.967 3.18 0 5.767-2.587 5.768-5.766.001-3.179-2.587-5.768-5.767-5.768zm3.385 8.19c-.147.414-.731.758-1.011.804-.265.044-.606.079-1.385-.224-1.344-.523-2.222-1.892-2.61-2.617-.066-.09-.547-.728-.547-1.387 0-.658.344-.982.467-1.114.123-.131.272-.164.362-.164.09 0 .181.001.259.005.083.004.195-.031.305.234.113.272.387.942.421 1.287.034.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.101-.177.211-.077.383.099.172.443.731.952 1.185.656.584 1.21.765 1.382.851.172.086.273.072.374-.045.101-.116.433-.505.548-.678.115-.172.231-.144.39-.087.101.046 1.011.477 1.184.564.173.087.289.129.332.202.043.073.043.423-.101.827z" />
    </svg>
  );
}

export function ContactPageView({ site }: { site: SiteSettingsView }) {
  const [mapZoom, setMapZoom] = useState(1);
  const waHref = buildWhatsAppUrlFromText(
    `Halo ${site.brandName}, saya ingin konsultasi pricing, ketersediaan stok, dan spesifikasi teknis mesin industri.`
  );

  return (
    <main className="pb-24">
      <section className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/60 to-transparent" />
        <Image
          src={site.showroomHeroImage ?? ""}
          alt={`${site.brandName} showroom`}
          fill
          className="object-cover"
          sizes="430px"
          priority
        />
        <div className="absolute bottom-0 left-0 z-20 p-margin-mobile text-white">
          <h2 className="mb-2 font-headline-lg text-headline-lg">Visit Our Showroom</h2>
          <p className="max-w-2xl font-body-lg text-body-lg opacity-90">
            Experience precision engineering in person. Our technical experts are ready to provide
            live demonstrations.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-gutter px-margin-mobile py-section-gap">
        <div className="space-y-8">
          <div className="whatsapp-shadow rounded-xl border border-border-subtle bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 font-headline-md text-headline-md text-primary">
              <Ms name="forum" fill />
              Instant Assistance
            </h3>
            <p className="mb-6 font-body-md text-on-surface-variant">
              Connect with our sales department immediately for pricing, stock availability, and
              technical specs.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex scale-100 items-center justify-center gap-3 rounded-lg bg-whatsapp px-6 py-4 font-button-text text-white transition-all hover:brightness-105 active:scale-95"
            >
              <WaChatIcon />
              Chat via WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-lg border border-border-subtle bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
            >
              <Ms name="call" className="mb-2 text-primary" />
              <div className="font-label-technical text-[10px] uppercase text-primary">Nomor / WhatsApp</div>
              <div className="font-headline-md text-headline-md">{site.phoneDisplay}</div>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="cursor-pointer rounded-lg border border-border-subtle bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
            >
              <Ms name="mail" className="mb-2 text-primary" />
              <div className="font-label-technical text-[10px] uppercase text-primary">Email</div>
              <div className="font-headline-md text-headline-md">{site.email}</div>
            </a>
          </div>

          <div className="overflow-hidden rounded-xl border border-border-subtle bg-white">
            <div className="flex items-center gap-2 bg-primary p-4 text-white">
              <Ms name="schedule" />
              <span className="font-headline-md text-headline-md">Showroom Schedule</span>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-border-subtle">
                <tr className="bg-metallic-bg">
                  <td className="px-6 py-3 font-body-md text-on-surface">{site.hours.weekday.label}</td>
                  <td className="px-6 py-3 text-right font-label-technical text-primary">
                    {site.hours.weekday.value}
                  </td>
                </tr>
                {!site.hours.saturday.closed ? (
                  <tr>
                    <td className="px-6 py-3 font-body-md text-on-surface">{site.hours.saturday.label}</td>
                    <td className="px-6 py-3 text-right font-label-technical text-primary">
                      {site.hours.saturday.value}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 font-headline-md text-headline-md text-primary">
              <Ms name="location_on" fill />
              {site.headOffice.title}
            </h4>
            <p className="font-body-md text-on-surface-variant">
              {site.headOffice.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="group relative aspect-video overflow-hidden rounded-xl border border-border-subtle bg-surface-container">
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('${site.mapImageUrl}')`,
                transform: `scale(${mapZoom})`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/5" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.headOffice.lines.join(", "))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-border-subtle bg-white p-2 shadow-md"
            >
              <Ms name="near_me" className="text-primary" />
              <span className="text-body-sm font-semibold">Get Directions</span>
            </a>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.min(1.4, z + 0.1))}
                className="flex h-10 w-10 items-center justify-center rounded border border-border-subtle bg-white shadow-md hover:bg-surface-variant"
                aria-label="Zoom in"
              >
                <Ms name="add" />
              </button>
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.max(1, z - 0.1))}
                className="flex h-10 w-10 items-center justify-center rounded border border-border-subtle bg-white shadow-md hover:bg-surface-variant"
                aria-label="Zoom out"
              >
                <Ms name="remove" />
              </button>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <Ms name="location_on" fill className="animate-bounce text-5xl text-primary drop-shadow-xl" />
                <div className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Showroom Location
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface-container p-6">
            <div className="flex flex-col gap-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
                <Image src={SUPPORT_IMAGE} alt="Technical support" fill className="object-cover" sizes="430px" />
              </div>
              <div>
                <h3 className="mb-2 font-headline-md text-headline-md text-primary">
                  After-Sales &amp; Tech Support
                </h3>
                <p className="mb-4 font-body-md text-on-surface-variant">
                  Our dedicated service team offers 24/7 technical consultation, preventive
                  maintenance, and genuine spare parts sourcing to ensure your production never stops.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["24h Maintenance", "Operator Training", "OEM Parts"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border-subtle bg-white px-3 py-1 font-label-technical text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
