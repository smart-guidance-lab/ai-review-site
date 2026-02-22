const fs = require('fs');
const path = require('path');
const https = require('https');

async function generateArticle() {
    // ツールリストの精査
    const tools = ['ChatGPT', 'Claude', 'Midjourney', 'Gemini', 'Copilot', 'Sora', 'Perplexity'];
    const tool = tools[Math.floor(Math.random() * tools.length)];
    
    const prompt = `Write a deep-dive analysis for a high-end magazine. Topic: ${tool}. 
    Style: Sophisticated British English, NO Markdown tables, NO bolding, NO AI cliches. 
    Focus on "The Silver Lining" and "The Hidden Friction". Use # for Title and ## for Subheadings.`;

    const data = JSON.stringify({
        model: "gpt-4o", // モデル名を最新の安定版に固定
        messages: [
            {role: "system", content: "You are a senior tech editor at a prestigious journal. Write in an editorial, human-like essay style."},
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
            console.log('HTTP Status:', res.statusCode);
            try {
                const response = JSON.parse(body);
                
                // 失敗時の生ログ出力（ここが重要）
                if (response.error) {
                    console.error('API Error Details:', JSON.stringify(response.error, null, 2));
                    throw new Error(`OpenAI Error: ${response.error.message}`);
                }

                if (!response.choices || response.choices.length === 0) {
                    console.error('Raw Response:', body);
                    throw new Error('No choices in response');
                }

                const content = response.choices[0].message.content;
                const timestamp = Date.now();
                
                const blogDir = path.join(process.cwd(), 'content/posts');
                if (!fs.existsSync(blogDir)) {
                    fs.mkdirSync(blogDir, { recursive: true });
                }
                
                fs.writeFileSync(path.join(blogDir, `ai-article-${timestamp}.md`), content);
                console.log('Article successfully written to archives.');
                updateSitemap();
            } catch (e) { 
                console.error('Processing Failed:', e.message);
                process.exit(1);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Connection Failed:', e.message);
        process.exit(1);
    });
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
