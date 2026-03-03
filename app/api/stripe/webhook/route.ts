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
          subject: `[ACTION REQUIRED] Access Your Strategic Intelligence - ${session.id.slice(-6)}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #000; border-bottom: 2px solid #000;">INTELLECTUAL ASSET DELIVERY</h1>
              <p>Your transaction has been finalized. Below is the secure link to your intelligence report.</p>
              
              <div style="padding: 20px; background: #f4f4f4; border: 1px solid #ddd; text-align: center;">
                <a href="${downloadUrl}" style="font-size: 18px; color: #d00; font-weight: bold; text-decoration: none;">▶ DOWNLOAD PDF REPORT (2026 Q2 Edition)</a>
              </div>

              <p style="font-size: 13px; margin-top: 30px;"><strong>Strategic Note:</strong> This document contains time-sensitive compliance data. Immediate review is recommended to mitigate Q2 regulatory risks.</p>
              
              <p style="font-size: 11px; color: #888; margin-top: 40px;">
                Disclaimer: This report is for informational purposes only and does not constitute legal or financial advice. 
                Manage your subscription: <a href="https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00">Customer Portal</a>
              </p>
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
