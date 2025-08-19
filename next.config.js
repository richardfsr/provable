/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: process.env.BUILD_DIR,
};

module.exports = nextConfig;
