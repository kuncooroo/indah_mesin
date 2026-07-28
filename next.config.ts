import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/login", destination: "/beranda-artikel", permanent: false },
      { source: "/home", destination: "/beranda-artikel", permanent: false },
      { source: "/products/retort-sterilizer", destination: "/products/fdp-rtr-500", permanent: false },
      { source: "/products/vmc-850", destination: "/products/cnc850", permanent: false },
      { source: "/products/alf-5000", destination: "/products/pk-alf5k", permanent: false },
      { source: "/products/genset-500", destination: "/products/pw-g500s", permanent: false },
    ];
  },
};

export default nextConfig;
