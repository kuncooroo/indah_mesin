import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { resolveAdminAccess, type AdminAccessRole } from "@/lib/admin-access";
import { ADMIN_SESSION_COOKIE, STOREFRONT_SESSION_COOKIE } from "@/lib/auth-cookies";

async function liveAdminRole(token: { sub?: string } | null): Promise<AdminAccessRole | null> {
  const adminId = token?.sub;
  if (!adminId) return null;
  try {
    const { prisma } = await import("@/lib/prisma");
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { role: true },
    });
    return resolveAdminAccess(admin);
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const secret = process.env.AUTH_SECRET;

  if (path.startsWith("/admin")) {
    const adminToken = await getToken({
      req,
      secret,
      cookieName: ADMIN_SESSION_COOKIE,
    });
    const role = await liveAdminRole(adminToken);

    if (path === "/admin/login") {
      if (role) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!role) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (path.startsWith("/admin/users") && role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const publicProfilePaths = [
    "/profile/privacy",
    "/profile/terms",
    "/profile/forgot-password",
    "/profile/reset-password",
    "/profile/invite",
  ];
  if (path.startsWith("/profile/") && !publicProfilePaths.includes(path)) {
    const storefrontToken = await getToken({
      req,
      secret,
      cookieName: STOREFRONT_SESSION_COOKIE,
    });
    if (!storefrontToken) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
