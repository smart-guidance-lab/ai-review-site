import { google } from 'googleapis'; // npm install googleapis

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);

const auth = new google.auth.JWT(
  serviceAccount.client_email,
  undefined,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/indexing']
);

export async function notifyGoogle(url: string) {
  const indexing = google.indexing('v3');
  try {
    const res = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });
    console.log(`[GOOGLE INDEXING] Notified: ${url}`, res.data);
  } catch (error) {
    console.error(`[GOOGLE ERROR]`, error);
  }
}
