const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle() {
    const tools = ['OpenAI Sora', 'Claude 3.5 Opus', 'Midjourney v6.1', 'Sunno AI v4', 'Perplexity Pages', 'Kling AI'];
    const tool = tools[Math.floor(Math.random() * tools.length)];
    
    // テーブル、箇条書き、太字を物理的に禁止し、高級誌の「コラム」を書かせる
    const prompt = `Write a sophisticated tech critique on "${tool}".
    STRICT RULES:
    - DO NOT use Markdown tables (e.g., |---|).
    - DO NOT use bullet points or lists.
    - DO NOT use bolding (**word**).
    - Use ONLY # for the main title and ## for subheadings.
    - Write in the style of a long-form essay for The New Yorker or The Economist.
    - Structure: A captivating hook, an analytical body exploring paradoxes, and a visionary finale.
    - Vocabulary: Academic, slightly cynical, yet deeply insightful.`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [
            {role: "system", content: "You are an elite technology critic. You hate AI cliches. You never use tables or lists. You speak in fluid, rhythmic prose."},
            {role: "user", content: prompt}
        ],
        max_tokens: 1500
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
                // 万が一テーブル記号が混入した場合の「強制抹殺フィルター」
                const cleanedContent = content.replace(/\|/g, '').replace(/\*\*+/g, '');
                
                const timestamp = Date.now();
                const blogDir = path.join(process.cwd(), 'content/posts');
                if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
                fs.writeFileSync(path.join(blogDir, `ai-article-${timestamp}.md`), cleanedContent);
                console.log('Pure editorial content generated.');
                updateSitemap();
            } catch (e) { console.error('Processing error'); }
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
