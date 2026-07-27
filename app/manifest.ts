import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Indah Mesin — Industrial Marketplace",
    short_name: "Indah Mesin",
    description:
      "B2B industrial machinery marketplace with WhatsApp ordering",
    start_url: "/beranda-artikel",
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
