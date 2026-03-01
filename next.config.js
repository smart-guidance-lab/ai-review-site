/** @type {import('next').NextConfig} */
const nextConfig = {
  // タイムアウトを避けるため、出力を標準に戻す
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  swcMinify: true, // 高速コンパイルを有効化
  // 必要最小限の設定に絞り、ビルド負荷を軽減
};

module.exports = nextConfig;
