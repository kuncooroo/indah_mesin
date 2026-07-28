import { WHATSAPP_ADMIN } from "@/lib/storefront/design-tokens";

/** Kontak resmi Indah Mesin / IndustrialX */
export const indahMesinContact = {
  brandName: "Indah Mesin",
  phoneDisplay: "+62 818 0892 5555",
  phoneTel: `+${WHATSAPP_ADMIN}`,
  waTel: WHATSAPP_ADMIN,
  email: "info@indahmesin.com",
  salesEmail: "info@indahmesin.com",
  headOffice: {
    title: "Head Office",
    lines: [
      "Jalan Raya Randugading No.137 RT 12 RW 03 Kel. Randugading Kec. Tajinan, Rambaan, Randugading, Kec. Tajinan, Kabupaten Malang, Jawa Timur 65172",
    ],
  },
  showroom: {
    title: "Showroom",
    lines: ["Showroom visits are available Monday–Saturday, 07:00–16:00 WIB."],
  },
  hours: {
    weekday: { label: "Monday–Saturday", value: "07:00–16:00" },
    saturday: { label: "Sunday", value: "Closed", closed: true },
    sunday: { label: "Public Holidays", value: "Closed", closed: true },
  },
} as const;
