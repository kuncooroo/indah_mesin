export const REVISABLE_PO_STATUSES = ["DRAFT", "SUBMITTED_VIA_WA"] as const;

export type PoSubmission = {
  productId: string;
  quantity: number;
  voltage: string;
};

export type StoredPoSubmission = {
  status: string;
  productId: string | null;
  quantity: number | null;
  voltage: string | null;
  /** False when notes were replaced with free text and must not be overwritten. */
  notesAreSnapshot: boolean;
};

export type PoResubmitDecision = "replay" | "revise" | "reject";

export function readPoNotes(notes: string | null): {
  voltage: string | null;
  notesAreSnapshot: boolean;
} {
  if (!notes) return { voltage: null, notesAreSnapshot: true };
  try {
    const parsed = JSON.parse(notes) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { voltage: null, notesAreSnapshot: false };
    }
    const record = parsed as Record<string, unknown>;
    const notesAreSnapshot = "requestId" in record || "voltage" in record;
    return {
      voltage: typeof record.voltage === "string" ? record.voltage : null,
      notesAreSnapshot,
    };
  } catch {
    return { voltage: null, notesAreSnapshot: false };
  }
}

/**
 * Same requestId is reused when a buyer edits the draft and sends again.
 * An identical payload is a double-submit replay. A changed payload on an
 * open quotation must update that order; a processed order must be rejected
 * so sales does not lose the accepted terms.
 */
export function decidePoResubmit(
  stored: StoredPoSubmission,
  incoming: PoSubmission,
): PoResubmitDecision {
  const same =
    stored.productId === incoming.productId &&
    stored.quantity === incoming.quantity &&
    stored.voltage === incoming.voltage;
  if (same) return "replay";

  const revisable = (REVISABLE_PO_STATUSES as readonly string[]).includes(stored.status);
  if (revisable && stored.notesAreSnapshot) return "revise";
  return "reject";
}
