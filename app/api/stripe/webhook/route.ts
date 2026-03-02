import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');

  if (!stripeKey || !resendKey || !webhookSecret || !sig) {
    console.error("❌ Critical: Missing Configuration or Signature");
    return NextResponse.json({ error: "Configuration Error" }, { status: 400 });
  }

  try {
    const body = await req.text();
    const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27' as any });
    const resend = new Resend(resendKey);

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        // [修正箇所] from を独自ドメインに変更。本文に具体的価値を追加。
        await resend.emails.send({
          from: 'Future Audit Intelligence <report@future-audit.org>',
          to: customerEmail,
          subject: 'Your Strategic Intelligence Report: Access Granted',
          html: `
            <h1>Thank you for your investment.</h1>
            <p>Your strategic report from <strong>future-audit.org</strong> is now available.</p>
            <p>Please access your intelligence dashboard here: [Your_Dynamic_Link_Or_Content]</p>
            <hr/>
            <p><small>Future Audit Intelligence: Navigating the AI Frontier.</small></p>
          `
        });
        console.log(`✅ Professional fulfillment success: ${customerEmail}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
