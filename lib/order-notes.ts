/**
 * Storefront PO submit stores the ordered voltage and buyer snapshot as JSON
 * in Order.notes. The admin editor's catatan field must not replace that blob.
 */

const SNAPSHOT_MARKERS = ["voltage", "requestId"] as const;

export function parsePoSnapshot(
  notes: string | null | undefined
): Record<string, unknown> | null {
  if (!notes) return null;
  try {
    const parsed = JSON.parse(notes) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const obj = parsed as Record<string, unknown>;
    const marked = SNAPSHOT_MARKERS.some((key) => typeof obj[key] === "string" && obj[key] !== "");
    return marked ? obj : null;
  } catch {
    return null;
  }
}

/** Human note shown in the admin editor. Snapshot JSON stays out of the textarea. */
export function orderNoteForEditor(notes: string | null | undefined): string {
  const snapshot = parsePoSnapshot(notes);
  if (!snapshot) return notes ?? "";
  return typeof snapshot.adminNote === "string" ? snapshot.adminNote : "";
}

/**
 * Keep voltage / buyer snapshot when an admin writes a plain catatan.
 * A submitted JSON snapshot (unchanged or intentionally edited) is stored as-is.
 */
export function mergeOrderNotes(
  existing: string | null | undefined,
  submitted: string
): string | null {
  const trimmed = submitted.trim();
  const snapshot = parsePoSnapshot(existing);
  if (!snapshot) return trimmed || null;

  if (existing && trimmed === existing.trim()) return existing;

  if (parsePoSnapshot(trimmed)) return trimmed;

  const next: Record<string, unknown> = { ...snapshot };
  if (trimmed) next.adminNote = trimmed;
  else delete next.adminNote;
  return JSON.stringify(next);
}
