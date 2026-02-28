import { NextResponse } from 'next/server';
import { processFulfillment } from '@/lib/fulfillment-logic';

export async function POST(req: Request) {
  const payload = await req.json();
  const event = payload.type;

  if (event === 'checkout.session.completed') {
    const session = payload.data.object;
    const customerEmail = session.customer_details.email;
    const amountTotal = session.amount_total / 100; // USD

    // 商品の自動発送・メール送信
    await processFulfillment(customerEmail, amountTotal);
    
    return NextResponse.json({ fulfilled: true });
  }

  return NextResponse.json({ received: true });
}
