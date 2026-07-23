import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Indah Mesin — Marketplace Industri",
    short_name: "Indah Mesin",
    description:
      "PWA Marketplace mesin industri B2B — pemesanan via WhatsApp",
    start_url: "/home",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf8ff",
    theme_color: "#1e3a8a",
    categories: ["business", "shopping"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
