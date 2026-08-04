/** Nama cookie session terpisah agar admin & storefront bisa login bersamaan. */

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ||
  process.env.AUTH_URL?.startsWith("https://") ||
  false;

const prefix = useSecureCookies ? "__Secure-" : "";

export const STOREFRONT_SESSION_COOKIE = `${prefix}mb.storefront-token`;
export const ADMIN_SESSION_COOKIE = `${prefix}mb.admin-token`;

export function authCookieOptions(kind: "storefront" | "admin") {
  const base = kind === "admin" ? "mb.admin" : "mb.storefront";
  return {
    sessionToken: {
      name: `${prefix}${base}-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${prefix}${base}-callback`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${prefix}${base}-csrf`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: useSecureCookies,
      },
    },
  };
}

export const ADMIN_AUTH_BASE_PATH = "/api/admin/auth";
export const STOREFRONT_AUTH_BASE_PATH = "/api/auth";
