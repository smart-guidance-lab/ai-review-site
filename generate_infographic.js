const fs = require('fs');
const path = require('path');
const OpenAI = require('openai'); // OpenAI SDKをインストール: npm install openai

// OpenAI APIキーを環境変数に設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateInfographic(articleTitle, articleSummary, articleSlug) {
    const prompt = `Create a professional, data-driven infographic for an executive audience.
    Topic: "${articleTitle}".
    Key takeaway: "${articleSummary}".
    Style: Minimalist, clean, modern, high-contrast, suitable for a financial news publication like The Wall Street Journal but with a futuristic AI theme. Use a dark background with bright, impactful text and subtle data visualizations. Incorporate a small, authoritative "AI Insight Global" logo at the bottom right.`;

    try {
        const response = await openai.images.generate({
            model: "dall-e-3", // DALL-E 3を使用
            prompt: prompt,
            n: 1,
            size: "1024x1024", // Instagramに最適なサイズ
            response_format: "url" // URL形式で画像を取得
        });

        const imageUrl = response.data[0].url;
        const imagePath = path.join(process.cwd(), 'public/infographics', `${articleSlug}.png`);
        
        // 画像をダウンロードして保存（実際にはストリーム処理が望ましい）
        const https = require('https');
        https.get(imageUrl, (imgRes) => {
            const fileStream = fs.createWriteStream(imagePath);
            imgRes.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Infographic generated and saved: /infographics/${articleSlug}.png`);
            });
        });

        return `/infographics/${articleSlug}.png`;
    } catch (error) {
        console.error("Error generating infographic:", error);
        return null;
    }
}

// 実行例: 
// const sampleTitle = "The AI Supremacy Paradox: How LLMs Redefine Global Power";
// const sampleSummary = "Advanced Language Models are creating a new form of digital sovereignty, challenging traditional economic structures.";
// generateInfographic(sampleTitle, sampleSummary, "ai-supremacy-paradox");
