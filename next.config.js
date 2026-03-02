/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // swcMinifyはNext.js 15ではデフォルトで有効であり、設定項目から削除（警告の原因）
};

module.exports = nextConfig;
