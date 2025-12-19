import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // ✅ iba lokálne – aby si mohol proxy na FastAPI/localhost
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:8000/api/:path*",
        },
      ];
    }

    // ✅ na Verceli nech Next obslúži app/api routes normálne
    return [];
  },
};

export default nextConfig;
