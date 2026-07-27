import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    if (path === "/admin/login") {
      if (role === "ADMIN" || role === "SUPERADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith("/admin")) {
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      if (path.startsWith("/admin/users") && role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }

    if (path.startsWith("/profile/") && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/admin/login") {
          return true;
        }
        if (path.startsWith("/admin")) {
          return Boolean(token);
        }
        if (path.startsWith("/profile")) {
          return true;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
