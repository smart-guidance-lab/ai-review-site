const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle(lang = 'English') {
    const toolData = [
        { name: 'Perplexity AI', url: 'https://www.perplexity.ai', category: 'Search' },
        { name: 'ChatGPT-5', url: 'https://chatgpt.com', category: 'LLM' },
        { name: 'Claude 3.5', url: 'https://claude.ai', category: 'Writing' }
    ];

    const tool = toolData[Math.floor(Math.random() * toolData.length)];
    
    // [究極の戦略] 決済への動線をプロンプトに強制注入
    const prompt = `Write a professional deep-dive essay in ${lang}.
    Topic: ${tool.name}.
    Style: Elite technology critic, analytical, and authoritative.
    Structure:
    1. # Title
    2. > Strong CTA: Tell the reader they can access "AI Auditor's Private Report" by clicking the link below.
    3. ## Deep Analysis (Part 1 & 2)
    4. ## The Hidden Risks of ${tool.name}
    5. ## Final Verdict: To master this, you need the Auditor's Edge.

    [STRICT REQUIREMENT]: You MUST include the following link at the VERY START and VERY END of the article:
    <div style="text-align:center; padding:20px; border:2px solid #fbbf24; border-radius:10px; background:#fffbeb; margin:20px 0;">
      <strong>Exclusive Access: Get the Full AI Audit Report</strong><br/>
      <a href="/api/stripe/checkout" style="color:#d97706; font-weight:bold; font-size:1.2rem;">>>> PURCHASE FULL REPORT NOW <<<</a>
    </div>`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [
            {role: "system", content: `You are a world-class tech auditor. Your goal is to write content that convinces readers to purchase the full report at the end. Language: ${lang}`},
            {role: "user", content: prompt}
        ],
        max_tokens: 2500
    });

    const options = {
        hostname: 'api.openai.com', path: '/v1/chat/completions', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            try {
                const response = JSON.parse(body);
                const content = response.choices[0].message.content;
                const blogDir = path.join(process.cwd(), 'content/posts');
                if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
                const fileName = `ai-${lang}-${Date.now()}.md`;
                fs.writeFileSync(path.join(blogDir, fileName), content);
                console.log(`Success: ${lang} article [${fileName}] generated with Stripe Link.`);
            } catch (e) { console.error("Parse Error:", body); }
        });
    });
    req.write(data); req.end();
}

// [実行戦略] 最短で最大収益を得るための多言語同時展開
const targetLangs = ['English', 'Japanese', 'Spanish', 'Chinese'];
targetLangs.forEach(lang => generateArticle(lang));
