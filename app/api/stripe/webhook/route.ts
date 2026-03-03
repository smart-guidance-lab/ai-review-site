import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  const baseUrl = "https://future-audit.org"; 

  if (!stripeKey || !resendKey || !webhookSecret || !sig) {
    console.error("❌ Configuration missing");
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

      // 金額ロジック
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
          subject: `[ACTION REQUIRED] Access Your Strategic Intelligence - ${session.id.slice(-6)}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #000;">
              <h1 style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">INTELLECTUAL ASSET DELIVERY</h1>
              <p>Your transaction has been verified. Product: <strong>${productName}</strong></p>
              
              <div style="padding: 25px; background: #000; color: #fff; text-align: center; margin: 20px 0;">
                <a href="${downloadUrl}" style="font-size: 18px; color: #fff; font-weight: bold; text-decoration: none;">▶ DOWNLOAD PDF REPORT (2026 Q2 Edition)</a>
              </div>

              <p style="font-size: 13px;"><strong>Note:</strong> Access will expire in 48 hours for security reasons. Please save your local copy immediately.</p>
              
              <p style="font-size: 11px; color: #888; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px;">
                © 2026 FUTURE AUDIT ORG. All rights reserved. <br/>
                Manage billing: <a href="https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00">Customer Portal</a>
              </p>
            </div>
          `
        });
        console.log(`✅ Automated Fulfillment for ${customerEmail}`);
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
