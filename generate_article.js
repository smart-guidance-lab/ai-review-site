const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle() {
    const tools = ['ChatGPT-5', 'Claude 4', 'Midjourney v7', 'Gemini 2.0 Ultra', 'Sora', 'Perplexity Pro'];
    const tool = tools[Math.floor(Math.random() * tools.length)];
    // プロンプトを強化し、Markdownの記号を明示的に制御する
    const prompt = `Write a professional AI tool review for ${tool}. 
    Structure:
    # [Tool Name]: [Power Catchphrase]
    ## Introduction
    (Paragraph)
    ## Key Features
    (Bullet points starting with -)
    ## Pros and Cons
    ▲ PROS: (Point 1)
    ▲ PROS: (Point 2)
    ▼ CONS: (Point 1)
    ▼ CONS: (Point 2)
    ## Verdict
    (Final Summary)`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [{role: "user", content: prompt}],
        max_tokens: 1200
    });

    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            try {
                const response = JSON.parse(body);
                const content = response.choices[0].message.content;
                const timestamp = Date.now();
                const blogDir = path.join(process.cwd(), 'content/posts');
                if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
                // ファイル名の整理（スペースをハイフンに）
                const safeToolName = tool.toLowerCase().replace(/\s+/g, '-');
                fs.writeFileSync(path.join(blogDir, `${safeToolName}-${timestamp}.md`), content);
                console.log('Successfully generated content.');
            } catch (e) { console.error('API Error'); }
        });
    });
    req.write(data);
    req.end();
}
generateArticle();
