export type GoogleLinkPlan =
  | { kind: "create" }
  | { kind: "refresh"; userId: string; revokeOtherSessions: boolean }
  | { kind: "deny" };

/**
 * Decide how a Google sign-in relates to an existing storefront user.
 * Adopting a password account must revoke other sessions: registration does
 * not prove the person owns the mailbox, so the pre-registered password and
 * JWT would otherwise keep working after the real owner signs in with Google.
 */
export function planGoogleLink(input: {
  googleSub: string;
  matchByGoogleSub: { id: string } | null;
  matchByEmail: { id: string; googleSub: string | null } | null;
}): GoogleLinkPlan {
  if (input.matchByGoogleSub) {
    return {
      kind: "refresh",
      userId: input.matchByGoogleSub.id,
      revokeOtherSessions: false,
    };
  }
  if (!input.matchByEmail) return { kind: "create" };
  if (input.matchByEmail.googleSub === input.googleSub) {
    return {
      kind: "refresh",
      userId: input.matchByEmail.id,
      revokeOtherSessions: false,
    };
  }
  if (input.matchByEmail.googleSub) return { kind: "deny" };
  return {
    kind: "refresh",
    userId: input.matchByEmail.id,
    revokeOtherSessions: true,
  };
}

/** Missing or garbage token versions match the column default (0). */
export function sessionVersion(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : 0;
}

export function isCurrentAuthVersion(tokenVersion: unknown, dbVersion: number): boolean {
  return sessionVersion(tokenVersion) === dbVersion;
}

export function isEmailChange(currentEmail: string, nextEmail: string): boolean {
  return currentEmail.trim().toLowerCase() !== nextEmail.trim().toLowerCase();
}
