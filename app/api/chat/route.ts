import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message, lang } = await request.json();
        
        // 実際にはあなたのStripe Payment Linkに書き換える
        const REAL_PAYMENT_URL = "https://buy.stripe.com/test_xxxxxxxxxxxx";

        const aiResponse = {
            Japanese: `解析が完了しました。あなたの課題を解決し、AI Insight Globalの共同運営権（DAOトークン）を取得するための最終ステップです。こちらから決済を完了してください。：${REAL_PAYMENT_URL}`,
            English: `Analysis complete. To resolve your challenges and acquire governance tokens for AI Insight Global, complete your payment here: ${REAL_PAYMENT_URL}`
        };

        return NextResponse.json({ reply: aiResponse[lang as keyof typeof aiResponse] || aiResponse.English });
    } catch (error) {
        return NextResponse.json({ message: 'Closing failed' }, { status: 500 });
    }
}
