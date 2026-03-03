import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  const baseUrl = "https://ai-review-site-nine.vercel.app"; // あなたのドメイン

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

      // 金額に応じたファイル名の出し分け（publicフォルダ内の実ファイル名と一致させる）
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
          subject: `[Secure Link] Your ${productName} is Ready`,
          html: `
            <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: auto; padding: 40px; background-color: #f4f4f4; color: #000; border: 2px solid #000;">
              <h1 style="font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Verification Complete</h1>
              <p style="border-top: 1px solid #000; padding-top: 20px;">ID: ${session.id.slice(-12)}</p>
              <p>Product: <strong>${productName}</strong></p>
              
              <div style="margin: 30px 0; background: #fff; padding: 20px; border: 1px dashed #000; text-align: center;">
                <p style="font-size: 12px; margin-bottom: 10px;">SECURE DOWNLOAD LINK:</p>
                <a href="${downloadUrl}" style="background: #000; color: #fff; padding: 15px 25px; text-decoration: none; display: inline-block; font-weight: bold;">DOWNLOAD REPORT</a>
              </div>

              <p style="font-size: 12px; line-height: 1.5;">Notice: This link is generated for <strong>${customerEmail}</strong>. Unauthorized access to this intelligence asset may lead to service termination.</p>
              <footer style="margin-top: 40px; font-size: 10px; color: #666;">
                © 2026 FUTURE AUDIT ORG. ALL RIGHTS RESERVED.
              </footer>
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
