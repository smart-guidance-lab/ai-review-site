import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  // 【重要】独自ドメインに修正
  const baseUrl = "https://future-audit.org"; 

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

      let downloadUrl = "";
      let productName = "";

      if (amount >= 900) {
        productName = "Executive DAO Sovereign";
        downloadUrl = `${baseUrl}/dao-onboarding-8k2z.pdf`;
      } else if (amount >= 200) {
        productName = "Strategic Intelligence MRR";
        downloadUrl = `${baseUrl}/strategic-brief-q9v1.pdf`;
      } else {
        productName = "Intelligence Snapshot";
        downloadUrl = `${baseUrl}/snapshot-report-x3j5.pdf`;
      }

      if (customerEmail) {
        await resend.emails.send({
          from: 'Future Audit Intelligence <info@future-audit.org>',
          to: customerEmail,
          subject: `[Confidential] Your ${productName} Access`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee;">
              <h2 style="color: #333;">Verification Successful.</h2>
              <p>Your acquisition of <strong>${productName}</strong> is confirmed.</p>
              <div style="margin: 20px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000;">
                <p style="margin: 0; font-size: 14px;">SECURE ACCESS LINK:</p>
                <a href="${downloadUrl}" style="font-weight: bold; color: #000;">Download Strategic Intelligence Report (PDF)</a>
              </div>
              <p style="font-size: 12px; color: #666;">Manage your billing via our <a href="https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00">Secure Portal</a>.</p>
            </div>
          `
        });
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
