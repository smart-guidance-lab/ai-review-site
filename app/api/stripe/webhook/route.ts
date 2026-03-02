import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

// 実行時のみStripeを初期化するヘルパー
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is missing");
  return new Stripe(key, { apiVersion: '2025-01-27' as any });
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (!sig || !webhookSecret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        await resend.emails.send({
          from: 'Intelligence <onboarding@resend.dev>',
          to: customerEmail,
          subject: 'Your Strategic Intelligence Report is Ready',
          html: `<strong>Thank you for your investment.</strong><br/>Your access is now activated.`
        });
        console.log(`✅ Fulfillment completed for: ${customerEmail}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
