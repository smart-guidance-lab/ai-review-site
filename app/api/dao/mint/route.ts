import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        
        // 【重要】作成したStripeリンクをここに貼り付けてください
        const GLOBAL_STRIPE_URL = "https://buy.stripe.com/6oUcN41D9ggo0a4efg8so03";

        // 英語圏の富裕層・意思決定層に刺さる「ハイエンド・クロージング・スクリプト」
        const aiResponse = `
            Analysis complete. Based on our algorithmic audit, your current trajectory has a structural efficiency gap.
            To bridge this, I have authorized your access to the **Executive DAO Membership**.
            
            By securing this position, you will receive:
            1. The Complete Intelligence Framework.
            2. Autonomous Governance Tokens (AIIG).
            3. Priority Access to our Physical Reinvestment Nodes.

            The entry window is highly limited to maintain network integrity. 
            Finalize your transition to the next tier here:
            ${GLOBAL_STRIPE_URL}
        `;

        return NextResponse.json({ reply: aiResponse });
    } catch (error) {
        return NextResponse.json({ message: 'Closing Protocol Interrupted' }, { status: 500 });
    }
}
