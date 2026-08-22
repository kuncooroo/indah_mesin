import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const base = getSiteUrl();

/**
 * Crawl public catalog & marketing pages.
 * Private account, PO, admin, and API paths are disallowed.
 * `/profile` (login) and `/profile/privacy` rely on page robots metadata —
 * do not Disallow `/profile` as a prefix (that would also block privacy).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/po-preview",
          "/po-preview/",
          "/favorites",
          "/favorites/",
          "/profile/settings",
          "/profile/business",
          "/profile/orders",
          "/profile/docs",
          "/profile/help",
          "/profile/forgot-password",
          "/profile/reset-password",
          "/profile/invite",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
