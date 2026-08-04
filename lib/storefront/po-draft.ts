import type { Product } from "@/lib/storefront/product-types";

export type PoDraft = {
  voltage: string;
  quantity: number;
  requestId?: string;
};

export type PoBuyerIdentity = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  npwpNumber: string;
  nibNumber: string;
  address: string;
};

const STORAGE_KEY = "indah_mesin_po_draft_v1";

export const DEFAULT_PO_DRAFT: PoDraft = {
  voltage: "380V / 3 Phase",
  quantity: 1,
};

export function defaultVoltageForProduct(product?: Product): string {
  const fromSpec = product?.specs?.find((s) =>
    /voltage|tegangan|power supply|power/i.test(s.label)
  )?.value;
  if (fromSpec) return fromSpec;
  if (product?.sku === "IMS-CAN-LINE") return "380V / 3 Phase";
  return DEFAULT_PO_DRAFT.voltage;
}

export function readPoDraft(productId?: string): PoDraft {
  if (typeof window === "undefined") return { ...DEFAULT_PO_DRAFT };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PO_DRAFT };
    const parsed = JSON.parse(raw) as PoDraft & { productId?: string };
    if (productId && parsed.productId && parsed.productId !== productId) {
      return { ...DEFAULT_PO_DRAFT, voltage: defaultVoltageForProduct(undefined) };
    }
    const { productId: storedProductId, ...rest } = parsed;
    void storedProductId;
    return { ...DEFAULT_PO_DRAFT, ...rest };
  } catch {
    return { ...DEFAULT_PO_DRAFT };
  }
}

export function hasPoDraft(productId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { productId?: string };
    return parsed.productId === productId;
  } catch {
    return false;
  }
}

export function writePoDraft(draft: PoDraft, productId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...draft, productId }));
}
