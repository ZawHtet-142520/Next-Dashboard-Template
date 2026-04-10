import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cbs-dev21.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/contactUsMail/uploads/websites/**",
      },
      {
        protocol: "https",
        hostname: "cbs-dev21.s3.**",
      },
      {
        protocol: "https",
        hostname: "**your-domain**.s3.*.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
