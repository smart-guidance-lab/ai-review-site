import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// ビルド時のエラーを回避するため、実行時にのみ初期化
const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("CRITICAL: RESEND_API_KEY is not defined in environment variables.");
    return null;
  }
  return new Resend(key);
};

export async function POST(req: Request) {
  const resend = getResend();
  if (!resend) return NextResponse.json({ error: "Configuration Error" }, { status: 500 });

  try {
    const payload = await req.json();
    const event = payload.type;

    if (event === 'checkout.session.completed') {
      const session = payload.data.object;
      const customerEmail = session.customer_details.email;

      // 自動サンクスメール & 商品配送
      await resend.emails.send({
        from: 'Intelligence <onboarding@resend.dev>',
        to: customerEmail,
        subject: 'Your Strategic Intelligence Report is Ready',
        html: `<strong>Thank you for your investment.</strong><br/>Your access to the DAO/Core Intelligence is now activated.`
      });
      
      console.log(`Fulfillment completed for: ${customerEmail}`);
      return NextResponse.json({ fulfilled: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
