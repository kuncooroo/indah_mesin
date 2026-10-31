export type AdminAccessRole = "ADMIN" | "SUPERADMIN";

/**
 * Admin access follows the database row, not the role stored in a JWT.
 * A deleted account has no row. A demotion is the role currently stored.
 */
export function resolveAdminAccess(
  admin: { role?: string | null } | null | undefined
): AdminAccessRole | null {
  if (admin?.role === "SUPERADMIN" || admin?.role === "ADMIN") return admin.role;
  return null;
}
