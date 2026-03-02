const { google } = require('googleapis');
const fs = require('fs');

async function notifyGoogle() {
  const latestFile = fs.readdirSync('content/posts').sort().pop();
  const slug = latestFile.replace('.md', '');
  const url = `https://ai-review-site-nine.vercel.app/posts/${slug}`;

  // GitHub Secretsからサービスアカウント情報を読み込む
  const key = JSON.parse(process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT);
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );

  try {
    await jwtClient.authorize();
    const res = await google.indexing('v3').urlNotifications.publish({
      auth: jwtClient,
      requestBody: { url: url, type: 'URL_UPDATED' }
    });
    console.log(`Success: Google notified for ${url}`);
  } catch (e) { console.error("Google Indexing Error:", e.message); }
}

notifyGoogle();
