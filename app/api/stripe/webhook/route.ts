import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY; // ここに sk_live が入る
  const resendKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  
  // ドメイン浸透までの安全策
  const baseUrl = "https://ai-review-site-nine.vercel.app"; 

  if (!stripeKey || !resendKey || !webhookSecret || !sig) {
    console.error("❌ ERROR: Missing Env Vars");
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
        downloadUrl = `${baseUrl}/dao.pdf`;
      } else if (amount >= 200) {
        productName = "Strategic Intelligence MRR";
        downloadUrl = `${baseUrl}/brief.pdf`;
      } else {
        productName = "Intelligence Snapshot";
        downloadUrl = `${baseUrl}/snapshot.pdf`;
      }

      if (customerEmail) {
        const { data, error } = await resend.emails.send({
          from: 'Future Audit Intelligence <info@future-audit.org>',
          to: customerEmail,
          subject: `[CONFIDENTIAL] Access Granted: ${productName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #000; background: #fff;">
              <h1 style="font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">ORDER VERIFIED</h1>
              <p>Product: <strong>${productName}</strong></p>
              <div style="margin: 30px 0; background: #000; padding: 25px; text-align: center;">
                <a href="${downloadUrl}" style="color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; border: 1px solid #fff; padding: 10px 20px;">▶ DOWNLOAD PDF REPORT</a>
              </div>
              <p style="font-size: 11px; color: #888;">© 2026 AI INSIGHT GLOBAL. Link expires in 48h.</p>
            </div>
          `
        });
        
        if (error) console.error("❌ Resend Error:", error);
        else console.log(`✅ Success: Email sent to ${customerEmail}`);
      }
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
