export type CountryDialCode = {
  code: string;
  name: string;
  dial: string;
  flag: string;
};

/** Common dial codes — Indonesia first as default for this marketplace. */
export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { code: "ID", name: "Indonesia", dial: "62", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", dial: "60", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", dial: "65", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", dial: "66", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", dial: "84", flag: "🇻🇳" },
  { code: "PH", name: "Philippines", dial: "63", flag: "🇵🇭" },
  { code: "AU", name: "Australia", dial: "61", flag: "🇦🇺" },
  { code: "JP", name: "Japan", dial: "81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dial: "82", flag: "🇰🇷" },
  { code: "CN", name: "China", dial: "86", flag: "🇨🇳" },
  { code: "IN", name: "India", dial: "91", flag: "🇮🇳" },
  { code: "AE", name: "United Arab Emirates", dial: "971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial: "966", flag: "🇸🇦" },
  { code: "US", name: "United States", dial: "1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { code: "DE", name: "Germany", dial: "49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", dial: "31", flag: "🇳🇱" },
  { code: "IT", name: "Italy", dial: "39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial: "34", flag: "🇪🇸" },
  { code: "BR", name: "Brazil", dial: "55", flag: "🇧🇷" },
  { code: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
  { code: "NZ", name: "New Zealand", dial: "64", flag: "🇳🇿" },
  { code: "HK", name: "Hong Kong", dial: "852", flag: "🇭🇰" },
  { code: "TW", name: "Taiwan", dial: "886", flag: "🇹🇼" },
];

export function findCountryByDial(dial: string) {
  return COUNTRY_DIAL_CODES.find((item) => item.dial === dial) ?? COUNTRY_DIAL_CODES[0];
}

export function parseStoredPhone(value: string | null | undefined): {
  dial: string;
  national: string;
} {
  const raw = (value ?? "").trim();
  if (!raw) return { dial: "62", national: "" };
  const digits = raw.replace(/\D/g, "");
  const sorted = [...COUNTRY_DIAL_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const country of sorted) {
    if (digits.startsWith(country.dial) && digits.length > country.dial.length) {
      return { dial: country.dial, national: digits.slice(country.dial.length) };
    }
  }
  if (digits.startsWith("0") && digits.length >= 9) {
    return { dial: "62", national: digits.slice(1) };
  }
  return { dial: "62", national: digits };
}

export function formatInternationalPhone(dial: string, national: string) {
  const nationalDigits = national.replace(/\D/g, "").replace(/^0+/, "");
  if (!nationalDigits) return "";
  return `+${dial} ${nationalDigits}`;
}

export function isValidNationalPhone(national: string) {
  const digits = national.replace(/\D/g, "").replace(/^0+/, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function phoneFieldError(national: string, required = true) {
  const digits = national.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return required ? "Phone number is required." : "";
  if (digits.length < 7) return "Enter at least 7 digits (without country code).";
  if (digits.length > 15) return "Phone number is too long (max 15 digits).";
  return "";
}
