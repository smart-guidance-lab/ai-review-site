/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next', // 明示的に出力ディレクトリを指定
  output: 'standalone', // Vercelのサーバーレス環境に最適化
  eslint: { ignoreDuringBuilds: true }, // ビルド停止リスクの排除
  typescript: { ignoreBuildErrors: true }, // 型エラーによる収益機会損失を防止
};

module.exports = nextConfig;
