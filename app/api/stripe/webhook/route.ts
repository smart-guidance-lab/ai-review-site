import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  const portalUrl = "https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00"; // ここを差し替え

  if (!stripeKey || !resendKey || !webhookSecret || !sig) {
    return NextResponse.json({ error: "Config Error" }, { status: 400 });
  }

  try {
    const body = await req.text();
    const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27' as any });
    const resend = new Resend(resendKey);
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      if (customerEmail) {
        await resend.emails.send({
          from: 'Future Audit <info@future-audit.org>',
          to: customerEmail,
          subject: `Order Confirmed: ${session.id.slice(-8)}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #1a1a1a;">Investment Successfully Processed.</h2>
              <p>Amount: <strong>$${amount}</strong></p>
              <p>Your strategic intelligence assets have been activated.</p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;"><strong>Management & Billing:</strong></p>
                <p style="margin: 5px 0 0; font-size: 13px;">Manage your subscription or download invoices via our <a href="${portalUrl}">Secure Portal</a>.</p>
              </div>
              <p style="font-size: 12px; color: #999;">Future Audit Intelligence Lab | intelligence@future-audit.org</p>
            </div>
          `
        });
        console.log(`✅ Fulfillment executed: ${customerEmail} ($${amount})`);
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
