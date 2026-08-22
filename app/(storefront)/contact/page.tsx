import type { Metadata } from "next";
import { ShopTitledHeader } from "@/components/storefront/shop-titled-header";
import { ContactPageView } from "@/components/storefront/contact-page-view";
import { PwaBanner } from "@/components/storefront/pwa-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteSettings } from "@/lib/storefront/site-settings";
import { indahMesinContact } from "@/lib/storefront/contact";
import { absoluteUrl, buildPageMetadata, getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Indah Mesin",
  description:
    "Contact Indah Mesin via WhatsApp +62 818 0892 5555 or info@indahmesin.com. Head office in Tajinan, Kabupaten Malang.",
  path: "/contact",
  keywords: ["kontak Indah Mesin", "WhatsApp mesin industri", "showroom Malang"],
});

export default async function ContactPage() {
  const site = await getSiteSettings();
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: indahMesinContact.brandName,
    url: getSiteUrl(),
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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:00",
      closes: "16:00",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: indahMesinContact.phoneDisplay,
      contactType: "sales",
      availableLanguage: ["Indonesian", "English"],
      url: absoluteUrl("/contact"),
    },
  };

  return (
    <>
      <JsonLd data={contactSchema} />
      <PwaBanner />
      <ShopTitledHeader title="MesinBagus" />
      <ContactPageView site={site} />
    </>
  );
}
