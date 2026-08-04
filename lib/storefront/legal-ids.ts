/** Validasi & format identitas legal Indonesia. */

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** NPWP 15 digit (lama) atau 16 digit (NPWP baru / NIK). */
export function normalizeNpwp(value: string) {
  return digitsOnly(value);
}

export function isValidNpwp(value: string) {
  const digits = normalizeNpwp(value);
  return digits.length === 15 || digits.length === 16;
}

export function formatNpwpDisplay(value: string) {
  const digits = normalizeNpwp(value).slice(0, 16);
  if (digits.length <= 15) {
    const d = digits.padEnd(15, " ").slice(0, 15);
    // 10.0.0.1-000.000
    const parts = [
      d.slice(0, 2),
      d.slice(2, 5),
      d.slice(5, 8),
      d.slice(8, 9),
      d.slice(9, 12),
      d.slice(12, 15),
    ];
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${parts[0]}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${parts[0]}.${parts[1]}.${digits.slice(5)}`;
    if (digits.length <= 9) return `${parts[0]}.${parts[1]}.${parts[2]}.${digits.slice(8)}`;
    if (digits.length <= 12) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3]}-${digits.slice(9)}`;
    }
    return `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3]}-${parts[4]}.${digits.slice(12)}`;
  }
  // 16-digit: tampilkan berkelompok 4
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** NIB OSS: 13 digit. */
export function normalizeNib(value: string) {
  return digitsOnly(value).slice(0, 13);
}

export function isValidNib(value: string) {
  return normalizeNib(value).length === 13;
}

export function npwpErrorMessage(value: string) {
  const digits = normalizeNpwp(value);
  if (!digits) return "NPWP wajib diisi.";
  if (digits.length < 15) return "NPWP harus 15 digit (format lama) atau 16 digit.";
  if (digits.length > 16) return "NPWP maksimal 16 digit.";
  return "";
}

export function nibErrorMessage(value: string) {
  const digits = normalizeNib(value);
  if (!digits) return "NIB wajib diisi.";
  if (digits.length !== 13) return "NIB harus tepat 13 digit (Nomor Induk Berusaha).";
  return "";
}
