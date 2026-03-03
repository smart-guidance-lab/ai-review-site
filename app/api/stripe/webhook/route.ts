import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  const portalUrl = "https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00";

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

      // 金額に応じてコンテンツを出し分ける
      let contentLink = "https://future-audit.org/sample.pdf"; // 共通サンプル
      let productName = "Intelligence Snapshot";

      if (amount >= 900) {
        productName = "Executive DAO Sovereign";
        contentLink = "https://calendly.com/your-link"; // 1on1予約リンク等
      } else if (amount >= 200) {
        productName = "Strategic Intelligence MRR";
        contentLink = "https://future-audit.org/member-portal"; // 会員ページ等
      }

      if (customerEmail) {
        await resend.emails.send({
          from: 'Future Audit Intelligence <info@future-audit.org>',
          to: customerEmail,
          subject: `[Confidential] ${productName} - Delivery`,
          html: `
            <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #000; color: #000;">
              <h1 style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">FUTURE AUDIT: SUCCESSFUL ACQUISITION</h1>
              <p>Your investment in <strong>${productName}</strong> has been verified.</p>
              
              <div style="background: #000; color: #fff; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;">ACCESS YOUR ASSET:</p>
                <a href="${contentLink}" style="color: #fff; text-decoration: underline; font-weight: bold; font-size: 18px;">Click Here to Access Intelligence</a>
              </div>

              <p style="font-size: 14px;"><strong>Next Steps:</strong></p>
              <ul style="font-size: 13px;">
                <li>Review the encrypted intelligence brief.</li>
                <li>Manage your account and billing via the <a href="${portalUrl}">Secure Portal</a>.</li>
              </ul>
              <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;"/>
              <p style="font-size: 11px; color: #666;">This communication contains proprietary information. Unauthorized distribution is prohibited.</p>
            </div>
          `
        });
        console.log(`✅ Automated Fulfillment: ${customerEmail} for ${productName}`);
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
