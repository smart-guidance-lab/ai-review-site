import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');

  if (!stripeKey || !resendKey || !webhookSecret || !sig) {
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
        await resend.emails.send({
          // 【重要】onboarding@resend.dev から 独自ドメイン info@future-audit.org へ変更
          from: 'Future Audit <info@future-audit.org>', 
          to: customerEmail,
          subject: 'Your Strategic Intelligence Report is Ready',
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #333;">Investment Confirmed.</h2>
              <p>Thank you for choosing <strong>Future Audit</strong>.</p>
              <p>Your strategic intelligence report is now fully activated and attached to your profile.</p>
              <hr/>
              <p style="font-size: 12px; color: #666;">© 2026 Future Audit Intelligence Lab</p>
            </div>
          `
        });
        console.log(`✅ Fully-Automated Delivery to: ${customerEmail}`);
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
