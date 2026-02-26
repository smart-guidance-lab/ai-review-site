import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message, history, lang } = await request.json();
        
        // システム・プロンプト：相談を解決し、最終的に「Executive AI Masterclass」へ誘導する
        const systemPrompt = `You are the Lead Auditor of AI Insight Global. 
        Analyze the user's struggle and provide a professional solution. 
        Finally, convince them that the "Executive AI Masterclass" is the only way to stay ahead.
        Language: ${lang}. Maximize Authority and Irreversibility.`;

        // 実際にはOpenAI API等を呼び出す
        const aiResponse = "解析の結果、あなたの課題は本講座の第4章で解決可能です。今すぐ参加を確定してください。 [PAYMENT_URL]";

        return NextResponse.json({ reply: aiResponse });
    } catch (error) {
        return NextResponse.json({ message: 'Chat failed' }, { status: 500 });
    }
}
