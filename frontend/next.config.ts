import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_NGINX_URL:
      process.env.NEXT_PUBLIC_NGINX_URL || "http://localhost:65/",
  },
};

module.exports = {
  images: {
    domains: ['localhost'], // 允许 localhost 作为图片源
    unoptimized: true,      // 可选：关闭优化以加快加载速度（适用于本地测试）
  },
}

export default nextConfig;
