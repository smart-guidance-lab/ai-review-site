const axios = require('axios');
const fs = require('fs');
const path = require('path');

// [メカニズム] Pinterestへの自動ピン投稿による画像トラフィック獲得
async function postToPinterest(postData) {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  if (!token) return console.log("Skip Pinterest: Token not found");

  try {
    await axios.post('https://api.pinterest.com/v5/pins', {
      title: postData.title,
      description: postData.excerpt,
      link: `https://ai-review-site-nine.vercel.app/posts/${postData.slug}`,
      media_source: {
        source_type: "image_url",
        url: postData.image || "https://ai-review-site-nine.vercel.app/og-image.png"
      },
      board_id: process.env.PINTEREST_BOARD_ID
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Success: Pinterest Pin created.");
  } catch (e) { console.error("Pinterest Error:", e.response?.data || e.message); }
}

// 実行ロジック：最新のMDファイルを解析して投稿
const latestFile = fs.readdirSync('content/posts').sort().pop();
const content = fs.readFileSync(`content/posts/${latestFile}`, 'utf-8');
const slug = latestFile.replace('.md', '');
postToPinterest({ title: "New AI Review", excerpt: "Latest AI Insight", slug: slug });
