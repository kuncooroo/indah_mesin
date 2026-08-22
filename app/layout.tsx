import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import {
  DEFAULT_DESCRIPTION,
  getSiteUrl,
  INDEX_FOLLOW,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
} from "@/lib/seo";
import "./globals.css";

const siteUrl = getSiteUrl();
const defaultOgImage = absoluteUrl("/icons/icon-512.png");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "mesin industri",
    "Indah Mesin",
    "retort sterilizer",
    "can seamer",
    "food processing equipment",
    "MesinBagus",
    "marketplace mesin",
    "sterilisasi F&B",
  ],
  authors: [{ name: "Indah Mesin" }],
  creator: "Indah Mesin",
  publisher: "Indah Mesin",
  category: "business",
  robots: INDEX_FOLLOW,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Marketplace Mesin Industri`,
    description:
      "Temukan mesin industri, spesifikasi teknis, dan ajukan penawaran resmi via WhatsApp.",
    url: siteUrl,
    images: [
      {
        url: defaultOgImage,
        width: 512,
        height: 512,
        alt: `${SITE_NAME} by Indah Mesin`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Marketplace Mesin Industri`,
    description: "Katalog mesin industri B2B — Indah Mesin, Malang.",
    images: [defaultOgImage],
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1e3a8a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="light h-full" suppressHydrationWarning>
      <head>
        {/* Runtime font loading avoids network access during the production build. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-metallic-bg font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        <AppProviders>
          {children}
          <ServiceWorkerRegister />
        </AppProviders>
      </body>
    </html>
  );
}
