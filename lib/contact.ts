import { WHATSAPP_ADMIN } from "@/lib/design-tokens";

/** Kontak resmi Indah Mesin — WA dari env, bukan placeholder Stitch. */
export const indahMesinContact = {
  brandName: "Indah Mesin",
  phoneDisplay: "+62 812-3456-7890",
  phoneTel: `+${WHATSAPP_ADMIN}`,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "admin@indahmesin.com",
  salesEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "admin@indahmesin.com",
  headOffice: {
    title: "Kantor Pusat",
    lines: ["Jakarta, Indonesia"],
  },
  showroom: {
    title: "Showroom & Service",
    lines: [
      "Hubungi admin Indah Mesin untuk jadwal kunjungan dan demo mesin.",
    ],
  },
  hours: {
    weekday: { label: "Senin – Jumat", value: "08:00 – 17:00 WIB" },
    saturday: { label: "Sabtu", value: "08:00 – 14:00 WIB" },
    sunday: { label: "Minggu & Libur", value: "Tutup", closed: true },
  },
} as const;
