/** @type {import('next').NextConfig} */

// Base path para GitHub Pages (project site é servido em /<repo>).
// Em domínio próprio ou local, deixe vazio.
const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
