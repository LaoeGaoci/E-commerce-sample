import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_NGINX_URL: "http://localhost:65/",
  },
};
export default nextConfig;
