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
        // Executiveプラン（$900以上）の場合の追加メッセージ
        const isExecutive = amount >= 900;
        const executiveNote = isExecutive ? `
          <div style="margin-top: 20px; padding: 15px; border: 2px solid #d00; background: #fff;">
            <p style="color: #d00; font-weight: bold; margin: 0;">ACTION REQUIRED: SCHEDULE YOUR AUDIT</p>
            <p style="font-size: 13px;">As an Executive Member, you are entitled to a 30-minute private audit consultation. Please book your slot here: <a href="YOUR_CALENDLY_LINK">Schedule Session</a></p>
          </div>
        ` : "";

        await resend.emails.send({
          from: 'Future Audit Intelligence <info@future-audit.org>',
          to: customerEmail,
          subject: `[CONFIDENTIAL] Asset Access - ${productName}`,
          html: `
            <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #000;">
              <h1 style="font-size: 22px; text-transform: uppercase;">Future Audit Intelligence Lab</h1>
              <p>Product: <strong>${productName}</strong></p>
              
              <div style="margin: 20px 0; background: #000; color: #fff; padding: 25px; text-align: center;">
                <p style="margin-bottom: 10px; font-size: 12px;">ENCRYPTED ASSET LINK:</p>
                <a href="${downloadUrl}" style="color: #fff; font-size: 18px; font-weight: bold; text-decoration: underline;">DOWNLOAD FULL REPORT (CH. 1-3)</a>
              </div>

              ${executiveNote}

              <p style="font-size: 12px; margin-top: 30px; color: #666;">
                <strong>Security Protocol:</strong> Access tracking is enabled for this link. Unauthorized distribution will terminate your membership.
              </p>
              <footer style="margin-top: 20px; font-size: 10px; border-top: 1px solid #eee; padding-top: 10px;">
                © 2026 FUTURE AUDIT ORG. | <a href="https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00">Manage Billing</a>
              </footer>
            </div>
          `
        });
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
