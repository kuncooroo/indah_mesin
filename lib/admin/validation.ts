import { fail, type ActionResult } from "@/lib/action-result";

export function requireTrimmed(
  value: FormDataEntryValue | null,
  field: string,
  label: string,
  opts?: { min?: number; max?: number }
): { ok: true; value: string } | { ok: false; result: ActionResult } {
  const v = String(value ?? "").trim();
  const min = opts?.min ?? 1;
  const max = opts?.max;
  if (!v || v.length < min) {
    const message =
      min <= 1 ? `${label} wajib diisi.` : `${label} minimal ${min} karakter.`;
    return {
      ok: false,
      result: fail(message, { fieldErrors: { [field]: message } }),
    };
  }
  if (max != null && v.length > max) {
    const message = `${label} maksimal ${max} karakter.`;
    return {
      ok: false,
      result: fail(message, { fieldErrors: { [field]: message } }),
    };
  }
  return { ok: true, value: v };
}

export function parseNonNegativeDecimal(
  raw: FormDataEntryValue | null,
  field: string,
  label: string
): { ok: true; value: string } | { ok: false; result: ActionResult } {
  const cleaned = String(raw ?? "")
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) {
    const message = `${label} harus angka ≥ 0.`;
    return {
      ok: false,
      result: fail(message, { fieldErrors: { [field]: message } }),
    };
  }
  return { ok: true, value: cleaned || "0" };
}

export function parseNonNegativeInt(
  raw: FormDataEntryValue | null,
  field: string,
  label: string,
  required = true
): { ok: true; value: number | null } | { ok: false; result: ActionResult } {
  const s = String(raw ?? "").trim();
  if (!s) {
    if (!required) return { ok: true, value: null };
    const message = `${label} wajib diisi.`;
    return {
      ok: false,
      result: fail(message, { fieldErrors: { [field]: message } }),
    };
  }
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n < 0) {
    const message = `${label} harus bilangan bulat ≥ 0.`;
    return {
      ok: false,
      result: fail(message, { fieldErrors: { [field]: message } }),
    };
  }
  return { ok: true, value: n };
}
