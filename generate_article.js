const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle() {
    const tools = ['ChatGPT-5', 'Claude 4', 'Midjourney v7', 'Gemini 2.0 Ultra', 'Copilot Pro', 'Sora', 'Perplexity Pro'];
    const tool = tools[Math.floor(Math.random() * tools.length)];
    
    // AI臭い「太字」や「表」を禁止し、エッセイ形式で書かせるプロンプト
    const prompt = `Write a deep-dive, professional tech analysis for a high-end magazine. 
    Topic: ${tool}. 
    Style Guidelines:
    - NO Markdown tables. NO excessive bolding.
    - Use clear, sophisticated headings (# and ## only).
    - Focus on nuanced perspectives: "The Silver Lining" (Pros) and "The Hidden Friction" (Cons) woven into paragraphs.
    - Write like a human expert: slightly critical, insightful, and forward-looking.
    - Language: British English for a sophisticated tone.`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [{role: "system", content: "You are a senior tech editor at a prestigious global journal. You avoid AI cliches like 'In conclusion' or 'Unlock your potential'."}, {role: "user", content: prompt}],
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
                fs.writeFileSync(path.join(blogDir, `ai-article-${timestamp}.md`), content);
                console.log('Content generated with editorial standards.');
                updateSitemap();
            } catch (e) { console.error('API Error'); }
        });
    });
    req.on('error', (e) => console.error(e));
    req.write(data);
    req.end();
}

function updateSitemap() {
    const baseUrl = 'https://ai-review-site-nine.vercel.app';
    const blogDir = 'content/posts';
    if (!fs.existsSync(blogDir)) return;
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    sitemap += `  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>\n`;
    files.forEach(file => {
        const slug = file.replace('.md', '');
        sitemap += `  <url><loc>${baseUrl}/blog/${slug}</loc><priority>0.8</priority></url>\n`;
    });
    sitemap += '</urlset>';
    fs.writeFileSync('public/sitemap.xml', sitemap);
}
generateArticle();
