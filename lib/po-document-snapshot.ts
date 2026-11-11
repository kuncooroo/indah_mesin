/**
 * Tax IDs printed on a submitted PO. The submit path stores them in the
 * order notes snapshot; later company-profile edits must not rewrite the
 * document.
 */
export function poTaxIdsFromNotes(
  notes: string | null | undefined,
  current: { npwpNumber?: string | null; nibNumber?: string | null }
): { npwpNumber: string; nibNumber: string } {
  const snapshot = readSnapshot(notes);
  return {
    npwpNumber: preferFrozen(snapshot.npwpNumber, current.npwpNumber),
    nibNumber: preferFrozen(snapshot.nibNumber, current.nibNumber),
  };
}

function preferFrozen(frozen: unknown, current: string | null | undefined): string {
  if (typeof frozen === "string" && frozen.trim()) return frozen.trim();
  return (current ?? "").trim();
}

function readSnapshot(notes: string | null | undefined): {
  npwpNumber?: unknown;
  nibNumber?: unknown;
} {
  if (!notes) return {};
  try {
    const parsed = JSON.parse(notes) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as { npwpNumber?: unknown; nibNumber?: unknown };
  } catch {
    return {};
  }
}
