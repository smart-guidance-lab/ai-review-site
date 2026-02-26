const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle() {
    // トピックの拡充：面制圧のための30項目
    const toolData = [
        { name: 'ChatGPT-5', url: 'https://chatgpt.com', category: 'LLM' },
        { name: 'Claude 3.5 Sonnet', url: 'https://claude.ai', category: 'Writing' },
        { name: 'Midjourney v7', url: 'https://midjourney.com', category: 'Design' },
        { name: 'Perplexity Pages', url: 'https://www.perplexity.ai', category: 'Search' },
        { name: 'Sora', url: 'https://openai.com/sora', category: 'Video' },
        { name: 'Gemini 1.5 Pro', url: 'https://gemini.google.com', category: 'Multimodal' },
        { name: 'Mistral Large', url: 'https://mistral.ai', category: 'OpenSource' },
        { name: 'Groq', url: 'https://groq.com', category: 'Hardware' },
        { name: 'Llama 3', url: 'https://meta.ai', category: 'LLM' },
        { name: 'Sunno AI', url: 'https://suno.com', category: 'Music' }
    ];

    // 論調の多角化：読者を飽きさせないための演出
    const personas = [
        "Skeptical Tech Journalist (Focus on risks and ethics)",
        "Futurist Visionary (Focus on long-term evolution)",
        "Practical Software Engineer (Focus on implementation and ROI)",
        "Academic Researcher (Focus on data and architecture)"
    ];

    const tool = toolData[Math.floor(Math.random() * toolData.length)];
    const persona = personas[Math.floor(Math.random() * personas.length)];
    
    const prompt = `Write a professional deep-dive essay as a ${persona}. 
    Topic: ${tool.name}.
    Style: High-end, sophisticated, strictly no "AI-generated" cliches (no "unlocking potential", "game changer").
    Structure:
    - # Title (Academic and bold)
    - > Summary (One paragraph, deep insight)
    - ## The Silver Lining (Technical advantages)
    - ## The Hidden Friction (Structural flaws or ethics)
    - ## Editorial Verdict (Final rating)
    Important: End with these two tags:
    [TARGET_URL: ${tool.url}]
    [IMG_KEYWORD: ${tool.category}]`;

    const data = JSON.stringify({
        model: "gpt-4o",
        messages: [{role: "system", content: "You are an elite technology critic. Your prose is sharp, analytical, and devoid of common AI tropes."}, {role: "user", content: prompt}],
        max_tokens: 1800
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
                console.log(`Generated: ${tool.name} as ${persona}`);
            } catch (e) { console.error(e); process.exit(1); }
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
