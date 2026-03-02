import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

// 初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any, // 2026年時点の最新安定版
});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text(); // 署名検証には raw body が必須
  const signature = req.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    // 署名検証：これが「究極の防御」
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
  }

  // 成功イベントの処理
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      try {
        await resend.emails.send({
          from: 'Intelligence <onboarding@resend.dev>',
          to: customerEmail,
          subject: '【確定】Strategic Intelligence Report',
          html: `
            <h1>Investment Confirmed.</h1>
            <p>Thank you for your purchase.</p>
            <p><strong>Order ID:</strong> ${session.id}</p>
            <p>Your access to the DAO/Core Intelligence is now fully activated.</p>
          `
        });
        console.log(`✅ Fulfillment Success: ${customerEmail}`);
      } catch (sendErr) {
        console.error("❌ Resend Error:", sendErr);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
