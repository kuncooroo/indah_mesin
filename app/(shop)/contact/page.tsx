import Image from "next/image";
import { Ms } from "@/components/stitch/ms";
import { IndustrialTopBar } from "@/components/shop/industrial-top-bar";
import { WHATSAPP_ADMIN } from "@/lib/design-tokens";
import { getSiteSettings } from "@/lib/site-settings";

function WaChatIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default async function ContactPage() {
  const site = await getSiteSettings();
  const phoneTel = site.phoneTel.replace(/\s/g, "");
  const waHref = `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
    `Halo ${site.brandName}, saya ingin konsultasi pricing, ketersediaan stok, dan spesifikasi teknis mesin industri.`
  )}`;

  return (
    <>
      <IndustrialTopBar variant="contact" />

      <main className="pb-24">
        <section className="relative h-56 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
          <Image
            src={site.showroomHeroImage ?? ""}
            alt={`${site.brandName} showroom`}
            fill
            className="object-cover"
            sizes="430px"
            priority
          />
          <div className="absolute bottom-0 left-0 z-20 p-margin-mobile text-white">
            <h2 className="mb-2 font-headline-lg text-2xl font-bold leading-tight">
              Visit Our Showroom
            </h2>
            <p className="max-w-sm text-body-md leading-relaxed opacity-95">
              Experience precision engineering in person. Our technical experts are ready to provide
              live demonstrations.
            </p>
          </div>
        </section>

        <div className="space-y-6 px-margin-mobile py-6">
          <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-headline-md text-base font-bold text-primary">
              <Ms name="forum" fill />
              Instant Assistance
            </h3>
            <p className="mb-5 text-body-md leading-relaxed text-on-surface-variant">
              Connect with our sales department immediately for pricing, stock availability, and
              technical specs.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-[0.98]"
            >
              <WaChatIcon />
              Chat via WhatsApp
            </a>
          </div>

          <a
            href={`tel:${phoneTel}`}
            className="flex items-start gap-4 rounded-xl border border-border-subtle bg-surface-container p-4 transition-colors active:bg-surface-container-high"
          >
            <Ms name="call" className="mt-0.5 text-2xl text-primary" />
            <div>
              <p className="font-label-technical text-[10px] font-bold uppercase tracking-wide text-primary">
                {site.headOffice.title}
              </p>
              <p className="mt-1 font-headline-md text-lg font-bold text-on-surface">
                {site.phoneDisplay}
              </p>
            </div>
          </a>

          <a
            href={`mailto:${site.salesEmail}`}
            className="flex items-start gap-4 rounded-xl border border-border-subtle bg-surface-container p-4 transition-colors active:bg-surface-container-high"
          >
            <Ms name="mail" className="mt-0.5 text-2xl text-primary" />
            <div>
              <p className="font-label-technical text-[10px] font-bold uppercase tracking-wide text-primary">
                Sales Inquiry
              </p>
              <p className="mt-1 font-headline-md text-lg font-bold text-on-surface">{site.salesEmail}</p>
            </div>
          </a>

          <div className="overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-primary px-4 py-3.5 text-white">
              <Ms name="schedule" />
              <span className="font-semibold">Showroom Schedule</span>
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-border-subtle">
                <tr className="bg-metallic-bg">
                  <td className="px-4 py-3 text-on-surface">{site.hours.weekday.label}</td>
                  <td className="px-4 py-3 text-right font-label-technical font-medium text-primary">
                    {site.hours.weekday.value}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-on-surface">{site.hours.saturday.label}</td>
                  <td className="px-4 py-3 text-right font-label-technical font-medium text-primary">
                    {site.hours.saturday.value}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-on-surface">{site.hours.sunday.label}</td>
                  <td className="px-4 py-3 text-right font-label-technical font-medium text-error">
                    {site.hours.sunday.value}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <Ms name="location_on" fill />
                {site.headOffice.title}
              </h4>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {site.headOffice.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <Ms name="factory" fill />
                {site.showroom.title}
              </h4>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {site.showroom.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${site.mapImageUrl}')` }}
            />
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md border border-border-subtle bg-white px-3 py-2 text-xs font-semibold shadow-md">
              <Ms name="near_me" className="text-base text-primary" />
              Get Directions
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
