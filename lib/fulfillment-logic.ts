// lib/fulfillment-logic.ts (完全版)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function processFulfillment(email: string, amount: number) {
  const tierConfig: Record<number, { name: string; file: string }> = {
    4700: { name: "SNAPSHOT ACCESS", file: "Audit_Report_v1.pdf" },
    29700: { name: "STRATEGIC API", file: "API_License_Key.txt" },
    98000: { name: "EXECUTIVE DAO", file: "DAO_Genesis_Certificate.pdf" },
  };

  const currentTier = tierConfig[amount] || { name: "GENERAL ACCESS", file: "Welcome.pdf" };

  try {
    await resend.emails.send({
      from: 'AI Insight Global <onboarding@your-domain.com>',
      to: email,
      subject: `[ACTION REQUIRED] Your ${currentTier.name} is Ready`,
      html: `
        <div style="font-family: serif; color: #111;">
          <h1>Intelligence Acquisition Confirmed</h1>
          <p>Your transaction for <strong>${currentTier.name}</strong> has been verified by Node #LDN-2026.</p>
          <p>Digital Asset: <strong>${currentTier.file}</strong></p>
          <hr />
          <p>This is an autonomous delivery. No human intervention was required.</p>
        </div>
      `
    });
    console.log(`[FULFILLMENT SUCCESS] Email sent to ${email}`);
  } catch (error) {
    console.error(`[FULFILLMENT ERROR]`, error);
  }
}
