import Image from "next/image";
import { Ms } from "@/components/stitch/ms";
import { IndustrialTopBar } from "@/components/shop/industrial-top-bar";
import { WHATSAPP_ADMIN } from "@/lib/design-tokens";

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
  return (
    <>
      <IndustrialTopBar variant="contact" />

      <main className="mx-auto max-w-7xl pb-24">
        <section className="relative h-64 w-full overflow-hidden md:h-[400px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/60 to-transparent" />
          <Image
            src={SHOWROOM_HERO}
            alt="IndustrialX showroom"
            fill
            className="object-cover"
            sizes="430px"
            priority
          />
          <div className="absolute bottom-0 left-0 z-20 p-margin-mobile text-white md:p-margin-desktop">
            <h2 className="mb-2 font-headline-lg text-headline-lg md:text-5xl">
              Visit Our Showroom
            </h2>
            <p className="max-w-2xl font-body-lg text-body-lg opacity-90">
              Experience precision engineering in person. Our technical experts are ready to
              provide live demonstrations.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-gutter px-margin-mobile py-section-gap md:gap-8 md:px-margin-desktop lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-5">
            <div className="whatsapp-shadow rounded-xl border border-border-subtle bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 font-headline-md text-primary">
                <Ms name="forum" fill />
                Instant Assistance
              </h3>
              <p className="mb-6 font-body-md text-on-surface-variant">
                Connect with our sales department immediately for pricing, stock availability,
                and technical specs.
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a
                href="tel:+62215558900"
                className="cursor-pointer rounded-lg border border-border-subtle bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
              >
                <Ms name="call" className="mb-2 text-primary" />
                <div className="font-label-technical text-[10px] uppercase text-primary">
                  Head Office
                </div>
                <div className="font-headline-md text-headline-md">+62 21 555 8900</div>
              </a>
              <a
                href="mailto:sales@indux.com"
                className="cursor-pointer rounded-lg border border-border-subtle bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
              >
                <Ms name="mail" className="mb-2 text-primary" />
                <div className="font-label-technical text-[10px] uppercase text-primary">
                  Sales Inquiry
                </div>
                <div className="font-headline-md text-headline-md">sales@indux.com</div>
              </a>
            </div>

            <div className="overflow-hidden rounded-xl border border-border-subtle bg-white">
              <div className="flex items-center gap-2 bg-primary p-4 text-white">
                <Ms name="schedule" />
                <span className="font-headline-md">Showroom Schedule</span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-border-subtle">
                  <tr className="bg-metallic-bg">
                    <td className="px-6 py-3 font-body-md text-on-surface">Monday - Friday</td>
                    <td className="px-6 py-3 text-right font-label-technical text-primary">
                      08:00 - 17:00
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-body-md text-on-surface">Saturday</td>
                    <td className="px-6 py-3 text-right font-label-technical text-primary">
                      09:00 - 14:00
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-3 font-body-md text-on-surface">Sunday &amp; Holidays</td>
                    <td className="px-6 py-3 text-right font-label-technical text-error">
                      Closed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-7">
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-headline-md text-primary">
                  <Ms name="location_on" fill />
                  Head Office
                </h4>
                <p className="font-body-md text-on-surface-variant">
                  Central Business District, Tower A, 24th Floor
                  <br />
                  Jakarta Selatan, 12190
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-headline-md text-primary">
                  <Ms name="factory" fill />
                  Warehouse &amp; Showroom
                </h4>
                <p className="font-body-md text-on-surface-variant">
                  Industrial Zone III, Block C-12
                  <br />
                  Tangerang, Banten 15124
                </p>
              </div>
            </div>

            <div className="group relative aspect-video overflow-hidden rounded-xl border border-border-subtle bg-surface-container md:aspect-auto md:h-[400px]">
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${MAP_BG}')` }}
              />
              <div className="pointer-events-none absolute inset-0 bg-black/5" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-border-subtle bg-white p-2 shadow-md">
                <Ms name="near_me" className="text-primary" />
                <span className="text-body-sm font-semibold">Get Directions</span>
              </div>
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded border border-border-subtle bg-white shadow-md hover:bg-surface-variant"
                >
                  <Ms name="add" />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded border border-border-subtle bg-white shadow-md hover:bg-surface-variant"
                >
                  <Ms name="remove" />
                </button>
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <Ms
                    name="location_on"
                    fill
                    className="animate-bounce text-5xl text-primary drop-shadow-xl"
                  />
                  <div className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Showroom Location
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-container p-6">
              <div className="flex flex-col items-start gap-6 md:flex-row">
                <div className="w-full md:w-1/3">
                  <div className="flex aspect-square items-center justify-center rounded-lg bg-primary-container">
                    <Ms name="build_circle" className="text-6xl text-on-primary-container" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="mb-2 font-headline-md text-primary">
                    After-Sales &amp; Tech Support
                  </h3>
                  <p className="mb-4 font-body-md text-on-surface-variant">
                    Our dedicated service team offers 24/7 technical consultation, preventive
                    maintenance, and genuine spare parts sourcing to ensure your production never
                    stops.
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
    </>
  );
}
