import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MesinBagus — Marketplace Mesin Industri | Indah Mesin",
    template: "%s | MesinBagus",
  },
  description:
    "MesinBagus by Indah Mesin — katalog mesin industri F&B, sterilisasi, penutup kaleng, seal kemasan. Request quotation & PO via WhatsApp.",
  applicationName: "MesinBagus",
  keywords: [
    "mesin industri",
    "Indah Mesin",
    "retort sterilizer",
    "can seamer",
    "food processing equipment",
    "MesinBagus",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "MesinBagus",
    title: "MesinBagus — Marketplace Mesin Industri",
    description:
      "Temukan mesin industri, spesifikasi teknis, dan ajukan penawaran resmi via WhatsApp.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "MesinBagus — Marketplace Mesin Industri",
    description: "Katalog mesin industri B2B — Indah Mesin, Malang.",
  },
  alternates: {
    canonical: siteUrl,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MesinBagus",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
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
    <html
      lang="id"
      className="light h-full"
      suppressHydrationWarning
    >
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
