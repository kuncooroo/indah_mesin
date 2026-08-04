import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ADMIN_SESSION_COOKIE, STOREFRONT_SESSION_COOKIE } from "@/lib/auth-cookies";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const secret = process.env.AUTH_SECRET;

  if (path.startsWith("/admin")) {
    const adminToken = await getToken({
      req,
      secret,
      cookieName: ADMIN_SESSION_COOKIE,
    });
    const role = adminToken?.role as string | undefined;

    if (path === "/admin/login") {
      if (role === "ADMIN" || role === "SUPERADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!adminToken || (role !== "ADMIN" && role !== "SUPERADMIN")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (path.startsWith("/admin/users") && role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const publicProfilePaths = [
    "/profile/privacy",
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
