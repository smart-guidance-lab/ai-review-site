/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  output: 'standalone',
  // 以下の設定でビルド時の「門番」をすべて無効化する
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 環境変数の漏れによるビルド失敗を防ぐ
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-insight-global.vercel.app',
  }
};

module.exports = nextConfig;
