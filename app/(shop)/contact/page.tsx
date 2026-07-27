import type { Metadata } from "next";
import { ShopTitledHeader } from "@/components/shop/shop-titled-header";
import { ContactPageView } from "@/components/shop/contact-page-view";
import { PwaBanner } from "@/components/shop/pwa-banner";
import { getSiteSettings } from "@/lib/site-settings";
import { indahMesinContact } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Kontak Indah Mesin",
  description:
    "Hubungi Indah Mesin via WhatsApp +62 818 0892 5555 atau info@indahmesin.com. Head office di Tajinan, Kabupaten Malang.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Kontak Indah Mesin",
    description:
      "Konsultasi mesin industri dan kunjungan showroom Senin–Sabtu pukul 07.00–16.00 WIB.",
    url: "/contact",
    type: "website",
  },
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Indah Mesin",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    email: indahMesinContact.email,
    telephone: indahMesinContact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: indahMesinContact.headOffice.lines[0],
      addressLocality: "Kabupaten Malang",
      addressRegion: "Jawa Timur",
      postalCode: "65172",
      addressCountry: "ID",
    },
    openingHours: "Mo-Sa 07:00-16:00",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, "\\u003c") }}
      />
      <PwaBanner />
      <ShopTitledHeader title="Contact Support" />
      <ContactPageView site={site} />
    </>
  );
}
