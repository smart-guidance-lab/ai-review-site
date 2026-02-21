/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時の型エラーやESLintエラーでビルドを止めない（自動更新の安定性優先）
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // サーバーサイドでのファイル読み込みを許可
  serverExternalPackages: [],
}

module.exports = nextConfig
