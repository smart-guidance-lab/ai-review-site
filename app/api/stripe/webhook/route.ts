import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any, // 2026年最新安定版
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text(); // 署名検証には raw body が必須
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) throw new Error('Missing signature or secret');
    // 署名検証：Stripeからの正式なリクエストかを確認
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
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
          subject: 'Your Strategic Intelligence Report is Ready',
          html: `<strong>Thank you for your investment.</strong><br/>Your access to the Intelligence is now activated.`
        });
        console.log(`✅ Fulfillment completed for: ${customerEmail}`);
      } catch (emailErr) {
        console.error("Email Error:", emailErr);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
