import type { Metadata } from "next";

export const SITE_NAME = "MesinBagus";
export const SITE_TAGLINE = "Marketplace Mesin Industri | Indah Mesin";
export const DEFAULT_DESCRIPTION =
  "MesinBagus by Indah Mesin — katalog mesin industri F&B, sterilisasi, penutup kaleng, seal kemasan. Request quotation & PO via WhatsApp.";

/** Absolute site origin without trailing slash. */
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const NO_INDEX: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false, noimageindex: true },
};

export const INDEX_FOLLOW: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
};

/** Shared page metadata: title, description, canonical, Open Graph, Twitter. */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  noIndex = false,
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl("/icons/icon-512.png");
  const fullTitle = title.includes(SITE_NAME) ? title : title;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: path.startsWith("http") ? path : path },
    robots: noIndex ? NO_INDEX : INDEX_FOLLOW,
    openGraph: {
      type,
      locale: "id_ID",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      images: [{ url: ogImage, alt: imageAlt ?? fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
