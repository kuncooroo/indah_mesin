import { prisma } from "@/lib/prisma";
import { indahMesinContact } from "@/lib/storefront/contact";

export type SiteSettingsView = {
  brandName: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  salesEmail: string;
  showroomHeroImage: string | null;
  mapImageUrl: string | null;
  hours: {
    weekday: { label: string; value: string };
    saturday: { label: string; value: string; closed?: boolean };
    sunday: { label: string; value: string; closed?: boolean };
  };
  headOffice: { title: string; lines: string[] };
  showroom: { title: string; lines: string[] };
};

const DEFAULT_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAey2gcnHGL0q9doYp4OrN_6OM1FzkEf1Ckr0A6afUAb7pBiV6eW4oluO2eFaDiw2niZFsmH2bGu8TcW508voJiIH0CbAPfr4XPdCohYO0oyW_wE-lvu02Vic9VkYIPxS1Ra5JVQpFIHxBBBcMX0JvbzYm71Q6_gmlBPZpziILBJEJvojBdlJOICTOEW4S5o16F4Hs9XdopN81ZpIW-XhEohGLYYcBRXdwbKj2q0545CFTICEbUU5iOu59SWjI4wZheTgszulyWOKS2";

const DEFAULT_MAP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBAV69G7pSR3sD48GN-rDcTPokxqVKkIqSyLO9YN7t3SpiZOQ4_2mg8fq2cCap_2ITFDvP_vz1eISS0wvLF6tfFgdLY9jnPq8J9cPXrIOaLUKnf6-yg7jg-gwU72jhiY75Gi5JTbucuATB-HK1EZCwYC5tM5_oFTku6n-WtkEhy8QsN0NuW9LLkQc3rcOSABCkCXV_AD-ldgQJigCe6q7OnWGEN6ZVyvnUkM09t5KDQ9zGyuF2I2Op0PCMS2uqKS8-X6NYCB_jZFOE";

function linesFromJson(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return value as string[];
  }
  return fallback;
}

export async function getSiteSettings(): Promise<SiteSettingsView> {
  const fallback: SiteSettingsView = {
    brandName: indahMesinContact.brandName,
    phoneDisplay: indahMesinContact.phoneDisplay,
    phoneTel: indahMesinContact.phoneTel,
    email: indahMesinContact.email,
    salesEmail: indahMesinContact.salesEmail,
    showroomHeroImage: DEFAULT_HERO,
    mapImageUrl: DEFAULT_MAP,
    hours: { ...indahMesinContact.hours },
    headOffice: {
      title: indahMesinContact.headOffice.title,
      lines: [...indahMesinContact.headOffice.lines],
    },
    showroom: {
      title: indahMesinContact.showroom.title,
      lines: [...indahMesinContact.showroom.lines],
    },
  };

  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: "default" } });
    if (!row) return fallback;

    return {
      brandName: row.brandName,
      // Kontak publik selalu memakai kanal resmi. Nilai lama di database
      // tidak boleh mengarahkan calon pelanggan ke nomor/alamat yang usang.
      phoneDisplay: indahMesinContact.phoneDisplay,
      phoneTel: indahMesinContact.phoneTel,
      email: indahMesinContact.email,
      salesEmail: indahMesinContact.salesEmail,
      showroomHeroImage: row.showroomHeroImage ?? DEFAULT_HERO,
      mapImageUrl: row.mapImageUrl ?? DEFAULT_MAP,
      hours: {
        weekday: {
          label: fallback.hours.weekday.label,
          value: fallback.hours.weekday.value,
        },
        saturday: {
          label: row.hoursSaturdayLabel ?? fallback.hours.saturday.label,
          value: row.hoursSaturdayValue ?? fallback.hours.saturday.value,
        },
        sunday: {
          label: row.hoursSundayLabel ?? fallback.hours.sunday.label,
          value: row.hoursSundayValue ?? fallback.hours.sunday.value,
          closed: fallback.hours.sunday.closed,
        },
      },
      headOffice: {
        title: fallback.headOffice.title,
        lines: [...fallback.headOffice.lines],
      },
      showroom: {
        title: row.showroomTitle ?? fallback.showroom.title,
        lines: linesFromJson(row.showroomLines, [...fallback.showroom.lines]),
      },
    };
  } catch {
    return fallback;
  }
}
