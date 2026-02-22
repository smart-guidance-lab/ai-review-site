const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle() {
    const tools = ['ChatGPT', 'Claude 4', 'Midjourney', 'Gemini', 'Perplexity', 'Sora'];
    const tool = tools[Math.floor(Math.random() * tools.length)];
    
    // プロンプトをさらに洗練させ、メタデータを含ませる
    const prompt = `Write a deep-dive, professional tech analysis for a high-end magazine. 
    Topic: ${tool}. 
    Structure:
    - # Title
    - > A 2-sentence sophisticated summary (Description).
    - ## The Silver Lining (Focus on elite advantages)
    - ## The Hidden Friction (Focus on professional pain points)
    - ## Editorial Verdict (Final recommendation)
    Style: Sophisticated British English, NO Markdown tables, NO bolding (**). Use rich vocabulary.`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [
            {role: "system", content: "You are a senior tech editor at a prestigious journal. Your goal is to write a critical yet insightful essay. End the article with a subtle call to action for the official tool website."},
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
                if (response.error) throw new Error(response.error.message);
                const content = response.choices[0].message.content;
                const timestamp = Date.now();
                const blogDir = path.join(process.cwd(), 'content/posts');
                if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
                fs.writeFileSync(path.join(blogDir, `ai-article-${timestamp}.md`), content);
                console.log('Dispatch recorded.');
                updateSitemap();
            } catch (e) { console.error('Error:', e.message); process.exit(1); }
        });
    });
    req.write(data); req.end();
}

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
