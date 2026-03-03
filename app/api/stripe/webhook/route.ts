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

      // 金額に応じたファイルの出し分け（これらがpublicにあることを確認してください）
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
          subject: `[CONFIDENTIAL] Access Granted: ${productName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #000; background: #fff;">
              <h1 style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">ORDER VERIFICATION SUCCESSFUL</h1>
              <p>Product: <strong>${productName}</strong></p>
              <p>Thank you for your investment. Your strategic intelligence assets are now ready for download.</p>
              
              <div style="margin: 20px 0; background: #000; padding: 25px; text-align: center;">
                <a href="${downloadUrl}" style="color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; border: 1px solid #fff; padding: 10px 20px;">▶ DOWNLOAD SECURE PDF</a>
              </div>

              <p style="font-size: 12px; color: #666; margin-top: 30px;">
                Note: This link is unique to <strong>${customerEmail}</strong>. Unauthorized distribution will lead to immediate account termination.
                <br/><br/>
                Need help? Contact: info@future-audit.org
              </p>
              <footer style="margin-top: 20px; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
                © 2026 FUTURE AUDIT ORG. | <a href="https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00">Customer Portal</a>
              </footer>
            </div>
          `
        });
        console.log(`✅ Automated Fulfillment to: ${customerEmail}`);
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
