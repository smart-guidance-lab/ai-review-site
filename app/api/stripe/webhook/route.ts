import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  // 1. 環境変数の取得（実行時）
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');

  // 2. ビルド時または設定ミスのガード
  if (!stripeKey || !resendKey || !webhookSecret || !sig) {
    console.error("❌ Critical: Missing Configuration or Signature");
    return NextResponse.json({ error: "Configuration Error" }, { status: 400 });
  }

  try {
    const body = await req.text();
    
    // 3. インスタンスの実行時生成（ビルドエラー回避の核心）
    const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27' as any });
    const resend = new Resend(resendKey);

    // 4. 署名検証
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        // 5. 自動配送
        await resend.emails.send({
          from: 'Intelligence <onboarding@resend.dev>',
          to: customerEmail,
          subject: 'Your Strategic Intelligence Report is Ready',
          html: `<strong>Thank you for your investment.</strong><br/>Your access is now activated.`
        });
        console.log(`✅ Fulfillment success: ${customerEmail}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
