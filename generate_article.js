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


// 言語に応じたシステム指示の最適化

const prompt = `Write a high-end strategic audit in ${lang}.
    Topic: ${tool.name}.
    Style: Brutalist, elitist, deeply analytical.
    Structure:
    - # ${tool.name} Strategic Intelligence Report
    - > [EXECUTIVE SUMMARY] Why this matters for your 2026 ROI.
    - ## 1. ARCHITECTURAL DOMINANCE (Technical analysis)
    - ## 2. MARKET DISRUPTION (Competitive impact)
    - ## 3. FATAL FLAWS (Hidden risks)
    - ## FINAL VERDICT: TO INVEST OR TO IGNORE?
    
    Important: The tone must make the reader feel that without the "CORE" or "ULTIMATE" tier intelligence, they are losing money. 
    Use phrases like "The asymmetry of information here is dangerous."
    End with these meta-tags:
    [TARGET_URL: ${tool.url}]
    [IMG_KEYWORD: ${tool.category}]
    [LANG: ${lang}]`;



const data = JSON.stringify({

model: "gpt-4o",

messages: [{role: "system", content: "You are a global tech auditor."}, {role: "user", content: prompt}],

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

fs.writeFileSync(path.join(blogDir, `ai-${lang}-${Date.now()}.md`), content);

console.log(`Success: ${lang} article generated.`);

} catch (e) { console.error(e); }

});

});

req.write(data); req.end();

}



// 実行例: generateArticle('Chinese'); generateArticle('Spanish'); generateArticle('English');

generateArticle('English'); import fs from 'fs';
