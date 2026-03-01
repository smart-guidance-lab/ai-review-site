import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://your-domain.vercel.app"; // あなたの本番ドメインに置換

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Insight Global | Autonomous Strategic Intelligence",
    template: "%s | AI Insight Global",
  },
  description: "Global standard for AI-driven strategic audits and risk assessment. Institutional grade intelligence delivered autonomously.",
  openGraph: {
    title: "AI Insight Global",
    description: "Decentralized Intelligence & Autonomous Strategic Audits.",
    url: SITE_URL,
    siteName: "AI Insight Global",
    images: [
      {
        url: "/ogp.png", // public/ogp.png を参照
        width: 1200,
        height: 630,
        alt: "AI Insight Global Intelligence Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Insight Global",
    description: "Autonomous intelligence for the new capital era.",
    images: ["/ogp.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD 構造化データ：Googleに「組織」として認識させる */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AI Insight Global",
              "url": SITE_URL,
              "logo": `${SITE_URL}/favicon.ico`,
              "description": "Autonomous AI Auditing and Strategic Intelligence Agency.",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
