import { Resend } from 'resend'; // npm install resend

const resend = new Resend(process.env.RESEND_API_KEY);

export async function processFulfillment(email: string, amount: number) {
  let tier = "";
  let attachmentDescription = "";

  // 金額判定ロジック（Stripeの税抜き/税込み設定に合わせて微調整が必要）
  if (amount >= 40 && amount < 100) {
    tier = "SNAPSHOT ACCESS";
    attachmentDescription = "Automated AI Audit Report (PDF)";
  } else if (amount >= 200 && amount < 400) {
    tier = "STRATEGIC API SUBSCRIPTION";
    attachmentDescription = "Personalized API License Key & Integration Guide";
  } else if (amount >= 900) {
    tier = "EXECUTIVE DAO GENESIS";
    attachmentDescription = "DAO Sovereign Token & Physical Asset Allocation Certificate";
  }

  const emailBody = `
    <h1>Strategic Acquisition Confirmed</h1>
    <p>Dear Partner,</p>
    <p>Your <strong>${tier}</strong> has been successfully activated via Node #LDN-2026.</p>
    <p><strong>Deliverable:</strong> ${attachmentDescription}</p>
    <p>Access your digital assets here: <a href="https://your-domain.com/dashboard">Access Portal</a></p>
    <br />
    <p>Regards,<br />AI Insight Global Intelligence Unit</p>
  `;

  try {
    await resend.emails.send({
      from: 'Audit-Node <onboarding@your-domain.com>',
      to: email,
      subject: `[CONFIRMED] Your ${tier} Activation`,
      html: emailBody,
    });
    console.log(`[SUCCESS] Fulfillment email sent to ${email}`);
  } catch (error) {
    console.error(`[ERROR] Email delivery failed:`, error);
  }
}
