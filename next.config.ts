import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/dashboard", destination: "/home", permanent: false },
      { source: "/machines", destination: "/categories", permanent: false },
      { source: "/alarms", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
