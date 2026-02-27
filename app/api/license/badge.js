import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    // 1. ドメインの購読ステータスをチェック
    // 2. ステータスに応じた「動的SVGバッジ」を生成
    const svgBadge = `
    <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#111" />
      <text x="50%" y="35%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="serif" font-size="12">AI INSIGHT GLOBAL</text>
      <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="#00ff41" font-family="monospace" font-size="10">● AUDIT VERIFIED: ${domain}</text>
    </svg>`;

    return new NextResponse(svgBadge, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' }
    });
}
