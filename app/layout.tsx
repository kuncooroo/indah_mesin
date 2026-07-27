import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IndustrialX — Marketplace Mesin Industri | Indah Mesin",
    template: "%s | IndustrialX",
  },
  description:
    "IndustrialX by Indah Mesin — katalog mesin industri F&B, sterilisasi, penutup kaleng, seal kemasan. Request quotation & PO via WhatsApp.",
  applicationName: "IndustrialX",
  keywords: [
    "mesin industri",
    "Indah Mesin",
    "retort sterilizer",
    "can seamer",
    "food processing equipment",
    "IndustrialX",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "IndustrialX",
    title: "IndustrialX — Marketplace Mesin Industri",
    description:
      "Temukan mesin industri, spesifikasi teknis, dan ajukan penawaran resmi via WhatsApp.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "IndustrialX — Marketplace Mesin Industri",
    description: "Katalog mesin industri B2B — Indah Mesin, Malang.",
  },
  alternates: {
    canonical: siteUrl,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IndustrialX",
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
      className={`${ibmPlexSans.variable} ${jetbrainsMono.variable} light h-full`}
      suppressHydrationWarning
    >
      <head>
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
