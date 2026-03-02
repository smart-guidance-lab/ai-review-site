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
    
    // [メカニズム] 購入意欲を最大化する「エリート・オーディター」の文体
    const prompt = `Write an elite technology audit in ${lang}.
    Subject: ${tool.name}.
    Mandate: Analyze with extreme rigor.
    
    Structure:
    - # ${tool.name}: Strategic Audit Report
    - > [Executive Summary] Provide a high-level overview. Mention that the "Core Intelligence" is reserved for premium tiers.
    - ## Market Disruption & Volatility
    - ## Technical Weakness & Risk Assessment
    - ## Verdict: Buy, Hold, or Liquidate?
    
    Important Closing Logic:
    After the Verdict, add this EXACT text:
    "The full data-set, including the 2026 Q3 forecast and private equity implications, is available exclusively to our CORE and ULTIMATE tier members below."
    
    Metadata tags:
    [TARGET_URL: ${tool.url}]
    [IMG_KEYWORD: ${tool.category}]
    [LANG: ${lang}]`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [
            {role: "system", content: "You are a ruthless global technology auditor for a $10B hedge fund."}, 
            {role: "user", content: prompt}
        ],
        max_tokens: 2000
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
                // ファイル名にタイムスタンプを入れ、重複を避ける
                fs.writeFileSync(path.join(blogDir, `report-${Date.now()}.md`), content);
                console.log(`Success: Strategic report for ${tool.name} generated.`);
            } catch (e) { console.error("API Error:", body); }
        });
    });
    req.on('error', (e) => console.error(e));
    req.write(data); req.end();
}

generateArticle('English');
