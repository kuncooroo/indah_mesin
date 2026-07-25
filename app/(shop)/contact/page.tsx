import Image from "next/image";
import { Ms } from "@/components/stitch/ms";
import { IndustrialTopBar } from "@/components/shop/industrial-top-bar";
import { WHATSAPP_ADMIN } from "@/lib/design-tokens";
import { indahMesinContact } from "@/lib/contact";

const SHOWROOM_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAey2gcnHGL0q9doYp4OrN_6OM1FzkEf1Ckr0A6afUAb7pBiV6eW4oluO2eFaDiw2niZFsmH2bGu8TcW508voJiIH0CbAPfr4XPdCohYO0oyW_wE-lvu02Vic9VkYIPxS1Ra5JVQpFIHxBBBcMX0JvbzYm71Q6_gmlBPZpziILBJEJvojBdlJOICTOEW4S5o16F4Hs9XdopN81ZpIW-XhEohGLYYcBRXdwbKj2q0545CFTICEbUU5iOu59SWjI4wZheTgszulyWOKS2";

const MAP_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBAV69G7pSR3sD48GN-rDcTPokxqVKkIqSyLO9YN7t3SpiZOQ4_2mg8fq2cCap_2ITFDvP_vz1eISS0wvLF6tfFgdLY9jnPq8J9cPXrIOaLUKnf6-yg7jg-gwU72jhiY75Gi5JTbucuATB-HK1EZCwYC5tM5_oFTku6n-WtkEhy8QsN0NuW9LLkQc3rcOSABCkCXV_AD-ldgQJigCe6q7OnWGEN6ZVyvnUkM09t5KDQ9zGyuF2I2Op0PCMS2uqKS8-X6NYCB_jZFOE";

const waHref = `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
  "Halo, saya ingin konsultasi pricing, ketersediaan stok, dan spesifikasi teknis mesin industri."
)}`;

function WaChatIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.253-.041.397.303.145.344.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.101-.177.211-.077.383.1.172.443.731.952 1.185.656.584 1.21.765 1.382.851.172.086.273.072.374-.045.101-.116.433-.505.548-.678.115-.172.231-.144.390-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z" />
    </svg>
  );
}

export default function ContactPage() {
  const phoneDisplay = indahMesinContact.phoneDisplay;
  const phoneTel = indahMesinContact.phoneTel.replace(/\s/g, "");
  const salesEmail = indahMesinContact.salesEmail;

  return (
    <>
      <IndustrialTopBar variant="contact" />

      <main className="pb-24">
        <section className="relative h-56 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
          <Image
            src={SHOWROOM_HERO}
            alt="IndustrialX showroom"
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
                Head Office
              </p>
              <p className="mt-1 font-headline-md text-lg font-bold text-on-surface">{phoneDisplay}</p>
            </div>
          </a>

          <a
            href={`mailto:${salesEmail}`}
            className="flex items-start gap-4 rounded-xl border border-border-subtle bg-surface-container p-4 transition-colors active:bg-surface-container-high"
          >
            <Ms name="mail" className="mt-0.5 text-2xl text-primary" />
            <div>
              <p className="font-label-technical text-[10px] font-bold uppercase tracking-wide text-primary">
                Sales Inquiry
              </p>
              <p className="mt-1 font-headline-md text-lg font-bold text-on-surface">{salesEmail}</p>
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
                  <td className="px-4 py-3 text-on-surface">{indahMesinContact.hours.weekday.label}</td>
                  <td className="px-4 py-3 text-right font-label-technical font-medium text-primary">
                    {indahMesinContact.hours.weekday.value}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-on-surface">{indahMesinContact.hours.saturday.label}</td>
                  <td className="px-4 py-3 text-right font-label-technical font-medium text-primary">
                    {indahMesinContact.hours.saturday.value}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-on-surface">{indahMesinContact.hours.sunday.label}</td>
                  <td className="px-4 py-3 text-right font-label-technical font-medium text-error">
                    {indahMesinContact.hours.sunday.value}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <Ms name="location_on" fill />
                Head Office
              </h4>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                Central Business District, Tower A, 24th Floor
                <br />
                Jakarta Selatan, 12190
              </p>
            </div>
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <Ms name="factory" fill />
                Warehouse &amp; Showroom
              </h4>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                Industrial Zone III, Block C-12
                <br />
                Tangerang, Banten 15124
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${MAP_BG}')` }}
            />
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md border border-border-subtle bg-white px-3 py-2 text-xs font-semibold shadow-md">
              <Ms name="near_me" className="text-primary text-base" />
              Get Directions
            </div>
            <div className="absolute bottom-3 right-3 flex flex-col gap-2">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded border border-border-subtle bg-white shadow-md"
                aria-label="Zoom in"
              >
                <Ms name="add" className="text-sm" />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded border border-border-subtle bg-white shadow-md"
                aria-label="Zoom out"
              >
                <Ms name="remove" className="text-sm" />
              </button>
            </div>
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-center">
              <Ms name="location_on" fill className="text-5xl text-primary drop-shadow-lg" />
              <span className="mt-1 inline-block rounded bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                Showroom Location
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-container">
            <div className="flex aspect-[2/1] items-center justify-center bg-primary-container">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Ms name="build_circle" className="text-5xl text-primary" fill />
              </span>
            </div>
            <div className="p-5">
              <h3 className="mb-2 text-base font-bold text-primary">After-Sales &amp; Tech Support</h3>
              <p className="mb-4 text-body-md leading-relaxed text-on-surface-variant">
                Our dedicated service team offers 24/7 technical consultation, preventive maintenance,
                and genuine spare parts sourcing to ensure your production never stops.
              </p>
              <div className="flex flex-wrap gap-2">
                {["24h Maintenance", "Operator Training", "OEM Parts"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border-subtle bg-white px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
