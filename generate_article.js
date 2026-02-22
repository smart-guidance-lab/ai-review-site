const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle() {
    const toolData = [
        { name: 'ChatGPT', url: 'https://chatgpt.com' },
        { name: 'Claude', url: 'https://claude.ai' },
        { name: 'Midjourney', url: 'https://midjourney.com' },
        { name: 'Perplexity', url: 'https://perplexity.ai' },
        { name: 'Sora', url: 'https://openai.com/sora' }
    ];
    const tool = toolData[Math.floor(Math.random() * toolData.length)];
    
    const prompt = `Write a deep-dive analysis for a high-end magazine. Topic: ${tool.name}. 
    Structure:
    - # Title
    - > A 2-sentence sophisticated summary.
    - ## The Silver Lining
    - ## The Hidden Friction
    - ## Editorial Verdict
    Style: Sophisticated British English, NO bolding (**). 
    Important: At the very end, add a single line exactly like this: [TARGET_URL: ${tool.url}]`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [
            {role: "system", content: "Senior tech editor. Provide insights. Ensure the [TARGET_URL: ...] tag is at the bottom."},
            {role: "user", content: prompt}
        ],
        max_tokens: 1500
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
                const timestamp = Date.now();
                const blogDir = path.join(process.cwd(), 'content/posts');
                if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
                fs.writeFileSync(path.join(blogDir, `ai-article-${timestamp}.md`), content);
                updateSitemap();
            } catch (e) { process.exit(1); }
        });
    });
    req.write(data); req.end();
}
// (updateSitemap関数の内容は変更なしのため省略して実装してください)
function updateSitemap() {
    const baseUrl = 'https://ai-review-site-nine.vercel.app';
    const blogDir = 'content/posts';
    if (!fs.existsSync(blogDir)) return;
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    sitemap += `  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>\n`;
    files.forEach(file => { sitemap += `  <url><loc>${baseUrl}/blog/${file.replace('.md', '')}</loc><priority>0.8</priority></url>\n`; });
    sitemap += '</urlset>';
    fs.writeFileSync('public/sitemap.xml', sitemap);
}
generateArticle();
